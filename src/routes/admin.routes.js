'use strict';

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const admin = require('../controllers/admin.controller');

// Todos los endpoints de admin requieren la cabecera x-admin-key.
router.use(adminAuth);

router.post('/merchants', admin.createMerchant);
router.get('/merchants', admin.listMerchants);
router.put('/merchants/:id', admin.updateMerchant);
router.delete('/merchants/:id', admin.deleteMerchant);

router.post('/coupons', admin.createCoupon);
router.get('/coupons', admin.listCoupons);
router.delete('/coupons/:id', admin.deleteCoupon);

router.get('/users', admin.listUsers);

router.get('/pricing', admin.getPricingAdmin);
router.put('/pricing', admin.updatePricing);

router.get('/campaigns', admin.listCampaigns);
router.post('/campaigns/:id/dispatch', admin.dispatchCampaign);
router.delete('/campaigns/:id', admin.deleteCampaign);
router.put('/campaigns/:id/status', admin.setCampaignStatus);

router.get('/leads', admin.listLeads);
router.put('/leads/:id/status', admin.setLeadStatus);

router.get('/redemptions', admin.listRedemptions);

module.exports = router;
