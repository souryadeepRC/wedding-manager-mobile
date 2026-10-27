import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { makeStyles, useTheme, type ThemeColors } from '@/theme';

type Props = {
  value: number;
  color?: keyof ThemeColors;
  fill?: string;
  // CSS gradient for the fill; wins over `fill`/`color`.
  gradient?: string;
  track?: string;
};

const FILL_MS = 600;

const useStyles = makeStyles(t => ({
  track: {
    height: t.spacing.md,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: t.radius.pill },
}));

// Rounded bar that animates to `value` (0 to 1).
export function ProgressBar({ value, color = 'success', fill, gradient, track }: Props) {
  const { colors } = useTheme();
  const styles = useStyles();
  const clamped = Math.min(1, Math.max(0, value));
  const width = useSharedValue(0);
  useEffect(() => { width.set(withTiming(clamped, { duration: FILL_MS })); }, [clamped, width]);
  const anim = useAnimatedStyle(() => ({ width: `${width.get() * 100}%` }));
  return (
    <View style={[styles.track, track ? { backgroundColor: track } : null]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <Animated.View style={[styles.fill, gradient ? { backgroundImage: gradient } : { backgroundColor: fill ?? colors[color] }, anim]} />
    </View>
  );
}
