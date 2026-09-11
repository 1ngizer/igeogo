'use strict';

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const redemptionController = require('../controllers/redemption.controller');

// Un comercio validando códigos a mano no necesita más de esto; frena
// intentos de fuerza bruta sobre el espacio de códigos IGG-XXXXXX.
const validateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: false, error: 'Demasiados intentos. Espera unos minutos.' },
});

router.post('/validar', validateLimiter, redemptionController.validate);

module.exports = router;
