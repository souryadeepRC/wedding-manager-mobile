import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { FadeInDown } from 'react-native-reanimated';
import { AppText, PressableScale } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { formatINR } from '@/utils/currency';
import { modeMeta } from '../expense.constants';
import type { Payment } from '../expense.schema';

// Hex alpha for the tinted icon fill.
const TINT = '26';
const STAGGER_MS = 40;
const MAX_STAGGER = 8;

const useStyles = makeStyles(t => ({
  card: { backgroundColor: t.colors.surface, borderWidth: t.sizes.border, borderRadius: t.radius.xl },
  touch: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, padding: t.spacing.lg, minHeight: t.sizes.touch * 1.8 },
  icon: { width: t.sizes.avatar.md + t.spacing.sm, height: t.sizes.avatar.md + t.spacing.sm, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: t.spacing.xxs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs },
}));

export function PaymentRow({ payment, onPress, index = 0 }: { payment: Payment; onPress: () => void; index?: number }) {
  const { colors, tileAccents, sizes } = useTheme();
  const styles = useStyles();
  const mode = modeMeta(payment.mode);
  const tone = tileAccents[mode.tone % tileAccents.length];
  const date = format(payment.paidOn, 'dd MMM yyyy');
  return (
    <PressableScale
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).springify().damping(16)}
      accessibilityRole="button"
      accessibilityLabel={`${formatINR(payment.amount)} by ${mode.label} on ${date}`}
      onPress={onPress}
      contentStyle={styles.touch}
      style={[styles.card, { borderColor: colors.border }]}
    >
      <View style={[styles.icon, { backgroundColor: tone + TINT }]}>
        <Ionicons name={mode.icon} size={sizes.icon.md} color={tone} />
      </View>
      <View style={styles.text}>
        <AppText variant="title">{formatINR(payment.amount)}</AppText>
        <View style={styles.meta}>
          <AppText variant="label" style={{ color: tone }}>{mode.label}</AppText>
          <AppText variant="caption" color="textSecondary">{`· ${date}`}</AppText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={sizes.icon.sm} color={colors.textSecondary} />
    </PressableScale>
  );
}
