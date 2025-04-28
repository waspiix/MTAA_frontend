import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';





export default function BuyTicketScreen({ route, navigation }) {
  const { train } = route.params;

  // When user clicks "Buy Ticket"
const startPayment = async () => {
  try {
    const response = await fetch(`${config.API_URL}/payments/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // sending empty body like in axios
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const paymentUrl = data.url;

    navigation.navigate('PaymentScreen', { paymentUrl });

  } catch (error) {
    console.error(error);
    // show error message
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