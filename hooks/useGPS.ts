import { useCallback, useEffect, useState } from "react";
import { gpsService } from "@/services/sensors/GPSService";
import type { GPSCoordinates } from "@/types";

export function useGPS() {
  const [coords, setCoords] = useState<GPSCoordinates | null>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    gpsService.isAvailable().then(setAvailable);
  }, []);

  const refresh = useCallback(async () => {
    const position = await gpsService.getCurrentPosition();
    setCoords(position);
    return position;
  }, []);

  return { coords, available, refresh, format: coords ? gpsService.formatCoordinates(coords) : null };
}
