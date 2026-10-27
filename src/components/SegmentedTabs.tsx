import { Pressable, View } from 'react-native';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string; count?: number };
type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

const useStyles = makeStyles(t => ({
  track: {
    flexDirection: 'row',
    padding: t.spacing.xs,
    gap: t.spacing.xs,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surface,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
  },
  tab: {
    flex: 1,
    minHeight: t.sizes.touch + t.spacing.xs,
    flexDirection: 'row',
    gap: t.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.pill,
  },
  count: {
    minWidth: t.sizes.icon.md + t.spacing.xs,
    paddingHorizontal: t.spacing.xs,
    height: t.sizes.icon.md + t.spacing.xs,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors, alpha } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map(o => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityLabel={o.count !== undefined ? `${o.label}, ${o.count}` : o.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(o.value)}
            style={[styles.tab, selected && { backgroundColor: colors.primary }]}
          >
            <AppText variant="button" color={selected ? 'onPrimary' : 'textSecondary'}>{o.label}</AppText>
            {o.count !== undefined ? (
              <View style={[styles.count, { backgroundColor: selected ? colors.textPrimary + alpha.soft : colors.surfaceAlt }]}>
                <AppText variant="label" color={selected ? 'onPrimary' : 'textPrimary'}>{o.count}</AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
