import { useEffect } from 'react';
import type { DimensionValue, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

type Props = { height: number; width?: DimensionValue; style?: ViewStyle };

export function Skeleton({ height, width = '100%', style }: Props) {
  const theme = useTheme();
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
  }, [opacity]);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ height, width, backgroundColor: theme.colors.skeleton, borderRadius: theme.radius.md }, animated, style]}
    />
  );
}
