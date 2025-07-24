// routes/analyticsRoutes.js
const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// ✅ GET /analytics/overview
router.get('/overview', async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Task.countDocuments({ owner: userId });
    const completed = await Task.countDocuments({ owner: userId, status: 'Completed' });
    const pending = await Task.countDocuments({ owner: userId, status: { $ne: 'Completed' } });

    res.json({ total, completed, pending });
  } catch (err) {
    console.error('Overview analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /analytics/trends
router.get('/trends', async (req, res) => {
  try {
    const userId = req.user._id;

    const trends = await Task.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            week: { $isoWeek: '$createdAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.week': 1,
        },
      },
    ]);

    res.json(trends);
  } catch (err) {
    console.error('Trends analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

