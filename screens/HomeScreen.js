import React, { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import config from "../config.json";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromStations, setFromStations] = useState([]);
  const [toStations, setToStations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigation = useNavigation();

  const searchStations = async (query, setStations) => {
    if (query.length < 3) {
      setStations([]); // Clear results if query is too short
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/stations/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ starts_with: query }),
      });
      const data = await response.json();
      setStations(data.stations || data); // Update station list
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to search stations");
    }
  };

  const debounceSearch = useCallback((query, setStations) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear the previous timeout
    }

    const timeout = setTimeout(() => {
      searchStations(query, setStations); // Execute the search after the delay
    }, 300); // 300ms debounce delay

    setDebounceTimeout(timeout); // Save the new timeout
  }, [debounceTimeout]);
  

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      },
      mode: "date",
      display: "default",
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: time,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setTime(selectedTime);
        }
      },
      mode: "time",
      display: "default",
    });
  };

  const handleSearch = async () => {
    if (!selectedFrom || !selectedTo) {
      Alert.alert("Error", "Please select both 'From' and 'To' stations.");
      return;
    }

    const departureTime = `${date.toISOString().split("T")[0]} ${time.toTimeString().split(" ")[0]}`;

    try {
      const response = await fetch(`${config.API_URL}/trains/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          from_station: selectedFrom.id,
          to_station: selectedTo.id,
          departure_time: departureTime,
        }),
      });

      const data = await response.json();
      console.log("Trains found:", data.trains); // Debugging line to check the trains data

      if (response.ok && data.trains.length > 0) {
        navigation.navigate('Search Results', { trains: data.trains });
      } else {
        Alert.alert("No Results", "No trains found for the selected criteria.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to search for trains.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vyhľadanie spojenia</Text>

      {/* From Station Search */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Odkiaľ"
          value={fromQuery}
          onChangeText={(query) => {
            setFromQuery(query);
            debounceSearch(query, setFromStations);
          }}
        />
        {fromStations.length > 0 && (
          <View style={styles.overlay}>
            <FlatList
              data={fromStations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stationItem}
                  onPress={() => {
                    setSelectedFrom(item);
                    setFromQuery(item.name);
                    setFromStations([]); // Clear the list after selection
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* To Station Search */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Kam"
          value={toQuery}
          onChangeText={(query) => {
            setToQuery(query);
            debounceSearch(query, setToStations);
          }}
        />
        {toStations.length > 0 && (
          <View style={styles.overlay}>
            <FlatList
              data={toStations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stationItem}
                  onPress={() => {
                    setSelectedTo(item);
                    setToQuery(item.name);
                    setToStations([]); // Clear the list after selection
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
  <Text style={styles.dateButtonText}>Vybrať dátum</Text>
</TouchableOpacity>
<Text style={styles.dateText}>Vybraný dátum: {date.toDateString()}</Text>

{/* Time Picker */}
<TouchableOpacity style={styles.dateButton} onPress={showTimePicker}>
  <Text style={styles.dateButtonText}>Vybrať čas</Text>
</TouchableOpacity>

<Text style={styles.dateText}>Vybraný čas: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Vyhľadaj spoj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  overlay: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
    maxHeight: 200, // Limit height for scrollable results
  },
  stationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dateButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  searchButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;