'use strict';

const mongoose = require('mongoose');

/**
 * Campaña de promoción creada por un Cliente (comercio/anunciante).
 * Guarda solo el ALCANCE ESTIMADO (conteo), nunca los destinatarios:
 * proteger la audiencia es parte del modelo de negocio.
 */
const campaignSchema = new mongoose.Schema(
  {
    cliente: { type: String, required: true, index: true }, // waId del cliente
    clienteName: { type: String, default: '' },

    producto: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    discountPercent: { type: Number, default: 0 },

    // Centro y radio de alcance.
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    radius: { type: Number, default: 2000 },

    estimatedReach: { type: Number, default: 0 }, // solo conteo
    plan: { type: String, default: 'por_mensaje' }, // nombre del plan o 'por_mensaje'
    messages: { type: Number, default: 0 }, // mensajes a enviar
    budget: { type: Number, default: 0 }, // COP

    status: {
      type: String,
      enum: ['propuesta', 'pagada', 'enviada', 'rechazada'],
      default: 'propuesta',
    },

    // Pago (Wompi).
    wompiLinkId: { type: String, default: null }, // id del link de pago
    wompiTxId: { type: String, default: null }, // id de la transacción aprobada
    paidAt: { type: Date, default: null },

    // Despacho (envío masivo a la audiencia).
    sentCount: { type: Number, default: 0 }, // mensajes efectivamente enviados
    sentAt: { type: Date, default: null }, // cuándo se despachó
  },
  { timestamps: true }
);

campaignSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Campaign', campaignSchema);
