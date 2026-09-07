import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('lm_theme');
      if (saved) return saved === 'dark';
    } catch (e) {
      // Ignore localStorage errors
    }
    return false; // Light mode by default; dark mode is an optional user preference
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      try {
        localStorage.setItem('lm_theme', 'dark');
      } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-theme');
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
