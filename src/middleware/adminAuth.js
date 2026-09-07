'use strict';

const crypto = require('crypto');
const config = require('../config');

/**
 * Compara dos cadenas en tiempo constante para no filtrar información
 * por diferencias en el tiempo de respuesta (timing attack).
 */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  // timingSafeEqual exige buffers del mismo tamaño; si difieren, no coincide.
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Protección de los endpoints de administración mediante una API key
 * enviada en la cabecera `x-admin-key`. La comparación es en tiempo
 * constante y exige que la clave esté configurada en el entorno.
 */
function adminAuth(req, res, next) {
  const key = req.get('x-admin-key') || '';
  if (!config.adminApiKey || !safeEqual(key, config.adminApiKey)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  return next();
}

module.exports = adminAuth;
