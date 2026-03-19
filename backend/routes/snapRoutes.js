const express = require('express');
const { protect } = require('../middleware/auth');
const Snap = require('../models/Snap');
const User = require('../models/User');

const router = express.Router();

// POST /api/snaps/send
router.post('/send', protect, async (req, res) => {
  const { recipients, mediaType, caption, timer } = req.body;
  try {
    const snap = await Snap.create({
      sender: req.user._id,
      recipients: recipients.map((id) => ({ user: id })),
      mediaType: mediaType || 'image',
      caption,
      timer: timer || 3,
    });

    // Increase snap score
    await User.findByIdAndUpdate(req.user._id, { $inc: { snapScore: recipients.length } });

    res.status(201).json({ success: true, message: 'Snap sent! 👻', snap });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send snap.' });
  }
});

// GET /api/snaps/inbox — snaps received
router.get('/inbox', protect, async (req, res) => {
  try {
    const snaps = await Snap.find({
      'recipients.user': req.user._id,
      expiresAt: { $gt: new Date() },
    })
      .populate('sender', 'username displayName bitmoji')
      .sort({ createdAt: -1 });
    res.json({ success: true, snaps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/snaps/:id/open
router.patch('/:id/open', protect, async (req, res) => {
  try {
    const snap = await Snap.findOneAndUpdate(
      { _id: req.params.id, 'recipients.user': req.user._id },
      {
        $set: {
          'recipients.$.opened': true,
          'recipients.$.openedAt': new Date(),
        },
      },
      { new: true }
    );
    if (!snap) return res.status(404).json({ success: false, message: 'Snap not found.' });
    res.json({ success: true, message: 'Snap opened.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
