import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useNotifications } from '../context/NotificationsContext';
import { getStyles } from '../styles';
import { useTheme } from '../context/ThemeContext';

const NotificationsScreen = () => {
  const { notifications } = useNotifications();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Získaj aktuálny dátum raz pre všetky notifikácie
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${now.getFullYear()}`;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {notifications.map((notif) => (
        <View key={notif.id} style={styles.tile}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require("../assets/notification.png")}
              style={styles.smallProfileImage}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.tileTitle}>{notif.title}</Text>
              <Text style={styles.tileSubtitle}>{notif.body}</Text>
              <Text style={styles.tileSubtitleTime}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
