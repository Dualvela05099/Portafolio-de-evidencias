import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import AppLogo from "@/components/AppLogo";
import { colors } from "@/components/theme";
import { guardarRegistroTemporal } from "@/utils/database";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const next = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Campos vacíos", "Completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    await guardarRegistroTemporal({ correo: email, email, password, rol: "paciente" });
    router.push("/registro-datos");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.topText}>Registro nuevo usuario</Text>
        <View style={styles.phoneCard}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
            <AppLogo size={135} />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>¿Eres nuevo?</Text>
            <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
            <Text style={styles.label}>Correo electronico</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <Text style={styles.label}>Contraseña</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Ingresa una contraseña" placeholderTextColor="#8d96a3" secureTextEntry style={styles.input} />
            <View style={styles.bars}><View style={styles.bar}/><View style={styles.bar}/><View style={styles.bar}/><View style={styles.bar}/></View>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Ingresa tu contraseña de nuevo" placeholderTextColor="#8d96a3" secureTextEntry style={styles.input} />
            <TouchableOpacity style={styles.button} onPress={next}><Text style={styles.buttonText}>Continuar</Text></TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={() => router.replace("/")}><Text style={styles.loginLink}>Inicia sesión aquí</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f3f3" },
  scroll: { alignItems: "center", paddingBottom: 32 },
  topText: { width: "90%", maxWidth: 420, color: "#b5b5b5", fontSize: 16, marginTop: 10, marginBottom: 10 },
  phoneCard: { width: "90%", maxWidth: 420, minHeight: 700, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" },
  header: { height: 280, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", top: 34, left: 22, zIndex: 2 },
  backText: { color: "white", fontSize: 30 },
  card: { width: "86%", alignSelf: "center", marginTop: -62, backgroundColor: "white", borderRadius: 22, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 28, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 },
  title: { color: colors.teal, fontSize: 26, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 16, marginTop: 8, marginBottom: 18 },
  label: { color: "#696969", fontSize: 15, marginLeft: 18, marginBottom: 8 },
  input: { height: 56, backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, fontSize: 15, color: colors.text, marginBottom: 18 },
  bars: { flexDirection: "row", gap: 12, marginTop: -10, marginBottom: 16, paddingHorizontal: 10 },
  bar: { flex: 1, height: 5, borderRadius: 5, backgroundColor: "#e8eefb", borderWidth: 1, borderColor: "#d5dff2" },
  button: { height: 58, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "900" },
  loginContainer: { alignItems: "center", marginTop: 24 },
  loginText: { color: colors.muted, fontSize: 16 },
  loginLink: { color: colors.teal, fontSize: 16, fontWeight: "800" },
});
