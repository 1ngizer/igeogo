'use strict';

const mongoose = require('mongoose');

/**
 * Lead de comercio captado desde la landing page.
 * Es el embudo de ventas: comercios interesados en anunciar en igeogo.
 */
const leadSchema = new mongoose.Schema(
  {
    business: { type: String, required: true }, // nombre del comercio
    name: { type: String, default: '' }, // persona de contacto
    phone: { type: String, required: true }, // WhatsApp
    city: { type: String, default: '' },
    message: { type: String, default: '' }, // qué quiere promocionar
    source: { type: String, default: 'landing' },
    status: {
      type: String,
      enum: ['nuevo', 'contactado', 'ganado', 'perdido'],
      default: 'nuevo',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
