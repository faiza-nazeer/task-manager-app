// src/Login.js
import React, { useState } from 'react';
import axios from './axiosConfig';

function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Login</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        Don't have an account?{' '}
        <button className="btn btn-link p-0" onClick={onSwitch}>Register</button>
      </p>
    </div>
  );
}

export default Login;

