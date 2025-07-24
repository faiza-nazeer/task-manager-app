// src/Register.js
import React, { useState } from 'react';
import axios from './axiosConfig';

function Register({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      setErr(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Register</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" value={name}
            onChange={(e) => setName(e.target.value)} required />
        </div>
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
        <button className="btn btn-success w-100">Register</button>
      </form>
      <p className="text-center mt-3">
        Already have an account?{' '}
        <button className="btn btn-link p-0" onClick={onSwitch}>Login</button>
      </p>
    </div>
  );
}

export default Register;

