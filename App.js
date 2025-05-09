import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { UserProvider, useUser } from './context/UserContext';

// screen imports
import HomeScreen from './screens/HomeScreen';
import Profile from './screens/Profile';
import Tickets from './screens/Tickets';
import HeaderFooter from './components/ScreenFooter';
import CreateStationScreen from './screens/CreateStationsScreen';
import CreateTrainScreen from './screens/CreateTrainScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import BuyTicketScreen from './screens/BuyTicketScreen';
import PaymentScreen from './screens/PaymentWallScreen';
import UpdateTrainScreen from './screens/UpdateTrainScreen';
import NotificationsScreen from './screens/NotificationsScreen';

import TicketInfo from './screens/TicketInfo';
import Settings from './screens/SettingsScreen';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationsProvider } from './context/NotificationsContext';

// Function to register for push notifications
async function registerForPushNotificationsAsync(userToken) {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Push notifikácie neboli povolené!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  })).data;

  if (token) {
    // Uložte token do UserContext
    useUser((prevUser) => ({ ...prevUser, expo_token: token }));

    // Ak je token a používateľský token, pošlite ho na backend
    if (userToken) {
      fetch('https://192.168.0.107:8002/api/store-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ expo_token: token }),
      }).catch((error) => console.error('Error storing token:', error));
    }
  }

  return token;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Train-related Screens
const TrainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }} // Hide header for the main screen
    />
    <Stack.Screen
      name="Search Results"
      component={SearchResultsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BuyTicket"
      component={BuyTicketScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PaymentScreen"
      component={PaymentScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="UpdateTrainScreen"
     component={UpdateTrainScreen} 
     options={{ headerShown: false }}
     />
  </Stack.Navigator>
);

const TicketsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="listky"
      component={Tickets}
      options={{ headerShown: false }} // Hide header for the main screen
    />
    <Stack.Screen
      name="TicketInfo"
      component={TicketInfo}
      options={{ headerShown: false }} // Hide header for the main screen
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user } = useUser(); // Get the user role from context

  // Register push notification token when app starts
  useEffect(() => {
    if (user.token) {
      registerForPushNotificationsAsync(user.token).then((token) => {
        // Handle any additional logic if needed after registering
        console.log('Push notification token:', token);
      });
    }
  }, [user.token]); // Runs only when `user.token` changes

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Vyhľadanie spojenia"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#A74730',
          },
          headerTintColor: '#fff',
        }}>

        {/* Use TrainStackNavigator for train-related screens */}
        <Drawer.Screen name="Vyhľadanie spojenia">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
               <TrainStackNavigator />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Tickets">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <TicketsStackNavigator />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Profile">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <Profile />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Settings">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <Settings />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Notifications">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <NotificationsScreen />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        {/* Conditionally render admin-only screens */}
        {user.privilege === 2 && (
          <Drawer.Screen name="Create Train ADMIN">
            {({ navigation, route }) => <CreateTrainScreen />}
          </Drawer.Screen>
        )}

        {user.privilege === 2 && (
          <Drawer.Screen name="Create Station ADMIN">
            {({ navigation, route }) => (
              <HeaderFooter navigation={navigation} route={route}>
                <CreateStationScreen />
              </HeaderFooter>
            )}
          </Drawer.Screen>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <UserProvider>
    <ThemeProvider>
      <NotificationsProvider>
        <AppNavigator />
      </NotificationsProvider>
    </ThemeProvider>
  </UserProvider>
);

export default App;
