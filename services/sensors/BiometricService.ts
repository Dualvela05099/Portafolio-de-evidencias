import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export class BiometricService {
  async hasHardware(): Promise<boolean> {
    return LocalAuthentication.hasHardwareAsync();
  }

  async isEnrolled(): Promise<boolean> {
    return LocalAuthentication.isEnrolledAsync();
  }

  async authenticate(promptMessage = "Inicia sesión con tu huella"): Promise<BiometricResult> {
    try {
      const hasHardware = await this.hasHardware();
      if (!hasHardware) {
        return { success: false, error: "Este dispositivo no tiene sensor biométrico." };
      }

      const isEnrolled = await this.isEnrolled();
      if (!isEnrolled) {
        return { success: false, error: "Primero configura una huella digital en tu teléfono." };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: "Cancelar",
        fallbackLabel: "Usar contraseña",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: "No se pudo iniciar sesión con la huella." };
    } catch {
      return { success: false, error: "Ocurrió un problema con la autenticación biométrica." };
    }
  }
}

export const biometricService = new BiometricService();
