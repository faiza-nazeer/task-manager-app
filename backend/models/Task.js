const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  dueDate: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [
    {
      filename: String,
      originalName: String,
      url: String
    }
  ]
}, { timestamps: true });

// ✅ Add this line to export the model
module.exports = mongoose.model('Task', taskSchema);

