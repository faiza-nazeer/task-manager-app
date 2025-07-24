import React from 'react';
import './toast.css';

const NotificationToast = ({ notification, onClose }) => {
  return (
    <div className="toast show align-items-center text-white bg-dark border-0 mb-2" role="alert">
      <div className="d-flex">
        <div className="toast-body">
          <strong>{notification.message}</strong>
          <div className="small text-muted">
            By: {notification.byName} • {new Date(notification.timestamp).toLocaleString()}
          </div>
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default NotificationToast;

