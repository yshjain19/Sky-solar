const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead');
const catchAsync = require('../utils/catchAsync');

// POST /leads (Submit new consultation request)
router.post('/', catchAsync(leadController.createLead));

module.exports = router;
