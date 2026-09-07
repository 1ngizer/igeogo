'use strict';

const crypto = require('crypto');

/**
 * Genera un código de canje corto y legible para un cupón.
 * Formato: IGG-XXXXXX (sin caracteres ambiguos).
 */
function generateRedemptionCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `IGG-${code}`;
}

module.exports = { generateRedemptionCode };
