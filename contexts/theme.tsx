import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { flushSync } from 'react-dom';

type ThemeCtx = { dark: boolean; toggle: () => void };

const ThemeContext = createContext<ThemeCtx>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to light for SSR — antd styles extracted server-side will be light.
  // useEffect syncs to the actual user preference after hydration.
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, []);

  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    localStorage.setItem('theme', next ? 'dark' : 'light');

    // Apply Tailwind class + antd theme in the same frame so nothing switches in steps
    const apply = () => {
      flushSync(() => setDark(next));
      root.classList.toggle('dark', next);
      root.style.colorScheme = next ? 'dark' : 'light';
    };

    // Disable per-element CSS transitions while switching — they finish at different
    // times and fight with the view-transition crossfade
    root.classList.add('theme-switching');
    const done = () => root.classList.remove('theme-switching');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      requestAnimationFrame(() => requestAnimationFrame(done));
      return;
    }

    document.startViewTransition(apply).finished.finally(done);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
