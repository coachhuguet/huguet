/**
 * Coach Huguet · Registre d'entrenos
 * Rep les sessions que envien les pàgines dels clients i les guarda al full,
 * cada client a la seva pestanya: "Registre Jowni", "Registre Pau"...
 * Si la pestanya no existeix, es crea sola la primera vegada que el client envia un entreno.
 * Cada sessió (data + dia) es reescriu sencera, així si el client corregeix una dada no es duplica.
 */
var COLS = ['Rebut', 'Client', 'Data', 'Sessió', 'Exercici', 'Sèrie', 'Kg', 'Reps'];

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = full(d.client);
    var last = sh.getLastRow();
    if (last > 1) {
      var rows = sh.getRange(2, 2, last - 1, 3).getDisplayValues();
      for (var i = rows.length - 1; i >= 0; i--) {
        if (rows[i][0] === d.client && rows[i][1] === d.date && rows[i][2] === d.day) sh.deleteRow(i + 2);
      }
    }
    var now = new Date(), out = [];
    (d.ex || []).forEach(function (x) {
      (x.s || []).forEach(function (r, si) {
        if (r && (r[0] || r[1])) out.push([now, d.client, d.date, d.day, x.n, si + 1, num(r[0]), num(r[1])]);
      });
    });
    if (out.length) {
      var start = sh.getLastRow() + 1;
      sh.getRange(start, 3, out.length, 1).setNumberFormat('@');
      sh.getRange(start, 1, out.length, COLS.length).setValues(out);
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
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
