import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';
import type { AppTheme } from './theme';

type NamedStyles<T> = { [K in keyof T]: ViewStyle | TextStyle | ImageStyle };

// makeStyles(theme => ({...})) returns a hook; styles rebuild when the theme changes.
export function makeStyles<T extends NamedStyles<T>>(fn: (theme: AppTheme) => T) {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(fn(theme)), [theme]);
  };
}
