'use strict';

const Coupon = require('../models/Coupon');
// Se requiere explícitamente para que el modelo quede registrado en Mongoose
// antes del populate('merchant'), aunque no se use directamente aquí.
require('../models/Merchant');
const config = require('../config');

/**
 * Busca cupones activos cercanos a una ubicación, filtrando por las
 * categorías de interés del usuario.
 *
 * @param {Object}   params
 * @param {number}   params.lng         Longitud del usuario.
 * @param {number}   params.lat         Latitud del usuario.
 * @param {string[]} params.categories  Categorías de interés.
 * @param {number}   [params.radius]    Radio en metros (por defecto el de config).
 * @param {number}   [params.limit]     Máximo de cupones a devolver.
 * @returns {Promise<Array>} Cupones ordenados por cercanía.
 */
async function findNearbyCoupons({ lng, lat, categories, radius, limit = 5 }) {
  const maxDistance = radius || config.business.searchRadiusMeters;

  const query = {
    active: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: maxDistance,
      },
    },
    // Excluir cupones expirados, que aún no han comenzado, o que ya
    // agotaron su límite de canjes (redemptionLimit = 0 significa ilimitado).
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
      { $or: [{ startsAt: null }, { startsAt: { $lte: new Date() } }] },
      { $or: [{ redemptionLimit: 0 }, { $expr: { $lt: ['$redemptionCount', '$redemptionLimit'] } }] },
    ],
  };

  // Filtro por categorías (si el usuario eligió alguna).
  if (Array.isArray(categories) && categories.length > 0) {
    query.category = { $in: categories };
  }

  return Coupon.find(query).populate('merchant').limit(limit).lean();
}

module.exports = { findNearbyCoupons };
