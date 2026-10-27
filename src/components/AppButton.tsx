import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  // Shrink to fit the label instead of stretching to the parent's width.
  compact?: boolean;
};

const DISABLED_OPACITY = 0.45;

const useStyles = makeStyles(t => ({
  base: { borderRadius: t.radius.pill, borderWidth: t.sizes.border },
  compact: { alignSelf: 'flex-start' },
  touch: {
    minHeight: t.sizes.touch + t.spacing.xs,
    paddingHorizontal: t.spacing.xl,
    paddingVertical: t.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
}));

export function AppButton({
  label, onPress, variant = 'primary', loading, disabled, icon, accessibilityLabel, compact,
}: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const off = disabled || loading;
  const { colors, alpha } = theme;

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.surfaceAlt, fg: colors.textPrimary, border: colors.surfaceAlt },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    danger: { bg: colors.danger + alpha.tint, fg: colors.danger, border: colors.danger + alpha.tint },
    dark: { bg: colors.onHero, fg: colors.textPrimary, border: colors.onHero },
  }[variant];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      onPress={onPress}
      layoutStyle={compact ? styles.compact : undefined}
      contentStyle={styles.touch}
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        !off && variant === 'primary' && { ...theme.shadow.md, shadowColor: colors.primary },
        off && { opacity: DISABLED_OPACITY },
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={palette.fg} /> : icon ? <Ionicons name={icon} size={theme.sizes.icon.sm} color={palette.fg} /> : null}
        <AppText variant="button" style={{ color: palette.fg }}>{label}</AppText>
      </View>
    </PressableScale>
  );
}
