'use strict';

const express = require('express');
const router = express.Router();
const appAuth = require('../middleware/appAuth');
const app = require('../controllers/app.controller');

// Público (login).
router.post('/auth/request-otp', app.requestOtp);
router.post('/auth/verify-otp', app.verifyOtp);
router.get('/categories', app.getCategories);
router.get('/pricing', app.getPricingPublic);
router.post('/lead', app.createLead);

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

module.exports = router;
