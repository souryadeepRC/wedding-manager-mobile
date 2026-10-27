import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText, Confetti, ProgressBar } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { formatINR } from '@/utils/currency';
import { expenseVisual } from '../expense.visuals';

type Props = {
  // Set on the detail screen; omitted for the all-expenses summary.
  title?: string;
  total: number;
  paid: number;
  remaining: number;
};

const useStyles = makeStyles(t => ({
  card: {
    borderRadius: t.radius.xl + t.spacing.sm,
    borderWidth: t.sizes.border,
    padding: t.spacing.xl,
    gap: t.spacing.lg,
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  badge: { width: t.sizes.avatar.md + t.spacing.lg, height: t.sizes.avatar.md + t.spacing.lg, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1 },
  stats: { flexDirection: 'row', gap: t.spacing.sm },
  stat: { flex: 1, padding: t.spacing.md, borderRadius: t.radius.lg, gap: t.spacing.xxs },
}));

// Headline numbers: what is left to pay, a progress bar, then total / paid / percent boxes.
export function BalanceCard({ title, total, paid, remaining }: Props) {
  const theme = useTheme();
  const { colors, alpha, sizes, gradients, tileAccents } = theme;
  const styles = useStyles();
  const done = remaining === 0 && total > 0;
  const percent = total ? Math.round((paid / total) * 100) : 0;
  const visual = title ? expenseVisual(title) : null;
  const tone = done ? colors.success : visual ? tileAccents[visual.tone % tileAccents.length] : colors.success;

  const stat = (label: string, value: string, color?: string) => (
    <View style={[styles.stat, { backgroundColor: colors.textPrimary + alpha.faint }]}>
      <AppText variant="caption" color="textSecondary">{label}</AppText>
      <AppText variant="title" numberOfLines={1} adjustsFontSizeToFit style={color ? { color } : undefined}>{value}</AppText>
    </View>
  );

  return (
    <Animated.View entering={FadeInDown.springify().damping(14)}>
      <View
        style={[
          styles.card,
          done
            ? { backgroundImage: gradients.settled, borderColor: colors.success + alpha.edge }
            : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        ]}
        accessible
        accessibilityLabel={`${title ?? 'All expenses'}. Total ${formatINR(total)}, paid ${formatINR(paid)}, ${done ? 'paid in full' : `${formatINR(remaining)} left`}`}
      >
        {done ? <Confetti colors={tileAccents} /> : null}
        {title && visual ? (
          <View style={styles.head}>
            <View style={[styles.badge, { backgroundColor: tone + alpha.tint }]}>
              <Ionicons name={visual.icon} size={sizes.icon.md + sizes.dot / 2} color={tone} />
            </View>
            <AppText variant="h2" style={styles.title} accessibilityRole="header" numberOfLines={2}>{title}</AppText>
          </View>
        ) : null}
        <View>
          <AppText variant="label" style={{ color: done ? colors.success : colors.textSecondary }}>
            {done ? 'All settled' : 'Left to pay'}
          </AppText>
          <AppText variant="display" numberOfLines={1} adjustsFontSizeToFit>{done ? 'Paid in full 🎉' : formatINR(remaining)}</AppText>
        </View>
        <ProgressBar
          value={total ? paid / total : 0}
          gradient={!title && !done ? gradients.progress : undefined}
          fill={tone}
          track={colors.textPrimary + alpha.faint}
        />
        <View style={styles.stats}>
          {stat('Total', formatINR(total))}
          {stat('Paid', formatINR(paid))}
          {stat('Paid', `${percent}%`, tone)}
        </View>
      </View>
    </Animated.View>
  );
}
