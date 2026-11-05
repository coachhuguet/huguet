/**
 * Coach Huguet · Registre d'entrenos
 * Rep les sessions que envien les pàgines dels clients i les guarda al full,
 * cada client a la seva pestanya: "Registre Jowni", "Registre Pau"...
 * Si la pestanya no existeix, es crea sola la primera vegada que el client envia un entreno.
 * Cada sessió (data + dia) es reescriu sencera, així si el client corregeix una dada no es duplica.
 * Els tests i les mesures de la pestanya Progrés van a la mateixa pestanya, a la cantonada (a partir de la columna J).
 */
var COLS = ['Rebut', 'Client', 'Data', 'Sessió', 'Exercici', 'Sèrie', 'Kg', 'Reps'];
var TCOL = 10; // Els tests i les mesures van a la cantonada, a partir de la columna J (la I queda buida).

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = full(d.client);
    if (d.type === 'tests') escriuTests(sh, d.tables || []);
    else escriuEntreno(sh, d);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

// Registre d'entrenos (columnes A-H). Es reescriu el bloc sencer en comptes d'esborrar files, així no es mou la cantonada dels tests.
function escriuEntreno(sh, d) {
  var keep = [], last = sh.getLastRow();
  if (last > 1) {
    var rg = sh.getRange(2, 1, last - 1, COLS.length), vals = rg.getValues(), disp = rg.getDisplayValues();
    for (var i = 0; i < vals.length; i++) {
      if (!disp[i].join('')) continue;
      if (disp[i][1] === d.client && disp[i][2] === d.date && disp[i][3] === d.day) continue;
      vals[i][2] = disp[i][2];
      keep.push(vals[i]);
    }
    rg.clearContent();
  }
  var now = new Date();
  (d.ex || []).forEach(function (x) {
    (x.s || []).forEach(function (r, si) {
      if (r && (r[0] || r[1])) keep.push([now, d.client, d.date, d.day, x.n, si + 1, num(r[0]), num(r[1])]);
    });
  });
  if (keep.length) {
    sh.getRange(2, 3, keep.length, 1).setNumberFormat('@');
    sh.getRange(2, 1, keep.length, COLS.length).setValues(keep);
  }
}

// Tests i mesures de la pestanya Progrés: cada taula amb el seu títol, una sota l'altra.
function escriuTests(sh, tables) {
  var w = 2;
  tables.forEach(function (t) { (t.rows || []).forEach(function (r) { w = Math.max(w, r.length); }); });
  if (sh.getMaxColumns() < TCOL + w) sh.insertColumnsAfter(sh.getMaxColumns(), TCOL + w - sh.getMaxColumns());
  sh.getRange(1, TCOL, sh.getMaxRows(), sh.getMaxColumns() - TCOL + 1).clear();
  var out = [], bold = [];
  function fila(r) { var a = r.slice(); while (a.length < w) a.push(''); out.push(a); }
  bold.push(1); fila(['🏁 Tests i mesures', 'Actualitzat ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')]);
  tables.forEach(function (t) {
    fila([]);
    bold.push(out.length + 1); fila([t.title]);
    (t.rows || []).forEach(function (r, i) {
      if (i === 0) bold.push(out.length + 1);
      fila(r.map(function (v, j) { return i && j ? num(v) : v; }));
    });
  });
  if (sh.getMaxRows() < out.length) sh.insertRowsAfter(sh.getMaxRows(), out.length - sh.getMaxRows());
  sh.getRange(1, TCOL, out.length, w).setValues(out);
  bold.forEach(function (r) { sh.getRange(r, TCOL, 1, w).setFontWeight('bold'); });
  sh.setColumnWidth(TCOL, 190);
}

function doGet() {
  return ContentService.createTextOutput('Registre Coach Huguet actiu');
}

// Pestanya del client: "Registre <Nom>". Si no hi és, es crea amb la capçalera.
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
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  }
  return sh;
}

function nomesDe(sh, client) {
  var last = sh.getLastRow();
  if (last < 2) return true;
  var v = sh.getRange(2, 2, last - 1, 1).getDisplayValues();
  for (var i = 0; i < v.length; i++) if (v[i][0] && v[i][0] !== client) return false;
  return true;
}

function num(v) {
  var n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? v : n;
}
