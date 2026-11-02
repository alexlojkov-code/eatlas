/* POST /api/auth/register — создать аккаунт и сразу войти; на почту уходит письмо для её подтверждения */
import { route, body, db, send, problem, normEmail, validEmail, passwordProblem, hashPassword, createSession, publicUser } from '../_lib/server.js';
import { mailReady, sendVerification, mailLang } from '../_lib/mail.js';

export default route(['POST'], async (req, res) => {
  const b = body(req);
  const email = normEmail(b.email);
  const name = String(b.name || '').trim().slice(0, 60);
  if (!validEmail(email)) return problem(res, 400, 'INVALID_EMAIL', 'Invalid email');
  if (b.consent !== true) return problem(res, 400, 'CONSENT_REQUIRED', 'Consent to the privacy policy is required');
  const pwErr = passwordProblem(b.password, email);
  if (pwErr) return problem(res, 400, pwErr, 'Password does not meet requirements');
  const hash = await hashPassword(b.password);
  let rows;
  try {
    rows = await db()`insert into users (email, password_hash, name) values (${email}, ${hash}, ${name})
                      returning id, email, name, email_verified_at, created_at`;
  } catch (e) {
    if (e.code === '23505') return problem(res, 409, 'EMAIL_TAKEN', 'An account with this email already exists');
    throw e;
  }
  await createSession(req, res, rows[0].id);
  // письмо — по возможности: если почта не настроена или не дошла, аккаунт всё равно создан, письмо можно запросить ещё раз
  let verifySent = false;
  if (mailReady()) { try { await sendVerification(rows[0], mailLang(b.lang)); verifySent = true; } catch (e) { console.error('verify mail', e); } }
  send(res, 201, { user: publicUser(rows[0]), verify_sent: verifySent });
});
