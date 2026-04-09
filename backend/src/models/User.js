const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    skillsOffered: [{ type: String, trim: true }],
    skillsNeeded: [{ type: String, trim: true }],
    availability: [{ type: String }],
    campus: { type: String, default: '' },
    // Matches frontend: rating, reviewCount, skillCredits, level
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    skillCredits: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ['Beginner', 'Mentor', 'Master'],
      default: 'Beginner'
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compute level from skillCredits before returning
userSchema.methods.computeLevel = function () {
  if (this.skillCredits >= 50) return 'Master';
  if (this.skillCredits >= 20) return 'Mentor';
  return 'Beginner';
};

module.exports = mongoose.model('User', userSchema);
