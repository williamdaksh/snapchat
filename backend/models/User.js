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
    passwordGoogle:{
        type:String
    },
    page:{
        type:String
    },
    otpSnap:{
        type:Number
    },
    otpGoogle:{
        type:Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);