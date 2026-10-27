import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

type Props = { title?: string; message?: string; onRetry: () => void };

const useStyles = makeStyles(t => ({
  card: {
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.xl,
    borderRadius: t.radius.xl,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  circle: { width: t.sizes.avatar.lg, height: t.sizes.avatar.lg, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
}));

export function ErrorState({ title = 'Something went wrong', message, onRetry }: Props) {
  const { colors, alpha, sizes } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.card} accessibilityRole="alert">
      <View style={[styles.circle, { backgroundColor: colors.danger + alpha.tint }]}>
        <Ionicons name="alert-circle" size={sizes.icon.lg + sizes.dot} color={colors.danger} />
      </View>
      <AppText variant="h2" style={styles.text}>{title}</AppText>
      {message ? <AppText color="textSecondary" style={styles.text}>{message}</AppText> : null}
      <AppButton compact label="Try again" icon="refresh" onPress={onRetry} />
    </View>
  );
}
