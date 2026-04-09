const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    // Frontend uses requesterId / providerId
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    skillOffered: { type: String, required: true },
    skillRequested: { type: String, required: true },

    // Live session fields
    sessionDuration: {
      type: String,
      enum: ['30 minutes', '1 hour', '2 hours'],
      default: '1 hour'
    },
    sessionMode: {
      type: String,
      enum: ['online', 'in-person', 'video', 'audio', 'chat', 'screenshare'],
      default: 'video'
    },
    meetingLink: { type: String, default: '' },

    // Schedule — frontend uses scheduledDate / scheduledTime
    scheduledDate: { type: String, default: '' },
    scheduledTime: { type: String, default: '' },

    message: { type: String, default: '' },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'scheduled', 'completed', 'rejected'],
      default: 'pending'
    },

    // Completion tracking
    markedCompleteByRequester: { type: Boolean, default: false },
    markedCompleteByProvider: { type: Boolean, default: false },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
