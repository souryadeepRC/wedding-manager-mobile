import { View } from 'react-native';
import { AppText, IconButton } from '@/components';
import { makeStyles } from '@/theme';

type Props = { label: string; value: number; min: number; max: number; onChange: (n: number) => void };

const useStyles = makeStyles(t => ({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    padding: t.spacing.xs,
    borderRadius: t.radius.pill,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surfaceAlt,
  },
  value: { minWidth: t.sizes.touch, textAlign: 'center' },
}));

// Label on the left, a − value + pill on the right.
export function Stepper({ label, value, min, max, onChange }: Props) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <AppText variant="label" color="textSecondary">{label}</AppText>
      <View style={styles.pill}>
        <IconButton icon="remove" variant="filled" accessibilityLabel={`Decrease ${label}`}
          disabled={value <= min} onPress={() => onChange(Math.max(min, value - 1))} />
        <AppText variant="h2" style={styles.value} accessibilityLabel={`${label}: ${value}`}>{value}</AppText>
        <IconButton icon="add" variant="filled" accessibilityLabel={`Increase ${label}`}
          disabled={value >= max} onPress={() => onChange(Math.min(max, value + 1))} />
      </View>
    </View>
  );
}
