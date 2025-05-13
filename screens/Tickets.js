import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config.json";
import { useUser } from "../context/UserContext";
import { useTheme } from '../context/ThemeAndTextContext';

const TICKETS_STORAGE_KEY = 'user_tickets';
const LAST_SYNC_KEY = 'tickets_last_sync';

const Tickets = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const { user } = useUser();
  const token = user.token;

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

      if (!response.ok) throw new Error("Failed to fetch tickets");

      const data = await response.json();
      const ticketsData = data.tickets || [];
      setTickets(ticketsData);
      setIsOfflineData(false);
      saveTicketsLocally(ticketsData);
    } catch (error) {
      console.error(error);
      if (useOfflineIfFailed) {
        await loadLocalTickets();
      } else {
        Alert.alert("Error", "Could not fetch tickets. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    setLoading(true);
    loadLocalTickets().then(() => {
      fetchTickets();
    });
    
    return () => {}; // Cleanup function
  }, [token]) // Add token as dependency to refresh if user changes
);

  const handleRefresh = () => {
    fetchTickets(false);
  };

  const handleTicketPress = (ticket) => {
    navigation.navigate("TicketInfo", { ticket });
  };

  const formatSyncTime = (isoString) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const styles = getLocalStyles(isDarkMode, isTablet);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading tickets...</Text>
      ) : (
        <>
          {isOfflineData && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>
                Offline Mode • Last synced: {formatSyncTime(lastSynced)}
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}

          {tickets.length > 0 ? (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ticketContainer}
                  onPress={() => handleTicketPress(item)}
                >
                  <ImageBackground
                    source={require("../assets/deco.png")}
                    style={styles.ticketBackground}
                    imageStyle={{ borderRadius: 16, resizeMode: "stretch" }}
                  >
                    <View style={styles.overlay}>
                      <Text style={styles.ticketTitle}>{item.train.name}</Text>
                      <View style={styles.routeRow}>
                        <Text style={styles.station}>{item.start_station.name}</Text>
                        <Text style={styles.arrow}>→</Text>
                        <Text style={styles.station}>{item.end_station.name}</Text>
                      </View>

                      <View style={styles.timeRow}>
                        <View>
                          <Text style={styles.label}>Odchod:</Text>
                          <Text style={styles.value}>{item.arrival_time_at}</Text>
                        </View>
                        <View>
                          <Text style={styles.label}>Príchod:</Text>
                          <Text style={styles.value}>{item.departure_time_at}</Text>
                        </View>
                      </View>

                      <View style={styles.qrContainer}>
                        <QRCode value={`ticket-${item.id}`} size={isTablet ? 120 : 80} backgroundColor="white" />
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
              refreshing={loading}
              onRefresh={handleRefresh}
            />
          ) : (
            <Text style={styles.noTicketsText}>No tickets found</Text>
          )}
        </>
      )}
    </View>
  );
};

const getLocalStyles = (isDarkMode, isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
      paddingTop: isTablet ? 30 : 10,
    },
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
      fontSize: isTablet ? 20 : 16,
      textAlign: "center",
      marginTop: 20,
      color: "#888",
    },
    noTicketsText: {
      fontSize: isTablet ? 20 : 16,
      textAlign: "center",
      marginTop: 20,
      color: "#888",
    },
    ticketContainer: {
      marginHorizontal: isTablet ? 40 : 16,
      marginVertical: 10,
      borderRadius: 16,
      overflow: "hidden",
      elevation: 4,
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
    },
    ticketBackground: {
      padding: isTablet ? 30 : 20,
      justifyContent: "center",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 16,
      padding: isTablet ? 24 : 16,
    },
    ticketTitle: {
      fontSize: isTablet ? 28 : 22,
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
      fontSize: isTablet ? 18 : 16,
      color: "#fff",
      fontWeight: "600",
      marginHorizontal: 4,
    },
    arrow: {
      fontSize: isTablet ? 24 : 20,
      color: "#fff",
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
    },
    label: {
      fontSize: isTablet ? 16 : 14,
      color: "#ccc",
    },
    value: {
      fontSize: isTablet ? 16 : 14,
      color: "#fff",
      fontWeight: "500",
    },
    qrContainer: {
      alignItems: "center",
      marginTop: 10,
    },
  });

export default Tickets;
