const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true,
    minlength: [2, 'Full Name must be at least 2 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit Indian mobile number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  pinCode: {
    type: String,
    required: [true, 'PIN Code is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[1-9]\d{5}$/.test(v);
      },
      message: 'Please enter a valid 6-digit Indian PIN Code'
    }
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['residential', 'commercial', 'apartment', 'society'],
      message: 'Please select a valid property type'
    }
  },
  monthlyBill: {
    type: Number,
    required: [true, 'Monthly electricity bill is required'],
    min: [0, 'Monthly bill cannot be negative']
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Contacted', 'Converted']
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
