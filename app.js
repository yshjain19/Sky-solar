require('dotenv').config();

// Override default Node.js DNS servers to resolve MongoDB Atlas SRV query issues (e.g. ISP blocks)
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Import Mongoose Models
const Admin = require('./models/Admin');

const app = express();

// Database Integration (MongoDB Atlas / Local)
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sky-solar';
mongoose.connect(dbUri)
  .then(() => {
    console.log(`[DB] Successfully connected to database: ${dbUri.split('@').pop().split('/')[0]}`); // Safely logs DB host
    // Seed default admin user on startup
    seedAdminUser();
  })
  .catch(err => {
    console.error('[DB] Connection Error:', err);
  });

/**
 * Seeds a default admin account if none exists
 */
async function seedAdminUser() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultUser = process.env.ADMIN_USERNAME || 'admin';
      const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
      
      const admin = new Admin({
        username: defaultUser,
        email: 'admin@skysolar.in'
      });
      
      await Admin.register(admin, defaultPass);
      console.log(`[DB-SEED] Default administrator created: Username: "${defaultUser}", Password: "${defaultPass}"`);
    }
  } catch (err) {
    console.error('[DB-SEED] Seeding administrator account failed:', err);
  }
}

// Template View Engine & Layout Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Express Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'skysolar_secret_session_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    httpOnly: true
  }
}));

// Passport Session Initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy Configuration
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Flash Messages Middleware
app.use(flash());

// Pass sessions and flash variables to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.isAdmin = req.isAuthenticated();
  res.locals.currentUser = req.user || null;
  next();
});

// Serve sitemap.xml and robots.txt from project root
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Import Express Routers
const indexRoutes = require('./routes/index');
const leadRoutes = require('./routes/lead');
const customerRoutes = require('./routes/customer');
const projectRoutes = require('./routes/project');
const adminRoutes = require('./routes/admin');

// Register Routes
app.use('/', indexRoutes);
app.use('/leads', leadRoutes);
// Note: /admin covers admin specific pages and portal routes
app.use('/admin', adminRoutes);
app.use('/admin/customers', customerRoutes);
app.use('/admin/projects', projectRoutes);

// Fallback (404 Page Not Found)
app.use((req, res) => {
  req.flash('error', 'Requested page not found. Redirected to Home.');
  res.redirect('/');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500);
  res.render('home', {
    title: 'Sky Solar | Internal Server Error',
    projects: [],
    error: 'An unexpected server error occurred. Please try again later.'
  });
});

// Port configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Sky Solar Express Server Online`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Management Portal: http://localhost:${PORT}/admin/login`);
  console.log(`=========================================`);
});
