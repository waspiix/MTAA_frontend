import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // Ensure this is installed
import styles from "../styles"; // Import shared styles
import config from "../config.json"; // Import API URL from config
import { useUser } from "../context/UserContext"; // Import useUser hook

const Tickets = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser(); // Access the user context to get the token and user info
  const token = user.token; // Assuming you have a token in your user context

  // Fetch tickets from the API
  const fetchTickets = async () => {
    try {
      const response = await fetch(`${config.API_URL}/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      console.log("Response:", data); // Log the response for debugging
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
    Alert.alert("Ticket Selected", `You selected ticket for ${ticket.train.name}`);
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
              style={localStyles.ticketContainer}
              onPress={() => handleTicketPress(item)}
            >
              <ImageBackground
                source={require("../assets/deco.png")} // Add your ticket background image here
                style={localStyles.ticketBackground}
                imageStyle={{ borderRadius: 16, resizeMode: "stretch" }}
              >
                <View style={localStyles.overlay}>
                  <Text style={localStyles.ticketTitle}>{item.train.name}</Text>
                  <View style={localStyles.routeRow}>
                    <Text style={localStyles.station}>{item.start_station.name}</Text>
                    <Text style={localStyles.arrow}>→</Text>
                    <Text style={localStyles.station}>{item.end_station.name}</Text>
                  </View>

                  <View style={localStyles.timeRow}>
                    <View>
                      <Text style={localStyles.label}>Odchod:</Text>
                      <Text style={localStyles.value}>{item.arrival_time_at}</Text>
                    </View>
                    <View>
                      <Text style={localStyles.label}>Príchod:</Text>
                      <Text style={localStyles.value}>{item.departure_time_at}</Text>
                    </View>
                  </View>

                  <View style={localStyles.qrContainer}>
                    <QRCode
                      value={`ticket-${item.id}`}
                      size={80}
                      backgroundColor="white"
                    />
                    
                  </View>
                </View>
              </ImageBackground>
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
  ticketContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
    
  },
  ticketBackground: {
    padding: 20,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.49)",
    borderRadius: 16,
    padding: 16,
  },
  ticketTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: 'monospace',
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  station: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 4,
  },
  arrow: {
    fontSize: 20,
    color: "#fff",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#ccc",
  },
  value: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  ticketId: {
    marginTop: 4,
    color: "#eee",
    fontSize: 12,
  },
});

export default Tickets;