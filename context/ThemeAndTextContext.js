import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark' || false);
  const [isBiggerText, setIsBiggerText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleTextSize = () => setIsBiggerText(prev => !prev);
  const toggleContrast = () => setIsHighContrast(prev => !prev);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        isBiggerText,
        toggleTextSize,
        isHighContrast,
        toggleContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);