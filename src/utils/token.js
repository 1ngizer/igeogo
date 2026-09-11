'use strict';

const crypto = require('crypto');
const config = require('../config');

// Secreto para firmar los tokens de sesión de la app.
// Es importante definir APP_SECRET en producción para no depender de claves por defecto.
const SECRET = config.jwtSecret;

/** Firma un token de sesión para un usuario (waId). Válido `days` días. */
function sign(waId, days = 30) {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ waId, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

/** Verifica un token; devuelve { waId } o null si es inválido/expirado. */
function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const good = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  
  try {
    const sigBuf = Buffer.from(sig);
    const goodBuf = Buffer.from(good);
    if (sigBuf.length !== goodBuf.length || !crypto.timingSafeEqual(sigBuf, goodBuf)) {
      return null;
    }
  } catch (e) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch (e) {
    return null;
  }
}

module.exports = { sign, verify };
