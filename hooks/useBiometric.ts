import { useCallback } from "react";
import { biometricService } from "@/services/sensors/BiometricService";

export function useBiometric() {
  const authenticate = useCallback(async (promptMessage?: string) => {
    return biometricService.authenticate(promptMessage);
  }, []);

  const checkAvailability = useCallback(async () => {
    const hasHardware = await biometricService.hasHardware();
    const isEnrolled = hasHardware ? await biometricService.isEnrolled() : false;
    return { hasHardware, isEnrolled };
  }, []);

  return { authenticate, checkAvailability };
}
