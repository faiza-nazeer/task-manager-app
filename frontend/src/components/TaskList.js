import React, { useEffect, useState } from 'react';
import {
  getTasks,
  getSharedTasks,
  deleteTask,
  updateTask,
} from '../services/taskService';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState('my'); // 'my' or 'shared'

  useEffect(() => {
    fetchTasks();
  }, [view]);

  const fetchTasks = async () => {
    const res = view === 'shared' ? await getSharedTasks() : await getTasks();
    setTasks(res.data);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleComplete = async (task) => {
    await updateTask(task._id, { ...task, status: 'Completed' });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h5 mb-0">Task List ({view === 'my' ? 'My Tasks' : 'Shared With Me'})</h2>
        <div>
          <button
            className={`btn btn-sm me-2 ${view === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('my')}
          >
            My Tasks
          </button>
          <button
            className={`btn btn-sm ${view === 'shared' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('shared')}
          >
            Shared With Me
          </button>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Progress: {completionRate}%</label>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
        </div>
      </div>

      {editingTask ? (
        <TaskForm
          task={editingTask}
          onTaskSaved={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      ) : selectedTask ? (
        <TaskDetails task={selectedTask} onBack={() => setSelectedTask(null)} />
      ) : (
        <ul className="list-group">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="list-group-item d-flex justify-content-between align-items-start flex-wrap"
            >
              <div
                onClick={() => setSelectedTask(task)}
                style={{ cursor: 'pointer', flex: 1 }}
              >
                <strong>{task.title}</strong>
                <div className="text-muted small">{task.dueDate?.split('T')[0]}</div>
                <span className="badge bg-secondary mt-1">{task.status}</span>

                {task.attachment && (
                  <div className="mt-2">
                    <strong>Attachment: </strong>
                    {task.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={`http://localhost:5000/${task.attachment}`}
                        alt="attachment"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          marginTop: '5px',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:5000/${task.attachment}`}
                        download
                        className="btn btn-sm btn-outline-primary mt-1"
                      >
                        Download File
                      </a>
                    )}
                  </div>
                )}
              </div>

              {view === 'my' && (
                <div className="btn-group mt-2 mt-sm-0">
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => handleComplete(task)}
                      className="btn btn-sm btn-success"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => setEditingTask(task)}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

