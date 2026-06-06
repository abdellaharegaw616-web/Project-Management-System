const express = require('express');
const { getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Portfolio should return the current user's accessible projects.
router.get('/', protect, getProjects);

module.exports = router;