// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /notifications — get all for current user
router.get('/', async (req, res) => {
  try {
    const notes = await Notification.find({
      // Either they shared/updated or are in sharedWith
      byUser: req.user._id
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err });
  }
});

module.exports = router;

