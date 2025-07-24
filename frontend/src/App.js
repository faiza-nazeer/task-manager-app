import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import NotificationToast from './components/NotificationToast';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import socket from './socket';
import { fetchNotifications } from './services/notificationService';
import notificationSound from './assets/notification.mp3';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [view, setView] = useState('tasks'); // 'tasks' or 'dashboard'

  const user = JSON.parse(localStorage.getItem('user'));

  const handleTaskAdded = () => setRefresh(!refresh);

  // 🌓 Apply dark mode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // 🔔 Load past notifications
  useEffect(() => {
    if (!user) return;
    fetchNotifications()
      .then((res) => {
        const loaded = res.data.map((n) => ({
          message: n.message,
          timestamp: new Date(n.createdAt).getTime(),
          byName: n.byUser?.name || 'Someone',
        }));
        setNotifications(loaded);
      })
      .catch((err) => {
        console.error('Failed to load notifications', err);
      });
  }, [user]);

  // 🔔 Real-time notifications
  useEffect(() => {
    if (!user) return;

    const audio = new Audio(notificationSound);

    const handleIncoming = (data) => {
      audio.play();
      navigator.vibrate?.(200);
      const note = {
        message: data.message,
        timestamp: Date.now(),
        byName: data.byName || 'Someone',
      };
      setNotifications((prev) => [note, ...prev]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(0, -1));
      }, 5000);
    };

    socket.on('taskShared', handleIncoming);
    socket.on('taskUpdated', handleIncoming);

    return () => {
      socket.off('taskShared', handleIncoming);
      socket.off('taskUpdated', handleIncoming);
    };
  }, [user]);

  // 🌓 Toggle dark mode
  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
    document.body.classList.toggle('dark-mode', next);
  };

  // 🔐 Login/Register
  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitch={() => setAuthMode('register')} />
    ) : (
      <Register onSwitch={() => setAuthMode('login')} />
    );
  }

  // ✅ Authenticated UI
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Task Manager</h1>

      {/* 🔼 Top Buttons */}
      <div className="text-end mb-3">
        <button className="btn btn-outline-primary me-2" onClick={toggleDark}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button
          className="btn btn-outline-info me-2"
          onClick={() => setView(view === 'dashboard' ? 'tasks' : 'dashboard')}
        >
          {view === 'dashboard' ? '📝 Task Manager' : '📊 Dashboard'}
        </button>
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide' : 'Show'} Notifications
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔔 Toasts */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {notifications
          .slice(0, showHistory ? notifications.length : 1)
          .map((note, idx) => (
            <NotificationToast
              key={idx}
              notification={note}
              onClose={() =>
                setNotifications(notifications.filter((_, i) => i !== idx))
              }
            />
          ))}
      </div>

      {/* ✅ Main Content View */}
      {view === 'dashboard' ? (
        <Dashboard />
      ) : (
        <>
          <TaskForm onTaskAdded={handleTaskAdded} />
          <TaskList key={refresh} />
        </>
      )}
    </div>
  );
}

export default App;

