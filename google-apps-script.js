// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// ============================================
// Propósito: Recibir registros del formulario web
// y guardarlos en Google Sheets automáticamente
// ============================================

var SHEET_NAME = 'Registros TAD';

// Estructura fija de columnas (A:R). No depende de cómo esté la hoja hoy.
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
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    var payload = parsePayload(e);

    if (!payload || Object.keys(payload).length === 0) {
      return buildResponse('error', 'No se recibieron datos del formulario');
    }

    ensureHeaders(sheet);

    var canonical = buildCanonicalRecord(payload);
    var rowData = buildRowFromCanonical(canonical);

    // Siempre insertamos exactamente 18 columnas, alineadas a DEFAULT_HEADERS.
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
        // Si no se puede parsear JSON, se conserva lo previo.
      }
    } else {
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
  var normalized = normalizePayloadKeys(payload);

  return {
    fechaHora: new Date(),
    nombre: getValue(payload, normalized, ['nombre']),
    apellido: getValue(payload, normalized, ['apellido']),
    cedula: getValue(payload, normalized, ['cedula']),
    telefono: getValue(payload, normalized, ['telefono', 'tel']),
    correo: getValue(payload, normalized, ['correoConductor', 'correo_conductor', 'correo', 'email', 'e-mail']),
    marca: getValue(payload, normalized, ['marca']),
    modelo: getValue(payload, normalized, ['modelo']),
    ano: getValue(payload, normalized, ['ano', 'año']),
    placa: getValue(payload, normalized, ['placa']),
    plataformas: getValue(payload, normalized, ['plataformas', 'plataforma']),
    horasDia: getValue(payload, normalized, ['horasDiarias', 'horas_diarias', 'horas_por_dia', 'horas por dia']),
    diasSemana: getValue(payload, normalized, ['diasSemana', 'dias_semana', 'dias_por_semana', 'dias por semana']),
    ciudad: getValue(payload, normalized, ['ciudad']),
    horario: getValue(payload, normalized, ['horario']),
    tieneTablet: getValue(payload, normalized, ['tieneTablet', 'tiene_tablet', 'tiene tablet']),
    experienciaVentas: getValue(payload, normalized, ['experienciaVentas', 'experiencia_ventas', 'experiencia en ventas']),
    aplicacion: getValue(payload, normalized, ['aplicacion', 'aplicación'], 'Web')
  };
}

// Orden fijo y 100% sincronizado con DEFAULT_HEADERS.
function buildRowFromCanonical(record) {
  return [
    record.fechaHora,
    record.nombre,
    record.apellido,
    record.cedula,
    record.telefono,
    record.correo,
    record.marca,
    record.modelo,
    record.ano,
    record.placa,
    record.plataformas,
    record.horasDia,
    record.diasSemana,
    record.ciudad,
    record.horario,
    record.tieneTablet,
    record.experienciaVentas,
    record.aplicacion
  ];
}

function ensureHeaders(sheet) {
  ensureSheetHasAtLeastColumns(sheet, DEFAULT_HEADERS.length);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
    return;
  }

  var current = sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).getValues()[0];
  var allEmpty = current.every(function(cell) {
    return String(cell || '').trim() === '';
  });

  if (allEmpty) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
    return;
  }

  // Estandariza encabezados a la estructura oficial sin mover datos.
  // Si antes decía "Fecha" o "Correo del conductor", aquí queda unificado.
  var normalizedCurrent = current.map(function(h) { return normalizeKeyName(h); });
  var normalizedDefault = DEFAULT_HEADERS.map(function(h) { return normalizeKeyName(h); });
  var isSame = normalizedDefault.every(function(key, idx) {
    return normalizedCurrent[idx] === key;
  });

  if (!isSame) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight('bold');
  }
}

function ensureSheetHasAtLeastColumns(sheet, requiredColumns) {
  var missing = requiredColumns - sheet.getMaxColumns();
  if (missing > 0) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), missing);
  }
}

function buildResponse(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función opcional: Enviar email de notificación cuando hay nuevo registro
function enviarEmailNotificacion(canonicalData) {
  try {
    var data = canonicalData || {};
    var emailTo = 'tad.taxiadvertising@gmail.com';
    var subject = '🚗 Nuevo Registro TAD - ' + (data.nombre || '') + ' ' + (data.apellido || '');
    var body =
      'NUEVO CONDUCTOR REGISTRADO\n\n' +
      'Fecha: ' + new Date().toLocaleString() + '\n\n' +
      'DATOS PERSONALES:\n' +
      'Nombre: ' + (data.nombre || '') + ' ' + (data.apellido || '') + '\n' +
      'Cédula: ' + (data.cedula || '') + '\n' +
      'Teléfono: ' + (data.telefono || '') + '\n' +
      'Correo: ' + (data.correo || '') + '\n\n' +
      'DATOS DEL VEHÍCULO:\n' +
      'Marca: ' + (data.marca || '') + '\n' +
      'Modelo: ' + (data.modelo || '') + '\n' +
      'Año: ' + (data.ano || '') + '\n' +
      'Placa: ' + (data.placa || '') + '\n' +
      'Aplicación: ' + (data.aplicacion || 'Web') + '\n\n' +
      '---\n' +
      'TAD Dominicana - Sistema de Registro Automático';

    MailApp.sendEmail(emailTo, subject, body);
  } catch (error) {
    Logger.log('Error enviando email: ' + error.toString());
  }
}
