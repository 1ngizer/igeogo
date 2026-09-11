'use strict';

const mongoose = require('mongoose');

/**
 * Cupón de descuento publicado por un comercio.
 * Duplicamos `location` y `category` desde el comercio para poder
 * resolver el matching geoespacial en una sola consulta sobre Coupons.
 */
const couponSchema = new mongoose.Schema(
  {
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },

    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true }, // comida | ropa | servicios
    discountPercent: { type: Number, default: 0 },

    // Copia desnormalizada de la ubicación del comercio (GeoJSON Point).
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitud, latitud]
    },

    // Texto de la dirección para mostrar al usuario.
    address: { type: String, default: '' },

    active: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },

    // Control de canjes.
    redemptionLimit: { type: Number, default: 0 }, // 0 = ilimitado
    redemptionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

couponSchema.index({ location: '2dsphere' });
couponSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
