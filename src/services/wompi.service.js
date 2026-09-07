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
  if (!secret || !event || !event.signature) return false;
  try {
    const props = event.signature.properties || [];
    let concat = '';
    for (const path of props) {
      const val = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), event.data);
      concat += val == null ? '' : String(val);
    }
    concat += String(event.timestamp) + secret;
    const digest = crypto.createHash('sha256').update(concat).digest('hex');
    return digest.toLowerCase() === String(event.signature.checksum).toLowerCase();
  } catch (err) {
    logger.error('verifyEvent:', err.message);
    return false;
  }
}

module.exports = { createPaymentLink, verifyEvent, IS_PROD };
