import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { differenceInCalendarDays, format } from 'date-fns';
import { FadeInDown } from 'react-native-reanimated';
import { AppText, Badge, PressableScale } from '@/components';
import { makeStyles, useTheme, type AppTheme } from '@/theme';
import type { ChecklistItem } from '../checklist.schema';

const STAGGER_MS = 50;
const MAX_STAGGER = 8;
const SOON_DAYS = 3;

const useStyles = makeStyles(t => ({
  card: { borderWidth: t.sizes.border, borderRadius: t.radius.xl },
  touch: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, padding: t.spacing.md, minHeight: t.sizes.touch * 2 },
  check: { width: t.sizes.avatar.md, height: t.sizes.avatar.md, alignItems: 'center', justifyContent: 'center' },
  ring: { width: t.sizes.icon.lg + t.spacing.xs, height: t.sizes.icon.lg + t.spacing.xs, borderRadius: t.radius.pill, borderWidth: t.sizes.border * 2, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: t.spacing.sm },
}));

type Due = { label: string; tone?: string; icon?: keyof typeof Ionicons.glyphMap; overdue?: boolean };

// Overdue is red, due within a few days is gold, later is calm purple, no date is neutral.
function dueInfo(item: ChecklistItem, today: Date, { colors, tileAccents }: AppTheme): Due {
  if (!item.dueDate) return { label: 'No due date' };
  const day = format(item.dueDate, 'd MMM');
  if (item.status === 'done') return { label: `Due ${day}`, tone: colors.success, icon: 'calendar' };
  const days = differenceInCalendarDays(item.dueDate, today);
  if (days < 0) return { label: `Overdue · ${day}`, tone: colors.danger, icon: 'alert-circle', overdue: true };
  if (days === 0) return { label: 'Due today', tone: colors.warning, icon: 'time' };
  if (days === 1) return { label: `Tomorrow · ${day}`, tone: colors.warning, icon: 'time' };
  if (days <= SOON_DAYS) return { label: `In ${days} days · ${day}`, tone: colors.warning, icon: 'time' };
  return { label: `Due ${day}`, tone: tileAccents[1], icon: 'calendar' };
}

type Props = { item: ChecklistItem; today: Date; index?: number; onPress: () => void; onToggle: () => void };

export function ChecklistCard({ item, today, index = 0, onPress, onToggle }: Props) {
  const theme = useTheme();
  const { colors, sizes, alpha } = theme;
  const styles = useStyles();
  const done = item.status === 'done';
  const due = dueInfo(item, today, theme);

  return (
    <PressableScale
      entering={FadeInDown.delay(Math.min(index, MAX_STAGGER) * STAGGER_MS).springify().damping(16)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${due.label}, ${done ? 'done' : 'pending'}`}
      onPress={onPress}
      contentStyle={styles.touch}
      style={[styles.card, due.overdue
        ? { backgroundColor: colors.danger + alpha.faint, borderColor: colors.danger + alpha.edge }
        : { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`Mark ${item.title} as ${done ? 'pending' : 'done'}`}
        accessibilityState={{ checked: done }}
        onPress={onToggle}
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
        <Badge size="md" icon={due.icon} tone={due.tone} label={due.label} />
      </View>
    </PressableScale>
  );
}
