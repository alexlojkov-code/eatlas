/* Eatlas — первый скрипт страницы (в <head>, до стилей): основной адрес, переезд со старых адресов, тема.
   Отдельным файлом, а не встроенным скриптом: политика CSP разрешает только скрипты с нашего сайта. */
var NL_MAIN = 'https://eatlas-app.vercel.app'; // основной адрес сайта; js/migrate.js берёт его отсюда

// старые адреса (копия на GitHub Pages и прежний адрес на Vercel) уводим на основной сайт.
// Если там уже есть дневник без переноса — остаёмся: js/migrate.js предложит перенести его.
var nlGh = /\.github\.io$/.test(location.hostname);
if (nlGh || location.hostname === 'nutrilens-orcin-seven.vercel.app') {
  var nlHasDiary = false;
  try {
    var nlSt = JSON.parse(localStorage.getItem('nutrilens.v1') || 'null');
    nlHasDiary = !!nlSt && localStorage.getItem('nutrilens.moved') !== '1' &&
      (!!(nlSt.settings && nlSt.settings.onboarded) || Object.keys(nlSt.days || {}).length > 0);
  } catch (e) {}
  if (!nlHasDiary) {
    // на GitHub Pages первый сегмент пути — имя репозитория, какое бы оно ни было
    location.replace(NL_MAIN + (nlGh ? location.pathname.replace(/^\/[^/]+/, '') : location.pathname) + location.search + location.hash);
  }
}

// тема до первой отрисовки — без вспышки светлого фона
try { var th = (JSON.parse(localStorage.getItem('nutrilens.v1') || '{}').settings || {}).theme || 'auto';
  document.documentElement.dataset.theme = th === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : th; } catch (e) {}
