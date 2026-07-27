import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // 'light' | 'dark' | 'glass'

  const cycleTheme = () => {
    setTheme(t => t === 'dark' ? 'glass' : t === 'glass' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      <div className={`theme-${theme} min-h-screen`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
