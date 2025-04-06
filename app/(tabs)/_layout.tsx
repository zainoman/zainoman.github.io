import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // Hide all tab labels to show only icons
        tabBarShowLabel: false,
        // Adjust the icon size and style for icon-only display
        tabBarIconStyle: {
          width: 32,
          height: 32,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          default: {
            paddingTop: insets.top > 0 ? 0 : 5,
            height: 56,
          },
        }),
        headerStyle: {
          height: 60 + insets.top,
          paddingTop: insets.top,
        },
      }}>
      <Tabs.Screen
        name="index"  // This is now an alias that redirects to projects
        options={{
          href: null, // Hide this tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: '', // Empty title, but we're hiding labels anyway
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarAccessibilityLabel: "Home", // For accessibility
        }}
      />
      <Tabs.Screen
        name="project/[id]"
        options={{
          title: '', // Empty title, but we're hiding labels anyway
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          tabBarAccessibilityLabel: "Details", // For accessibility
        }}
      />
    </Tabs>
  );
}
