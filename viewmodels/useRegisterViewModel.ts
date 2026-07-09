import { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";

const getPasswordStrength = (password: string) => {
  const rules = [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/];
  const score = rules.reduce((count, rule) => count + (rule.test(password) ? 1 : 0), 0);
  if (score <= 2) {
    return { label: "Vulnerable", score, color: "#e74c3c" };
  }
  if (score <= 4) {
    return { label: "Media", score, color: "#f1c40f" };
  }
  return { label: "Protegida", score, color: "#27ae60" };
};

export function useRegisterViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const checkEmailAvailability = useCallback(async (emailToCheck: string) => {
    try {
      const exists = await authService.checkEmailExists(emailToCheck);
      if (exists) {
        setEmailError("Este correo ya existe en la base de datos.");
        return false;
      }
      setEmailError("");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo validar el correo.";
      Alert.alert("Error", message);
      return false;
    }
  }, []);

  const proceedRegistration = useCallback(async () => {
    await authService.saveRegistroTemporal({ correo: email, email, password, rol: "paciente" });
    router.push("/registro-datos");
  }, [email, password]);

  const validateEmail = useCallback(async () => {
    if (!email.trim()) {
      setEmailError("");
      return false;
    }
    return checkEmailAvailability(email);
  }, [checkEmailAvailability, email]);

  const next = useCallback(async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Campos vacíos", "Completa todos los campos.");
      return;
    }

    const isAvailable = await checkEmailAvailability(email);
    if (!isAvailable) {
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (passwordStrength.score <= 2) {
      Alert.alert(
        "Contraseña vulnerable",
        "Tu contraseña es realmente vulnerable. ¿Deseas continuar de todos modos?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: proceedRegistration },
        ]
      );
      return;
    }

    await proceedRegistration();
  }, [email, password, confirmPassword, passwordStrength.score, proceedRegistration, checkEmailAvailability]);

  const goBack = useCallback(() => router.back(), []);
  const goToLogin = useCallback(() => router.replace("/"), []);

  return {
    email,
    setEmail: (value: string) => {
      setEmail(value);
      if (emailError) setEmailError("");
    },
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    next,
    validateEmail,
    goBack,
    goToLogin,
    passwordStrength,
    emailError,
  };
}
