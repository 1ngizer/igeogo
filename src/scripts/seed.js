'use strict';

/**
 * Script de carga inicial de datos de prueba.
 * Crea comercios y cupones de ejemplo cerca de un punto base (Madrid centro).
 *
 * Uso:  npm run seed
 *
 * Cambia BASE_LAT / BASE_LNG por tus coordenadas para probar el matching
 * desde tu propia ubicación de WhatsApp.
 */

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Merchant = require('../models/Merchant');
const Coupon = require('../models/Coupon');
const logger = require('../utils/logger');

// Punto base (Puerta del Sol, Madrid). [lat, lng]
const BASE_LAT = 40.4168;
const BASE_LNG = -3.7038;

// Pequeño desplazamiento (~ unos cientos de metros) para variar ubicaciones.
function jitter() {
  return (Math.random() - 0.5) * 0.01; // ~ +/- 0.5 km aprox
}

async function run() {
  await connectDB();

  logger.info('Limpiando comercios y cupones anteriores...');
  await Coupon.deleteMany({});
  await Merchant.deleteMany({});

  const merchantsData = [
    { name: 'Bar La Esquina', category: 'comida', address: 'Calle Mayor 10' },
    { name: 'Pizzería Napoli', category: 'comida', address: 'Calle Arenal 22' },
    { name: 'Moda Urbana', category: 'ropa', address: 'Gran Vía 45' },
    { name: 'Peluquería Estilo', category: 'servicios', address: 'Calle Preciados 8' },
  ];

  const merchants = [];
  for (const m of merchantsData) {
    const merchant = await Merchant.create({
      ...m,
      location: {
        type: 'Point',
        coordinates: [BASE_LNG + jitter(), BASE_LAT + jitter()],
      },
    });
    merchants.push(merchant);
  }
  logger.info(`Creados ${merchants.length} comercios.`);

  const couponsData = [
    { merchant: merchants[0], title: '2x1 en cañas', description: 'Válido de lunes a jueves.' },
    { merchant: merchants[1], title: '-30% en pizzas familiares', description: 'Para llevar.' },
    { merchant: merchants[2], title: '-20% en toda la tienda', description: 'Nueva colección.' },
    { merchant: merchants[3], title: 'Corte + lavado por 12€', description: 'Cita previa.' },
  ];

  for (const c of couponsData) {
    await Coupon.create({
      merchant: c.merchant._id,
      title: c.title,
      description: c.description,
      category: c.merchant.category,
      location: c.merchant.location,
      address: c.merchant.address,
      active: true,
    });
  }
  logger.info(`Creados ${couponsData.length} cupones.`);

  logger.info('Seed completado ✅');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  logger.error('Error en seed:', err);
  process.exit(1);
});
