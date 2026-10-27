import { Text, type TextProps } from 'react-native';
import { useTheme, type ThemeColors } from '@/theme';

type Props = TextProps & {
  variant?: keyof ReturnType<typeof useTheme>['typography'];
  color?: keyof ThemeColors;
};

export function AppText({ variant = 'body', color = 'textPrimary', style, ...rest }: Props) {
  const theme = useTheme();
  return <Text style={[theme.typography[variant], { color: theme.colors[color] }, style]} {...rest} />;
}
