import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { Confetti } from './Confetti';

type Action = { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' };

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  // Colour of the round illustration. Accent when omitted.
  tone?: string;
  action?: Action;
  // Extra content under the message (suggestion chips...).
  children?: ReactNode;
  // Dashed frame, for empty sections inside a screen.
  framed?: boolean;
  celebrate?: boolean;
};

const useStyles = makeStyles(t => ({
  wrap: { alignItems: 'center', gap: t.spacing.md, padding: t.spacing.xl },
  framed: { borderWidth: t.sizes.border, borderStyle: 'dashed', borderColor: t.colors.border, borderRadius: t.radius.xl },
  art: { width: t.sizes.avatar.lg * 1.6, height: t.sizes.avatar.lg * 1.3, alignItems: 'center', justifyContent: 'center' },
  circle: { width: t.sizes.avatar.lg, height: t.sizes.avatar.lg, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
}));

export function EmptyState({ icon, title, message, tone, action, children, framed, celebrate }: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const c = tone ?? theme.colors.accent;
  return (
    <Animated.View entering={FadeIn.duration(250)} style={[styles.wrap, framed && styles.framed]}>
      <View style={[styles.art, { backgroundImage: `radial-gradient(circle, ${c}${theme.alpha.soft} 0%, ${c}00 65%)` }]}>
        {celebrate ? <Confetti colors={theme.tileAccents} /> : null}
        <View style={[styles.circle, { backgroundColor: c + theme.alpha.tint }]}>
          <Ionicons name={icon} size={theme.sizes.icon.lg + theme.spacing.sm} color={c} />
        </View>
      </View>
      <AppText variant={framed ? 'title' : 'h2'} style={styles.text}>{title}</AppText>
      {message ? <AppText color="textSecondary" style={styles.text}>{message}</AppText> : null}
      {children}
      {action ? (
        <AppButton compact label={action.label} icon={action.icon} variant={action.variant} onPress={action.onPress} />
      ) : null}
    </Animated.View>
  );
}
