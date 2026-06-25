import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="registro-datos" />
      <Stack.Screen name="registro-emergencia" />
      <Stack.Screen name="confirmacion" />
      <Stack.Screen name="detalles-cita" />
      <Stack.Screen name="paciente" />
      <Stack.Screen name="medico" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
