import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import styles from "../styles"; // Cesta k štýlom

const Profile = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date());

  // Funkcia na zobrazenie DateTimePicker
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

  const handleSearch = () => {
    console.log(`Hľadám spojenie z ${from} do ${to}`);
  };

  return (
    <View style={styles.container}>
      {/* Horná modrá časť */}
      <View style={styles.topSection}>
        <TextInput
          style={styles.input}
          placeholder="Odkiaľ"
          value={from}
          onChangeText={setFrom}
        />
        <TextInput
          style={styles.input}
          placeholder="Kam"
          value={to}
          onChangeText={setTo}
        />
        <TouchableOpacity style={styles.dateButton} title="Vybrať dátum" onPress={showDatePicker}>
          <Text style={styles.dateButtonText}>Vybrať dátum</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>Vybraný dátum: {date.toDateString()}</Text>
      </View>

      {/* Spodná biela časť */}
      <View style={styles.bottomSection}>
        <Button title="PROFIL" onPress={handleSearch} />
      </View>
    </View>
  );
};

export default Profile;