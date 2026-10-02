'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const webhookRoutes = require('./routes/webhook.routes');
const adminRoutes = require('./routes/admin.routes');
const appRoutes = require('./routes/app.routes');
const paymentRoutes = require('./routes/payments.routes');
const redemptionRoutes = require('./routes/redemption.routes');

const app = express();

// Confiar en el proxy inverso (Railway, Heroku, etc.) para resolver la IP real del cliente
app.set('trust proxy', 1);

// 1. Cabeceras de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Opcional: desactivar si bloquea scripts de frontend que no estén afinados
}));

// 2. CORS explícito
app.use(cors({
  origin: ['https://igeogo.ingizer.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

// 3. Rate limiter global (API general)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de cada IP a 200 peticiones por ventana
  message: { error: 'Demasiadas peticiones desde esta IP, intenta más tarde.' }
});

// Aplicar el limitador a todas las rutas bajo /app/api y /admin
app.use('/app/api', apiLimiter);
app.use('/admin', apiLimiter);


// La Cloud API envía JSON. Conservamos el raw body por si más adelante
// queremos validar la firma X-Hub-Signature-256 de Meta.
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Healthcheck (JSON) para monitoreo.
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Panel de administración web (estático). Se abre en http://localhost:3000/panel/
app.use('/panel', express.static(path.join(__dirname, '../public')));

// App móvil (PWA): API primero, luego los archivos estáticos.
app.use('/app/api', appRoutes);
app.use('/app', express.static(path.join(__dirname, '../public/app')));

// Rutas.
app.use('/webhook', webhookRoutes);
app.use('/payments', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/canjear', redemptionRoutes);

// Landing page pública en la raíz del dominio (igeogo.ingizer.com/).
app.use('/', express.static(path.join(__dirname, '../public/landing')));

// 404.
app.use((_req, res) => res.status(404).json({ error: 'No encontrado' }));

// Manejador de errores.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  logger.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno' });
});

module.exports = app;
