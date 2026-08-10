const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

module.exports = {
  // POST /admin/customers/convert/:leadId (Convert prospective lead to customer)
  convertLeadToCustomer: async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const lead = await Lead.findById(leadId);
      
      if (!lead) {
        req.flash('error', 'Lead record not found.');
        return res.redirect('/admin/leads');
      }

      // Calculate recommended solar size based on the bill
      const tariff = 8.0;
      const unitsPerMonth = parseFloat(lead.monthlyBill) / tariff;
      let capacityNeeded = unitsPerMonth / 120;
      capacityNeeded = Math.max(1.0, Math.round(capacityNeeded * 2) / 2); // nearest 0.5 kW

      // Determine system configuration based on property type
      let systemType = 'On-Grid Solar';
      if (lead.propertyType === 'commercial') {
        systemType = 'On-Grid Solar';
      } else if (lead.propertyType === 'residential' && parseFloat(lead.monthlyBill) > 6000) {
        systemType = 'Hybrid Solar';
      }

      // Create customer record in MongoDB
      await Customer.create({
        fullName: lead.fullName,
        mobileNumber: lead.mobileNumber,
        email: lead.email,
        city: lead.city,
        pinCode: lead.pinCode,
        capacity: `${capacityNeeded.toFixed(1)} kW`,
        systemType: systemType,
        monthlyBill: lead.monthlyBill.toString()
      });

      // Delete original lead
      await Lead.findByIdAndDelete(leadId);

      req.flash('success', `Lead "${lead.fullName}" has been successfully converted to a Customer!`);
      res.redirect('/admin/customers');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/customers/delete/:id (Delete customer record)
  deleteCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      await Customer.findByIdAndDelete(id);
      req.flash('success', 'Customer record deleted successfully.');
      res.redirect('/admin/customers');
    } catch (err) {
      next(err);
    }
  }
};
