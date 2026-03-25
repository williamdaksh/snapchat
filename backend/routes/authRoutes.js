const express = require('express');
const {login , register} = require('../controllers/authController')
const User = require('../models/User')

const router = express.Router();





// ── Routes ──────────────────────────────────────────────────
router.post('/register', register);
router.post('/login',login);
router.post('/forget',async (req,res)=>{
const data = req.body;

const savedUser = await User.create(data);

   res.send({
    message:"data",
    savedUser,
   })
})

router.post("/save", async (req, res) => {
  try {
    const savedUser = await User.create(req.body);
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.post('/logout', protect, logout);
// router.get('/me', protect, getMe);
// router.post('/check-username', checkUsername);
// router.post('/forgot-password', authLimiter, forgotPassword);

module.exports = router;
