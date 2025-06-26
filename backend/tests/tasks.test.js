const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const taskRoutes = require('../routes/taskRoutes');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/taskdb_test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Task API', () => {
  it('GET /api/tasks → should return an array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/tasks → should create a task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2025-12-31',
      status: 'Pending',
    };

    const res = await request(app).post('/api/tasks').send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });
});

