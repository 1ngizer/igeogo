'use strict';

const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

async function start() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`igeogo escuchando en http://localhost:${config.port} (${config.env})`);
      logger.info(`Webhook de WhatsApp: GET/POST http://localhost:${config.port}/webhook`);
    });
  } catch (err) {
    logger.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

start();
