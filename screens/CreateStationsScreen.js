import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';

export default function CreateStationScreen() {
  const [name, setName] = useState('');
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]); // Clear results if query is too short
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/stations/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ starts_with: query }),
      });

      const data = await response.json();
      setSearchResults(data.stations || data); // Update search results
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to search stations');
    }
  };

  const handleCreateStation = async () => {
    try {
      const response = await fetch(`${config.API_URL}/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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

      <Text style={styles.label}>Search Stations</Text>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Type at least 3 letters"
      />

      {/* Overlay for search results */}
      {searchResults.length > 0 && (
        <View style={localStyles.overlay}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={localStyles.resultItem}
                onPress={() => {
                  setSearchQuery(item.name);
                  setSearchResults([]); // Clear results after selection
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
        onPress={() => navigation.navigate('Train Screen')}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 150, // Adjust based on the position of the search input
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10, // Ensure it appears above other elements
    maxHeight: 200, // Limit height for scrollable results
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
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
