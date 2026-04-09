const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    // Frontend uses reviewerId / revieweeId
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exchangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// Prevent duplicate feedback per exchange per reviewer
feedbackSchema.index({ exchangeId: 1, reviewerId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
