const Project = require('../models/Project');
const { getImageUrl } = require('../utils/cloudinary');

module.exports = {
  // POST /admin/projects/new (Create new project item)
  createProject: async (req, res, next) => {
    try {
      const { title, location, capacity, category, type } = req.body;

      if (!title || !location || !capacity) {
        req.flash('error', 'Please fill in all required fields.');
        return res.redirect('/admin/projects');
      }

      // Extract uploaded image URL (Cloudinary or local fallback)
      const imageUrl = getImageUrl(req) || req.body.image || './public/images/residential_solar.png';

      await Project.create({
        title,
        location,
        capacity,
        category,
        type,
        image: imageUrl
      });

      req.flash('success', 'New project has been successfully added to the public portfolio showcase!');
      res.redirect('/admin/projects');
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/projects/delete/:id (Delete project item)
  deleteProject: async (req, res, next) => {
    try {
      const { id } = req.params;
      await Project.findByIdAndDelete(id);
      req.flash('success', 'Project removed from showcase successfully.');
      res.redirect('/admin/projects');
    } catch (err) {
      next(err);
    }
  }
};
