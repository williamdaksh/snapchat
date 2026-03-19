const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null, // optional
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    bitmoji: {
      type: String,
      default: '👻',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);