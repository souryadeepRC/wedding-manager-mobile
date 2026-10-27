import { Stack } from 'expo-router';
import { useTheme } from '@/theme';

// Screens draw their own PageHeader, so the native header is hidden.
export default function ExpensesLayout() {
  const { colors } = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
