import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext'; // Import useUser hook




export default function BuyTicketScreen({ route, navigation }) {
  const { train } = route.params;
  const { user } = useUser(); // Access the user context to get the token and user info

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
      <Text style={styles.title}>Buy Ticket for {train.name}</Text>
      <Text style={styles.subtitle}>From: {train.routes[0].station_name}</Text>
      <Text style={styles.subtitle}>To: {train.routes[train.routes.length - 1].station_name}</Text>
      <Text style={styles.subtitle}>Departure: {train.routes[0].departure_time}</Text>
      <Text style={styles.subtitle}>Arrival: {train.routes[train.routes.length - 1].departure_time}</Text>

      <Button
        title="Confirm Purchase"
        onPress={() => {
          // Handle ticket purchase logic here
          
          startPayment(); // Call the payment function
          
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 8 },
});