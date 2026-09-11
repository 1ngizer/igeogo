'use strict';

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Campaign = require('../models/Campaign');
const wompi = require('../services/wompi.service');
const logger = require('../utils/logger');

// Defensa en profundidad además de la verificación de firma: frena volumen
// anómalo de peticiones al webhook (Wompi normalmente envía pocas por hora).
const wompiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /payments/wompi
 * Webhook de eventos de Wompi. Cuando una transacción queda APROBADA,
 * marca la campaña asociada (por wompiLinkId) como "pagada".
 * Siempre responde 200 para que Wompi no reintente indefinidamente.
 */
router.post('/wompi', wompiLimiter, async (req, res) => {
  res.sendStatus(200); // ACK inmediato
  try {
    const event = req.body || {};
    if (!wompi.verifyEvent(event)) {
      logger.warn('Webhook Wompi con firma inválida — ignorado');
      return;
    }
    if (event.event !== 'transaction.updated') return;

    const tx = event.data && event.data.transaction;
    if (!tx) return;
    logger.info(`Wompi transacción ${tx.id} estado=${tx.status} link=${tx.payment_link_id}`);

    if (tx.status !== 'APPROVED') return;

    const campaign = await Campaign.findOne({ wompiLinkId: tx.payment_link_id });
    if (!campaign) {
      logger.warn(`No hay campaña con wompiLinkId=${tx.payment_link_id}`);
      return;
    }
    if (campaign.status === 'pagada') return; // ya procesada

    campaign.status = 'pagada';
    campaign.wompiTxId = tx.id;
    campaign.paidAt = new Date();
    await campaign.save();
    logger.info(`✅ Campaña ${campaign._id} marcada como PAGADA (tx ${tx.id})`);
  } catch (err) {
    logger.error('Webhook Wompi:', err.message);
  }
});

module.exports = router;
