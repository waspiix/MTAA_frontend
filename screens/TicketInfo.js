import React from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import MapView, { Polyline, Marker } from "react-native-maps";

const TicketInfo = ({ route }) => {
  const { ticket } = route.params; // Get ticket data from navigation params

  const stations = ticket.train.routes;
  const train = ticket.train; // Get train data from ticket
  const coordinates = stations.map((station) => ({
    latitude: station.latitude,
    longitude: station.longitude,
  }));
  
  console.log("Stations:", stations); // Log the stations for debugging 
  return (
    <View style={styles.container}>
      {/* Map */}
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

        
      </MapView>
      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode value={`ticket-${ticket.id}`} size={200} backgroundColor="white" />
      </View>

      {/* Train Name */}
      <Text style={styles.trainName}>{train.name}</Text>

      {/* Route List */}
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.stationItem}>
            <Text style={styles.stationName}>{item.name}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.routeHeader}>Train Route:</Text>}
      />

    </View>
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
    width: Dimensions.get("window").width,
    height: 300,
    marginTop: 20,
  },
});




export default TicketInfo;