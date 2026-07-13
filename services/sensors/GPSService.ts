import type { GPSCoordinates } from "@/types";

/**
 * Servicio GPS preparado para integración con expo-location y API REST.
 * Actualmente retorna null cuando no hay proveedor de ubicación configurado.
 */
export class GPSService {
  private lastKnown: GPSCoordinates | null = null;

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async requestPermission(): Promise<boolean> {
    return false;
  }

  async getCurrentPosition(): Promise<GPSCoordinates | null> {
    return this.lastKnown;
  }

  setMockPosition(coords: GPSCoordinates): void {
    this.lastKnown = coords;
  }

  formatCoordinates(coords: GPSCoordinates): string {
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  }
}

export const gpsService = new GPSService();
