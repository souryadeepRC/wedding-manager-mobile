import { View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppText, Badge, PressableScale } from '@/components';
import type { ModuleEntry } from '@/modules/registry';
import { makeStyles, useTheme } from '@/theme';

const ENTER_STAGGER_MS = 70;

const useStyles = makeStyles(t => ({
  cell: { flexBasis: '47%', flexGrow: 1 },
  tile: {
    minHeight: t.sizes.touch * 3.6,
    borderRadius: t.radius.xl,
    borderWidth: t.sizes.border,
  },
  press: { flex: 1, padding: t.spacing.lg, gap: t.spacing.md, justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  iconWrap: {
    width: t.sizes.avatar.md + t.spacing.md,
    height: t.sizes.avatar.md + t.spacing.md,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { gap: t.spacing.xxs },
}));

export function ModuleTile({ module, accent, index }: { module: ModuleEntry; accent: string; index: number }) {
  const theme = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const stat = module.useStat?.();
  const soon = module.status === 'soon';
  const { colors, alpha, sizes } = theme;

  return (
    <PressableScale
      entering={FadeInDown.delay(index * ENTER_STAGGER_MS).springify().damping(14)}
      accessibilityRole="button"
      accessibilityLabel={soon ? `${module.title}, coming soon` : stat ? `${module.title}. ${stat}` : module.title}
      accessibilityState={{ disabled: soon }}
      disabled={soon}
      onPress={() => router.push(module.route)}
      layoutStyle={styles.cell}
      contentStyle={styles.press}
      style={[
        styles.tile,
        soon
          ? { backgroundColor: colors.disabled, borderColor: colors.border, borderStyle: 'dashed' }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.iconWrap, { backgroundColor: (soon ? colors.onDisabled : accent) + alpha.tint }]}>
          <Ionicons name={soon ? 'lock-closed' : module.icon} size={sizes.icon.md} color={soon ? colors.onDisabled : accent} />
        </View>
        {soon ? <Badge label="Coming soon" /> : <Ionicons name="chevron-forward" size={sizes.icon.sm} color={colors.textSecondary} />}
      </View>
      <View style={styles.text}>
        <AppText variant="title" color={soon ? 'onDisabled' : 'textPrimary'}>{module.title}</AppText>
        {stat && !soon ? <AppText variant="body" color="textSecondary">{stat}</AppText> : null}
      </View>
    </PressableScale>
  );
}
