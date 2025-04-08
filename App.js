import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { UserProvider, useUser } from './context/UserContext';

// screen imports
import HomeScreen from './screens/HomeScreen'; 
import Profile from './screens/Profile'; 
import Tickets from './screens/Tickets';
import HeaderFooter from './components/ScreenFooter'; 
import CreateStationScreen from './screens/CreateStationsScreen';
import CreateTrainScreen from './screens/CreateTrainScreen';

const Drawer = createDrawerNavigator();

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
        <Drawer.Screen name="Vyhľadanie spojenia">
          {({ navigation, route }) => (
            <HeaderFooter navigation={navigation} route={route}>
              <HomeScreen />
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
        
        {user.privilege === 2 && 'admin' && (
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
