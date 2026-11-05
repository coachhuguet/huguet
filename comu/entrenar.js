// Coach Huguet · pestanya ▶ Entrenar (comú per a tots els clients).
// Llegeix els dies de la pestanya d'entreno (#entreno .card amb .ex), deixa apuntar kg i reps de cada sèrie,
// llança el compte enrere del descans, guarda l'historial (#historial) i ho envia al full de Google del coach.
// Opcions a <section id="entrenar">: data-rest="120,75" (descans dels 2 primers exercicis, i de la resta),
// data-circuit="120" (circuit: es fa una volta de tots els exercicis; és el descans entre voltes),
// data-client="Nom" (nom de la pestanya del full: "Registre Nom"; si no hi és, s'agafa el títol h1).
(function () {
  var root = document.getElementById('entrenar');
  if (!root) return;
  var ca = document.documentElement.lang === 'ca';
  var T = ca ? {
    set: 'Sèrie', sets: 'sèries', done: 'Fet', rest: 'Descans', next: 'Següent', last: 'Última sèrie de l’entrenament',
    skip: 'Saltar', reset: 'Reiniciar', go: 'Som-hi! Següent sèrie', finish: 'Entrenament complet!', finishTxt: 'Bona feina. Camina 2-3 minuts per baixar pulsacions.',
    confirm: 'Vols reiniciar el dia?', days: ['diumenge','dilluns','dimarts','dimecres','dijous','divendres','dissabte'],
    first: 'Apunta primer el pes i les repeticions d\'alguna sèrie.', sent: '✓ Enviat al coach', later: 'Sense connexió: s\'enviarà sol més tard',
    fail: 'No s\'ha pogut connectar amb el full. Torna-ho a provar.', resend: '📤 Tornar a enviar al coach', send: '📤 Enviar l\'entreno al coach',
    autosave: 'Es guarda sol mentre apuntes; el botó és per assegurar-ho en acabar.', empty: 'Encara no hi ha cap entreno apuntat. Fes-ho des de la pestanya ▶ Entrenar.',
    prev: 'En gris, el que vas fer l\'últim dia.', title: 'Entreno'
  } : {
    set: 'Serie', sets: 'series', done: 'Hecho', rest: 'Descanso', next: 'Siguiente', last: 'Última serie del entreno',
    skip: 'Saltar', reset: 'Reiniciar', go: '¡Vamos! Siguiente serie', finish: '¡Entreno completado!', finishTxt: 'Buen trabajo. Camina 2-3 minutos para bajar pulsaciones.',
    confirm: '¿Reiniciar el día?', days: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    first: 'Apunta primero el peso y las repeticiones de alguna serie.', sent: '✓ Enviado al coach', later: 'Sin conexión: se enviará solo más tarde',
    fail: 'No se ha podido conectar con la hoja. Vuelve a probar.', resend: '📤 Volver a enviar al coach', send: '📤 Enviar el entreno al coach',
    autosave: 'Se guarda solo mientras apuntas; el botón es para asegurarlo al terminar.', empty: 'Todavía no hay ningún entreno apuntado. Hazlo desde la pestaña ▶ Entrenar.',
    prev: 'En gris, lo que hiciste el último día.', title: 'Entreno'
  };
  if (!ca) T.finishTxt = 'Buen trabajo. Camina 2-3 minutos para bajar pulsaciones.';
  // Circuit: es fa una volta de tots els exercicis i data-circuit és el descans entre voltes
  var circuit = root.dataset.circuit ? +root.dataset.circuit : 0;
  if (circuit) { T.set = ca ? 'Volta' : 'Vuelta'; T.sets = ca ? 'voltes' : 'vueltas'; }
  var restCfg = (root.dataset.rest || '120,75').split(',').map(Number);

  // Días y ejercicios a partir de las tarjetas existentes
  var days = [];
  document.querySelectorAll('#entreno .card').forEach(function (card) {
    var exs = card.querySelectorAll('.ex');
    var h3 = card.querySelector('h3');
    if (!exs.length || !h3) return;
    var title = '';
    h3.childNodes.forEach(function (n) { if (!(n.classList && n.classList.contains('tag'))) title += n.textContent; });
    title = title.trim();
    var list = [];
    exs.forEach(function (ex, i) {
      var dose = ex.querySelector('.dose').textContent.trim();
      var why = (ex.querySelector('.why') || {}).textContent || '';
      var m = dose.match(/^(\d+)\s*[a-zà-ú]*\s*×\s*(.+)$/i);
      var r = why.match(/descans[oa]?\s+(?:de\s+)?(\d+)\s*(s|min)\b/i);
      var rest = r ? (+r[1]) * (r[2].toLowerCase() === 'min' ? 60 : 1) : restCfg[i < 2 ? 0 : 1];
      var fig = ex.querySelector('.fig');
      var reps = m ? m[2].trim() : dose;
      // Sense pes ni repeticions (temps o distància): només es marca la sèrie, sense apuntar kg/reps.
      var plain = !m || reps === '1' || /^\d[\d\s,.\-–]*(s|seg|min|m)\b/i.test(reps);
      list.push({ name: ex.querySelector('.n').textContent.trim(), why: why.trim(), sets: m ? +m[1] : 1, reps: reps, rest: rest, timed: !m, plain: plain, fig: fig ? fig.outerHTML : '' });
    });
    if (circuit) list[list.length - 1].rest = circuit;
    days.push({ title: title, ex: list });
  });
  if (!days.length) return;

  var key = 'coach-huguet-entrenar-' + location.pathname.split('/').pop();
  var today = new Date().toDateString();
  var st = {};
  try { st = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
  if (st.date !== today) st = { date: today, done: {} };
  if (st.day == null) {
    var wd = T.days[new Date().getDay()];
    st.day = 0;
    days.forEach(function (d, i) { if (d.title.split('·')[0].toLowerCase().indexOf(wd) > -1 && st.day === 0) st.day = i; });
  }
  function save() { try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {} }

  // Registre de pes i repeticions de cada sèrie, amb historial per enviar al coach.
  var hkey = 'coach-huguet-historial-' + location.pathname.split('/').pop(), hist = {};
  try { hist = JSON.parse(localStorage.getItem(hkey)) || {}; } catch (e) {}
  var who = root.dataset.client || (document.querySelector('h1') || {}).textContent || '';
  who = who.replace(/\s+/g, ' ');
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function logOf(di) { st.log = st.log || {}; return st.log[di] || (st.log[di] = days[di].ex.map(function () { return []; })); }
  function lastOf(name) {
    var today = iso(new Date()), best = null;
    Object.keys(hist).sort().forEach(function (k) {
      var h = hist[k]; if (h.date === today) return;
      h.ex.forEach(function (x) { if (x.n === name && x.s.some(function (r) { return r && (r[0] || r[1]); })) best = x.s; });
    });
    return best;
  }
  function record(di) {
    var d = days[di], lg = logOf(di), date = iso(new Date());
    var ex = d.ex.map(function (e, ei) { return { n: e.name, s: lg[ei] || [] }; }).filter(function (x) { return x.s.some(function (r) { return r && (r[0] || r[1]); }); });
    var k = date + '|' + d.title;
    if (ex.length) hist[k] = { date: date, day: d.title, ex: ex }; else delete hist[k];
    try { localStorage.setItem(hkey, JSON.stringify(hist)); } catch (e) {}
    renderHist(); sync(di);
  }
  function summary(h) {
    var p = h.date.split('-');
    return '🏋️ ' + T.title + ' ' + who.trim() + ' · ' + h.day + ' · ' + p[2] + '/' + p[1] + '/' + p[0] + '\n' + h.ex.map(function (x) {
      return '• ' + x.n + ': ' + x.s.map(function (r) { return r ? (r[0] || '—') + ' kg × ' + (r[1] || '—') : '—'; }).join(', ');
    }).join('\n');
  }
  var R = window.coachRegistre, sheet = R && R.active(), timer = null;
  function sync(di) {
    if (!sheet) return;
    var k = iso(new Date()) + '|' + days[di].title, h = hist[k];
    clearTimeout(timer);
    timer = setTimeout(function () { R.push({ client: who.trim(), date: iso(new Date()), day: days[di].title, ex: h ? h.ex : [] }); }, 3000);
  }
  function send(h, btn) {
    if (!h) { alert(T.first); return; }
    if (sheet) {
      clearTimeout(timer);
      R.push({ client: who.trim(), date: h.date, day: h.day, ex: h.ex }).then(function (ok) {
        if (btn) btn.textContent = ok ? T.sent : T.later;
      });
      return;
    }
    if (btn) btn.textContent = T.fail;
  }
  function renderHist() {
    var box = document.getElementById('historial'); if (!box) return;
    var ks = Object.keys(hist).sort().reverse();
    box.innerHTML = ks.length ? ks.slice(0, 30).map(function (k) {
      return '<div class="hist-item"><pre>' + esc(summary(hist[k])) + '</pre><button data-h="' + esc(k) + '">' + T.resend + '</button></div>';
    }).join('') : '<p class="mut small">' + T.empty + '</p>';
  }
  var hb = document.getElementById('historial');
  if (hb) hb.addEventListener('click', function (ev) { var b = ev.target.closest('button[data-h]'); if (b) send(hist[b.dataset.h], b); });
  function doneOf(di) { return st.done[di] || (st.done[di] = days[di].ex.map(function (e) { return Array(e.sets).fill(false); })); }
  function fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }

  var daysEl = root.querySelector('.wk-days'), listEl = root.querySelector('.wk-list');
  function renderDays() {
    daysEl.innerHTML = days.map(function (d, i) {
      var p = d.title.split('·');
      return '<button aria-pressed="' + (i === st.day) + '" data-d="' + i + '"><b>' + p[0].trim() + '</b>' + (p[1] || '').trim() + '</button>';
    }).join('');
  }
  function render() {
    var d = days[st.day], done = doneOf(st.day), tot = 0, ok = 0;
    done.forEach(function (a) { a.forEach(function (v) { tot++; if (v) ok++; }); });
    var html = '<div class="wk-top"><div class="wk-bar"><i style="width:' + (tot ? ok / tot * 100 : 0) + '%"></i></div><span class="wk-count">' + ok + '/' + tot + '</span><button class="wk-reset">' + T.reset + '</button></div>';
    html += '<div class="card" style="counter-reset:wk">';
    d.ex.forEach(function (e, ei) {
      var all = done[ei].every(Boolean);
      html += '<div class="ex wk-ex' + (all ? ' done' : '') + '" style="display:block"><div class="wk-head"><span class="wk-name">' + e.name + '</span><span></span>' +
        '<div class="wk-meta"><span class="wk-chip">' + e.sets + ' ' + (e.sets === 1 ? T.set.toLowerCase() : T.sets) + '</span><span class="wk-chip r">' + e.reps + '</span>' +
        (e.sets > 1 || ei < d.ex.length - 1 ? '<span class="wk-chip t">⏱ ' + fmt(e.rest) + '</span>' : '') + '</div></div>' +
        (e.why ? '<p class="wk-why">' + e.why + '</p>' : '') + e.fig;
      if (e.plain) {
        html += '<div class="wk-sets">' + done[ei].map(function (v, si) {
          return '<button class="' + (v ? 'on' : '') + (e.sets === 1 ? ' one' : '') + '" data-e="' + ei + '" data-s="' + si + '" aria-pressed="' + v + '" aria-label="' + e.name + ', ' + T.set + ' ' + (si + 1) + '">' + (v ? '✓' : (e.sets === 1 ? T.done : si + 1)) + '</button>';
        }).join('') + '</div></div>';
        return;
      }
      html += '<div class="wk-log">';
      var lg = logOf(st.day)[ei], prev = lastOf(e.name);
      done[ei].forEach(function (v, si) {
        var cur = lg[si] || ['', ''], pv = prev && prev[si] ? prev[si] : null;
        html += '<div class="wk-row"><span>' + (si + 1) + '</span>' +
          '<label><input inputmode="decimal" data-e="' + ei + '" data-s="' + si + '" data-f="0" value="' + esc(cur[0]) + '" placeholder="' + (pv && pv[0] ? esc(pv[0]) : '') + '" aria-label="' + e.name + ', ' + T.set + ' ' + (si + 1) + ', kg"><i>kg</i></label>' +
          '<label><input inputmode="numeric" data-e="' + ei + '" data-s="' + si + '" data-f="1" value="' + esc(cur[1]) + '" placeholder="' + (pv && pv[1] ? esc(pv[1]) : '') + '" aria-label="' + e.name + ', ' + T.set + ' ' + (si + 1) + ', reps"><i>reps</i></label>' +
          '<button class="' + (v ? 'on' : '') + '" data-e="' + ei + '" data-s="' + si + '" aria-pressed="' + v + '" aria-label="' + e.name + ', ' + T.set + ' ' + (si + 1) + ' ' + T.done + '">' + (v ? '✓' : '○') + '</button></div>';
      });
      html += '</div>' + (prev ? '<p class="wk-hint">' + T.prev + '</p>' : '') + '</div>';
    });
    html += '</div><button class="wk-send" data-send="1">' + T.send + '</button>' + '<p class="mut small" style="text-align:center;margin-top:8px">' + T.autosave + '</p>';
    if (tot && ok === tot) html += '<div class="card hl wk-done"><b>🏆 ' + T.finish + '</b><p>' + T.finishTxt + '</p></div>';
    listEl.innerHTML = html;
  }

  // Cuenta atrás
  var bar = document.createElement('div');
  bar.className = 'wk-timer';
  bar.innerHTML = '<div class="in"><div class="wk-clock">0:00</div><div class="wk-lbl"></div><div class="wk-btns"><button data-a="-15">−15 s</button><button data-a="15">+15 s</button><button data-a="skip" class="go">' + T.skip + '</button></div></div>';
  document.body.appendChild(bar);
  var clock = bar.querySelector('.wk-clock'), lbl = bar.querySelector('.wk-lbl'), tick = null, audio = null, rang = false;
  function beep() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, .25, .5].forEach(function (t, i) {
        var o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = i === 2 ? 1320 : 880; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(.25, audio.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + t + .2);
        o.start(audio.currentTime + t); o.stop(audio.currentTime + t + .22);
      });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 400]);
  }
  function nextLabel() {
    var d = days[st.day], done = doneOf(st.day);
    if (circuit) {
      for (var s = 0; s < d.ex[0].sets; s++) for (var e = 0; e < d.ex.length; e++)
        if (done[e][s] === false) return '<b>' + d.ex[e].name + '</b>' + T.set + ' ' + (s + 1) + '/' + d.ex[e].sets + ' · ' + d.ex[e].reps;
      return '<b>' + T.last + '</b>';
    }
    for (var ei = 0; ei < d.ex.length; ei++) for (var si = 0; si < done[ei].length; si++)
      if (!done[ei][si]) return '<b>' + d.ex[ei].name + '</b>' + T.set + ' ' + (si + 1) + '/' + d.ex[ei].sets + ' · ' + d.ex[ei].reps;
    return '<b>' + T.last + '</b>';
  }
  function update() {
    var left = (st.endAt - Date.now()) / 1000;
    if (left <= 0) {
      clock.textContent = '0:00';
      bar.classList.add('end');
      if (!rang) { rang = true; beep(); lbl.innerHTML = '<b>' + T.go + '</b>' + nextLabel().replace(/<\/?b>/g, ' '); }
      if (left < -20) stop();
      return;
    }
    clock.textContent = fmt(left);
  }
  function start(sec) {
    st.endAt = Date.now() + sec * 1000; rang = false; save();
    bar.classList.remove('end'); bar.classList.add('show');
    lbl.innerHTML = T.rest + ' · ' + T.next + ':' + nextLabel();
    clearInterval(tick); tick = setInterval(update, 250); update();
  }
  function stop() { clearInterval(tick); tick = null; st.endAt = null; save(); bar.classList.remove('show', 'end'); }
  bar.addEventListener('click', function (ev) {
    var a = ev.target.dataset.a; if (!a) return;
    if (a === 'skip') return stop();
    st.endAt += (+a) * 1000; rang = false; bar.classList.remove('end'); save(); update();
  });

  // Pantalla encendida mientras se entrena
  var lock = null;
  function wake() { if (navigator.wakeLock && !root.hidden && !lock) navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }).catch(function () {}); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { wake(); if (st.endAt) update(); } });
  new MutationObserver(function () {
    if (root.hidden) { bar.classList.remove('show'); if (lock) lock.release(); }
    else {
      wake();
      if (st.endAt) { bar.classList.add('show'); if (!tick) { lbl.innerHTML = T.rest + ' · ' + T.next + ':' + nextLabel(); tick = setInterval(update, 250); update(); } }
    }
  }).observe(root, { attributes: true, attributeFilter: ['hidden'] });

  daysEl.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    st.day = +b.dataset.d; save(); stop(); renderDays(); render();
  });
  listEl.addEventListener('input', function (ev) {
    var t = ev.target; if (!t.dataset.f) return;
    var lg = logOf(st.day), ei = +t.dataset.e, si = +t.dataset.s;
    lg[ei][si] = lg[ei][si] || ['', ''];
    lg[ei][si][+t.dataset.f] = t.value.trim();
    save(); record(st.day);
  });
  listEl.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.send) { var k = iso(new Date()) + '|' + days[st.day].title; return send(hist[k], b); }
    if (b.classList.contains('wk-reset')) { if (confirm(T.confirm)) { delete st.done[st.day]; if (st.log) delete st.log[st.day]; stop(); save(); record(st.day); render(); } return; }
    var d = days[st.day], done = doneOf(st.day), ei = +b.dataset.e, si = +b.dataset.s;
    done[ei][si] = !done[ei][si]; save(); render();
    if (done[ei][si]) {
      var left = done.some(function (a) { return a.some(function (v) { return !v; }); });
      if (left) start(d.ex[ei].rest); else stop();
      if (audio && audio.state === 'suspended') audio.resume();
      else if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    }
  });
  renderDays(); render(); renderHist();
  if (st.endAt && st.endAt < Date.now() - 20000) { st.endAt = null; save(); }
  if (st.endAt && !root.hidden) { bar.classList.add('show'); lbl.innerHTML = T.rest + ' · ' + T.next + ':' + nextLabel(); tick = setInterval(update, 250); update(); }
})();
