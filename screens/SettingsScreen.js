import React from 'react';
import { View, Text, Switch, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeAndTextContext'; // alebo ThemeContext ak si nepremenoval
import { getStyles } from "../styles";

const SettingsScreen = () => {
  const {
    isDarkMode,
    toggleTheme,
    isBiggerText,
    toggleTextSize,
    isHighContrast,
    toggleContrast,
  } = useTheme();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const styles = getStyles(isDarkMode, isTablet, isBiggerText, isHighContrast);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label_notif}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label_notif}>Bigger text</Text>
        <Switch value={isBiggerText} onValueChange={toggleTextSize} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label_notif}>High contrast</Text>
        <Switch value={isHighContrast} onValueChange={toggleContrast} />
      </View>
    </View>
  );
};

export default SettingsScreen;