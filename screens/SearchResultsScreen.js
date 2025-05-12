import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";
import config from "../config.json";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';



const SearchResultsScreen = ({ route, navigation }) => {
  const { trains: initialTrains, pagination: initialPagination, searchParams } = route.params;
  const [trains, setTrains] = useState(initialTrains);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isDarkMode, isTablet);
  const { isNewsChecked = false } = route.params;
  const { user } = useUser();

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
        style={[styles.trainTile, isDarkMode ? styles.darkTile : styles.lightTile]}
        // pri stlaceni ak admin edituje tak ho to presmeruje na UpdateTrainScreen inak na BuyTicket
        onPress={() => {
          if (user?.privilege === 2 && isNewsChecked) {
            navigation.navigate('UpdateTrainScreen', { train: item });
          } else {
            navigation.navigate('BuyTicket', { train: item });
          }
        }}
      >
        <View style={styles.trainHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={[styles.trainName, isDarkMode && styles.darkText]}>{item.name}</Text>
            {item.delay != null && (
              <Text style={[styles.delayText]}>
              
                +{item.delay} min
              </Text>
            )}
          </View>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateText, isDarkMode && styles.darkSecondaryText]}>{formattedDate}</Text>
            <Icon name="train" size={18} color={isDarkMode ? "#8eccff" : "#3377cc"} />
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.stationContainer}>
            <Text style={[styles.stationLabel, isDarkMode && styles.darkSecondaryText]}>From</Text>
            <Text style={[styles.stationName, isDarkMode && styles.darkText]} numberOfLines={1}>{firstStation.station_name}</Text>
            <Text style={[styles.timeText, isDarkMode && styles.darkSecondaryText]}>{departureTime}</Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <Icon name="long-arrow-right" size={24} color={isDarkMode ? "#aaa" : "#999"} />
          </View>
          
          <View style={styles.stationContainer}>
            <Text style={[styles.stationLabel, isDarkMode && styles.darkSecondaryText]}>To</Text>
            <Text style={[styles.stationName, isDarkMode && styles.darkText]} numberOfLines={1}>{lastStation.station_name}</Text>
            <Text style={[styles.timeText, isDarkMode && styles.darkSecondaryText]}>{arrivalTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={isDarkMode ? "#8eccff" : "#3377cc"} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { padding: 12 }]}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.heading, { flex: 1, textAlign: 'center', marginBottom: 12 }]}>Nájdené spojenia</Text>
      </View>
      
      <FlatList
        data={trains}
        renderItem={renderTrainItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreTrains}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default SearchResultsScreen;
