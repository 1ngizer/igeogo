'use strict';

const express = require('express');
const router = express.Router();
const redemptionController = require('../controllers/redemption.controller');

router.post('/validar', redemptionController.validate);

module.exports = router;
