function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si e o e.parameter no existen, lanzamos error controlado
    if (!e || !e.parameter) {
      return ContentService.createTextOutput("Error: No se recibieron parámetros").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var rowData = [
      new Date(),                              // Fecha - A
      e.parameter.nombre || "",                // Nombre - B
      e.parameter.apellido || "",              // Apellido - C
      e.parameter.cedula || "",                // Cédula - D
      e.parameter.telefono || "",              // Teléfono - E
      e.parameter.marca || "",                 // Marca - F
      e.parameter.modelo || "",                // Modelo - G
      e.parameter.ano || "",                   // Año - H
      e.parameter.placa || "",                 // Placa - I
      e.parameter.plataformas || "",           // Plataformas - J
      e.parameter.horasDiarias || "",          // Horas por día - K
      e.parameter.diasSemana || "",            // Días por semana - L
      e.parameter.ciudad || "",                // Ciudad - M
      e.parameter.horario || "",               // Horario - N
      e.parameter.tieneTablet || "",           // ¿Tiene tablet? - O
      e.parameter.experienciaVentas || "",     // Experiencia en ventas - P
      e.parameter.aplicacion || "Web"          // Aplicación - Q
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput("Éxito").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error interno: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return doPost(e);
}
