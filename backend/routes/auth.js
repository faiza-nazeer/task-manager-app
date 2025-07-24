const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 🔐 Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await new User({ name, email, password }).save();

  const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
});

// 🔓 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET);
  res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
});

module.exports = router;

