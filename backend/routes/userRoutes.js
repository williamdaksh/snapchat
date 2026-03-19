const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/users/search?q=username
router.get('/search', protect, async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, users: [] });
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
      ],
      _id: { $ne: req.user._id },
    })
      .select('username displayName bitmoji snapScore')
      .limit(10);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/users/:username — public profile
router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      'username displayName bitmoji snapScore streakCount friends createdAt'
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/users/add-friend
router.post('/add-friend', protect, async (req, res) => {
  const { username } = req.body;
  try {
    const friend = await User.findOne({ username });
    if (!friend) return res.status(404).json({ success: false, message: 'User not found.' });
    if (friend._id.equals(req.user._id))
      return res.status(400).json({ success: false, message: 'Cannot add yourself.' });

    const alreadyFriends = req.user.friends.some((f) => f.user.equals(friend._id));
    if (alreadyFriends)
      return res.status(409).json({ success: false, message: 'Already friends.' });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { friends: { user: friend._id } },
    });

    res.json({ success: true, message: `Added ${username} as a friend!` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
