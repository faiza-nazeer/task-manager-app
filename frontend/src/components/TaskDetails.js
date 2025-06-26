import React from 'react';

const TaskDetails = ({ task, onBack }) => {
  return (
    <div className="card card-body mb-4">
      <h5>Task Details</h5>
      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Due Date:</strong> {task.dueDate?.split('T')[0]}</p>
      <button className="btn btn-secondary mt-2" onClick={onBack}>Back</button>
    </div>
  );
};

export default TaskDetails;

