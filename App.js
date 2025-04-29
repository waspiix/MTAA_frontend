import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
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
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user } = useUser(); // Get the user role from context

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Vyhľadanie spojenia"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
        }}
      >
        {/* Use TrainStackNavigator for train-related screens */}
        <Drawer.Screen name="Vyhľadanie spojenia" component={TrainStackNavigator} />

        <Drawer.Screen name="Profile">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <Profile />
            </HeaderFooter>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Tickets">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <Tickets />
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
  
    <AppNavigator />
  </UserProvider>
);

export default App;
