/* Создаёт таблицы Eatlas в базе Neon. Безопасно запускать повторно.
   Запуск: DATABASE_URL=... node scripts/migrate.mjs */
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) { console.error('DATABASE_URL is not set'); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);

await sql`create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  password_hash text not null,
  name          text not null default '',
  failed_logins int  not null default 0,
  locked_until  timestamptz,
  last_login_at timestamptz,
  created_at    timestamptz not null default now()
)`;

await sql`create table if not exists sessions (
  token_hash text primary key,
  user_id    uuid not null references users(id) on delete cascade,
  user_agent text not null default '',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
)`;
await sql`create index if not exists sessions_user_idx on sessions (user_id)`;

await sql`create table if not exists user_data (
  user_id    uuid primary key references users(id) on delete cascade,
  data       jsonb not null,
  version    int not null default 1,
  updated_at timestamptz not null default now()
)`;

// счётчик запросов к общему ИИ: subject — «u:<id пользователя>», «ip:<хэш IP>» или «global»
await sql`create table if not exists ai_usage (
  subject text not null,
  day     date not null,
  count   int  not null default 0,
  primary key (subject, day)
)`;

// модели Gemini, которые сейчас перегружены или исчерпали дневной лимит (общая отметка для всех экземпляров функции)
await sql`create table if not exists ai_model_busy (
  model text primary key,
  until timestamptz not null
)`;

// подтверждение почты: время подтверждения (null — не подтверждена)
await sql`alter table users add column if not exists email_verified_at timestamptz`;

// одноразовые ссылки из писем (сброс пароля, подтверждение почты); хранится только хэш токена
await sql`create table if not exists auth_tokens (
  token_hash text primary key,
  user_id    uuid not null references users(id) on delete cascade,
  kind       text not null check (kind in ('reset', 'verify')),
  email      text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at    timestamptz
)`;
await sql`create index if not exists auth_tokens_user_idx on auth_tokens (user_id, kind, created_at)`;

const tables = await sql`select table_name from information_schema.tables where table_schema = 'public' order by 1`;
console.log('tables:', tables.map(t => t.table_name).join(', '));
