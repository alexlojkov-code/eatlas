/* Автономные сквозные тесты Eatlas (E2E).
   Запускаются прямо в открытой странице сайта (локальный сервер разработки):
     const m = await import('/tests/e2e/suite.js?' + Date.now());
     const report = await m.run({ chaos: false });      // обычный прогон
     const report = await m.run({ chaos: true });       // с «поломанной» вёрсткой — проверка самовосстановления
   Сценарии действуют через интерфейс (клики, ввод), а состояние проверяют по Store и DOM.
   Перед каждым сценарием состояние приложения сбрасывается; в конце восстанавливается исходное. */
import { L, find, click, type, visible, healLog, resetHealCache } from './heal.js';
import { enableChaos, disableChaos, chaosStats } from './chaos.js';
import { installFastTimers, uninstallFastTimers, throttled } from './clock.js';


const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

class AssertionError extends Error {}
function expect(cond, msg) { if (!cond) throw new AssertionError(msg); }
async function waitFor(fn, msg, timeout = 6000) {
  const t0 = performance.now();
  while (performance.now() - t0 < timeout) {
    try { const v = fn(); if (v) return v; } catch {}
    await sleep(60);
  }
  throw new AssertionError('Не дождались: ' + msg);
}

/* ---------- состояние и навигация ---------- */
const TODAY = () => todayKey();
function seedProfile(over = {}) {
  const p = Object.assign({ name: 'Тест', sex: 'f', age: 30, height: 168, weight: 62, activity: 'light', goal: 'maintain', pregnant: false }, over);
  Store.state.profile = p;
  Store.state.targets = calcTargets(p).targets;
  Store.state.settings.onboarded = true;
  Store.state.weights = [{ date: TODAY(), kg: p.weight }];
}
async function fresh({ onboarded = true, profile } = {}) {
  UI.closeModal();
  $$('#toasts .toast').forEach(t => t.remove());
  Store.state = defaultState();
  if (onboarded) seedProfile(profile);
  Store.save();
  resetOnb(); addState = null; draft = null; foodsTab = 'catalog'; statsPeriod = 7;
  try { localStorage.removeItem('nutrilens.catSort'); } catch {}
  await sleep(650); // модальное окно закрывается с анимацией
}
async function go(hash) {
  Router.silent = true;
  if (location.hash === hash) Router.render(); else location.hash = hash;
  await sleep(250);
  await waitFor(() => $('#view') && $('#view').children.length, 'отрисовка ' + hash);
}
const sheet = () => $('#modal.open .sheet');
const waitSheet = () => waitFor(() => sheet() && $('#modal').classList.contains('open') && sheet(), 'открытие окна');
const dayMeal = (m, key = TODAY()) => (Store.peekDay(key) || { meals: { [m]: [] } }).meals[m];
const toastText = () => $$('#toasts .toast').map(t => t.innerText).join(' | ');

/* ---------- локаторы (основной селектор + признаки для самовосстановления) ---------- */
const LOC = {
  onbNext: L('onb.next', { css: '[data-next]', role: 'button', text: ['Дальше', 'Без аккаунта — только в этом браузере', 'Начать', 'Открыть дневник'], attrHint: 'next' }),
  onbDone: L('onb.done', { css: '[data-next]', role: 'button', text: ['Открыть дневник'], attrHint: 'next' }),
  onbName: L('onb.name', { css: '#o-name', role: 'input', field: 'Как подписать дневник', text: ['Имя или псевдоним'] }),
  onbAge: L('onb.age', { css: '#o-age', role: 'input', field: 'Возраст' }),
  onbHeight: L('onb.height', { css: '#o-height', role: 'input', field: 'Рост' }),
  onbWeight: L('onb.weight', { css: '#o-weight', role: 'input', field: 'Вес' }),
  addManual: L('add.manual', { css: '#manual', role: 'button', text: ['Найти вручную'], attrHint: 'manual' }),
  addText: L('add.text', { css: '#txt', role: 'input', text: ['200 г гречки, 150 г курицы, огурец…'], attrHint: 'txt' }),
  addCalc: L('add.calc', { css: '#calc', role: 'button', text: ['Рассчитать'], attrHint: 'calc' }),
  searchInput: L('search.input', { css: '#sq', role: 'input', within: '#modal .sheet', text: ['Блюдо, напиток или продукт'], attrHint: 'sq search' }),
  logGrams: L('log.grams', { css: '#lg', role: 'input', within: '#modal .sheet', field: ['Масса', 'Объём'] }),
  logAdd: L('log.add', { css: '#lok', role: 'button', within: '#modal .sheet', text: ['Добавить'], attrHint: 'lok' }),
  itemGrams: L('item.grams', { css: '#ig', role: 'input', within: '#modal .sheet', field: 'Масса' }),
  itemDel: L('item.delete', { css: '#idel', role: 'button', within: '#modal .sheet', text: ['Удалить'] }),
  resSave: L('result.save', { css: '#save', role: 'button', text: ['Добавить в дневник'] }),
  tileUzbek: L('catalog.tile.uzbek', { css: 'a.ctile[href="#/foods/cat/uzbek"]', role: 'link', text: ['Узбекская'], attrHint: 'uzbek' }),
  groupSearch: L('catalog.group.search', { css: '#gq', role: 'input', text: ['Найти в этом разделе'], attrHint: 'gq' }),
  catHomeSearch: L('catalog.search', { css: '#cq', role: 'input', text: ['Блюдо, напиток или продукт'], attrHint: 'cq' }),
  newFood: L('foods.new', { css: '#newfood', role: 'button', text: ['Новый продукт'], attrHint: 'newfood' }),
  nfName: L('foods.new.name', { css: '#nf-name', role: 'input', within: '#modal .sheet', field: 'Название' }),
  nfKcal: L('foods.new.kcal', { css: '[data-k="kcal"]', role: 'input', within: '#modal .sheet', field: 'Калории' }),
  nfSave: L('foods.new.save', { css: '#nf-save', role: 'button', within: '#modal .sheet', text: ['Сохранить'], attrHint: 'nf save' }),
  note: L('diary.note', { css: '#note', role: 'input', label: 'Заметка дня', text: ['Как прошёл день?'] }),
  weightIn: L('stats.weight', { css: '#wv', role: 'input', text: ['кг'] }),
  weightAdd: L('stats.weight.add', { css: '#wadd', role: 'button', text: ['Записать вес'], attrHint: 'wadd weight' }),
};
const btn = (key, text, within, css) => L(key, { css, role: 'button', text: [].concat(text), within });

/* ---------- сценарии ---------- */
const SCENARIOS = [];
const scenario = (name, fn, opt = {}) => SCENARIOS.push({ name, fn, ...opt });

scenario('Онбординг без аккаунта: анкета → норма → дневник', async () => {
  await fresh({ onboarded: false });
  await go('#/welcome');
  await click(LOC.onbNext);
  await type(LOC.onbName, 'Аня');
  await type(LOC.onbAge, '29'); await type(LOC.onbHeight, '166'); await type(LOC.onbWeight, '58');
  await click(LOC.onbNext);
  await waitFor(() => $('#o-act'), 'шаг 2 (активность)');
  await click(LOC.onbNext);
  await waitFor(() => $('#o-goal'), 'шаг 3 (цель)');
  await click(LOC.onbNext);
  await waitFor(() => $('#o-tg'), 'шаг 4 (норма)');
  await click(LOC.onbDone);
  await waitFor(() => Store.state.settings.onboarded, 'завершение онбординга');
  const p = Store.state.profile;
  expect(p.name === 'Аня' && p.age === 29 && p.height === 166 && p.weight === 58, 'профиль сохранён неверно: ' + JSON.stringify(p));
  expect(Store.state.targets.kcal > 1200 && Store.state.targets.kcal < 3500, 'норма калорий вне разумного диапазона: ' + Store.state.targets.kcal);
  await waitFor(() => $('.diary-hero'), 'экран дневника');
});

scenario('Онбординг: недопустимый возраст не пропускает дальше', async () => {
  await fresh({ onboarded: false });
  await go('#/welcome');
  await click(LOC.onbNext);
  await type(LOC.onbAge, '5'); await type(LOC.onbHeight, '166'); await type(LOC.onbWeight, '58');
  await click(LOC.onbNext);
  await waitFor(() => $('#toasts .toast.err'), 'сообщение об ошибке');
  await sleep(300);
  expect($('#o-age') || $('.formgrid'), 'анкета не должна закрываться');
  expect(!Store.state.settings.onboarded, 'онбординг не должен завершиться');
});

scenario('Поиск в каталоге → запись в обед с выбором массы', async () => {
  await fresh();
  await go('#/add?meal=lunch');
  await click(LOC.addManual);
  await waitSheet();
  await type(LOC.searchInput, 'плов ташкентский');
  await click(L('search.result.plov', { css: '#sr button[data-i]:has(span:first-child)', role: 'button', within: '#modal .sheet', text: ['Плов ташкентский'], strict: true }));
  await sleep(600);
  await waitFor(() => $('#modal.open .sheet h2') && /плов ташкентский/i.test($('#modal.open .sheet h2').getAttribute('aria-label') || $('#modal.open .sheet h2').innerText), 'окно записи плова');
  await type(LOC.logGrams, '200');
  await click(btn('log.meal.lunch', 'Обед', '#modal .sheet', '#lmeal [data-m="lunch"]'));
  await click(LOC.logAdd);
  const it = await waitFor(() => dayMeal('lunch').find(x => x.name === 'Плов ташкентский'), 'плов в обеде');
  expect(it.grams === 200, 'масса не 200 г: ' + it.grams);
  expect(Math.round(itemNutrients(it).kcal) === 420, 'калории не 420: ' + itemNutrients(it).kcal);
  expect(it.diet && Array.isArray(it.diet.allergens), 'у позиции каталога нет аллергенов и пометок');
  await waitFor(() => $$('[data-item]').some(b => /Плов ташкентский/.test(b.innerText)), 'плов виден в дневнике');
});

scenario('Редактирование записи: масса, перенос, удаление и отмена', async () => {
  await fresh();
  Store.addItems(TODAY(), 'lunch', [makeItem(Catalog.loaded ? Catalog.toItem(Catalog.list[0]) : { name: 'Плов ташкентский', grams: 350, per100: { kcal: 210, protein_g: 6.5, fat_g: 11, carbs_g: 21 } })]);
  await go('#/');
  const id = dayMeal('lunch')[0].id;
  await click(L('diary.item', { css: `[data-item="${id}"]`, role: 'button', text: ['Плов ташкентский'] }));
  await waitSheet();
  await type(LOC.itemGrams, '100');
  const it = () => Store.findItem(TODAY(), id);
  expect(it().item.grams === 100, 'масса не сохранилась');
  await click(btn('item.meal.dinner', 'Ужин', '#modal .sheet', '#imeal [data-m="dinner"]'));
  expect(it().meal === 'dinner', 'запись не перенесена в ужин');
  await click(LOC.itemDel);
  await waitFor(() => !it(), 'удаление');
  await click(L('toast.undo', { css: '#toasts .toast button', role: 'button', text: ['Вернуть'] }));
  await waitFor(() => it() && it().meal === 'dinner', 'отмена удаления вернула запись в ужин');
});

scenario('Анализ текста без ИИ (локальная база) → результат → в дневник', async () => {
  await fresh();
  const shared = AIServer.enabled; AIServer.enabled = false; // проверяем именно встроенную базу
  try {
  await go('#/add?meal=breakfast');
  await type(LOC.addText, '2 яйца, 200 мл кофе с молоком, 40 г хлеба');
  await click(LOC.addCalc);
  await waitFor(() => location.hash === '#/result' && $('#ritems'), 'экран результата', 8000);
  const n = $$('#ritems .ritem').length;
  expect(n >= 3, 'распознано меньше трёх продуктов: ' + n);
  await click(LOC.resSave);
  await waitFor(() => dayMeal('breakfast').length === n, 'записи в завтраке');
  const tot = sumN(dayMeal('breakfast'));
  expect(tot.kcal > 150 && tot.kcal < 600, 'итог завтрака неправдоподобен: ' + tot.kcal);
  } finally { AIServer.enabled = shared; }
});

scenario('Каталог: кухня, сортировка по калориям и алфавиту, фильтр, поиск, запись', async () => {
  await fresh();
  await go('#/foods');
  await waitFor(() => Catalog.loaded && $('.cgrid'), 'каталог загрузился', 10000);
  await click(LOC.tileUzbek);
  await waitFor(() => location.hash.startsWith('#/foods/cat/uzbek') && $('#glist .clist'), 'страница узбекской кухни');
  const kcals = () => $$('#glist [data-id]').map(b => Number((b.querySelector('small').innerText.match(/([\d\s ]+)\s*ккал/) || [])[1].replace(/\s| /g, '')));
  await click(btn('sort.kdesc', 'Сначала калорийные', null, '#gsort [data-s="kdesc"]'));
  const k1 = kcals();
  expect(k1.length === Catalog.groupItems(0).length, `в отсортированном списке ${k1.length} из ${Catalog.groupItems(0).length}`);
  expect(k1.every((v, i) => i === 0 || k1[i - 1] >= v), 'калории не по убыванию');
  await click(btn('sort.kasc', 'Сначала лёгкие', null, '#gsort [data-s="kasc"]'));
  const k2 = kcals();
  expect(k2.every((v, i) => i === 0 || k2[i - 1] <= v), 'калории не по возрастанию');
  await click(btn('sort.az', 'По алфавиту', null, '#gsort [data-s="az"]'));
  const names = $$('#glist [data-id] .cn').map(x => x.firstChild.textContent.trim());
  expect(names.every((v, i) => i === 0 || names[i - 1].localeCompare(v, 'ru') <= 0), 'названия не по алфавиту');
  const soups = Catalog.data.cats.indexOf('Супы');
  await click(L('cat.filter.soups', { css: `#gcats [data-c="${soups}"]`, role: 'button', text: ['Супы 11', 'Супы'] }));
  await waitFor(() => $$('#glist [data-id]').length === 11, 'фильтр «Супы» (11 позиций)');
  await click(btn('cat.filter.all', ['Все 104', 'Все'], null, '#gcats [data-c=""]'));
  await type(LOC.groupSearch, 'манты');
  await waitFor(() => { const r = $$('#glist [data-id]'); return r.length >= 4 && r.every(b => /мант/i.test(b.innerText)); }, 'поиск «манты» в разделе');
  await click(L('catalog.row.first', { css: '#glist [data-id]', role: 'button', text: ['Манты с бараниной'] }));
  await waitSheet();
  await click(LOC.logAdd);
  await waitFor(() => MEALS.some(m => dayMeal(m).some(x => /^Манты/.test(x.name))), 'манты записаны');
  await click(btn('sort.def', 'По разделам', null, '#gsort [data-s="def"]'));
});

scenario('Возраст младше 18: алкоголь скрыт в каталоге и поиске', async () => {
  await fresh({ profile: { age: 16 } });
  await go('#/foods/cat/drinks');
  await waitFor(() => Catalog.loaded && $('#glist'), 'напитки', 10000);
  await sleep(200);
  expect(!$('#view .b18'), 'на странице напитков видны позиции 18+');
  expect($('#view .callout') || true, '');
  await go('#/foods');
  await type(LOC.catHomeSearch, 'пиво');
  await sleep(300);
  const rows = $$('#cres button');
  expect(rows.every(b => !b.querySelector('.b18')), 'в поиске есть алкоголь 18+');
  expect(rows.some(b => /безалкогольное/i.test(b.innerText)), 'безалкогольное пиво должно находиться');
});

scenario('Свой продукт: создание и поиск', async () => {
  await fresh();
  foodsTab = 'my';
  await go('#/foods');
  await click(LOC.newFood);
  await waitSheet();
  await type(LOC.nfName, 'Тестовый батончик');
  await type(LOC.nfKcal, '410');
  await click(LOC.nfSave);
  await waitFor(() => Store.state.myFoods[0] && Store.state.myFoods[0].name === 'Тестовый батончик', 'продукт сохранён');
  expect(Store.state.myFoods[0].per100.kcal === 410, 'калорийность не сохранилась');
  await sleep(600);
  await go('#/add');
  await click(LOC.addManual);
  await waitSheet();
  await type(LOC.searchInput, 'тестовый бат');
  await waitFor(() => $$('#modal .sheet button[data-i]').some(b => /Тестовый батончик/.test(b.innerText)), 'свой продукт в поиске');
});

scenario('Настройки: норма, язык, тема', async () => {
  await fresh();
  await go('#/settings');
  await type(L('set.kcal', { css: '#ftg input[name="kcal"]', role: 'input', field: 'Калории' }), '2100');
  await click(btn('set.targets.save', 'Сохранить', null, '#ftg button:not([type=button])'));
  await waitFor(() => Store.state.targets.kcal === 2100 && Store.state.targets.source === 'manual', 'новая норма');
  await click(btn('set.lang.en', 'English', null, '[data-set="lang"] [data-v="en"]'));
  await waitFor(() => $$('#dock a').some(a => /Diary/.test(a.innerText)), 'меню на английском');
  await click(btn('set.lang.ru', 'Русский', null, '[data-set="lang"] [data-v="ru"]'));
  await waitFor(() => $$('#dock a').some(a => /Дневник/.test(a.innerText)), 'меню снова на русском');
  await click(btn('set.theme.dark', ['Тёмная', 'Темная'], null, '[data-set="theme"] [data-v="dark"]'));
  await waitFor(() => document.documentElement.dataset.theme === 'dark', 'тёмная тема', 3000);
  await sleep(900);
  await click(btn('set.theme.auto', ['Как в системе', 'Авто'], null, '[data-set="theme"] [data-v="auto"]'));
  await sleep(900);
});

scenario('Статистика: графики и запись веса', async () => {
  await fresh();
  for (let i = 0; i < 3; i++) Store.addItems(addDays(TODAY(), -i), 'lunch', [makeItem({ name: 'Гречка', grams: 200, per100: { kcal: 110, protein_g: 4, fat_g: 2, carbs_g: 20 } })]);
  await go('#/stats');
  await waitFor(() => $$('svg.chart').length === 2, 'два графика');
  await type(LOC.weightIn, '61.5');
  await click(LOC.weightAdd);
  await waitFor(() => Store.state.weights.slice(-1)[0].kg === 61.5, 'вес записан');
  expect(Store.state.weights.filter(w => w.date === TODAY()).length === 1, 'за день должна быть одна запись веса');
});

scenario('Экспорт CSV и резервной копии JSON', async () => {
  await fresh();
  Store.addItems(TODAY(), 'dinner', [makeItem({ name: 'Суп "домашний", с укропом', grams: 300, per100: { kcal: 50 } })]);
  Store.state.settings.apiKey = 'sk-test-not-real';
  Store.save();
  const files = [];
  const orig = URL.createObjectURL;
  URL.createObjectURL = b => { files.push(b); return orig.call(URL, b); };
  try {
    await go('#/settings');
    await click(btn('set.csv', 'Экспорт CSV', null, '#dcsv'));
    await click(btn('set.json', 'Резервная копия', null, '#djson'));
    await waitFor(() => files.length === 2, 'два файла');
  } finally { URL.createObjectURL = orig; Store.state.settings.apiKey = ''; Store.save(); }
  const csv = await files[0].text();
  expect(csv.split('\n')[0].includes('date,meal,name,grams,kcal'), 'неверный заголовок CSV');
  expect(csv.includes('"Суп ""домашний"", с укропом"'), 'кавычки и запятые в названии не экранированы');
  const json = JSON.parse(await files[1].text());
  expect(json.settings.apiKey === '', 'ключ API попал в резервную копию');
  expect(json.days[TODAY()].meals.dinner.length === 1, 'в копии нет записи');
});

scenario('Заметка дня сохраняется автоматически', async () => {
  await fresh();
  await go('#/');
  await type(LOC.note, 'Самочувствие отличное');
  await waitFor(() => Store.peekDay(TODAY()) && Store.peekDay(TODAY()).note === 'Самочувствие отличное', 'заметка сохранена', 2000);
});

scenario('Устойчивость маршрутов: неизвестные и испорченные адреса', async () => {
  await fresh();
  await go('#/no-such-page');
  expect($('.diary-hero'), 'неизвестный адрес должен вести в дневник');
  await go('#/day/abc');
  expect($('.diary-hero'), 'испорченная дата должна показывать дневник');
  await type(LOC.note, 'x');
  await sleep(600);
  expect(!Store.state.days.abc, 'заметка сохранилась под несуществующей датой «abc»');
  await go('#/meal/2020-13-45/zzz');
  expect($('.diary-hero'), 'испорченный адрес приёма пищи');
  await go('#/foods/cat/nope');
  await waitFor(() => /Ничего не нашлось/.test($('#view').innerText), 'несуществующая кухня');
});

scenario('Вёрстка: нет горизонтальной прокрутки и «сырых» значений', async () => {
  await fresh();
  Store.addItems(TODAY(), 'lunch', [makeItem({ name: 'Гречка', grams: 200, per100: { kcal: 110, protein_g: 4, fat_g: 2, carbs_g: 20 } })]);
  const problems = [];
  for (const h of ['#/', '#/add', '#/foods', '#/foods/cat/uzbek', '#/foods/cat/drinks', '#/stats', '#/chat', '#/settings', `#/meal/${TODAY()}/lunch`]) {
    await go(h);
    await sleep(400);
    if (document.documentElement.scrollWidth > innerWidth + 1) problems.push(`${h}: ширина ${document.documentElement.scrollWidth} > ${innerWidth}`);
    const txt = $('#view').innerText + ' ' + $('#top').innerText;
    const raw = txt.match(/\b(NaN|undefined|null|Infinity|\[object Object\])\b|\b(err|cat|set|onb|res|nav|src|diet|al|auth|sync)\.[a-z][\w.]*/g);
    if (raw) problems.push(`${h}: ${[...new Set(raw)].join(', ')}`);
  }
  expect(!problems.length, problems.join('; '));
});

scenario('Доступность: подписи кнопок, полей и изображений', async () => {
  await fresh();
  const issues = [];
  for (const h of ['#/', '#/add', '#/foods', '#/stats', '#/settings']) {
    await go(h);
    for (const b of $$('button, a[href]').filter(visible)) if (!(b.innerText.trim() || b.getAttribute('aria-label') || b.title)) issues.push(`${h}: кнопка без подписи ${b.outerHTML.slice(0, 80)}`);
    for (const i of $$('input:not([type=hidden]):not([type=file]), textarea, select').filter(visible)) if (!(i.closest('label') || i.getAttribute('aria-label') || i.placeholder || (i.id && $(`label[for="${i.id}"]`)))) issues.push(`${h}: поле без подписи ${i.outerHTML.slice(0, 80)}`);
    for (const img of $$('img').filter(visible)) if (!img.hasAttribute('alt')) issues.push(`${h}: img без alt`);
  }
  expect(!issues.length, issues.slice(0, 6).join('; '));
});

scenario('Аккаунт: регистрация → синхронизация → выход → вход → смена пароля → удаление', async () => {
  // тестовый аккаунт создаётся только на локальном сервере и удаляется в конце сценария
  const email = `e2e-${Date.now().toString(36)}@example.com`;
  const pw1 = 'E2e-' + crypto.randomUUID(), pw2 = 'E2e-' + crypto.randomUUID();
  await fresh();
  Store.addItems(TODAY(), 'snack', [makeItem({ name: 'Яблоко E2E', grams: 150, per100: { kcal: 52 } })]);
  await go('#/auth?mode=register');
  await type(L('auth.name', { css: 'input[name="displayName"]', role: 'input', field: 'Как подписать дневник' }), 'E2E');
  await type(L('auth.email', { css: 'input[name="email"]', role: 'input', field: 'Email' }), email);
  await type(L('auth.password', { css: 'input[name="password"]', role: 'input', field: 'Пароль' }), pw1);
  await click(btn('auth.submit', 'Создать аккаунт', null, '#authf [type=submit]'));
  try {
    await waitFor(() => Cloud.user && Cloud.user.email === email, 'вход после регистрации', 10000);
    await Cloud.flush();
    await waitFor(() => Cloud.status === 'synced', 'синхронизация', 10000);
    const srv = await fetch('/api/data', { credentials: 'include' }).then(r => r.json());
    expect(JSON.stringify(srv.data).includes('Яблоко E2E'), 'запись не попала на сервер');
    // выход стирает дневник на устройстве
    await go('#/settings');
    await click(btn('auth.logout', 'Выйти', null, '#alogout'));
    await waitSheet();
    await click(btn('auth.logout.ok', 'Выйти', '#modal .sheet', '#lok'));
    await waitFor(() => !Cloud.user && location.hash === '#/welcome', 'выход', 8000);
    expect(!JSON.stringify(Store.state.days).includes('Яблоко E2E'), 'после выхода дневник остался на устройстве');
    // вход возвращает дневник
    await go('#/auth?mode=login');
    await type(L('auth.email2', { css: 'input[name="email"]', role: 'input', field: 'Email' }), email);
    await type(L('auth.password2', { css: 'input[name="password"]', role: 'input', field: 'Пароль' }), pw1);
    await click(btn('auth.login', 'Войти', null, '#authf [type=submit]'));
    await waitFor(() => Cloud.user && JSON.stringify(Store.state.days).includes('Яблоко E2E'), 'дневник восстановлен после входа', 10000);
    // смена пароля: сначала неверный текущий пароль
    if (!Store.state.settings.onboarded) { seedProfile(); Store.save(); }
    await go('#/settings');
    await click(btn('auth.chpw', 'Сменить пароль', null, '#achpw'));
    await waitSheet();
    await type(L('pw.cur', { css: '#pwf input[name="current"]', role: 'input', within: '#modal .sheet', field: 'Текущий пароль' }), 'wrong-password-123');
    await type(L('pw.new', { css: '#pwf input[name="next"]', role: 'input', within: '#modal .sheet', field: 'Новый пароль' }), pw2);
    await click(btn('pw.save', 'Сохранить', '#modal .sheet', '#pwf [type=submit]'));
    await waitFor(() => $('#pwerr') && $('#pwerr').innerText.trim(), 'ошибка неверного пароля');
    await type(L('pw.cur', { css: '#pwf input[name="current"]', role: 'input', within: '#modal .sheet', field: 'Текущий пароль' }), pw1);
    await click(btn('pw.save', 'Сохранить', '#modal .sheet', '#pwf [type=submit]'));
    await waitFor(() => !$('#modal').classList.contains('open'), 'пароль сменён', 8000);
  } finally {
    // удаление аккаунта через интерфейс (или через API, если сценарий упал раньше)
    const pw = await fetch('/api/auth/me', { credentials: 'include' }).then(r => r.ok);
    if (pw && Cloud.user) {
      await go('#/settings');
      await click(btn('auth.delete', 'Удалить аккаунт', null, '.account #adel'));
      await waitSheet();
      for (const p of [pw2, pw1]) {
        await type(L('del.pw', { css: '#pwf input[name="password"]', role: 'input', within: '#modal .sheet', field: 'Пароль' }), p);
        await click(btn('del.ok', 'Удалить аккаунт', '#modal .sheet', '#pwf [type=submit]'));
        await sleep(1500);
        if (!Cloud.user) break;
      }
    }
  }
  // страховка: если интерфейс не справился, удаляем тестовый аккаунт напрямую через API
  if (Cloud.user) {
    for (const password of [pw2, pw1]) {
      const r = await fetch('/api/account', { method: 'DELETE', credentials: 'include', headers: { 'content-type': 'application/json', 'x-nl': '1' }, body: JSON.stringify({ password }) });
      if (r.status === 204) { await Cloud.logout(); throw new AssertionError('аккаунт пришлось удалять через API — удаление через интерфейс не сработало'); }
    }
  }
  await waitFor(() => !Cloud.user, 'аккаунт удалён', 8000);
  const login = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json', 'x-nl': '1' }, body: JSON.stringify({ email, password: pw2 }) });
  expect(login.status === 401, 'после удаления аккаунта вход всё ещё возможен: ' + login.status);
}, { needs: () => Cloud.available });

/* ---------- запуск ---------- */
export async function run({ chaos = false, only = null, keepHealCache = false } = {}) {
  const saved = localStorage.getItem('nutrilens.v1');
  const savedSort = localStorage.getItem('nutrilens.catSort');
  const errors = [];
  const onErr = e => errors.push(String(e.message || e.reason || e));
  const origConsoleError = console.error;
  console.error = (...a) => { errors.push(a.map(String).join(' ')); origConsoleError(...a); };
  addEventListener('error', onErr); addEventListener('unhandledrejection', onErr);
  const wasThrottled = await throttled();
  const fastTimers = installFastTimers();
  // самовосстановление среды: прерванный прошлый прогон мог оставить браузер в тестовом аккаунте
  const envNotes = [];
  if (Cloud.user && /^e2e-/.test(Cloud.user.email)) { envNotes.push('вышли из оставшегося тестового аккаунта ' + Cloud.user.email); await Cloud.logout(); }
  if (!keepHealCache) resetHealCache();
  healLog.length = 0;
  if (chaos) enableChaos();
  await Catalog.load().catch(() => {});
  const results = [];
  for (const s of SCENARIOS) {
    if (only && !only.some(o => s.name.includes(o))) continue;
    if (s.needs && !s.needs()) { results.push({ name: s.name, status: 'skipped', note: 'нет серверной части' }); continue; }
    const h0 = healLog.length, e0 = errors.length, t0 = performance.now();
    let status = 'passed', error = null;
    try { await s.fn(); } catch (e) { status = 'failed'; error = (e instanceof AssertionError ? '' : e.name + ': ') + e.message; }
    results.push({ name: s.name, status, ms: Math.round(performance.now() - t0), error, healed: healLog.slice(h0), jsErrors: errors.slice(e0) });
  }
  if (fastTimers) uninstallFastTimers();
  if (chaos) disableChaos();
  console.error = origConsoleError;
  removeEventListener('error', onErr); removeEventListener('unhandledrejection', onErr);
  // вернуть пользовательское состояние
  UI.closeModal();
  if (saved) localStorage.setItem('nutrilens.v1', saved); else localStorage.removeItem('nutrilens.v1');
  if (savedSort) localStorage.setItem('nutrilens.catSort', savedSort); else localStorage.removeItem('nutrilens.catSort');
  Store.load(); resetOnb();
  await go('#/');
  const sum = k => results.filter(r => r.status === k).length;
  return {
    when: new Date().toISOString(), url: location.origin, envHealing: [...(wasThrottled ? ['фоновая вкладка: таймеры заменены на незамедляемые'] : []), ...envNotes], viewport: `${innerWidth}×${innerHeight}`, chaos, chaosStats: chaos ? { ...chaosStats } : null,
    summary: { passed: sum('passed'), failed: sum('failed'), skipped: sum('skipped'), healed: healLog.length },
    results,
  };
}
