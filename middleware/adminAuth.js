/**
 * Middleware to protect routes and verify admin authentication using Passport.js
 */
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  req.flash('error', 'Authentication required. Please log in to access the admin portal.');
  res.redirect('/admin/login');
};
