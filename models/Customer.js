const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: String,
    required: true,
    trim: true
  },
  systemType: {
    type: String,
    required: true,
    default: 'On-Grid Solar'
  },
  monthlyBill: {
    type: String,
    default: '0'
  },
  joinedAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
