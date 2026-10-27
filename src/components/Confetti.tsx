import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming,
} from 'react-native-reanimated';
import { makeStyles, useTheme } from '@/theme';

// Fixed layout (percent across, percent down, shape, size step) so it never reshuffles.
const BITS = [
  { x: 6, y: 18, round: true, size: 1 },
  { x: 20, y: 70, round: false, size: 2 },
  { x: 34, y: 10, round: false, size: 1 },
  { x: 48, y: 78, round: true, size: 2 },
  { x: 62, y: 14, round: true, size: 1 },
  { x: 74, y: 62, round: false, size: 1 },
  { x: 86, y: 24, round: false, size: 2 },
  { x: 94, y: 74, round: true, size: 1 },
] as const;

const FLOAT_MS = 2600;
const RISE = 10;

const useStyles = makeStyles(t => ({
  layer: { ...({ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const) },
  bit: { position: 'absolute' },
  sq: { borderRadius: t.radius.sm / 4 },
  dot: { borderRadius: t.radius.pill },
}));

function Bit({ i, color }: { i: number; color: string }) {
  const styles = useStyles();
  const { spacing } = useTheme();
  const b = BITS[i];
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(i * 260, withRepeat(withTiming(1, { duration: FLOAT_MS, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [i, t]);
  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: -RISE * t.value }, { rotate: `${t.value * 90}deg` }],
    opacity: 0.55 + 0.45 * t.value,
  }));
  const size = spacing.sm * b.size;
  return (
    <Animated.View
      style={[
        styles.bit, b.round ? styles.dot : styles.sq,
        { left: `${b.x}%`, top: `${b.y}%`, width: size, height: size, backgroundColor: color },
        anim,
      ]}
    />
  );
}

// Decorative floating confetti; ignores touches and is hidden from screen readers.
export function Confetti({ colors }: { colors: readonly string[] }) {
  const styles = useStyles();
  return (
    <View style={styles.layer} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {BITS.map((_, i) => <Bit key={i} i={i} color={colors[i % colors.length]} />)}
    </View>
  );
}
