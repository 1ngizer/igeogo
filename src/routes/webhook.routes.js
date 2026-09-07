'use strict';

const express = require('express');
const router = express.Router();
const webhook = require('../controllers/webhook.controller');

// Verificación del webhook (Meta hace un GET con hub.challenge).
router.get('/', webhook.verify);

// Recepción de mensajes y eventos (Meta hace POST).
router.post('/', webhook.receive);

module.exports = router;
