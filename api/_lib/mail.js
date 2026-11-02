/* Eatlas — письма аккаунта: одноразовые ссылки и отправка через Resend.
   RESEND_API_KEY — ключ Resend; MAIL_FROM — отправитель, например «Eatlas <noreply@ваш-домен>».
   Без своего домена Resend разрешает только отправителя onboarding@resend.dev и только на ящик владельца аккаунта Resend.
   APP_URL — адрес сайта для ссылок в письмах (не берём из заголовка Host, чтобы ссылку нельзя было подменить).
   MAIL_URL — только для локальных тестов: подменяет адрес API Resend. */
import { randomBytes } from 'node:crypto';
import { db, sha256 } from './server.js';

const MAIL_URL = process.env.MAIL_URL || 'https://api.resend.com/emails';
export const mailReady = () => !!(process.env.RESEND_API_KEY || process.env.MAIL_URL);
export const appUrl = () => (process.env.APP_URL || 'https://eatlas-app.vercel.app').replace(/\/$/, '');

export const TOKEN_MINUTES = { reset: 60, verify: 24 * 60 };
export const TOKENS_PER_HOUR = 3; // писем одного вида одному пользователю за час

export async function sendMail({ to, subject, html, text }) {
  if (!mailReady()) throw Object.assign(new Error('MAIL_UNAVAILABLE'), { code: 'MAIL_UNAVAILABLE' });
  const r = await fetch(MAIL_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY || 'test'}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM || 'Eatlas <onboarding@resend.dev>', to: [to], subject, html, text }),
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    throw Object.assign(new Error(`MAIL_FAILED ${r.status} ${detail.slice(0, 200)}`), { code: 'MAIL_FAILED' });
  }
}

/* ---------- одноразовые ссылки: в базе только хэш токена ---------- */
export async function recentTokens(userId, kind) {
  const r = await db()`select count(*)::int as n from auth_tokens
                       where user_id = ${userId} and kind = ${kind} and created_at > now() - interval '1 hour'`;
  return r[0].n;
}
export async function issueToken(userId, kind, email) {
  const token = randomBytes(32).toString('base64url');
  await db()`delete from auth_tokens where user_id = ${userId} and expires_at < now() - interval '7 days'`;
  await db()`insert into auth_tokens (token_hash, user_id, kind, email, expires_at)
             values (${sha256(token)}, ${userId}, ${kind}, ${email}, now() + make_interval(mins => ${TOKEN_MINUTES[kind]}))`;
  return token;
}

/* ---------- письма ---------- */
const T = {
  ru: {
    reset: { subject: 'Сброс пароля Eatlas', title: 'Сброс пароля', lead: 'Кто-то (надеемся, вы) запросил сброс пароля для аккаунта Eatlas. Нажмите кнопку, чтобы задать новый пароль.', btn: 'Задать новый пароль', note: 'Ссылка действует 1 час и сработает один раз. Если вы не запрашивали сброс — просто проигнорируйте письмо, пароль останется прежним.' },
    verify: { subject: 'Подтвердите почту для Eatlas', title: 'Подтвердите почту', lead: 'Это письмо подтверждает, что адрес принадлежит вам. Так вы сможете восстановить пароль, если забудете его.', btn: 'Подтвердить почту', note: 'Ссылка действует 24 часа. Если вы не регистрировались в Eatlas — просто проигнорируйте письмо.' },
    hi: name => (name ? `Здравствуйте, ${name}!` : 'Здравствуйте!'), alt: 'Если кнопка не работает, откройте ссылку:',
  },
  en: {
    reset: { subject: 'Reset your Eatlas password', title: 'Reset your password', lead: 'Someone (hopefully you) asked to reset the password for your Eatlas account. Tap the button to set a new one.', btn: 'Set a new password', note: 'The link works once and expires in 1 hour. If you didn’t ask for a reset, ignore this email — your password stays the same.' },
    verify: { subject: 'Confirm your email for Eatlas', title: 'Confirm your email', lead: 'This confirms the address belongs to you, so you can recover your password if you ever forget it.', btn: 'Confirm email', note: 'The link expires in 24 hours. If you didn’t sign up for Eatlas, just ignore this email.' },
    hi: name => (name ? `Hi ${name},` : 'Hi,'), alt: 'If the button doesn’t work, open this link:',
  },
  uz: {
    reset: { subject: 'Eatlas parolini tiklash', title: 'Parolni tiklash', lead: 'Kimdir (umid qilamizki, siz) Eatlas akkaunti parolini tiklashni so‘radi. Yangi parol o‘rnatish uchun tugmani bosing.', btn: 'Yangi parol o‘rnatish', note: 'Havola 1 soat amal qiladi va bir marta ishlaydi. Agar tiklashni so‘ramagan bo‘lsangiz, xatga e’tibor bermang — parolingiz o‘zgarmaydi.' },
    verify: { subject: 'Eatlas uchun pochtangizni tasdiqlang', title: 'Pochtani tasdiqlang', lead: 'Bu xat manzil sizga tegishli ekanini tasdiqlaydi. Shunda parolni unutsangiz, uni tiklay olasiz.', btn: 'Pochtani tasdiqlash', note: 'Havola 24 soat amal qiladi. Agar Eatlasda ro‘yxatdan o‘tmagan bo‘lsangiz, xatga e’tibor bermang.' },
    hi: name => (name ? `Assalomu alaykum, ${name}!` : 'Assalomu alaykum!'), alt: 'Agar tugma ishlamasa, havolani oching:',
  },
};
// язык письма: ru, en или uz; неизвестный — ru
export const mailLang = l => (Object.hasOwn(T, l) ? l : 'ru');
const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function letter(kind, lang, url, name = '') {
  const L = T[mailLang(lang)], k = L[kind];
  const hi = escHtml(L.hi(String(name).slice(0, 60)));
  const html = `<!doctype html><html><body style="margin:0;background:#E8E9ED;font-family:Arial,Helvetica,sans-serif;color:#0B0B0C">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBFBFD;border-radius:24px;padding:36px 32px">
<tr><td style="font:700 15px Arial,sans-serif;letter-spacing:.5px">EAT<span style="color:#5C8A00">LAS</span></td></tr>
<tr><td style="padding-top:28px;font:900 30px Arial,sans-serif;text-transform:uppercase">${k.title}</td></tr>
<tr><td style="padding-top:16px;font:16px/1.5 Arial,sans-serif">${hi}<br>${k.lead}</td></tr>
<tr><td style="padding-top:26px"><a href="${escHtml(url)}" style="display:inline-block;background:#BEFF4F;color:#0B0B0C;text-decoration:none;font:700 16px Arial,sans-serif;padding:16px 26px;border-radius:999px">${k.btn} →</a></td></tr>
<tr><td style="padding-top:24px;font:13px/1.5 Arial,sans-serif;color:#585D6B">${k.note}</td></tr>
<tr><td style="padding-top:16px;font:12px/1.5 Arial,sans-serif;color:#585D6B;word-break:break-all">${L.alt}<br><a href="${escHtml(url)}" style="color:#585D6B">${escHtml(url)}</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${L.hi(name)}\n\n${k.lead}\n\n${k.btn}: ${url}\n\n${k.note}`;
  return { subject: k.subject, html, text };
}

/* Письмо для подтверждения почты: новый токен и отправка */
export async function sendVerification(user, lang) {
  const token = await issueToken(user.id, 'verify', user.email);
  await sendMail({ to: user.email, ...letter('verify', lang, `${appUrl()}/#/verify/${token}`, user.name) });
}
