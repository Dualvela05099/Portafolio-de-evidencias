import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import AppLogo from "@/components/AppLogo";
import { colors } from "@/components/theme";
import { guardarPaciente, guardarSesionActual, obtenerRegistroTemporal, limpiarRegistroTemporal } from "@/utils/database";

export default function EmergenciaScreen() {
  const [contactoEmergencia, setContactoEmergencia] = useState("");
  const [parentescoEmergencia, setParentescoEmergencia] = useState("");
  const [telefonoEmergencia, setTelefonoEmergencia] = useState("");

  const finish = async () => {
    if (!contactoEmergencia.trim() || !telefonoEmergencia.trim()) {
      Alert.alert("Datos incompletos", "Ingresa el contacto y teléfono de emergencia.");
      return;
    }

    const temp = await obtenerRegistroTemporal();
    const paciente = await guardarPaciente({
      ...temp,
      contactoEmergencia,
      parentescoEmergencia,
      telefonoEmergencia,
      emergency: `${contactoEmergencia} · ${telefonoEmergencia}`,
    });

    await guardarSesionActual(paciente);
    await limpiarRegistroTemporal();
    Alert.alert("Registro terminado", "Tu cuenta fue creada correctamente.");
    router.replace("/paciente");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.phoneCard}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <AppLogo size={124} />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Contacto de emergencia</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <Input label="Nombre completo" value={contactoEmergencia} onChangeText={setContactoEmergencia} />
          <Input label="Parentesco" value={parentescoEmergencia} onChangeText={setParentescoEmergencia} />
          <Input label="Teléfono celular" value={telefonoEmergencia} onChangeText={setTelefonoEmergencia} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={finish}><Text style={styles.buttonText}>Terminar registro</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Input({ label, value, onChangeText, keyboardType = "default" }: { label: string; value: string; onChangeText: (text: string) => void; keyboardType?: "default" | "phone-pad" }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={`Ingresa ${label.toLowerCase()}`} placeholderTextColor="#9aa3ae" />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#f3f3f3" }, scroll: { alignItems: "center", paddingVertical: 28 }, phoneCard: { width: "90%", maxWidth: 420, minHeight: 680, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" }, header: { height: 270, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }, back: { position: "absolute", top: 34, left: 22, zIndex: 2 }, backText: { color: "white", fontSize: 30 }, card: { width: "86%", alignSelf: "center", marginTop: -54, backgroundColor: "white", borderRadius: 22, padding: 22, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 }, title: { color: colors.teal, fontSize: 23, fontWeight: "900" }, subtitle: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 18 }, group: { marginBottom: 16 }, label: { fontSize: 13, color: "#696969", marginLeft: 14, marginBottom: 6 }, input: { height: 50, backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, fontSize: 13 }, button: { height: 54, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 4 }, buttonText: { color: "white", fontSize: 16, fontWeight: "900" } });
