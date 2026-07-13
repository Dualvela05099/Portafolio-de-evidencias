import { useCallback, useEffect, useRef, useState } from "react";
import { useCameraPermissions } from "expo-camera";
import type { CameraView, BarcodeScanningResult } from "expo-camera";
import { cameraService } from "@/services/sensors/CameraService";

export function useCamera() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState("");
  const [lastPhoto, setLastPhoto] = useState("");

  const takePicture = useCallback(async () => {
    const uri = await cameraService.takePicture(cameraRef);
    if (uri) {
      setLastPhoto(uri);
      return { success: true as const, uri };
    }
    return { success: false as const, error: "No se pudo tomar la foto de la receta." };
  }, []);

  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    const code = cameraService.parseBarcodeResult(result);
    if (!scannedCode && code) {
      setScannedCode(code);
      return code;
    }
    return null;
  }, [scannedCode]);

  const resetScan = useCallback(() => setScannedCode(""), []);

  return {
    cameraRef,
    permission,
    requestPermission,
    scannedCode,
    lastPhoto,
    takePicture,
    handleBarcodeScanned,
    resetScan,
    barcodeTypes: cameraService.getBarcodeTypes(),
  };
}

export function useCameraSensors() {
  return useCamera();
}
