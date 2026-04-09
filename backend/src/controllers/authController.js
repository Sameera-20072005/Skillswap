const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Shape a user document into the object the frontend expects
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

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, campus, bio, skillsOffered, skillsNeeded, availability } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      campus: campus || '',
      bio: bio || '',
      skillsOffered: skillsOffered || [],
      skillsNeeded: skillsNeeded || [],
      availability: availability || []
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    next(err);
  }
};

// GET /api/auth/profile  (protected)
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile };
