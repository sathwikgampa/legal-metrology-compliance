import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lm_theme');
      if (saved) return saved === 'dark';
    } catch (e) {
      // Ignore localStorage errors
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      document.body.classList.add('dark', 'dark-theme');
      try {
        localStorage.setItem('lm_theme', 'dark');
      } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      document.body.classList.remove('dark', 'dark-theme');
      try {
        localStorage.setItem('lm_theme', 'light');
      } catch (e) {}
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
