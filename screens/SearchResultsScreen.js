import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function SearchResultsScreen({ route, navigation }) {
  const { trains } = route.params;

  const renderTrainTile = ({ item }) => {
    const handleTilePress = () => {
        navigation.navigate('BuyTicket', { train: item });
      };
    // Ensure routes array exists and has at least one element
    if (!item.routes || item.routes.length === 0) {
      return (
        <View style={styles.tile}>
          <Text style={styles.tileTitle}>{item.name}</Text>
          <Text style={styles.tileSubtitle}>No route information available</Text>
        </View>
      );
    }

    const fromRoute = item.routes[0]; // First station in the route
    const toRoute = item.routes[item.routes.length - 1]; // Last station in the route

    // Format departure time without timezone
    const formatTime = (time) => {
      // Remove timezone offset (e.g., "+00") from the time string
      const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
      const date = new Date(sanitizedTime);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // Calculate time difference from now
    const calculateTimeFromNow = (time) => {
      // Remove timezone offset (e.g., "+00") from the time string
      const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
      const now = new Date();
      const departureTime = new Date(sanitizedTime);
      const diffInMinutes = Math.round((departureTime - now) / (1000 * 60));

      if (diffInMinutes < 0) {
        return 'Departed';
      } else if (diffInMinutes === 0) {
        return 'Departing now';
      } else {
        return `${diffInMinutes} minutes from now`;
      }
    };

    return (
      <TouchableOpacity style={styles.tile} onPress={handleTilePress}>
        <Text style={styles.tileTitle}>{item.name}</Text>
        {fromRoute && fromRoute.station_name && (
          <Text style={styles.tileSubtitle}>
            From: {fromRoute.station_name} at {formatTime(fromRoute.departure_time)}
          </Text>
        )}
        {toRoute && toRoute.station_name && (
          <Text style={styles.tileSubtitle}>
            To: {toRoute.station_name} at {formatTime(toRoute.departure_time)}
          </Text>
        )}
        <Text style={styles.tileSubtitle}>
          Time from now: {calculateTimeFromNow(fromRoute.departure_time)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {trains.length > 0 ? (
        <FlatList
          data={trains}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrainTile}
        />
      ) : (
        <Text style={styles.noResultsText}>No trains found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  tile: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  tileTitle: { fontSize: 18, fontWeight: 'bold' },
  tileSubtitle: { fontSize: 14, color: '#555' },
  noResultsText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
});