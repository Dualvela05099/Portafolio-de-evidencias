import { Gyroscope, LightSensor } from "expo-sensors";
import type { GyroscopeData, LightStatus, OrientationStatus } from "@/types";

export class GyroscopeService {
  getOrientation(data: GyroscopeData): OrientationStatus {
    const absX = Math.abs(data.x);
    const absY = Math.abs(data.y);
    const absZ = Math.abs(data.z);

    if (absY > 1.2) return "Horizontal";
    if (absX > 1.2) return "Vertical";
    if (absZ > 1.2) return "Inclinado";
    return "Estable";
  }

  getLightStatus(illuminance: number): LightStatus {
    if (illuminance < 60) return "Poca luz";
    if (illuminance > 900) return "Demasiada luz";
    return "Buena iluminación";
  }

  getLightColor(status: LightStatus): string {
    if (status === "Buena iluminación") return "#20b26b";
    if (status === "Poca luz") return "#f59e0b";
    if (status === "Demasiada luz") return "#ef4444";
    return "#6b7280";
  }

  async startGyroscopeListener(
    onUpdate: (data: GyroscopeData, orientation: OrientationStatus) => void,
    intervalMs = 500
  ): Promise<(() => void) | null> {
    try {
      const available = await Gyroscope.isAvailableAsync();
      if (!available) return null;

      Gyroscope.setUpdateInterval(intervalMs);
      const subscription = Gyroscope.addListener((data) => {
        onUpdate(data, this.getOrientation(data));
      });

      return () => subscription.remove();
    } catch {
      return null;
    }
  }

  async startLightSensorListener(
    onUpdate: (illuminance: number, status: LightStatus) => void,
    intervalMs = 800
  ): Promise<(() => void) | null> {
    try {
      const available = await LightSensor.isAvailableAsync();
      if (!available) return null;

      LightSensor.setUpdateInterval(intervalMs);
      const subscription = LightSensor.addListener(({ illuminance }) => {
        onUpdate(illuminance, this.getLightStatus(illuminance));
      });

      return () => subscription.remove();
    } catch {
      return null;
    }
  }
}

export const gyroscopeService = new GyroscopeService();
