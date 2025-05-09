import React from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, Image, Modal, Button, TextInput } from 'react-native';
import config from '../config.json';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from '../styles';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function BuyTicketScreen({ route, navigation }) {
  const { train } = route.params;
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // sluzi pre rezervaciu miesta
  const [modalVisible, setModalVisible] = useState(false);
  const [coach, setCoach] = useState('');
  const [seat, setSeat] = useState('');
  const [reservationText, setReservationText] = useState('');
  const [travelClass, setTravelClass] = useState('2');


  const fromRoute = train.routes[0];
  const toRoute = train.routes[train.routes.length - 1];

  const formatTime = (time) => {
    const sanitizedTime = time.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '');
    const date = new Date(sanitizedTime);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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

  const handleDelaySubmit = async () => {
    // Prevod na hodiny a minúty
    const hours = parseInt(coach) || 0; // Ak coach je prázdny, použije sa 0
    const minutes = parseInt(seat) || 0; // Ak seat je prázdny, použije sa 0

    // Skontroluj, či sú hodnoty platné
    if (isNaN(hours) || isNaN(minutes)) {
        Alert.alert("Chyba", "Zadajte platné hodnoty pre meškanie.");
        return;
    }

    try {
        const response = await fetch(`${config.API_URL}/trains/${train.id}/delay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
                Accept: 'application/json'
            },
            body: JSON.stringify({
                hours: hours,
                minutes: minutes
            }),
        });

        const responseData = await response.json(); // Načítaj odpoveď ako JSON
        console.log("Response Data:", responseData);

        if (response.ok) {
            Alert.alert("Odoslané", "Správa bola odoslaná.");
        } else {
            Alert.alert("Chyba", "Nepodarilo sa odoslať meškanie.");
        }
    } catch (error) {
        console.error("Error:", error);
        Alert.alert("Chyba", "Nepodarilo sa odoslať meškanie.");
    }
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#F2F2F2' }} contentContainerStyle={{ padding: 20 ,paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.heading, { flex: 1, textAlign: 'center', marginBottom: 8 }]}>Nastav aktualitu</Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.tileTitle}>{train.name}</Text>
        <Text style={styles.tileSubtitle}>
          From: {fromRoute.station_name} at {formatTime(fromRoute.departure_time)}
        </Text>
        <Text style={styles.tileSubtitle}>
          To: {toRoute.station_name} at {formatTime(toRoute.departure_time)}
        </Text>
        <Text style={styles.tileSubtitle}>
          Time from now: {calculateTimeFromNow(fromRoute.departure_time)}
        </Text>
        <Text style={styles.tileSubtitle}>
          Počet zľavnených lístkov: {train.discounted_tickets}
        </Text>
      </View>
      
      <View style={[styles.tile, { marginTop: 20 }]}>
        <Text style={[styles.tileSubtitle, { marginBottom: 8 }]}>Zvoľte akciu:</Text>
        <Picker
          selectedValue={reservationText}
          onValueChange={(value) => setReservationText(value)}
          style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          <Picker.Item label="-- Vyberte možnosť --" value="" />
          <Picker.Item label="Meškanie" value="meskanie" />
          <Picker.Item label="Odrieknutie" value="odrieknutie" />
        </Picker>

        {reservationText === 'meskanie' && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.tileSubtitle, { marginBottom: 8 }]}>Zadajte meškanie:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                placeholder="Hodiny"
                keyboardType="numeric"
                value={coach}
                onChangeText={setCoach}
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              />
              <TextInput
                placeholder="Minúty"
                keyboardType="numeric"
                value={seat}
                onChangeText={setSeat}
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              />
            </View>
          </View>
        )}
      </View>
      


      <TouchableOpacity
        style={[styles.button, { marginTop: 8 }]}
        onPress={handleDelaySubmit}
        >
        <Text style={styles.buttonText}>Potvrdiť zmenu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
