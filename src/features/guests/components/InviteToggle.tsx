import { Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, PressableScale } from '@/components';
import { makeStyles, useTheme } from '@/theme';

type Props = { value: boolean; onChange: (v: boolean) => void };

const useStyles = makeStyles(t => ({
  card: { borderRadius: t.radius.xl, borderWidth: t.sizes.border },
  touch: {
    minHeight: t.sizes.touch * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.md,
  },
  icon: {
    width: t.sizes.touch,
    height: t.sizes.touch,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: t.spacing.xxs },
}));

// One tappable card: tapping anywhere (or the switch) flips the invite state.
export function InviteToggle({ value, onChange }: Props) {
  const { colors, sizes, alpha } = useTheme();
  const styles = useStyles();
  const tone = value ? colors.success : colors.textSecondary;
  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityLabel="Invite sent"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      contentStyle={styles.touch}
      style={[styles.card, {
        backgroundColor: value ? colors.success + alpha.faint : colors.surface,
        borderColor: value ? colors.success : colors.border,
      }]}
    >
      <View style={[styles.icon, { backgroundColor: tone + alpha.tint }]}>
        <Ionicons name="mail" size={sizes.icon.md} color={tone} />
      </View>
      <View style={styles.text}>
        <AppText variant="title">Invite sent</AppText>
        <AppText variant="caption" color={value ? 'success' : 'textSecondary'}>
          {value ? 'Yes, the invitation has been sent' : 'Not sent yet'}
        </AppText>
      </View>
      <Switch
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.success }}
        thumbColor={colors.onPrimary}
      />
    </PressableScale>
  );
}
