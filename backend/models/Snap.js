const mongoose = require('mongoose');

const snapSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipients: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        opened: { type: Boolean, default: false },
        openedAt: { type: Date, default: null },
        screenshotted: { type: Boolean, default: false },
      },
    ],
    mediaType: {
      type: String,
      enum: ['image', 'video', 'text'],
      default: 'image',
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      maxlength: 250,
      default: null,
    },
    timer: {
      type: Number,
      min: 1,
      max: 10,
      default: 3, // seconds visible
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

// Auto-delete expired snaps
snapSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Snap', snapSchema);
