import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import config from "../config.json";
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
  const { user, setUser } = useUser();

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
  });

  useEffect(() => {
    if (user.token) {
      setEditData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "",
        passwordConfirmation: "",
        discountCard: user.discountCard || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
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
          discount_card: editData.discountCard || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          ...user,
          firstname: data.user.first_name,
          lastname: data.user.last_name,
          email: data.user.email,
          discountCard: data.user.discount_card || "",
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
        discountCard: "",
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
              value={editData.firstname}
              onChangeText={(value) => handleEditChange("firstname", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Priezvisko"
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
              value={editData.password}
              onChangeText={(value) => handleEditChange("password", value)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Potvrď heslo"
              value={editData.passwordConfirmation}
              onChangeText={(value) =>
                handleEditChange("passwordConfirmation", value)
              }
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Zľavová karta (napr. číslo alebo URL)"
              value={editData.discountCard}
              onChangeText={(value) => handleEditChange("discountCard", value)}
            />

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
            <Image
              source={require("../assets/profile_icon.png")}
              style={styles.profileImage}
            />
            <Text style={styles.info}> <Text style={styles.label}>Meno:</Text> {user.firstname}</Text>
            <Text style={styles.info}> <Text style={styles.label}>Priezvisko:</Text> {user.lastname}</Text>
            <Text style={styles.info}> <Text style={styles.label}>Email:</Text> {user.email}</Text>
            <Text style={styles.info}> <Text style={styles.label}>Zľavová karta:</Text> {user.discountCard || "–"}</Text>
            <Text style={styles.info}> <Text style={styles.label}>Typ zľavy:</Text> (zatiaľ nepriradené)</Text>
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

  // Login / Register UI ostáva rovnaký
  // ...

  // ŠTÝLY
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "System",
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: "System",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "System",
  },
  toggleButton: {
    marginTop: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#007BFF",
    fontSize: 14,
    fontFamily: "System",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default Profile;

