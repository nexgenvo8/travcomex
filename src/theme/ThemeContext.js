import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {lightColors, darkColors} from '../constants/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: isDark ? darkColors : lightColors,
        toggleTheme: () => setIsDark(prev => !prev),
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
