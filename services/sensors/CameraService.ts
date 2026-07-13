import { CameraView } from "expo-camera";
import type { BarcodeScanningResult } from "expo-camera";
import type { RefObject } from "react";

export class CameraService {
  async takePicture(
    cameraRef: RefObject<CameraView | null>,
    quality = 0.7
  ): Promise<string | null> {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality });
      return photo?.uri ?? null;
    } catch {
      return null;
    }
  }

  parseBarcodeResult(result: BarcodeScanningResult): string | null {
    return result.data || null;
  }

  getBarcodeTypes(): Array<"qr" | "pdf417" | "ean13" | "ean8" | "code128" | "code39"> {
    return ["qr", "pdf417", "ean13", "ean8", "code128", "code39"];
  }
}

export const cameraService = new CameraService();
