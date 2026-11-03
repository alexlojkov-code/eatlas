/* Eatlas — интерфейс: роутер, экраны, анимации. */

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>',
  flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><path d="M9.5 12.5a2.8 2.8 0 0 1 5-1.4M14.5 14a2.8 2.8 0 0 1-5 1.4"/><path d="M14.6 9.8v1.5h-1.5M9.4 16.2v-1.5h1.5"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-5 4 4 3-3 4 4"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l1.9 7.2 6.9-2.9-5.3 5.2 5.3 5.2-6.9-2.9L12 22.5l-1.9-7.2-6.9 2.9 5.3-5.2L3.2 7.8l6.9 2.9z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 20V11M10 20V5M15 20v-7M20 20V9"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>',
  mono: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#BEFF4F"/><path fill="#0B0B0C" d="M15.6 29H25.11V25.39H19.77V21.71H24.25V18.14H19.77V14.86H24.99V11.23H15.6Z M25.39 29H29.55L31.39 18.81Q31.46 18.35 31.53 17.51Q31.6 16.66 31.64 16.38H31.69Q31.74 16.66 31.81 17.51Q31.89 18.35 31.96 18.81L33.86 29H38.28L34.39 11.19H29.3ZM28.28 25.59H35.34L34.8 22.47H28.81Z M38.31 14.86H41.65V29H46.01V14.86H49.35V11.23H38.31Z M15.41 53H24.5V49.37H19.72V35.23H15.41Z M24.53 53H28.69L30.53 42.81Q30.6 42.35 30.67 41.51Q30.74 40.66 30.78 40.38H30.83Q30.88 40.66 30.95 41.51Q31.02 42.35 31.1 42.81L33 53H37.42L33.53 35.19H28.43ZM27.42 49.59H34.48L33.94 46.47H27.95Z M37.82 48.36Q37.82 50.88 39.38 52.08Q40.93 53.28 43.54 53.28Q46.17 53.28 47.69 51.98Q49.21 50.69 49.21 48.08Q49.21 45.65 48.02 44.31Q46.83 42.98 44.71 41.95Q43.25 41.23 42.8 40.74Q42.36 40.25 42.36 39.6Q42.36 38.9 42.65 38.58Q42.95 38.27 43.58 38.27Q44.21 38.27 44.52 38.68Q44.83 39.09 44.83 39.84V40.71H48.91V39.68Q48.91 37.48 47.49 36.21Q46.07 34.94 43.52 34.94Q40.96 34.94 39.45 36.19Q37.94 37.44 37.94 39.87Q37.94 41.96 39.16 43.28Q40.38 44.59 42.42 45.6Q43.99 46.4 44.43 46.93Q44.87 47.46 44.87 48.36Q44.87 49.25 44.51 49.64Q44.16 50.03 43.48 50.03Q42.8 50.03 42.43 49.6Q42.06 49.18 42.06 48.25V47.23H37.82Z"/></svg>',
};

/* ---------- UI helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const UI = {
  split(text, cls = '', base = 0) {
    let i = 0;
    const words = String(text).split(/(\s+|<br>)/).map(w => {
      if (w === '<br>') return '<br>';
      if (/^\s+$/.test(w)) return ' ';
      return `<span style="display:inline-block;white-space:nowrap">${[...w].map(c => `<span class="ch" style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`;
    }).join('');
    const label = String(text).replace(/<br>/g, ' ');
    return `<span class="split ${cls}" style="--base:${base}ms" aria-label="${esc(label)}"><span aria-hidden="true">${words}</span></span>`;
  },
  toast(msg, { err = false, action, onAction, ms = 3800 } = {}) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast' + (err ? ' err' : '');
    el.setAttribute('role', 'status');
    el.innerHTML = `${err ? '' : `<span class="tick">${ICON.check}</span>`}<span>${esc(msg)}</span>${action ? `<button>${esc(action)}</button>` : ''}`;
    box.appendChild(el);
    const kill = () => { el.classList.add('out'); setTimeout(() => el.remove(), 400); };
    if (action) el.querySelector('button').onclick = () => { onAction && onAction(); kill(); };
    setTimeout(kill, ms);
  },
  modal(html, { onClose, cls = '' } = {}) {
    const m = $('#modal');
    m.innerHTML = `<div class="scrim" data-close></div><div class="sheet ${cls}" role="dialog" aria-modal="true"><button class="icon-btn x" data-close aria-label="${t('misc.close')}">${ICON.x}</button>${html}</div>`;
    UI._onClose = onClose;
    document.body.classList.add('locked');
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('open')));
    m.onclick = e => { if (e.target.closest('[data-close]')) UI.closeModal(); };
    setTimeout(() => { const f = m.querySelector('input, button:not(.x)'); f && f.focus({ preventScroll: true }); }, 350);
    return m.querySelector('.sheet');
  },
  closeModal() {
    const m = $('#modal');
    if (!m.classList.contains('open')) return;
    m.classList.remove('open');
    document.body.classList.remove('locked');
    const cb = UI._onClose; UI._onClose = null;
    setTimeout(() => { if (!m.classList.contains('open')) m.innerHTML = ''; }, 600);
    cb && cb();
  },
  reveal(root) {
    const els = $$('.rv, .rv-card', root);
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(e => io.observe(e));
  },
  countUp(root) {
    $$('[data-count]', root).forEach(el => {
      const to = Number(el.dataset.count), dur = 1300, t0 = performance.now();
      if (reduced()) { el.textContent = Math.round(to).toLocaleString('ru-RU'); return; }
      const step = now => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  animateBars(root) {
    requestAnimationFrame(() => setTimeout(() => {
      $$('[data-w]', root).forEach(el => el.style.width = el.dataset.w);
      $$('[data-off]', root).forEach(el => el.style.strokeDashoffset = el.dataset.off);
    }, 120));
  },
  magnet(root) {
    if (reduced() || matchMedia('(hover: none)').matches) return;
    $$('.btn, .fab', root).forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .18}px)`;
      });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  },
};

const fmt = (v, d = 0) => (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString(numLocale());
const nUnit = k => k === 'kcal' ? t('u.kcal') : k.endsWith('_mg') ? t('u.mg') : t('u.g');
const LOCALES = { ru: ['ru-RU', 'ru-RU'], en: ['en-GB', 'en-US'], uz: ['uz-Latn-UZ', 'ru-RU'] }; // числа в Узбекистане пишут как в ru: «2 400», «1,5»
const locale = () => (LOCALES[Store.state.settings.lang] || LOCALES.ru)[0];
const numLocale = () => (LOCALES[Store.state.settings.lang] || LOCALES.ru)[1];
// короткая строка на текущем языке; узбекский без перевода падает на русский
// даты: в браузерах нет узбекских названий месяцев (выходит «M11»), поэтому для uz — свои
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const UZ_DAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
function fmtDate(d, o = {}) {
  if (Store.state.settings.lang !== 'uz') return o.weekday || o.month ? new Intl.DateTimeFormat(locale(), o).format(d) : d.toLocaleDateString(locale());
  if (o.weekday) return o.weekday === 'short' ? UZ_DAYS[d.getDay()].slice(0, 2).replace(/^./, c => c.toUpperCase()) : UZ_DAYS[d.getDay()];
  if (o.month) return `${d.getDate()}-${o.month === 'short' ? UZ_MONTHS[d.getMonth()].slice(0, 3) : UZ_MONTHS[d.getMonth()]}`;
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
const tr = (ru, en, uz) => ({ en, uz }[Store.state.settings.lang] ?? ru);
function dayTitle(key) {
  const d = parseKey(key);
  const wd = fmtDate(d, { weekday: 'long' });
  const dm = fmtDate(d, { day: 'numeric', month: 'long' });
  return { wd, dm };
}
function relDay(key) {
  const tk = todayKey();
  if (key === tk) return t('d.today');
  if (key === addDays(tk, -1)) return t('d.yesterday');
  if (key === addDays(tk, 1)) return t('d.tomorrow');
  return fmtDate(parseKey(key), { day: 'numeric', month: 'short' });
}
const guessMeal = () => { const h = new Date().getHours(); return h >= 5 && h < 11 ? 'breakfast' : h < 16 ? 'lunch' : h < 21 ? 'dinner' : 'snack'; };
const dayNumber = () => Math.max(1, Math.floor((Date.now() - (Store.state.settings.createdAt || Date.now())) / 864e5) + 1);
const ownerName = () => (Store.state.profile && Store.state.profile.name) || '';
const target = k => (Store.state.targets && Store.state.targets[k]) || 0;
const macroLine = n => `${t('n.p')} ${fmt(n.protein_g)} · ${t('n.f')} ${fmt(n.fat_g)} · ${t('n.c')} ${fmt(n.carbs_g)}`;

/* ---------- theme ---------- */
const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
const effTheme = () => { const th = Store.state.settings.theme || 'auto'; return th === 'auto' ? (darkMQ.matches ? 'dark' : 'light') : th; };
function applyTheme() {
  const th = effTheme();
  document.documentElement.dataset.theme = th;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta && meta.setAttribute('content', th === 'dark' ? '#0E0F11' : '#E8E9ED');
  $$('[data-theme-toggle]').forEach(b => b.innerHTML = th === 'dark' ? ICON.sun : ICON.moon);
}
const themeBtn = () => `<button class="theme-btn" data-theme-toggle aria-label="${t('theme.toggle')}" title="${t('theme.toggle')}">${effTheme() === 'dark' ? ICON.sun : ICON.moon}</button>`;
// Смена темы: новая тема «растекается» кругом из точки клика (View Transitions API)
function switchTheme(next, x = innerWidth / 2, y = 0) {
  const run = () => { Store.state.settings.theme = next; Store.save(); applyTheme(); };
  if (!document.startViewTransition || reduced()) return run();
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(run);
  vt.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 750, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
  )).catch(() => {});
}

const foodTag = f => cuisineName(f.cuisine) || (f.src === 'usda' ? 'USDA' : 'DB');

const syncBadge = () => `<span class="sync" data-sync data-state="${Cloud.status}" title="${esc(Cloud.user ? Cloud.user.email : '')}"><i></i><span>${t('sync.' + Cloud.status)}</span></span>`;

/* ---------- router ---------- */
let draft = null;
const Router = {
  first: true,
  parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    return { name: parts[0] || 'diary', parts, q };
  },
  go(hash) { if (location.hash === hash) Router.render(); else location.hash = hash; },
  async render() {
    const r = Router.parse();
    let main = $('#view');
    const onb =!Store.state.settings.onboarded;
    if (onb && !['welcome', 'auth', 'reset', 'verify'].includes(r.name)) { history.replaceState(null, '', '#/welcome'); return Router.render(); }
    if ((!onb && r.name === 'welcome') || (r.name === 'auth' && Cloud.user)) { history.replaceState(null, '', '#/'); return Router.render(); }
    const view = Views[r.name] || Views.diary;
    const doWipe = !Router.first && !reduced() && !Router.silent;
    Router.silent = false;
    if (doWipe) {
      const w = $('#wipe');
      w.className = 'cover';
      await new Promise(res => setTimeout(res, 470));
    }
    UI._onClose = null;
    UI.closeModal();
    Shell.update(r.name, onb);
    // свежий <main> на каждый экран — обработчики прошлого экрана не накапливаются
    const fresh = main.cloneNode(false);
    main.replaceWith(fresh);
    main = fresh;
    main.className = '';
    main.innerHTML = view.html(r);
    window.scrollTo(0, 0);
    void main.offsetWidth;
    main.className = 'view-enter';
    view.mount && view.mount(main, r);
    UI.reveal(main); UI.countUp(main); UI.animateBars(main); UI.magnet(main);
    if (doWipe) { const w = $('#wipe'); w.className = 'reveal'; setTimeout(() => w.className = '', 650); }
    Router.first = false;
  },
};

/* ---------- shell ---------- */
const NAV = [['diary', '#/', 'book'], ['stats', '#/stats', 'chart'], ['foods', '#/foods', 'list'], ['chat', '#/chat', 'chat'], ['settings', '#/settings', 'gear']];
const Shell = {
  update(name, onb) {
    const top = $('#top'), dock = $('#dock'), fab = $('#fab');
    top.hidden = dock.hidden = onb;
    const active = name === 'day' || name === 'meal' ? 'diary' : name;
    top.innerHTML = `
      <a class="brand" href="#/" aria-label="Eatlas">
        <span class="logo">${ICON.mono}</span>
        <span><b>Eatlas</b><br><span class="serif">${esc(t('app.of'))}${ownerName() ? ' · ' + esc(ownerName()) : ''}</span></span>
      </a>
      <nav class="nav" aria-label="main">${NAV.map(([k, h]) => `<a href="${h}" class="${active === k ? 'on' : ''}">${t('nav.' + k)}</a>`).join('')}</nav>
      ${Cloud.user ? syncBadge() : ''}
      ${themeBtn()}
      <span class="when">${fmtDate(new Date(), { day: 'numeric', month: 'long' })} · ${t('d.day')} ${String(dayNumber()).padStart(3, '0')}</span>`;
    dock.innerHTML = NAV.map(([k, h, ic]) => `<a href="${h}" class="${active === k ? 'on' : ''}">${ICON[ic]}<span>${t('nav.' + k)}</span></a>`).join('');
    const showFab = !onb && ['diary', 'day', 'stats', 'meal'].includes(name);
    fab.hidden = !showFab;
    if (showFab) {
      const r = Router.parse();
      const date = name === 'day' ? r.parts[1] : name === 'meal' ? r.parts[1] : todayKey();
      fab.href = `#/add?date=${date}`;
    }
    fab.setAttribute('aria-label', t('nav.add'));
    document.documentElement.lang = Store.state.settings.lang;
  },
};

/* ---------- sheets ---------- */
/* ---------- поиск по базе и каталогу ---------- */
const unitLbl = o => (o && o.liquid ? t('u.ml') : t('u.g'));
const isApprox = src => src === 'estimate' || src === 'catalog_ai' || src === 'ai_estimate';
// пометки позиции каталога: вег / веган / без свинины и алкоголя, аллергены
const dietTags = (d, short) => {
  if (!d) return [];
  const out = [];
  if (d.vegan) out.push(t('diet.vegan')); else if (d.vegetarian) out.push(t('diet.veg'));
  if (!short && !d.pork && !d.alcohol) out.push(t('diet.noPorkAlc'));
  return out;
};
const dietHtml = d => {
  if (!d) return '';
  const tags = dietTags(d).map(x => `<span class="tag lime">${esc(x)}</span>`).join('');
  const al = d.allergens.length ? d.allergens.map(a => t('al.' + a)).join(', ') : t('diet.noAllergens');
  return `<div class="diet"><div class="row" style="gap:6px;flex-wrap:wrap">${tags}</div><p class="mono muted"><b>${t('diet.allergens')}:</b> ${esc(al)}<br>${t('diet.note')}</p></div>`;
};
const isProfile = f => /^[pda]_/.test(f.id); // служебные профили для подбора состава — в поиске не показываем
function searchAll(q, limit = 40) {
  const res = searchFoods(q, 30).filter(r => r.kind !== 'db' || (!isProfile(r.food) && (!r.food.opts.alc || Catalog.allowAlcohol()))).slice(0, 14);
  const seen = new Set(res.map(r => normalize(r.kind === 'db' ? foodName(r.food) : r.my.name)));
  for (const e of Catalog.search(q, limit)) {
    if (seen.has(e.norm)) continue;
    seen.add(e.norm); res.push({ kind: 'cat', e });
  }
  return res.slice(0, limit);
}
function resultRow(r, i) {
  if (r.kind === 'cat') {
    const est = Catalog.estimate(r.e);
    const dt = r.e.type === 'drinks' ? [] : dietTags(Catalog.diet(r.e), true);
    return `<button data-i="${i}"><span>${esc(Catalog.name(r.e))}${r.e.alc ? ' <i class="b18">18+</i>' : ''}<br><small>${isApprox(est.source) ? '≈ ' : ''}${fmt(est.per100.kcal)} ${t('u.kcal')} / 100 ${unitLbl(est.opts)} · ${esc(groupShortName(r.e.group))} · ${esc(Catalog.catName(r.e.c))}${dt.length ? ' · ' + esc(dt.join(', ')) : ''}</small></span><small>${t('cat.title')}</small></button>`;
  }
  const name = r.kind === 'db' ? foodName(r.food) : r.my.name, p = r.kind === 'db' ? r.food.per100 : r.my.per100;
  const unit = r.kind === 'db' ? unitLbl(r.food.opts) : t('u.g');
  return `<button data-i="${i}"><span>${esc(name)}${r.kind === 'db' && r.food.opts.alc ? ' <i class="b18">18+</i>' : ''}<br><small>${fmt(p.kcal)} ${t('u.kcal')} / 100 ${unit} · ${macroLine(p)}</small></span><small>${r.kind === 'my' ? t('src.user') : foodTag(r.food)}</small></button>`;
}
function resultItem(r) {
  if (r.kind === 'cat') return makeItem(Catalog.toItem(r.e));
  if (r.kind === 'db') return itemFromFood(r.food, null);
  return makeItem({ name: r.my.name, grams: r.my.portion || 100, per100: r.my.per100, source: 'user', confidence: 1, grams_source: 'user', origin: 'manual' });
}

function searchSheet({ title, query = '', onPick }) {
  const sheet = UI.modal(`
    <div class="kicker">${t('foods.search')}</div>
    <h2 class="h2" style="margin:10px 0 16px">${esc(title)}</h2>
    <div class="unitfield"><input class="input" id="sq" placeholder="${esc(t('cat.search.ph'))}" value="${esc(query)}" autocomplete="off"><em>${ICON.search.replace('<svg', '<svg width="18" height="18"')}</em></div>
    <div class="search-res" id="sr"></div>`);
  const inp = $('#sq', sheet), out = $('#sr', sheet);
  let res = [];
  const run = () => {
    res = inp.value.trim() ? searchAll(inp.value, 40) : [];
    out.innerHTML = res.map(resultRow).join('') || (inp.value ? `<p class="muted" style="padding:10px">${t('cat.nothing')}</p>` : '');
  };
  out.onclick = e => { const b = e.target.closest('button[data-i]'); if (b) onPick(resultItem(res[Number(b.dataset.i)])); };
  inp.oninput = run; run();
  Catalog.load().then(run).catch(() => {}); // каталог догружается — результаты обновятся
}

function logSheet(tpl, { date = todayKey(), meal = guessMeal(), onDone } = {}) {
  let grams = tpl.grams || 100, m = meal;
  const liquid = !!(tpl.opts && tpl.opts.liquid);
  const sheet = UI.modal(`
    <div class="kicker">${t('d.add.to')} · ${esc(relDay(date))}</div>
    <h2 class="h2" style="margin:10px 0 18px">${esc(tpl.name)}</h2>
    <div class="grid" style="gap:16px">
      ${tpl.source === 'estimate' || tpl.source === 'catalog_ai' ? `<div class="callout" id="lest" style="font-size:14px">${esc(tpl.source === 'estimate' ? t('cat.estNote', { basis: tpl.basis || '—' }) : t('cat.recipeNote'))}${aiReady() ? ` <button class="link" id="lai">${t('cat.refine')}</button>` : ''}</div>` : ''}
      ${dietHtml(tpl.diet)}
      <div class="row"><b class="h1 num" id="lk" style="font-size:72px">0</b><span class="mono muted">${t('u.kcal')}</span><span class="spacer"></span><span class="mono muted" id="lm"></span></div>
      <input type="range" id="lr" min="1" max="${Math.max(500, Math.ceil(grams * 3 / 50) * 50)}" value="${grams}">
      <label class="field"><span>${liquid ? t('misc.volume') + ', ' + t('u.ml') : t('misc.grams') + ', ' + massUnit()}</span><input class="input" id="lg" type="number" inputmode="decimal" value="${liquid ? Math.round(grams) : massOut(grams)}"></label>
      <div class="seg" id="lmeal">${MEALS.map(x => `<button aria-pressed="${x === m}" data-m="${x}">${t('meal.' + x)}</button>`).join('')}</div>
      <button class="btn big" id="lok">${t('foods.add')}<span class="arr">${ICON.arrow}</span></button>
    </div>`);
  const upd = () => {
    const n = itemNutrients({ grams, per100: tpl.per100 });
    $('#lk', sheet).textContent = fmt(n.kcal);
    $('#lm', sheet).textContent = macroLine(n);
    const r = $('#lr', sheet); r.style.setProperty('--p', (grams / r.max * 100) + '%');
  };
  $('#lr', sheet).oninput = e => { grams = Number(e.target.value); $('#lg', sheet).value = liquid ? grams : massOut(grams); upd(); };
  $('#lg', sheet).oninput = e => { grams = clamp((liquid ? Number(e.target.value) : massIn(e.target.value)) || 0, 0, 5000); $('#lr', sheet).value = grams; upd(); };
  $('#lmeal', sheet).onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; m = b.dataset.m; $$('#lmeal button', sheet).forEach(x => x.setAttribute('aria-pressed', x === b)); };
  // позиция каталога без состава: уточняем по названию через ИИ
  const lai = $('#lai', sheet);
  lai && (lai.onclick = async () => {
    lai.disabled = true; lai.textContent = t('st.recognize') + '…';
    try {
      const r = await aiAnalyze({ text: `${tpl.name}, ${Math.round(grams)} ${liquid ? 'мл' : 'г'}` });
      const tot = sumN(r.items), g = r.items.reduce((a, it) => a + it.grams, 0) || grams;
      const per100 = {}; NUTRIENT_KEYS.forEach(k => per100[k] = tot[k] / g * 100);
      Object.assign(tpl, { per100, source: 'ai_estimate', basis: null, analysisModel: r.model, confidence: r.items.reduce((a, it) => a + it.confidence, 0) / r.items.length });
      $('#lest', sheet).innerHTML = `<span class="tag lime">${ICON.check.replace('<svg', '<svg width="12" height="12"')} ${t('cat.refined')}</span>`;
      upd();
    } catch (ex) {
      lai.disabled = false; lai.textContent = t('cat.refine');
      UI.toast(t('err.' + (ex.code || 'AI_UNAVAILABLE')), { err: true });
    }
  });
  let done = false; // двойное нажатие не должно записать блюдо дважды
  $('#lok', sheet).onclick = () => {
    if (done || !(grams > 0)) return;
    done = true;
    const it = makeItem(Object.assign({}, tpl, { grams, origin: tpl.origin || 'manual', confidence: tpl.confidence ?? 1 }));
    Store.addItems(date, m, [it]);
    UI.closeModal();
    UI.toast(`${t('res.added')} · ${t('meal.' + m)}`);
    onDone && onDone(date, m);
  };
  upd();
}

function sourceSheet(it) {
  const src = it.source || 'local';
  const desc = src === 'estimate' ? t('src.estimate.d', { basis: it.basis || '—' }) : t('src.' + src + '.d');
  UI.modal(`
    <div class="kicker">${t('res.where')}</div>
    <h2 class="h2" style="margin:10px 0 14px">${esc(it.name)}</h2>
    <div class="row" style="margin-bottom:14px">
      <span class="tag ${isApprox(src) ? 'warn' : 'dark'}">${t('src.' + src)}</span>
      <span class="tag">${t('gs.' + (it.grams_source || 'standard'))}</span>
      <span class="tag">${t('res.conf')} ${Math.round((it.confidence ?? 1) * 100)}%</span>
    </div>
    <p class="lead" style="margin:0 0 18px">${esc(desc)}</p>
    ${it.diet ? `<div style="margin:0 0 18px">${dietHtml(it.diet)}</div>` : ''}
    <table class="ntable"><thead><tr><th></th><th class="r">${t('res.per100')}</th><th class="r">${fmtMass(it.grams)}</th></tr></thead><tbody>
      ${NUTRIENT_KEYS.map(k => `<tr><td>${t('n.' + k)}</td><td class="r num">${fmt(it.per100[k], 1)} ${nUnit(k)}</td><td class="r num"><b>${fmt(itemNutrients(it)[k], 1)}</b> ${nUnit(k)}</td></tr>`).join('')}
    </tbody></table>
    <p class="disc">nutrient = per_100g × grams / 100${it.analysisModel ? ` · ${esc(it.analysisModel)} · ${PROMPT_VERSION}` : ''}</p>`);
}

function itemSheet(date, itemId, onChange) {
  const found = Store.findItem(date, itemId);
  if (!found) return;
  const it = found.item;
  let meal = found.meal;
  const max = Math.max(500, Math.ceil(it.grams * 3 / 50) * 50);
  const sheet = UI.modal(`
    <div class="kicker">${t('meal.' + meal)} · ${esc(relDay(date))}</div>
    <h2 class="h2" style="margin:10px 0 18px">${esc(it.name)}</h2>
    <div class="grid" style="gap:16px">
      <div class="row"><b class="h1 num" id="ik" style="font-size:72px"></b><span class="mono muted">${t('u.kcal')}</span><span class="spacer"></span><span class="mono muted" id="im"></span></div>
      <input type="range" id="ir" min="1" max="${max}" value="${it.grams}" aria-label="${t('misc.grams')}">
      <label class="field"><span>${t('misc.grams')}, ${massUnit()}</span><input class="input" id="ig" type="number" inputmode="decimal" value="${massOut(it.grams)}"></label>
      <div class="field"><span>${t('meal.move')}</span><div class="seg" id="imeal">${MEALS.map(x => `<button aria-pressed="${x === meal}" data-m="${x}">${t('meal.' + x)}</button>`).join('')}</div></div>
      <div class="row">
        <button class="pill" id="isrc">${ICON.info.replace('<svg', '<svg width="16" height="16"')} ${t('res.where')}</button>
        <button class="pill" id="imy">${ICON.plus.replace('<svg', '<svg width="14" height="14"')} ${t('foods.tomy')}</button>
        <span class="spacer"></span>
        <button class="pill warn" id="idel"><span class="tick">${ICON.trash}</span>${t('res.delete')}</button>
      </div>
    </div>`, { onClose: onChange });
  const upd = () => {
    const n = itemNutrients(it);
    $('#ik', sheet).textContent = fmt(n.kcal);
    $('#im', sheet).textContent = macroLine(n);
    const r = $('#ir', sheet); r.style.setProperty('--p', (it.grams / r.max * 100) + '%');
  };
  const save = () => { it.edited = true; Store.save(); };
  $('#ir', sheet).oninput = e => { it.grams = Number(e.target.value); $('#ig', sheet).value = massOut(it.grams); upd(); save(); };
  $('#ig', sheet).oninput = e => { const g = massIn(e.target.value); if (g > 0) { it.grams = clamp(g, 1, 5000); $('#ir', sheet).value = it.grams; upd(); save(); } };
  $('#imeal', sheet).onclick = e => {
    const b = e.target.closest('[data-m]'); if (!b || b.dataset.m === meal) return;
    const day = Store.day(date);
    day.meals[meal] = day.meals[meal].filter(x => x.id !== it.id);
    meal = b.dataset.m; day.meals[meal].push(it); Store.save();
    $$('#imeal button', sheet).forEach(x => x.setAttribute('aria-pressed', x === b));
  };
  $('#isrc', sheet).onclick = () => { UI.closeModal(); setTimeout(() => sourceSheet(it), 450); };
  $('#imy', sheet).onclick = () => {
    Store.state.myFoods.unshift({ id: uid(), name: it.name, per100: Object.assign({}, it.per100), portion: Math.round(it.grams) });
    Store.save(); UI.toast(t('foods.saved'));
  };
  $('#idel', sheet).onclick = () => {
    const day = Store.day(date), idx = day.meals[meal].findIndex(x => x.id === it.id), m0 = meal;
    day.meals[meal].splice(idx, 1); Store.save();
    UI.closeModal();
    UI.toast(t('res.deleted'), { action: t('res.undo'), onAction: () => { Store.day(date).meals[m0].splice(idx, 0, it); Store.save(); Router.silent = true; Router.render(); } });
  };
  upd();
}

/* ---------- views ---------- */
const Views = {};

/* ===== Онбординг ===== */
let onb = { step: 0, name: '', sex: 'f', age: '', height: '', weight: '', pregnant: false, activity: 'light', goal: 'maintain', targets: null };
Views.welcome = {
  html() {
    if (onb.step === 0 && Cloud.user) { onb.step = 1; onb.name = onb.name || Cloud.user.name || ''; } // уже вошёл — сразу к анкете
    const s = onb.step;
    const ghost = `<div class="ghost outline" aria-hidden="true"><div class="track"><span>Eatlas · ${t('app.diary')} · </span><span>Eatlas · ${t('app.diary')} · </span></div></div>`;
    const head = `<div class="row" style="position:relative;z-index:1"><span class="brand"><span class="logo">${ICON.mono}</span><b>Eatlas</b></span><span class="spacer"></span>${themeBtn()}
      <div class="seg" id="olang"><button aria-pressed="${Store.state.settings.lang === 'ru'}" data-l="ru">RU</button><button aria-pressed="${Store.state.settings.lang === 'en'}" data-l="en">EN</button><button aria-pressed="${Store.state.settings.lang === 'uz'}" data-l="uz">UZ</button></div></div>`;
    if (s === 0) return `<div class="onb">${head}
      <div class="content">
        <span class="kicker rv">${t('onb.kicker')}</span>
        <h1 class="mega">${UI.split(t('onb.hello').replace('. ', '.<br>'), 'hoverable')}</h1>
        <p class="lead rv" style="--d:4">${Cloud.available ? t('onb.lead.cloud') : t('onb.lead')}</p>
        <div class="row rv" style="--d:6">
          ${['onb.s1', 'onb.s2', 'onb.s3', 'onb.s4'].map(k => `<span class="pill"><span class="tick">${ICON.check}</span>${t(k)}</span>`).join('')}
        </div>
        <p class="muted rv" style="--d:7;font-size:14px;margin:0">${t('priv.welcome', { link: `<a href="${policyHref()}" target="_blank" rel="noopener">${t('priv.name')}</a>` })}</p>
      </div>
      <div class="nav-b">${Cloud.available
        ? `<button class="link" data-next>${t('auth.local')}</button>
           <div class="row"><a class="btn light big" href="#/auth?mode=login">${t('auth.submit.login')}<span class="arr">${ICON.arrow}</span></a>
           <a class="btn big" href="#/auth?mode=register">${t('auth.submit.register')}<span class="arr">${ICON.arrow}</span></a></div>`
        : `<span></span><button class="btn big" data-next>${t('onb.start')}<span class="arr">${ICON.arrow}</span></button>`}</div>
      ${ghost}</div>`;
    const steps = `<div class="steps"><span>${t('onb.step')} 0${s}</span>${[1, 2, 3, 4].map(i => `<i class="${i <= s ? 'on' : ''}"></i>`).join('')}<span class="muted">/ 04</span></div>`;
    let body = '';
    if (s === 1) body = `
      <h1 class="h1">${UI.split(t('onb.s1'))}</h1>
      <div class="formgrid rv">
        <label class="field" style="grid-column:1/-1"><span>${t('onb.name')}</span><input class="input big" id="o-name" value="${esc(onb.name)}" placeholder="${esc(t('onb.name.ph'))}" maxlength="40"></label>
        <div class="field" style="grid-column:1/-1"><span>${t('onb.sex')}</span><div class="seg" id="o-sex"><button aria-pressed="${onb.sex === 'f'}" data-v="f">${t('onb.sex.f')}</button><button aria-pressed="${onb.sex === 'm'}" data-v="m">${t('onb.sex.m')}</button></div></div>
        <label class="field"><span>${t('onb.age')}</span><input class="input big" id="o-age" type="number" inputmode="numeric" value="${onb.age}" min="10" max="100"></label>
        <label class="field"><span>${t('onb.height')}, ${t('u.cm')}</span><input class="input big" id="o-height" type="number" inputmode="numeric" value="${onb.height}" min="120" max="230"></label>
        <label class="field"><span>${t('onb.weight')}, ${bodyUnit()}</span><input class="input big" id="o-weight" type="number" inputmode="decimal" value="${onb.weight ? bodyOut(onb.weight) : ''}"></label>
        ${onb.sex === 'f' ? `<label class="check" style="grid-column:1/-1"><input type="checkbox" id="o-preg" ${onb.pregnant ? 'checked' : ''}> ${t('onb.pregnant')}</label>` : ''}
      </div>`;
    if (s === 2) body = `
      <h1 class="h1">${UI.split(t('onb.s2'))}</h1>
      <div class="choices" id="o-act">${Object.keys(ACTIVITY).map((k, i) => `<button class="choice rv-card" style="--d:${i}" aria-pressed="${onb.activity === k}" data-v="${k}"><span class="idx">/ 00${i + 1} · ×${ACTIVITY[k]}</span><b>${t('act.' + k)}</b><span>${t('act.' + k + '.d')}</span></button>`).join('')}</div>`;
    if (s === 3) body = `
      <h1 class="h1">${UI.split(t('onb.s3'))}</h1>
      <div class="choices" id="o-goal">${Object.keys(GOAL_K).map((k, i) => `<button class="choice rv-card" style="--d:${i};min-height:180px" aria-pressed="${onb.goal === k}" data-v="${k}"><span class="idx">/ 00${i + 1}</span><b style="font-size:40px">${t('goal.' + k)}</b><span>${t('goal.' + k + '.d')}</span></button>`).join('')}</div>`;
    if (s === 4) {
      const p = { sex: onb.sex, age: +onb.age, height: +onb.height, weight: +onb.weight, activity: onb.activity, goal: onb.goal, pregnant: onb.pregnant };
      const auto = autoTargetsAllowed(p);
      const c = calcTargets(p);
      if (!onb.targets) onb.targets = auto ? Object.assign({}, c.targets) : Object.assign({}, c.targets, { kcal: '', protein_g: '', fat_g: '', carbs_g: '', source: 'manual' });
      const tg = onb.targets;
      body = `
        <h1 class="h1">${UI.split(t('onb.s4'))}</h1>
        ${auto ? `<div class="row rv"><span class="pill"><span class="tick">${ICON.check}</span>${t('onb.formula')}</span><span class="pill ghosty">${t('onb.bmr')}: <b>${fmt(c.bmr)}</b></span><span class="pill ghosty">${t('onb.tdee')}: <b>${fmt(c.tdee)}</b></span></div>` : `<div class="callout warn rv">${t('onb.noauto')}</div>`}
        ${auto && c.floored ? `<div class="callout rv">${t('onb.floor', { n: minKcal(p.sex) })}</div>` : ''}
        <div class="tgrid rv" id="o-tg" style="--d:2">
          <div class="tcell hero"><label>${t('n.kcal')}, ${t('u.kcal')}</label><input type="number" inputmode="numeric" data-k="kcal" value="${tg.kcal}" aria-label="${t('n.kcal')}, ${t('u.kcal')}"></div>
          ${['protein_g', 'fat_g', 'carbs_g', 'fiber_g'].map(k => `<div class="tcell"><label>${t('n.' + k)}, ${t('u.g')}</label><input type="number" inputmode="numeric" data-k="${k}" value="${tg[k]}" aria-label="${t('n.' + k)}, ${t('u.g')}"></div>`).join('')}
        </div>
        <div id="o-warn"></div>
        <p class="mono muted rv">${t('onb.edit')} · ${t('res.disclaimer')}</p>`;
    }
    return `<div class="onb">${head}<div class="content">${steps}${body}</div>
      <div class="nav-b"><button class="btn light" data-back>${t('onb.back')}<span class="arr">${ICON.left}</span></button>
      <button class="btn big" data-next>${s === 4 ? t('onb.done') : t('onb.next')}<span class="arr">${ICON.arrow}</span></button></div>${ghost}</div>`;
  },
  mount(el) {
    const s = onb.step;
    $('#olang', el).onclick = e => { const b = e.target.closest('[data-l]'); if (!b) return; Store.state.settings.lang = b.dataset.l; Store.save(); Router.silent = true; Router.render(); };
    const seg = (id, key, rerender) => { const g = $(id, el); g && (g.onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; onb[key] = b.dataset.v; onb.targets = null; $$('[data-v]', g).forEach(x => x.setAttribute('aria-pressed', x === b)); if (rerender) { collect(); Router.silent = true; Router.render(); } }); };
    const collect = () => {
      if (s !== 1) return;
      onb.name = $('#o-name', el).value.trim();
      onb.age = $('#o-age', el).value; onb.height = $('#o-height', el).value;
      const w = $('#o-weight', el).value; onb.weight = w ? round1(bodyIn(w)) : '';
      const pg = $('#o-preg', el); onb.pregnant = onb.sex === 'f' && !!(pg && pg.checked);
      onb.targets = null;
    };
    seg('#o-sex', 'sex', true); seg('#o-act', 'activity'); seg('#o-goal', 'goal');
    const warnLow = () => {
      const box = $('#o-warn', el); if (!box) return;
      const k = Number(onb.targets.kcal), min = minKcal(onb.sex);
      box.innerHTML = k && k < min ? `<div class="callout warn">${t('set.low', { n: min })}</div>` : '';
    };
    const tg = $('#o-tg', el);
    if (tg) { tg.oninput = e => { const k = e.target.dataset.k; if (!k) return; onb.targets[k] = e.target.value; onb.targets.source = 'manual'; warnLow(); }; warnLow(); }
    const next = $('[data-next]', el), back = $('[data-back]', el);
    back && (back.onclick = () => { collect(); onb.step = Math.max(0, s - 1); Router.render(); });
    next.onclick = () => {
      if (s === 1) {
        collect();
        if (!profileValid({ age: +onb.age, height: +onb.height, weight: +onb.weight })) { UI.toast(t('err.range'), { err: true }); return; }
      }
      if (s === 4) {
        const tgt = {};
        Object.keys(onb.targets).forEach(k => tgt[k] = k === 'source' ? onb.targets[k] : Number(onb.targets[k]) || 0);
        if (!tgt.kcal) { UI.toast(t('err.range'), { err: true }); return; }
        if (!tgt.protein_g && !tgt.fat_g && !tgt.carbs_g) { tgt.protein_g = Math.round(tgt.kcal * .2 / 4); tgt.fat_g = Math.round(tgt.kcal * .28 / 9); tgt.carbs_g = Math.round(tgt.kcal * .52 / 4); }
        Store.state.profile = { name: onb.name, sex: onb.sex, age: +onb.age, height: +onb.height, weight: +onb.weight, activity: onb.activity, goal: onb.goal, pregnant: onb.pregnant };
        Store.state.targets = tgt;
        Store.state.settings.onboarded = true;
        Store.state.settings.createdAt = Store.state.settings.createdAt || Date.now();
        Store.state.weights.push({ date: todayKey(), kg: +onb.weight });
        Store.save();
        Router.go('#/');
        return;
      }
      onb.step = s + 1; Router.render();
    };
  },
};

// допустимые значения профиля — одни для анкеты, настроек и записи веса
const BODY_KG = [30, 300];
const profileValid = p => p.age >= 10 && p.age <= 100 && p.height >= 120 && p.height <= 230 && p.weight >= BODY_KG[0] && p.weight <= BODY_KG[1];
const resetOnb = () => { onb = { step: 0, name: '', sex: 'f', age: '', height: '', weight: '', pregnant: false, activity: 'light', goal: 'maintain', targets: null }; };

/* Текст ошибки сервера по коду; неизвестный код — общая ошибка */
const errMsg = ex => { const m = t('err.' + ((ex && ex.code) || 'SERVER_ERROR')); return m.startsWith('err.') ? t('err.SERVER_ERROR') : m; };
const authTop = () => `<div class="row" style="position:relative;z-index:1"><a class="brand" href="#/"><span class="logo">${ICON.mono}</span><b>Eatlas</b></a><span class="spacer"></span>${themeBtn()}</div>`;

/* «Забыл пароль?» — письмо со ссылкой для нового пароля */
function forgotSheet(prefill = '') {
  const sh = UI.modal(`<div class="kicker">${t('auth.account')}</div><h2 class="h2" style="margin:10px 0 14px">${t('auth.forgot.title')}</h2><p class="lead">${t('auth.forgot.lead')}</p>
    <form id="fgf" class="grid" style="gap:14px;margin-top:16px" novalidate>
      <label class="field"><span>${t('auth.email')}</span><input class="input" name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" value="${esc(prefill)}" required></label>
      <div class="autherr" id="fgerr" role="alert"></div>
      <div class="row"><button class="btn" type="submit">${t('auth.forgot.send')}<span class="arr">${ICON.arrow}</span></button><button type="button" class="pill ghosty" data-close>${t('set.cancel')}</button></div>
    </form>`);
  const f = $('#fgf', sh), err = $('#fgerr', sh);
  f.onsubmit = async e => {
    e.preventDefault();
    err.textContent = '';
    const email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = t('err.INVALID_EMAIL'); f.email.focus(); return; }
    const b = f.querySelector('[type=submit]'); b.disabled = true;
    try {
      await Cloud.forgot(email);
      f.innerHTML = `<p class="lead" role="status"><b>${t('auth.forgot.sent')}</b></p><div class="row"><button type="button" class="btn light" data-close>${t('misc.close')}<span class="arr">${ICON.check}</span></button></div>`;
    } catch (ex) { err.textContent = errMsg(ex); b.disabled = false; }
  };
}

/* ===== Новый пароль по ссылке из письма: #/reset/<токен> ===== */
let resetToken = '';
Views.reset = {
  html(r) {
    if (r.parts[1]) resetToken = r.parts[1];
    return `<div class="onb auth">${authTop()}
      <div class="content">
        <span class="kicker rv">Eatlas · ${t('auth.forgot.title').toLowerCase()}</span>
        <h1 class="h1">${UI.split(t('auth.reset.title'), 'hoverable')}</h1>
        <p class="lead rv" style="--d:3">${t('auth.reset.lead')}</p>
        <form class="card authform rv" id="rsf" style="--d:5" novalidate>
          <label class="field"><span>${t('auth.pw.new')} · ${t('auth.pw.hint')}</span>
            <span class="pwwrap"><input class="input" name="password" type="password" autocomplete="new-password" required><button type="button" class="pwtoggle" data-pw>${t('auth.show')}</button></span></label>
          <div class="autherr" id="rserr" role="alert"></div>
          <button class="btn big" type="submit">${t('auth.reset.save')}<span class="arr">${ICON.arrow}</span></button>
          <button type="button" class="link" id="rsagain" style="justify-self:start" hidden>${t('auth.reset.again')}</button>
        </form>
      </div>
      <div class="nav-b"><a class="btn light" href="#/auth?mode=login">${t('onb.back')}<span class="arr">${ICON.left}</span></a></div>
    </div>`;
  },
  mount(el) {
    // токен из письма убираем из адресной строки и истории браузера
    if (location.hash !== '#/reset') history.replaceState(null, '', '#/reset');
    const f = $('#rsf', el), err = $('#rserr', el), again = $('#rsagain', el);
    $('[data-pw]', el).onclick = e => {
      const show = f.password.type === 'password';
      f.password.type = show ? 'text' : 'password';
      e.target.textContent = t(show ? 'auth.hide' : 'auth.show');
    };
    again.onclick = () => forgotSheet();
    const fail = code => { err.textContent = errMsg({ code }); if (code === 'TOKEN_INVALID') again.hidden = false; };
    if (!resetToken) fail('TOKEN_INVALID');
    f.onsubmit = async e => {
      e.preventDefault();
      err.textContent = '';
      const pw = f.password.value;
      if (!resetToken) return fail('TOKEN_INVALID');
      if (pw.length < 10) { err.textContent = t('err.PASSWORD_TOO_SHORT'); f.password.focus(); return; }
      const btn = f.querySelector('[type=submit]'); btn.disabled = true;
      try {
        await Cloud.resetPassword(resetToken, pw);
        resetToken = '';
        UI.toast(t('auth.reset.done'), { ms: 5000 });
        if (Store.state.settings.onboarded) Router.go('#/'); else { resetOnb(); onb.step = 1; Router.go('#/welcome'); }
      } catch (ex) { fail(ex.code || 'SERVER_ERROR'); btn.disabled = false; }
    };
    setTimeout(() => f.password.focus({ preventScroll: true }), 500);
  },
};

/* ===== Подтверждение почты по ссылке из письма: #/verify/<токен> ===== */
let verifyToken = '', verifyOk = false;
async function sendVerifyMail(btn) {
  btn.disabled = true;
  try {
    const r = await Cloud.sendVerify();
    if (r && r.verified) { Router.silent = true; Router.render(); return; }
    UI.toast(t('auth.verify.sent', { email: Cloud.user.email }), { ms: 6000 });
  } catch (ex) { UI.toast(errMsg(ex), { err: true }); btn.disabled = false; }
}
Views.verify = {
  html(r) {
    if (r.parts[1]) { verifyToken = r.parts[1]; verifyOk = false; }
    return `<div class="onb auth">${authTop()}
      <div class="content">
        <span class="kicker rv">Eatlas · ${t('auth.verify.title').toLowerCase()}</span>
        <h1 class="h1" id="vh">${UI.split(t(verifyOk ? 'auth.verify.ok' : 'auth.verify.title'), 'hoverable')}</h1>
        <p class="lead rv" id="vlead" role="status" style="--d:3">${t(verifyOk ? 'auth.verify.okLead' : 'auth.verify.wait')}</p>
        <div class="row rv" id="vrow" style="--d:5"></div>
      </div>
    </div>`;
  },
  async mount(el) {
    if (location.hash !== '#/verify') history.replaceState(null, '', '#/verify');
    const lead = $('#vlead', el), row = $('#vrow', el);
    const home = `<a class="btn big" href="${Store.state.settings.onboarded ? '#/' : '#/welcome'}">${t('auth.verify.open')}<span class="arr">${ICON.arrow}</span></a>`;
    if (verifyOk) { row.innerHTML = home; return; }
    try {
      if (!verifyToken) throw { code: 'TOKEN_INVALID' };
      await Cloud.verifyEmail(verifyToken);
      verifyToken = ''; verifyOk = true;
      $('#vh', el).innerHTML = UI.split(t('auth.verify.ok'), 'hoverable');
      lead.textContent = t('auth.verify.okLead');
      row.innerHTML = home;
    } catch (ex) {
      lead.textContent = errMsg(ex);
      row.innerHTML = (Cloud.user && !Cloud.user.email_verified ? `<button class="btn" id="vsend">${t('auth.verify.send')}<span class="arr">${ICON.arrow}</span></button>` : '') + home.replace('btn big', 'btn light big');
      $('#vsend', el) && ($('#vsend', el).onclick = e => sendVerifyMail(e.currentTarget));
    }
  },
};

/* ===== Вход и регистрация ===== */
Views.auth = {
  html(r) {
    const reg = r.q.mode === 'register';
    return `<div class="onb auth">
      <div class="row" style="position:relative;z-index:1"><a class="brand" href="#/"><span class="logo">${ICON.mono}</span><b>Eatlas</b></a><span class="spacer"></span>${themeBtn()}</div>
      <div class="content">
        <span class="kicker rv">Eatlas · ${t(reg ? 'auth.register' : 'auth.login').toLowerCase()}</span>
        <h1 class="h1">${UI.split(t(reg ? 'auth.register' : 'auth.login'), 'hoverable')}</h1>
        <p class="lead rv" style="--d:3">${t(reg ? 'auth.lead.register' : 'auth.lead.login')}</p>
        <form class="card authform rv" id="authf" style="--d:5" novalidate>
          ${reg ? `<label class="field"><span>${t('auth.name')}</span><input class="input" name="displayName" autocomplete="nickname" maxlength="60" value="${esc(onb.name || (Store.state.profile && Store.state.profile.name) || '')}"></label>` : ''}
          <label class="field"><span>${t('auth.email')}</span><input class="input" name="email" type="email" inputmode="email" autocomplete="${reg ? 'email' : 'username'}" autocapitalize="off" spellcheck="false" required></label>
          <label class="field"><span>${t('auth.password')}${reg ? ' · ' + t('auth.pw.hint') : ''}</span>
            <span class="pwwrap"><input class="input" name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" required><button type="button" class="pwtoggle" data-pw>${t('auth.show')}</button></span></label>
          ${reg ? `<label class="check consent"><input type="checkbox" name="consent"> <span>${t('auth.consent', { link: `<a href="${policyHref()}" target="_blank" rel="noopener">${t('priv.name')}</a>` })}</span></label>` : `<button type="button" class="link" id="forgot" style="justify-self:start">${t('auth.forgot')}</button>`}
          <div class="autherr" id="autherr" role="alert"></div>
          <button class="btn big" type="submit">${t(reg ? 'auth.submit.register' : 'auth.submit.login')}<span class="arr">${ICON.arrow}</span></button>
          <a class="link" href="#/auth?mode=${reg ? 'login' : 'register'}">${t(reg ? 'auth.toLogin' : 'auth.toRegister')}</a>
        </form>
      </div>
      <div class="nav-b"><a class="btn light" href="${Store.state.settings.onboarded ? '#/settings' : '#/welcome'}">${t('onb.back')}<span class="arr">${ICON.left}</span></a></div>
    </div>`;
  },
  mount(el, r) {
    const reg = r.q.mode === 'register';
    const f = $('#authf', el), err = $('#autherr', el);
    $('[data-pw]', el).onclick = e => {
      const show = f.password.type === 'password';
      f.password.type = show ? 'text' : 'password';
      e.target.textContent = t(show ? 'auth.hide' : 'auth.show');
    };
    $('#forgot', el) && ($('#forgot', el).onclick = () => forgotSheet(f.email.value.trim()));
    f.onsubmit = async e => {
      e.preventDefault();
      err.textContent = '';
      const email = f.email.value.trim(), pw = f.password.value, name = reg ? f.elements.displayName.value.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = t('err.INVALID_EMAIL'); f.email.focus(); return; }
      if (reg && pw.length < 10) { err.textContent = t('err.PASSWORD_TOO_SHORT'); f.password.focus(); return; }
      if (reg && !f.consent.checked) { err.textContent = t('err.CONSENT_REQUIRED'); f.consent.focus(); return; }
      if (!pw) { f.password.focus(); return; }
      const btn = f.querySelector('[type=submit]');
      btn.disabled = true;
      try {
        if (reg) {
          await Cloud.register(email, pw, name);
          UI.toast(t(Cloud.verifySent ? 'auth.created.verify' : 'auth.created'), { ms: 5000 });
          if (Store.state.settings.onboarded) {
            if (name && Store.state.profile && !Store.state.profile.name) { Store.state.profile.name = name; Store.save(); }
            Router.go('#/');
          } else { resetOnb(); onb.name = name; onb.step = 1; Router.go('#/welcome'); }
        } else {
          await Cloud.login(email, pw);
          UI.toast(t('auth.welcome'));
          if (Store.state.settings.onboarded) Router.go('#/'); else { resetOnb(); onb.step = 1; Router.go('#/welcome'); }
        }
      } catch (ex) {
        err.textContent = errMsg(ex);
        btn.disabled = false;
      }
    };
    setTimeout(() => { const i = reg ? f.elements.displayName : f.elements.email; i && i.focus({ preventScroll: true }); }, 500);
  },
};

/* ===== Дневник ===== */
const MEAL_BLOB = { breakfast: ['20%', '80%'], lunch: ['70%', '30%'], dinner: ['40%', '20%'], snack: ['85%', '85%'] };
// день из адреса #/day/ГГГГ-ММ-ДД; испорченная дата — сегодня
const validKey = k => /^\d{4}-\d{2}-\d{2}$/.test(k || '') && dateKey(parseKey(k)) === k; // 2026-02-30 и 2020-13-45 — не даты
const diaryKey = r => r.name === 'day' && validKey(r.parts[1]) ? r.parts[1] : todayKey();
Views.diary = {
  html(r) {
    const key = diaryKey(r);
    const day = Store.peekDay(key);
    const tot = sumN(dayItems(day));
    const tk = target('kcal') || 2000;
    const { wd, dm } = dayTitle(key);
    const left = tk - tot.kcal;
    const over = left < 0;
    const C = 2 * Math.PI * 52;
    const frac = clamp(tot.kcal / tk, 0, 1);
    // неделя вокруг выбранного дня (пн–вс)
    const d0 = parseKey(key); const dow = (d0.getDay() + 6) % 7;
    const weekKeys = Array.from({ length: 7 }, (_, i) => addDays(key, i - dow));
    const wdFmt = { format: d => fmtDate(d, { weekday: 'short' }) };
    const extra = [['fiber_g', 'min'], ['sugar_g', 'max'], ['sat_fat_g', 'max'], ['sodium_mg', 'max'], ['cholesterol_mg', 'max']];
    return `
    <section class="diary-hero">
      <div class="ghost outline" aria-hidden="true"><div class="track"><span>${t('app.diary')} · ${t('d.day')} ${String(dayNumber()).padStart(3, '0')} · </span><span>${t('app.diary')} · ${t('d.day')} ${String(dayNumber()).padStart(3, '0')} · </span></div></div>
      <div class="inner">
        <span class="kicker">${esc(relDay(key))}${ownerName() ? ' · ' + t('app.diary').toLowerCase() + ' ' + esc(ownerName()) : ''}</span>
        <div class="datebar" style="margin-top:12px">
          <h1 class="h1">${UI.split(`${wd},<br>${dm}`, 'hoverable')}</h1>
          <div class="daynav">
            <a class="icon-btn" href="#/day/${addDays(key, -1)}" aria-label="${t('d.yesterday')}">${ICON.left}</a>
            ${key !== todayKey() ? `<a class="pill" href="#/">${t('d.today')}</a>` : ''}
            <a class="icon-btn" href="#/day/${addDays(key, 1)}" aria-label="${t('d.tomorrow')}">${ICON.right}</a>
          </div>
        </div>
        <nav class="week" aria-label="week">${weekKeys.map(k => {
          const kc = dayTotals(k).kcal;
          return `<a href="#/day/${k}" class="${k === key ? 'on' : ''} ${k > todayKey() ? 'future' : ''}" aria-current="${k === key ? 'date' : 'false'}"><span class="wd">${wdFmt.format(parseKey(k))}</span><span class="dn">${parseKey(k).getDate()}</span><span class="dot"><i style="width:${clamp(kc / tk, 0, 1) * 100}%"></i></span></a>`;
        }).join('')}</nav>
      </div>
    </section>

    <section class="summary">
      <div class="card dark ringcard rv">
        <div class="ring">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="trk" cx="60" cy="60" r="52" fill="none" stroke-width="11"/><circle class="val ${over ? 'over' : ''}" cx="60" cy="60" r="52" fill="none" stroke-width="11" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C * (1 - frac)}"/></svg>
          <div class="mid"><b class="num ${over ? 'over' : ''}" data-count="${Math.round(Math.abs(left))}">0</b><span>${over ? t('d.over') : t('d.left')}, ${t('u.kcal')}</span></div>
        </div>
        <div class="ring-stats">
          <div class="st"><span>${t('d.eaten')}</span><b class="num" data-count="${Math.round(tot.kcal)}">0</b></div>
          <div class="st"><span>${t('d.goal')}</span><b class="num">${fmt(tk)}</b></div>
          <div class="st"><span>${dayItems(day).length} ${t('d.entries')}</span><span class="serif" style="font-size:22px;color:#fff;font-family:var(--serif)">${esc(diaryMood(tot, tk, key))}</span></div>
        </div>
      </div>
      <div class="card macros rv" style="--d:2">
        ${['protein_g', 'fat_g', 'carbs_g'].map(k => {
          const v = tot[k], tg = target(k) || 1;
          return `<div class="macro"><div class="top-l"><b>${t('n.' + k)}</b><span class="num">${fmt(v)} / ${fmt(tg)} ${t('u.g')}</span></div><div class="bar"><i class="${v > tg * 1.1 ? 'over' : ''}" data-w="${clamp(v / tg, 0, 1) * 100}%"></i></div></div>`;
        }).join('')}
        <div class="chips">${extra.map(([k, kind]) => {
          const v = tot[k], tg = target(k);
          const bad = tg && (kind === 'max' ? v > tg : false);
          return `<span class="pill ${bad ? 'warn' : ''}" title="${t('n.' + k)}"><span class="tick">${bad ? '!' : ICON.check}</span>${t('n.' + k)} <b class="num">${fmt(v, k.endsWith('_mg') ? 0 : 1)}</b><span class="muted">/ ${fmt(tg)} ${nUnit(k)}</span></span>`;
        }).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="sec-head"><h2 class="h2">${UI.split(tr('Приёмы пищи', 'Meals', 'Ovqatlanishlar'))}</h2></div>
      <div class="meals">${MEALS.map((m, i) => mealCard(key, m, day, i)).join('')}</div>
    </section>

    <section class="note">
      <div><span class="kicker">${t('d.note')}</span><h2 class="h2" style="margin-top:10px">${UI.split(tr('Дорогой дневник', 'Dear diary', 'Aziz kundalik'))}</h2></div>
      <textarea id="note" placeholder="${esc(t('d.note.ph'))}" aria-label="${t('d.note')}">${esc(day ? day.note : '')}</textarea>
    </section>`;
  },
  mount(el, r) {
    const key = diaryKey(r);
    el.onclick = e => {
      const b = e.target.closest('[data-item]');
      if (b) itemSheet(key, b.dataset.item, () => { Router.silent = true; Router.render(); });
    };
    let to;
    $('#note', el).oninput = e => { clearTimeout(to); to = setTimeout(() => { Store.day(key).note = e.target.value; Store.save(); }, 400); };
    if (Views.diary.flash) {
      const ids = Views.diary.flash; Views.diary.flash = null;
      ids.forEach(id => { const li = el.querySelector(`[data-item="${id}"]`); li && li.parentElement.classList.add('flash'); });
    }
  },
};
Views.day = Views.diary;

function diaryMood(tot, tk, key) {
  if (!tot.kcal) return key === todayKey() ? tr('чистый лист', 'a blank page', 'toza varaq') : tr('ничего не записано', 'nothing written', 'hech narsa yozilmagan');
  const p = tot.kcal / tk;
  if (p < .5) return tr('день только начинается', 'just getting started', 'kun endi boshlanmoqda');
  if (p < .9) return tr('ровный темп', 'steady pace', 'bir tekis sur’at');
  if (p <= 1.05) return tr('точно в цель', 'right on target', 'aynan nishonga');
  return tr('щедрый день', 'a generous day', 'saxiy kun');
}

function mealCard(key, m, day, i) {
  const items = day ? day.meals[m] : [];
  const n = sumN(items);
  const [bx, by] = MEAL_BLOB[m];
  return `<article class="meal rv-card" style="--d:${i}">
    <div class="head blob" style="--bx:${bx};--by:${by}"><span class="mono">/ 00${i + 1}</span><span class="mono">${items.length ? fmt(n.kcal) + ' ' + t('u.kcal') : ''}</span><span class="badge">${ICON.star}</span></div>
    <div class="body">
      <div class="title"><h3 class="h3">${t('meal.' + m)}</h3></div>
      ${items.length ? `<ul class="items">${items.map(it => {
        const nn = itemNutrients(it);
        return `<li><button data-item="${it.id}"><span class="nm">${esc(it.name)}</span><span class="kk num">${fmt(nn.kcal)}</span><span class="sub"><span>${fmtMass(it.grams)}</span><span>${macroLine(nn)}</span>${isApprox(it.source) ? `<span>· ${t('src.' + it.source)}</span>` : ''}</span></button></li>`;
      }).join('')}</ul>
      <div class="mono muted">${macroLine(n)}</div>`
      : `<div class="empty"><span class="serif">${t('d.empty')}</span><span class="hint">${t('d.empty.hint')}</span></div>`}
      <div class="foot">
        <a class="pill" href="#/add?date=${key}&meal=${m}">${ICON.plus.replace('<svg', '<svg width="14" height="14"')} ${t('foods.add')}</a>
        ${items.length ? `<a class="link" href="#/meal/${key}/${m}" style="margin-left:auto">${t('d.more')}</a>` : ''}
      </div>
    </div>
  </article>`;
}

/* ===== Добавление ===== */
let addState = null;
Views.add = {
  html(r) {
    const date = validKey(r.q.date) ? r.q.date : todayKey();
    if (!addState || addState.date !== date || (r.q.meal && addState.meal !== r.q.meal)) addState = { date, meal: MEALS.includes(r.q.meal) ? r.q.meal : guessMeal(), photos: [], text: '' };
    const s = addState;
    const ai = aiReady();
    const recent = Store.state.recent.slice(0, 12);
    const my = Store.state.myFoods.slice(0, 12);
    return `
      <span class="kicker">${t('nav.add')} · ${esc(relDay(date))}</span>
      <h1 class="h1" style="margin-top:12px">${UI.split(t('add.title'), 'hoverable')}</h1>
      <div class="add-wrap">
        <div class="card composer rv" id="composer">
          <div class="drop" id="drop">${photosHtml(s.photos)}</div>
          <input type="file" id="f-gal" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple hidden>
          <input type="file" id="f-cam" accept="image/*" capture="environment" hidden>
          <label class="sr" for="txt">${t('add.title')}</label>
          <textarea class="textarea" id="txt" placeholder="${esc(t('add.ph'))}">${esc(s.text)}</textarea>
          <div class="note-ai">${ICON.info}<span>${t('add.hint')}</span></div>
          <div class="field"><span>${t('add.meal')}</span><div class="seg" id="mealseg">${MEALS.map(m => `<button aria-pressed="${m === s.meal}" data-m="${m}">${t('meal.' + m)}</button>`).join('')}</div></div>
          <div class="row" style="gap:18px">
            <button class="btn big" id="calc">${t('add.calc')}<span class="arr">${ICON.arrow}</span></button>
            <button class="link" id="manual">${t('add.manual')}</button>
            <a class="link" href="#/foods">${t('add.catalog')}</a>
          </div>
          ${ai ? '' : `<div class="callout" style="font-size:14px">${t('add.noai')} <a class="link" href="#/settings">${t('nav.settings')}</a></div>`}
        </div>
        <div class="quick">
          <div class="card rv" style="--d:2"><span class="kicker">${t('add.recent')}</span>
            <div class="list" style="margin-top:12px">${recent.length ? recent.map((x, i) => `<button class="pill" data-rec="${i}">${esc(x.name)} <span class="muted mono">${fmtMass(x.grams)}</span></button>`).join('') : `<p class="muted" style="margin:0">${t('foods.empty.recent')}</p>`}</div></div>
          <div class="card rv" style="--d:3"><span class="kicker">${t('add.my')}</span>
            <div class="list" style="margin-top:12px">${my.length ? my.map((x, i) => `<button class="pill" data-my="${i}"><span class="tick">${ICON.plus}</span>${esc(x.name)}</button>`).join('') : `<p class="muted" style="margin:0">${t('foods.empty.my')}</p>`}</div></div>
          <div class="card dark rv blob" style="--d:4;--bx:80%;--by:90%;min-height:180px;border-radius:var(--r)">
            <div style="position:relative;z-index:1;display:grid;gap:10px">
              <span class="mono" style="color:#cfd3db">/ ${tr('совет', 'tip', 'maslahat')}</span>
              <p class="serif" style="font-size:28px;line-height:1.05;margin:0">${tr('Снимай сверху и держи в кадре вилку или ладонь — так порция оценивается точнее.', 'Shoot from above with a fork or a hand in frame — portions come out more accurate.', 'Yuqoridan suratga oling va kadrda sanchqi yoki kaftingiz bo‘lsin — shunda porsiya aniqroq baholanadi.')}</p>
            </div>
          </div>
        </div>
      </div>`;
  },
  mount(el) {
    const s = addState;
    const txt = $('#txt', el);
    txt.oninput = () => s.text = txt.value;
    txt.onkeydown = e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) $('#calc', el).click(); };
    $('#mealseg', el).onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; s.meal = b.dataset.m; $$('#mealseg button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); };
    const drop = $('#drop', el);
    const refresh = () => { drop.innerHTML = photosHtml(s.photos); };
    const addFiles = async files => {
      for (const f of [...files]) {
        if (s.photos.length >= 4) { UI.toast(t('add.photos.max'), { err: true }); break; }
        try { s.photos.push(await prepareImage(f)); refresh(); }
        catch (e) { UI.toast(t('err.' + (e.code || 'UNSUPPORTED_FORMAT')), { err: true }); }
      }
    };
    drop.onclick = e => {
      const del = e.target.closest('[data-delph]');
      if (del) { s.photos.splice(Number(del.dataset.delph), 1); refresh(); return; }
      if (e.target.closest('[data-cam]')) return openCamera();
      if (e.target.closest('[data-gal]')) return $('#f-gal', el).click();
    };
    // камера: на телефоне — системная (снимает лучше), на компьютере — своя, через getUserMedia
    const openCamera = () => {
      const phone = matchMedia('(pointer: coarse)').matches;
      if (phone || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return $('#f-cam', el).click();
      if (s.photos.length >= 4) { UI.toast(t('add.photos.max'), { err: true }); return; }
      cameraSheet({
        left: 4 - s.photos.length,
        onFallback: () => $('#f-gal', el).click(),
        onPhotos: async (files, analyze) => {
          await addFiles(files);
          if (analyze && s.photos.length) runAnalysis($('#composer', el));
        },
      });
    };
    $('#f-gal', el).onchange = e => { addFiles(e.target.files); e.target.value = ''; };
    $('#f-cam', el).onchange = e => { addFiles(e.target.files); e.target.value = ''; };
    drop.ondragover = e => { e.preventDefault(); drop.classList.add('drag'); };
    drop.ondragleave = () => drop.classList.remove('drag');
    drop.ondrop = e => { e.preventDefault(); drop.classList.remove('drag'); addFiles(e.dataTransfer.files); };
    el.onpaste = e => { const fs = [...(e.clipboardData && e.clipboardData.files || [])].filter(f => f.type.startsWith('image/')); if (fs.length) addFiles(fs); };

    $('#manual', el).onclick = () => searchSheet({ title: t('add.manual'), query: s.text, onPick: it => { UI.closeModal(); setTimeout(() => logSheet(it, { date: s.date, meal: s.meal, onDone: (d) => { Router.go(`#/day/${d}`); } }), 450); } });
    el.querySelector('.quick').onclick = e => {
      const r = e.target.closest('[data-rec]'), m = e.target.closest('[data-my]');
      let it = null;
      if (r) { const x = Store.state.recent[Number(r.dataset.rec)]; it = makeItem({ name: x.name, grams: x.grams, per100: x.per100, source: x.source, foodId: x.foodId, confidence: 1, grams_source: 'user', origin: 'copy' }); }
      if (m) { const x = Store.state.myFoods[Number(m.dataset.my)]; it = makeItem({ name: x.name, grams: x.portion || 100, per100: x.per100, source: 'user', confidence: 1, grams_source: 'user', origin: 'manual' }); }
      if (!it) return;
      Store.addItems(s.date, s.meal, [it]);
      const added = Store.day(s.date).meals[s.meal].slice(-1)[0];
      UI.toast(`${it.name} → ${t('meal.' + s.meal)}`, { action: t('res.undo'), onAction: () => { const d = Store.day(s.date); d.meals[s.meal] = d.meals[s.meal].filter(x => x.id !== added.id); Store.save(); } });
    };
    $('#calc', el).onclick = () => runAnalysis($('#composer', el));
  },
};
/* Камера в окне приложения: живое изображение, снимок, «Рассчитать» / «Ещё фото» / «Переснять».
   onPhotos(files, analyze) получает снимки; analyze — сразу отправить на оценку ИИ. */
function cameraSheet({ left = 4, onPhotos, onFallback }) {
  let stream = null, cams = [], camIdx = 0, current = null, sent = false, closed = false;
  const shots = [];
  const stop = () => { if (stream) stream.getTracks().forEach(tr => tr.stop()); stream = null; };
  const sheet = UI.modal(`
    <div class="kicker">${t('add.camera')}</div>
    <h2 class="h2" style="margin:10px 0 14px">${t('cam.title')}</h2>
    <div class="cam" id="cam">
      <video id="camv" playsinline autoplay muted></video>
      <img id="camshot" alt="" hidden>
      <div class="cam-msg" id="cammsg">${t('cam.starting')}</div>
      <span class="cam-count" id="camcount" hidden></span>
    </div>
    <p class="mono muted" style="margin:0 0 14px;font-size:12px">${t('cam.hint')}</p>
    <div class="cam-bar" id="camlive">
      <button class="pill ghosty" id="camfile">${ICON.image.replace('<svg', '<svg width="16" height="16"')} ${t('add.photo')}</button>
      <button class="cam-shutter" id="camshoot" aria-label="${t('cam.shoot')}" disabled></button>
      <button class="pill ghosty" id="camflip" aria-label="${t('cam.flip')}" style="visibility:hidden">${ICON.flip.replace('<svg', '<svg width="18" height="18"')}</button>
    </div>
    <div class="cam-bar" id="camreview" hidden>
      <button class="pill ghosty" id="camretake">${t('cam.retake')}</button>
      <button class="pill" id="cammore">${ICON.plus.replace('<svg', '<svg width="14" height="14"')} ${t('cam.more')}</button>
      <button class="btn lime" id="camgo">${t('add.calc')}<span class="arr">${ICON.arrow}</span></button>
    </div>`, {
    cls: 'camsheet',
    onClose: () => { closed = true; stop(); if (!sent && shots.length) onPhotos(shots.slice(), false); },
  });
  const v = $('#camv', sheet), img = $('#camshot', sheet), msg = $('#cammsg', sheet), shoot = $('#camshoot', sheet);
  const showMsg = text => { msg.textContent = text; msg.hidden = !text; };
  const live = on => { $('#camlive', sheet).hidden = !on; $('#camreview', sheet).hidden = on; v.hidden = !on; img.hidden = on; };
  const count = () => { const c = $('#camcount', sheet); c.hidden = !shots.length; c.textContent = t('cam.count', { n: shots.length }); };
  async function start() {
    stop(); shoot.disabled = true; showMsg(t('cam.starting'));
    try {
      const id = cams[camIdx] && cams[camIdx].deviceId;
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: id ? { deviceId: { exact: id }, width: { ideal: 1920 }, height: { ideal: 1440 } } : { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } } });
      if (closed) { stop(); return; } // окно закрыли, пока камера включалась
      v.srcObject = stream; await v.play().catch(() => {});
      showMsg(''); shoot.disabled = false;
      if (!cams.length) {
        cams = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
        const curId = stream.getVideoTracks()[0].getSettings().deviceId;
        camIdx = Math.max(0, cams.findIndex(d => d.deviceId === curId));
      }
      $('#camflip', sheet).style.visibility = cams.length > 1 ? 'visible' : 'hidden';
    } catch (e) {
      const denied = e.name === 'NotAllowedError' || e.name === 'SecurityError';
      showMsg(t(denied ? 'cam.denied' : 'cam.none'));
    }
  }
  shoot.onclick = () => {
    if (!v.videoWidth) return;
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    $('#cam', sheet).classList.remove('flash'); void sheet.offsetWidth; $('#cam', sheet).classList.add('flash');
    c.toBlob(b => {
      if (!b) return;
      current = new File([b], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      if (img.src) URL.revokeObjectURL(img.src);
      img.src = URL.createObjectURL(current);
      live(false);
      $('#cammore', sheet).hidden = shots.length + 1 >= left;
    }, 'image/jpeg', 0.92);
  };
  $('#camretake', sheet).onclick = () => { current = null; live(true); };
  $('#cammore', sheet).onclick = () => { if (current) shots.push(current); current = null; count(); live(true); };
  $('#camgo', sheet).onclick = () => { if (current) shots.push(current); sent = true; UI.closeModal(); onPhotos(shots.slice(), true); };
  $('#camflip', sheet).onclick = () => { if (cams.length > 1) { camIdx = (camIdx + 1) % cams.length; start(); } };
  $('#camfile', sheet).onclick = () => { UI.closeModal(); setTimeout(onFallback, 300); };
  start();
}

function photosHtml(photos) {
  if (!photos.length) return `<div>
    <div class="h3">${UI.split(tr('Перетащи фото сюда', 'Drop a photo here', 'Suratni shu yerga tashlang'))}</div>
    <p class="mono muted" style="margin:8px 0 0">JPEG · PNG · WebP · HEIC · ≤ 10 MB · ≤ 4</p>
    <div class="acts"><button class="pill" data-gal>${ICON.image.replace('<svg', '<svg width="18" height="18"')} ${t('add.photo')}</button><button class="pill" data-cam>${ICON.camera.replace('<svg', '<svg width="18" height="18"')} ${t('add.camera')}</button></div></div>`;
  return `<div class="thumbs">${photos.map((p, i) => `<div class="thumb"><img src="${p.thumb}" alt=""><button data-delph="${i}" aria-label="${t('res.delete')}">${ICON.x}</button></div>`).join('')}${photos.length < 4 ? `<button class="thumb addmore" data-cam aria-label="${t('add.camera')}">${ICON.camera.replace('<svg', '<svg width="24" height="24"')}</button><button class="thumb addmore" data-gal aria-label="${t('add.photo')}">${ICON.plus.replace('<svg', '<svg width="22" height="22"')}</button>` : ''}</div>`;
}

async function runAnalysis(host, answers) {
  const s = addState;
  const text = (s.text || '').trim();
  if (!text && !s.photos.length) { UI.toast(t('add.empty'), { err: true }); return; }
  if (s.photos.length && !aiReady()) { UI.toast(t('add.noai.photo'), { err: true }); return; }
  const ctrl = new AbortController();
  const proc = document.createElement('div');
  proc.className = 'proc';
  proc.innerHTML = `<span class="scan"></span>
    <div class="stages">${['recognize', 'match', 'calc'].map(k => `<div class="stage" data-st="${k}">${t('st.' + k)}<span class="dots"></span></div>`).join('')}</div>
    <div style="display:grid;gap:18px;position:relative;z-index:1"><div class="skel"><i></i><i></i><i></i></div>
    <button class="btn lime" id="cancel" style="justify-self:start">${t('st.cancel')}<span class="arr">${ICON.x}</span></button></div>`;
  host.appendChild(proc);
  const stage = k => {
    const order = ['recognize', 'match', 'calc'];
    $$('.stage', proc).forEach(x => { const i = order.indexOf(x.dataset.st), j = order.indexOf(k); x.className = 'stage' + (i < j ? ' done' : i === j ? ' on' : ''); });
  };
  $('#cancel', proc).onclick = () => ctrl.abort();
  stage('recognize');
  let result;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  try {
    if (aiReady()) {
      try {
        result = await aiAnalyze({ text, images: s.photos.map(p => p.full), answers }, { signal: ctrl.signal, onStage: stage });
      } catch (e) {
        if (['AI_UNAVAILABLE', 'OFFLINE', 'TIMEOUT', 'RATE', 'AUTH', 'QUOTA', 'AI_LIMIT', 'AI_LIMIT_TOTAL'].includes(e.code) && text && !s.photos.length) {
          UI.toast(t('err.' + e.code), { err: true });
          result = localAnalyze(text);
        } else throw e;
      }
    } else {
      await sleep(380); if (ctrl.signal.aborted) throw new AIError('cancelled');
      stage('match'); result = localAnalyze(text);
      await sleep(320); if (ctrl.signal.aborted) throw new AIError('cancelled');
      stage('calc'); await sleep(240);
      if (result.status === 'no_food') throw new AIError('NO_FOOD_DETECTED');
    }
    draft = { date: s.date, meal: s.meal, text, photos: s.photos.slice(), items: result.items, questions: result.questions || [], unknown: result.unknown || [], answers: answers || [], model: result.model, ai: !!result.analysisId };
    draft.items.forEach(it => it.analysisModel = result.model);
    Router.go('#/result');
  } catch (e) {
    proc.style.transition = 'opacity .3s'; proc.style.opacity = 0; setTimeout(() => proc.remove(), 300);
    const code = e.code || 'AI_UNAVAILABLE';
    UI.toast(code === 'NO_FOOD_DETECTED' && e.detail ? e.detail : t('err.' + code), { err: code !== 'cancelled', ms: 5200 });
  }
}

// «1 позиция», «2 позиции», «5 позиций» / «1 item», «2 items»
function itemsLabel(n) {
  if (Store.state.settings.lang === 'en') return `${n} ${n === 1 ? 'item' : 'items'}`;
  if (Store.state.settings.lang === 'uz') return `${n} ta pozitsiya`;
  const m10 = n % 10, m100 = n % 100;
  const w = m10 === 1 && m100 !== 11 ? 'позиция' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'позиции' : 'позиций';
  return `${n} ${w}`;
}

/* ===== Результат ===== */
Views.result = {
  html() {
    if (!draft) return `<div class="empty-state"><span class="serif">${t('d.empty')}</span><a class="btn" href="#/add">${t('nav.add')}<span class="arr">${ICON.arrow}</span></a></div>`;
    const d = draft;
    return `
      <span class="kicker">${t('res.title')} · ${t('meal.' + d.meal)} · ${esc(relDay(d.date))}</span>
      <h1 class="h1" style="margin-top:12px">${UI.split(`${itemsLabel(d.items.length)}`)}</h1>
      <div class="res">
        <div class="photos rv">
          ${d.photos.map(p => `<img src="${p.full}" alt="">`).join('')}
          ${d.text ? `<div class="card inputq"><span class="kicker">${tr('ты написал(а)', 'you wrote', 'siz yozdingiz')}</span><p>«${esc(d.text)}»</p></div>` : ''}
          <div class="seg" id="rmeal">${MEALS.map(m => `<button aria-pressed="${m === d.meal}" data-m="${m}">${t('meal.' + m)}</button>`).join('')}</div>
        </div>
        <div>
          ${d.questions.length ? `<div class="card lime qbox" id="qbox"><span class="kicker">${t('res.q')}</span>
            ${d.questions.map((q, qi) => `<div class="q"><p>${esc(q.text)}</p><div class="row">${q.options.map(o => `<button class="pill" data-q="${qi}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
            <button class="link" id="qskip" style="justify-self:start">${t('res.q.skip')}</button></div>` : ''}
          ${d.unknown.length ? `<div class="callout warn" style="margin-bottom:10px"><b>${t('res.unknown')}:</b> ${d.unknown.map((u, i) => `<button class="link" data-unk="${i}">${esc(u)}</button>`).join(', ')}<br><span class="muted">${t('res.unknown.hint')}</span></div>` : ''}
          <div class="ritems" id="ritems" style="margin-top:${d.questions.length ? 10 : 0}px">${d.items.map((it, i) => ritemHtml(it, i)).join('')}</div>
          <div class="row" style="margin-top:12px"><button class="pill ghosty" id="additem">${ICON.plus.replace('<svg', '<svg width="14" height="14"')} ${t('res.additem')}</button></div>
          <div class="totals" id="totals"></div>
          <p class="disc">${t('res.disclaimer')}</p>
        </div>
      </div>`;
  },
  mount(el) {
    if (!draft) return;
    const d = draft;
    const list = $('#ritems', el);
    const totals = () => {
      const n = sumN(d.items);
      $('#totals', el).innerHTML = `<div><span class="mono" style="color:#9aa0ae">${t('res.total')}</span><div class="tbig num">${fmt(n.kcal)}<small>${t('u.kcal')}</small></div></div>
        <div class="mac"><span>${t('n.p')} <b>${fmt(n.protein_g)}</b></span><span>${t('n.f')} <b>${fmt(n.fat_g)}</b></span><span>${t('n.c')} <b>${fmt(n.carbs_g)}</b></span></div>
        <span class="spacer"></span>
        <button class="btn lime big" id="save" ${d.items.length ? '' : 'disabled'}>${t('res.add')}<span class="arr">${ICON.arrow}</span></button>`;
      $('#save', el).onclick = save;
      $('h1', el).setAttribute('aria-label', `${itemsLabel(d.items.length)}`);
    };
    const updRow = (row, it) => {
      const n = itemNutrients(it);
      $('[data-kc]', row).textContent = fmt(n.kcal);
      $('[data-mac]', row).textContent = macroLine(n);
      const r = $('input[type=range]', row);
      if (Number(it.grams) > Number(r.max)) r.max = Math.ceil(it.grams * 1.5 / 50) * 50;
      r.style.setProperty('--p', (it.grams / r.max * 100) + '%');
    };
    const rerender = () => { $('h1', el).innerHTML = UI.split(`${itemsLabel(d.items.length)}`); list.innerHTML =d.items.map((it, i) => ritemHtml(it, i)).join(''); $$('.ritem', list).forEach((row, i) => updRow(row, d.items[i])); totals(); };
    $$('.ritem', list).forEach((row, i) => updRow(row, d.items[i]));
    totals();
    list.oninput = e => {
      const row = e.target.closest('.ritem'); if (!row) return;
      const it = d.items.find(x => x.id === row.dataset.id);
      if (e.target.type === 'range') { it.grams = Number(e.target.value); $('input[type=number]', row).value = massOut(it.grams); }
      else { const g = massIn(e.target.value); if (!(g > 0)) return; it.grams = clamp(g, 1, 5000); $('input[type=range]', row).value = it.grams; }
      it.edited = true; it.grams_source = 'user';
      updRow(row, it); totals();
    };
    list.onclick = e => {
      const row = e.target.closest('.ritem'); if (!row) return;
      const idx = d.items.findIndex(x => x.id === row.dataset.id), it = d.items[idx];
      const act = e.target.closest('[data-act]'); if (!act) return;
      if (act.dataset.act === 'del') {
        row.classList.add('removing');
        setTimeout(() => {
          d.items.splice(idx, 1); rerender();
          UI.toast(t('res.deleted'), { action: t('res.undo'), onAction: () => { d.items.splice(idx, 0, it); rerender(); } });
        }, 300);
      }
      if (act.dataset.act === 'src') sourceSheet(it);
      if (act.dataset.act === 'replace') searchSheet({ title: t('res.replace'), query: it.name, onPick: nw => {
        Object.assign(it, { name: nw.name, per100: nw.per100, source: nw.source, foodId: nw.foodId, confidence: nw.confidence ?? 1, basis: nw.basis, catalogId: nw.catalogId, edited: true, assumed: false, opts: nw.opts });
        UI.closeModal(); rerender();
      } });
    };
    $('#additem', el).onclick = () => searchSheet({ title: t('res.additem'), onPick: nw => { d.items.push(nw); UI.closeModal(); rerender(); } });
    $('#rmeal', el).onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; d.meal = b.dataset.m; $$('#rmeal button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); };
    $$('[data-unk]', el).forEach(b => b.onclick = () => searchSheet({ title: t('add.manual'), query: d.unknown[Number(b.dataset.unk)].replace(/[\d.,]+\s*(г|гр|g|мл|ml|шт)?/gi, '').trim(), onPick: nw => { d.items.push(nw); d.unknown.splice(Number(b.dataset.unk), 1); UI.closeModal(); Router.silent = true; Router.render(); } }));
    const qbox = $('#qbox', el);
    if (qbox) {
      const picked = {};
      qbox.onclick = async e => {
        const b = e.target.closest('[data-q]');
        if (e.target.closest('#qskip')) { d.items.forEach(it => { if (d.questions.some(q => q.item_index === d.items.indexOf(it))) it.confidence = Math.min(it.confidence, 0.5); }); d.questions = []; qbox.remove(); rerender(); return; }
        if (!b) return;
        picked[b.dataset.q] = b.dataset.o;
        $$(`[data-q="${b.dataset.q}"]`, qbox).forEach(x => x.classList.toggle('on', x === b));
        if (Object.keys(picked).length < d.questions.length) return;
        const answers = d.answers.concat(d.questions.map((q, i) => ({ q: q.text, a: picked[i] })));
        addState = { date: d.date, meal: d.meal, photos: d.photos, text: d.text };
        qbox.style.position = 'relative'; qbox.style.minHeight = '340px'; qbox.style.overflow = 'hidden';
        await runAnalysis(qbox, answers);
      };
    }
    let saving = false;
    async function save() {
      if (saving) return; // двойное нажатие — одна запись
      saving = true; $('#save', el) && ($('#save', el).disabled = true);
      let photoId = null;
      if (d.photos.length && Store.state.settings.photoPolicy !== 'none') { photoId = 'ph_' + uid(); await PhotoDB.put(photoId, d.photos[0].thumb); }
      const items = d.items.map(it => {
        const o = Object.assign({}, it); delete o.input; delete o.analysisModel;
        if (photoId) o.photoId = photoId;
        return o;
      });
      Store.addItems(d.date, d.meal, items);
      const ids = Store.day(d.date).meals[d.meal].slice(-items.length).map(x => x.id);
      draft = null; addState = null;
      UI.toast(`${t('res.added')} · ${t('meal.' + d.meal)}`);
      Views.diary.flash = ids;
      Router.go(d.date === todayKey() ? '#/' : `#/day/${d.date}`);
    }
  },
};
function ritemHtml(it, i) {
  const low = (it.confidence ?? 1) < 0.6;
  const max = Math.max(500, Math.ceil(it.grams * 2.5 / 50) * 50);
  const cook = it.cooking && !/^(none|n\/a|-|raw|unknown)$/i.test(it.cooking) ? it.cooking : '';
  return `<article class="ritem ${low ? 'low' : ''}" data-id="${it.id}" style="--d:${i}">
    <div class="r1">
      <button class="nm" data-act="replace" title="${t('res.replace')}">${esc(it.name)}<small>${cook ? esc(cook) + ' · ' : ''}${t('gs.' + (it.grams_source || 'standard'))}</small></button>
      <div class="kc"><span class="num" data-kc></span><small>${t('u.kcal')}</small></div>
      <button class="icon-btn sm" data-act="del" aria-label="${t('res.delete')}">${ICON.trash}</button>
    </div>
    <div class="r2">
      <input type="range" min="1" max="${max}" step="1" value="${Math.round(it.grams)}" aria-label="${t('misc.grams')} — ${esc(it.name)}">
      <label class="gram"><input type="number" inputmode="decimal" value="${massOut(it.grams)}" aria-label="${t('misc.grams')}"><span>${massUnit()}</span></label>
    </div>
    <div class="r3">
      <span class="tag"><span class="confbar"><i style="width:${Math.round((it.confidence ?? 1) * 100)}%"></i></span>${Math.round((it.confidence ?? 1) * 100)}% ${t('res.conf')}</span>
      ${low ? `<span class="tag warn">! ${t('res.lowconf')}</span>` : ''}
      ${it.assumed ? `<span class="tag lime">${t('res.assumed')}</span>` : ''}
      <span class="tag ${it.source === 'ai_estimate' ? 'dark' : ''}"><button data-act="src">${t('src.' + (it.source || 'local'))}</button></span>
      <span class="mono muted" data-mac style="margin-left:auto"></span>
    </div>
  </article>`;
}

/* ===== Детали приёма пищи ===== */
Views.meal = {
  html(r) {
    const [_, key, m] = r.parts;
    if (!validKey(key) || !MEALS.includes(m)) return Views.diary.html({ name: 'diary', parts: [], q: {} });
    const day = Store.peekDay(key);
    const items = day ? day.meals[m] : [];
    const n = sumN(items);
    const hasPhoto = items.find(x => x.photoId);
    return `
      <span class="kicker">${t('meal.details')} · ${esc(relDay(key))}</span>
      <div class="datebar" style="margin-top:12px"><h1 class="h1">${UI.split(t('meal.' + m), 'hoverable')}</h1>
        <div class="row"><a class="btn light" href="#/day/${key}">${t('nav.diary')}<span class="arr">${ICON.left}</span></a>
        ${key !== todayKey() && items.length ? `<button class="btn" id="copy">${t('meal.copy')}<span class="arr">${ICON.arrow}</span></button>` : ''}</div></div>
      <div class="res">
        <div class="photos rv">
          ${hasPhoto ? `<img id="mphoto" alt="" style="background:var(--bg-2)">` : ''}
          <div class="card dark" style="display:grid;gap:6px"><span class="mono" style="color:#9aa0ae">${t('n.kcal')}</span><b class="h1 num" style="color:var(--lime)" data-count="${Math.round(n.kcal)}">0</b><span class="mono" style="color:#c8ccd6">${macroLine(n)} ${t('u.g')}</span></div>
          <div class="card"><ul class="items" id="mitems">${items.map(it => { const nn = itemNutrients(it); return `<li><button data-item="${it.id}"><span class="nm">${esc(it.name)}</span><span class="kk num">${fmt(nn.kcal)}</span><span class="sub"><span>${fmtMass(it.grams)}</span><span>${t('src.' + (it.source || 'local'))}</span></span></button></li>`; }).join('') || `<li class="muted">${t('d.empty')}</li>`}</ul></div>
        </div>
        <div class="card rv" style="--d:2">
          <table class="ntable"><thead><tr><th></th><th class="r">${t('res.total')}</th><th class="r" style="width:40%">${t('meal.norm')}</th></tr></thead><tbody>
          ${NUTRIENT_KEYS.map(k => { const tg = target(k); const p = tg ? n[k] / tg * 100 : 0; return `<tr><td>${t('n.' + k)}</td><td class="r num"><b>${fmt(n[k], k.endsWith('_mg') || k === 'kcal' ? 0 : 1)}</b> ${nUnit(k)}</td><td class="r num">${tg ? fmt(p) + '%' : '—'}<div class="pbar"><i class="${p > 100 ? 'over' : ''}" style="width:0" data-w="${clamp(p, 0, 100)}%"></i></div></td></tr>`; }).join('')}
          </tbody></table>
          <p class="disc">${t('res.disclaimer')}</p>
        </div>
      </div>`;
  },
  mount(el, r) {
    const [_, key, m] = r.parts;
    if (!validKey(key) || !MEALS.includes(m)) return Views.diary.mount(el, { name: 'diary', parts: [], q: {} });
    const day = Store.peekDay(key);
    const items = day ? day.meals[m] : [];
    const ph = items.find(x => x.photoId);
    if (ph) PhotoDB.get(ph.photoId).then(src => { const img = $('#mphoto', el); if (img) { if (src) img.src = src; else img.remove(); } });
    const mi = $('#mitems', el);
    mi && (mi.onclick = e => { const b = e.target.closest('[data-item]'); if (b) itemSheet(key, b.dataset.item, () => { Router.silent = true; Router.render(); }); });
    const c = $('#copy', el);
    c && (c.onclick = () => {
      Store.addItems(todayKey(), m, items.map(it => { const o = Object.assign({}, it, { origin: 'copy' }); delete o.photoId; return o; }));
      UI.toast(t('meal.copied'));
      Router.go('#/');
    });
  },
};

/* ===== Статистика ===== */
let statsPeriod = 7;
Views.stats = {
  html() {
    const N = statsPeriod, tk = todayKey();
    const keys = Array.from({ length: N }, (_, i) => addDays(tk, i - N + 1));
    const tots = keys.map(k => ({ k, n: dayTotals(k), has: dayItems(Store.peekDay(k)).length > 0 }));
    const logged = tots.filter(x => x.has);
    const avg = k => logged.length ? logged.reduce((s, x) => s + x.n[k], 0) / logged.length : 0;
    let streak = 0; { let k = dayItems(Store.peekDay(tk)).length ? tk : addDays(tk, -1); while (dayItems(Store.peekDay(k)).length) { streak++; k = addDays(k, -1); } }
    const tkc = target('kcal') || 2000;
    const narrow = innerWidth < 600, W = narrow ? 360 : 820, H = narrow ? 220 : 260, P = 28, bw = (W - P) / N, step = N <= 7 ? 1 : narrow ? 5 : 3;
    const maxK = Math.max(tkc * 1.3, ...tots.map(x => x.n.kcal));
    const y = v => H - 24 - (v / maxK) * (H - 40);
    const dFmt = k => parseKey(k).getDate();
    const kcalChart = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('stats.kcal')}">
      ${[0.25, .5, .75, 1].map(f => `<line class="grid-l" x1="${P}" x2="${W}" y1="${y(maxK * f)}" y2="${y(maxK * f)}"/><text x="0" y="${y(maxK * f) + 3}">${fmt(maxK * f / 1000, 1)}k</text>`).join('')}
      ${tots.map((x, i) => { const h = H - 24 - y(x.n.kcal); return `<rect class="b ${x.n.kcal > tkc * 1.05 ? 'over' : ''} ${x.k === tk ? 'today' : ''}" style="--i:${i}" x="${P + i * bw + bw * .18}" y="${y(x.n.kcal)}" width="${bw * .64}" height="${Math.max(0, h)}" rx="${Math.min(8, bw * .2)}"><title>${x.k}: ${fmt(x.n.kcal)} ${t('u.kcal')}</title></rect>${i % step === 0 ? `<text x="${P + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${dFmt(x.k)}</text>` : ''}`; }).join('')}
      <line class="tl" x1="${P}" x2="${W}" y1="${y(tkc)}" y2="${y(tkc)}"/><text x="${W}" y="${y(tkc) - 6}" text-anchor="end">${t('d.goal')} ${fmt(tkc)}</text>
    </svg>`;
    const maxM = Math.max(1, ...tots.map(x => x.n.protein_g * 4 + x.n.fat_g * 9 + x.n.carbs_g * 4)) * 1.1;
    const ym = v => (v / maxM) * (H - 40);
    const macroChart = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('stats.macros')}">
      ${tots.map((x, i) => { let base = H - 24; return [['bp', x.n.protein_g * 4], ['bf', x.n.fat_g * 9], ['bc', x.n.carbs_g * 4]].map(([c, v]) => { const h = ym(v); base -= h; return `<rect class="b ${c}" style="--i:${i}" x="${P + i * bw + bw * .18}" y="${base}" width="${bw * .64}" height="${Math.max(0, h)}"/>`; }).join('') + (i % step === 0 ? `<text x="${P + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${dFmt(x.k)}</text>` : ''); }).join('')}
    </svg>`;
    const ws = Store.state.weights.slice(-30);
    const spark = (() => {
      if (ws.length < 2) return '';
      const mn = Math.min(...ws.map(w => w.kg)) - 1, mx = Math.max(...ws.map(w => w.kg)) + 1;
      const pts = ws.map((w, i) => [i / (ws.length - 1) * 380 + 10, 110 - (w.kg - mn) / (mx - mn) * 100]);
      return `<svg class="spark" viewBox="0 0 400 120" style="width:100%;height:auto"><path d="M${pts.map(p => p.join(',')).join(' L')}"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4"/>`).join('')}</svg>`;
    })();
    const rules = { kcal: 'band', protein_g: 'min', fat_g: 'band', carbs_g: 'band', fiber_g: 'min', sugar_g: 'max', sat_fat_g: 'max', sodium_mg: 'max', cholesterol_mg: 'max' };
    return `
      <span class="kicker">${t('stats.title')}</span>
      <div class="datebar" style="margin-top:12px"><h1 class="h1">${UI.split(N === 7 ? tr('Семь дней', 'Seven days', 'Yetti kun') : tr('Тридцать дней', 'Thirty days', 'O‘ttiz kun'), 'hoverable')}</h1>
      <div class="seg" id="per"><button aria-pressed="${N === 7}" data-n="7">${t('stats.week')}</button><button aria-pressed="${N === 30}" data-n="30">${t('stats.month')}</button></div></div>
      <div class="kpis section" style="margin-top:26px">
        <div class="kpi dark rv"><span>${t('n.kcal')} · ${t('stats.avg')}</span><b class="num" data-count="${Math.round(avg('kcal'))}">0</b></div>
        <div class="kpi rv" style="--d:1"><span>${t('n.protein_g')} · ${t('stats.avg')}, ${t('u.g')}</span><b class="num" data-count="${Math.round(avg('protein_g'))}">0</b></div>
        <div class="kpi rv" style="--d:2"><span>${t('stats.days')}</span><b class="num">${logged.length}<span class="muted" style="font-size:.4em"> / ${N}</span></b></div>
        <div class="kpi lime rv" style="--d:3"><span>${t('stats.streak')}</span><b class="num" data-count="${streak}">0</b></div>
      </div>
      ${logged.length ? `
      <div class="grid section" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));margin-top:16px">
        <div class="card rv-card"><div class="sec-head" style="margin-bottom:10px"><h3 class="h3">${t('stats.kcal')}</h3></div>${kcalChart}</div>
        <div class="card rv-card" style="--d:1"><div class="sec-head" style="margin-bottom:10px"><h3 class="h3">${t('stats.macros')}</h3><div class="legend"><span><i style="background:var(--ink)"></i>${t('n.protein_g')}</span><span><i style="background:var(--lime-2)"></i>${t('n.fat_g')}</span><span><i style="background:var(--blue)"></i>${t('n.carbs_g')}</span></div></div>${macroChart}</div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));margin-top:16px">
        <div class="card rv"><h3 class="h3" style="margin-bottom:10px">${t('stats.micro')}</h3>
          <table class="ntable"><thead><tr><th></th><th class="r">${t('stats.avg')}</th><th class="r">${t('d.goal')}</th><th class="r"></th></tr></thead><tbody>
          ${NUTRIENT_KEYS.map(k => { const a = avg(k), tg = target(k), rule = rules[k]; let st = 'ok';
            if (tg) { if (rule === 'max' && a > tg) st = 'over'; if (rule === 'min' && a < tg * .8) st = 'under'; if (rule === 'band' && (a > tg * 1.1)) st = 'over'; if (rule === 'band' && a < tg * .8) st = 'under'; }
            return `<tr><td>${t('n.' + k)}</td><td class="r num"><b>${fmt(a, k.endsWith('_mg') || k === 'kcal' ? 0 : 1)}</b></td><td class="r num muted">${tg ? fmt(tg) : '—'} ${nUnit(k)}</td><td class="r"><span class="tag ${st === 'over' ? 'warn' : st === 'under' ? 'dark' : 'lime'}">${st === 'ok' ? '✓ ' : st === 'over' ? '↑ ' : '↓ '}${t('stats.' + st)}</span></td></tr>`; }).join('')}
          </tbody></table></div>
        <div class="card rv" style="--d:1;display:grid;gap:14px;align-content:start"><h3 class="h3">${t('stats.weight')}</h3>
          ${spark}
          <div class="row">${ws.slice(-5).reverse().map(w => `<span class="pill ghosty">${esc(relDay(w.date))} · <b>${fmt(bodyOut(w.kg), 1)}</b> ${bodyUnit()}</span>`).join('')}</div>
          <div class="row"><input class="input" id="wv" type="number" inputmode="decimal" placeholder="${bodyUnit()}" style="max-width:160px"><button class="btn" id="wadd">${t('stats.weight.add')}<span class="arr">${ICON.plus}</span></button></div>
        </div>
      </div>` : `<div class="empty-state section"><span class="serif">${t('stats.nodata')}</span><a class="btn" href="#/add">${t('nav.add')}<span class="arr">${ICON.arrow}</span></a></div>`}`;
  },
  mount(el) {
    $('#per', el).onclick = e => { const b = e.target.closest('[data-n]'); if (!b) return; statsPeriod = Number(b.dataset.n); Router.silent = true; Router.render(); };
    const wa = $('#wadd', el);
    wa && (wa.onclick = () => {
      const v = bodyIn($('#wv', el).value); if (!(v >= BODY_KG[0] && v <= BODY_KG[1])) { UI.toast(t('err.range'), { err: true }); return; }
      const ws = Store.state.weights.filter(w => w.date !== todayKey()); ws.push({ date: todayKey(), kg: round1(v) });
      Store.state.weights = ws; if (Store.state.profile) Store.state.profile.weight = round1(v);
      Store.save(); UI.toast(t('set.saved')); Router.silent = true; Router.render();
    });
  },
};

/* ===== Продукты ===== */
let foodsTab = 'catalog';
const catLoading = () => `<div class="card"><p class="mono muted" style="margin:0 0 14px">${t('cat.loading')}</p><div class="skel-rows"><i></i><i></i><i></i></div></div>`;
const catTile = (href, i, kicker, title, sub, count, samples, alc) => `<a class="ctile rv-card" href="${href}" style="--d:${i % 8}">
  <span class="mono">${esc(kicker)}${alc ? ' <i class="b18">18+</i>' : ''}</span><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}
  <span class="cn num">${count}</span><span class="cs">${samples.map(esc).join(' · ')}</span></a>`;
const baseFoods = () => FOOD_DB.filter(f => !f.cuisine && (f.src === 'usda' || f.src === 'local')).sort((a, b) => foodName(a).localeCompare(foodName(b), 'ru'));

function catalogHomeHtml() {
  if (!Catalog.loaded) return catLoading();
  const C = Catalog.data;
  const groups = C.groups.map((g, gi) => ({ g, gi, items: Catalog.groupItems(gi) }));
  const cuis = groups.filter(x => x.g[3] === 'cuisine');
  const snacks = groups.filter(x => x.g[3] === 'snacks');
  const drinks = groups.find(x => x.g[3] === 'drinks');
  const dcats = [];
  Catalog.list.filter(e => e.g === drinks.gi).forEach(e => {
    let d = dcats.find(x => x.c === e.c);
    if (!d) dcats.push(d = { c: e.c, name: Catalog.catName(e.c), items: [], alc: true });
    d.items.push(e); if (!e.alc) d.alc = false;
  });
  const shownDrinks = dcats.filter(d => !d.alc || Catalog.allowAlcohol());
  const sum = a => a.reduce((n, x) => n + x.items.length, 0);
  const base = baseFoods();
  return `
    <div class="card catsearch rv"><div class="unitfield"><input class="input big" id="cq" placeholder="${esc(t('cat.search.ph'))}" autocomplete="off"><em>${ICON.search.replace('<svg', '<svg width="20" height="20"')}</em></div>
      <div class="search-res" id="cres" style="max-height:none"></div></div>
    <div id="chome">
      <section class="section"><div class="sec-head"><h2 class="h2">${UI.split(t('cat.cuisines'))}</h2><span class="mono muted">${cuis.length} · ${sum(cuis)} ${t('cat.items')}</span></div>
        <div class="cgrid">${cuis.map((x, i) => catTile(`#/foods/cat/${x.g[0]}`, i, `/ ${String(i + 1).padStart(2, '0')} · ${groupRegion(x.g)}`, groupShortName(x.g), groupSubName(x.g), x.items.length, Catalog.previews(x.items, 3))).join('')}</div></section>
      <section class="section"><div class="sec-head"><h2 class="h2">${UI.split(t('cat.snacks'))}</h2><span class="mono muted">${sum(snacks)} ${t('cat.items')}</span></div>
        <div class="cgrid">${snacks.map((x, i) => catTile(`#/foods/cat/${x.g[0]}`, i, `/ ${groupRegion(x.g)}`, groupShortName(x.g), '', x.items.length, Catalog.previews(x.items, 4))).join('')}</div></section>
      <section class="section"><div class="sec-head"><h2 class="h2">${UI.split(t('cat.drinks'))}</h2><span class="mono muted">${shownDrinks.reduce((n, d) => n + d.items.length, 0)} ${t('cat.items')}</span></div>
        ${Catalog.allowAlcohol() ? '' : `<p class="callout" style="font-size:14px">${t('cat.hidden18')}</p>`}
        <div class="cgrid">${shownDrinks.map((d, i) => catTile(`#/foods/cat/drinks?c=${d.c}`, i, `/ ${String(i + 1).padStart(2, '0')}`, d.name, '', d.items.length, Catalog.previews(d.items, 3), d.alc)).join('')}</div></section>
      <section class="section"><div class="sec-head"><h2 class="h2">${UI.split(t('cat.base'))}</h2><span class="mono muted">${base.length} ${t('cat.items')}</span></div>
        <div class="cgrid">${catTile('#/foods/cat/base', 0, '/ USDA · ' + t('src.local').toLowerCase(), t('cat.base.title'), t('cat.base.sub'), base.length, base.slice(0, 4).map(foodName))}</div></section>
    </div>`;
}

function catalogRows(list) {
  return list.map(x => {
    if (x.food) {
      const f = x.food;
      return `<button class="crow" data-food="${f.id}"><span class="cn">${esc(foodName(f))}<small>${fmt(f.per100.kcal)} ${t('u.kcal')} / 100 ${unitLbl(f.opts)} · ${macroLine(f.per100)}</small></span><span class="cplus">${ICON.plus}</span></button>`;
    }
    const e = x, est = Catalog.estimate(e);
    const extra = [...(e.type === 'drinks' ? [] : dietTags(Catalog.diet(e), true)), ...Catalog.tagsOf(e)];
    return `<button class="crow" data-id="${e.id}"><span class="cn">${esc(Catalog.name(e))}${e.alc ? '<i class="b18">18+</i>' : ''}<small>${isApprox(est.source) ? '≈ ' : ''}${fmt(est.per100.kcal)} ${t('u.kcal')} / 100 ${unitLbl(est.opts)}${extra.length ? ' · ' + esc(extra.join(', ')) : ''}</small></span><span class="cplus">${ICON.plus}</span></button>`;
  }).join('');
}

/* сортировка списка кухни, напитков или продуктов; выбор запоминается в этом браузере */
const CAT_SORTS = ['def', 'az', 'kdesc', 'kasc'];
const catSort = {
  get() { try { const v = localStorage.getItem('nutrilens.catSort'); return CAT_SORTS.includes(v) ? v : 'def'; } catch (e) { return 'def'; } },
  set(v) { try { localStorage.setItem('nutrilens.catSort', v); } catch (e) {} },
};
const catSortHtml = (base) => `<div class="cuisines csort" id="gsort"><span class="mono muted">${t('cat.sort')}</span>${CAT_SORTS.map(v => `<button class="pill ${catSort.get() === v ? 'on' : ''}" data-s="${v}">${t(v === 'def' && base ? 'cat.sort.base' : 'cat.sort.' + v)}</button>`).join('')}</div>`;
// name и kcal — функции, чтобы одинаково сортировать позиции каталога и продукты базы
function sortCatalog(list, mode, name, kcal) {
  if (mode === 'az') { const lang = Store.state.settings.lang; return list.slice().sort((a, b) => name(a).localeCompare(name(b), lang)); }
  if (mode === 'kdesc') return list.slice().sort((a, b) => kcal(b) - kcal(a));
  if (mode === 'kasc') return list.slice().sort((a, b) => kcal(a) - kcal(b));
  return list;
}
const catKcal = e => Catalog.estimate(e).per100.kcal;

function catalogGroupHtml(r) {
  if (!Catalog.loaded) return catLoading();
  const gid = r.parts[2];
  const back = `<a class="link" href="#/foods">← ${t('cat.title')}</a>`;
  if (gid === 'base') {
    const base = baseFoods();
    return `${back}<span class="kicker" style="display:flex;margin-top:16px">${base.length} ${t('cat.items')}</span>
      <h1 class="h1">${UI.split(t('cat.base.title'), 'hoverable')}</h1>
      <div class="card catgroup" style="margin-top:22px"><div class="unitfield"><input class="input" id="gq" placeholder="${esc(t('cat.inCuisine'))}" autocomplete="off"><em>${ICON.search.replace('<svg', '<svg width="18" height="18"')}</em></div>
      ${catSortHtml(true)}
      <div class="clist" id="glist"></div></div>`;
  }
  const C = Catalog.data, gi = C.groups.findIndex(g => g[0] === gid);
  if (gi < 0) return `${back}<p class="serif" style="font-size:26px">${t('cat.nothing')}</p>`;
  const g = C.groups[gi], items = Catalog.groupItems(gi);
  const cats = [];
  items.forEach(e => { let c = cats.find(x => x.c === e.c); if (!c) cats.push(c = { c: e.c, name: Catalog.catName(e.c), n: 0, alc: true }); c.n++; if (!e.alc) c.alc = false; });
  const sel = r.q.c !== undefined && r.q.c !== '' ? Number(r.q.c) : null;
  const title = gid === 'drinks' && sel !== null ? Catalog.catName(sel) : groupShortName(g);
  return `${back}
    <span class="kicker" style="display:flex;margin-top:16px">${esc(groupRegion(g))} · ${items.length} ${t('cat.items')}</span>
    <h1 class="h1">${UI.split(title, 'hoverable')}</h1>
    ${groupSubName(g) ? `<p class="serif" style="font-size:24px;margin:8px 0 0">${esc(groupSubName(g))}</p>` : ''}
    <div class="card catgroup" style="margin-top:22px">
      <div class="unitfield"><input class="input" id="gq" placeholder="${esc(t('cat.inCuisine'))}" autocomplete="off"><em>${ICON.search.replace('<svg', '<svg width="18" height="18"')}</em></div>
      ${catSortHtml(false)}
      ${cats.length > 1 ? `<div class="cuisines" id="gcats"><button class="pill ${sel === null ? 'on' : ''}" data-c="">${t('cat.all')} <small>${items.length}</small></button>${cats.map(c => `<button class="pill ${sel === c.c ? 'on' : ''}" data-c="${c.c}">${esc(c.name)}${c.alc ? ' <i class="b18">18+</i>' : ''} <small>${c.n}</small></button>`).join('')}</div>` : ''}
      <div id="glist"></div>
    </div>`;
}

function catalogGroupMount(el, r) {
  if (!Catalog.loaded) return;
  const gid = r.parts[2], list = $('#glist', el), q = $('#gq', el);
  if (!list) return; // такой кухни нет — на экране только «Ничего не нашлось»
  const pick = e => {
    const b = e.target.closest('[data-id],[data-food]'); if (!b) return;
    if (b.dataset.id) logSheet(Catalog.toItem(Catalog.byId.get(b.dataset.id)));
    else logSheet(itemFromFood(FOOD_DB.find(f => f.id === b.dataset.food)));
  };
  list.onclick = pick;
  const words = () => normalize(q.value).split(' ').filter(Boolean);
  const hit = name => { const w = words(), n = normalize(name).split(' '); return w.every(x => n.some(y => y.startsWith(x))); };
  let mode = catSort.get();
  const sortBar = $('#gsort', el);
  const onSort = redraw => sortBar && (sortBar.onclick = e => {
    const b = e.target.closest('[data-s]'); if (!b) return;
    mode = b.dataset.s; catSort.set(mode);
    $$('#gsort .pill', el).forEach(x => x.classList.toggle('on', x === b));
    redraw();
  });
  if (gid === 'base') {
    const base = baseFoods();
    const drawBase = () => {
      const shown = sortCatalog(base.filter(f => hit(foodName(f))), mode, foodName, f => f.per100.kcal);
      list.innerHTML = catalogRows(shown.map(food => ({ food }))) || `<p class="muted">${t('cat.nothing')}</p>`;
    };
    q.oninput = drawBase; onSort(drawBase); drawBase();
    return;
  }
  const C = Catalog.data, gi = C.groups.findIndex(g => g[0] === gid);
  const items = Catalog.groupItems(gi);
  let sel = r.q.c !== undefined && r.q.c !== '' ? Number(r.q.c) : null;
  const draw = () => {
    const shown = items.filter(e => (sel === null || e.c === sel) && (!q.value.trim() || hit(e.name) || (e.en && hit(e.en)) || (e.uz && hit(e.uz))));
    if (mode !== 'def') {
      // отсортированный список — одним блоком, без разбивки по разделам
      list.innerHTML = shown.length ? `<div class="clist" style="margin-top:4px">${catalogRows(sortCatalog(shown, mode, e => Catalog.name(e), catKcal))}</div>` : `<p class="muted">${t('cat.nothing')}</p>`;
      list.style.animation = 'none'; void list.offsetWidth; list.style.animation = 'viewIn .6s var(--ease-out) both';
      return;
    }
    const sections = [];
    shown.forEach(e => { let s = sections.find(x => x.c === e.c); if (!s) sections.push(s = { c: e.c, name: Catalog.catName(e.c), items: [] }); s.items.push(e); });
    list.innerHTML = sections.map(s => `<section class="catsec"><h3 class="h3">${esc(s.name)} <small class="mono muted">${s.items.length}</small></h3><div class="clist">${catalogRows(s.items)}</div></section>`).join('') || `<p class="muted">${t('cat.nothing')}</p>`;
    list.style.animation = 'none'; void list.offsetWidth; list.style.animation = 'viewIn .6s var(--ease-out) both';
  };
  q.oninput = draw;
  onSort(draw);
  const cs = $('#gcats', el);
  cs && (cs.onclick = e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    sel = b.dataset.c === '' ? null : Number(b.dataset.c);
    $$('#gcats .pill', el).forEach(x => x.classList.toggle('on', x === b));
    history.replaceState(null, '', `#/foods/cat/${gid}${sel === null ? '' : '?c=' + sel}`);
    draw();
  });
  draw();
}

Views.foods = {
  html(r) {
    if (r.parts[1] === 'cat') return catalogGroupHtml(r);
    const s = Store.state;
    const tab = foodsTab;
    let body = '';
    if (tab === 'catalog') body = catalogHomeHtml();
    if (tab === 'my') body = `
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))">
        ${s.myFoods.map((f, i) => `<div class="card rv-card" style="--d:${i % 8};display:grid;gap:10px"><span class="mono muted">/ ${String(i + 1).padStart(3, '0')}</span><h3 class="h3">${esc(f.name)}</h3>
          <span class="mono muted">${fmt(f.per100.kcal)} ${t('u.kcal')} / 100 ${t('u.g')} · ${macroLine(f.per100)}</span>
          <div class="row"><button class="pill on" data-log="${i}">${ICON.plus.replace('<svg', '<svg width="14" height="14"')} ${t('foods.add')} · ${fmtMass(f.portion || 100)}</button><span class="spacer"></span><button class="icon-btn sm" data-delmy="${i}" aria-label="${t('res.delete')}">${ICON.trash}</button></div></div>`).join('')}
        <button class="card rv-card" id="newfood" style="border:2px dashed var(--line);background:transparent;display:grid;place-items:center;min-height:180px;gap:8px">${ICON.plus.replace('<svg', '<svg width="30" height="30"')}<span class="h3">${t('foods.new')}</span></button>
      </div>
      ${s.myFoods.length ? '' : `<p class="serif" style="font-size:26px;margin-top:20px">${t('foods.empty.my')}</p>`}`;
    if (tab === 'recent') body = s.recent.length ? `<div class="search-res" style="max-height:none">${s.recent.map((x, i) => `<div class="row card rv" style="--d:${i % 10};padding:12px 16px"><span style="flex:1">${esc(x.name)}<br><small class="mono muted">${fmtMass(x.grams)} · ${fmt(itemNutrients(x).kcal)} ${t('u.kcal')} · ${t('src.' + (x.source || 'local'))}</small></span><button class="pill" data-tomy="${i}">${t('foods.tomy')}</button><button class="pill on" data-logr="${i}">${t('foods.add')}</button></div>`).join('')}</div>` : `<p class="serif" style="font-size:26px">${t('foods.empty.recent')}</p>`;
    return `
      <span class="kicker">${t('foods.title')}</span>
      <div class="datebar" style="margin-top:12px"><h1 class="h1">${UI.split(tab === 'catalog' ? t('cat.title') : t('foods.title'), 'hoverable')}</h1>
        <div class="seg" id="ftab"><button aria-pressed="${tab === 'catalog'}" data-t="catalog">${t('cat.title')}</button><button aria-pressed="${tab === 'my'}" data-t="my">${t('foods.my')}</button><button aria-pressed="${tab === 'recent'}" data-t="recent">${t('foods.recent')}</button></div></div>
      <div class="section" style="margin-top:26px">${body}</div>`;
  },
  mount(el, r) {
    const needCatalog = r.parts[1] === 'cat' || foodsTab === 'catalog';
    if (needCatalog && !Catalog.loaded) {
      Catalog.load().then(() => { Router.silent = true; Router.render(); }).catch(() => UI.toast(t('err.OFFLINE'), { err: true }));
      return;
    }
    if (r.parts[1] === 'cat') return catalogGroupMount(el, r);
    const s = Store.state;
    $('#ftab', el).onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; foodsTab = b.dataset.t; Router.silent = true; Router.render(); };
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-log],[data-delmy],[data-logr],[data-tomy]'); if (!b) return;
      if (b.dataset.log !== undefined) { const f = s.myFoods[Number(b.dataset.log)]; logSheet({ name: f.name, grams: f.portion || 100, per100: f.per100, source: 'user', confidence: 1, grams_source: 'user' }); }
      if (b.dataset.delmy !== undefined) { const i = Number(b.dataset.delmy), f = s.myFoods[i]; s.myFoods.splice(i, 1); Store.save(); Router.silent = true; Router.render(); UI.toast(t('res.deleted'), { action: t('res.undo'), onAction: () => { s.myFoods.splice(i, 0, f); Store.save(); Router.silent = true; Router.render(); } }); }
      if (b.dataset.logr !== undefined) { const x = s.recent[Number(b.dataset.logr)]; logSheet({ name: x.name, grams: x.grams, per100: x.per100, source: x.source, foodId: x.foodId, confidence: 1, grams_source: 'user', origin: 'copy', opts: x.opts }); }
      if (b.dataset.tomy !== undefined) { const x = s.recent[Number(b.dataset.tomy)]; s.myFoods.unshift({ id: uid(), name: x.name, per100: Object.assign({}, x.per100), portion: Math.round(x.grams) }); Store.save(); UI.toast(t('foods.saved')); }
    });
    const nf = $('#newfood', el);
    nf && (nf.onclick = () => newFoodSheet());
    const q = $('#cq', el);
    if (q) {
      const out = $('#cres', el), home = $('#chome', el);
      let res = [];
      q.oninput = () => {
        const v = q.value.trim();
        home.hidden = !!v;
        res = v ? searchAll(v, 60) : [];
        out.innerHTML = v ? (res.map(resultRow).join('') || `<p class="muted" style="padding:10px">${t('cat.nothing')}</p>`) : '';
      };
      out.onclick = e => { const b = e.target.closest('[data-i]'); if (b) logSheet(resultItem(res[Number(b.dataset.i)])); };
    }
  },
};

function newFoodSheet() {
  const sheet = UI.modal(`
    <div class="kicker">${t('foods.my')}</div><h2 class="h2" style="margin:10px 0 18px">${t('foods.new')}</h2>
    <div class="grid" style="gap:12px">
      <label class="field"><span>${t('foods.name')}</span><input class="input" id="nf-name" maxlength="60"></label>
      <label class="field"><span>${t('foods.portion')}</span><input class="input" id="nf-portion" type="number" inputmode="decimal" value="100"></label>
      <span class="kicker">${t('foods.per100')}</span>
      <div class="tgrid">${NUTRIENT_KEYS.map(k => `<div class="tcell"><label>${t('n.' + k)}, ${nUnit(k)}</label><input type="number" inputmode="decimal" data-k="${k}" value="0" aria-label="${t('n.' + k)}, ${nUnit(k)}" style="font-size:26px"></div>`).join('')}</div>
      <button class="btn big" id="nf-save">${t('foods.save')}<span class="arr">${ICON.arrow}</span></button>
    </div>`);
  $('#nf-save', sheet).onclick = () => {
    const name = $('#nf-name', sheet).value.trim(); if (!name) { UI.toast(t('err.range'), { err: true }); return; }
    const per100 = {}; $$('[data-k]', sheet).forEach(i => per100[i.dataset.k] = Math.max(0, Number(i.value) || 0));
    Store.state.myFoods.unshift({ id: uid(), name, per100, portion: clamp(Number($('#nf-portion', sheet).value) || 100, 1, 5000) });
    Store.save(); UI.closeModal(); UI.toast(t('foods.saved')); Router.silent = true; Router.render();
  };
}

/* ===== Ассистент ===== */
let chatBusy = null;
Views.chat = {
  html() {
    const h = Store.state.chat;
    return `
      <span class="kicker">${t('chat.title')}</span>
      <div class="datebar" style="margin-top:12px"><h1 class="h1">${UI.split(tr('Спроси меня', 'Ask me anything', 'Mendan so‘rang'), 'hoverable')}</h1>
        ${h.length ? `<button class="pill ghosty" id="cclear">${t('chat.clear')}</button>` : ''}</div>
      <div class="chat">
        <div class="msgs" id="msgs">
          <div class="msg assistant">${esc(aiReady() ? t('chat.lead') : t('chat.nokey'))}</div>
          ${h.map(m => `<div class="msg ${m.role}">${esc(m.text)}</div>`).join('')}
          ${!h.length && aiReady() ? `<div class="row" id="sugg">${['chat.s1', 'chat.s2', 'chat.s3'].map(k => `<button class="pill"><span class="tick">${ICON.star}</span>${t(k)}</button>`).join('')}</div>` : ''}
        </div>
        <form class="chatbar" id="cform"><input id="cin" placeholder="${esc(t('chat.ph'))}" autocomplete="off" aria-label="${t('chat.ph')}" ${aiReady() ? '' : 'disabled'}><button class="btn" ${aiReady() ? '' : 'disabled'} aria-label="${t('chat.send')}"><span class="lbl">${t('chat.send')}</span><span class="arr">${ICON.arrow}</span></button></form>
        ${aiReady() ? '' : `<a class="btn" href="#/settings" style="justify-self:start">${t('nav.settings')}<span class="arr">${ICON.arrow}</span></a>`}
      </div>`;
  },
  mount(el) {
    const msgs = $('#msgs', el), inp = $('#cin', el);
    const send = async text => {
      if (!text.trim() || chatBusy) return;
      const sg = $('#sugg', el); sg && sg.remove();
      Store.state.chat.push({ role: 'user', text }); Store.save();
      msgs.insertAdjacentHTML('beforeend', `<div class="msg user">${esc(text)}</div><div class="msg assistant typing" id="typing"></div>`);
      const tEl = $('#typing', el);
      tEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
      chatBusy = new AbortController();
      try {
        const out = await aiChat(Store.state.chat.slice(-20), { signal: chatBusy.signal, onText: s => { tEl.textContent = s; } });
        Store.state.chat.push({ role: 'assistant', text: out }); Store.state.chat = Store.state.chat.slice(-40); Store.save();
      } catch (e) {
        tEl.textContent = t('err.' + (e.code || 'AI_UNAVAILABLE'));
        Store.state.chat.pop(); Store.save();
      } finally { tEl.classList.remove('typing'); tEl.removeAttribute('id'); chatBusy = null; }
    };
    $('#cform', el).onsubmit = e => { e.preventDefault(); const v = inp.value; inp.value = ''; send(v); };
    const sg = $('#sugg', el); sg && (sg.onclick = e => { const b = e.target.closest('button'); if (b) send(b.textContent.trim()); });
    const cl = $('#cclear', el); cl && (cl.onclick = () => { Store.state.chat = []; Store.save(); Router.silent = true; Router.render(); });
  },
};

/* ===== Настройки ===== */
Views.settings = {
  html() {
    const s = Store.state, p = s.profile || {}, tg = s.targets || {}, st = s.settings;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `
      <span class="kicker">${t('set.title')}</span>
      <h1 class="h1" style="margin-top:12px">${UI.split(t('set.title'), 'hoverable')}</h1>
      <div class="settings">
        ${Cloud.available ? `<div class="card wide rv account"><h3 class="h3">${t('auth.account')}</h3>${Cloud.user ? `
          <div class="row"><span class="pill"><span class="tick">${ICON.check}</span>${t('auth.signedAs')}&nbsp;<b>${esc(Cloud.user.email)}</b>${Cloud.user.email_verified ? `&nbsp;<span class="muted">· ${t('auth.verified')}</span>` : ''}</span>${syncBadge()}</div>
          ${Cloud.user.email_verified ? '' : `<div class="callout warn" style="margin:0"><b>${t('auth.unverified')}.</b> ${t('auth.unverified.lead')} <button class="link" id="averify">${t('auth.verify.send')}</button></div>`}
          <p class="mono muted" style="margin:0">${t('auth.lastSync')}: ${Cloud.meta.syncedAt ? new Date(Cloud.meta.syncedAt).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }) : t('auth.never')} · ${t('auth.photosLocal')}</p>
          <div class="row"><button class="btn" id="async">${t('auth.sync.now')}<span class="arr">${ICON.arrow}</span></button>
            <button class="pill ghosty" id="achpw">${t('auth.chpw')}</button><button class="pill ghosty" id="alogout">${t('auth.logout')}</button>
            <span class="spacer"></span><button class="pill warn" id="adel"><span class="tick">${ICON.trash}</span>${t('auth.delete')}</button></div>`
          : `<p class="lead" style="margin:0">${t('auth.account.off')}</p>
          <div class="row"><a class="btn" href="#/auth?mode=register">${t('auth.submit.register')}<span class="arr">${ICON.arrow}</span></a><a class="btn light" href="#/auth?mode=login">${t('auth.submit.login')}<span class="arr">${ICON.arrow}</span></a></div>`}</div>` : ''}
        <form class="card rv" id="fprof"><h3 class="h3">${t('set.profile')}</h3>
          <div class="formgrid">
            <label class="field" style="grid-column:1/-1"><span>${t('onb.name')}</span><input class="input" name="name" value="${esc(p.name || '')}"></label>
            <label class="field"><span>${t('onb.sex')}</span><select class="select" name="sex"><option value="f" ${p.sex === 'f' ? 'selected' : ''}>${t('onb.sex.f')}</option><option value="m" ${p.sex === 'm' ? 'selected' : ''}>${t('onb.sex.m')}</option></select></label>
            <label class="field"><span>${t('onb.age')}</span><input class="input" name="age" type="number" value="${p.age || ''}"></label>
            <label class="field"><span>${t('onb.height')}, ${t('u.cm')}</span><input class="input" name="height" type="number" value="${p.height || ''}"></label>
            <label class="field"><span>${t('onb.weight')}, ${bodyUnit()}</span><input class="input" name="weight" type="number" step="0.1" value="${p.weight ? bodyOut(p.weight) : ''}"></label>
            <label class="field"><span>${t('onb.s2')}</span><select class="select" name="activity">${Object.keys(ACTIVITY).map(k => `<option value="${k}" ${p.activity === k ? 'selected' : ''}>${t('act.' + k)}</option>`).join('')}</select></label>
            <label class="field"><span>${t('onb.s3')}</span><select class="select" name="goal">${Object.keys(GOAL_K).map(k => `<option value="${k}" ${p.goal === k ? 'selected' : ''}>${t('goal.' + k)}</option>`).join('')}</select></label>
            <label class="check" style="grid-column:1/-1"><input type="checkbox" name="pregnant" ${p.pregnant ? 'checked' : ''}> ${t('onb.pregnant')}</label>
          </div>
          <div class="row"><button class="btn">${t('set.save')}<span class="arr">${ICON.check}</span></button></div>
        </form>

        <form class="card rv" id="ftg" style="--d:1"><h3 class="h3">${t('set.targets')}</h3>
          <div class="tgrid">${NUTRIENT_KEYS.map(k => `<div class="tcell ${k === 'kcal' ? 'hero' : ''}"><label>${t('n.' + k)}, ${nUnit(k)}</label><input type="number" name="${k}" value="${tg[k] ?? ''}" aria-label="${t('n.' + k)}, ${nUnit(k)}" style="${k === 'kcal' ? '' : 'font-size:28px'}"></div>`).join('')}</div>
          <div id="tgwarn"></div>
          <div class="row"><button class="btn">${t('set.save')}<span class="arr">${ICON.check}</span></button><button type="button" class="pill ghosty" id="recalc">${t('set.recalc')}</button><span class="mono muted">${tg.source === 'manual' ? 'manual' : 'auto · ' + t('onb.formula')}</span></div>
        </form>

        <div class="card rv" style="--d:2"><h3 class="h3">${t('set.units')}</h3>
          <div class="field"><span>${t('set.mass')}</span><div class="seg" data-set="mass"><button aria-pressed="${st.mass === 'g'}" data-v="g">${I18N[st.lang]['u.g']}</button><button aria-pressed="${st.mass === 'oz'}" data-v="oz">${I18N[st.lang]['u.oz']}</button></div></div>
          <div class="field"><span>${t('set.body')}</span><div class="seg" data-set="body"><button aria-pressed="${st.body === 'kg'}" data-v="kg">${I18N[st.lang]['u.kg']}</button><button aria-pressed="${st.body === 'lb'}" data-v="lb">${I18N[st.lang]['u.lb']}</button></div></div>
          <div class="field"><span>${t('set.lang')}</span><div class="seg" data-set="lang"><button aria-pressed="${st.lang === 'ru'}" data-v="ru">Русский</button><button aria-pressed="${st.lang === 'en'}" data-v="en">English</button><button aria-pressed="${st.lang === 'uz'}" data-v="uz">O‘zbekcha</button></div></div>
          <div class="field"><span>${t('set.theme')}</span><div class="seg" data-set="theme">${['auto', 'light', 'dark'].map(v => `<button aria-pressed="${(st.theme || 'auto') === v}" data-v="${v}">${t('theme.' + v)}</button>`).join('')}</div></div>
          <div class="field"><span>${t('set.tz')}</span><span class="pill ghosty" style="justify-self:start">${esc(tz)}</span></div>
        </div>

        <div class="card dark rv" style="--d:3"><h3 class="h3">${t('set.ai')}</h3>
          <p style="margin:0;color:#c8ccd6;font-size:14px">${t('set.ai.lead')}</p>
          ${/^sk-/.test(st.apiKey || '') ? `<div class="callout warn" style="font-size:14px">${t('set.key.old')}</div>` : ''}
          ${AIServer.enabled ? `<div class="callout" style="font-size:14px;background:#1c1d21;color:#e8eaee">${ownKey() ? t('set.ai.own') : t('set.ai.shared', { n: AIServer.remaining, m: AIServer.limit })}</div>` : ''}
          <label class="field"><span style="color:#9aa0ae">${t('set.key')}</span><input class="input" id="akey" type="password" autocomplete="off" spellcheck="false" placeholder="${st.apiKey ? '••••••••' + esc(st.apiKey.slice(-4)) : t('set.key.ph')}" style="background:#1c1d21;color:#fff"></label>
          <label class="field"><span style="color:#9aa0ae">${t('set.model')}</span><select class="select" id="amodel" style="background:#1c1d21;color:#fff">${MODELS.map(m => `<option value="${m.id}" ${st.model === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}</select></label>
          <div class="row"><button class="btn lime" id="asave">${t('set.save')}<span class="arr">${ICON.check}</span></button>${st.apiKey ? `<button class="pill" id="atest" style="background:#1c1d21;color:#fff">${t('set.key.test')}</button><button class="pill" id="akeydel" style="background:#1c1d21;color:#fff">${t('set.key.del')}</button>` : ''}</div>
          <div class="field"><span style="color:#9aa0ae">${t('set.photos')}</span><div class="seg" data-set="photoPolicy" style="background:#1c1d21">${['none', '30', 'forever'].map(v => `<button aria-pressed="${st.photoPolicy === v}" data-v="${v}">${t('set.photo.' + v)}</button>`).join('')}</div></div>
        </div>

        <div class="card wide rv" style="--d:4"><h3 class="h3">${t('set.data')}</h3>
          <p class="lead" style="margin:0">${t('set.data.lead')}</p>
          <p class="muted" style="margin:0"><a href="${policyHref()}" target="_blank" rel="noopener">${t('priv.name')}</a>${s.settings.aiConsent ? ` · ${t('ai.consent.given', { date: fmtDate(new Date(s.settings.aiConsent.at)) })} <button class="link" id="aiwithdraw">${t('ai.consent.withdraw')}</button>` : ''}</p>
          <div class="row">
            <button class="btn" id="dcsv">${t('set.csv')}<span class="arr">${ICON.arrow}</span></button>
            <button class="btn light" id="djson">${t('set.json')}<span class="arr">${ICON.arrow}</span></button>
            <label class="pill ghosty" style="cursor:pointer">${t('set.import')}<input type="file" id="dimp" accept="application/json,.json" hidden></label>
            <span class="spacer"></span>
            <button class="pill warn" id="dwipe"><span class="tick">${ICON.trash}</span>${t('set.wipe')}</button>
          </div>
          <p class="disc">${t('set.disclaimer')} · prompt ${PROMPT_VERSION}</p>
        </div>
      </div>`;
  },
  mount(el) {
    const s = Store.state;
    const reload = () => { Router.silent = true; Router.render(); };
    $('#fprof', el).onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const p = { name: f.get('name').trim(), sex: f.get('sex'), age: +f.get('age'), height: +f.get('height'), weight: round1(bodyIn(f.get('weight'))), activity: f.get('activity'), goal: f.get('goal'), pregnant: f.get('sex') === 'f' && !!f.get('pregnant') };
      if (!profileValid(p)) { UI.toast(t('err.range'), { err: true }); return; }
      s.profile = p;
      if (s.targets && s.targets.source !== 'manual' && autoTargetsAllowed(p)) s.targets = calcTargets(p).targets;
      Store.save(); UI.toast(t('set.saved')); reload();
    };
    const tgf = $('#ftg', el);
    const warn = () => { const k = Number(tgf.kcal.value), min = minKcal((s.profile || {}).sex); $('#tgwarn', el).innerHTML = k && k < min ? `<div class="callout warn">${t('set.low', { n: min })}</div>` : ''; };
    tgf.oninput = warn; warn();
    tgf.onsubmit = e => {
      e.preventDefault();
      const tg = { source: 'manual' }; NUTRIENT_KEYS.forEach(k => tg[k] = Math.max(0, Number(tgf[k].value) || 0));
      if (!tg.kcal) { UI.toast(t('err.range'), { err: true }); return; }
      s.targets = tg; Store.save(); UI.toast(t('set.saved')); reload();
    };
    $('#recalc', el).onclick = () => {
      if (!autoTargetsAllowed(s.profile)) { UI.toast(t('onb.noauto'), { err: true, ms: 7000 }); return; }
      s.targets = calcTargets(s.profile).targets; Store.save(); UI.toast(t('set.saved')); reload();
    };
    $$('[data-set]', el).forEach(g => g.onclick = e => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      const st0 = s.settings[g.dataset.set];
      s.settings[g.dataset.set] = b.dataset.v; Store.save();
      if (g.dataset.set === 'photoPolicy') PhotoDB.cleanup(b.dataset.v);
      if (g.dataset.set === 'theme') { s.settings.theme = st0; const r = b.getBoundingClientRect(); switchTheme(b.dataset.v, r.left + r.width / 2, r.top + r.height / 2); setTimeout(reload, 800); return; }
      reload();
    });
    $('#asave', el).onclick = () => {
      const k = $('#akey', el).value.trim();
      if (k.startsWith('sk-')) { UI.toast(t('set.key.old'), { err: true, ms: 6000 }); return; }
      if (k) s.settings.apiKey = k;
      s.settings.model = $('#amodel', el).value; callGemini.working = null;
      Store.save(); UI.toast(k ? t('set.key.saved') : t('set.saved')); reload();
    };
    const at = $('#atest', el);
    at && (at.onclick = async () => { at.disabled = true; try { await aiPing(); UI.toast(t('set.key.ok')); } catch (e) { UI.toast(t('err.' + (e.code || 'AI_UNAVAILABLE')) + (e.detail ? ` (${e.detail})` : ''), { err: true, ms: 7000 }); } at.disabled = false; });
    const ad = $('#akeydel', el);
    ad && (ad.onclick = () => { s.settings.apiKey = ''; Store.save(); reload(); });
    $('#dcsv', el).onclick = exportCSV;
    $('#djson', el).onclick = exportJSON;
    $('#dimp', el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || typeof data.days !== 'object') throw new Error('bad');
        const key = s.settings.apiKey;
        Store.state = sanitizeState(Object.assign(defaultState(), data));
        Store.state.settings = Object.assign(defaultState().settings, data.settings, { apiKey: key });
        Store.save(); UI.toast(t('set.imported')); Router.go('#/');
      } catch (err) { UI.toast(t('err.range'), { err: true }); }
    };
    const pwSheet = (title, lead, fields, okLabel, onOk, danger) => {
      const sh = UI.modal(`<div class="kicker">${t('auth.account')}</div><h2 class="h2" style="margin:10px 0 14px">${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}
        <form id="pwf" class="grid" style="gap:14px" novalidate>${fields.map(([n, l, ac]) => `<label class="field"><span>${l}</span><input class="input" type="password" name="${n}" autocomplete="${ac}" required></label>`).join('')}
        <div class="autherr" id="pwerr" role="alert"></div>
        <div class="row"><button class="btn" type="submit" ${danger ? 'style="--bg-b:var(--warn)"' : ''}>${okLabel}<span class="arr">${danger ? ICON.trash : ICON.check}</span></button><button type="button" class="pill ghosty" data-close>${t('set.cancel')}</button></div></form>`);
      const f = $('#pwf', sh);
      f.onsubmit = async e => {
        e.preventDefault();
        const b = f.querySelector('[type=submit]'); b.disabled = true;
        try { await onOk(f); }
        catch (ex) { const m = t('err.' + (ex.code === 'INVALID_CREDENTIALS' ? 'WRONG_PASSWORD' : ex.code || 'SERVER_ERROR')); $('#pwerr', sh).textContent = m.startsWith('err.') ? t('err.SERVER_ERROR') : m; b.disabled = false; }
      };
    };
    const acc = id => $(id, el);
    $('#aiwithdraw', el) && ($('#aiwithdraw', el).onclick = () => { delete s.settings.aiConsent; Store.save(); UI.toast(t('ai.consent.withdrawn')); reload(); });
    acc('#averify') && (acc('#averify').onclick = e => sendVerifyMail(e.currentTarget));
    acc('#async') && (acc('#async').onclick = async () => { await Cloud.flush(); await Cloud.pull(); UI.toast(t('set.saved')); reload(); });
    acc('#achpw') && (acc('#achpw').onclick = () => pwSheet(t('auth.chpw'), '', [['current', t('auth.pw.current'), 'current-password'], ['next', t('auth.pw.new') + ' · ' + t('auth.pw.hint'), 'new-password']], t('set.save'), async f => {
      if (f.next.value.length < 10) throw { code: 'PASSWORD_TOO_SHORT' };
      await Cloud.changePassword(f.current.value, f.next.value);
      UI.closeModal(); UI.toast(t('auth.pw.changed'), { ms: 5000 });
    }));
    acc('#alogout') && (acc('#alogout').onclick = () => {
      const sh = UI.modal(`<div class="kicker">${t('auth.account')}</div><h2 class="h2" style="margin:10px 0 14px">${t('auth.logout')}</h2><p class="lead">${t('auth.logout.q')}</p>
        <div class="row" style="margin-top:18px"><button class="btn" id="lok">${t('auth.logout')}<span class="arr">${ICON.arrow}</span></button><button class="pill ghosty" data-close>${t('set.cancel')}</button></div>`);
      $('#lok', sh).onclick = async () => { await Cloud.logout(); resetOnb(); UI.closeModal(); Router.go('#/welcome'); };
    });
    acc('#adel') && (acc('#adel').onclick = () => pwSheet(t('auth.delete'), t('auth.delete.q'), [['password', t('auth.password'), 'current-password']], t('auth.delete'), async f => {
      await Cloud.deleteAccount(f.password.value);
      resetOnb(); UI.closeModal(); UI.toast(t('auth.deleted')); Router.go('#/welcome');
    }, true));
    $('#dwipe', el).onclick = () => {
      const sh = UI.modal(`<div class="kicker">${t('set.data')}</div><h2 class="h2" style="margin:10px 0 14px">${t('set.wipe')}</h2><p class="lead">${t('set.wipe.q')}</p>
        <div class="row" style="margin-top:18px"><button class="btn" id="wok" style="--bg-b:var(--warn)">${t('set.wipe.ok')}<span class="arr">${ICON.trash}</span></button><button class="pill ghosty" data-close>${t('set.cancel')}</button></div>`);
      // с аккаунтом: выходим (дневник остаётся на сервере), без аккаунта — просто стираем локальные данные
      $('#wok', sh).onclick = async () => { if (Cloud.user) await Cloud.logout(); else await Store.wipe(); resetOnb(); UI.closeModal(); Router.go('#/welcome'); };
    };
  },
};

/* ---------- preloader & boot ---------- */
function preloader() {
  const pre = $('#preloader');
  let seen = false;
  try { seen = sessionStorage.getItem('nl.pre') === '1'; sessionStorage.setItem('nl.pre', '1'); } catch (e) {}
  if (seen || reduced()) { pre.remove(); return Promise.resolve(); }
  return new Promise(res => {
    const bar = $('.bar', pre), nums = $$('.cnt', pre);
    const t0 = performance.now(), dur = 1700;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const v = Math.round(e * 100);
      nums.forEach(n => n.textContent = v);
      bar.style.width = (e * 100) + '%';
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(() => { pre.classList.add('done'); res(); setTimeout(() => pre.remove(), 1000); }, 180);
    };
    requestAnimationFrame(step);
  });
}

async function boot() {
  Store.load();
  document.documentElement.lang = Store.state.settings.lang;
  applyTheme();
  darkMQ.addEventListener && darkMQ.addEventListener('change', () => { if ((Store.state.settings.theme || 'auto') === 'auto') applyTheme(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-theme-toggle]'); if (!b) return;
    const r = b.getBoundingClientRect();
    switchTheme(effTheme() === 'dark' ? 'light' : 'dark', r.left + r.width / 2, r.top + r.height / 2);
  });
  PhotoDB.cleanup(Store.state.settings.photoPolicy);
  window.addEventListener('hashchange', () => Router.render());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') UI.closeModal(); });
  const p = preloader();
  let cloudReady = false;
  const ready = Promise.all([Cloud.init(), AIServer.init()]).then(() => { cloudReady = true; });
  window.nlReady = ready; // migrate.js ждёт загрузки облака, чтобы перенос не затёрла синхронизация
  await Promise.race([ready, new Promise(r => setTimeout(r, 3000))]);
  Router.render();
  if (!cloudReady) ready.then(() => { Router.silent = true; Router.render(); });
  await p;
}
boot();
