import React, {
  createContext,
  useContext,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import {LightTheme, DarkTheme, Theme} from '../styles/theme';



const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const defaultTheme: Theme = new LightTheme();
const darkTheme: Theme = new DarkTheme();

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

interface ThemeProviderProps extends PropsWithChildren {}

export const ThemeProvider: FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === defaultTheme ? darkTheme : defaultTheme,
    );
  };

  const contextValue: ThemeContextProps = {theme, toggleTheme};

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
