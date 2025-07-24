// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: String, // shared, updated, etc.
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  message: String,
  byUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Notification', notificationSchema);

