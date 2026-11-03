/* Eatlas — переключение языка на странице политики (#ru / #uz / #en). Отдельный файл — из-за CSP. */
// язык из адреса (#ru / #uz / #en), иначе — язык браузера
function show() {
  var h = location.hash.replace('#', '');
  var lang = ['ru', 'uz', 'en'].indexOf(h) >= 0 ? h : (/^uz/.test(navigator.language) ? 'uz' : /^ru/.test(navigator.language) ? 'ru' : 'en');
  document.querySelectorAll('[data-lang]').forEach(function (a) { a.classList.toggle('on', a.dataset.lang === lang); });
  document.querySelectorAll('[data-tab]').forEach(function (a) { a.setAttribute('aria-current', a.dataset.tab === lang ? 'true' : 'false'); });
  document.documentElement.lang = lang;
  document.title = { ru: 'Eatlas — политика конфиденциальности', uz: 'Eatlas — maxfiylik siyosati', en: 'Eatlas — privacy policy' }[lang];
}
window.addEventListener('hashchange', show);
show();
