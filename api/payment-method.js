import crypto from 'crypto';

const ACCOUNT_NUMBER_REGEX = /^\d{8,20}$/;
const IDENTIFICATION_REGEX = /^\d{11,13}$/;
const PHONE_REGEX = /^\d{10,12}$/;

const encryptIfPresent = (value, secret) => {
  if (!value) return '';
  const key = crypto.createHash('sha256').update(secret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]).toString('base64');
  return `${iv.toString('base64')}:${encrypted}`;
};

const validateBody = (body) => {
  const errors = {};

  if (!body?.method) errors.method = 'Método de pago obligatorio.';

  if (['bank_deposit', 'bank_transfer'].includes(body.method)) {
    if (!body.bankName?.trim()) errors.bankName = 'Banco obligatorio.';
    if (!body.accountType) errors.accountType = 'Tipo de cuenta obligatorio.';
    if (!ACCOUNT_NUMBER_REGEX.test(body.accountNumber || '')) errors.accountNumber = 'Cuenta inválida.';
    if (!body.accountHolder?.trim()) errors.accountHolder = 'Titular obligatorio.';
    if (!IDENTIFICATION_REGEX.test(body.identification || '')) errors.identification = 'Identificación inválida.';
    if (!PHONE_REGEX.test(body.contactPhone || '')) errors.contactPhone = 'Teléfono inválido.';
  }

  if (body.method === 'cash_pickup') {
    if (!body.pickupPoint?.trim()) errors.pickupPoint = 'Punto de retiro obligatorio.';
    if (!body.city?.trim()) errors.city = 'Ciudad obligatoria.';
    if (!body.acceptTerms) errors.acceptTerms = 'Aceptación de términos obligatoria.';
  }

  if (body.method === 'other' && !body.otherMethodDescription?.trim()) {
    errors.otherMethodDescription = 'Descripción obligatoria.';
  }

  return errors;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const driverId = req.headers['x-driver-id'];
  if (!driverId) {
    return res.status(401).json({ message: 'No autorizado. Solo el chofer puede editar su método de pago.' });
  }

  const errors = validateBody(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validación fallida', errors });
  }

  const encryptionKey = process.env.PAYMENT_DATA_KEY;
  if (!encryptionKey || encryptionKey.length < 16) {
    return res.status(500).json({ message: 'Configuración de seguridad incompleta en el servidor.' });
  }

  const payload = req.body;
  const secureData = {
    ...payload,
    accountNumber: encryptIfPresent(payload.accountNumber, encryptionKey),
    identification: encryptIfPresent(payload.identification, encryptionKey),
  };

  return res.status(200).json({
    message: 'Método de pago guardado correctamente.',
    driverId,
    method: payload.method,
    secured: Boolean(secureData.accountNumber || secureData.identification),
  });
}
