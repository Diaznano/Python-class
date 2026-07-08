/**
 * Historial de Quiz — Programación I
 *
 * CÓMO USAR:
 * 1. Creá una Google Sheet nueva (o abrí una existente para esto).
 * 2. Extensiones > Apps Script.
 * 3. Borrá el contenido de Code.gs que viene por defecto y pegá este archivo completo.
 * 4. Implementar > Nueva implementación.
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Autorizá los permisos que pida (son de tu propia cuenta).
 * 6. Copiá la URL que termina en /exec.
 * 7. Pegala en python-clase-completo.html, en la constante QUIZ_WEBHOOK_URL.
 * 8. Probá visitando esa URL /exec en el navegador: debería responder
 *    "El webhook de historial está funcionando".
 *
 * Cada vez que alguien termina un quiz en la página, se manda un POST acá
 * y esta función agrega una fila a la hoja "Historial" (la crea si no existe).
 */

function doPost(e) {
  var sheet = getSheet_();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(data.ts),
    data.trimSel === 'all' ? 'Los 3 trimestres' : 'Trimestre ' + data.trimSel,
    data.score,
    data.total,
    data.pct,
    data.bestStreak
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('El webhook de historial está funcionando ✅');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Historial');
  if (!sheet) {
    sheet = ss.insertSheet('Historial');
    sheet.appendRow(['Fecha/hora', 'Trimestre', 'Puntaje', 'Total', '%', 'Mejor racha']);
  }
  return sheet;
}
