import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config.json';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";

export default function CreateTrainScreen() {
  const [trainName, setTrainName] = useState('');
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [showPicker, setShowPicker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);  

  const searchStations = async (query) => {
    if (query.length < 3) {
      setStations([]); 
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/stations/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ starts_with: query }),
      });
      const data = await response.json();
      setStations(data.stations || data); // Update station list
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to search stations');
    }
  };

  const handleSelectStation = (station) => {
    if (selectedStations.find(s => s.id === station.id)) return;

    setSelectedStations(prev => [...prev, { ...station, departure_time: new Date() }]);
  };

  const handleTimeChange = (event, selectedTime, index) => {
    if (event.type === 'dismissed') {
      setShowPicker(null);
      return;
    }

    const updated = [...selectedStations];
    const currentDate = updated[index].departure_time || new Date(); // Use existing date or default to now

    // Merge the selected time with the existing date
    const updatedDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      selectedTime.getSeconds()
    );

    updated[index].departure_time = updatedDateTime;
    setSelectedStations(updated);
    setShowPicker(null);
  };

  const handleSubmitTrain = async () => {
    try {
      const response = await fetch(`${config.API_URL}/trains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: trainName,
          routes: selectedStations.map((s, i) => ({
            station_id: s.id,
            sequence_number: i + 1,
            departure_time: formatDateTime(s.departure_time), // Format the date and time
          })),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', `Train "${trainName}" created.`);
        setTrainName('');
        setSelectedStations([]);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  // Helper function to format date and time
  const formatDateTime = (date) => {
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Train Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Express 101"
        value={trainName}
        onChangeText={setTrainName}
      />

      <Text style={styles.label}>Search Stations:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type at least 3 letters"
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          searchStations(query);
        }}
      />

      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectStation(item)}
            style={styles.stationItem}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>Selected Route:</Text>
      {selectedStations.map((s, index) => (
        <View key={s.id} style={styles.selectedStation}>
          <Text>{s.name}</Text>
          <TouchableOpacity onPress={() => setShowPicker(index)}>
            <Text style={styles.timeButton}>
              {s.departure_time.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showPicker === index && (
            <DateTimePicker
              value={s.departure_time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, date) => handleTimeChange(event, date, index)}
            />
          )}
        </View>
      ))}

      <Button title="Create Train" onPress={handleSubmitTrain} />
    </View>
  );
}

