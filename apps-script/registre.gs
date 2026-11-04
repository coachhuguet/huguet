/**
 * Coach Huguet · Registre d'entrenos
 * Rep les sessions que envien les pàgines dels clients i les guarda a la pestanya "Registre".
 * Cada sessió (client + data + dia) es reescriu sencera, així si el client corregeix una dada no es duplica.
 */
var COLS = ['Rebut', 'Client', 'Data', 'Sessió', 'Exercici', 'Sèrie', 'Kg', 'Reps'];

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = full();
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

function full() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Registre') || ss.insertSheet('Registre');
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  }
  return sh;
}

function num(v) {
  var n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? v : n;
}
