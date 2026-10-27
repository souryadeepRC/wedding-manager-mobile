import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '@/theme';
import { AppText } from './AppText';

export type ToastOptions = { detail?: string; tone?: 'success' | 'error' };
type ToastFn = (message: string, options?: ToastOptions) => void;
type Toast = ToastOptions & { id: number; message: string };

const ToastContext = createContext<ToastFn>(() => {});
const VISIBLE_MS = 2400;

const useStyles = makeStyles(t => ({
  wrap: { position: 'absolute', left: t.spacing.lg, right: t.spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.md,
    borderRadius: t.radius.xl,
    borderWidth: t.sizes.border,
    backgroundColor: t.colors.surface,
    ...t.shadow.md,
  },
  icon: { width: t.sizes.touch, height: t.sizes.touch, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
}));

// Card that drops in from the top and hides itself after a moment.
export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors, alpha, sizes, spacing } = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ToastFn>((message, options) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, ...options });
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS);
  }, []);

  const tone = toast?.tone === 'error' ? colors.danger : colors.success;
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast ? (
        <Animated.View
          key={toast.id}
          entering={FadeInUp.springify().damping(16)}
          exiting={FadeOutUp}
          style={[styles.wrap, { top: insets.top + spacing.sm }]}
          pointerEvents="none"
          accessibilityLiveRegion="polite"
        >
          <View style={[styles.card, { borderColor: tone + alpha.edge, shadowColor: tone, backgroundColor: colors.surface }]}>
            <View style={[styles.icon, { backgroundColor: tone }]}>
              <Ionicons name={toast.tone === 'error' ? 'alert' : 'checkmark'} size={sizes.icon.md} color={colors.background} />
            </View>
            <View style={styles.text}>
              <AppText variant="title">{toast.message}</AppText>
              {toast.detail ? <AppText variant="caption" color="textSecondary">{toast.detail}</AppText> : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
