import axios from '../axiosConfig';

const API = 'http://localhost:5000/tasks';

// Get all tasks (owned by current user)
export const getTasks = () => axios.get(API);

// Get a single task by ID
export const getTask = (id) => axios.get(`${API}/${id}`);

// Create a new task (supports attachments)
// Create a new task (expects FormData from caller)
export const createTask = (formData) =>
  axios.post(API, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });


// Update an existing task
export const updateTask = (id, task) => axios.put(`${API}/${id}`, task);

// Delete a task
export const deleteTask = (id) => axios.delete(`${API}/${id}`);

// Get tasks shared with the current user
export const getSharedTasks = () => axios.get(`${API}/shared`);

// Share task with user(s)
export const shareTask = (id, userIds) =>
  axios.put(`${API}/${id}/share`, { userIds });

