import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
  Animated,
  ScrollView
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import TimeLine from "../components/TimeLine";
import { useTheme } from '../context/ThemeContext';
import { getStyles } from '../styles';

const TicketInfo = ({ route }) => {
  const { ticket } = route.params;
  const { isDarkMode } = useTheme();
  const baseStyles = getStyles(isDarkMode);

  const stations = ticket.train.routes;
  const allStations = ticket.train.routes;
  const train = ticket.train;
  const startStationId = ticket.start_station.id;
  const endStationId = ticket.end_station.id;
  const startIndex = allStations.findIndex(station => station.station_id === startStationId);
  const endIndex = allStations.findIndex(station => station.station_id === endStationId);
  const filteredStations = allStations.slice(
    startIndex !== -1 ? startIndex : 0,
    endIndex !== -1 ? endIndex + 1 : allStations.length
  );

  const formatTime = (time) => {
    if (!time) return "N/A";
    
    try {
      // Split by 'T' to get the time part
      const timePart = time.split('T')[1];
      
      if (!timePart) {
        // If there's no 'T', try to parse as direct time string like "14:30:00"
        const parts = time.split(':');
        if (parts.length >= 2) {
          // Only take hours and minutes
          const hours = parts[0].padStart(2, '0');
          const minutes = parts[1].padStart(2, '0');
          return `${hours}:${minutes}`;
        }
        return "N/A";
      }
      
      // Extract hours and minutes from the time part
      const timeComponents = timePart.split(':');
      if (timeComponents.length >= 2) {
        const hours = timeComponents[0].padStart(2, '0');
        const minutes = timeComponents[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      
      return "N/A";
    } catch (error) {
      console.error("Error parsing time:", error);
      return "N/A";
    }
  };
  
  // Format times and store the result
  const stationsWithFormattedTimes = filteredStations.map(station => ({
    ...station,
    departure_time: formatTime(station.departure_time)
  }));
  
  const coordinates = stations.map((station) => ({
    latitude: station.latitude,
    longitude: station.longitude,
  }));

  const [currentLocation, setCurrentLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const headingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to show your position.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Watch heading (orientation)
      const headingSubscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading);
        headingAnim.setValue(headingData.trueHeading);
      });

      return () => headingSubscription.remove();
    })();
  }, []);

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }} 
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode value={`ticket-${ticket.id}`} size={200} ecl="H" backgroundColor={isDarkMode ? "#333" : "white"} color={isDarkMode ? "#fff" : "#000"} />
        </View>

        {/* Train Name */}
        <Text style={[styles.trainName, { color: isDarkMode ? '#fff' : '#000' }]}>
          {train.name}
        </Text>

        <TimeLine stations={stationsWithFormattedTimes} isDarkMode={isDarkMode} />

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: stations[0]?.latitude || 0,
            longitude: stations[0]?.longitude || 0,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
        >
          {/* Draw the route */}
          <Polyline coordinates={coordinates} strokeWidth={4} strokeColor={isDarkMode ? "#8eccff" : "blue"} />

          {/* Show current position with orientation */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="You are here"
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Animated.View
                style={[
                  styles.orientationMarker,
                  {
                    backgroundColor: isDarkMode ? "rgba(50, 50, 50, 0.8)" : "rgba(255, 255, 255, 0.7)",
                    borderColor: isDarkMode ? "#555" : "#ccc",
                    transform: [
                      {
                        rotate: headingAnim.interpolate({
                          inputRange: [0, 360],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.arrow} />
                <View style={styles.arrowBase} />
              </Animated.View>
            </Marker>
          )}
        </MapView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  trainName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  routeHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  stationName: {
    fontSize: 16,
  },
  map: {
    width: Dimensions.get("window").width * 0.92,
    height: 300,
    marginTop: 20,
  },
  orientationMarker: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    transform: [{ translateY: -5 }],
  },
  arrowBase: {
    width: 6,
    height: 6,
    backgroundColor: "red",
    borderRadius: 3,
    marginTop: -5,
  },
});

export default TicketInfo;
