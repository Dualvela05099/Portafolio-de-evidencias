import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

export default function MedicoLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.65)",
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
          elevation: 10,
          shadowColor: colors.teal,
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Doctor", tabBarIcon: ({ color }) => <Ionicons name="medical-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="pacientes" options={{ title: "Pacientes", tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="agenda" options={{ title: "Agenda", tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="scanner" options={{ title: "Recetas", tabBarIcon: ({ color }) => <Ionicons name="scan-outline" size={27} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={27} color={color} /> }} />
    </Tabs>
  );
}
