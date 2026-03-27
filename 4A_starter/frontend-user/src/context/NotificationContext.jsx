import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss après 3 secondes
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Fonctions helper
  const success = (message) => addNotification(message, 'success');
  const error = (message) => addNotification(message, 'error');
  const info = (message) => addNotification(message, 'info');
  const warning = (message) => addNotification(message, 'warning');

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
}

function ToastContainer({ notifications, onClose }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Toast 
          key={notification.id} 
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
}

function Toast({ notification, onClose }) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className={`${colors[notification.type]} text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-3 animate-slide-in`}>
      <span>{notification.message}</span>
      <button onClick={onClose} className="hover:text-gray-200">
        ✕
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  
  return context;
}
