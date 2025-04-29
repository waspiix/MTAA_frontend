import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    token: "", // access token
    privilege: 1, // privilege (1 = normal user, 2 = admin)
  });

  // Load user from AsyncStorage when the app starts
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
      }
    })();
  }, []);

  // Save user to AsyncStorage whenever it changes
  useEffect(() => {
    (async () => {
      try {
        if (user && user.token) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to save user to AsyncStorage", error);
      }
    })();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};