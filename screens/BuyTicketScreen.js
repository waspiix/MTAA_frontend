import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext'; // Import useUser hook
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";
import { Ionicons } from '@expo/vector-icons';


export default function BuyTicketScreen({ route, navigation }) {
  const { train } = route.params;
  const { user } = useUser(); // Access the user context to get the token and user info
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // When user clicks "Buy Ticket"
  const startPayment = async () => {
    try {

      const response = await fetch(`${config.API_URL}/payment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`, // Include the token for authentication
        },
        body: JSON.stringify({
          user_id: user.id, // User ID from context
          train_id: train.id, // Train ID from route params
          start_station: train.routes[0].station_name, // Start station
          end_station: train.routes[train.routes.length - 1].station_name, // End station
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const paymentUrl = data.url;

      navigation.navigate('PaymentScreen', { paymentUrl });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to start payment. Please try again.');
    }
  };


  return (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
    </TouchableOpacity>

    <Text style={styles.title}>Buy Ticket for {train.name}</Text>

    <Text style={styles.subtitle}>From: {train.routes[0].station_name}</Text>
    <Text style={styles.subtitle}>To: {train.routes[train.routes.length - 1].station_name}</Text>
    <Text style={styles.subtitle}>Departure: {train.routes[0].departure_time}</Text>
    <Text style={styles.subtitle}>Arrival: {train.routes[train.routes.length - 1].departure_time}</Text>

    <Button title="Confirm Purchase" onPress={startPayment} />
  </View>
  );
}

