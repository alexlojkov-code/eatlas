/* Eatlas — каталог блюд и напитков (data/food_catalog, 2244 позиции).
   Состав позиции берётся так:
   1) собственный состав по типовому рецепту из CATALOG.nut (scripts/enrich_catalog.mjs, оценка ИИ) —
      вместе с порцией, английским названием, аллергенами и пометками;
   2) если его нет — самое похожее блюдо из базы (foods.js, dishes.js, profiles.js) по ключевым словам;
   3) если похожего нет — типовой состав категории («Супы», «Десерты», «Коктейли»…).
   Оценки честно помечаются в интерфейсе, с ИИ их можно уточнить. */

const CAT_SCRIPT = 'js/catalog-data.js?v=4';
const CAT_ALC = 1;
// флаги CATALOG.nut[i][10]
const NUT_ML = 1, NUT_VEG = 2, NUT_VEGAN = 4, NUT_PORK = 8, NUT_ALC = 16;

// Типовой состав категории, если похожего блюда не нашлось: [регулярка, подпись, значения на 100 г/мл, порция, опции]
const CAT_DEFAULTS = [
  [/безалкогольн.*коктейл|моктейл/, 'Безалкогольный коктейль', [45,0.1,0,11,0.2,10,0,5,0], 300, { liquid: 1 }],
  [/кофе/, 'Кофе с молоком', [45,2,2,4.5,0,4.5,1.3,35,6], 250, { liquid: 1 }],
  [/^чай/, 'Чай', [2,0,0,0.4,0,0,0,3,0], 250, { liquid: 1 }],
  [/сок|смузи|шейк/, 'Сок / смузи', [55,0.8,0.6,12,0.8,10,0.2,15,0], 300, { liquid: 1 }],
  [/безалкогольн/, 'Безалкогольный напиток', [40,0,0,10,0,10,0,10,0], 330, { liquid: 1 }],
  [/пиво/, 'Пиво', [43,0.5,0,3.6,0,0,0,4,0], 500, { liquid: 1, alc: 1 }],
  [/игрист/, 'Игристое вино', [80,0.2,0,2.5,0,1.5,0,5,0], 150, { liquid: 1, alc: 1 }],
  [/вино/, 'Вино', [85,0.1,0,2.6,0,0.6,0,4,0], 150, { liquid: 1, alc: 1 }],
  [/крепк/, 'Крепкий алкоголь', [231,0,0,0.1,0,0,0,1,0], 50, { liquid: 1, alc: 1 }],
  [/ликер|аперитив/, 'Ликёр', [300,0,0,32,0,32,0,5,0], 50, { liquid: 1, alc: 1 }],
  [/коктейл/, 'Коктейль', [180,0.2,1,16,0.1,15,0.5,5,0], 200, { liquid: 1, alc: 1 }],
  [/соус/, 'Соус', [200,2,15,14,1,8,2,800,10], 30, {}],
  [/суп/, 'Суп', [55,3,2.5,5,0.8,1,0.9,320,10], 350, {}],
  [/салат/, 'Салат', [150,4,11,7,1.5,3,2,350,20], 200, {}],
  [/мороженое|холодн.*десерт/, 'Мороженое', [210,4,11,24,0.3,21,7,60,35], 80, {}],
  [/десерт|сладост|сладк/, 'Десерт', [350,5,16,46,1,30,8,150,50], 120, {}],
  [/пицц/, 'Пицца', [260,11,10,32,2,3.5,4.5,580,18], 110, {}],
  [/паст/, 'Паста', [170,6.5,6,23,1.5,2,2.5,300,20], 300, {}],
  [/бургер/, 'Бургер', [255,13,12,24,1.5,5,4.6,500,35], 220, {}],
  [/суши|ролл/, 'Суши и роллы', [170,7,5,24,0.6,4,1.5,420,15], 200, {}],
  [/шаурм|кебаб|лаваш/, 'Шаурма / ролл', [215,10,10.5,20,1.6,2,3,520,30], 300, {}],
  [/хот дог|сосиск/, 'Хот-дог', [260,9,14,25,1.2,4,4.8,700,30], 150, {}],
  [/сэндвич|бутерброд/, 'Сэндвич', [250,11,11,27,2,3.5,3.5,550,25], 180, {}],
  [/выпечк|хлеб|хачапури|пирож/, 'Выпечка', [300,8,11,42,2,6,4,400,30], 100, {}],
  [/чипс|упакованн/, 'Снеки', [500,7,28,55,4,3,5,600,0], 50, {}],
  [/к пиву/, 'Закуска к пиву', [400,20,25,22,2,2,6,1200,40], 80, {}],
  [/молочн/, 'Молочный перекус', [90,5,3,10,0.5,8,2,50,10], 150, {}],
  [/курица и картофель/, 'Курица и картофель', [250,13,13,20,1.5,1,3,550,40], 200, {}],
  [/комбо|детск/, 'Комплексный обед', [150,7,6,17,1.5,3,2,350,25], 500, {}],
  [/закуск|мезе|панчхан/, 'Закуска', [190,7,13,11,2,3,3,500,25], 100, {}],
  [/гарнир/, 'Гарнир', [130,3,4,20,2,1,1,250,5], 180, {}],
  [/завтрак/, 'Завтрак', [190,9,10,16,1.5,5,4,350,120], 250, {}],
  [/гриль|шашлык/, 'Мясо на гриле', [230,22,15,1.5,0.2,0.5,5.5,450,80], 200, {}],
  [/карри/, 'Карри', [140,9,8,8,1.5,3,3,400,35], 300, {}],
  [/./, 'Основное блюдо', [170,9,8,15,1.5,2,2.5,400,30], 300, {}],
];

// Однофамильцы, которые по словам не различить: название из каталога → профиль
const CAT_OVERRIDES = {
  'Макарон': 'p_macaron',
  'Наполеон': 'p_medovik',
  'Прага': 'p_medovik',
  'Птичье молоко': 'p_medovik',
};

const Catalog = {
  loaded: false, list: [], byId: new Map(), _promise: null, _est: new Map(),

  load() {
    if (this.loaded) return Promise.resolve(this);
    if (this._promise) return this._promise;
    this._promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CAT_SCRIPT;
      s.onload = () => { this.prepare(); resolve(this); };
      s.onerror = () => { this._promise = null; reject(new Error('catalog')); };
      document.head.appendChild(s);
    });
    return this._promise;
  },

  prepare() {
    const C = window.CATALOG || (typeof CATALOG !== 'undefined' ? CATALOG : null);
    if (!C) return;
    this.data = C;
    this.list = C.items.map(([g, c, name, flags, mask, sid], i) => {
      const grp = C.groups[g];
      const e = {
        i, id: `cat:${grp[0]}__${sid}`, name, g, c, group: grp, type: grp[3], cat: C.cats[c],
        alc: !!(flags & CAT_ALC), tags: C.tags.filter((_, k) => mask & (1 << k)), norm: normalize(name),
        n: (C.nut && C.nut[i]) || null,
      };
      e.en = e.n ? e.n[13] : '';
      e.normEn = normalize(e.en);
      e.uz = (C.uz && C.uz[i]) || '';
      e.normUz = normalize(e.uz);
      this.byId.set(e.id, e);
      return e;
    });
    this.loaded = true;
  },

  // алкоголь не показываем, если в профиле возраст меньше 18
  allowAlcohol() { const p = Store.state.profile; return !(p && p.age && p.age < 18); },
  visible(e) { return !e.alc || this.allowAlcohol(); },

  groupItems(gi) { return this.list.filter(e => e.g === gi && this.visible(e)); },

  /* ---------- подбор состава ---------- */
  match(e) {
    const forced = CAT_OVERRIDES[e.name];
    if (forced) { const f = FOOD_DB.find(x => x.id === forced); if (f) return { food: f, score: 99, first: true, coverage: 1 }; }
    const q = e.norm.split(' ').filter(Boolean);
    const content = q.filter(w => !STOP.has(w) && !/^\d+([.,]\d+)?$/.test(w) && !SOFT.test(w));
    const head = content[0];
    const drink = e.type === 'drinks' || /напит/.test(e.cat.toLowerCase());
    const pass = (f, alcOnly) => {
      const liquid = !!f.opts.liquid, alc = !!f.opts.alc;
      if (e.type === 'drinks' && !liquid) return false;           // напиток — только напитки
      if (!e.alc && alc) return false;                            // безалкогольное не сопоставляем с алкоголем
      if (alcOnly && !alc) return false;
      return true;
    };
    const run = alcOnly => {
      let best = null; // лучший из подходящих: покрывает половину слов или главное (первое) слово
      for (const { f, al } of DB_INDEX) {
        if (!pass(f, alcOnly)) continue;
        for (const toks of al) {
          const used = new Set();
          let ok = true, len = 0;
          for (const at of toks) {
            const hit = q.findIndex((w, i) => !used.has(i) && (at.endsWith('%') ? w === at : w.startsWith(at)));
            if (hit < 0) { ok = false; break; }
            used.add(hit); len += at.length;
          }
          if (!ok) continue;
          const first = head ? [...used].some(i => q[i] === head) : false;
          const covered = [...used].filter(i => content.includes(q[i])).length;
          const coverage = content.length ? covered / content.length : 0;
          if (!(coverage >= 0.5 || first)) continue;
          // блюдо сопоставляем с напитком только при полном совпадении названия (компот, узвар, кисель)
          if (e.type === 'cuisine' && f.opts.liquid && !drink && coverage < 0.99) continue;
          const score = len + toks.length * 3 + (first ? 8 : 0);
          if (!best || score > best.score) best = { food: f, score, first, coverage };
        }
      }
      return best;
    };
    return (e.alc && run(true)) || run(false);
  },

  // название на языке интерфейса
  name(e) { return catEn() && e.en ? e.en : catUz() && e.uz ? e.uz : e.name; },
  // для превью в плитках — без пояснения в скобках
  shortName(e) { return this.name(e).split(' (')[0]; },
  // названия для превью плитки: короткие, а при совпадении — полные (Khorovats (pork) · Khorovats (lamb))
  previews(items, n) {
    const list = items.slice(0, n), short = list.map(e => this.shortName(e));
    return list.map((e, i) => short.indexOf(short[i]) !== short.lastIndexOf(short[i]) ? this.name(e) : short[i]);
  },
  catName(c) { return catUz() ? UZ_CATALOG.cats[c] || this.data.cats[c] : (catEn() && this.data.cats_en ? this.data.cats_en : this.data.cats)[c]; },
  tagsOf(e) {
    const alt = catUz() ? UZ_CATALOG.tags : catEn() ? this.data.tags_en : null;
    return alt ? e.tags.map(x => alt[this.data.tags.indexOf(x)] || x) : e.tags;
  },

  // аллергены и пометки; халяль не утверждаем — только «без свинины и алкоголя»
  diet(e) {
    if (!e.n) return null;
    const fl = e.n[10], am = e.n[11];
    return {
      allergens: this.data.allergens.filter((_, k) => am & (1 << k)),
      vegetarian: !!(fl & NUT_VEG), vegan: !!(fl & NUT_VEGAN), pork: !!(fl & NUT_PORK), alcohol: !!(fl & NUT_ALC),
    };
  },

  estimate(e) {
    if (this._est.has(e.id)) return this._est.get(e.id);
    let r;
    if (e.n) {
      const per100 = {}, liquid = !!(e.n[10] & NUT_ML), portion = e.n[9];
      NUTRIENT_KEYS.forEach((k, i) => per100[k] = e.n[i]);
      const opts = liquid ? { liquid: 1, cup: portion } : { portion };
      if (e.alc) opts.alc = 1;
      r = { per100, basis: null, foodId: null, opts, source: 'catalog_ai', confidence: e.n[12] / 100, grams: portion };
      this._est.set(e.id, r);
      return r;
    }
    const m = this.match(e);
    if (m) {
      const f = m.food, o = f.opts || {};
      const exact = m.coverage >= 0.99 && m.first;
      r = {
        per100: f.per100, basis: exact ? null : foodName(f), foodId: f.id, opts: o,
        source: exact ? f.src : 'estimate', confidence: exact ? 0.75 : 0.5,
        grams: o.liquid ? (o.cup || o.piece || 250) : this.portionFor(e, o),
      };
    } else {
      const d = this.defaultFor(e);
      const per100 = {};
      NUTRIENT_KEYS.forEach((k, i) => per100[k] = d[2][i]);
      r = { per100, basis: d[1], foodId: null, opts: Object.assign({}, d[4], d[4].liquid ? { cup: d[3] } : { portion: d[3] }), source: 'estimate', confidence: 0.3, grams: d[3] };
    }
    this._est.set(e.id, r);
    return r;
  },
  // порция по умолчанию: обычная порция блюда; для нарезок и мелких штучных — две штуки
  portionFor(e, o) {
    if (o.portion) return o.portion;
    const unit = o.piece || o.slice;
    if (unit >= 100) return unit;
    const c = e.cat.toLowerCase();
    if (/соус/.test(c)) return 30;
    if (unit && !/основн|блюд|суп|горяч|гриль|паст|пицц|карри|ризотто|завтрак|гарнир|суши|ролл|бургер|шаурм|кебаб/.test(c)) return Math.round(unit * 2);
    return this.defaultFor(e)[3];
  },
  defaultFor(e) { const c = e.cat.toLowerCase(); return CAT_DEFAULTS.find(d => d[0].test(c)); },

  // шаблон позиции для окна добавления
  toItem(e) {
    const est = this.estimate(e);
    return {
      name: this.name(e), grams: est.grams, diet: this.diet(e) || undefined, per100: Object.assign({}, est.per100), source: est.source, basis: est.basis,
      confidence: est.confidence, grams_source: 'standard', origin: 'catalog', foodId: est.foodId, catalogId: e.id, opts: est.opts,
    };
  },

  /* ---------- поиск ---------- */
  search(query, limit = 40) {
    const nq = normalize(query);
    if (!nq || !this.loaded) return [];
    const words = nq.split(' ').filter(Boolean);
    const out = [];
    for (const e of this.list) {
      if (!this.visible(e)) continue;
      // ищем по русскому, английскому и узбекскому названию
      let best = null;
      for (const norm of [e.norm, e.normEn, e.normUz].filter(Boolean)) {
        const ew = norm.split(' ');
        if (!words.every(w => ew.some(x => x.startsWith(w)))) continue;
        let s = 0;
        if (norm === nq) s += 30;
        if (norm.startsWith(nq)) s += 12;
        if (ew[0].startsWith(words[0])) s += 6;
        s -= ew.length * 0.3;
        if (best === null || s > best) best = s;
      }
      if (best !== null) out.push({ e, s: best });
    }
    out.sort((a, b) => b.s - a.s);
    // одинаковые названия из разных групп — оставляем одно
    const seen = new Set(), res = [];
    for (const { e } of out) {
      const k = e.norm;
      if (seen.has(k)) continue;
      seen.add(k); res.push(e);
      if (res.length >= limit) break;
    }
    return res;
  },
};

const catEn = () => Store.state.settings.lang === 'en';
const catUz = () => Store.state.settings.lang === 'uz';
// группа: [id, название, регион, тип, название en, регион en]; узбекские — в js/catalog-uz.js
const groupFullName = g => (catEn() && g[4]) || (catUz() && UZ_CATALOG.groups[g[0]] && UZ_CATALOG.groups[g[0]][0]) || g[1];
const groupShortName = g => String(groupFullName(g)).split(' (')[0];
const groupSubName = g => { const m = String(groupFullName(g)).match(/\((.+)\)/); return m ? m[1] : ''; };
const groupRegion = g => (catEn() && g[5]) || (catUz() && UZ_CATALOG.groups[g[0]] && UZ_CATALOG.groups[g[0]][1]) || g[2];
