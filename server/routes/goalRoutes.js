const express = require('express');
const { getGoals, updateGoal, createGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getGoals);
router.post('/', protect, createGoal);
router.put('/:id', protect, updateGoal);

module.exports = router;
