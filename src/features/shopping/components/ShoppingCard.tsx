import { useEffect, useEffectEvent, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInDown } from 'react-native-reanimated';
import { AppText, Badge, PressableScale } from '@/components';
import { makeStyles, useTheme } from '@/theme';
import { itemForMeta } from '../shopping.constants';
import type { ShoppingItem } from '../shopping.schema';

const STAGGER_MS = 50;
const MAX_STAGGER = 8;
// Ticked items linger briefly ("Moving to Done ✓") before leaving the Pending tab.
const MOVE_MS = 700;

const useStyles = makeStyles(t => ({
  card: { borderWidth: t.sizes.border, borderRadius: t.radius.xl },
  touch: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, padding: t.spacing.md, minHeight: t.sizes.touch * 2 },
  check: { width: t.sizes.avatar.md, height: t.sizes.avatar.md, alignItems: 'center', justifyContent: 'center' },
  ring: { width: t.sizes.icon.lg + t.spacing.xs, height: t.sizes.icon.lg + t.spacing.xs, borderRadius: t.radius.pill, borderWidth: t.sizes.border * 2, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: t.spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: t.spacing.sm },
}));

type Props = { item: ShoppingItem; index?: number; onPress: () => void; onToggle: () => void };

export function ShoppingCard({ item, index = 0, onPress, onToggle }: Props) {
  const { colors, tileAccents, sizes, alpha } = useTheme();
  const styles = useStyles();
  const [moving, setMoving] = useState(false);
  const done = item.status === 'done' || moving;
  const who = itemForMeta(item.itemFor);
  const tone = tileAccents[who.tone % tileAccents.length];

  const commit = useEffectEvent(() => { setMoving(false); onToggle(); });
  useEffect(() => {
    if (!moving) return;
    const t = setTimeout(commit, MOVE_MS);
    return () => clearTimeout(t);
  }, [moving]);

  const toggle = () => (item.status === 'pending' ? setMoving(true) : onToggle());
  return (
    <PressableScale
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).springify().damping(16)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, for ${who.label}, ${done ? 'done' : 'pending'}`}
      onPress={onPress}
      contentStyle={styles.touch}
      style={[styles.card, moving
        ? { backgroundColor: colors.success + alpha.faint, borderColor: colors.success + alpha.edge }
        : { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`Mark ${item.title} as ${done ? 'pending' : 'done'}`}
        accessibilityState={{ checked: done }}
        disabled={moving}
        onPress={toggle}
        style={styles.check}
      >
        <View style={[styles.ring, done
          ? { backgroundColor: colors.success, borderColor: colors.success }
          : { borderColor: colors.textSecondary }]}>
          {done ? <Ionicons name="checkmark" size={sizes.icon.sm} color={colors.background} /> : null}
        </View>
      </Pressable>
      <View style={styles.body}>
        <AppText
          variant="title"
          numberOfLines={2}
          color={done ? 'textSecondary' : 'textPrimary'}
          style={done ? { textDecorationLine: 'line-through' } : undefined}
        >
          {item.title}
        </AppText>
        <View style={styles.meta}>
          <Badge size="md" icon={who.icon} tone={tone} label={`For ${who.label}`} />
          {moving ? <AppText variant="label" color="success">Moving to Done ✓</AppText> : null}
        </View>
      </View>
    </PressableScale>
  );
}
