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
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStyles } from "../styles";
import config from "../config.json";
import { useUser } from "../context/UserContext";
import { useTheme } from '../context/ThemeContext';

const TICKETS_STORAGE_KEY = 'user_tickets';
const LAST_SYNC_KEY = 'tickets_last_sync';

const Tickets = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const { user } = useUser();
  const token = user.token;

  // Save tickets to AsyncStorage
  const saveTicketsLocally = async (ticketsData) => {
    try {
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(ticketsData));
      const now = new Date().toISOString();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now);
      setLastSynced(now);
    } catch (error) {
      console.error("Error saving tickets locally:", error);
    }
  };

  // Load tickets from AsyncStorage
  const loadLocalTickets = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
        setLastSynced(lastSync);
        setIsOfflineData(true);
      }
    } catch (error) {
      console.error("Error loading local tickets:", error);
    }
  };

  // Fetch tickets from the API
  const fetchTickets = async (useOfflineIfFailed = true) => {
    setLoading(true);
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
      const ticketsData = data.tickets || [];
      setTickets(ticketsData);
      setIsOfflineData(false);
      
      // Save the fresh data locally
      saveTicketsLocally(ticketsData);
    } catch (error) {
      console.error(error);
      
      if (useOfflineIfFailed) {
        // If online fetch fails, try to load local data
        await loadLocalTickets();
        if (!isOfflineData) {
          // do nothing 
           
        }
      } else {
        Alert.alert("Error", "Could not fetch tickets. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First try to load local data to show something immediately
    loadLocalTickets().then(() => {
      // Then try to fetch fresh data from API
      fetchTickets();
    });
  }, []);

  const handleRefresh = () => {
    fetchTickets(false); // Don't fall back to offline data on manual refresh
  };

  const handleTicketPress = (ticket) => {
    navigation.navigate("TicketInfo", { ticket });
  };

  const formatSyncTime = (isoString) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={localStyles.loadingText}>Loading tickets...</Text>
      ) : (
        <>
          {isOfflineData && (
            <View style={localStyles.offlineBanner}>
              <Text style={localStyles.offlineText}>
                Offline Mode • Last synced: {formatSyncTime(lastSynced)}
              </Text>
              <TouchableOpacity 
                style={localStyles.refreshButton}
                onPress={handleRefresh}
              >
                <Text style={localStyles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {tickets.length > 0 ? (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={localStyles.ticketContainer}
                  onPress={() => handleTicketPress(item)}
                >
                  <ImageBackground
                    source={require("../assets/deco.png")}
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
              refreshing={loading}
              onRefresh={handleRefresh}
            />
          ) : (
            <Text style={localStyles.noTicketsText}>No tickets found</Text>
          )}
        </>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#f8d7da',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineText: {
    color: '#721c24',
    fontSize: 12,
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#721c24',
    padding: 6,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 12,
  },
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