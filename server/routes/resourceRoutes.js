const express = require('express');
const {
  getResources,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getResources)
  .post(protect, createResource);

router.route('/:id')
  .put(protect, updateResource)
  .delete(protect, deleteResource);

module.exports = router;
