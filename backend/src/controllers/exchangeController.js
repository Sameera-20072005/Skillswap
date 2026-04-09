const ExchangeRequest = require('../models/ExchangeRequest');
const User = require('../models/User');

// Shape an exchange document into the object the frontend expects
const formatExchange = (ex) => ({
  id: ex._id,
  requesterId: ex.requesterId._id || ex.requesterId,
  providerId: ex.providerId._id || ex.providerId,
  skillOffered: ex.skillOffered,
  skillRequested: ex.skillRequested,
  sessionDuration: ex.sessionDuration,
  sessionMode: ex.sessionMode,
  meetingLink: ex.meetingLink,
  scheduledDate: ex.scheduledDate,
  scheduledTime: ex.scheduledTime,
  message: ex.message,
  status: ex.status,
  markedCompleteByRequester: ex.markedCompleteByRequester,
  markedCompleteByProvider: ex.markedCompleteByProvider,
  completedAt: ex.completedAt,
  createdAt: ex.createdAt
});

// POST /api/exchange/request
// Frontend sends: skillOffered, skillRequested, sessionDuration, sessionMode,
//                 meetingLink, preferredDate, preferredTime, message, providerId
const createRequest = async (req, res, next) => {
  try {
    const {
      providerId,
      skillOffered,
      skillRequested,
      sessionDuration,
      sessionMode,
      meetingLink,
      preferredDate,
      preferredTime,
      message
    } = req.body;

    if (!providerId || !skillOffered || !skillRequested) {
      return res.status(400).json({ success: false, message: 'providerId, skillOffered and skillRequested are required' });
    }

    const exchange = await ExchangeRequest.create({
      requesterId: req.user._id,
      providerId,
      skillOffered,
      skillRequested,
      sessionDuration: sessionDuration || '1 hour',
      sessionMode: sessionMode || 'online',
      meetingLink: meetingLink || '',
      scheduledDate: preferredDate || '',
      scheduledTime: preferredTime || '',
      message: message || ''
    });

    res.status(201).json({ success: true, exchange: formatExchange(exchange) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/exchange/accept/:id
// Accepting moves status to "scheduled"
const acceptRequest = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) return res.status(404).json({ success: false, message: 'Exchange not found' });

    if (exchange.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the receiver can accept this request' });
    }
    if (exchange.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be accepted' });
    }

    const { meetingLink } = req.body;
    exchange.status = 'scheduled';
    if (meetingLink) exchange.meetingLink = meetingLink;
    await exchange.save();

    res.json({ success: true, exchange: formatExchange(exchange) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/exchange/reject/:id
const rejectRequest = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) return res.status(404).json({ success: false, message: 'Exchange not found' });

    if (exchange.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the receiver can reject this request' });
    }
    if (exchange.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be rejected' });
    }

    exchange.status = 'rejected';
    await exchange.save();

    res.json({ success: true, exchange: formatExchange(exchange) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/exchange/complete/:id
// Either party can mark complete; when both do, status → completed and credits awarded
const completeSession = async (req, res, next) => {
  try {
    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) return res.status(404).json({ success: false, message: 'Exchange not found' });

    if (exchange.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: 'Only scheduled sessions can be marked complete' });
    }

    const userId = req.user._id.toString();
    const isRequester = exchange.requesterId.toString() === userId;
    const isProvider = exchange.providerId.toString() === userId;

    if (!isRequester && !isProvider) {
      return res.status(403).json({ success: false, message: 'Not a participant of this exchange' });
    }

    if (isRequester) exchange.markedCompleteByRequester = true;
    if (isProvider) exchange.markedCompleteByProvider = true;

    // Both marked → fully complete
    if (exchange.markedCompleteByRequester && exchange.markedCompleteByProvider) {
      exchange.status = 'completed';
      exchange.completedAt = new Date();

      // Award 1 skill credit to each participant
      await User.findByIdAndUpdate(exchange.requesterId, { $inc: { skillCredits: 1 } });
      await User.findByIdAndUpdate(exchange.providerId, { $inc: { skillCredits: 1 } });
    }

    await exchange.save();

    res.json({
      success: true,
      exchange: formatExchange(exchange),
      message: exchange.status === 'completed'
        ? 'Session completed! Both users earned 1 skill credit.'
        : 'Marked as complete. Waiting for the other participant.'
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/exchange/my-requests  — exchanges the current user sent
const getMyRequests = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({ requesterId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, exchanges: exchanges.map(formatExchange) });
  } catch (err) {
    next(err);
  }
};

// GET /api/exchange/received-requests  — exchanges the current user received
const getReceivedRequests = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({ providerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, exchanges: exchanges.map(formatExchange) });
  } catch (err) {
    next(err);
  }
};

// GET /api/exchange/all  — all exchanges involving the current user (used by Dashboard & SessionTracker)
const getAllMyExchanges = async (req, res, next) => {
  try {
    const exchanges = await ExchangeRequest.find({
      $or: [{ requesterId: req.user._id }, { providerId: req.user._id }]
    }).sort({ createdAt: -1 });

    res.json({ success: true, exchanges: exchanges.map(formatExchange) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/exchange/:id/meeting-link  — add/update meeting link after acceptance
const updateMeetingLink = async (req, res, next) => {
  try {
    const { meetingLink } = req.body;
    if (!meetingLink) return res.status(400).json({ success: false, message: 'meetingLink is required' });

    const exchange = await ExchangeRequest.findById(req.params.id);
    if (!exchange) return res.status(404).json({ success: false, message: 'Exchange not found' });

    const userId = req.user._id.toString();
    if (exchange.requesterId.toString() !== userId && exchange.providerId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not a participant of this exchange' });
    }

    exchange.meetingLink = meetingLink;
    await exchange.save();

    res.json({ success: true, exchange: formatExchange(exchange) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRequest,
  acceptRequest,
  rejectRequest,
  completeSession,
  getMyRequests,
  getReceivedRequests,
  getAllMyExchanges,
  updateMeetingLink
};
