const express = require('express');
const router = express.Router();
const {
  createRequest,
  acceptRequest,
  rejectRequest,
  completeSession,
  getMyRequests,
  getReceivedRequests,
  getAllMyExchanges,
  updateMeetingLink
} = require('../controllers/exchangeController');
const { protect } = require('../middleware/auth');

router.post('/request', protect, createRequest);
router.put('/accept/:id', protect, acceptRequest);
router.put('/reject/:id', protect, rejectRequest);
router.put('/complete/:id', protect, completeSession);
router.get('/my-requests', protect, getMyRequests);
router.get('/received-requests', protect, getReceivedRequests);
router.get('/all', protect, getAllMyExchanges);
router.put('/:id/meeting-link', protect, updateMeetingLink);

module.exports = router;
