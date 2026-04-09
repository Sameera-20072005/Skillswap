const express = require('express');
const router = express.Router();
const { getSkills, createSkill, getSkillById } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getSkills);
router.post('/', protect, createSkill);
router.get('/:id', protect, getSkillById);

module.exports = router;
