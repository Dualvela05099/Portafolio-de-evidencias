import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";
import { pacienteService } from "@/services/api/PacienteService";

export function useRegistroEmergenciaViewModel() {
  const [contactoEmergencia, setContactoEmergencia] = useState("");
  const [parentescoEmergencia, setParentescoEmergencia] = useState("");
  const [telefonoEmergencia, setTelefonoEmergencia] = useState("");

  const finish = useCallback(async () => {
    if (!contactoEmergencia.trim() || !telefonoEmergencia.trim()) {
      Alert.alert("Datos incompletos", "Ingresa el contacto y teléfono de emergencia.");
      return;
    }

    try {
      const temp = await authService.getRegistroTemporal();
      const paciente = await pacienteService.save({
        ...temp,
        contactoEmergencia,
        parentescoEmergencia,
        telefonoEmergencia,
        emergency: `${contactoEmergencia} · ${telefonoEmergencia}`,
      });

      await authService.saveSession(paciente);
      await authService.clearRegistroTemporal();
      Alert.alert("Registro terminado", "Tu cuenta fue creada correctamente.");
      router.replace("/paciente");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al guardar el paciente.";
      Alert.alert("Error de registro", message);
      console.error("[RegistroEmergencia] Error en finish:", error);
    }
  }, [contactoEmergencia, parentescoEmergencia, telefonoEmergencia]);

  const goBack = useCallback(() => router.back(), []);

  return {
    contactoEmergencia,
    setContactoEmergencia,
    parentescoEmergencia,
    setParentescoEmergencia,
    telefonoEmergencia,
    setTelefonoEmergencia,
    finish,
    goBack,
  };
}
