import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppLogo from "@/components/ui/AppLogo";
import { colors } from "@/constants/theme";
import { useRegisterViewModel } from "@/viewmodels/useRegisterViewModel";

export default function RegisterScreen() {
  const vm = useRegisterViewModel();
  const barCount = 4;
  const filledBars = Math.round((vm.passwordStrength.score / 5) * barCount);

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.topText}>Registro nuevo usuario</Text>
        <View style={styles.phoneCard}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={vm.goBack}><Text style={styles.backText}>←</Text></TouchableOpacity>
            <AppLogo size={135} />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>¿Eres nuevo?</Text>
            <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              value={vm.email}
              onChangeText={vm.setEmail}
              onEndEditing={vm.validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            {vm.emailError ? <Text style={styles.errorText}>{vm.emailError}</Text> : null}
            <Text style={styles.label}>Contraseña</Text>
            <TextInput value={vm.password} onChangeText={vm.setPassword} placeholder="Ingresa una contraseña" placeholderTextColor="#8d96a3" secureTextEntry style={styles.input} />
            <View style={styles.bars}>
              {Array.from({ length: barCount }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bar,
                    index < filledBars ? { backgroundColor: vm.passwordStrength.color, borderColor: vm.passwordStrength.color } : {},
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.strengthLabel, { color: vm.passwordStrength.color }]}>Seguridad: {vm.passwordStrength.label}</Text>
            <Text style={styles.strengthDetail}>Incluye mayúsculas, minúsculas, números y símbolos para una contraseña más segura.</Text>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput value={vm.confirmPassword} onChangeText={vm.setConfirmPassword} placeholder="Ingresa tu contraseña de nuevo" placeholderTextColor="#8d96a3" secureTextEntry style={styles.input} />
            {vm.confirmPassword.length > 0 && vm.password !== vm.confirmPassword ? (
              <Text style={styles.mismatchText}>Las contraseñas no coinciden.</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={vm.next}><Text style={styles.buttonText}>Continuar</Text></TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={vm.goToLogin}><Text style={styles.loginLink}>Inicia sesión aquí</Text></TouchableOpacity>
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
  bars: { flexDirection: "row", gap: 12, marginTop: -10, marginBottom: 10, paddingHorizontal: 10 },
  bar: { flex: 1, height: 5, borderRadius: 5, backgroundColor: "#e8eefb", borderWidth: 1, borderColor: "#d5dff2" },
  strengthLabel: { marginTop: 4, marginBottom: 4, fontSize: 13, fontWeight: "700" },
  strengthDetail: { color: colors.muted, fontSize: 12, marginBottom: 14, marginLeft: 4 },
  errorText: { color: "#c0392b", fontSize: 13, marginLeft: 18, marginBottom: 10 },
  button: { height: 58, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "900" },
  loginContainer: { alignItems: "center", marginTop: 24 },
  loginText: { color: colors.muted, fontSize: 16 },
  loginLink: { color: colors.teal, fontSize: 16, fontWeight: "800" },
});
