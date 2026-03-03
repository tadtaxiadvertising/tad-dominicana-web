// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// ============================================
// Propósito: Recibir registros del formulario web
// y guardarlos en Google Sheets automáticamente
// ============================================

var HEADERS = [
  'Fecha',
  'Nombre',
  'Apellido',
  'Cédula',
  'Teléfono',
  'Correo del conductor',
  'Marca',
  'Modelo',
  'Año',
  'Placa',
  'Plataformas',
  'Horas por día',
  'Días por semana',
  'Ciudad',
  'Horario',
  '¿Tiene tablet?',
  'Experiencia en ventas',
  'Aplicación'
];

var LEGACY_HEADERS_WITHOUT_EMAIL = [
  'Fecha',
  'Nombre',
  'Apellido',
  'Cédula',
  'Teléfono',
  'Marca',
  'Modelo',
  'Año',
  'Placa',
  'Plataformas',
  'Horas por día',
  'Días por semana',
  'Ciudad',
  'Horario',
  '¿Tiene tablet?',
  'Experiencia en ventas',
  'Aplicación'
];

/**
 * Soporta payloads enviados como:
 * - query params / x-www-form-urlencoded (e.parameter)
 * - JSON en body (e.postData.contents)
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registros TAD') || ss.getActiveSheet();
    var payload = parsePayload(e);

    if (!payload || Object.keys(payload).length === 0) {
      return buildResponse('error', 'No se recibieron datos del formulario');
    }

    ensureHeaders(sheet);

    var normalizedPayload = normalizePayloadKeys(payload);

    // Mapeo tolerante a variaciones de nombres de campos.
    var rowData = [
      new Date(),
      getValue(payload, normalizedPayload, ['nombre']),
      getValue(payload, normalizedPayload, ['apellido']),
      getValue(payload, normalizedPayload, ['cedula']),
      getValue(payload, normalizedPayload, ['telefono', 'tel']),
      getValue(payload, normalizedPayload, ['correoConductor', 'correo_conductor', 'correo', 'email', 'e-mail']),
      getValue(payload, normalizedPayload, ['marca']),
      getValue(payload, normalizedPayload, ['modelo']),
      getValue(payload, normalizedPayload, ['ano', 'año']),
      getValue(payload, normalizedPayload, ['placa']),
      getValue(payload, normalizedPayload, ['plataformas', 'plataforma']),
      getValue(payload, normalizedPayload, ['horasDiarias', 'horas_diarias', 'horas_por_dia', 'horas por dia']),
      getValue(payload, normalizedPayload, ['diasSemana', 'dias_semana', 'dias_por_semana', 'dias por semana']),
      getValue(payload, normalizedPayload, ['ciudad']),
      getValue(payload, normalizedPayload, ['horario']),
      getValue(payload, normalizedPayload, ['tieneTablet', 'tiene_tablet', 'tiene tablet']),
      getValue(payload, normalizedPayload, ['experienciaVentas', 'experiencia_ventas', 'experiencia en ventas']),
      getValue(payload, normalizedPayload, ['aplicacion', 'aplicación'], 'Web')
    ];

    sheet.appendRow(rowData);

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

  if (e.parameters) {
    for (var key in e.parameters) {
      if (e.parameters.hasOwnProperty(key) && e.parameters[key] && e.parameters[key].length) {
        merged[key] = e.parameters[key][0];
      }
    }
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
    } else {
      // Fallback para casos no-cors/text/plain que llegan como querystring en el body.
      merged = Object.assign(merged, parseFormEncoded(raw));
    }
  }

  return merged;
}

function parseFormEncoded(raw) {
  var out = {};
  if (!raw) return out;

  var parts = String(raw).split('&');
  for (var i = 0; i < parts.length; i++) {
    var piece = parts[i];
    if (!piece) continue;

    var kv = piece.split('=');
    var key = decodeURIComponent((kv[0] || '').replace(/\+/g, ' '));
    var value = decodeURIComponent((kv.slice(1).join('=') || '').replace(/\+/g, ' '));

    if (key) out[key] = value;
  }

  return out;
}

function normalizeKeyName(key) {
  return String(key || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizePayloadKeys(source) {
  var out = {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      out[normalizeKeyName(key)] = normalizeIncomingValue(source[key]);
    }
  }

  return out;
}

function getValue(source, normalizedSource, keys, defaultValue) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var normalizedKey = normalizeKeyName(key);

    var direct = normalizeIncomingValue(source[key]);
    var normalized = normalizedSource[normalizedKey];
    var value = direct !== undefined ? direct : normalized;

    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return defaultValue !== undefined ? defaultValue : '';
}

function normalizeIncomingValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    return;
  }

  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var firstRow = sheet.getRange(1, 1, 1, width).getValues()[0];
  var cleanCurrent = firstRow.map(function(cell) {
    return String(cell || '').trim();
  });

  var matchesCurrentSchema = headersMatch(cleanCurrent, HEADERS);
  if (matchesCurrentSchema) {
    return;
  }

  var matchesLegacySchema = headersMatch(cleanCurrent, LEGACY_HEADERS_WITHOUT_EMAIL);
  if (matchesLegacySchema) {
    // Inserta nueva columna de correo en la posición correcta (columna 6),
    // moviendo datos existentes para no desalinear registros históricos.
    sheet.insertColumnBefore(6);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    return;
  }

  var hasDataAfterHeader = sheet.getLastRow() > 1;
  if (!hasDataAfterHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    return;
  }

  // No forzamos sobreescritura con datos existentes y encabezados no reconocidos.
  // Solo registramos para revisión manual y evitamos dañar el mapeo histórico.
  Logger.log('Encabezados no reconocidos en la hoja. Revisar manualmente primera fila: ' + JSON.stringify(cleanCurrent));
}

function headersMatch(currentRow, expectedRow) {
  for (var i = 0; i < expectedRow.length; i++) {
    if (String(currentRow[i] || '').trim() !== expectedRow[i]) {
      return false;
    }
  }

  return true;
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
      'Teléfono: ' + (data.telefono || '') + '\n' +
      'Correo: ' + (data.correoConductor || data.correo_conductor || data.correo || data.email || '') + '\n\n' +
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
