import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '@/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  // Colours of the two soft party glows (top corner, then lower edge). Defaults to the first two accents.
  glow?: readonly [string, string?];
};

const useStyles = makeStyles(t => ({
  root: { flex: 1, backgroundColor: t.colors.background },
  content: { flexGrow: 1, padding: t.spacing.lg, gap: t.spacing.lg },
  // Non-scroll body must stay within the screen so an inner FlatList scrolls instead of overflowing under the tab bar.
  fill: { flex: 1, minHeight: 0 },
  glow: { position: 'absolute', width: t.sizes.glow, height: t.sizes.glow },
  top: { top: -t.sizes.glow / 2.5, left: -t.sizes.glow / 3 },
  low: { top: t.sizes.glow * 1.4, right: -t.sizes.glow / 2 },
}));

export function Screen({
  children, scroll, keyboardAvoiding, refreshing = false, onRefresh, edges = ['top', 'left', 'right'], glow,
}: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const [a, b] = glow ?? theme.tileAccents;
  const blob = (c: string) => ({
    backgroundImage: `radial-gradient(circle, ${c}${theme.alpha.glow} 0%, ${c}00 70%)`,
  });
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} colors={[theme.colors.primary]} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.root} edges={edges}>
      <View pointerEvents="none" style={[styles.glow, styles.top, blob(a)]} />
      {b ? <View pointerEvents="none" style={[styles.glow, styles.low, blob(b)]} /> : null}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {body}
        </KeyboardAvoidingView>
      ) : body}
    </SafeAreaView>
  );
}
