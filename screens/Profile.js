import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useWindowDimensions,
} from "react-native";
import config from "../config.json";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '../context/ThemeAndTextContext';
import { getStyles } from "../styles";
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { user, setUser } = useUser();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { isDarkMode, isBiggerText, isHighContrast } = useTheme();
  const styles = getStyles(isDarkMode, isTablet ,isBiggerText, isHighContrast);  


  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    discountCard: "",
    profileImage: null,
  });

  // Nastavíme editData automaticky po načítaní používateľa
  useEffect(() => {
    if (user.token) {
      setEditData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "",
        passwordConfirmation: "",
        discountCard: user.card_id || "",
        profileImage: user.profile_image || null,
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? "/register" : "/login";
      const body = isRegister
        ? {
            first_name: formData.firstname,
            last_name: formData.lastname,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.passwordConfirmation,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(`${config.API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          token: data.token,
          privilege: data.privilege,
          card_id: data.card_id || null,
          discount: data.discount?.name || null,
        });
        Alert.alert("Success", isRegister ? "Registered successfully." : `Login successful. Welcome, ${data.firstname}.`);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  const handleImagePick = async () => {
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Permission to access media library is required!");
      return;
    }

    // Spustíme knižnicu na výber obrázku
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',  
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.uri); // Zobrazí URI obrázku, ktorý bol vybraný
    } else {
      Alert.alert("No image selected", "You did not select any image.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(`${config.API_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          first_name: editData.firstname,
          last_name: editData.lastname,
          email: editData.email,
          password: editData.password || undefined,
          password_confirmation: editData.passwordConfirmation || undefined,
          card_id: editData.discountCard || undefined,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser({
          ...user,
          firstname: data.user.first_name,
          lastname: data.user.last_name,
          email: data.user.email,
          card_id: data.user.card_id || null,
          discount: data.user.discount?.name || null,
        });
        setEditMode(false);
        Alert.alert("Úspech", data.message || "Profil bol aktualizovaný.");
      } else {
        Alert.alert("Chyba", data.message || "Aktualizácia zlyhala.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Chyba", "Nepodarilo sa pripojiť k serveru.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        token: "",
        privilege: 1,
      });
      Alert.alert("Success", "Logged out successfully.");
    } catch (error) {
      console.error("Failed to log out", error);
      Alert.alert("Error", "Could not log out.");
    }
  };

  if (user.token) {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Môj Profil</Text>

      {editMode ? (
      <>
      <TextInput
        style={styles.input}
        placeholder="Meno"
        placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"} // Biela pre dark mode, svetlosivá pre light mode
        value={editData.firstname}
        onChangeText={(value) => handleEditChange("firstname", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Priezvisko"
        placeholderTextColor={isDarkMode ? "#FFFFFF" : "#A9A9A9"} // Biela pre dark mode, svetlosivá pre light mode
        value={editData.lastname}
        onChangeText={(value) => handleEditChange("lastname", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editData.email}
        onChangeText={(value) => handleEditChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nové heslo (nepovinné)"
        placeholderTextColor="#A9A9A9" 
        value={editData.password}
        onChangeText={(value) => handleEditChange("password", value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Potvrď heslo"
        placeholderTextColor="#A9A9A9" 
        value={editData.passwordConfirmation}
        onChangeText={(value) =>
          handleEditChange("passwordConfirmation", value)
        }
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Zľavová karta ID"
        placeholderTextColor="#A9A9A9" 
        value={editData.discountCard}
        onChangeText={(value) => handleEditChange("discountCard", value)}
      />

      <TouchableOpacity style={styles.buttonImage} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Nahraj obrázok</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleProfileUpdate}>
        <Text style={styles.buttonText}>Uložiť zmeny</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setEditMode(false)}
      >
        <Text style={styles.toggleButtonText}>Zrušiť</Text>
      </TouchableOpacity>
      </>
      ) : (
      <View style={styles.profileCard}>
        {/* Ak je obrázok, zobrazíme ho, inak predvolený obrázok */}
        <Image
          source={editData.profileImage ? { uri: editData.profileImage } : require("../assets/profile_icon.png")}
          style={styles.profileImage}
        />
      <Text style={styles.info}> <Text style={styles.label}>Meno:</Text> {user.firstname}</Text>
      <Text style={styles.info}> <Text style={styles.label}>Priezvisko:</Text> {user.lastname}</Text>
      <Text style={styles.info}> <Text style={styles.label}>Email:</Text> {user.email}</Text>
      <Text style={styles.info}> <Text style={styles.label}>Zľavová karta:</Text> {user.card_id || "–"}</Text>
      <Text style={styles.info}> <Text style={styles.label}>Typ zľavy:</Text> {user.discount ? user.discount : "–"}</Text>
      <Text style={styles.info}> <Text style={styles.label}>Práva:</Text> {user.privilege === 1 ? "Používateľ" : "Admin"}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
        <Text style={styles.buttonText}>Upraviť profil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Odhlásiť sa</Text>
      </TouchableOpacity>
      </View>
      )}
      </View>
    );
  }

  // ➤ Nie je prihlásený – zobrazíme prihlasovací/register formulár
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Registrácia" : "Prihlásenie"}</Text>

      {isRegister && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Meno"
            placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"} 
            value={formData.firstname}
            onChangeText={(value) => handleInputChange("firstname", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Priezvisko"
            placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"} 
            value={formData.lastname}
            onChangeText={(value) => handleInputChange("lastname", value)}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"} 
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Heslo"
        placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"}
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
      />

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Potvrď heslo"
          placeholderTextColor={isDarkMode ? "#f5f5f5" : "#A9A9A9"} 
          value={formData.passwordConfirmation}
          onChangeText={(value) =>
            handleInputChange("passwordConfirmation", value)
          }
          secureTextEntry
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegister ? "Registrovať" : "Prihlásiť sa"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsRegister(!isRegister)}
      >
        <Text style={styles.toggleButtonText}>
          {isRegister
            ? "Máte účet? Prihláste sa"
            : "Nemáte účet? Registrovať"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


export default Profile;
