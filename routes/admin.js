const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/admin');
const adminAuth = require('../middleware/adminAuth');
const catchAsync = require('../utils/catchAsync');

// Public admin routes
router.get('/login', adminController.renderLogin);

// POST /admin/login - Authenticate using Passport Local Strategy
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/admin/login',
  failureFlash: true
}), adminController.loginAdmin);

router.get('/logout', adminController.logoutAdmin);

// Guard all subsequent routes with Admin Auth
router.use(adminAuth);

// GET /admin/dashboard (Main operations overview)
router.get('/dashboard', catchAsync(adminController.renderDashboard));

// GET /admin/leads (View consultation leads inbox)
router.get('/leads', catchAsync(adminController.renderLeads));

// POST /admin/leads/delete/:id (Delete spam lead entries)
router.post('/leads/delete/:id', catchAsync(adminController.deleteLead));

// GET /admin/customers (View converted customers directory)
router.get('/customers', catchAsync(adminController.renderCustomers));

// GET /admin/projects (Upload/view showcase portfolio)
router.get('/projects', catchAsync(adminController.renderProjects));

module.exports = router;
