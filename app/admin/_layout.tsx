import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.75)",
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 78,
          backgroundColor: colors.teal,
          borderRadius: 26,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 10,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Admin", tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="admin-medicos" options={{ title: "Médicos", tabBarIcon: ({ color }) => <Ionicons name="medical-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="admin-citas" options={{ title: "Citas", tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="avisos" options={{ title: "Avisos", tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={27} color={color} /> }} />
    </Tabs>
  );
}
