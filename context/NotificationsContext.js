import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Pridaj novú notifikáciu do zoznamu
  const addNotification = (notification) => {
    const id = Date.now().toString(); // jednoduché unikátne ID
    setNotifications((prev) => [
      { id, title: notification.request.content.title, body: notification.request.content.body },
      ...prev,
    ]);
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      addNotification(notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);