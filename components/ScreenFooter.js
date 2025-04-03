import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ticket from "../assets/icons/ticket.png"; // Cesta k obrázku lístka


const HeaderFooter = ({ navigation, children }) => {


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Vyhľadanie spojenia")}>
            <Ionicons name="home" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Tickets")}>
            <Image source={ticket} style={{ width: 30, height: 30, tintColor: 'white' }} />
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person" size={30} color="white" />
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Umožňuje prispôsobiť obsah obrazovky
    backgroundColor: '#f5f5f5', // Svetlá farba pozadia
    flexDirection: 'column', // Vertikálne usporiadanie
  },
  header: {
    height: 60,
    backgroundColor: '#007bff', // Modrá farba headera
    flexDirection: 'row', // Umiestnenie menu a názvu vedľa seba
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    flex: 1,
    textAlign: 'center', // Názov v strede
  },
  content: {
    flex: 1, // Zabezpečuje, že obsah sa prispôsobí
  },
  footer: {
    height: 60,
    backgroundColor: '#007bff', // Modrá farba footeru
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute', // Upevníme footer na spodok
    bottom: 0, // Na spodku obrazovky
    width: '100%', // Celá šírka obrazovky
  },
  icon: {
    padding: 10,
  },
});

export default HeaderFooter;
