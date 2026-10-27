import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components';
import { makeStyles, useTheme } from '@/theme';

type Props = {
  value: string;
  onChange: (v: string) => void;
  activeFilters: number;
  onOpenFilters: () => void;
};

const useStyles = makeStyles(t => ({
  field: {
    minHeight: t.sizes.touch + t.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.xs,
    borderRadius: t.radius.pill,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  input: { flex: 1, alignSelf: 'stretch', color: t.colors.textPrimary, ...t.typography.title },
  filter: {
    width: t.sizes.avatar.md,
    height: t.sizes.avatar.md,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.surfaceAlt,
  },
  count: {
    position: 'absolute',
    top: -t.spacing.xs,
    right: -t.spacing.xxs,
    minWidth: t.sizes.icon.md,
    height: t.sizes.icon.md,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.accent,
  },
}));

// One pill: search on the left, the filter button (with its active count) on the right.
export function GuestSearchBar({ value, onChange, activeFilters, onOpenFilters }: Props) {
  const { colors, sizes } = useTheme();
  const styles = useStyles();
  const active = activeFilters > 0;
  return (
    <View style={styles.field}>
      <Ionicons name="search" size={sizes.icon.md} color={colors.textSecondary} />
      <TextInput
        accessibilityLabel="Search guests"
        placeholder="Search guests"
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChange}
        returnKeyType="search"
        style={styles.input}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={sizes.icon.sm} onPress={() => onChange('')}>
          <Ionicons name="close-circle" size={sizes.icon.md} color={colors.textSecondary} />
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={active ? `Filters, ${activeFilters} active` : 'Filters'}
        onPress={onOpenFilters}
        style={({ pressed }) => [styles.filter, pressed && { backgroundColor: colors.border }]}
      >
        <Ionicons name="filter" size={sizes.icon.md} color={colors.textPrimary} />
        {active ? <View style={styles.count}><AppText variant="label" color="background">{activeFilters}</AppText></View> : null}
      </Pressable>
    </View>
  );
}
