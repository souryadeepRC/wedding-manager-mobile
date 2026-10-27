import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format, isToday } from 'date-fns';
import { makeStyles, useTheme } from '@/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

type Props = {
  label: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  error?: string;
  placeholder?: string;
  // Leading icon and its colour (defaults to a calendar in the secondary text colour).
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  // Show a round clear button when a date is set.
  clearable?: boolean;
};

const useStyles = makeStyles(t => ({
  wrap: { gap: t.spacing.sm },
  field: {
    minHeight: t.sizes.touch + t.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    borderWidth: t.sizes.border,
    borderRadius: t.radius.lg,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.sm,
    backgroundColor: t.colors.surfaceAlt,
  },
  press: { flex: 1, minHeight: t.sizes.touch, flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  grow: { flex: 1 },
  end: { width: t.sizes.touch, height: t.sizes.touch, alignItems: 'center', justifyContent: 'center' },
  clear: { width: t.sizes.icon.lg, height: t.sizes.icon.lg, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.border },
  picker: { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, borderWidth: t.sizes.border, borderColor: t.colors.border, padding: t.spacing.sm, gap: t.spacing.sm },
}));

export function DateField({
  label, value, onChange, error, placeholder = 'Select a date', icon = 'calendar-outline', iconColor, clearable,
}: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const { colors, sizes } = theme;
  const [open, setOpen] = useState(false);
  const shown = value ? format(value, 'EEE, d MMM yyyy') : placeholder;

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode: 'date',
        onValueChange: (_e, d) => onChange(d),
      });
    } else {
      setOpen(o => !o);
    }
  };

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textSecondary">{label}</AppText>
      <View style={[styles.field, { borderColor: error ? colors.danger : open ? colors.primary : colors.border }]}>
        <Pressable
          style={styles.press}
          accessibilityRole="button"
          accessibilityLabel={`${label}, ${value ? format(value, 'EEEE d MMMM yyyy') : 'not set'}`}
          onPress={openPicker}
        >
          <Ionicons name={icon} size={sizes.icon.md} color={iconColor ?? colors.textSecondary} />
          <AppText variant="title" color={value ? 'textPrimary' : 'onDisabled'} style={styles.grow}>{shown}</AppText>
          {value && isToday(value) ? <AppText variant="label" color="primary">Today</AppText> : null}
        </Pressable>
        {clearable && value ? (
          <Pressable style={styles.end} accessibilityRole="button" accessibilityLabel={`Clear ${label}`} onPress={() => onChange(null)}>
            <View style={styles.clear}>
              <Ionicons name="close" size={sizes.icon.sm} color={colors.textPrimary} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.end}>
            <Ionicons name="calendar-clear-outline" size={sizes.icon.md} color={colors.textSecondary} />
          </View>
        )}
      </View>
      {Platform.OS === 'ios' && open ? (
        <View style={styles.picker}>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="inline"
            accentColor={colors.primary}
            themeVariant={theme.mode}
            onValueChange={(_e, d) => onChange(d)}
          />
          <AppButton label="Done" variant="secondary" onPress={() => setOpen(false)} />
        </View>
      ) : null}
      {error ? <AppText variant="caption" color="danger">{error}</AppText> : null}
    </View>
  );
}
