function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parsear los datos del request
  var data = JSON.parse(e.postData.contents);
  
  // Agregar una nueva fila con los datos
  sheet.appendRow([
    new Date(),                    // Fecha
    data.nombre || '',             // Nombre
    data.apellido || '',           // Apellido
    data.cedula || '',             // Cédula
    data.telefono || '',           // Teléfono
    data.marca || '',              // Marca
    data.modelo || '',             // Modelo
    data.ano || '',                // Año
    data.placa || '',              // Placa
    data.aplicacion || 'Web'       // Aplicación (Web, WhatsApp, etc.)
  ]);
  
  // Retornar respuesta exitosa
  return ContentService
    .createTextOutput(JSON.stringify({result: 'success', message: 'Datos guardados'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'TAD Form Handler activo'}))
    .setMimeType(ContentService.MimeType.JSON);
}
