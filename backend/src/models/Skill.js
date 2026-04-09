const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
