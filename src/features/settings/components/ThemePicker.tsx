import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components';
import { makeStyles, themes, useTheme, type ThemeName } from '@/theme';

type Props = { value: ThemeName; onChange: (name: ThemeName) => void };

const useStyles = makeStyles(t => ({
  row: { flexDirection: 'row', gap: t.spacing.sm },
  card: {
    flex: 1,
    gap: t.spacing.sm,
    padding: t.spacing.sm,
    paddingBottom: t.spacing.md,
    borderRadius: t.radius.xl,
    borderWidth: t.sizes.border * 2,
    backgroundColor: t.colors.surface,
  },
  preview: { borderRadius: t.radius.lg, padding: t.spacing.md, gap: t.spacing.sm },
  bar: { height: t.spacing.md, width: '75%', borderRadius: t.radius.pill },
  dots: { flexDirection: 'row', gap: t.spacing.xs },
  dot: { width: t.spacing.lg, height: t.spacing.lg, borderRadius: t.radius.pill },
  tick: {
    position: 'absolute',
    top: -t.spacing.xs,
    right: -t.spacing.xs,
    width: t.sizes.icon.lg,
    height: t.sizes.icon.lg,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { paddingHorizontal: t.spacing.xs },
}));

// One mini preview card per theme: its page colour, a primary bar and four swatches.
export function ThemePicker({ value, onChange }: Props) {
  const current = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Theme">
      {Object.values(themes).map(theme => {
        const selected = theme.name === value;
        const c = theme.colors;
        return (
          <Pressable
            key={theme.name}
            accessibilityRole="radio"
            accessibilityLabel={theme.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(theme.name as ThemeName)}
            style={[styles.card, { borderColor: selected ? current.colors.primary : current.colors.border }]}
          >
            <View style={[styles.preview, { backgroundColor: c.background }]}>
              <View style={[styles.bar, { backgroundColor: c.primary }]} />
              <View style={styles.dots}>
                {[c.surface, c.primary, c.accent, theme.tileAccents[2]].map((d, i) => (
                  <View key={i} style={[styles.dot, { backgroundColor: d }]} />
                ))}
              </View>
              {selected ? (
                <View style={[styles.tick, { backgroundColor: current.colors.primary }]}>
                  <Ionicons name="checkmark" size={current.sizes.icon.sm} color={current.colors.onPrimary} />
                </View>
              ) : null}
            </View>
            <AppText variant="title" style={styles.label}>{theme.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
