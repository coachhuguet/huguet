// Coach Huguet · connexió amb el full de Google del registre d'entrenos (comú per a tots els clients; cada client va a la seva pestanya "Registre <Nom>").
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

  // Tests i mesures de la pestanya Progrés (totes les taules menys "cargas"): van a una cantonada de la pestanya del client.
  function client() {
    var r = document.getElementById('entrenar');
    return ((r && r.dataset.client) || (document.querySelector('h1') || {}).textContent || '').replace(/\s+/g, ' ').trim();
  }
  function taules() {
    var sec = document.getElementById('progreso');
    return sec ? [].filter.call(sec.querySelectorAll('table'), function (t) { return t.id !== 'cargas'; }) : [];
  }
  function tests() {
    var buit = true, tables = taules().map(function (t) {
      var h = t.closest('.card') && t.closest('.card').querySelector('h3');
      var rows = [].map.call(t.querySelectorAll('tr'), function (tr) {
        return [].map.call(tr.children, function (c) {
          var i = c.querySelector('input'), v = (i ? i.value : c.textContent).trim();
          if (i && v) buit = false;
          return v;
        });
      });
      return { title: h ? h.textContent.trim() : t.id, rows: rows };
    });
    return buit ? null : { type: 'tests', client: client(), tables: tables };
  }
  var tt = null;
  function pushTests() {
    var d = tests(); if (!d || !window.COACH_SHEET_URL) return;
    var k = d.client + '|tests', p = load(); p[k] = d; store(p);
    clearTimeout(tt); tt = setTimeout(function () { post(k, d); }, 3000);
  }
  var sec = document.getElementById('progreso');
  if (sec) sec.addEventListener('input', function (ev) { var t = ev.target.closest('table'); if (t && t.id !== 'cargas') pushTests(); });
  setTimeout(pushTests, 2000);
  return { push: push, active: function () { return !!window.COACH_SHEET_URL; } };
})();
