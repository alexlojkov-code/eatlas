/* Eatlas — ядро: хранилище в браузере, расчёты, разбор текста, фото. */

const STORE_KEY = 'nutrilens.v1';
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
const POLICY_VERSION = '1.0'; // версия политики конфиденциальности (privacy.html)
const policyHref = () => 'privacy.html#' + ((typeof Store !== 'undefined' && Store.state && Store.state.settings.lang) || 'ru');

/* ---------- utils ---------- */
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const round1 = v => Math.round(v * 10) / 10;
const pad = n => String(n).padStart(2, '0');
const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => dateKey(new Date());
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dateKey(d); };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const normalize = s => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/(\d)\s*%/g, '$1%').replace(/[^a-zа-я0-9%.,\s]/g, ' ').replace(/\s+/g, ' ').trim();

/* ---------- store ---------- */
const defaultState = () => ({
  version: 1,
  profile: null,
  targets: null,
  settings: { lang: 'ru', mass: 'g', body: 'kg', apiKey: '', model: 'gemini-3.8-flash', photoPolicy: '30', theme: 'auto', onboarded: false, createdAt: Date.now() },
  days: {},
  myFoods: [],
  recent: [],
  weights: [],
  chat: [],
});

/* Приводит состояние (из localStorage, резервной копии или облака) к ожидаемой форме:
   испорченные дни, записи без массы, не-массивы и т. п. отбрасываются, а не ломают экраны. */
function sanitizeState(st) {
  const arr = v => (Array.isArray(v) ? v : []);
  const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const days = {};
  for (const [k, d] of Object.entries(obj(st.days))) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !d || typeof d !== 'object') continue;
    const meals = {};
    for (const m of MEALS) meals[m] = arr(d.meals && d.meals[m]).filter(it => it && typeof it === 'object' && Number(it.grams) > 0 && isFinite(Number(it.grams)))
      .map(it => Object.assign(it, { name: String(it.name ?? ''), grams: Number(it.grams), per100: obj(it.per100) }));
    days[k] = { meals, note: typeof d.note === 'string' ? d.note : '' };
  }
  st.days = days;
  st.myFoods = arr(st.myFoods).filter(f => f && f.name).map(f => Object.assign(f, { per100: obj(f.per100) }));
  st.recent = arr(st.recent).filter(x => x && x.name && Number(x.grams) > 0);
  st.weights = arr(st.weights).filter(w => w && Number(w.kg) > 0 && isFinite(Number(w.kg)));
  st.chat = arr(st.chat).filter(x => x && typeof x.text === 'string');
  st.settings = Object.assign(defaultState().settings, obj(st.settings));
  if (/^(claude|gpt)-/.test(st.settings.model)) st.settings.model = defaultState().settings.model; // переход на Gemini
  return st;
}

const Store = {
  state: null,
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      this.state = sanitizeState(raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState());
    } catch (e) {
      console.warn('storage unavailable', e);
      this.state = defaultState();
    }
    return this.state;
  },
  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); }
    catch (e) { console.warn('save failed', e); UI && UI.toast && UI.toast(t('err.storage')); }
    if (typeof Cloud !== 'undefined') Cloud.schedule();
  },
  day(key) {
    const s = this.state;
    if (!s.days[key]) s.days[key] = { meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, note: '' };
    return s.days[key];
  },
  peekDay(key) { return this.state.days[key] || null; },
  addItems(key, meal, items) {
    const day = this.day(key);
    items.forEach(it => {
      day.meals[meal].push(Object.assign({}, it, { id: uid(), addedAt: Date.now() }));
      this.pushRecent(it);
    });
    this.save();
  },
  pushRecent(it) {
    const r = this.state.recent.filter(x => x.name.toLowerCase() !== it.name.toLowerCase());
    r.unshift({ name: it.name, grams: it.grams, per100: it.per100, source: it.source, foodId: it.foodId || null, opts: it.opts || null });
    this.state.recent = r.slice(0, 40);
  },
  findItem(key, itemId) {
    const day = this.peekDay(key);
    if (!day) return null;
    for (const m of MEALS) {
      const idx = day.meals[m].findIndex(x => x.id === itemId);
      if (idx >= 0) return { day, meal: m, idx, item: day.meals[m][idx] };
    }
    return null;
  },
  wipe() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    this.state = defaultState();
    return PhotoDB.clear();
  },
};

/* ---------- nutrients ---------- */
const emptyN = () => Object.fromEntries(NUTRIENT_KEYS.map(k => [k, 0]));
// Расчёт кодом, не моделью: nutrient = per_100g × grams / 100
const itemNutrients = it => {
  const n = emptyN();
  const g = Number(it.grams) || 0;
  NUTRIENT_KEYS.forEach(k => n[k] = ((it.per100 && it.per100[k]) || 0) * g / 100);
  return n;
};
const sumN = items => items.reduce((acc, it) => {
  const n = itemNutrients(it);
  NUTRIENT_KEYS.forEach(k => acc[k] += n[k]);
  return acc;
}, emptyN());
const dayItems = day => day ? MEALS.flatMap(m => day.meals[m]) : [];
const dayTotals = key => sumN(dayItems(Store.peekDay(key)));

/* ---------- targets (Миффлин — Сан-Жеор) ---------- */
const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };
const GOAL_K = { lose: 0.85, maintain: 1, gain: 1.10 };
const PROTEIN_PER_KG = { lose: 1.8, maintain: 1.6, gain: 2.0 };
const minKcal = sex => sex === 'm' ? 1500 : 1200;

function calcTargets(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'm' ? 5 : -161);
  const tdee = bmr * (ACTIVITY[p.activity] || 1.2);
  let kcal = tdee * (GOAL_K[p.goal] || 1);
  const floor = minKcal(p.sex);
  const floored = kcal < floor;
  kcal = Math.round(Math.max(kcal, floor) / 10) * 10;
  const protein = Math.round(p.weight * (PROTEIN_PER_KG[p.goal] || 1.6));
  const fat = Math.round(kcal * 0.28 / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), floored,
    targets: {
      kcal, protein_g: protein, fat_g: fat, carbs_g: carbs,
      fiber_g: Math.round(kcal / 1000 * 14), sugar_g: Math.round(kcal * 0.10 / 4),
      sat_fat_g: Math.round(kcal * 0.10 / 9), sodium_mg: 2300, cholesterol_mg: 300,
      source: 'auto',
    },
  };
}
const autoTargetsAllowed = p => p && p.age >= 18 && !p.pregnant;

/* ---------- units ---------- */
const OZ = 28.3495, LB = 0.453592;
const massOut = g => Store.state.settings.mass === 'oz' ? round1(g / OZ) : Math.round(g);
const massIn = v => Store.state.settings.mass === 'oz' ? Number(v) * OZ : Number(v);
const massUnit = () => Store.state.settings.mass === 'oz' ? t('u.oz') : t('u.g');
const fmtMass = g => `${massOut(g)} ${massUnit()}`;
const bodyOut = kg => Store.state.settings.body === 'lb' ? round1(kg / LB) : round1(kg);
const bodyIn = v => Store.state.settings.body === 'lb' ? Number(v) * LB : Number(v);
const bodyUnit = () => Store.state.settings.body === 'lb' ? t('u.lb') : t('u.kg');

/* ---------- food matching ---------- */
const STOP = new Set(['с', 'и', 'на', 'в', 'из', 'без', 'под', 'по', 'со', 'для', 'with', 'and', 'of', 'in', 'on', 'the', 'a', 'без']);
const DB_INDEX = FOOD_DB.map(f => ({ f, al: f.aliases.map(a => normalize(a).split(' ')) }));

// Слова способа приготовления/состояния, которые не меняют выбор продукта в базе
const SOFT = /^(варен(ая|ый|ое|ые|ой|ую|ых|ого|ом)|отварн\S*|свеж\S*|натуральн\S*|домашн\S*|спел\S*|нарезан\S*|сыр(ой|ая|ое|ые|ого)|boiled|cooked|fresh|plain|steamed|whole|sliced|raw)$/;
function matchFood(query) {
  const q = normalize(query).split(' ').filter(Boolean);
  const content = q.filter(w => !STOP.has(w) && !/^\d+([.,]\d+)?$/.test(w) && !SOFT.test(w));
  let best = null;
  for (const { f, al } of DB_INDEX) {
    for (const toks of al) {
      const used = new Set();
      let ok = true, len = 0;
      for (const at of toks) {
        const hit = q.findIndex((w, i) => !used.has(i) && (at.endsWith('%') ? w === at : w.startsWith(at)));
        if (hit < 0) { ok = false; break; }
        used.add(hit); len += at.length;
      }
      if (!ok) continue;
      const score = len + toks.length * 3;
      if (!best || score > best.score) {
        const covered = [...used].filter(i => content.includes(q[i])).length;
        best = { food: f, score, coverage: content.length ? covered / content.length : 0 };
      }
    }
  }
  return best;
}
const foodName = f => (Store.state.settings.lang === 'en' ? f.en : f.ru);

function searchFoods(query, limit = 12) {
  const nq = normalize(query);
  if (!nq) return [];
  const res = [];
  const words = nq.split(' ');
  for (const { f, al } of DB_INDEX) {
    const names = [normalize(f.ru), normalize(f.en)];
    let s = 0;
    if (names.some(n => n.startsWith(nq))) s += 10;
    if (names.some(n => n.includes(nq))) s += 5;
    for (const toks of al) if (toks.every(at => words.some(w => w.startsWith(at) || at.startsWith(w)))) s += 4 + toks.join('').length / 10;
    if (s > 0) res.push({ kind: 'db', food: f, s });
  }
  Store.state.myFoods.forEach(mf => { if (normalize(mf.name).includes(nq)) res.push({ kind: 'my', my: mf, s: 20 }); });
  return res.sort((a, b) => b.s - a.s).slice(0, limit);
}

/* ---------- local text parser (без ИИ) ---------- */
const NUM_WORDS = { 'один': 1, 'одна': 1, 'одно': 1, 'одну': 1, 'два': 2, 'две': 2, 'три': 3, 'четыре': 4, 'пять': 5, 'шесть': 6, 'половина': 0.5, 'половинка': 0.5, 'пол': 0.5, 'полтора': 1.5, 'полторы': 1.5, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'half': 0.5, 'a': 1, 'an': 1 };
const UNITS = [
  { re: /^(кг|килограмм\S*|kg)$/, kind: 'mass', k: 1000 },
  { re: /^(г|гр|грамм\S*|g|gr|grams?)$/, kind: 'mass', k: 1 },
  { re: /^(л|литр\S*|l|liters?|litres?)$/, kind: 'vol', k: 1000 },
  { re: /^(мл|миллилитр\S*|ml)$/, kind: 'vol', k: 1 },
  { re: /^(oz|унц\S*)$/, kind: 'mass', k: OZ },
  { re: /^(шт|штук\S*|штуки|pcs?|pieces?|x)$/, kind: 'piece' },
  { re: /^(стакан\S*|кружк\S*|чашк\S*|cups?|glass\S*|mugs?)$/, kind: 'cup' },
  { re: /^(ст\.?л\.?|столов\S*|tbsp|tablespoons?)$/, kind: 'tbsp' },
  { re: /^(ч\.?л\.?|чайн\S*|tsp|teaspoons?)$/, kind: 'tsp' },
  { re: /^(ложк\S*|ложечк\S*|spoons?)$/, kind: 'spoon' },
  { re: /^(кус\S*|ломт\S*|долек|дольк\S*|slices?|pieces?)$/, kind: 'slice' },
  { re: /^(тарелк\S*|миск\S*|bowls?)$/, kind: 'bowl' },
  { re: /^(порци\S*|servings?|portions?)$/, kind: 'portion' },
  { re: /^(горст\S*|handfuls?)$/, kind: 'handful' },
  { re: /^(бутылк\S*|bottles?|банк\S*|cans?)$/, kind: 'bottle' },
];

function splitInput(text) {
  // запятая делит позиции, кроме десятичной «1,5»
  return String(text).split(/,(?!\d)|(?<!\d),|;|\n|\+|\s+и\s+|\s+and\s+|\s+плюс\s+/i).map(s => s.trim()).filter(Boolean);
}

function parseChunk(chunk) {
  let words = normalize(chunk).replace(/(\d)([a-zа-я])/g, '$1 $2').split(' ').filter(Boolean);
  let qty = null, unit = null;
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const num = /^\d+([.,]\d+)?$/.test(w) ? parseFloat(w.replace(',', '.')) : (NUM_WORDS[w] ?? null);
    if (num !== null && qty === null && !(w === 'a' || w === 'an') ) {
      // «творог 5%» — процент не количество
      if (words[i + 1] && words[i + 1].endsWith('%')) { out.push(w); continue; }
      qty = num; continue;
    }
    if (w.endsWith('%')) { out.push(w); continue; }
    const u = !unit && UNITS.find(u => u.re.test(w.replace(/\.$/, '')));
    if (u && (qty !== null || ['cup', 'tbsp', 'tsp', 'spoon', 'slice', 'bowl', 'portion', 'handful', 'bottle'].includes(u.kind))) {
      // «ст. ложка» / «ч. ложка»
      if (u.kind === 'spoon' && out.length && /^(ст|столов)/.test(out[out.length - 1])) { out.pop(); unit = UNITS.find(x => x.kind === 'tbsp'); continue; }
      if (u.kind === 'spoon' && out.length && /^(ч|чайн)/.test(out[out.length - 1])) { out.pop(); unit = UNITS.find(x => x.kind === 'tsp'); continue; }
      unit = u; continue;
    }
    if (w === 'ст' || w === 'ч') { out.push(w); continue; }
    out.push(w);
  }
  return { qty, unit, name: out.join(' ').trim() };
}

function gramsFor(food, qty, unit) {
  const o = food.opts || {};
  const n = qty ?? 1;
  if (!unit) {
    if (qty !== null && qty >= 10 && !o.piece) return { grams: qty, src: 'user', conf: 0.85 }; // «гречка 200»
    if (qty !== null && qty >= 20) return { grams: qty, src: 'user', conf: 0.8 };
    if (o.piece) return { grams: n * o.piece, src: 'standard', conf: 0.7 };
    return { grams: n * (o.portion || o.cup || 150), src: 'standard', conf: 0.55 };
  }
  switch (unit.kind) {
    case 'mass': return { grams: n * unit.k, src: 'user', conf: 0.95 };
    case 'vol': return { grams: n * unit.k, src: 'user', conf: o.liquid ? 0.95 : 0.75 };
    case 'piece': return { grams: n * (o.piece || o.portion || 100), src: 'standard', conf: o.piece ? 0.8 : 0.5 };
    case 'cup': return { grams: n * (o.cup || (o.liquid ? 250 : 200)), src: 'standard', conf: o.cup ? 0.8 : 0.55 };
    case 'tbsp': return { grams: n * (o.tbsp || 15), src: 'standard', conf: o.tbsp ? 0.8 : 0.6 };
    case 'tsp': return { grams: n * (o.tsp || 5), src: 'standard', conf: o.tsp ? 0.8 : 0.6 };
    case 'spoon': return { grams: n * (o.tbsp || 15), src: 'standard', conf: 0.5 };
    case 'slice': return { grams: n * (o.slice || o.piece || 30), src: 'standard', conf: o.slice ? 0.75 : 0.5 };
    case 'bowl': return { grams: n * 300, src: 'standard', conf: 0.5 };
    case 'portion': return { grams: n * (o.portion || o.piece || 250), src: 'standard', conf: o.portion ? 0.65 : 0.5 };
    case 'handful': return { grams: n * 30, src: 'standard', conf: 0.55 };
    case 'bottle': return { grams: n * (o.piece || 500), src: 'standard', conf: 0.55 };
  }
  return { grams: 100, src: 'standard', conf: 0.4 };
}

function localAnalyze(text) {
  const items = [], unknown = [];
  for (const chunk of splitInput(text)) {
    const { qty, unit, name } = parseChunk(chunk);
    if (!name) continue;
    const m = matchFood(name);
    if (!m) { unknown.push(chunk); continue; }
    const g = gramsFor(m.food, qty, unit);
    const conf = clamp(g.conf * (m.coverage >= 0.99 ? 1 : 0.85), 0.2, 0.98);
    items.push(makeItem({
      name: foodName(m.food), grams: g.grams, per100: m.food.per100, source: m.food.src,
      foodId: m.food.id, confidence: conf, grams_source: g.src, origin: 'text', input: chunk, opts: m.food.opts,
    }));
  }
  return { status: items.length ? 'ok' : 'no_food', items, unknown, questions: [] };
}

function makeItem(o) {
  return Object.assign({ id: uid(), name: '', grams: 100, per100: emptyN(), source: 'local', confidence: 0.7, grams_source: 'standard', origin: 'text', assumed: false, edited: false }, o);
}

function itemFromFood(food, grams, origin = 'manual') {
  return makeItem({ name: foodName(food), grams: grams || food.opts.piece || food.opts.portion || 100, per100: food.per100, source: food.src, foodId: food.id, confidence: 1, grams_source: 'user', origin, opts: food.opts });
}

/* ---------- photos: IndexedDB ---------- */
const PhotoDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      try {
        const r = indexedDB.open('nutrilens-photos', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' });
        r.onsuccess = () => { this.db = r.result; res(this.db); };
        r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction('photos', mode);
      const st = tx.objectStore('photos');
      const out = fn(st);
      tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      tx.onerror = () => rej(tx.error);
    });
  },
  put(id, dataUrl) { return this.tx('readwrite', st => st.put({ id, dataUrl, created: Date.now() })).catch(() => null); },
  async get(id) { try { const r = await this.tx('readonly', st => st.get(id)); return r ? r.dataUrl : null; } catch (e) { return null; } },
  del(id) { return this.tx('readwrite', st => st.delete(id)).catch(() => null); },
  clear() { return this.tx('readwrite', st => st.clear()).catch(() => null); },
  async cleanup(policy) {
    if (policy === 'forever') return;
    const maxAge = policy === 'none' ? 0 : 30 * 864e5;
    try {
      const all = await this.tx('readonly', st => st.getAll());
      const old = (all || []).filter(p => Date.now() - p.created > maxAge);
      for (const p of old) await this.del(p.id);
    } catch (e) {}
  },
};

/* ---------- images ---------- */
const MAX_FILE = 10 * 1024 * 1024;
async function sniffType(file) {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (b[0] === 0xFF && b[1] === 0xD8) return 'jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'png';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return 'webp';
  const ftyp = String.fromCharCode(...b.slice(4, 12));
  if (ftyp.startsWith('ftyp') && /hei|mif|hev/.test(ftyp)) return 'heic';
  return null;
}
function loadImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { res(img); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode')); };
    img.src = url;
  });
}
// Перекодирование через canvas: сжатие до 1568 px, JPEG, без EXIF/геоданных
function toJpeg(img, max, q) {
  const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}
async function prepareImage(file) {
  if (file.size > MAX_FILE) throw Object.assign(new Error('IMAGE_TOO_LARGE'), { code: 'IMAGE_TOO_LARGE' });
  const type = await sniffType(file);
  if (!type) throw Object.assign(new Error('UNSUPPORTED_FORMAT'), { code: 'UNSUPPORTED_FORMAT' });
  let img;
  try { img = await loadImage(file); }
  catch (e) { throw Object.assign(new Error('UNSUPPORTED_FORMAT'), { code: type === 'heic' ? 'HEIC_UNSUPPORTED' : 'UNSUPPORTED_FORMAT' }); }
  return { full: toJpeg(img, 1568, 0.85), thumb: toJpeg(img, 520, 0.72) };
}

/* ---------- CSV / backup ---------- */
function exportCSV() {
  const head = ['date', 'meal', 'name', 'grams', ...NUTRIENT_KEYS, 'source', 'confidence', 'origin'];
  const rows = [head.join(',')];
  Object.keys(Store.state.days).sort().forEach(k => {
    const d = Store.state.days[k];
    MEALS.forEach(m => d.meals[m].forEach(it => {
      const n = itemNutrients(it);
      rows.push([k, m, `"${String(it.name).replace(/"/g, '""')}"`, round1(it.grams), ...NUTRIENT_KEYS.map(x => round1(n[x])), it.source, round1(it.confidence || 0), it.origin].join(','));
    }));
  });
  download(`eatlas-${todayKey()}.csv`, '﻿' + rows.join('\n'), 'text/csv');
}
function exportJSON() {
  const s = Object.assign({}, Store.state, { settings: Object.assign({}, Store.state.settings, { apiKey: '' }) });
  download(`eatlas-backup-${todayKey()}.json`, JSON.stringify(s, null, 1), 'application/json');
}
function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
