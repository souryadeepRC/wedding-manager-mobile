import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppText, Confetti } from '@/components';
import type { Wedding } from '@/features/wedding';
import { makeStyles, useTheme } from '@/theme';
import { getCountdown } from '@/utils/date';
import { useToday } from '../useToday';

const useStyles = makeStyles(t => ({
  glow: { borderRadius: t.radius.xl + t.spacing.sm, ...t.shadow.md },
  hero: { borderRadius: t.radius.xl + t.spacing.sm, padding: t.spacing.xl, gap: t.spacing.md, overflow: 'hidden' },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.pill,
  },
  count: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.md, flexWrap: 'wrap' },
  line: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
}));

// The pink countdown hero. Copy and colour swap with how far away the big day is.
export function CountdownCard({ wedding }: { wedding: Wedding }) {
  const router = useRouter();
  const styles = useStyles();
  const theme = useTheme();
  const { colors, gradients, alpha, sizes } = theme;
  const today = useToday();
  const { weddingDate, receptionDate } = wedding;
  const countdown = getCountdown(weddingDate, today);
  const couple = [wedding.brideName, wedding.groomName].filter(Boolean).join(' & ');
  const past = countdown.kind === 'past';
  const ink = past ? colors.onPast : colors.onHero;

  const chip = (text: string, icon?: keyof typeof Ionicons.glyphMap) => (
    <View style={[styles.chip, { backgroundColor: colors.textPrimary + alpha.soft }]}>
      {icon ? <Ionicons name={icon} size={sizes.icon.sm} color={ink} /> : null}
      <AppText variant="label" style={{ color: ink }}>{text}</AppText>
    </View>
  );

  let body;
  if (countdown.kind === 'none') {
    body = (
      <>
        <AppText variant="label" style={{ color: ink }}>No date yet</AppText>
        <AppText variant="display" style={{ color: ink }}>When&apos;s the big day?</AppText>
        <AppButton compact variant="dark" icon="calendar" label="Set your wedding date" onPress={() => router.navigate('/settings')} />
      </>
    );
  } else if (countdown.kind === 'future') {
    const when = weddingDate ? format(weddingDate, 'EEE, d MMM yyyy') : '';
    const reception = receptionDate ? ` · Reception ${format(receptionDate, 'd MMM')}` : '';
    body = (
      <>
        {countdown.days === 1 ? chip('Tomorrow!') : couple ? chip(couple, 'heart') : null}
        <View style={styles.count}>
          <AppText variant="hero" style={{ color: ink }}>{countdown.days}</AppText>
          <AppText variant="h1" style={{ color: ink }}>{countdown.days === 1 ? 'Day to Go' : 'Days to Go'}</AppText>
        </View>
        <View style={styles.line}>
          <Ionicons name="calendar" size={sizes.icon.sm} color={ink} />
          <AppText variant="label" style={{ color: ink, flex: 1 }}>{when + reception}</AppText>
        </View>
      </>
    );
  } else {
    body = (
      <>
        {past
          ? <AppText variant="label" style={{ color: ink }}>Happily ever after</AppText>
          : chip(weddingDate ? format(weddingDate, 'EEE, d MMM yyyy') : '', 'heart')}
        <AppText variant="display" style={{ color: ink }}>{countdown.label}</AppText>
      </>
    );
  }

  return (
    <Animated.View entering={FadeInDown.springify().damping(14)} style={[styles.glow, { shadowColor: past ? colors.accent : colors.primary }]}>
      <View
        style={[styles.hero, { backgroundImage: past ? gradients.past : gradients.hero }]}
        accessible={countdown.kind !== 'none'}
        accessibilityLabel={countdown.kind === 'none' ? undefined : `${couple ? `${couple}. ` : ''}${countdown.label}`}
      >
        <Confetti colors={[colors.textPrimary, colors.accent, ...theme.tileAccents.slice(1)]} />
        {body}
      </View>
    </Animated.View>
  );
}
