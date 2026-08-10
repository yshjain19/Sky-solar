const Lead = require('../models/Lead');

module.exports = {
  // POST /leads (Submit new consultation request)
  createLead: async (req, res, next) => {
    try {
      const { fullName, mobileNumber, email, city, pinCode, propertyType, monthlyBill, message } = req.body;
      
      const lead = new Lead({
        fullName,
        mobileNumber,
        email,
        city,
        pinCode,
        propertyType,
        monthlyBill,
        message
      });

      try {
        await lead.save();
        req.flash('success', 'Thank you! Your solar consultation request has been submitted successfully. Our engineers will get in touch with you shortly.');
        res.redirect('/contact');
      } catch (validationErr) {
        if (validationErr.name === 'ValidationError') {
          // Map Mongoose validation errors list to key-value errors object
          const errors = {};
          Object.keys(validationErr.errors).forEach(key => {
            errors[key] = validationErr.errors[key].message;
          });

          return res.status(400).render('contact', {
            title: 'Get A Free Solar Quote',
            errors,
            formData: req.body
          });
        }
        throw validationErr;
      }
    } catch (err) {
      next(err);
    }
  }
};
