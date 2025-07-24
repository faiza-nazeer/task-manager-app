import React, { useState } from 'react';
import { createTask } from '../services/taskService';

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);
      if (dueDate) formData.append('dueDate', dueDate);
      if (attachment) formData.append('attachment', attachment);

      await createTask(formData);
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDueDate('');
      setAttachment(null);
      onTaskAdded();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          placeholder="Description (optional)"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setAttachment(e.target.files[0])}
        />
        {attachment && (
          <div className="form-text text-success mt-1">
            Attached: {attachment.name}
          </div>
        )}
      </div>

      <button className="btn btn-primary">Add Task</button>
    </form>
  );
}

export default TaskForm;

