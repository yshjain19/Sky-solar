const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const adminAuth = require('../middleware/adminAuth');
const catchAsync = require('../utils/catchAsync');

// Guard all routes with Admin Auth
router.use(adminAuth);

// POST /admin/customers/convert/:leadId (Convert lead to active client)
router.post('/convert/:leadId', catchAsync(customerController.convertLeadToCustomer));

// POST /admin/customers/delete/:id (Delete customer record)
router.post('/delete/:id', catchAsync(customerController.deleteCustomer));

module.exports = router;
