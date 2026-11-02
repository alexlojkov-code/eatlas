/* Eatlas — общая серверная часть: база Neon, пароли, сессии, ответы.
   Файлы в api/_lib не становятся отдельными функциями Vercel (префикс «_»). */
import { neon } from '@neondatabase/serverless';
import { randomBytes, createHash, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);

let _sql;
export const db = () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  return (_sql ||= neon(process.env.DATABASE_URL));
};

/* ---------- ответы (ошибки в духе RFC 9457) ---------- */
export function send(res, status, body) {
  res.statusCode = status;
  if (body === undefined) return res.end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
export function problem(res, status, code, detail) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
  res.end(JSON.stringify({ type: 'about:blank', title: code, status, code, detail }));
}

/* Обёртка обработчика: допустимые методы, защита от CSRF, перехват ошибок */
export function route(methods, fn) {
  return async (req, res) => {
    try {
      if (!methods.includes(req.method)) {
        res.setHeader('Allow', methods.join(', '));
        return problem(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
      }
      if (req.method !== 'GET' && !sameOrigin(req)) return problem(res, 403, 'FORBIDDEN', 'Cross-site request rejected');
      await fn(req, res);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) problem(res, 500, 'SERVER_ERROR', 'Something went wrong');
    }
  };
}

/* Изменяющие запросы принимаются только со своего сайта и с заголовком x-nl,
   который сторонний сайт не может добавить без CORS-разрешения. */
function sameOrigin(req) {
  if (req.headers['x-nl'] !== '1') return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

export function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}

/* ---------- проверки ввода ---------- */
export const normEmail = e => String(e || '').trim().toLowerCase();
export const validEmail = e => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export function passwordProblem(pw, email) {
  if (typeof pw !== 'string' || pw.length < 10) return 'PASSWORD_TOO_SHORT';
  if (pw.length > 200) return 'PASSWORD_TOO_LONG';
  if (email && pw.toLowerCase() === email) return 'PASSWORD_WEAK';
  if (/^(.)\1+$/.test(pw) || /^(0123456789|1234567890|qwertyuiop|password\d*)$/i.test(pw)) return 'PASSWORD_WEAK';
  return null;
}

/* ---------- пароли: scrypt со случайной солью ---------- */
const SCRYPT = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = await scrypt(pw.normalize('NFKC'), salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${key.toString('base64')}`;
}
export async function verifyPassword(pw, stored) {
  const [alg, N, r, p, saltB64, keyB64] = String(stored).split('$');
  if (alg !== 'scrypt') return false;
  const expected = Buffer.from(keyB64, 'base64');
  const key = await scrypt(String(pw).normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, { N: +N, r: +r, p: +p, maxmem: SCRYPT.maxmem });
  return key.length === expected.length && timingSafeEqual(key, expected);
}
// Хэш-заглушка: проверка пароля для несуществующего email занимает столько же времени
let _dummy;
export const dummyHash = async () => (_dummy ||= await hashPassword(randomBytes(12).toString('hex')));

/* ---------- сессии: случайный токен в httpOnly-cookie, в базе — только его хэш ---------- */
const COOKIE = 'nl_session';
const SESSION_DAYS = 30;
export const sha256 = s => createHash('sha256').update(s).digest('hex');

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}
function setCookie(res, value, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
}

export async function createSession(req, res, userId) {
  const token = randomBytes(32).toString('base64url');
  const ua = String(req.headers['user-agent'] || '').slice(0, 200);
  await db()`insert into sessions (token_hash, user_id, expires_at, user_agent)
             values (${sha256(token)}, ${userId}, now() + make_interval(days => ${SESSION_DAYS}), ${ua})`;
  await db()`delete from sessions where user_id = ${userId} and expires_at < now()`;
  setCookie(res, token, SESSION_DAYS * 86400);
}

export async function currentSession(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const rows = await db()`select u.id, u.email, u.name, u.password_hash, u.email_verified_at, u.created_at, s.token_hash
                          from sessions s join users u on u.id = s.user_id
                          where s.token_hash = ${sha256(token)} and s.expires_at > now()`;
  return rows[0] || null;
}

export async function destroySession(req, res) {
  const token = readCookie(req, COOKIE);
  if (token) await db()`delete from sessions where token_hash = ${sha256(token)}`;
  setCookie(res, '', 0);
}
export const clearCookie = res => setCookie(res, '', 0);

export const publicUser = u => ({ id: u.id, email: u.email, name: u.name || '', email_verified: !!u.email_verified_at, created_at: u.created_at });

/* ---------- лимиты по дням (таблица ai_usage общая: subject — «u:…», «ip:…», «mail-ip:…» и т. п.) ---------- */
export const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
// +1 к счётчику, только если лимит ещё не достигнут; false — лимит исчерпан
export async function takeDaily(subject, limit) {
  const r = await db()`
    insert into ai_usage (subject, day, count) values (${subject}, (now() at time zone 'utc')::date, 1)
    on conflict (subject, day) do update set count = ai_usage.count + 1 where ai_usage.count < ${limit}
    returning count`;
  return r[0] ? r[0].count : false;
}
