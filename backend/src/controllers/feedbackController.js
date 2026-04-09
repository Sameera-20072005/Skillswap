const Feedback = require('../models/Feedback');
const ExchangeRequest = require('../models/ExchangeRequest');
const User = require('../models/User');

const formatFeedback = (fb) => ({
  id: fb._id,
  reviewerId: fb.reviewerId._id || fb.reviewerId,
  revieweeId: fb.revieweeId._id || fb.revieweeId,
  exchangeId: fb.exchangeId._id || fb.exchangeId,
  rating: fb.rating,
  comment: fb.comment,
  createdAt: fb.createdAt
});

// POST /api/feedback
// Frontend sends: exchangeId, rating, comment
const submitFeedback = async (req, res, next) => {
  try {
    const { exchangeId, rating, comment } = req.body;

    if (!exchangeId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'exchangeId, rating and comment are required' });
    }

    const exchange = await ExchangeRequest.findById(exchangeId);
    if (!exchange) return res.status(404).json({ success: false, message: 'Exchange not found' });
    if (exchange.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for completed sessions' });
    }

    const userId = req.user._id.toString();
    const isRequester = exchange.requesterId.toString() === userId;
    const isProvider = exchange.providerId.toString() === userId;
    if (!isRequester && !isProvider) {
      return res.status(403).json({ success: false, message: 'Not a participant of this exchange' });
    }

    // The reviewer rates the other participant
    const revieweeId = isRequester ? exchange.providerId : exchange.requesterId;

    const feedback = await Feedback.create({
      reviewerId: req.user._id,
      revieweeId,
      exchangeId,
      rating,
      comment
    });

    // Recalculate reviewee's average rating
    const allFeedback = await Feedback.find({ revieweeId });
    const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allFeedback.length
    });

    res.status(201).json({
      success: true,
      review: formatFeedback(feedback),
      message: 'Feedback submitted! You earned 1 skill credit.'
    });
  } catch (err) {
    // Duplicate feedback
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already submitted feedback for this session' });
    }
    next(err);
  }
};

// GET /api/feedback/:userId
// Frontend uses this in Profile to show reviews
const getFeedbackForUser = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 });

    // Shape to match frontend's review object: { id, reviewerId, revieweeId, rating, comment, createdAt }
    const reviews = feedback.map(formatFeedback);
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFeedback, getFeedbackForUser };
