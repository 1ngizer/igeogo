'use strict';

const axios = require('axios');
const logger = require('./logger');

/**
 * Geocodificación inversa (best-effort) con Nominatim / OpenStreetMap.
 * Devuelve una etiqueta corta de dirección, o '' si falla.
 * No lanza errores: si no hay red o Nominatim falla, devolvemos cadena vacía.
 */
async function reverseGeocode(lat, lng) {
  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat, lon: lng, zoom: 16, addressdetails: 1 },
      headers: { 'User-Agent': 'igeogo/0.1 (proximity marketing MVP)' },
      timeout: 4000,
    });
    if (data && data.display_name) {
      // Nos quedamos con las 2-3 primeras partes para que sea corto.
      return data.display_name.split(',').slice(0, 3).join(', ').trim();
    }
  } catch (err) {
    logger.debug('reverseGeocode falló:', err.message);
  }
  return '';
}

module.exports = { reverseGeocode };
