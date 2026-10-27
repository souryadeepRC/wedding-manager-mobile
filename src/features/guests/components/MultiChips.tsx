import { View } from 'react-native';
import { AppText, Chip, useChipTone, type ChipOption } from '@/components';
import { makeStyles } from '@/theme';

type Props = {
  label: string;
  options: readonly ChipOption<string>[];
  value: string[];
  onChange: (v: string[]) => void;
};

const useStyles = makeStyles(t => ({
  wrap: { gap: t.spacing.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
}));

// Multi-select chips: tap to toggle each option on or off.
export function MultiChips({ label, options, value, onChange }: Props) {
  const styles = useStyles();
  const toneOf = useChipTone();
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <View style={styles.wrap}>
      <AppText variant="overline" color="textSecondary">{label}</AppText>
      <View style={styles.row} accessibilityLabel={label}>
        {options.map(o => (
          <Chip key={o.value} role="checkbox" check label={o.label} tone={toneOf(o)}
            selected={value.includes(o.value)} onPress={() => toggle(o.value)} />
        ))}
      </View>
    </View>
  );
}
