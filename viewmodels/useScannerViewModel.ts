import { useCallback } from "react";
import { Alert } from "react-native";
import { useCamera } from "@/hooks/useCamera";
import { useGyroscope } from "@/hooks/useGyroscope";

export function useScannerViewModel() {
  const {
    cameraRef,
    permission,
    requestPermission,
    scannedCode,
    lastPhoto,
    takePicture,
    handleBarcodeScanned,
    resetScan,
    barcodeTypes,
  } = useCamera();

  const { gyro, orientation, lightValue, lightStatus, getLightColor } = useGyroscope();

  const onTakePicture = useCallback(async () => {
    const result = await takePicture();
    if (result.success) {
      Alert.alert("Receta capturada", "La foto de la receta se tomó correctamente.");
    } else {
      Alert.alert("Error", result.error);
    }
  }, [takePicture]);

  const onBarcodeScanned = useCallback(
    (result: Parameters<typeof handleBarcodeScanned>[0]) => {
      const code = handleBarcodeScanned(result);
      if (code) {
        Alert.alert("Código detectado", code);
      }
    },
    [handleBarcodeScanned]
  );

  return {
    cameraRef,
    permission,
    requestPermission,
    scannedCode,
    lastPhoto,
    gyro,
    orientation,
    lightValue,
    lightStatus,
    getLightColor,
    onTakePicture,
    onBarcodeScanned,
    resetScan,
    barcodeTypes,
  };
}
