import { Pressable, type AccessibilityRole, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = {
  label: string;
  onPress: () => void;
  selected?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  // Colour used for the icon, and for the tint + edge when selected. Primary when omitted.
  tone?: string;
  // Show a tick when selected and no icon is given.
  check?: boolean;
  role?: AccessibilityRole;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles(t => ({
  chip: {
    minHeight: t.sizes.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.pill,
    borderWidth: t.sizes.border,
  },
}));

// Pill used by single/multi-select groups, quick picks and suggestions.
export function Chip({ label, onPress, selected = false, icon, tone, check, role = 'button', style }: Props) {
  const { colors, alpha, sizes } = useTheme();
  const styles = useStyles();
  const c = tone ?? colors.primary;
  const glyph = icon ?? (check && selected ? 'checkmark' : undefined);
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={role === 'checkbox' ? { checked: selected } : { selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? c + alpha.tint : colors.surfaceAlt,
          borderColor: selected ? c : 'transparent',
        },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {glyph ? <Ionicons name={glyph} size={sizes.icon.sm} color={c} /> : null}
      <AppText variant="label" color={selected ? 'textPrimary' : 'textSecondary'}>{label}</AppText>
    </Pressable>
  );
}
