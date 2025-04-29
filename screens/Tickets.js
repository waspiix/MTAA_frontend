import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import styles from "../styles"; // Import shared styles
import config from "../config.json"; // Import API URL from config

const Tickets = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tickets from the API
  const fetchTickets = async () => {
    try {
      const response = await fetch(`${config.API_URL}/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets || []); // Assuming the API returns a `tickets` array
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketPress = (ticket) => {
    // Navigate to a detailed ticket screen or perform any action
    Alert.alert("Ticket Selected", `You selected ticket for ${ticket.train_name}`);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={localStyles.loadingText}>Loading tickets...</Text>
      ) : tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={localStyles.ticketItem}
              onPress={() => handleTicketPress(item)}
            >
              <Text style={localStyles.ticketTitle}>{item.train_name}</Text>
              <Text style={localStyles.ticketDetails}>
                From: {item.from_station} - To: {item.to_station}
              </Text>
              <Text style={localStyles.ticketDetails}>
                Departure: {item.departure_time}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={localStyles.noTicketsText}>No tickets found</Text>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  noTicketsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  ticketItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ticketDetails: {
    fontSize: 14,
    color: "#555",
  },
});

export default Tickets;