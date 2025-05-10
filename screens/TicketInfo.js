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

const TicketInfo = ({ route }) => {
  const { ticket } = route.params;

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
    const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
    const date = new Date(sanitizedTime);
    return `${date
      .getHours()
      .toString()
      .padStart(2, '2')}:${date.getMinutes().toString().padStart(2, '2')}`;
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      {/* Map */}

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={`ticket-${ticket.id}`} size={200} ecl="H" backgroundColor="white" />
      </View>

      {/* Train Name */}
      <Text style={styles.trainName}>{train.name}</Text>

      <TimeLine stations={stationsWithFormattedTimes} />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: stations[0]?.latitude || 0,
          longitude: stations[0]?.longitude || 0,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* Draw the route */}
        <Polyline coordinates={coordinates} strokeWidth={4} strokeColor="blue" />

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
    backgroundColor: "#f5f5f5",
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
    width: 30, // Slightly larger marker
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12, // Wider base for the arrow
    borderRightWidth: 12,
    borderBottomWidth: 20, // Longer arrow
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red", // Arrow color
    transform: [{ translateY: -5 }], // Slightly offset to make it more prominent
  },
  arrowBase: {
    width: 6, // Small circle at the base of the arrow
    height: 6,
    backgroundColor: "red",
    borderRadius: 3,
    marginTop: -5, // Position it at the base of the arrow
  },
});

export default TicketInfo;
