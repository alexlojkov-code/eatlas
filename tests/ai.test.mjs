/* Тесты /api/ai: проверки запроса, лимиты, возврат лимита при сбое, перебор моделей, поток.
   Настоящий Gemini не вызывается: сервер разработки ходит в подставной сервер из этого файла,
   поэтому запуск ничего не стоит. Нужна только тестовая база: адрес берётся исключительно из файла .env.test
   (не из окружения), чтобы тесты случайно не оказались на рабочей базе — они очищают таблицы лимитов.
     node tests/ai.test.mjs */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = fileURLToPath(new URL('..', import.meta.url));
const envFile = (() => { try { return readFileSync(root + '.env.test', 'utf8'); } catch { return ''; } })();
const DATABASE_URL = (envFile.match(/^DATABASE_URL=(.+)$/m) || [])[1];
if (!DATABASE_URL) { console.error('Нет файла .env.test с DATABASE_URL тестовой базы'); process.exit(2); }
const sql = neon(DATABASE_URL);

const FAKE_KEY = 'test-key-not-real';
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-4-argon'];
const [M1, M2, M3] = MODELS;
const LIMIT_GUEST = 3, LIMIT_USER = 5;

/* ---------- подставной Gemini ---------- */
const calls = [];
const json = (status, obj) => ({ status, body: JSON.stringify(obj) });
const okReply = model => json(200, { model, outputs: [{ text: 'ok' }] });
let answer = model => okReply(model); // тест подменяет ответ модели
const openStreams = new Set();
const mock = createServer(async (req, res) => {
  let raw = ''; for await (const ch of req) raw += ch;
  const b = JSON.parse(raw);
  calls.push({ url: req.url, key: req.headers['x-goog-api-key'], body: b });
  const a = await answer(b.model, b);
  if (a.sse) {
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    for (const chunk of a.sse) res.write(chunk);
    if (a.hold) { openStreams.add(res); res.on('close', () => openStreams.delete(res)); return; } // молчит и не закрывает поток
    return res.end();
  }
  res.writeHead(a.status, { 'content-type': 'application/json' });
  res.end(a.body);
});
await new Promise(r => mock.listen(0, '127.0.0.1', r));
const GEMINI_URL = `http://127.0.0.1:${mock.address().port}/v1/interactions`;

/* ---------- серверы разработки с нужными настройками ---------- */
const servers = [];
async function startServer(port, env) {
  const p = spawn(process.execPath, ['scripts/dev.mjs'], {
    cwd: root,
    env: { PATH: process.env.PATH, PORT: String(port), DATABASE_URL, AI_DAILY_LIMIT_GUEST: String(LIMIT_GUEST), AI_DAILY_LIMIT_USER: String(LIMIT_USER), ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  servers.push(p);
  p.stderr.on('data', () => {}); // предупреждения о занятых моделях здесь ожидаемы
  await new Promise((res, rej) => {
    p.stdout.on('data', d => /Eatlas dev/.test(d) && res());
    p.on('exit', c => rej(new Error('сервер завершился с кодом ' + c)));
  });
  return `http://127.0.0.1:${port}`;
}
const BASE = await startServer(3201, { GEMINI_API_KEY: FAKE_KEY, GEMINI_URL });

/* ---------- клиент и мини-раннер ---------- */
const rndIp = () => `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 250) + 1).join('.')}`;
async function call(method, body, { ip = rndIp(), cookie, base = BASE, headers = {} } = {}) {
  const h = { 'x-nl': '1', 'x-forwarded-for': ip, ...headers };
  if (body !== undefined) h['content-type'] = 'application/json';
  if (cookie) h.cookie = cookie;
  const res = await fetch(base + '/api/ai', { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let j = null; try { j = JSON.parse(text); } catch {}
  return { status: res.status, json: j, text, headers: res.headers };
}
const ask = (extra = {}, opt) => call('POST', { model: M1, input: 'Яблоко', ...extra }, opt);

let failed = 0, passed = 0;
async function test(name, fn) {
  calls.length = 0;
  answer = model => okReply(model);
  await sql`delete from ai_model_busy`;
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${e.message}`); }
}
function eq(a, b, msg) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: ожидалось ${JSON.stringify(b)}, получено ${JSON.stringify(a)}`); }
function ok(c, msg) { if (!c) throw new Error(msg); }
const usage = async subject => { const r = await sql`select count from ai_usage where subject = ${subject} and day = (now() at time zone 'utc')::date`; return r[0] ? r[0].count : 0; };

/* ---------- тесты ---------- */
await sql`delete from ai_usage`;
console.log(`Тесты /api/ai: ${BASE} (подставной Gemini)\n`);

await test('GET: показывает лимит и остаток, модели; сам ключ не отдаёт', async () => {
  const r = await call('GET');
  eq(r.status, 200, 'код'); eq(r.json.enabled, true, 'включён');
  eq(r.json.limit, LIMIT_GUEST, 'лимит гостя'); eq(r.json.remaining, LIMIT_GUEST, 'остаток');
  eq(r.json.models, MODELS, 'модели');
  ok(!r.text.includes(FAKE_KEY), 'ключ в ответе');
});

await test('POST: успешный ответ передаётся клиенту, ключ уходит только в Gemini, остаток уменьшается', async () => {
  const ip = rndIp();
  const r = await ask({}, { ip });
  eq(r.status, 200, 'код'); eq(r.json.model, M1, 'ответ модели');
  eq(calls.length, 1, 'вызовов Gemini'); eq(calls[0].key, FAKE_KEY, 'ключ в запросе к Gemini');
  ok(!r.text.includes(FAKE_KEY) && ![...r.headers.values()].join().includes(FAKE_KEY), 'ключ попал в ответ клиенту');
  eq(r.headers.get('x-ai-remaining'), String(LIMIT_GUEST - 1), 'заголовок остатка');
  eq((await call('GET', undefined, { ip })).json.used, 1, 'расход');
});

await test('Запрос очищается: лишние поля отброшены, чужая модель заменена, размер ответа ограничен', async () => {
  await ask({ model: 'gemini-99-ultra', tools: [{ google_search: {} }], agent: 'x', store: true, previous_interaction_id: 'abc', generation_config: { thinking_level: 'extreme', max_output_tokens: 999999, temperature: 2 } });
  const b = calls[0].body;
  eq(b.model, M1, 'модель из белого списка');
  eq(b.store, false, 'хранение на стороне Google выключено');
  for (const f of ['tools', 'agent', 'previous_interaction_id']) ok(!(f in b), 'поле дошло до Gemini: ' + f);
  eq(b.generation_config, { thinking_level: 'low', max_output_tokens: 8000 }, 'настройки генерации');
});

await test('Неверный запрос → 400: Gemini не вызывается, лимит не тратится', async () => {
  const ip = rndIp();
  const img = { type: 'image', mime_type: 'image/png', data: 'AAAA' };
  const bad = [
    { input: '   ' }, { input: 'x'.repeat(40001) }, { input: 42 }, { input: [] },
    { input: [{ type: 'image', mime_type: 'image/svg+xml', data: 'AAAA' }] },
    { input: [{ type: 'image', mime_type: 'image/png', data: '<script>' }] },
    { input: [{ type: 'audio', data: 'AAAA' }] },
    { input: [img, img, img, img, img] },
    { input: 'ok', system_instruction: 'x'.repeat(40001) },
    { input: 'ok', response_format: { a: 'x'.repeat(20001) } },
  ];
  for (const b of bad) {
    const r = await call('POST', b, { ip });
    eq(r.status, 400, 'код для ' + JSON.stringify(b).slice(0, 50));
    eq(r.json.code, 'VALIDATION_FAILED', 'код ошибки');
  }
  eq(calls.length, 0, 'вызовов Gemini');
  eq((await call('GET', undefined, { ip })).json.used, 0, 'расход');
});

await test('Защита от CSRF: без заголовка x-nl → 403, метод DELETE → 405', async () => {
  const r = await fetch(BASE + '/api/ai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"input":"x"}' });
  eq(r.status, 403, 'без x-nl');
  eq((await call('DELETE')).status, 405, 'DELETE');
  eq(calls.length, 0, 'вызовов Gemini');
});

await test('Лимит гостя считается по IP: после исчерпания 429, другой IP работает, общий счётчик возвращается', async () => {
  const ip = rndIp();
  for (let i = 0; i < LIMIT_GUEST; i++) eq((await ask({}, { ip })).status, 200, 'запрос ' + i);
  const before = await usage('global');
  const r = await ask({}, { ip });
  eq(r.status, 429, 'сверх лимита'); eq(r.json.code, 'AI_LIMIT', 'код ошибки');
  eq(calls.length, LIMIT_GUEST, 'вызовов Gemini');
  eq(await usage('global'), before, 'общий счётчик после отказа');
  eq((await ask({}, { ip: rndIp() })).status, 200, 'другой IP');
});

await test('Вошедший пользователь считается отдельно и не зависит от IP', async () => {
  const email = `e2e-ai-${Date.now().toString(36)}@example.com`, password = 'Api-' + crypto.randomUUID();
  const reg = await fetch(BASE + '/api/auth/register', { method: 'POST', headers: { 'x-nl': '1', 'content-type': 'application/json' }, body: JSON.stringify({ consent: true, email, password, name: 'AI' }) });
  eq(reg.status, 201, 'регистрация');
  const cookie = reg.headers.get('set-cookie').split(';')[0];
  try {
    eq((await call('GET', undefined, { cookie })).json.limit, LIMIT_USER, 'лимит пользователя');
    for (let i = 0; i < LIMIT_USER; i++) eq((await ask({}, { cookie, ip: rndIp() })).status, 200, 'запрос ' + i);
    eq((await ask({}, { cookie, ip: rndIp() })).json.code, 'AI_LIMIT', 'смена IP не сбрасывает лимит');
  } finally {
    await fetch(BASE + '/api/account', { method: 'DELETE', headers: { 'x-nl': '1', 'content-type': 'application/json', cookie }, body: JSON.stringify({ password }) });
  }
});

await test('Перегрузка: 503 первой модели → ответ второй, первая помечается занятой и идёт последней', async () => {
  answer = m => m === M1 ? json(503, { error: { message: 'overloaded' } }) : okReply(m);
  const r = await ask();
  eq(r.status, 200, 'код'); eq(r.json.model, M2, 'ответила вторая');
  eq(calls.map(c => c.body.model), [M1, M2], 'порядок');
  calls.length = 0;
  answer = m => okReply(m);
  eq((await ask()).json.model, M2, 'занятая модель пропущена');
  eq(calls.map(c => c.body.model), [M2], 'порядок после пометки');
});

await test('Дневной лимит модели (429 per day) откладывает её примерно на час, обычная перегрузка — на минуты', async () => {
  answer = m => m === M1 ? json(429, { error: { message: 'Quota exceeded: requests per day' } }) : m === M2 ? json(503, { error: { message: 'busy' } }) : okReply(m);
  eq((await ask()).json.model, M3, 'ответила третья');
  const rows = await sql`select model, extract(epoch from until - now())::int as sec from ai_model_busy`;
  const sec = m => rows.find(r => r.model === m)?.sec;
  ok(sec(M1) > 50 * 60, 'первая отложена на час, осталось с: ' + sec(M1));
  ok(sec(M2) > 0 && sec(M2) <= 180, 'вторая отложена на 3 минуты, осталось с: ' + sec(M2));
});

await test('Все модели перегружены: ошибка клиенту, но лимит не тратится', async () => {
  const ip = rndIp();
  answer = () => json(503, { error: { message: 'overloaded' } });
  const before = await usage('global');
  const r = await ask({}, { ip });
  eq(r.status, 503, 'код');
  eq(calls.length, 3, 'перебраны все модели');
  eq(r.headers.get('x-ai-remaining'), String(LIMIT_GUEST), 'остаток в заголовке');
  eq((await call('GET', undefined, { ip })).json.used, 0, 'расход гостя');
  eq(await usage('global'), before, 'общий счётчик');
});

await test('Ошибка в самом запросе (400) не перебирает модели и не тратит лимит', async () => {
  const ip = rndIp();
  answer = () => json(400, { error: { message: 'Invalid schema' } });
  const r = await ask({}, { ip });
  eq(r.status, 400, 'код'); eq(calls.length, 1, 'вызовов Gemini');
  eq((await call('GET', undefined, { ip })).json.used, 0, 'расход');
});

await test('Google отклонил ключ: клиент получает AI_SERVER_KEY без подробностей', async () => {
  const ip = rndIp();
  answer = () => json(403, { error: { message: 'PERMISSION_DENIED secret-detail-from-google' } });
  const r = await ask({}, { ip });
  eq(r.status, 502, 'код'); eq(r.json.code, 'AI_SERVER_KEY', 'код ошибки');
  ok(!r.text.includes('secret-detail'), 'подробности ответа Google ушли клиенту');
  eq((await call('GET', undefined, { ip })).json.used, 0, 'расход');
});

await test('Google не принимает поле store: повтор без него', async () => {
  answer = (m, b) => 'store' in b ? json(400, { error: { message: 'Unknown field: store' } }) : okReply(m);
  const r = await ask();
  eq(r.status, 200, 'код'); eq(calls.length, 2, 'вызовов'); ok(!('store' in calls[1].body), 'во втором запросе нет store');
});

const delta = t => `data: ${JSON.stringify({ event_type: 'step.delta', delta: { text: t } })}\n\n`;

await test('Поток: события передаются как есть, запрос идёт с alt=sse', async () => {
  answer = () => ({ sse: [': keep-alive\n\n', delta('При'), delta('вет'), 'data: {"event_type":"interaction.completed"}\n\n'] });
  const r = await ask({ stream: true });
  eq(r.status, 200, 'код'); ok(/event-stream/.test(r.headers.get('content-type')), 'тип ответа');
  ok(calls[0].url.includes('alt=sse'), 'alt=sse');
  ok(r.text.includes('"При"') && r.text.includes('"вет"') && r.text.includes('interaction.completed'), 'события: ' + r.text.slice(0, 200));
});

await test('Поток: модель молчит (только keep-alive) → через 10 с следующая модель', async () => {
  answer = m => m === M1 ? { sse: [': keep-alive\n\n'], hold: true } : { sse: [delta('готово'), 'data: [DONE]\n\n'] };
  const r = await ask({ stream: true });
  eq(r.status, 200, 'код'); ok(r.text.includes('готово'), 'ответ второй модели');
  eq(calls.map(c => c.body.model), [M1, M2], 'порядок');
  eq((await sql`select count(*)::int as n from ai_model_busy where model = ${M1} and until > now()`)[0].n, 1, 'первая помечена занятой');
});

await test('Поток: модель закрыла соединение, не выдав текста → следующая модель, а не пустой ответ', async () => {
  answer = m => m === M1 ? { sse: [': keep-alive\n\n'] } : { sse: [delta('готово'), 'data: [DONE]\n\n'] };
  const r = await ask({ stream: true });
  eq(r.status, 200, 'код');
  ok(r.text.includes('готово'), 'клиент получил пустой ответ: ' + JSON.stringify(r.text.slice(0, 80)));
  eq(calls.map(c => c.body.model), [M1, M2], 'порядок');
});

await test('Общий бюджет сервиса исчерпан → AI_LIMIT_TOTAL, Gemini не вызывается', async () => {
  const b2 = await startServer(3202, { GEMINI_API_KEY: FAKE_KEY, GEMINI_URL, AI_DAILY_LIMIT_TOTAL: '1' });
  await sql`insert into ai_usage (subject, day, count) values ('global', (now() at time zone 'utc')::date, 1) on conflict (subject, day) do update set count = greatest(ai_usage.count, 1)`;
  const r = await ask({}, { base: b2 });
  eq(r.status, 429, 'код'); eq(r.json.code, 'AI_LIMIT_TOTAL', 'код ошибки'); eq(calls.length, 0, 'вызовов Gemini');
});

await test('Ключа на сервере нет: GET enabled=false, POST → 503 AI_DISABLED', async () => {
  const b3 = await startServer(3203, {});
  eq((await call('GET', undefined, { base: b3 })).json, { enabled: false }, 'GET');
  const r = await ask({}, { base: b3 });
  eq(r.status, 503, 'код'); eq(r.json.code, 'AI_DISABLED', 'код ошибки');
});

/* ---------- уборка ---------- */
await sql`delete from ai_usage`;
await sql`delete from ai_model_busy`;
for (const s of openStreams) s.destroy();
for (const p of servers) { p.removeAllListeners('exit'); p.kill(); }
mock.close();
console.log(`\nИтого: ${passed} пройдено, ${failed} не пройдено`);
process.exit(failed ? 1 : 0);
