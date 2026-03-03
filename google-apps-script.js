// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// ============================================
// Propósito: Recibir registros del formulario web
// y guardarlos en Google Sheets automáticamente
// ============================================

// URL de tu Google Sheet (créalo primero)
// 1. Ve a https://sheets.google.com
// 2. Crea nueva hoja: "Registros TAD"
// 3. Crea columnas: Fecha, Nombre, Apellido, Cédula, Teléfono, Marca, Año, Placa, Aplicación
// 4. Extensiones > Apps Script
// 5. Pega este código
// 6. Implementar > Nueva implementación > Tipo: Aplicación web
// 7. Quién tiene acceso: Cualquiera
// 8. Copia la URL y pégala en app.jsx

function doPost(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Obtener datos del formulario
    var data = e.parameter;
    
    // Crear fila con los datos
    var fila = [
      new Date(),                    // Fecha
      data.nombre || '',             // Nombre
      data.apellido || '',           // Apellido
      data.cedula || '',             // Cédula
      data.telefono || '',           // Teléfono
      data.marca || '',              // Marca/Modelo
      data.ano || '',                // Año
      data.placa || '',              // Placa
      data.aplicacion || ''          // Aplicación
    ];
    
    // Agregar fila a la hoja
    sheet.appendRow(fila);
    
    // Formatear la nueva fila (negrita para la fecha)
    var ultimaFila = sheet.getLastRow();
    sheet.getRange(ultimaFila, 1).setFontWeight('bold');
    
    // Retornar éxito
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Registro guardado exitosamente'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retornar error
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función opcional: Enviar email de notificación cuando hay nuevo registro
function enviarEmailNotificacion(data) {
  try {
    var emailTo = "tad.taxiadvertising@gmail.com";
    var subject = "🚗 Nuevo Registro TAD - " + data.nombre + " " + data.apellido;
    var body = `
      NUEVO CONDUCTOR REGISTRADO
      
      Fecha: ${new Date().toLocaleString()}
      
      DATOS PERSONALES:
      Nombre: ${data.nombre} ${data.apellido}
      Cédula: ${data.cedula}
      Teléfono: ${data.telefono}
      
      DATOS DEL VEHÍCULO:
      Marca/Modelo: ${data.marca}
      Año: ${data.ano}
      Placa: ${data.placa}
      Aplicación: ${data.aplicacion}
      
      ---
      TAD Dominicana - Sistema de Registro Automático
    `;
    
    MailApp.sendEmail(emailTo, subject, body);
    
  } catch (error) {
    Logger.log("Error enviando email: " + error.toString());
  }
}
