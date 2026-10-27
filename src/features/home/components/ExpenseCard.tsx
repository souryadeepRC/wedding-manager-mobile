import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppText, Badge, Card, Skeleton } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { formatINR } from '@/utils/currency';

type Props = {
  paid: number;
  total: number;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

const useStyles = makeStyles(t => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  icon: { width: t.sizes.avatar.md + t.spacing.md, height: t.sizes.avatar.md + t.spacing.md, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
}));

// "Total spent" = everything actually paid so far, with how much of the budgeted total that is.
export function ExpenseCard({ paid, total, loading, error, onRetry }: Props) {
  const { colors, alpha, sizes, tileAccents } = useTheme();
  const styles = useStyles();
  if (loading) return <Card><Skeleton height={20} width="40%" /><Skeleton height={32} width="60%" /></Card>;
  if (error) {
    return (
      <Card>
        <AppText variant="label" color="textSecondary">💸 Total spent</AppText>
        <AppText color="danger">Could not load expenses.</AppText>
        <AppButton compact label="Try again" icon="refresh" variant="secondary" onPress={onRetry} />
      </Card>
    );
  }
  const percent = total ? Math.round((paid / total) * 100) : 0;
  return (
    <Animated.View entering={FadeInDown.delay(120).springify().damping(14)}>
      <Card style={styles.row} accessible accessibilityLabel={`Total spent ${formatINR(paid)}, ${percent}% paid`}>
        <View style={[styles.icon, { backgroundColor: colors.accent + alpha.tint }]}>
          <Ionicons name="wallet" size={sizes.icon.md} color={colors.accent} />
        </View>
        <View style={styles.grow}>
          <AppText variant="label" color="textSecondary">💸 Total spent</AppText>
          <AppText variant="h1" color="accent" numberOfLines={1} adjustsFontSizeToFit>{formatINR(paid)}</AppText>
        </View>
        {total ? <Badge size="md" label={`${percent}% paid`} tone={colors.success} />
          : <Badge size="md" label="Fresh start" tone={tileAccents[6 % tileAccents.length]} />}
      </Card>
    </Animated.View>
  );
}
