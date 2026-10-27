import { View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Badge, PressableScale } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { relationLabel, statusMeta } from '../guest.constants';
import type { Guest } from '../guest.schema';

const STAGGER_MS = 50;
const MAX_STAGGER = 8;

const useStyles = makeStyles(t => ({
  card: {
    backgroundColor: t.colors.surface,
    borderColor: t.colors.border,
    borderWidth: t.sizes.border,
    borderRadius: t.radius.xl,
  },
  touch: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, padding: t.spacing.lg, minHeight: t.sizes.touch * 1.8 },
  bar: { width: t.spacing.sm - t.spacing.xxs, alignSelf: 'stretch', borderRadius: t.radius.pill },
  body: { flex: 1, gap: t.spacing.xxs },
  mail: { width: t.sizes.avatar.md, height: t.sizes.avatar.md, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
}));

export function GuestCard({ guest, onPress, index = 0 }: { guest: Guest; onPress: () => void; index?: number }) {
  const { colors, sizes, alpha } = useTheme();
  const styles = useStyles();
  const status = statusMeta(guest.status);
  const tone = colors[status.color];
  const count = `${guest.guestCount} ${guest.guestCount === 1 ? 'guest' : 'guests'}`;
  const invite = guest.inviteSent ? 'Invite sent' : 'Invite not sent';
  const relation = relationLabel(guest.connection);
  return (
    <PressableScale
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).springify().damping(16)}
      accessibilityRole="button"
      accessibilityLabel={`${guest.title}, ${count}, ${relation}, ${status.label}, ${invite}`}
      onPress={onPress}
      contentStyle={styles.touch}
      style={styles.card}
    >
      <View style={[styles.bar, { backgroundColor: tone }]} />
      <View style={styles.body}>
        <AppText variant="title" numberOfLines={1}>{guest.title}</AppText>
        <AppText variant="body" color="textSecondary" numberOfLines={1}>{`${count} · ${relation}`}</AppText>
      </View>
      <Badge size="md" label={status.label} tone={tone} />
      <View style={[styles.mail, { backgroundColor: guest.inviteSent ? colors.success + alpha.tint : colors.surfaceAlt }]}>
        <Ionicons name="mail" size={sizes.icon.md} color={guest.inviteSent ? colors.success : colors.textSecondary} />
      </View>
    </PressableScale>
  );
}
