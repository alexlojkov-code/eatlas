/* Локальный сервер разработки: раздаёт сайт и вызывает функции из api/ так же, как Vercel.
   Запуск: DATABASE_URL=... node scripts/dev.mjs  →  http://localhost:3000 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.md': 'text/markdown; charset=utf-8' };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) {
      const file = join(root, normalize(url.pathname).replace(/\/$/, '') + '.js');
      if (file.includes('/_lib/') || !(await stat(file).catch(() => null))) { res.statusCode = 404; return res.end('not found'); }
      let raw = '';
      for await (const chunk of req) raw += chunk;
      req.body = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : undefined;
      req.query = Object.fromEntries(url.searchParams);
      const mod = await import(pathToFileURL(file).href);
      return await mod.default(req, res);
    }
    let path = normalize(decodeURIComponent(url.pathname));
    if (path.endsWith('/')) path += 'index.html';
    const file = join(root, path);
    if (!file.startsWith(root) || path.includes('/scripts/') || path.includes('/node_modules/')) { res.statusCode = 404; return res.end('not found'); }
    const data = await readFile(file);
    res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(data);
  } catch (e) {
    if (e.code === 'ENOENT') { res.statusCode = 404; return res.end('not found'); }
    console.error(e);
    res.statusCode = 500; res.end('error');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Eatlas dev: http://localhost:${PORT}`));
