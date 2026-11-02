/* Eatlas — аккаунт и синхронизация дневника с сервером (Vercel + Neon).
   Дневник по-прежнему живёт в браузере; если пользователь вошёл, копия хранится на сервере
   и подтягивается на других устройствах. Ключ ИИ и фото на сервер не отправляются.
   Если сервера нет (GitHub Pages, локальный python-сервер) — работает только режим без аккаунта. */

const CLOUD_META = 'nutrilens.cloud';

const Cloud = {
  available: false,   // есть ли серверная часть
  user: null,         // { id, email, name }
  status: 'off',      // off | synced | saving | offline | error
  meta: { version: 0, dirty: false, syncedAt: null },
  _timer: null, _pushing: false, _quiet: false, _rev: 0, _again: false,

  /* ---------- запросы ---------- */
  async api(path, { method = 'GET', body } = {}) {
    let res;
    try {
      res = await fetch('/api/' + path, {
        method, credentials: 'same-origin',
        headers: { 'content-type': 'application/json', 'x-nl': '1' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) { throw Object.assign(new Error('OFFLINE'), { code: 'OFFLINE' }); }
    let data = null;
    if ((res.headers.get('content-type') || '').includes('json')) { try { data = await res.json(); } catch (e) {} }
    if (!res.ok) throw Object.assign(new Error((data && data.code) || 'HTTP_' + res.status), { code: (data && data.code) || 'HTTP_' + res.status, status: res.status, data });
    return data;
  },

  loadMeta() { try { Object.assign(this.meta, JSON.parse(localStorage.getItem(CLOUD_META) || '{}')); } catch (e) {} },
  saveMeta() { try { localStorage.setItem(CLOUD_META, JSON.stringify(this.meta)); } catch (e) {} },
  resetMeta() { this.meta = { version: 0, dirty: false, syncedAt: null }; try { localStorage.removeItem(CLOUD_META); } catch (e) {} },

  setStatus(s) {
    this.status = s;
    document.querySelectorAll('[data-sync]').forEach(el => { el.dataset.state = s; el.querySelector('span').textContent = t('sync.' + s); });
  },

  /* ---------- запуск ---------- */
  async init() {
    this.loadMeta();
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin', headers: { 'x-nl': '1' } });
      const json = (res.headers.get('content-type') || '').includes('json');
      this.available = json && (res.ok || res.status === 401);
      if (res.ok) { this.user = (await res.json()).user; await this.pull(); }
      else if (this.available && this.meta.email) this.resetMeta(); // сессия истекла
    } catch (e) {
      this.available = false;
      if (this.meta.email) { this.available = true; this.user = { email: this.meta.email, name: this.meta.name || '' }; this.setStatus('offline'); }
    }
    window.addEventListener('online', () => this.user && this.flush());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && this.user && !this.meta.dirty) this.pull(true); });
  },

  /* ---------- данные ---------- */
  snapshot() {
    const s = JSON.parse(JSON.stringify(Store.state));
    if (s.settings) delete s.settings.apiKey;
    return s;
  },
  apply(data) {
    const keep = { apiKey: Store.state.settings.apiKey, theme: Store.state.settings.theme };
    this._quiet = true;
    Store.state = sanitizeState(Object.assign(defaultState(), data));
    Store.state.settings = Object.assign(defaultState().settings, data.settings || {}, { apiKey: keep.apiKey });
    if (!data.settings || !data.settings.theme) Store.state.settings.theme = keep.theme;
    Store.save();
    this._quiet = false;
  },
  hasLocalDiary() {
    const s = Store.state;
    return !!(s.settings.onboarded && (Object.keys(s.days).some(k => MEALS.some(m => s.days[k].meals[m].length) || s.days[k].note) || s.myFoods.length));
  },

  // Объединение при одновременной правке на двух устройствах: записи складываются, ничего не теряется
  merge(server, local) {
    const out = JSON.parse(JSON.stringify(server || {}));
    out.profile = local.profile || out.profile;
    out.targets = local.targets || out.targets;
    out.settings = Object.assign({}, out.settings, local.settings);
    out.days = out.days || {};
    for (const [k, ld] of Object.entries(local.days || {})) {
      const sd = out.days[k];
      if (!sd) { out.days[k] = ld; continue; }
      for (const m of MEALS) {
        const ids = new Set((sd.meals[m] || []).map(x => x.id));
        sd.meals[m] = (sd.meals[m] || []).concat((ld.meals[m] || []).filter(x => !ids.has(x.id)));
      }
      if ((ld.note || '').length > (sd.note || '').length) sd.note = ld.note;
    }
    const byKey = (a, b, key) => { const seen = new Set((a || []).map(key)); return (a || []).concat((b || []).filter(x => !seen.has(key(x)))); };
    out.myFoods = byKey(local.myFoods, out.myFoods, x => x.id || x.name);
    out.recent = byKey(local.recent, out.recent, x => String(x.name).toLowerCase()).slice(0, 40);
    out.weights = byKey(local.weights, out.weights, x => x.date).sort((a, b) => a.date < b.date ? -1 : 1);
    out.chat = (local.chat && local.chat.length ? local.chat : out.chat) || [];
    return out;
  },

  async pull(silent) {
    if (!this.user) return;
    try {
      const r = await this.api('data');
      let changed = false;
      if (!r.data) {
        // на сервере пусто — отправляем то, что есть локально
        this.meta.version = 0; this.meta.dirty = true; this.saveMeta();
        if (Store.state.settings.onboarded) await this.push();
        return;
      }
      if (this.meta.dirty) {
        // есть неотправленные правки: при расхождении объединяем и отправляем
        if (r.version !== this.meta.version) { this.apply(this.merge(r.data, this.snapshot())); changed = true; }
        this.meta.version = r.version;
        await this.push();
      } else if (r.version !== this.meta.version) {
        this.apply(r.data); this.meta.version = r.version; changed = true;
      }
      this.meta.syncedAt = Date.now(); this.saveMeta();
      if (!this.meta.dirty) this.setStatus('synced');
      if (changed && silent && typeof Router !== 'undefined' && !document.querySelector('.modal.open')) { Router.silent = true; Router.render(); }
    } catch (e) { this.handleError(e); }
  },

  // вызывается из Store.save(): отложенная отправка на сервер
  schedule() {
    if (!this.user || this._quiet) return;
    this._rev++;
    this.meta.dirty = true; this.saveMeta();
    this.setStatus('saving');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.push(), 1200);
  },
  async flush() { clearTimeout(this._timer); if (this.meta.dirty) await this.push(); },

  async push(retry = true) {
    if (!this.user) return;
    // отправка уже идёт — повторим сразу после неё, чтобы не потерять свежие правки
    if (this._pushing) { this._again = true; return; }
    this._pushing = true;
    const rev = this._rev;
    let conflict = null;
    try {
      const r = await this.api('data', { method: 'PUT', body: { data: this.snapshot(), version: this.meta.version } });
      this.meta.version = r.version; this.meta.syncedAt = Date.now();
      this.meta.dirty = this._rev !== rev; // пока шла отправка, могли появиться новые правки
      this.saveMeta();
      if (!this.meta.dirty) this.setStatus('synced');
    } catch (e) {
      if (e.code === 'CONFLICT' && retry && e.data) conflict = e.data;
      else this.handleError(e);
    } finally { this._pushing = false; }
    if (conflict) {
      // на сервере правки с другого устройства: объединяем и отправляем ещё раз
      this.apply(this.merge(conflict.data, this.snapshot()));
      this.meta.version = conflict.version; this._rev++; this.meta.dirty = true;
      return this.push(false);
    }
    if (this._again || (this.meta.dirty && this.status !== 'offline' && this.status !== 'error')) { this._again = false; return this.push(); }
  },

  handleError(e) {
    if (e.code === 'UNAUTHORIZED') { this.user = null; this.resetMeta(); this.setStatus('off'); UI.toast(t('auth.expired'), { err: true }); return; }
    this.setStatus(e.code === 'OFFLINE' ? 'offline' : 'error');
    clearTimeout(this._retry);
    this._retry = setTimeout(() => this.user && this.meta.dirty && this.push(), 30000);
  },

  /* ---------- аккаунт ---------- */
  remember(user) {
    this.user = user;
    this.meta.email = user.email; this.meta.name = user.name || '';
    this.saveMeta();
  },
  async register(email, password, name) {
    const r = await this.api('auth/register', { method: 'POST', body: { email, password, name, lang: Store.state.settings.lang, consent: true, policy: POLICY_VERSION } });
    Store.state.settings.consent = { policy: POLICY_VERSION, at: Date.now() };
    this.verifySent = !!r.verify_sent;
    this.resetMeta(); this.remember(r.user);
    this.meta.dirty = true; this.saveMeta();
    if (Store.state.settings.onboarded) await this.push();
    else this.setStatus('saving');
    return r.user;
  },
  async login(email, password) {
    const r = await this.api('auth/login', { method: 'POST', body: { email, password } });
    return this.signedIn(r.user);
  },
  // общее для входа по паролю и по ссылке сброса: подтянуть дневник с сервера и объединить с локальным
  async signedIn(user) {
    const hadLocal = this.hasLocalDiary();
    this.resetMeta(); this.remember(user);
    const d = await this.api('data');
    if (d.data) {
      this.apply(hadLocal ? this.merge(d.data, this.snapshot()) : d.data);
      this.meta.version = d.version;
      if (hadLocal) { this.meta.dirty = true; await this.push(); }
    } else if (hadLocal) { this.meta.dirty = true; await this.push(); }
    this.meta.syncedAt = Date.now(); this.saveMeta();
    this.setStatus('synced');
    return user;
  },
  async logout() {
    try { await this.flush(); } catch (e) {}
    try { await this.api('auth/logout', { method: 'POST' }); } catch (e) {}
    this.user = null; this.resetMeta(); this.setStatus('off');
    await Store.wipe(); // на общем устройстве дневник не должен оставаться после выхода
  },
  /* ---------- письма: сброс пароля и подтверждение почты ---------- */
  email(action, extra = {}) { return this.api('auth/email', { method: 'POST', body: Object.assign({ action, lang: Store.state.settings.lang }, extra) }); },
  async forgot(email) { await this.email('forgot', { email }); },
  async resetPassword(token, password) { const r = await this.email('reset', { token, password }); return this.signedIn(r.user); },
  async verifyEmail(token) {
    const r = await this.email('verify', { token });
    if (this.user && this.user.email === r.email) this.user.email_verified = true;
    return r;
  },
  async sendVerify() { const r = await this.email('send'); if (r && r.verified && this.user) this.user.email_verified = true; return r; },
  async changePassword(current, next) { await this.api('auth/password', { method: 'POST', body: { current, next } }); },
  async deleteAccount(password) {
    await this.api('account', { method: 'DELETE', body: { password } });
    this.user = null; this.resetMeta(); this.setStatus('off');
    await Store.wipe();
  },
};
