import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: ReactNode;
  // Adornment before the text (₹ sign, matched icon...).
  left?: ReactNode;
  // `lg` is the big bold amount field.
  size?: 'md' | 'lg';
};

const useStyles = makeStyles(t => ({
  wrap: { gap: t.spacing.sm },
  field: {
    minHeight: t.sizes.touch + t.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    borderWidth: t.sizes.border,
    borderRadius: t.radius.lg,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.surfaceAlt,
  },
  lg: { minHeight: t.sizes.touch * 1.5 },
  input: { flex: 1, alignSelf: 'stretch', color: t.colors.textPrimary, ...t.typography.title },
  inputLg: { ...t.typography.amount },
  error: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs },
}));

export function AppInput({ label, error, hint, left, size = 'md', style, onFocus, onBlur, multiline, ...rest }: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const { colors } = theme;
  const edge = error ? colors.danger : focused ? colors.primary : colors.border;
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textSecondary">{label}</AppText>
      <View style={[styles.field, size === 'lg' && styles.lg, { borderColor: edge }]}>
        {left}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.onDisabled}
          multiline={multiline}
          onFocus={e => { setFocused(true); onFocus?.(e); }}
          onBlur={e => { setFocused(false); onBlur?.(e); }}
          style={[styles.input, size === 'lg' && styles.inputLg, multiline && { paddingVertical: theme.spacing.md }, style]}
          {...rest}
        />
      </View>
      {error ? (
        <View style={styles.error}>
          <Ionicons name="alert-circle" size={theme.sizes.icon.sm} color={colors.danger} />
          <AppText variant="caption" color="danger" style={{ flex: 1 }}>{error}</AppText>
        </View>
      ) : typeof hint === 'string' ? <AppText variant="caption" color="textSecondary">{hint}</AppText> : hint}
    </View>
  );
}
