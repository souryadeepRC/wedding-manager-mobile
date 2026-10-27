import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: string;
  // Buttons, stacked.
  children: ReactNode;
};

const useStyles = makeStyles(t => ({
  scrim: { flex: 1, backgroundColor: t.colors.overlay, justifyContent: 'center', padding: t.spacing.xl },
  card: {
    alignItems: 'stretch',
    gap: t.spacing.md,
    padding: t.spacing.xl,
    borderRadius: t.radius.xl,
    borderWidth: t.sizes.border,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  circle: { alignSelf: 'center', width: t.sizes.avatar.lg * 0.8, height: t.sizes.avatar.lg * 0.8, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  text: { textAlign: 'center' },
  actions: { gap: t.spacing.sm, marginTop: t.spacing.sm },
}));

// Centered in-app dialog for choices that need more than the native two-button alert.
export function Dialog({ visible, onClose, title, message, icon = 'alert-circle', tone, children }: Props) {
  const { colors, alpha, sizes } = useTheme();
  const styles = useStyles();
  const c = tone ?? colors.warning;
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(150)} style={styles.scrim}>
        <Pressable style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} accessibilityLabel="Close" onPress={onClose} />
        <Animated.View entering={ZoomIn.springify().damping(18)} style={styles.card} accessibilityViewIsModal>
          <View style={[styles.circle, { backgroundColor: c + alpha.tint }]}>
            <Ionicons name={icon} size={sizes.icon.lg} color={c} />
          </View>
          <AppText variant="h2" style={styles.text} accessibilityRole="header">{title}</AppText>
          {message ? <AppText color="textSecondary" style={styles.text}>{message}</AppText> : null}
          <View style={styles.actions}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
