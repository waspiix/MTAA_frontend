import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import config from "../config.json"; // Import API URL from config
import { useUser } from "../context/UserContext"; // Import the user context
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { user, setUser } = useUser(); // Access the context to get and update the user state
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
        // Update the global context with privilege and user info
        setUser({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          token: data.token, // access token
          privilege: data.privilege, // 1 for normal user, 2 for admin
        });
        if (isRegister) {
          Alert.alert("Success", "Registered successfully.");
        } else {
          Alert.alert("Success", `Login successful. Welcome, ${data.firstname}.`);
        }
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user"); // Clear user data from AsyncStorage
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        token: "",
        privilege: 1,
      }); // Reset user state
      Alert.alert("Success", "Logged out successfully.");
    } catch (error) {
      console.error("Failed to log out", error);
      Alert.alert("Error", "Could not log out.");
    }
  };

  if (user.token) {
    // If the user is logged in, display their profile information
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.info}>First Name: {user.firstname}</Text>
        <Text style={styles.info}>Last Name: {user.lastname}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.info}>
          Privilege: {user.privilege === 1 ? "User" : "Admin"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If the user is not logged in, display the login/register form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
        />
      )}
      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
      />

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.passwordConfirmation}
          onChangeText={(value) => handleInputChange("passwordConfirmation", value)}
          secureTextEntry
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsRegister(!isRegister)}
      >
        <Text style={styles.toggleButtonText}>
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 15,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#007BFF",
    fontSize: 14,
  },
});

export default Profile;