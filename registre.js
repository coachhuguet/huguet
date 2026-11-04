// Coach Huguet · connexió amb el full de Google del registre d'entrenos (comú per a tots els clients).
// Enganxa aquí l'adreça de l'aplicació web de l'Apps Script (acaba en /exec).
window.COACH_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwVmAZ3daHjIefZRkJt7oiUv9nN0ufo15Bmdg7m9-C-xeM3ZhRC-xeZKpNvbefKnIbZQg/exec';

window.coachRegistre = (function () {
  var PKEY = 'coach-huguet-pendents';
  function load() { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } }
  function store(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  function post(k, data) {
    return fetch(window.COACH_SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) })
      .then(function () { var p = load(); if (p[k] && JSON.stringify(p[k]) === JSON.stringify(data)) { delete p[k]; store(p); } return true; })
      .catch(function () { return false; });
  }
  // Guarda la sessió com a pendent i l'envia; si no hi ha connexió, es torna a provar més tard.
  function push(data) {
    if (!window.COACH_SHEET_URL) return Promise.resolve(false);
    var k = data.client + '|' + data.date + '|' + data.day, p = load();
    p[k] = data; store(p);
    return post(k, data);
  }
  function flush() {
    if (!window.COACH_SHEET_URL) return;
    var p = load(); Object.keys(p).forEach(function (k) { post(k, p[k]); });
  }
  window.addEventListener('online', flush);
  setTimeout(flush, 1500);
  return { push: push, active: function () { return !!window.COACH_SHEET_URL; } };
})();
