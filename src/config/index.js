'use strict';

require('dotenv').config();

/**
 * Configuración centralizada de la aplicación.
 * Lee variables de entorno y aplica valores por defecto sensatos.
 */
// Seguro por defecto: sin NODE_ENV explícito se asume producción (sin secretos de desarrollo).
const DEV_LIKE = ['development', 'test'].includes(process.env.NODE_ENV);

const config = {
  env: process.env.NODE_ENV || 'development',
  devLike: DEV_LIKE,
  port: parseInt(process.env.PORT, 10) || 3000,

  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/igeogo',

  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    appSecret: process.env.WHATSAPP_APP_SECRET || '', // Se usa para validar webhooks de Meta
    templateName: process.env.WHATSAPP_TEMPLATE_NAME || 'oferta_cercana',
    // Debe coincidir exactamente con el idioma de la plantilla en Meta (Spanish (COL) = es_CO).
    templateLang: process.env.WHATSAPP_TEMPLATE_LANG || 'es_CO',
  },

  jwtSecret: (() => {
    if (process.env.APP_SECRET) return process.env.APP_SECRET;
    if (!DEV_LIKE) {
      throw new Error('FATAL: APP_SECRET es obligatorio (solo se omite con NODE_ENV=development o test).');
    }
    return 'igeogo_dev_secret_cambiame';
  })(),

  business: {
    // Radio de búsqueda en metros (2 km por defecto).
    searchRadiusMeters: parseInt(process.env.SEARCH_RADIUS_METERS, 10) || 2000,
    // Categorías que usa el BOT de WhatsApp (botones, máx. 3 cómodos).
    categories: ['comida', 'ropa', 'servicios'],
    // Catálogo ampliado de categorías para la app móvil y el panel.
    appCategories: [
      'comida',
      'ropa',
      'servicios',
      'hoteles',
      'belleza',
      'salud',
      'entretenimiento',
      'deportes',
      'tecnologia',
      'viajes',
    ],
  },

  adminApiKey: process.env.ADMIN_API_KEY || '',
};

module.exports = config;
