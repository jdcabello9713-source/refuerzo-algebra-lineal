// Google Apps Script para recibir los datos de la web y servirlos al panel interno.
// Instalación: ver LEEME.md. Cambia la clave antes de implementar.
const CLAVE = 'cambia-esta-clave';
const HOJA = 'datos';
const COLS = ['ts_servidor', 'ts', 'pid', 'semestre', 'forma_pre', 'evento', 'seccion', 'item', 'habilidad',
  'respuesta', 'correcta', 'error', 'texto', 'ms', 'extra', 'version'];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) { sh = ss.insertSheet(HOJA); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const filas = (Array.isArray(d) ? d : [d]).map(function (r) {
      return COLS.map(function (c) {
        if (c === 'ts_servidor') return new Date();
        const v = r[c] === undefined || r[c] === null ? '' : r[c];
        // Evita que un texto del estudiante se interprete como fórmula.
        return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v;
      });
    });
    const sh = hoja_();
    sh.getRange(sh.getLastRow() + 1, 1, filas.length, COLS.length).setValues(filas);
  } finally { lock.releaseLock(); }
  return ContentService.createTextOutput('ok');
}

function doGet(e) {
  const out = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  if (!e.parameter.clave || e.parameter.clave !== CLAVE) return out({ error: 'clave incorrecta' });
  const v = hoja_().getDataRange().getValues();
  const cab = v.shift();
  return out({ filas: v.map(function (f) { const o = {}; cab.forEach(function (c, i) { o[c] = f[i]; }); return o; }) });
}
