import React, { useState, useEffect } from 'react';
import { Notification, NotificationType } from '../types';

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType = 'info', duration = 3000): void => {
    const id = Date.now();
    const notification: Notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: number): void => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  const getIcon = (type: NotificationType): string => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`notification notification--${notification.type} notification--show`}
        >
          <div className="notification__icon">{getIcon(notification.type)}</div>
          <div className="notification__content">
            <div className="notification__message">{notification.message}</div>
          </div>
          <button 
            className="notification__close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;
