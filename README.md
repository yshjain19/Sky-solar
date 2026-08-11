# ☀️ Sky Solar — Full-Stack Rooftop Solar Solutions Portal

Sky Solar is a premium, full-stack MVC web application designed to streamline rooftop solar consultation, sales, and portfolio management. Built using **Node.js**, **Express**, **EJS**, and **MongoDB (Mongoose)**, it features a customer-facing portal with a solar savings estimator and an admin dashboard for lead conversions and portfolio building.

---

## 🚀 Key Features

### 1. Customer-Facing Portal
- **Interactive Solar Savings Calculator**: Estimate recommended solar capacity (kW), monthly/annual savings, payback period, and carbon footprint reduction (CO₂ offsets in tons) based on current electricity bills and rooftop area.
- **Consultation Request Forms**: Indian validation-compliant lead intake form (10-digit mobile number, valid email, and 6-digit Indian PIN code validation).
- **Public Showcase Portfolio**: High-resolution showcase of completed residential, commercial, housing society, and industrial solar installations.
- **Subsidy & Policy Guides**: Detailed breakdowns of national solar subsidy schemes (like the *PM Surya Ghar Muft Bijli Yojana* with subsidies up to ₹78,000).

### 2. Guarded Admin Management Portal (`/admin`)
- **Interactive Lead Manager**: Review consultation requests. Converted leads are dynamically processed (recommended capacity is automatically calculated based on their bill) and added to the customer database with a single click.
- **Operational Metrics Dashboard**: Visual display of key operational analytics including total lead volume, converted customers, total installed capacity (kW), and showcase project count.
- **Portfolio Showcase Builder**: Upload and manage project showcase details (title, location, capacity, system type, category) with live image previews.
- **Robust Authentication**: Powered by `Passport.js` with secure password hashing via `passport-local-mongoose`.

### 3. Dynamic Image Storage Engine
- **Cloudinary Integration**: Automatically uploads project portfolio photos to Cloudinary when API credentials are provided.
- **Local Disk Fallback**: Seamlessly falls back to local disk storage (`/public/images/projects/`) if Cloudinary credentials are not set in the environment variables.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend & Routing** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose ODM |
| **Security & Auth** | Passport.js, Passport-Local, Express-Session, Connect-Flash |
| **Frontend Rendering** | EJS (Embedded JavaScript), Express EJS Layouts |
| **Styling & UI** | Vanilla CSS, Glassmorphism, CSS Micro-animations |
| **File Uploads** | Multer, Multer-Storage-Cloudinary, Cloudinary SDK |
| **Testing** | Node.js Custom Assertion Suite |

---

## 📂 Project Directory Structure

```text
Sky_solar/
├── controllers/          # Business logic controllers
│   ├── admin.js          # Admin dashboard, leads inbox, and portfolio renders
│   ├── customer.js       # Customer database operations
│   ├── home.js           # Public views renders (Home, About, FAQs, Contact)
│   ├── lead.js           # Lead creation and validator redirection
│   └── project.js        # Showcase project additions and removals
├── middleware/           # Express Route Guards
│   └── adminAuth.js      # Session verification check for admin pages
├── models/               # Mongoose schemas & validation models
│   ├── Admin.js          # Administrator user credentials schema
│   ├── Customer.js       # Converted customers database schema
│   ├── Lead.js           # Lead details, validators & contact preferences schema
│   └── Project.js        # Solar portfolio project showcase schema
├── public/               # Static assets served by Express
│   ├── css/              # Custom stylesheets (glassmorphism styles)
│   ├── images/           # Solar icons, site background, and local uploads
│   └── js/               # Client-side validation & calculator logic
├── routes/               # Express Router routes mapping controllers
├── utils/                # Utility helpers & integrations
│   ├── catchAsync.js     # Async route error wrapper
│   └── cloudinary.js     # Cloudinary / local multer storage selector
├── views/                # EJS view templates
│   ├── admin/            # Dashboard, customers, leads, login & projects views
│   ├── layouts/          # Boiling plate HTML templates
│   └── includes/         # Reusable navigation bar and footer components
├── tests/                # Custom backend verification scripts
├── .env.example          # Sample environment variables config
├── app.js                # App server entrypoint and configuration initialization
├── package.json          # Node project scripts and dependencies listing
└── README.md             # Project documentation
```

---

## ⚙️ Configuration & Environment Setup

Copy or rename the `.env.example` file to `.env` in the root directory and configure the variables:

```ini
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/sky-solar
SESSION_SECRET=your_custom_session_secret_key_here

# Default Seeding Credentials (Admin)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary Integration (Optional: falls back to local uploads if left blank)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** running locally or a MongoDB Atlas connection string.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Running the Server

#### Development Mode (Auto-reloads on file changes using nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```
Once started, the application will run at:
- Public Site: `http://localhost:8080/`
- Admin Login Portal: `http://localhost:8080/admin/login`

> [!NOTE]
> **Database Seeding on Startup**: The server automatically seeds a default administrator account into MongoDB on its initial startup if no admin records exist. The default username is `admin` and password is `admin123` (unless customized via your `.env` file).

---

## 🧪 Testing

A custom validation and database CRUD suite is provided in the `tests/` directory. Ensure MongoDB is running and execute:

```bash
node tests/backend.test.js
```

This verifies:
1. Active MongoDB connection status.
2. Form and Model validation rules for leads (e.g., rejecting invalid Indian mobile patterns, PIN codes, and short names).
3. Portfolio project creation, reading, and deletion database queries.