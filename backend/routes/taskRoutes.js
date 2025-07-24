const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Task = require('../models/Task');
const Notification = require('../models/Notification');

// 🗂️ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ GET /tasks/shared — tasks shared with current user
router.get('/shared', async (req, res) => {
  const tasks = await Task.find({ sharedWith: req.user._id });
  res.json(tasks);
});

// ✅ GET /tasks — all tasks owned by current user
router.get('/', async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });
  res.json(tasks);
});

// ✅ POST /tasks — create task with optional file upload
router.post(
  upload.single('attachment'), // ⬅️ accept single file under field 'attachment'
  body('title').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const task = new Task({
      ...req.body,
      owner: req.user._id,
      attachmentPath: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await task.save();
    res.status(201).json(task);
  }
);

// ✅ PUT /tasks/:id — update task (owner only) + emit + notify
router.put('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (!task.owner.equals(req.user._id))
    return res.status(403).json({ message: 'Not authorized' });

  Object.assign(task, req.body);
  await task.save();

  const message = `Task "${task.title}" was updated`;

  req.io.emit('taskUpdated', {
    message,
    taskId: task._id,
    byName: req.user.name || 'Unknown',
  });

  await new Notification({
    type: 'updated',
    taskId: task._id,
    message,
    byUser: req.user._id,
  }).save();

  res.json(task);
});

// ✅ DELETE /tasks/:id — delete task
router.delete('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (!task.owner.equals(req.user._id))
    return res.status(403).json({ message: 'Not authorized' });

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});

// ✅ PUT /tasks/:id/share — share with users + notify
router.put('/:id/share', async (req, res) => {
  const { userIds } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (!task.owner.equals(req.user._id))
    return res.status(403).json({ message: 'Only the owner can share' });

  task.sharedWith = Array.from(new Set([...task.sharedWith, ...userIds]));
  await task.save();

  const message = `Task "${task.title}" was shared`;

  req.io.emit('taskShared', {
    message,
    taskId: task._id,
    sharedWith: userIds,
    byName: req.user.name || 'Unknown',
  });

  await new Notification({
    type: 'shared',
    taskId: task._id,
    message,
    byUser: req.user._id,
  }).save();

  res.json({ message: 'Task shared successfully', task });
});

module.exports = router;

