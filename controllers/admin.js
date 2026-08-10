const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Project = require('../models/Project');

module.exports = {
  // GET /admin/login (Render admin login page)
  renderLogin: (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', {
      title: 'Admin Portal Login'
    });
  },

  // POST /admin/login (Handled via Passport Local Strategy middleware, this routes success)
  loginAdmin: (req, res) => {
    req.flash('success', 'Access granted. Welcome back, Administrator.');
    res.redirect('/admin/dashboard');
  },

  // GET /admin/logout (Terminate admin session)
  logoutAdmin: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      req.flash('success', 'You have been successfully logged out.');
      res.redirect('/');
    });
  },

  // GET /admin/dashboard (Operational metrics summary)
  renderDashboard: async (req, res, next) => {
    try {
      // Mongoose Queries
      const leads = await Lead.find().sort({ createdAt: -1 });
      const customers = await Customer.find();
      const projects = await Project.find();

      const leadCount = leads.length;
      const customerCount = customers.length;
      const projectCount = projects.length;

      // Sum capacities
      let totalCapacity = 0;
      customers.forEach(c => {
        const num = parseFloat(c.capacity);
        if (!isNaN(num)) {
          totalCapacity += num;
        }
      });

      // Get first 5 leads for dashboard preview
      const recentLeads = leads.slice(0, 5);

      res.render('admin/dashboard', {
        title: 'Management Dashboard',
        leadCount,
        customerCount,
        projectCount,
        totalCapacity: totalCapacity.toFixed(1),
        recentLeads
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/leads (List all leads)
  renderLeads: async (req, res, next) => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      res.render('admin/leads', {
        title: 'Leads Inbox Manager',
        leads
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/leads/delete/:id (Delete lead record)
  deleteLead: async (req, res, next) => {
    try {
      const { id } = req.params;
      await Lead.findByIdAndDelete(id);
      req.flash('success', 'Lead record removed successfully.');
      res.redirect('/admin/leads');
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/customers (List all customers)
  renderCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.find().sort({ joinedAt: -1 });
      res.render('admin/customers', {
        title: 'Customers Database',
        customers
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/projects (Showcase portfolio builder)
  renderProjects: async (req, res, next) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.render('admin/projects', {
        title: 'Portfolio Manager',
        projects
      });
    } catch (err) {
      next(err);
    }
  }
};
