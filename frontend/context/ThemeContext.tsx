'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../lib/types';

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const DEFAULT_ACCENT_COLOR = '#f26b38';

export const ACCENT_PRESETS = [
  '#f26b38', // TaskFlow Coral
  '#6366f1', // Indigo
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accentColor, setAccentColorState] = useState<string>(DEFAULT_ACCENT_COLOR);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('taskflow_theme') as Theme) || 'light';
    const savedAccent = localStorage.getItem('taskflow_accent') || DEFAULT_ACCENT_COLOR;

    setThemeState(savedTheme);
    setAccentColorState(savedAccent);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.setProperty('--accent-color', accentColor);
    // Convert hex to rgb for opacity variants
    const hex = accentColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    }

    localStorage.setItem('taskflow_theme', theme);
    localStorage.setItem('taskflow_accent', accentColor);
  }, [theme, accentColor, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (newColor: string) => {
    setAccentColorState(newColor);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor, toggleTheme }}>
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
