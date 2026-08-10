const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');

// Guard all routes with Admin Auth
router.use(adminAuth);

// POST /admin/projects/new - Process new project showcase details and photo upload
router.post('/new', upload.single('projectImage'), catchAsync(projectController.createProject));

// POST /admin/projects/delete/:id - Delete project record
router.post('/delete/:id', catchAsync(projectController.deleteProject));

module.exports = router;
