import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Modal, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';

type Props = { visible: boolean; onClose: () => void; children: ReactNode };

const WIDTH_RATIO = 0.86;
const SLIDE_MS = 220;

const useStyles = makeStyles(t => ({
  scrim: { ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const), backgroundColor: t.colors.overlay },
  sheet: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: t.colors.surface,
    borderTopRightRadius: t.radius.xl,
    borderBottomRightRadius: t.radius.xl,
    ...t.shadow.md,
  },
}));

// Panel that slides in from the left over a dimmed backdrop.
export function SideSheet({ visible, onClose, children }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width: screen } = useWindowDimensions();
  const width = screen * WIDTH_RATIO;
  const [mounted, setMounted] = useState(visible);
  const [progress] = useState(() => new Animated.Value(0));

  // Mount before sliding in; unmount only after the slide-out finishes.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    Animated.timing(progress, { toValue: visible ? 1 : 0, duration: SLIDE_MS, useNativeDriver: true })
      .start(({ finished }) => { if (finished && !visible) setMounted(false); });
  }, [visible, progress]);

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[styles.scrim, { opacity: progress }]}>
        <Pressable style={{ flex: 1 }} accessibilityLabel="Close filters" onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.sheet,
          {
            width,
            shadowColor: colors.primary,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] }) }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}
