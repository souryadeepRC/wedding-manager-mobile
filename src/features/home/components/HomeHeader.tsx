import { View } from 'react-native';
import { AppText } from '@/components';

export function HomeHeader() {
  return (
    <View>
      <AppText variant="title" color="accent">🎉 Let&apos;s celebrate</AppText>
      <AppText variant="display" accessibilityRole="header">Wedding Manager</AppText>
    </View>
  );
}
