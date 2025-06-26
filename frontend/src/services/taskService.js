import axios from 'axios';

// Backend API base URL
const API = 'http://localhost:5000/tasks';

// CRUD Operations
export const getTasks = () => axios.get(API);

export const getTask = (id) => axios.get(`${API}/${id}`);

export const createTask = (task) => axios.post(API, task);

export const updateTask = (id, task) => axios.put(`${API}/${id}`, task);

export const deleteTask = (id) => axios.delete(`${API}/${id}`);

