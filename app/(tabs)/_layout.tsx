import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapIcon from '../components/icons/MapIcon';
import PlusIcon from '../components/icons/PlusIcon';
import BellIcon from '../components/icons/BellIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'light';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F5132',  // Dark green for active tabs
        tabBarInactiveTintColor: '#198754',  // Medium dark green for inactive tabs
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#fff' : '#000',
          borderTopColor: isDark ? '#e0e0e0' : '#333',
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size ? size + 6 : 30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '',
          tabBarIcon: ({ color, focused, size }) => (
            <MapIcon
              size={size ? size + 6 : 30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ color, focused, size }) => (
            <PlusIcon
              size={size ? size + 16 + 6 : 46}
              color={color}
            />
          ),
          tabBarIconStyle: {
            marginTop: -8,
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name="notifications"
              size={size ? size + 6 : 30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name="person"
              size={size ? size + 6 : 30}
              color={color}
            />
          ),
        }}
      />
      </Tabs>
  );
}
