import { useCallback } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useAdminAppointments } from "@/hooks/useAppointments";

export function useAdminCitasViewModel() {
  const { filtered, query, setQuery, cambiarEstado } = useAdminAppointments();

  const handleCambiarEstado = useCallback(
    async (id: string, estado: string) => {
      await cambiarEstado(id, estado);
      Alert.alert("Cita actualizada", `La cita quedó como ${estado}.`);
    },
    [cambiarEstado]
  );

  const goToDetalles = useCallback(() => router.push("/detalles-cita"), []);

  return { citas: filtered, query, setQuery, handleCambiarEstado, goToDetalles };
}
