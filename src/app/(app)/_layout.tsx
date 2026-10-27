import { settingsGuard } from "@/features/settings";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = ComponentProps<typeof Ionicons>["name"];

const tabIcon = (focused: IconName, idle: IconName) =>
  function TabIcon({
    color,
    size,
    focused: isFocused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return (
      <Ionicons
        name={isFocused ? focused : idle}
        size={size}
        color={color as string}
      />
    );
  };

export default function AppLayout() {
  const { colors, fonts, typography, sizes, spacing, radius, alpha } =
    useTheme();
  const insets = useSafeAreaInsets();
  // Floating pill: the bar itself is transparent-looking (page colour) and the pill is drawn behind the items.
  const gap = Math.max(insets.bottom, spacing.md);
  return (
    <Tabs
      screenListeners={({ navigation, route }) => ({
        // Leaving Settings with unsaved edits asks first.
        tabPress: (e) => {
          if (route.name !== "settings" && settingsGuard.shouldBlock()) {
            e.preventDefault();
            settingsGuard.block(() => navigation.navigate(route.name));
          }
        },
      })}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarActiveBackgroundColor: colors.primary + alpha.tint,
        // Explicit line height so the custom font's label is never clipped.
        tabBarLabelStyle: {
          fontFamily: fonts.semibold,
          fontSize: typography.caption.fontSize,
          lineHeight: typography.caption.lineHeight,
        },
        tabBarItemStyle: {
          borderRadius: radius.lg,
          marginHorizontal: spacing.xxs,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: sizes.tabBar + gap,
          paddingTop: spacing.sm,
          paddingBottom: gap + spacing.sm,
          paddingHorizontal: spacing.lg + spacing.sm,
        },
        tabBarBackground: () => (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: gap,
              left: spacing.lg,
              right: spacing.lg,
              borderRadius: radius.xl,
              borderWidth: sizes.border,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home", "home-outline") }}
      />
      <Tabs.Screen
        name="guests"
        options={{
          title: "Guest",
          tabBarIcon: tabIcon("people", "people-outline"),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expense",
          tabBarIcon: tabIcon("wallet", "wallet-outline"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("settings", "settings-outline"),
        }}
      />
    </Tabs>
  );
}
