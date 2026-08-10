const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let upload;
let getImageUrl;

if (cloudName && apiKey && apiSecret) {
  // 1. Cloudinary Integration Active
  console.log('[UPLOAD] Cloudinary storage configuration initialized.');
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sky_solar_projects',
      allowed_formats: ['jpg', 'jpeg', 'png']
    }
  });

  upload = multer({ storage: storage });
  
  // Under Cloudinary, req.file.path holds the uploaded secure URL
  getImageUrl = (req) => {
    return req.file ? req.file.path : null;
  };
} else {
  // 2. Fallback to Local Disk Storage
  console.warn('[UPLOAD] WARNING: Cloudinary credentials missing in .env. Falling back to local disk uploads.');

  const localDir = path.join(__dirname, '..', 'public', 'images', 'projects');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, localDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `proj-${Date.now()}${ext}`);
    }
  });

  upload = multer({ storage: storage });

  // For local disk uploads, return relative path served by Express static
  getImageUrl = (req) => {
    return req.file ? `/public/images/projects/${req.file.filename}` : null;
  };
}

module.exports = {
  upload,
  getImageUrl
};
