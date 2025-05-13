import React from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, Image, Modal, useWindowDimensions, Button, TextInput, ActivityIndicator } from 'react-native';
import config from '../config.json';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeAndTextContext';
import { getStyles } from '../styles';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function BuyTicketScreen({ route, navigation }) {
  const { train } = route.params;
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { isDarkMode, isBiggerText, isHighContrast } = useTheme();
  const styles = getStyles(isDarkMode, isTablet ,isBiggerText, isHighContrast);

  // sluzi pre rezervaciu miesta
  const [modalVisible, setModalVisible] = useState(false);
  const [coach, setCoach] = useState('');
  const [seat, setSeat] = useState('');
  const [reservationText, setReservationText] = useState('');
  const [travelClass, setTravelClass] = useState('2');
  const [isLoading, setIsLoading] = useState(false);

  const trainImages = {
    Ex: require('../assets/trains/express_train.jpg'),
    Os: require('../assets/trains/osobny_train.jpg'),
  };

  // Funkcia na získanie obrázku vlaku podľa mena
  const getTrainImage = (trainName) => {
    console.log(train.name);
    if (!trainName) return require('../assets/trains/default.jpg');

    const typeMatch = trainName.match(/^[A-Za-z]{2}/);
    if (!typeMatch) return require('../assets/trains/default.jpg');

    const type = typeMatch[0];
    return trainImages[type] || require('../assets/trains/default.jpg');
  };

  // Získaj obrázok pre konkrétny vlak
  const trainImageSource = getTrainImage(train.name);

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

  const startPayment = async () => {
    if (isLoading) return; // Prevent multiple clicks

    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_URL}/payment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          train_id: train.id,
          start_station: fromRoute.station_name,
          end_station: toRoute.station_name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const paymentUrl = data.url;

      navigation.navigate('PaymentScreen', { paymentUrl });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to start payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#F2F2F2' }} contentContainerStyle={{ padding: 20 ,paddingBottom: 100 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

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
      
      {trainImageSource ? (
        <Image
          source={trainImageSource}
          style={styles.trainImage}
          onError={() => console.warn('Failed to load train image')}
        />
      ) : (
        <Text style={styles.tileSubtitle}>Image not available</Text>
      )}

      <View style={styles.tile}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require("../assets/profile_icon.png")}
            style={styles.smallProfileImage}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tileSubtitle}>
              Meno: {user.firstname} {user.lastname}
            </Text>
            <Text style={styles.tileSubtitle}>
              Zľava: {user.discount ? user.discount : 'Žiadna zľava'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.reserveButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.reserveButtonText}>Miestenka</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Zadajte približnú rezerváciu</Text>
            
            <TextInput
              placeholder="Číslo vozňa (1-9)"
              value={coach}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) && num >= 1 && num <= 9) {
                  setCoach(num.toString());
                } else if (text === '') {
                  setCoach('');
                }
              }}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Číslo miesta (1-50)"
              value={seat}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) && num >= 1 && num <= 50) {
                  setSeat(num.toString());
                } else if (text === '') {
                  setSeat('');
                }
              }}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Trieda - Dropdown */}
            <View style={{ marginVertical: 10 }}>
              <Text style={{ marginBottom: 4 }}>Trieda:</Text>
              <View style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <Picker
                  selectedValue={travelClass}
                  onValueChange={(itemValue) => setTravelClass(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="Vyber triedu" value="" />
                  <Picker.Item label="1. trieda" value="1" />
                  <Picker.Item label="2. trieda" value="2" />
                </Picker>
              </View>
            </View>

            <Button
              title="Potvrdiť"
              onPress={() => {
                if (coach && seat && travelClass) {
                  setReservationText(`Vozeň: ${coach}, Miesto: ${seat}, Trieda: ${travelClass}`);
                  setModalVisible(false);
                } else {
                  Alert.alert('Chyba', 'Zadajte všetky údaje.');
                }
              }}
            />

            <View style={{ marginVertical: 10 }}>
              <Button title="Naspäť" color="gray" onPress={() => setModalVisible(false)} />
            </View>
          
            <TouchableOpacity onPress={() => {
              setReservationText('');
              setCoach('');
              setSeat('');
              setTravelClass('1');
              setModalVisible(false);
            }}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Zrušiť rezerváciu</Text>
            </TouchableOpacity>
          
          
          </View>
        </View>
      </Modal>

      {reservationText !== '' && (
        <Text style={[styles.tileSubtitle, { textAlign: 'center', marginBottom: 10 }]}>
          {reservationText}
        </Text>
      )}

      <TouchableOpacity 
        onPress={startPayment} 
        style={[styles.button, isLoading && { opacity: 0.7 }]} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Potvrdiť objednávku</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
