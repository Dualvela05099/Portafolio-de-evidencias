import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import AppLogo from "@/components/AppLogo";
import { colors } from "@/components/theme";
import { guardarRegistroTemporal } from "@/utils/database";

export default function DatosScreen() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");

  const continuar = async () => {
    if (!nombre.trim() || !apellidoPaterno.trim() || !telefono.trim()) {
      Alert.alert("Datos incompletos", "Ingresa al menos nombre, apellido paterno y teléfono.");
      return;
    }

    const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
    await guardarRegistroTemporal({ nombre: nombreCompleto, name: nombreCompleto, apellidoPaterno, apellidoMaterno, sexo, fechaNacimiento, telefono, phone: telefono });
    router.push("/registro-emergencia");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.phoneCard}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <AppLogo size={124} />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Datos principales</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <Input label="Nombre (s)" value={nombre} onChangeText={setNombre} />
          <Input label="Apellido paterno" value={apellidoPaterno} onChangeText={setApellidoPaterno} />
          <Input label="Apellido materno" value={apellidoMaterno} onChangeText={setApellidoMaterno} />
          <View style={styles.row}>
            <Input label="Sexo" small value={sexo} onChangeText={setSexo} />
            <Input label="Fecha de nacimiento" small value={fechaNacimiento} onChangeText={setFechaNacimiento} />
          </View>
          <Input label="Teléfono celular" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.button} onPress={continuar}><Text style={styles.buttonText}>Continuar</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Input({ label, small, value, onChangeText, keyboardType = "default" }: { label: string; small?: boolean; value: string; onChangeText: (text: string) => void; keyboardType?: "default" | "phone-pad" }) {
  return (
    <View style={[styles.inputWrap, small && { flex: 1 }]}> 
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={`Ingresa tu ${label.toLowerCase()}`} placeholderTextColor="#9aa3ae" />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#f3f3f3" }, scroll: { alignItems: "center", paddingVertical: 28 }, phoneCard: { width: "90%", maxWidth: 420, minHeight: 700, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" }, header: { height: 270, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }, back: { position: "absolute", top: 34, left: 22, zIndex: 2 }, backText: { color: "white", fontSize: 30 }, card: { width: "86%", alignSelf: "center", marginTop: -54, backgroundColor: "white", borderRadius: 22, padding: 22, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 }, title: { color: colors.teal, fontSize: 24, fontWeight: "900" }, subtitle: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 16 }, inputWrap: { marginBottom: 14 }, label: { fontSize: 13, color: "#696969", marginLeft: 14, marginBottom: 6 }, input: { height: 48, backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, fontSize: 13 }, row: { flexDirection: "row", gap: 10 }, button: { height: 54, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 4 }, buttonText: { color: "white", fontSize: 16, fontWeight: "900" } });
