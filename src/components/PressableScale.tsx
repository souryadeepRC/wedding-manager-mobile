import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedProps, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  layoutStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  entering?: AnimatedProps<ViewStyle>['entering'];
  children: ReactNode;
};

const PRESSED_SCALE = 0.95;
const SPRING = { damping: 14, stiffness: 260 } as const;

// Pressable that springs down on touch. The entering animation and `layoutStyle` (flex sizing)
// sit on an outer wrapper so they never clash with the scale transform on the inner view.
// `style` goes on the scaled view (box, border, shadow); `contentStyle` goes on the touch area inside it (padding, alignment, min size).
export function PressableScale({ style, layoutStyle, contentStyle, entering, children, ...rest }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={entering} style={layoutStyle}>
      <Animated.View style={[anim, style]}>
        <Pressable
          {...rest}
          style={[{ flexGrow: 1 }, contentStyle]}
          onPressIn={e => { scale.set(withSpring(PRESSED_SCALE, SPRING)); rest.onPressIn?.(e); }}
          onPressOut={e => { scale.set(withSpring(1, SPRING)); rest.onPressOut?.(e); }}
        >
          {children}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
