import { useCallback, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";
import { useBiometric } from "@/hooks/useBiometric";
import type { UserRole } from "@/types";

export function useLoginViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("paciente");
  const { authenticate } = useBiometric();

  const navigateByRole = useCallback((userRole: UserRole) => {
    if (userRole === "medico") {
      router.replace("/medico");
      return;
    }
    if (userRole === "admin") {
      router.replace("/admin");
      return;
    }
    router.replace("/paciente");
  }, []);

  const submit = useCallback(async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Campos vacíos", "Ingresa tu correo y contraseña.");
      return;
    }

    try {
      const usuario = await authService.login({ email, password, role });

      if (!usuario) {
        Alert.alert(
          "Datos incorrectos",
          "Revisa que el correo, contraseña y rol sean correctos.\n\nUsuarios de prueba:\nPaciente: paciente@gmail.com / 123456\nDoctor: doctor@gmail.com / 123456\nAdmin: admin@gmail.com / 123456"
        );
        return;
      }

      await authService.saveSession(usuario);
      navigateByRole(role);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(
        "Error al iniciar sesión",
        message || "Ocurrió un error al conectar con el servidor. Verifica que el backend esté en ejecución y vuelve a intentarlo."
      );
    }
  }, [email, password, role, navigateByRole]);

  const loginWithBiometric = useCallback(async () => {
    const result = await authenticate("Inicia sesión con tu huella");

    if (!result.success) {
      if (result.error?.includes("sensor biométrico")) {
        Alert.alert("No disponible", result.error);
      } else if (result.error?.includes("configura")) {
        Alert.alert("Huella no configurada", result.error);
      } else if (result.error?.includes("problema")) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Acceso cancelado", result.error || "No se pudo iniciar sesión con la huella.");
      }
      return;
    }

    const usuario = await authService.getDemoUserByRole(role);
    if (usuario) {
      await authService.saveSession(usuario);
    }
    navigateByRole(role);
  }, [authenticate, role, navigateByRole]);

  const goToRegister = useCallback(() => router.push("/register"), []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    submit,
    loginWithBiometric,
    goToRegister,
  };
}
