'use strict';

const mongoose = require('mongoose');

/**
 * Comercio adherido a la plataforma.
 * Su ubicación se almacena como GeoJSON Point para consultas $near.
 */
const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // comida | ropa | servicios
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: 'Colombia' },
    phone: { type: String, default: '' },
    // Datos para la tarjeta enriquecida (estilo Groupon).
    photoUrl: { type: String, default: '' }, // URL pública de la foto del local
    rating: { type: Number, default: 0 }, // 0 a 5
    reviews: { type: Number, default: 0 }, // nº de reseñas
    website: { type: String, default: '' },

    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      // [longitud, latitud] -- ¡el orden importa en GeoJSON!
      coordinates: { type: [Number], required: true },
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

merchantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Merchant', merchantSchema);
