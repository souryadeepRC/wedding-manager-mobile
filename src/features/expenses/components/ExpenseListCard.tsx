import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInDown } from 'react-native-reanimated';
import { AppText, Badge, PressableScale, ProgressBar } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { formatINR } from '@/utils/currency';
import type { ExpenseSummary } from '../expense.schema';
import { expenseVisual } from '../expense.visuals';

const STAGGER_MS = 50;
const MAX_STAGGER = 8;

const useStyles = makeStyles(t => ({
  card: { borderWidth: t.sizes.border, borderRadius: t.radius.xl },
  touch: { padding: t.spacing.lg, gap: t.spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  icon: { width: t.sizes.avatar.md + t.spacing.sm, height: t.sizes.avatar.md + t.spacing.sm, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  titles: { flex: 1, gap: t.spacing.xxs },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: t.spacing.md },
}));

export function ExpenseListCard({ expense, onPress, index = 0 }: { expense: ExpenseSummary; onPress: () => void; index?: number }) {
  const { colors, tileAccents, sizes, alpha, gradients } = useTheme();
  const styles = useStyles();
  const done = expense.remaining === 0;
  const progress = expense.totalAmount ? expense.paid / expense.totalAmount : 0;
  const visual = expenseVisual(expense.title);
  const tone = done ? colors.success : tileAccents[visual.tone % tileAccents.length];
  return (
    <PressableScale
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).springify().damping(16)}
      accessibilityRole="button"
      accessibilityLabel={`${expense.title}, total ${formatINR(expense.totalAmount)}, ${done ? 'paid in full' : `${formatINR(expense.remaining)} left`}`}
      onPress={onPress}
      contentStyle={styles.touch}
      style={[
        styles.card,
        done
          ? { backgroundImage: gradients.settled, borderColor: colors.success + alpha.edge }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: tone + alpha.tint }]}>
          <Ionicons name={visual.icon} size={sizes.icon.md} color={tone} />
        </View>
        <View style={styles.titles}>
          <AppText variant="title" numberOfLines={1}>{expense.title}</AppText>
          <AppText variant="body" color="textSecondary">{`Total ${formatINR(expense.totalAmount)}`}</AppText>
        </View>
        <Badge size="md" tone={tone} label={done ? 'Paid ✓' : `${Math.round(progress * 100)}%`} />
      </View>
      <ProgressBar value={progress} fill={tone} />
      <View style={styles.bottom}>
        <AppText variant="body" color="textSecondary">
          {'Paid '}<AppText variant="label" color="textPrimary">{formatINR(expense.paid)}</AppText>
        </AppText>
        {done ? (
          <AppText variant="label" color="success">Settled 🎉</AppText>
        ) : (
          <AppText variant="body" color="textSecondary">
            <AppText variant="label" color="textPrimary">{formatINR(expense.remaining)}</AppText>{' left'}
          </AppText>
        )}
      </View>
    </PressableScale>
  );
}
