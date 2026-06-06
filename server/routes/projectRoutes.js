const express = require('express');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.get('/stats/:id', protect, getProjectStats);
router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
