import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";

export default function SearchResultsScreen({ route, navigation }) {
  const { trains } = route.params;
  const { isDarkMode } = useTheme();  
  const styles = getStyles(isDarkMode);

  const renderTrainTile = ({ item }) => {
    const handleTilePress = () => {
      navigation.navigate('BuyTicket', { train: item });
    };

    if (!item.routes || item.routes.length === 0) {
      return (
        <View style={styles.tile}>
          <Text style={styles.tileTitle}>{item.name}</Text>
          <Text style={styles.tileSubtitle}>No route information available</Text>
        </View>
      );
    }

    const fromRoute = item.routes[0];
    const toRoute = item.routes[item.routes.length - 1];

    const formatTime = (time) => {
      const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
      const date = new Date(sanitizedTime);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    };

    const calculateTimeFromNow = (time) => {
      const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
      const now = new Date();
      const departureTime = new Date(sanitizedTime);
      const diffInMinutes = Math.round((departureTime - now) / (1000 * 60));

      if (diffInMinutes < 0) return 'Departed';
      if (diffInMinutes === 0) return 'Departing now';
      return `${diffInMinutes} minutes from now`;
    };

    return (
      <TouchableOpacity style={styles.tile} onPress={handleTilePress}>
        <Text style={styles.tileTitle}>{item.name}</Text>
        <Text style={styles.tileSubtitle}>
          From: {fromRoute.station_name} at {formatTime(fromRoute.departure_time)}
        </Text>
        <Text style={styles.tileSubtitle}>
          To: {toRoute.station_name} at {formatTime(toRoute.departure_time)}
        </Text>
        <Text style={styles.tileSubtitle}>
          Time from now: {calculateTimeFromNow(fromRoute.departure_time)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>

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
