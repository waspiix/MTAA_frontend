import React from 'react';
import { View, Text, Image, ScrollView, useWindowDimensions } from 'react-native';
import { useNotifications } from '../context/NotificationsContext';
import { getStyles } from '../styles';
import { useTheme } from '../context/ThemeAndTextContext';

const NotificationsScreen = () => {
  const { notifications } = useNotifications();
  const { isDarkMode, isBiggerText } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isDarkMode, isTablet, isBiggerText); 

  // Získaj aktuálny dátum raz pre všetky notifikácie
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${now.getFullYear()}`;

  return (
    <ScrollView style={[styles.container, { padding: 20 }]}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        notifications.map((notif) => (
          <View key={notif.id} style={styles.tile}>
            <View style={styles.notificationRow}>
              <Image
                source={require("../assets/notification.png")}
                style={styles.smallProfileImage}
              />
              <View style={styles.notificationContent}>
                <Text style={styles.tileTitle}>{notif.title}</Text>
                <Text style={styles.tileSubtitle}>{notif.body}</Text>
                <Text style={styles.tileSubtitleTime}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default NotificationsScreen;
