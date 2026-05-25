// src/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, ThemeConfig } from '@/types';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeConfig: ThemeConfig;
}

const themeConfigs: Record<ThemeType, ThemeConfig> = {
  home: {
    bgColor: '#0D5C63',
    accentColor: '#D4AF37',
    textColor: '#FFFFFF',
    fontFamily: 'Playfair Display, serif',
  },
  pastorscorner: {
    bgColor: '#3A2C3E',
    accentColor: '#D4AF37',
    textColor: '#FFFFFF',
    fontFamily: 'Playfair Display, serif',
    pattern: 'cross',
  },
  youth: {
    bgColor: '#1E1E24',
    accentColor: '#00E5FF',
    textColor: '#FFFFFF',
    fontFamily: 'Poppins, sans-serif',
  },
  sundayschool: {
    bgColor: '#A8DADC',
    accentColor: '#F4D03F',
    textColor: '#2C3E50',
    fontFamily: 'Nunito, sans-serif',
    pattern: 'clouds',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('home');

  useEffect(() => {
    const config = themeConfigs[currentTheme];
    document.documentElement.style.setProperty('--bg-color', config.bgColor);
    document.documentElement.style.setProperty('--accent-color', config.accentColor);
    document.documentElement.style.setProperty('--text-color', config.textColor);
    document.documentElement.style.setProperty('--font-family', config.fontFamily);
  }, [currentTheme]);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeConfig: themeConfigs[currentTheme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
