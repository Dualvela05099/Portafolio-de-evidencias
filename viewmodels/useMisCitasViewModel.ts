import { useCallback } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useAppointments } from "@/hooks/useAppointments";

export function useMisCitasViewModel() {
  const { filtered, filter, setFilter, cancelar, filters } = useAppointments();

  const handleCancelar = useCallback(
    async (id: string) => {
      await cancelar(id);
      Alert.alert("Cita cancelada", "La cita fue marcada como cancelada en la base local.");
    },
    [cancelar]
  );

  const goToDetalles = useCallback(() => router.push("/detalles-cita"), []);
  const goToAgendar = useCallback(() => router.push("/paciente/agendar-cita"), []);

  return { citas: filtered, filter, setFilter, filters, handleCancelar, goToDetalles, goToAgendar };
}
