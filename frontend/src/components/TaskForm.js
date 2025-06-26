import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskService';

const TaskForm = ({ onTaskSaved, task }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (task) setForm(task);
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.dueDate) return;

    if (task) {
      await updateTask(task._id, form);
    } else {
      await createTask(form);
    }

    setForm({ title: '', description: '', dueDate: '', status: 'Pending' });
    if (onTaskSaved) onTaskSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h5>{task ? 'Edit Task' : 'Add New Task'}</h5>

      <input name="title" className="form-control mb-2" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea name="description" className="form-control mb-2" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="dueDate" type="date" className="form-control mb-2" value={form.dueDate?.split('T')[0]} onChange={handleChange} />

      <select name="status" className="form-select mb-2" value={form.status} onChange={handleChange}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <button type="submit" className="btn btn-primary">
        {task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;

