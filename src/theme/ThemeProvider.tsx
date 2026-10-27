import { createContext, useContext, type ReactNode } from 'react';
import { useAppStore } from '@/store/appStore';
import { themes, type AppTheme } from './theme';

const ThemeContext = createContext<AppTheme>(themes.party);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeName = useAppStore(s => s.themeName);
  return <ThemeContext.Provider value={themes[themeName] ?? themes.party}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
