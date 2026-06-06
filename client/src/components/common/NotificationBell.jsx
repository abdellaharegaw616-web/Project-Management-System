import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [prefs, setPrefs] = useState({ notifications: true });
  const { api } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('taskflow_preferences');
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!prefs.notifications) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [prefs.notifications]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
      // If API fails, keep notifications empty and show a friendly message when opened
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'task': return 'ðŸ“‹';
      case 'project': return 'ðŸ“';
      case 'team': return 'ðŸ‘¥';
      default: return 'ðŸ””';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {!prefs.notifications ? (
                <div className="text-center py-8 text-gray-500">
                  Notifications are disabled. <br />
                  <a href="/settings" className="text-brand-600 underline">Enable in Settings</a>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-brand-50' : ''
                    }`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-brand-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

