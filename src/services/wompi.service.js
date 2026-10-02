'use strict';

const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');

const IS_PROD = (process.env.WOMPI_ENV || 'production') === 'production';
const API = IS_PROD ? 'https://production.wompi.co/v1' : 'https://sandbox.wompi.co/v1';
const CHECKOUT = 'https://checkout.wompi.co/l/';

/**
 * Crea un link de pago en Wompi por un monto (en pesos COP).
 * Devuelve { id, url }.
 */
async function createPaymentLink({ name, description, amountCop, redirectUrl }) {
  if (!process.env.WOMPI_PRIVATE_KEY) throw new Error('Wompi no configurado (falta WOMPI_PRIVATE_KEY)');
  const amountInCents = Math.round(Number(amountCop) * 100);
  const { data } = await axios.post(
    `${API}/payment_links`,
    {
      name: String(name).slice(0, 60),
      description: String(description || name).slice(0, 200),
      single_use: true,
      collect_shipping: false,
      currency: 'COP',
      amount_in_cents: amountInCents,
      redirect_url: redirectUrl,
    },
    { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`, 'Content-Type': 'application/json' } }
  );
  const id = data && data.data && data.data.id;
  if (!id) throw new Error('Wompi no devolvió el id del link');
  return { id, url: CHECKOUT + id };
}

/**
 * Valida el checksum de un evento (webhook) de Wompi.
 * checksum = SHA256( valores de signature.properties + timestamp + events_secret )
 */
function verifyEvent(event) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret || !event || !event.signature || !event.signature.checksum) return false;
  try {
    // Wompi reintenta entregas fallidas hasta ~24 h; una ventana corta perdería pagos legítimos.
    // La idempotencia (campaña ya 'pagada') y la validación de monto cubren el replay.
    if (event.timestamp) {
      const eventTime =
        typeof event.timestamp === 'number'
          ? event.timestamp > 1e11
            ? event.timestamp
            : event.timestamp * 1000
          : new Date(event.timestamp).getTime();
      if (!isNaN(eventTime) && Math.abs(Date.now() - eventTime) > 25 * 60 * 60 * 1000) {
        logger.warn('Evento de Wompi rechazado por timestamp desfasado:', event.timestamp);
        return false;
      }
    }

    const props = event.signature.properties || [];
    let concat = '';
    for (const path of props) {
      const val = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), event.data);
      concat += val == null ? '' : String(val);
    }
    concat += String(event.timestamp) + secret;
    const digest = crypto.createHash('sha256').update(concat).digest('hex').toLowerCase();
    const checksum = String(event.signature.checksum).toLowerCase();

    const bufDigest = Buffer.from(digest);
    const bufChecksum = Buffer.from(checksum);
    if (bufDigest.length !== bufChecksum.length) return false;
    return crypto.timingSafeEqual(bufDigest, bufChecksum);
  } catch (err) {
    logger.error('verifyEvent:', err.message);
    return false;
  }
}

module.exports = { createPaymentLink, verifyEvent, IS_PROD };
