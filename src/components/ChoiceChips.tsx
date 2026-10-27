import { View } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme, type ThemeColors } from '@/theme';
import { AppText } from './AppText';
import { Chip } from './Chip';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  // Theme colour name, or an index into the theme's tileAccents.
  color?: keyof ThemeColors;
  tone?: number;
};

type Props<T extends string> = {
  label: string;
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  check?: boolean;
  // Two even columns of rounded tiles instead of free-flowing pills.
  grid?: boolean;
};

const useStyles = makeStyles(t => ({
  wrap: { gap: t.spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  cell: { flexBasis: '47%', flexGrow: 1, borderRadius: t.radius.lg, minHeight: t.sizes.avatar.md + t.spacing.xs },
}));

// Resolves an option's colour from the current theme.
export function useChipTone() {
  const { colors, tileAccents } = useTheme();
  return (o: { color?: keyof ThemeColors; tone?: number }) =>
    o.color ? colors[o.color] : o.tone !== undefined ? tileAccents[o.tone % tileAccents.length] : undefined;
}

export function ChoiceChips<T extends string>({ label, options, value, onChange, check, grid }: Props<T>) {
  const styles = useStyles();
  const toneOf = useChipTone();
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textSecondary">{label}</AppText>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map(o => (
          <Chip
            key={o.value}
            role="radio"
            label={o.label}
            icon={o.icon}
            tone={toneOf(o)}
            check={check}
            selected={o.value === value}
            onPress={() => onChange(o.value)}
            style={grid ? styles.cell : undefined}
          />
        ))}
      </View>
    </View>
  );
}
