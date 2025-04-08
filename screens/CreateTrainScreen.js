import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config.json';

export default function CreateTrainScreen() {
  const [trainName, setTrainName] = useState('');
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [showPicker, setShowPicker] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch(`${config.API_URL}/stations`);
      const data = await response.json();
      setStations(data.stations || data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch stations');
    }
  };

  const handleSelectStation = (station) => {
    if (selectedStations.find(s => s.id === station.id)) return;

    setSelectedStations(prev => [...prev, { ...station, departure_time: new Date() }]);
  };

  const handleTimeChange = (event, selectedDate, index) => {
    if (event.type === 'dismissed') {
      setShowPicker(null);
      return;
    }
    const updated = [...selectedStations];
    updated[index].departure_time = selectedDate;
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
            departure_time: s.departure_time.toISOString(),
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Train Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Express 101"
        value={trainName}
        onChangeText={setTrainName}
      />

      <Text style={styles.label}>Select Stations:</Text>
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

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginVertical: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 16, borderRadius: 4,
  },
  stationItem: {
    padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  selectedStation: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 4,
  },
});
