// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// ============================================
// Propósito: Recibir registros del formulario web
// y guardarlos en Google Sheets automáticamente
// ============================================

/**
 * Soporta payloads enviados como:
 * - query params / x-www-form-urlencoded (e.parameter)
 * - JSON en body (e.postData.contents)
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = parsePayload(e);

    if (!payload || Object.keys(payload).length === 0) {
      return buildResponse('error', 'No se recibieron datos del formulario');
    }

    // Mapeo tolerante a variaciones de nombres de campos.
    var rowData = [
      new Date(),                                       // A: Fecha
      getValue(payload, ['nombre']),                    // B: Nombre
      getValue(payload, ['apellido']),                  // C: Apellido
      getValue(payload, ['cedula']),                    // D: Cédula
      getValue(payload, ['telefono', 'tel']),           // E: Teléfono
      getValue(payload, ['marca']),                     // F: Marca
      getValue(payload, ['modelo']),                    // G: Modelo
      getValue(payload, ['ano', 'año']),                // H: Año
      getValue(payload, ['placa']),                     // I: Placa
      getValue(payload, ['plataformas', 'plataforma']), // J: Plataformas
      getValue(payload, ['horasDiarias']),              // K: Horas por día
      getValue(payload, ['diasSemana']),                // L: Días por semana
      getValue(payload, ['ciudad']),                    // M: Ciudad
      getValue(payload, ['horario']),                   // N: Horario
      getValue(payload, ['tieneTablet']),               // O: ¿Tiene tablet?
      getValue(payload, ['experienciaVentas']),         // P: Experiencia en ventas
      getValue(payload, ['aplicacion'], 'Web')          // Q: Aplicación
    ];

    sheet.appendRow(rowData);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setFontWeight('bold');

    return buildResponse('success', 'Registro guardado exitosamente');
  } catch (error) {
    return buildResponse('error', 'Error interno: ' + error.message);
  }
}

function doGet(e) {
  return doPost(e);
}

function parsePayload(e) {
  if (!e) return {};

  var merged = {};

  if (e.parameter) {
    merged = Object.assign(merged, e.parameter);
  }

  if (e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    var contentType = (e.postData.type || '').toLowerCase();

    if (contentType.indexOf('application/json') > -1) {
      try {
        var json = JSON.parse(raw);
        if (json && typeof json === 'object') {
          merged = Object.assign(merged, json);
        }
      } catch (_) {
        // Si no se puede parsear JSON, se mantiene e.parameter.
      }
    }
  }

  return merged;
}

function getValue(source, keys, defaultValue) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== '') {
      return source[key];
    }
  }

  return defaultValue !== undefined ? defaultValue : '';
}

function buildResponse(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función opcional: Enviar email de notificación cuando hay nuevo registro
function enviarEmailNotificacion(data) {
  try {
    var emailTo = 'tad.taxiadvertising@gmail.com';
    var subject = '🚗 Nuevo Registro TAD - ' + (data.nombre || '') + ' ' + (data.apellido || '');
    var body =
      'NUEVO CONDUCTOR REGISTRADO\n\n' +
      'Fecha: ' + new Date().toLocaleString() + '\n\n' +
      'DATOS PERSONALES:\n' +
      'Nombre: ' + (data.nombre || '') + ' ' + (data.apellido || '') + '\n' +
      'Cédula: ' + (data.cedula || '') + '\n' +
      'Teléfono: ' + (data.telefono || '') + '\n\n' +
      'DATOS DEL VEHÍCULO:\n' +
      'Marca: ' + (data.marca || '') + '\n' +
      'Modelo: ' + (data.modelo || '') + '\n' +
      'Año: ' + (data.ano || data['año'] || '') + '\n' +
      'Placa: ' + (data.placa || '') + '\n' +
      'Aplicación: ' + (data.aplicacion || 'Web') + '\n\n' +
      '---\n' +
      'TAD Dominicana - Sistema de Registro Automático';

    MailApp.sendEmail(emailTo, subject, body);
  } catch (error) {
    Logger.log('Error enviando email: ' + error.toString());
  }
}
