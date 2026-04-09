const Skill = require('../models/Skill');

// GET /api/skills
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().populate('postedBy', 'name avatar rating level');
    res.json({ success: true, skills });
  } catch (err) {
    next(err);
  }
};

// POST /api/skills
const createSkill = async (req, res, next) => {
  try {
    const { name, category, level } = req.body;
    if (!name || !category || !level) {
      return res.status(400).json({ success: false, message: 'name, category and level are required' });
    }
    const skill = await Skill.create({ name, category, level, postedBy: req.user._id });
    await skill.populate('postedBy', 'name avatar rating level');
    res.status(201).json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

// GET /api/skills/:id
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('postedBy', 'name avatar rating level');
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSkills, createSkill, getSkillById };
