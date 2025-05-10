import React, { useState, useCallback, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Switch, Keyboard, TouchableWithoutFeedback } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import config from "../config.json";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";
import { useUser } from '../context/UserContext';

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
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { user } = useUser();
  const [isNewsChecked, setIsNewsChecked] = useState(false);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const searchStations = async (query, setStations) => {
    if (query.length < 3) {
      setStations([]);
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
      setStations(data.stations || data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to search stations");
    }
  };

  const debounceSearch = useCallback((query, setStations) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      searchStations(query, setStations);
    }, 300);
    setDebounceTimeout(timeout);
  }, [debounceTimeout]);

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
      },
      mode: "date",
      display: "default",
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: time,
      onChange: (event, selectedTime) => {
        if (selectedTime) setTime(selectedTime);
      },
      mode: "time",
      display: "default",
    });
  };

  const selectFromStation = (item) => {
    if (fromInputRef.current) {
      fromInputRef.current.blur();
    }

    setTimeout(() => {
      setSelectedFrom(item);
      setFromQuery(item.name);
      setFromStations([]);
    }, 10);
  };

  const selectToStation = (item) => {
    if (toInputRef.current) {
      toInputRef.current.blur();
    }

    setTimeout(() => {
      setSelectedTo(item);
      setToQuery(item.name);
      setToStations([]);
    }, 10);
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
          page: 1,
          per_page: 15
        }),
      });

      const data = await response.json();
      if (response.ok && data.trains.length > 0) {
        navigation.navigate('Search Results', { 
          trains: data.trains,
          pagination: data.pagination,
          searchParams: {
            from_station: selectedFrom.id,
            to_station: selectedTo.id,
            departure_time: departureTime
          },
          isNewsChecked: isNewsChecked,
        });
      } else {
        Alert.alert("No Results", "No trains found for the selected criteria.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to search for trains.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Zadajte</Text>

        {user.privilege === 2 && (
          <View style={ styles.row}>
            <Text style={{ marginLeft: 10, color: isDarkMode ? "#fff" : "#000" }}>ADMIN - Zadaj aktualitu spoju</Text>
            <Switch
              value={isNewsChecked}
              onValueChange={setIsNewsChecked}
            />
          </View>
        )}

        {/* From Station */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={fromInputRef}
            style={styles.input}
            placeholder="Odkiaľ"
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            value={fromQuery}
            onChangeText={(query) => {
              setFromQuery(query);
              debounceSearch(query, setFromStations);
            }}
            onBlur={() => Keyboard.dismiss()}
          />
          {fromStations.length > 0 && (
            <View style={styles.overlay}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={fromStations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.stationItem}
                    onPress={() => selectFromStation(item)}
                  >
                    <Text style={styles.resultText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* To Station */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={toInputRef}
            style={styles.input}
            placeholder="Kam"
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            value={toQuery}
            onChangeText={(query) => {
              setToQuery(query);
              debounceSearch(query, setToStations);
            }}
            onBlur={() => Keyboard.dismiss()}
          />
          {toStations.length > 0 && (
            <View style={styles.overlay}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={toStations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.stationItem}
                    onPress={() => selectToStation(item)}
                  >
                    <Text style={styles.resultText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
          <Text style={styles.dateButtonText}>Vybrať dátum</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>Vybraný dátum: {date.toDateString()}</Text>

        <TouchableOpacity style={styles.dateButton} onPress={showTimePicker}>
          <Text style={styles.dateButtonText}>Vybrať čas</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          Vybraný čas: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <View style={styles.searchButtonContent}>
            <Icon name="train" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.searchButtonText}>Vyhľadaj spoj</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
