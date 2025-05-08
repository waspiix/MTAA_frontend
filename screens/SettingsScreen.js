import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Appearance } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { getStyles } from "../styles";

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(isDarkMode);    

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};



export default SettingsScreen;
