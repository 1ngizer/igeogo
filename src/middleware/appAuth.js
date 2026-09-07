'use strict';

const { verify } = require('../utils/token');

/**
 * Autenticación de la app móvil: espera un header
 *   Authorization: Bearer <token>
 * Si es válido, deja req.waId disponible.
 */
function appAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const data = verify(token);
  if (!data) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  req.waId = data.waId;
  return next();
}

module.exports = appAuth;
