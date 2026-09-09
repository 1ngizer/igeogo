'use strict';

const mongoose = require('mongoose');

/**
 * Código de canje generado cada vez que un usuario ve la tarjeta de un
 * cupón. El comercio lo valida en /canjear con lo que el cliente le
 * muestra en su WhatsApp; un código solo puede canjearse una vez.
 */
const redemptionSchema = new mongoose.Schema(
  {
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    waId: { type: String, required: true },

    code: { type: String, required: true, unique: true, index: true },

    status: { type: String, enum: ['pendiente', 'canjeado'], default: 'pendiente' },
    redeemedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Redemption', redemptionSchema);
