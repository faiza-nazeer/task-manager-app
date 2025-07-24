const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');

// Middleware for validation
const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed'])
];

// Routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

