/**
 * Coach Huguet · Registre d'entrenos
 * Rep les sessions que envien les pàgines dels clients i les guarda al full,
 * cada client a la seva pestanya: "Registre Jowni", "Registre Pau"...
 * Si la pestanya no existeix, es crea sola la primera vegada que el client envia alguna cosa.
 *
 * Com queda cada pestanya:
 *   A1: nom del client · A2: títol "Tests i mesures" · H2: títol "Registre d'entrenos"
 *   A3 cap avall: les taules de tests i mesures de la pestanya Progrés, una sota l'altra (columnes A-F).
 *   H3 cap avall: el registre d'entrenos (Data, Sessió, Exercici, Sèrie, Kg, Reps), cada sessió d'un color.
 * Cada sessió (data + dia) es reescriu sencera, així si el client corregeix una dada no es duplica.
 *
 * El qüestionari inicial (questionari.html, el mateix enllaç per a tothom) va a la pestanya "Qüestionaris":
 * una fila per resposta, una columna per pregunta, i a més s'envia un correu al propietari del full amb el resum.
 */
var COLS = ['Data', 'Sessió', 'Exercici', 'Sèrie', 'Kg', 'Reps'];
var TOP = 3;   // fila on comencen les taules
var TW = 6;    // amplada màxima de les taules de tests (columnes A-F)
var RCOL = 8;  // el registre d'entrenos comença a la columna H

var VERD = '#1f7a4d', VERD_CLAR = '#e6f4ec', BLAU = '#1d4e89', BLAU_CLAR = '#e8f0fa', GRIS = '#f4f5f7', VORA = '#c9ced6';

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (d.type === 'questionari') { escriuQuestionari(d); return ContentService.createTextOutput('ok'); }
    var sh = full(d.client);
    migra(sh);
    if (d.type === 'tests') escriuTests(sh, d.tables || []);
    else escriuEntreno(sh, d);
    capcalera(sh, d.client);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Registre Coach Huguet actiu');
}

// Pestanya del client: "Registre <Nom>". Si no hi és, es crea.
function full(client) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nom = ('Registre ' + String(client || 'Sense nom').replace(/[\[\]\*\?\/\\:]/g, ' ')).trim().slice(0, 90);
  var sh = ss.getSheetByName(nom);
  if (!sh) {
    // La pestanya antiga "Registre" (de quan era una sola per a tothom) es reanomena si només té aquest client.
    var vella = ss.getSheetByName('Registre');
    if (vella && nomesDe(vella, client)) { vella.setName(nom); sh = vella; }
    else sh = ss.insertSheet(nom);
  }
  return sh;
}

// Les pestanyes amb el format antic (capçalera "Rebut" a A1) es passen al format nou conservant els entrenos.
function migra(sh) {
  if (sh.getLastRow() === 0 || sh.getRange(1, 1).getDisplayValue() !== 'Rebut') return;
  var last = sh.getLastRow(), rows = [];
  if (last > 1) {
    var rg = sh.getRange(2, 1, last - 1, 8), vals = rg.getValues(), disp = rg.getDisplayValues();
    for (var i = 0; i < vals.length; i++) {
      if (!disp[i].slice(0, 8).join('')) continue;
      rows.push([disp[i][2], disp[i][3], vals[i][4], vals[i][5], vals[i][6], vals[i][7]]);
    }
  }
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart();
  sh.clear();
  sh.setFrozenRows(0);
  escriuRegistre(sh, rows);
}

function capcalera(sh, client) {
  if (sh.getMaxColumns() < RCOL + COLS.length) sh.insertColumnsAfter(sh.getMaxColumns(), RCOL + COLS.length - sh.getMaxColumns());
  sh.getRange(1, 1).setValue(client).setFontSize(16).setFontWeight('bold').setFontColor(BLAU);
  sh.getRange(1, RCOL).setValue('Actualitzat ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'))
    .setFontColor('#777777').setFontSize(9);
  sh.getRange(2, 1).setValue('🏁 Tests i mesures').setFontWeight('bold').setFontColor(VERD);
  sh.getRange(2, RCOL).setValue("🏋️ Registre d'entrenos").setFontWeight('bold').setFontColor(BLAU);
  sh.setColumnWidth(1, 190);
  for (var c = 2; c <= TW; c++) sh.setColumnWidth(c, 80);
  sh.setColumnWidth(TW + 1, 24);
  [95, 190, 210, 55, 65, 65].forEach(function (w, i) { sh.setColumnWidth(RCOL + i, w); });
}

// ---------- Registre d'entrenos (H3 cap avall) ----------

function llegeixRegistre(sh) {
  var last = sh.getLastRow(), rows = [];
  if (last <= TOP) return rows;
  var rg = sh.getRange(TOP + 1, RCOL, last - TOP, COLS.length), vals = rg.getValues(), disp = rg.getDisplayValues();
  for (var i = 0; i < vals.length; i++) {
    if (!disp[i].join('')) continue;
    vals[i][0] = disp[i][0];
    rows.push(vals[i]);
  }
  return rows;
}

function escriuEntreno(sh, d) {
  var rows = llegeixRegistre(sh).filter(function (r) { return !(r[0] === d.date && r[1] === d.day); });
  (d.ex || []).forEach(function (x) {
    (x.s || []).forEach(function (r, si) {
      if (r && (r[0] || r[1])) rows.push([d.date, d.day, x.n, si + 1, num(r[0]), num(r[1])]);
    });
  });
  rows.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
  escriuRegistre(sh, rows);
}

function escriuRegistre(sh, rows) {
  var w = COLS.length;
  if (sh.getMaxColumns() < RCOL + w) sh.insertColumnsAfter(sh.getMaxColumns(), RCOL + w - sh.getMaxColumns());
  if (sh.getMaxRows() < TOP + rows.length + 1) sh.insertRowsAfter(sh.getMaxRows(), TOP + rows.length + 1 - sh.getMaxRows());
  sh.getRange(TOP, RCOL, sh.getMaxRows() - TOP + 1, w).clear();
  sh.getRange(TOP, RCOL, 1, w).setValues([COLS])
    .setBackground(BLAU).setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  if (rows.length) {
    var body = sh.getRange(TOP + 1, RCOL, rows.length, w);
    sh.getRange(TOP + 1, RCOL, rows.length, 1).setNumberFormat('@');
    body.setValues(rows).setVerticalAlignment('middle');
    sh.getRange(TOP + 1, RCOL + 3, rows.length, 3).setHorizontalAlignment('center');
    // Cada sessió (data + dia) d'un color, alternant blanc i blau clar.
    var bg = [], color = '#ffffff', prev = null;
    rows.forEach(function (r) {
      var k = r[0] + '|' + r[1];
      if (prev !== null && k !== prev) color = color === '#ffffff' ? BLAU_CLAR : '#ffffff';
      prev = k;
      var fila = []; for (var j = 0; j < w; j++) fila.push(color);
      bg.push(fila);
    });
    body.setBackgrounds(bg);
  }
  sh.getRange(TOP, RCOL, rows.length + 1, w).setBorder(true, true, true, true, true, true, VORA, SpreadsheetApp.BorderStyle.SOLID);
  sh.setFrozenRows(TOP);
}

// ---------- Tests i mesures (A3 cap avall) ----------

function escriuTests(sh, tables) {
  var alt = TOP;
  tables.forEach(function (t) { alt += (t.rows || []).length + 2; });
  if (sh.getMaxRows() < alt) sh.insertRowsAfter(sh.getMaxRows(), alt - sh.getMaxRows());
  var zona = sh.getRange(TOP, 1, sh.getMaxRows() - TOP + 1, TW);
  zona.breakApart();
  zona.clear();
  var row = TOP;
  tables.forEach(function (t) {
    var rows = (t.rows || []).map(function (r) { return r.slice(0, TW); });
    if (!rows.length) return;
    var w = 1; rows.forEach(function (r) { w = Math.max(w, r.length); });
    rows = rows.map(function (r, i) {
      var a = r.map(function (v, j) { return i && j ? num(v) : v; });
      while (a.length < w) a.push('');
      return a;
    });
    // Títol de la taula
    sh.getRange(row, 1).setValue(t.title);
    var tit = sh.getRange(row, 1, 1, w);
    if (w > 1) tit.merge();
    tit.setBackground(VERD).setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('left');
    // Capçalera (setmanes) i files
    var taula = sh.getRange(row + 1, 1, rows.length, w);
    taula.setValues(rows).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sh.getRange(row + 1, 1, 1, w).setBackground(VERD_CLAR).setFontWeight('bold');
    if (rows.length > 1) {
      sh.getRange(row + 2, 1, rows.length - 1, 1).setBackground(GRIS).setFontWeight('bold').setHorizontalAlignment('left');
    }
    sh.getRange(row, 1, rows.length + 1, w).setBorder(true, true, true, true, true, true, VORA, SpreadsheetApp.BorderStyle.SOLID);
    row += rows.length + 2;
  });
}

function nomesDe(sh, client) {
  var last = sh.getLastRow();
  if (last < 2) return true;
  var v = sh.getRange(2, 2, last - 1, 1).getDisplayValues();
  for (var i = 0; i < v.length; i++) if (v[i][0] && v[i][0] !== client) return false;
  return true;
}

// Només converteix a número el que és un número sencer ("68,5" → 68.5); "8 · nivell 3" queda com a text.
function num(v) {
  var s = String(v == null ? '' : v).trim();
  return /^-?\d+([.,]\d+)?$/.test(s) ? parseFloat(s.replace(',', '.')) : v;
}

// ---------- Qüestionari inicial (pestanya "Qüestionaris") ----------

function escriuQuestionari(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Qüestionaris') || ss.insertSheet('Qüestionaris', 0);
  var ans = d.answers || [];
  var head = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0] : [];
  if (!head.length || head[0] !== 'Rebut') head = ['Rebut'];
  // Si hi ha preguntes noves, s'afegeixen com a columnes al final.
  ans.forEach(function (a) { if (head.indexOf(a[0]) < 0) head.push(a[0]); });
  if (sh.getMaxColumns() < head.length) sh.insertColumnsAfter(sh.getMaxColumns(), head.length - sh.getMaxColumns());
  sh.getRange(1, 1, 1, head.length).setValues([head])
    .setBackground(VERD).setFontColor('#ffffff').setFontWeight('bold').setVerticalAlignment('middle').setWrap(true);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);
  var fila = head.map(function () { return ''; });
  var ara = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  fila[0] = ara;
  ans.forEach(function (a) { fila[head.indexOf(a[0])] = a[0] === 'Contacte' ? a[1] : num(a[1]); });
  var r = sh.getLastRow() + 1;
  sh.getRange(r, 1, 1, head.length).setValues([fila]).setVerticalAlignment('top').setWrap(true)
    .setBackground(r % 2 ? '#ffffff' : VERD_CLAR);
  sh.getRange(1, 1, r, head.length).setBorder(true, true, true, true, true, true, VORA, SpreadsheetApp.BorderStyle.SOLID);
  sh.setColumnWidth(1, 110);
  for (var c = 2; c <= head.length; c++) sh.setColumnWidth(c, 150);

  // Correu al propietari del full amb el resum (si falla, la fila ja està guardada).
  try {
    var nom = String(d.client || 'Sense nom');
    var cos = ans.filter(function (a) { return a[1] !== ''; }).map(function (a) { return a[0] + ': ' + a[1]; }).join('\n');
    var html = '<h2 style="color:' + VERD + '">Qüestionari de ' + esc(nom) + '</h2><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' +
      ans.filter(function (a) { return a[1] !== ''; }).map(function (a) {
        return '<tr><td style="padding:6px 10px;border:1px solid ' + VORA + ';background:' + GRIS + ';font-weight:bold">' + esc(a[0]) +
          '</td><td style="padding:6px 10px;border:1px solid ' + VORA + '">' + esc(a[1]) + '</td></tr>';
      }).join('') + '</table><p><a href="' + ss.getUrl() + '">Obrir el full</a></p>';
    MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), subject: '🏁 Qüestionari nou: ' + nom, body: cos, htmlBody: html });
  } catch (err) {}
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}
