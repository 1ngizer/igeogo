'use strict';

const Redemption = require('../models/Redemption');
const Coupon = require('../models/Coupon');
const logger = require('../utils/logger');

/**
 * Valida (canjea) un código mostrado por un usuario en su WhatsApp.
 * Público: no requiere login del comercio, solo conocer el código, que
 * únicamente ve quien tiene la tarjeta del cupón en su celular.
 */
async function validate(req, res) {
  const code = String(req.body.code || '')
    .trim()
    .toUpperCase();

  if (!code) {
    return res.status(400).json({ ok: false, error: 'Falta el código.' });
  }

  const redemption = await Redemption.findOne({ code }).populate('coupon').populate('merchant');
  if (!redemption) {
    return res.status(404).json({ ok: false, error: 'Código no encontrado. Revisa que esté bien escrito.' });
  }

  if (redemption.status === 'canjeado') {
    return res.status(409).json({
      ok: false,
      error: 'Este código ya fue canjeado antes.',
      redeemedAt: redemption.redeemedAt,
      coupon: redemption.coupon ? redemption.coupon.title : null,
    });
  }

  redemption.status = 'canjeado';
  redemption.redeemedAt = new Date();
  await redemption.save();

  if (redemption.coupon) {
    await Coupon.updateOne({ _id: redemption.coupon._id }, { $inc: { redemptionCount: 1 } }).catch((err) =>
      logger.error('No se pudo actualizar redemptionCount:', err.message)
    );
  }

  return res.json({
    ok: true,
    coupon: redemption.coupon ? redemption.coupon.title : null,
    merchant: redemption.merchant ? redemption.merchant.name : null,
    redeemedAt: redemption.redeemedAt,
  });
}

module.exports = { validate };
