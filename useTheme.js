import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'venttech-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}