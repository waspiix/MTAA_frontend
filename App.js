import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// screen importy
import HomeScreen from './screens/HomeScreen'; 
import Profile from './screens/Profile'; 
import Tickets from './screens/Tickets';
import HeaderFooter from './components/ScreenFooter'; 

const Drawer = createDrawerNavigator();

// header s listou vramci AppNavigator => posklada nasledne stranku
//  na zaklade mena screenu a pod ktory ide footer

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Vyhľadanie spojenia"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff', 
        },
        headerTintColor: '#fff',
      }}>
        
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
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
