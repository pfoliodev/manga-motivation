import { Tabs } from 'expo-router';
import { Heart, Home, Settings } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0F0F0F',
          borderTopColor: '#1A1A1A',
          borderTopWidth: 1,
          paddingTop: 10,
        },
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <Home color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <Heart color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <Settings color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
