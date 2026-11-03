/* Eatlas — перенос дневника со старых адресов (GitHub Pages, прежний адрес на Vercel) на основной.
   Данные идут напрямую между вкладками через postMessage: без сервера и без ссылок с данными.
   Старая вкладка открывает новую, новая сообщает, что готова, получает дневник и фото,
   спрашивает подтверждение и объединяет их с тем, что уже есть у неё. */

const MIG = {
  OLD: ['https://alexlojkov-code.github.io', 'https://nutrilens-orcin-seven.vercel.app'],
  NEW: NL_MAIN, // из js/boot.js
  MOVED_KEY: 'nutrilens.moved',
};
// на GitHub Pages сайт лежит в папке репозитория — её в новом адресе нет
const migPath = () => (/\.github\.io$/.test(location.hostname) ? location.pathname.replace(/^\/[^/]+/, '') : location.pathname);

const migHasDiary = s => !!s && (!!s.settings.onboarded || Object.keys(s.days).length > 0);
const migDayCount = s => Object.values(s.days).filter(d => MEALS.some(m => d.meals[m].length)).length;
const migReady = () => Promise.race([window.nlReady || Promise.resolve(), new Promise(r => setTimeout(r, 8000))]).catch(() => {});

/* ---------- старый адрес: предложить перенос ---------- */
async function migOfferOld() {
  let moved = false;
  try { moved = localStorage.getItem(MIG.MOVED_KEY) === '1'; } catch (e) {}
  if (moved || !migHasDiary(Store.state)) return;
  await migReady();
  await new Promise(r => setTimeout(r, 600));
  const target = MIG.NEW + migPath() + location.search + location.hash;
  const sh = UI.modal(`<div class="kicker">${t('mig.k')}</div><h2 class="h2" style="margin:10px 0 14px">${t('mig.title')}</h2>
    <p class="lead">${t('mig.lead')}</p>
    <p class="lead" id="migmsg" role="status" style="margin-top:12px"></p>
    <div class="row" style="margin-top:18px;flex-wrap:wrap;gap:10px">
      <button class="btn lime" id="miggo">${t('mig.go')}<span class="arr">${ICON.arrow}</span></button>
      <button class="pill ghosty" id="migbk">${t('mig.backup')}</button>
      <a class="pill ghosty" id="migskip" href="${esc(target)}" style="text-decoration:none">${t('mig.skip')}</a>
    </div>
    <p class="muted" style="margin-top:14px;font-size:14px">${t('mig.hint')}</p>`);
  const msg = $('#migmsg', sh);
  $('#migbk', sh).onclick = () => exportJSON();
  $('#miggo', sh).onclick = () => {
    const w = window.open(MIG.NEW + '/', '_blank');
    if (!w) { msg.textContent = t('mig.blocked'); return; }
    msg.textContent = t('mig.wait');
    let sent = false;
    const timer = setTimeout(() => { if (!sent) msg.textContent = t('mig.timeout'); }, 25000);
    const onMsg = async e => {
      if (e.origin !== MIG.NEW || e.source !== w || !e.data) return;
      if (e.data.type === 'nl-migrate-ready' && !sent) {
        sent = true; clearTimeout(timer);
        const state = JSON.parse(JSON.stringify(Store.state));
        state.settings.apiKey = '';
        let photos = [];
        try { photos = (await PhotoDB.tx('readonly', st => st.getAll())) || []; } catch (err) {}
        w.postMessage({ type: 'nl-migrate-data', state, photos }, MIG.NEW);
      }
      if (e.data.type === 'nl-migrate-done') {
        window.removeEventListener('message', onMsg);
        try { localStorage.setItem(MIG.MOVED_KEY, '1'); } catch (err) {}
        msg.textContent = t('mig.done');
        $('#miggo', sh).disabled = true;
      }
    };
    window.addEventListener('message', onMsg);
  };
}

/* ---------- новый адрес: принять дневник ---------- */
// Объединение: ничего из уже имеющегося не удаляется, повторный перенос не дублирует записи.
function migMerge(cur, inc) {
  if (!migHasDiary(cur)) {
    const keep = { apiKey: cur.settings.apiKey, theme: cur.settings.theme };
    return sanitizeState(Object.assign(defaultState(), inc, { settings: Object.assign({}, inc.settings, keep) }));
  }
  const out = cur;
  for (const [k, d] of Object.entries(inc.days)) {
    if (!out.days[k]) { out.days[k] = d; continue; }
    const day = out.days[k];
    for (const m of MEALS) {
      const ids = new Set(day.meals[m].map(x => x.id));
      d.meals[m].forEach(it => { if (!it.id || !ids.has(it.id)) day.meals[m].push(it); });
    }
    if (!day.note && d.note) day.note = d.note;
  }
  const names = new Set(out.myFoods.map(f => String(f.name).toLowerCase()));
  inc.myFoods.forEach(f => { if (!names.has(String(f.name).toLowerCase())) out.myFoods.push(f); });
  const dates = new Set(out.weights.map(w => w.date));
  inc.weights.forEach(w => { if (!dates.has(w.date)) out.weights.push(w); });
  out.weights.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const rn = new Set(out.recent.map(x => x.name.toLowerCase()));
  out.recent = out.recent.concat(inc.recent.filter(x => !rn.has(x.name.toLowerCase()))).slice(0, 40);
  if (!out.profile && inc.profile) out.profile = inc.profile;
  if (!out.targets && inc.targets) out.targets = inc.targets;
  if (!out.chat.length && inc.chat.length) out.chat = inc.chat;
  return sanitizeState(out);
}

function migAcceptNew() {
  const opener = window.opener;
  if (!opener) return;
  let got = false;
  const onMsg = async e => {
    if (got || !MIG.OLD.includes(e.origin) || e.source !== opener || !e.data || e.data.type !== 'nl-migrate-data') return;
    got = true;
    window.removeEventListener('message', onMsg);
    let inc;
    try {
      inc = sanitizeState(Object.assign(defaultState(), e.data.state));
      if (!inc || typeof inc.days !== 'object') throw new Error('bad');
    } catch (err) { UI.toast(t('err.range'), { err: true }); return; }
    const photos = (Array.isArray(e.data.photos) ? e.data.photos : [])
      .filter(p => p && typeof p.id === 'string' && typeof p.dataUrl === 'string' && p.dataUrl.startsWith('data:image/'));
    await migReady();
    const sh = UI.modal(`<div class="kicker">${t('mig.k')}</div><h2 class="h2" style="margin:10px 0 14px">${t('mig.q.title')}</h2>
      <p class="lead">${t('mig.q.lead', { d: migDayCount(inc), p: photos.length })}</p>
      <p class="lead" style="margin-top:10px">${t(migHasDiary(Store.state) ? 'mig.q.merge' : 'mig.q.replace')}</p>
      <div class="row" style="margin-top:18px"><button class="btn lime" id="migok">${t('mig.q.ok')}<span class="arr">${ICON.arrow}</span></button><button class="pill ghosty" data-close>${t('set.cancel')}</button></div>`);
    $('#migok', sh).onclick = async () => {
      $('#migok', sh).disabled = true;
      Store.state = migMerge(Store.state, inc);
      for (const p of photos) await PhotoDB.tx('readwrite', st => st.put({ id: p.id, dataUrl: p.dataUrl, created: Number(p.created) || Date.now() })).catch(() => null);
      Store.save();
      document.documentElement.lang = Store.state.settings.lang;
      try { opener.postMessage({ type: 'nl-migrate-done' }, e.origin); } catch (err) {}
      UI.closeModal(); UI.toast(t('mig.ok'));
      Router.go(Store.state.settings.onboarded ? '#/' : '#/welcome');
      Router.silent = true; Router.render();
    };
  };
  window.addEventListener('message', onMsg);
  // старая вкладка может ещё не слушать — повторяем «готов» несколько секунд
  let n = 0;
  const ping = setInterval(() => {
    if (got || ++n > 40) return clearInterval(ping);
    try { MIG.OLD.forEach(o => opener.postMessage({ type: 'nl-migrate-ready' }, o)); } catch (err) { clearInterval(ping); }
  }, 500);
}

if (MIG.OLD.includes(location.origin)) migOfferOld();
else if (location.origin === MIG.NEW) migAcceptNew();
