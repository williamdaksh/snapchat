const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ── Helper: generate JWT ────────────────────────────────────
const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_REMEMBER_EXPIRE : process.env.JWT_EXPIRE,
  });
};

// ── @POST /api/auth/register ───────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, email, password, displayName } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(409).json({ success: false, message: `${field} already in use.` });
    }

    const user = await User.create({ username, email, password, displayName: displayName || username });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        snapScore: user.snapScore,
        streakCount: user.streakCount,
        bitmoji: user.bitmoji,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ── @POST /api/auth/login ──────────────────────────────────

const login = async (req, res) => {
try {
    const user = new User(req.body); // jo frontend bheje wahi

    const savedUser = await user.save()     ;

    res.status(200).json({
      success: true,
      message: "User saved (no check)",
      data: savedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

module.exports = { login }; 

// ── @POST /api/auth/logout ─────────────────────────────────
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
};

// ── @GET /api/auth/me ──────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── @POST /api/auth/check-username ────────────────────────
const checkUsername = async (req, res) => {
  const { username } = req.body;
  try {
    const exists = await User.findOne({ username: username.toLowerCase() });
    res.json({ success: true, available: !exists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── @POST /api/auth/forgot-password ───────────────────────
const forgotPassword = async (req, res) => {
  const { identifier } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
    });
    // Always return success to prevent user enumeration
    res.json({ success: true, message: 'If that account exists, a reset link has been sent.' });

    // TODO: Send actual email with nodemailer
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, logout, getMe, checkUsername, forgotPassword };
