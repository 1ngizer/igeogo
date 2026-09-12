'use strict';

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const appAuth = require('../middleware/appAuth');
const app = require('../controllers/app.controller');

// Limitador estricto para OTP
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // 5 intentos por IP
  message: { error: 'Demasiados intentos de inicio de sesión. Intenta en 10 minutos.' }
});

// Limitador para registro de comercios (leads)
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 envíos por IP
  message: { error: 'Demasiadas solicitudes de registro. Intenta más tarde.' }
});

// Público (login).
router.post('/auth/request-otp', authLimiter, app.requestOtp);
router.post('/auth/verify-otp', authLimiter, app.verifyOtp);
router.get('/categories', app.getCategories);
router.get('/pricing', app.getPricingPublic);
router.post('/lead', leadLimiter, app.createLead);

// Requiere sesión.
router.get('/me', appAuth, app.getMe);
router.put('/me', appAuth, app.updateMe);
router.get('/coupons', appAuth, app.getCoupons);

// Cliente: alcance estimado y campañas.
router.get('/reach', appAuth, app.getReach);
router.post('/campaigns', appAuth, app.createCampaign);
router.post('/campaigns/ai-copy', appAuth, app.aiCopy);
router.post('/campaigns/:id/pay', appAuth, app.payCampaign);
router.get('/campaigns', appAuth, app.listMyCampaigns);
router.post('/campaigns/:id/insight', appAuth, app.campaignInsight);

module.exports = router;
