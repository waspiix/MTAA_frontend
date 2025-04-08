import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, FlatList } from 'react-native';
import config from '.././config.json'; 
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from react-navigation/native

export default function CreateStationScreen() {
  const [name, setName] = useState('');
  const [stations, setStations] = useState([]);
  const navigation = useNavigation();
  // Fetch station list
  const fetchStations = async () => {
    try {
      const response = await fetch(`${config.API_URL}/stations`);
      const data = await response.json();
      setStations(data.stations || data); // depending on your API structure
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch station list');
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleCreateStation = async () => {
    try {
      const response = await fetch(`${config.API_URL}/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', `Station "${data.station.name}" created.`);
        setName('');
        fetchStations(); // refresh the list after adding
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
      <Text style={styles.label}>New Station Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Central Station"
      />
      <Button title="Create Station" onPress={handleCreateStation} />

      <Text style={styles.listTitle}>Existing Stations:</Text>
      <FlatList
        data={stations}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.stationItem}>{item.name}</Text>
        )}
      />
      <Button
        title="Go to train Screen"
        onPress={() => navigation.navigate('Train Screen')} // Navigate to the new screen
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 16, borderRadius: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  stationItem: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
