import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  // `filled` draws the round surface chip used for back/close buttons.
  variant?: 'plain' | 'filled';
  color?: string;
  disabled?: boolean;
};

const useStyles = makeStyles(t => ({
  hit: {
    width: t.sizes.touch,
    height: t.sizes.touch,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    width: t.sizes.avatar.md,
    height: t.sizes.avatar.md,
    backgroundColor: t.colors.surfaceAlt,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
  },
}));

export function IconButton({ icon, onPress, accessibilityLabel, variant = 'plain', color, disabled }: Props) {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        variant === 'filled' && styles.filled,
        pressed && { backgroundColor: theme.colors.border },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Ionicons name={icon} size={theme.sizes.icon.md} color={color ?? theme.colors.textPrimary} />
    </Pressable>
  );
}
