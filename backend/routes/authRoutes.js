const express = require('express');
const {login , register} = require('../controllers/authController')


const router = express.Router();





// ── Routes ──────────────────────────────────────────────────
router.post('/register', register);
router.post('/login',login);
// router.post('/logout', protect, logout);
// router.get('/me', protect, getMe);
// router.post('/check-username', checkUsername);
// router.post('/forgot-password', authLimiter, forgotPassword);

module.exports = router;
