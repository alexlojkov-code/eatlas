/* POST /api/auth/email — письма аккаунта (один обработчик, чтобы не плодить функции Vercel). Поле action:
   forgot {email, lang}     — письмо со ссылкой для сброса пароля; ответ одинаковый, есть такой аккаунт или нет
   reset  {token, password} — новый пароль по ссылке из письма: вход на этом устройстве, выход на остальных
   send   {lang}            — ещё раз отправить письмо для подтверждения почты (нужен вход)
   verify {token}           — подтвердить почту по ссылке из письма (вход не нужен: ссылку могут открыть на другом устройстве) */
import { route, body, db, send, problem, normEmail, validEmail, passwordProblem, hashPassword, createSession, currentSession, publicUser, sha256, clientIp, takeDaily } from '../_lib/server.js';
import { mailReady, sendMail, letter, appUrl, issueToken, recentTokens, sendVerification, TOKENS_PER_HOUR, mailLang } from '../_lib/mail.js';

const MAIL_PER_IP_DAY = 20; // писем о сбросе с одного IP за сутки — чтобы форму не использовали для рассылки по чужим ящикам
const lang = b => mailLang(b.lang);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function forgot(req, res, b) {
  const email = normEmail(b.email);
  if (!validEmail(email)) return problem(res, 400, 'INVALID_EMAIL', 'Invalid email');
  if (!mailReady()) return problem(res, 503, 'MAIL_UNAVAILABLE', 'Email is not configured');
  if (!(await takeDaily('mail-ip:' + sha256('nl-mail:' + clientIp(req)).slice(0, 32), MAIL_PER_IP_DAY))) {
    return problem(res, 429, 'TOO_MANY', 'Too many requests, try again later');
  }
  const t0 = Date.now();
  const user = (await db()`select id, email, name from users where email = ${email}`)[0];
  if (user && (await recentTokens(user.id, 'reset')) < TOKENS_PER_HOUR) {
    try {
      const token = await issueToken(user.id, 'reset', user.email);
      await sendMail({ to: user.email, ...letter('reset', lang(b), `${appUrl()}/#/reset/${token}`, user.name) });
    } catch (e) { console.error('reset mail', e); } // не раскрываем, есть ли аккаунт, — ответ тот же
  }
  // одинаковое время ответа для существующих и несуществующих адресов
  await sleep(Math.max(0, 900 - (Date.now() - t0)) + Math.random() * 200);
  send(res, 202, { ok: true });
}

async function reset(req, res, b) {
  const token = String(b.token || '');
  const row = token && (await db()`select t.user_id, u.email from auth_tokens t join users u on u.id = t.user_id
                                   where t.token_hash = ${sha256(token)} and t.kind = 'reset' and t.used_at is null and t.expires_at > now()`)[0];
  if (!row) return problem(res, 400, 'TOKEN_INVALID', 'The link is invalid or expired');
  const pwErr = passwordProblem(b.password, row.email);
  if (pwErr) return problem(res, 400, pwErr, 'Password does not meet requirements');
  // одноразовость: гасим ссылку атомарно, вместе со всеми остальными ссылками сброса этого пользователя
  const used = await db()`update auth_tokens set used_at = now()
                          where user_id = ${row.user_id} and kind = 'reset' and used_at is null
                          returning token_hash`;
  if (!used.some(u => u.token_hash === sha256(token))) return problem(res, 400, 'TOKEN_INVALID', 'The link is invalid or expired');
  // ссылка пришла на почту — значит, ящик принадлежит владельцу: заодно считаем почту подтверждённой
  const users = await db()`update users set password_hash = ${await hashPassword(b.password)}, failed_logins = 0, locked_until = null,
                                           email_verified_at = coalesce(email_verified_at, now()), last_login_at = now()
                           where id = ${row.user_id} returning id, email, name, email_verified_at, created_at`;
  await db()`delete from sessions where user_id = ${row.user_id}`;
  await createSession(req, res, row.user_id);
  send(res, 200, { user: publicUser(users[0]) });
}

async function resend(req, res, b) {
  const s = await currentSession(req);
  if (!s) return problem(res, 401, 'UNAUTHORIZED', 'Not signed in');
  if (s.email_verified_at) return send(res, 200, { verified: true });
  if (!mailReady()) return problem(res, 503, 'MAIL_UNAVAILABLE', 'Email is not configured');
  if ((await recentTokens(s.id, 'verify')) >= TOKENS_PER_HOUR) return problem(res, 429, 'TOO_MANY', 'Too many requests, try again later');
  try { await sendVerification(s, lang(b)); }
  catch (e) { console.error('verify mail', e); return problem(res, 502, 'MAIL_FAILED', 'Could not send the email'); }
  send(res, 202, { sent: true });
}

async function verify(req, res, b) {
  const token = String(b.token || '');
  const h = sha256(token);
  const row = token && (await db()`select t.user_id, t.email, t.used_at, t.expires_at, u.email as current_email, u.email_verified_at
                                   from auth_tokens t join users u on u.id = t.user_id
                                   where t.token_hash = ${h} and t.kind = 'verify'`)[0];
  if (!row || row.email !== row.current_email) return problem(res, 400, 'TOKEN_INVALID', 'The link is invalid or expired');
  // повторное открытие той же ссылки после успеха — не ошибка
  if (row.used_at && row.email_verified_at) return send(res, 200, { email: row.email, verified: true });
  const used = await db()`update auth_tokens set used_at = now()
                          where token_hash = ${h} and used_at is null and expires_at > now() returning user_id`;
  if (!used[0]) return problem(res, 400, 'TOKEN_INVALID', 'The link is invalid or expired');
  await db()`update users set email_verified_at = coalesce(email_verified_at, now()) where id = ${row.user_id} and email = ${row.email}`;
  send(res, 200, { email: row.email, verified: true });
}

const ACTIONS = { forgot, reset, send: resend, verify };

export default route(['POST'], async (req, res) => {
  const b = body(req);
  const fn = Object.hasOwn(ACTIONS, b.action) ? ACTIONS[b.action] : null; // не «constructor» и прочее из прототипа
  if (!fn) return problem(res, 400, 'BAD_REQUEST', 'Unknown action');
  await fn(req, res, b);
});
