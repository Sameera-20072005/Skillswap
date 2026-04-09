const User = require('../models/User');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  skillsOffered: user.skillsOffered,
  skillsNeeded: user.skillsNeeded,
  availability: user.availability,
  campus: user.campus,
  rating: user.rating,
  reviewCount: user.reviewCount,
  skillCredits: user.skillCredits,
  level: user.level
});

// GET /api/users  — used by Marketplace (api.getAllUsers)
const getAllUsers = async (req, res, next) => {
  try {
    const { level, campus, search } = req.query;
    const filter = {};

    if (level) filter.level = level;
    if (campus) filter.campus = campus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skillsOffered: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter);
    res.json({ success: true, users: users.map(formatUser) });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id  — used by ExchangeCard to resolve partner info
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/profile  — update current user's profile
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'skillsOffered', 'skillsNeeded', 'availability', 'campus'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateProfile };
