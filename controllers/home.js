const Project = require('../models/Project');

/**
 * Controller handling public, non-authenticated requests
 */
module.exports = {
  // GET / (Home Page)
  renderHome: async (req, res) => {
    const projects = await Project.findAll();
    res.render('home', {
      title: 'Sky Solar | Rooftop Solar Solutions for Homes & Businesses',
      projects
    });
  },

  // GET /solar
  renderSolar: (req, res) => {
    res.render('solar', {
      title: 'Solar Solutions & Systems'
    });
  },

  // GET /about
  renderAbout: (req, res) => {
    res.render('about', {
      title: 'About Us & How It Works'
    });
  },

  // GET /faq
  renderFaq: (req, res) => {
    res.render('faq', {
      title: 'Frequently Asked Questions'
    });
  },

  // GET /contact
  renderContact: (req, res) => {
    // Check if query params were passed from the calculator to prefill
    const formData = {};
    if (req.query.bill) formData.monthlyBill = req.query.bill;
    if (req.query.property) formData.propertyType = req.query.property;
    if (req.query.city) formData.city = req.query.city;

    res.render('contact', {
      title: 'Get A Free Solar Quote',
      formData,
      errors: null
    });
  }
};
