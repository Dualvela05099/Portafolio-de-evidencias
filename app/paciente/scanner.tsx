import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { Gyroscope, LightSensor } from "expo-sensors";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

type LightStatus = "Buena iluminación" | "Poca luz" | "Demasiada luz" | "No disponible";

type OrientationStatus = "Vertical" | "Horizontal" | "Inclinado" | "Estable";

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>("");
  const [lastPhoto, setLastPhoto] = useState<string>("");
  const [lightValue, setLightValue] = useState<number | null>(null);
  const [lightStatus, setLightStatus] = useState<LightStatus>("No disponible");
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [orientation, setOrientation] = useState<OrientationStatus>("Estable");

  useEffect(() => {
    let lightSubscription: { remove: () => void } | null = null;
    let gyroSubscription: { remove: () => void } | null = null;
    let mounted = true;

    const startSensors = async () => {
      try {
        const lightAvailable = await LightSensor.isAvailableAsync();

        if (lightAvailable && mounted) {
          LightSensor.setUpdateInterval(800);
          lightSubscription = LightSensor.addListener(({ illuminance }) => {
            setLightValue(illuminance);

            if (illuminance < 60) {
              setLightStatus("Poca luz");
            } else if (illuminance > 900) {
              setLightStatus("Demasiada luz");
            } else {
              setLightStatus("Buena iluminación");
            }
          });
        } else {
          setLightStatus("No disponible");
        }
      } catch (error) {
        setLightStatus("No disponible");
      }

      try {
        const gyroAvailable = await Gyroscope.isAvailableAsync();

        if (gyroAvailable && mounted) {
          Gyroscope.setUpdateInterval(500);
          gyroSubscription = Gyroscope.addListener((data) => {
            setGyro(data);

            const absX = Math.abs(data.x);
            const absY = Math.abs(data.y);
            const absZ = Math.abs(data.z);

            if (absY > 1.2) {
              setOrientation("Horizontal");
            } else if (absX > 1.2) {
              setOrientation("Vertical");
            } else if (absZ > 1.2) {
              setOrientation("Inclinado");
            } else {
              setOrientation("Estable");
            }
          });
        }
      } catch (error) {
        setOrientation("Estable");
      }
    };

    startSensors();

    return () => {
      mounted = false;
      lightSubscription?.remove();
      gyroSubscription?.remove();
    };
  }, []);

  const handleTakePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });

      if (photo?.uri) {
        setLastPhoto(photo.uri);
        Alert.alert("Receta capturada", "La foto de la receta se tomó correctamente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto de la receta.");
    }
  };

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!scannedCode && result.data) {
      setScannedCode(result.data);
      Alert.alert("Código detectado", result.data);
    }
  };

  const getLightColor = () => {
    if (lightStatus === "Buena iluminación") return "#20b26b";
    if (lightStatus === "Poca luz") return "#f59e0b";
    if (lightStatus === "Demasiada luz") return "#ef4444";
    return colors.muted;
  };

  if (!permission) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.loadingText}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerScreen}>
        <Ionicons name="camera-outline" size={70} color={colors.teal} />
        <Text style={styles.permissionTitle}>Permiso de cámara</Text>
        <Text style={styles.permissionText}>
          Para escanear recetas necesitas permitir el acceso a la cámara.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Escáner de recetas</Text>
          <Text style={styles.headerSubtitle}>Cámara, luz y orientación</Text>
        </View>

        <View style={styles.cameraCard}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "ean13", "ean8", "code128", "code39"],
            }}
            onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.cameraHint}>Coloca la receta dentro del cuadro</Text>
            </View>
          </CameraView>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleTakePicture}>
            <Ionicons name="camera" size={22} color="white" />
            <Text style={styles.primaryButtonText}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScannedCode("")}>
            <Ionicons name="scan-outline" size={22} color={colors.teal} />
            <Text style={styles.secondaryButtonText}>Escanear otra vez</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sensorGrid}>
          <View style={styles.sensorCard}>
            <Ionicons name="sunny-outline" size={28} color={getLightColor()} />
            <Text style={styles.sensorTitle}>Sensor de luz</Text>
            <Text style={[styles.sensorValue, { color: getLightColor() }]}>{lightStatus}</Text>
            <Text style={styles.sensorDetail}>
              {lightValue === null ? "Sin lectura" : `${lightValue.toFixed(0)} lux`}
            </Text>
          </View>

          <View style={styles.sensorCard}>
            <Ionicons name="phone-portrait-outline" size={28} color={colors.teal} />
            <Text style={styles.sensorTitle}>Giroscopio</Text>
            <Text style={styles.sensorValue}>{orientation}</Text>
            <Text style={styles.sensorDetail}>
              X {gyro.x.toFixed(2)} · Y {gyro.y.toFixed(2)} · Z {gyro.z.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Resultado del escaneo</Text>
          <Text style={styles.infoText}>
            {scannedCode ? scannedCode : "Aún no se ha detectado ningún código."}
          </Text>
          <Text style={styles.infoSmall}>
            {lastPhoto ? "Última receta capturada correctamente." : "También puedes tomar una foto de la receta aunque no tenga código."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f9f8" },
  scroll: { paddingBottom: 120 },
  header: {
    backgroundColor: colors.teal,
    height: 112,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "900" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 },
  cameraCard: {
    marginHorizontal: 18,
    marginTop: 20,
    height: 360,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#111827",
  },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  cameraHint: {
    color: "white",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionsRow: { flexDirection: "row", gap: 12, marginHorizontal: 18, marginTop: 16 },
  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: { color: "white", fontSize: 15, fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "white",
  },
  secondaryButtonText: { color: colors.teal, fontSize: 15, fontWeight: "900" },
  sensorGrid: { flexDirection: "row", gap: 12, marginHorizontal: 18, marginTop: 16 },
  sensorCard: {
    flex: 1,
    minHeight: 128,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  sensorTitle: { fontSize: 13, color: colors.muted, fontWeight: "800", marginTop: 8 },
  sensorValue: { fontSize: 16, color: colors.text, fontWeight: "900", marginTop: 6 },
  sensorDetail: { fontSize: 11, color: colors.muted, marginTop: 8 },
  infoCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
  },
  infoTitle: { fontSize: 17, color: colors.text, fontWeight: "900" },
  infoText: { fontSize: 14, color: colors.muted, marginTop: 8, lineHeight: 20 },
  infoSmall: { fontSize: 12, color: colors.teal, marginTop: 10, fontWeight: "800" },
  centerScreen: {
    flex: 1,
    backgroundColor: "#f7f9f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  loadingText: { color: colors.muted, fontSize: 16 },
  permissionTitle: { color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 18 },
  permissionText: { color: colors.muted, fontSize: 15, textAlign: "center", marginTop: 10, lineHeight: 22 },
  permissionButton: {
    backgroundColor: colors.teal,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 22,
  },
  permissionButtonText: { color: "white", fontSize: 15, fontWeight: "900" },
});
