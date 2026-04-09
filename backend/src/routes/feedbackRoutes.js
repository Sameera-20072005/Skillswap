const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackForUser } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.post('/', protect, submitFeedback);
router.get('/:userId', protect, getFeedbackForUser);

module.exports = router;
