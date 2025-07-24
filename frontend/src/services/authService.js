import axios from '../axiosConfig';

export const loginUser = async (credentials) => {
  const res = await axios.post('/auth/login', credentials);
  const { token, user } = res.data;

  // ⏺ Save token & user to localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return res.data;
};

