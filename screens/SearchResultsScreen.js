import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";
import config from "../config.json";
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const SearchResultsScreen = ({ route, navigation }) => {
  const { trains: initialTrains, pagination: initialPagination, searchParams } = route.params;
  const [trains, setTrains] = useState(initialTrains);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const fetchMoreTrains = async () => {
    // If already loading or on the last page, don't fetch
    if (loading || pagination.current_page >= pagination.last_page) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${config.API_URL}/trains/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...searchParams,
          page: pagination.current_page + 1,
          per_page: pagination.per_page
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.trains.length > 0) {
        // Append new trains to existing list
        setTrains([...trains, ...data.trains]);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching more trains:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrainItem = ({ item }) => {
    // Get the first and last station in the route
    const firstStation = item.routes[0];
    const lastStation = item.routes[item.routes.length - 1];
    
    // Parse ISO date strings correctly
    const parseDateTime = (dateTimeString) => {
      // Replace space with 'T' and ensure proper timezone format for ISO 8601
      const formattedDateTime = dateTimeString.replace(' ', 'T').replace(/\+(\d{2})$/, '+$1:00');
      return new Date(formattedDateTime);
    };
    
    // Format times for display
    const departureDate = parseDateTime(firstStation.departure_time);
    const departureTime = departureDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const arrivalTime = parseDateTime(lastStation.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Format date for display (e.g., "May 10, 2025")
    const formattedDate = departureDate.toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'});
    
    return (
      <TouchableOpacity 
        style={[tileStyles.trainTile, isDarkMode ? tileStyles.darkTile : tileStyles.lightTile]}
        onPress={() => navigation.navigate('BuyTicket', { train: item })}
      >
        <View style={tileStyles.trainHeader}>
          <Text style={[tileStyles.trainName, isDarkMode && tileStyles.darkText]}>{item.name}</Text>
          <View style={tileStyles.dateContainer}>
            <Text style={[tileStyles.dateText, isDarkMode && tileStyles.darkSecondaryText]}>{formattedDate}</Text>
            <Icon name="train" size={18} color={isDarkMode ? "#8eccff" : "#3377cc"} />
          </View>
        </View>
        
        <View style={tileStyles.routeContainer}>
          <View style={tileStyles.stationContainer}>
            <Text style={[tileStyles.stationLabel, isDarkMode && tileStyles.darkSecondaryText]}>From</Text>
            <Text style={[tileStyles.stationName, isDarkMode && tileStyles.darkText]} numberOfLines={1}>{firstStation.station_name}</Text>
            <Text style={[tileStyles.timeText, isDarkMode && tileStyles.darkSecondaryText]}>{departureTime}</Text>
          </View>
          
          <View style={tileStyles.arrowContainer}>
            <Icon name="long-arrow-right" size={24} color={isDarkMode ? "#aaa" : "#999"} />
          </View>
          
          <View style={tileStyles.stationContainer}>
            <Text style={[tileStyles.stationLabel, isDarkMode && tileStyles.darkSecondaryText]}>To</Text>
            <Text style={[tileStyles.stationName, isDarkMode && tileStyles.darkText]} numberOfLines={1}>{lastStation.station_name}</Text>
            <Text style={[tileStyles.timeText, isDarkMode && tileStyles.darkSecondaryText]}>{arrivalTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={tileStyles.loadingFooter}>
        <ActivityIndicator size="small" color={isDarkMode ? "#8eccff" : "#3377cc"} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { padding: 12 }]}>
      <Text style={styles.heading}>Search Results</Text>
      
      <FlatList
        data={trains}
        renderItem={renderTrainItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreTrains}
        onEndReachedThreshold={0.3}
        contentContainerStyle={tileStyles.listContainer}
      />
    </View>
  );
};

// Modern tile styles
const tileStyles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  trainTile: {
    width: width - 24, // Full width minus padding
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lightTile: {
    backgroundColor: '#fff',
  },
  darkTile: {
    backgroundColor: '#2a2a2a',
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  darkSecondaryText: {
    color: '#bbb',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  routeContainer: {
    flexDirection: 'row',
  },
  stationContainer: {
    flex: 4,
  },
  arrowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    color: '#666',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default SearchResultsScreen;
