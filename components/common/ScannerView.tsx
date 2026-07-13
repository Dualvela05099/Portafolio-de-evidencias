import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useScannerViewModel } from "@/viewmodels/useScannerViewModel";

export default function ScannerView() {
  const vm = useScannerViewModel();

  if (!vm.permission) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.loadingText}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!vm.permission.granted) {
    return (
      <View style={styles.centerScreen}>
        <Ionicons name="camera-outline" size={70} color={colors.teal} />
        <Text style={styles.permissionTitle}>Permiso de cámara</Text>
        <Text style={styles.permissionText}>Para escanear recetas necesitas permitir el acceso a la cámara.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={vm.requestPermission}>
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
            ref={vm.cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: vm.barcodeTypes }}
            onBarcodeScanned={vm.scannedCode ? undefined : vm.onBarcodeScanned}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.cameraHint}>Coloca la receta dentro del cuadro</Text>
            </View>
          </CameraView>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={vm.onTakePicture}>
            <Ionicons name="camera" size={22} color="white" />
            <Text style={styles.primaryButtonText}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={vm.resetScan}>
            <Ionicons name="scan-outline" size={22} color={colors.teal} />
            <Text style={styles.secondaryButtonText}>Escanear otra vez</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sensorGrid}>
          <View style={styles.sensorCard}>
            <Ionicons name="sunny-outline" size={28} color={vm.getLightColor()} />
            <Text style={styles.sensorTitle}>Sensor de luz</Text>
            <Text style={[styles.sensorValue, { color: vm.getLightColor() }]}>{vm.lightStatus}</Text>
            <Text style={styles.sensorDetail}>{vm.lightValue === null ? "Sin lectura" : `${vm.lightValue.toFixed(0)} lux`}</Text>
          </View>
          <View style={styles.sensorCard}>
            <Ionicons name="phone-portrait-outline" size={28} color={colors.teal} />
            <Text style={styles.sensorTitle}>Giroscopio</Text>
            <Text style={styles.sensorValue}>{vm.orientation}</Text>
            <Text style={styles.sensorDetail}>X {vm.gyro.x.toFixed(2)} · Y {vm.gyro.y.toFixed(2)} · Z {vm.gyro.z.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Resultado del escaneo</Text>
          <Text style={styles.infoText}>{vm.scannedCode || "Aún no se ha detectado ningún código."}</Text>
          <Text style={styles.infoSmall}>
            {vm.lastPhoto ? "Última receta capturada correctamente." : "También puedes tomar una foto de la receta aunque no tenga código."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f9f8" },
  scroll: { paddingBottom: 120 },
  header: { backgroundColor: colors.teal, height: 112, justifyContent: "center", paddingHorizontal: 22 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "900" },
  headerSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 },
  cameraCard: { marginHorizontal: 18, marginTop: 20, height: 360, borderRadius: 24, overflow: "hidden", backgroundColor: "#111827" },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.15)" },
  scanFrame: { width: 220, height: 220, borderWidth: 3, borderColor: "white", borderRadius: 24, backgroundColor: "rgba(255,255,255,0.04)" },
  cameraHint: { color: "white", fontSize: 13, fontWeight: "800", marginTop: 18, backgroundColor: "rgba(0,0,0,0.35)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  actionsRow: { flexDirection: "row", gap: 12, marginHorizontal: 18, marginTop: 16 },
  primaryButton: { flex: 1, height: 54, borderRadius: 16, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  primaryButtonText: { color: "white", fontSize: 15, fontWeight: "900" },
  secondaryButton: { flex: 1, height: 54, borderRadius: 16, borderWidth: 1.5, borderColor: colors.teal, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "white" },
  secondaryButtonText: { color: colors.teal, fontSize: 15, fontWeight: "900" },
  sensorGrid: { flexDirection: "row", gap: 12, marginHorizontal: 18, marginTop: 16 },
  sensorCard: { flex: 1, minHeight: 128, borderRadius: 20, backgroundColor: "white", padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 3 },
  sensorTitle: { fontSize: 13, color: colors.muted, fontWeight: "800", marginTop: 8 },
  sensorValue: { fontSize: 16, color: colors.text, fontWeight: "900", marginTop: 6 },
  sensorDetail: { fontSize: 11, color: colors.muted, marginTop: 8 },
  infoCard: { marginHorizontal: 18, marginTop: 16, backgroundColor: "white", borderRadius: 20, padding: 18 },
  infoTitle: { fontSize: 17, color: colors.text, fontWeight: "900" },
  infoText: { fontSize: 14, color: colors.muted, marginTop: 8, lineHeight: 20 },
  infoSmall: { fontSize: 12, color: colors.teal, marginTop: 10, fontWeight: "800" },
  centerScreen: { flex: 1, backgroundColor: "#f7f9f8", alignItems: "center", justifyContent: "center", padding: 28 },
  loadingText: { color: colors.muted, fontSize: 16 },
  permissionTitle: { color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 18 },
  permissionText: { color: colors.muted, fontSize: 15, textAlign: "center", marginTop: 10, lineHeight: 22 },
  permissionButton: { backgroundColor: colors.teal, paddingHorizontal: 22, paddingVertical: 14, borderRadius: 16, marginTop: 22 },
  permissionButtonText: { color: "white", fontSize: 15, fontWeight: "900" },
});
