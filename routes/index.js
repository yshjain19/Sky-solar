const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const catchAsync = require('../utils/catchAsync');

// GET / (Home Page)
router.get('/', catchAsync(homeController.renderHome));

// GET /solar (Solar Solutions, Systems & Calculator)
router.get('/solar', homeController.renderSolar);

// GET /about (Mission, Timeline & Subsidy Info)
router.get('/about', homeController.renderAbout);

// GET /faq (accordion questions list)
router.get('/faq', homeController.renderFaq);

// GET /contact (consultation submission)
router.get('/contact', homeController.renderContact);

module.exports = router;
