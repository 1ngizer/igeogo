'use strict';

const mongoose = require('mongoose');

/**
 * Configuración de precios (documento único). Editable desde el panel y
 * consumida por la app para calcular presupuestos de campañas.
 */
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Básico | Pro | Premium
    price: { type: Number, required: true }, // COP
    messages: { type: Number, required: true }, // mensajes incluidos
    campaigns: { type: Number, required: true }, // campañas máx. al mes
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'pricing', unique: true },
    currency: { type: String, default: 'COP' },
    pricePerMessage: { type: Number, default: 100 }, // pago por mensaje suelto
    plans: { type: [planSchema], default: [] },
  },
  { timestamps: true }
);

const Pricing = mongoose.model('Pricing', pricingSchema);

/** Devuelve el doc de precios, creándolo con valores por defecto si no existe. */
async function getPricing() {
  let p = await Pricing.findOne({ singleton: 'pricing' });
  if (!p) {
    p = await Pricing.create({
      singleton: 'pricing',
      currency: 'COP',
      pricePerMessage: 100,
      plans: [
        { name: 'Básico', price: 50000, messages: 550, campaigns: 3 },
        { name: 'Pro', price: 99900, messages: 1200, campaigns: 5 },
        { name: 'Premium', price: 199000, messages: 2500, campaigns: 10 },
      ],
    });
  }
  return p;
}

module.exports = { Pricing, getPricing };
