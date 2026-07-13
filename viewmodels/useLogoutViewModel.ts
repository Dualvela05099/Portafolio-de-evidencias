import { useCallback } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";

export function useLogoutViewModel() {
  const logout = useCallback(() => {
    Alert.alert("Cerrar sesión", "¿Quieres salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.replace("/");
        },
      },
    ]);
  }, []);

  return { logout };
}
