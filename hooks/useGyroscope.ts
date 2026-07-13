import { useEffect, useState } from "react";
import { gyroscopeService } from "@/services/sensors/GyroscopeService";
import type { GyroscopeData, LightStatus, OrientationStatus } from "@/types";

export function useGyroscope() {
  const [gyro, setGyro] = useState<GyroscopeData>({ x: 0, y: 0, z: 0 });
  const [orientation, setOrientation] = useState<OrientationStatus>("Estable");
  const [lightValue, setLightValue] = useState<number | null>(null);
  const [lightStatus, setLightStatus] = useState<LightStatus>("No disponible");

  useEffect(() => {
    let mounted = true;
    let removeGyro: (() => void) | null = null;
    let removeLight: (() => void) | null = null;

    const start = async () => {
      removeGyro = await gyroscopeService.startGyroscopeListener((data, orient) => {
        if (mounted) {
          setGyro(data);
          setOrientation(orient);
        }
      });

      removeLight = await gyroscopeService.startLightSensorListener((illuminance, status) => {
        if (mounted) {
          setLightValue(illuminance);
          setLightStatus(status);
        }
      });

      if (!removeLight && mounted) {
        setLightStatus("No disponible");
      }
    };

    start();

    return () => {
      mounted = false;
      removeGyro?.();
      removeLight?.();
    };
  }, []);

  const getLightColor = () => gyroscopeService.getLightColor(lightStatus);

  return { gyro, orientation, lightValue, lightStatus, getLightColor };
}
