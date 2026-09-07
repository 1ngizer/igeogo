'use strict';

const dns = require('dns');
const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

/**
 * Fuerza el uso de DNS públicos (Google / Cloudflare) SOLO en Windows, donde el
 * resolutor interno de Node (c-ares) a veces no lee la config de DNS del sistema
 * y falla la búsqueda SRV de "mongodb+srv://" con 'querySrv ECONNREFUSED'.
 * En Linux/producción (p. ej. Railway) NO se aplica: el resolutor del sistema
 * funciona y forzar 8.8.8.8 puede romper la conexión a Atlas.
 */
if (process.platform === 'win32' && config.mongoUri.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    logger.warn('No se pudieron fijar los servidores DNS:', err.message);
  }
}

/**
 * Establece la conexión con MongoDB.
 * Las consultas geoespaciales ($near) requieren índices 2dsphere,
 * que se declaran en los modelos.
 */
async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB conectado');
  });
  mongoose.connection.on('error', (err) => {
    logger.error('Error de conexión MongoDB:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB desconectado');
  });

  await mongoose.connect(config.mongoUri);
  return mongoose.connection;
}

module.exports = connectDB;
