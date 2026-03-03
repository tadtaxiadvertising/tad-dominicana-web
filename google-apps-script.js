// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// ============================================
// Propósito: Recibir registros del formulario web
// y guardarlos en Google Sheets automáticamente
// ============================================

var DEFAULT_HEADERS = [
  'Hora',
  'Nombre',
  'Apellido',
  'Cédula',
  'Teléfono',
  'Correo',
  'Marca',
  'Modelo',
  'Año',
  'Placa',
  'Plataformas',
  'Horas por dia',
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

    var canonicalRecord = buildCanonicalRecord(payload);
    var headers = getSheetHeaders(sheet);
    var rowData = buildRowByHeaders(headers, canonicalRecord);

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

function normalizeIncomingValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
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
      return String(value).trim();
    }
  }

  return defaultValue !== undefined ? defaultValue : '';
}

function buildCanonicalRecord(payload) {
  var normalizedPayload = normalizePayloadKeys(payload);

  return {
    fechaHora: new Date(),
    nombre: getValue(payload, normalizedPayload, ['nombre']),
    apellido: getValue(payload, normalizedPayload, ['apellido']),
    cedula: getValue(payload, normalizedPayload, ['cedula']),
    telefono: getValue(payload, normalizedPayload, ['telefono', 'tel']),
    correo: getValue(payload, normalizedPayload, ['correoConductor', 'correo_conductor', 'correo', 'email', 'e-mail']),
    marca: getValue(payload, normalizedPayload, ['marca']),
    modelo: getValue(payload, normalizedPayload, ['modelo']),
    ano: getValue(payload, normalizedPayload, ['ano', 'año']),
    placa: getValue(payload, normalizedPayload, ['placa']),
    plataformas: getValue(payload, normalizedPayload, ['plataformas', 'plataforma']),
    horasDia: getValue(payload, normalizedPayload, ['horasDiarias', 'horas_diarias', 'horas_por_dia', 'horas por dia']),
    diasSemana: getValue(payload, normalizedPayload, ['diasSemana', 'dias_semana', 'dias_por_semana', 'dias por semana']),
    ciudad: getValue(payload, normalizedPayload, ['ciudad']),
    horario: getValue(payload, normalizedPayload, ['horario']),
    tieneTablet: getValue(payload, normalizedPayload, ['tieneTablet', 'tiene_tablet', 'tiene tablet']),
    experienciaVentas: getValue(payload, normalizedPayload, ['experienciaVentas', 'experiencia_ventas', 'experiencia en ventas']),
    aplicacion: getValue(payload, normalizedPayload, ['aplicacion', 'aplicación'], 'Web')
  };
}

function buildRowByHeaders(headers, record) {
  var row = [];

  for (var i = 0; i < headers.length; i++) {
    var canonicalField = mapHeaderToCanonicalField(headers[i]);
    row.push(canonicalField ? (record[canonicalField] || '') : '');
  }

  return row;
}

function mapHeaderToCanonicalField(headerValue) {
  var key = normalizeKeyName(headerValue);

  if (!key) return '';
  if (key === 'hora' || key === 'fecha' || key === 'fechahora' || key === 'timestamp') return 'fechaHora';
  if (key === 'nombre') return 'nombre';
  if (key === 'apellido') return 'apellido';
  if (key === 'cedula') return 'cedula';
  if (key === 'telefono' || key === 'tel') return 'telefono';
  if (key === 'correo' || key === 'correodelconductor' || key === 'email' || key === 'mail') return 'correo';
  if (key === 'marca') return 'marca';
  if (key === 'modelo') return 'modelo';
  if (key === 'ano') return 'ano';
  if (key === 'placa') return 'placa';
  if (key === 'plataformas' || key === 'plataforma') return 'plataformas';
  if (key === 'horaspordia' || key === 'horasdia') return 'horasDia';
  if (key === 'diasporsemana' || key === 'diassemana') return 'diasSemana';
  if (key === 'ciudad') return 'ciudad';
  if (key === 'horario') return 'horario';
  if (key === 'tienetablet') return 'tieneTablet';
  if (key === 'experienciaenventas' || key === 'experienciaventas') return 'experienciaVentas';
  if (key === 'aplicacion') return 'aplicacion';

  return '';
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DEFAULT_HEADERS);
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
    return;
  }

  var headers = getSheetHeaders(sheet);

  // Si la primera fila está vacía, inicializamos encabezados.
  var hasHeaderText = headers.some(function(h) { return String(h || '').trim() !== ''; });
  if (!hasHeaderText) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
    return;
  }

  // Si no existe columna de correo, la insertamos después de Teléfono.
  var hasCorreoHeader = headers.some(function(h) {
    var key = normalizeKeyName(h);
    return key === 'correo' || key === 'correodelconductor' || key === 'email' || key === 'mail';
  });

  if (!hasCorreoHeader) {
    var telefonoIndex = -1;
    for (var i = 0; i < headers.length; i++) {
      var headerKey = normalizeKeyName(headers[i]);
      if (headerKey === 'telefono' || headerKey === 'tel') {
        telefonoIndex = i;
        break;
      }
    }

    if (telefonoIndex >= 0) {
      sheet.insertColumnAfter(telefonoIndex + 1);
      sheet.getRange(1, telefonoIndex + 2).setValue('Correo').setFontWeight('bold');
    } else {
      var newCol = headers.length + 1;
      sheet.getRange(1, newCol).setValue('Correo').setFontWeight('bold');
    }
  }
}

function getSheetHeaders(sheet) {
  var totalCols = Math.max(sheet.getLastColumn(), DEFAULT_HEADERS.length);
  return sheet.getRange(1, 1, 1, totalCols).getValues()[0];
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
