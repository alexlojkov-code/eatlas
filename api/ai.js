/* /api/ai — ИИ через общий ключ сервиса (Gemini API, Interactions).
   Ключ лежит только в переменной окружения GEMINI_API_KEY на Vercel и никогда не попадает в браузер.
   GET  — включён ли общий ИИ и сколько запросов осталось сегодня.
   POST — запрос к Gemini: принимаются только нужные приложению поля, модель из белого списка,
          ограничение размера; поток (SSE) передаётся как есть.
   Лимиты в сутки (UTC): вошедший пользователь, гость (по IP, хранится только хэш), и общий потолок,
   чтобы не выйти за бюджет. Значения можно поменять переменными окружения. */
import { createHash } from 'node:crypto';
import { route, body, db, send, problem, currentSession, clientIp, takeDaily as take } from './_lib/server.js';

const GEMINI_URL = process.env.GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/interactions'; // GEMINI_URL — только для локальных тестов
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-4-argon']; // и порядок перебора при перегрузке
const LEVELS = ['minimal', 'low', 'medium', 'high'];
const LIMIT_USER = Number(process.env.AI_DAILY_LIMIT_USER || 50);
const LIMIT_GUEST = Number(process.env.AI_DAILY_LIMIT_GUEST || 15);
const LIMIT_TOTAL = Number(process.env.AI_DAILY_LIMIT_TOTAL || 1500);
const MAX_TEXT = 40000, MAX_IMAGES = 4, MAX_IMAGE_B64 = 1.5 * 1024 * 1024, MAX_OUT = 8000;

const enabled = () => !!process.env.GEMINI_API_KEY;

async function subjectOf(req) {
  const s = await currentSession(req);
  if (s) return { subject: 'u:' + s.id, limit: LIMIT_USER };
  return { subject: 'ip:' + createHash('sha256').update('nl-ai:' + clientIp(req)).digest('hex').slice(0, 32), limit: LIMIT_GUEST };
}

async function usedToday(subject) {
  const r = await db()`select count from ai_usage where subject = ${subject} and day = (now() at time zone 'utc')::date`;
  return r[0] ? r[0].count : 0;
}
async function refund(subject) {
  await db()`update ai_usage set count = greatest(count - 1, 0) where subject = ${subject} and day = (now() at time zone 'utc')::date`;
}

/* Пропускаем только то, что отправляет сам сайт: всё остальное (инструменты, агенты, хранение) отбрасываем */
function clean(b) {
  const p = b && typeof b === 'object' ? b : {};
  const out = { model: MODELS.includes(p.model) ? p.model : MODELS[0], store: false };
  if (typeof p.system_instruction === 'string') {
    if (p.system_instruction.length > MAX_TEXT) return [null, 'system_instruction is too long'];
    out.system_instruction = p.system_instruction;
  }
  if (typeof p.input === 'string') {
    if (!p.input.trim() || p.input.length > MAX_TEXT) return [null, 'input is empty or too long'];
    out.input = p.input;
  } else if (Array.isArray(p.input)) {
    let images = 0;
    out.input = [];
    for (const part of p.input.slice(0, 8)) {
      if (part && part.type === 'text' && typeof part.text === 'string' && part.text.length <= MAX_TEXT) out.input.push({ type: 'text', text: part.text });
      else if (part && part.type === 'image' && /^image\/(jpeg|png|webp)$/.test(part.mime_type) && typeof part.data === 'string' && part.data.length <= MAX_IMAGE_B64 && /^[A-Za-z0-9+/=]+$/.test(part.data.slice(0, 200))) {
        if (++images > MAX_IMAGES) return [null, 'too many images'];
        out.input.push({ type: 'image', data: part.data, mime_type: part.mime_type });
      } else return [null, 'unsupported input part'];
    }
    if (!out.input.length) return [null, 'input is empty'];
  } else return [null, 'input is required'];
  const g = p.generation_config || {};
  out.generation_config = {
    thinking_level: LEVELS.includes(g.thinking_level) ? g.thinking_level : 'low',
    max_output_tokens: Math.min(MAX_OUT, Math.max(16, Number(g.max_output_tokens) || 2000)),
  };
  if (p.response_format && typeof p.response_format === 'object') {
    if (JSON.stringify(p.response_format).length > 20000) return [null, 'response_format is too large'];
    out.response_format = p.response_format;
  }
  if (p.stream === true) out.stream = true;
  return [out, null];
}

async function callOnce(payload) {
  // зависшая модель не должна держать запрос: без ответа за 25 с считаем её перегруженной (поток — не дольше 90 с)
  const req = store => fetch(GEMINI_URL + (payload.stream ? '?alt=sse' : ''), {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify(store ? payload : { ...payload, store: undefined }),
    signal: AbortSignal.timeout(payload.stream ? 90000 : 25000),
  }).catch(e => new Response(JSON.stringify({ error: { message: 'timeout: ' + e.message, code: 'service_unavailable' } }), { status: 503 }));
  let r = await req(true);
  if (r.status === 400) {
    // если Google не принимает поле store — повторяем без него
    const text = await r.clone().text();
    if (/\bstore\b/i.test(text) && !/API_KEY/.test(text)) r = await req(false);
  }
  return r;
}
/* Перегруженная модель в потоковом режиме отвечает 200 и шлёт только «: keep-alive», не выдавая текста.
   Ждём первое настоящее событие (текст, ошибку или завершение) не дольше FIRST_EVENT_MS;
   не дождались — модель считаем занятой. Возвращает поток с уже прочитанным началом или null. */
const FIRST_EVENT_MS = 10000;
const REAL_EVENT = /event_type"\s*:\s*"(step\.delta|error|interaction\.completed)|data:\s*\[DONE\]/;
async function firstEvent(r) {
  const reader = r.body.getReader(), dec = new TextDecoder(), head = [];
  let text = '';
  const deadline = Date.now() + FIRST_EVENT_MS;
  for (;;) {
    const left = deadline - Date.now();
    const step = left > 0 ? await Promise.race([reader.read(), new Promise(res => setTimeout(() => res('timeout'), left))]) : 'timeout';
    if (step === 'timeout') { reader.cancel().catch(() => {}); return null; }
    if (step.done) { if (!/^data:/m.test(text)) return null; break; } // закрыла поток, ничего не выдав — как и молчание, считаем занятой
    head.push(step.value); text += dec.decode(step.value, { stream: true });
    if (REAL_EVENT.test(text)) break;
  }
  return new Response(new ReadableStream({
    async start(c) {
      head.forEach(x => c.enqueue(x));
      try { for (;;) { const { value, done } = await reader.read(); if (done) break; c.enqueue(value); } } catch (e) {}
      c.close();
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

// модель перегружена (503), недоступна (404) или молчит в потоке — сразу пробуем следующую из списка
// занятые модели запоминаем в базе (общей для всех экземпляров функции) и пробуем их последними
const BUSY_MS = 3 * 60 * 1000;
const markBusy = (model, ms = BUSY_MS) => db()`
  insert into ai_model_busy (model, until) values (${model}, now() + make_interval(secs => ${ms / 1000}))
  on conflict (model) do update set until = excluded.until`.catch(() => {});
async function callGemini(payload) {
  const all = [payload.model, ...MODELS.filter(m => m !== payload.model)];
  const busy = new Set((await db()`select model from ai_model_busy where until > now()`.catch(() => [])).map(r => r.model));
  const free = m => !busy.has(m);
  const order = [...all.filter(free), ...all.filter(m => !free(m))];
  let r;
  for (const model of order) {
    r = await callOnce({ ...payload, model });
    if (r.ok && payload.stream) {
      const s = await firstEvent(r);
      if (s) return s;
      console.warn('Gemini', model, 'stream: no text within', FIRST_EVENT_MS, 'ms or closed empty');
      await markBusy(model);
      r = new Response(JSON.stringify({ error: { message: 'All models are busy, try again shortly', code: 'service_unavailable' } }), { status: 503 });
      continue;
    }
    if (r.ok || ![404, 429, 500, 503].includes(r.status)) return r;
    const text = await r.clone().text();
    // лимиты Google считаются по каждой модели отдельно — при 429 пробуем следующую;
    // исчерпан дневной лимит модели или она недоступна на тарифе («limit: 0») — откладываем её на час
    console.warn('Gemini', model, r.status, text.slice(0, 160));
    await markBusy(model, r.status === 429 && /per day|limit: 0\b/i.test(text) ? 60 * 60 * 1000 : BUSY_MS);
  }
  return r;
}

export default route(['GET', 'POST'], async (req, res) => {
  if (req.method === 'GET') {
    if (!enabled()) return send(res, 200, { enabled: false });
    const { subject, limit } = await subjectOf(req);
    const used = await usedToday(subject);
    return send(res, 200, { enabled: true, limit, used, remaining: Math.max(0, limit - used), models: MODELS });
  }

  if (!enabled()) return problem(res, 503, 'AI_DISABLED', 'Shared AI key is not configured');
  const [payload, err] = clean(body(req));
  if (!payload) return problem(res, 400, 'VALIDATION_FAILED', err);

  const { subject, limit } = await subjectOf(req);
  const total = await take('global', LIMIT_TOTAL);
  if (total === false) return problem(res, 429, 'AI_LIMIT_TOTAL', 'Daily AI budget of the service is used up');
  const used = await take(subject, limit);
  if (used === false) { await refund('global'); return problem(res, 429, 'AI_LIMIT', `Daily limit of ${limit} AI requests reached`); }
  res.setHeader('x-ai-remaining', String(Math.max(0, limit - used)));

  let up;
  try { up = await callGemini(payload); }
  catch (e) { await refund(subject); await refund('global'); return problem(res, 502, 'AI_UNAVAILABLE', 'Gemini is unreachable'); }

  if (!up.ok) {
    await refund(subject); await refund('global');
    res.setHeader('x-ai-remaining', String(Math.max(0, limit - used + 1))); // неудачный запрос не расходует лимит
    const text = await up.text();
    // проблема с ключом сервиса — не ошибка пользователя
    if (/API_KEY|PERMISSION_DENIED|UNAUTHENTICATED/.test(text) || up.status === 401 || up.status === 403) {
      console.error('Gemini key problem:', up.status, text.slice(0, 300));
      return problem(res, 502, 'AI_SERVER_KEY', 'Shared AI key was rejected');
    }
    res.statusCode = up.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(text);
  }

  if (payload.stream) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    for await (const chunk of up.body) res.write(chunk);
    return res.end();
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(await up.text());
});
