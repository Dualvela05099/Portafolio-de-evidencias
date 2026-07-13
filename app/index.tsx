import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppLogo from "@/components/ui/AppLogo";
import { colors } from "@/constants/theme";
import { useLoginViewModel } from "@/viewmodels/useLoginViewModel";

export default function LoginScreen() {
  const vm = useLoginViewModel();

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.phoneCard}>
          <View style={styles.header}>
            <AppLogo size={126} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>¿Ya tienes cuenta?</Text>
            <Text style={styles.subtitle}>Inicia sesión</Text>

            <Text style={styles.roleTitle}>Entrar como</Text>

            <View style={styles.roles}>
              {(["paciente", "medico", "admin"] as const).map((item) => (
                <TouchableOpacity key={item} onPress={() => vm.setRole(item)} style={[styles.roleButton, vm.role === item && styles.roleButtonActive]}>
                  <Text style={[styles.roleText, vm.role === item && styles.roleTextActive]}>
                    {item === "paciente" ? "Paciente" : item === "medico" ? "Doctor" : "Admin"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.helperText}>Selecciona el rol y después inicia sesión o usa la huella.</Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput placeholder="Ingresa tu correo electrónico" value={vm.email} onChangeText={vm.setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput placeholder="Ingresa tu contraseña" value={vm.password} onChangeText={vm.setPassword} secureTextEntry style={styles.input} />

            <TouchableOpacity onPress={vm.submit} style={styles.button}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={vm.loginWithBiometric} style={styles.fingerprintButton}>
              <Text style={styles.fingerprintIcon}>🔒</Text>
              <Text style={styles.fingerprintText}>Entrar con huella digital</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={vm.goToRegister}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, alignItems: "center", paddingVertical: 32 },
  phoneCard: { width: "90%", maxWidth: 420, minHeight: 740, backgroundColor: "#fbfdfd", borderRadius: 26, overflow: "hidden" },
  header: { height: 270, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  card: { width: "86%", alignSelf: "center", marginTop: -50, backgroundColor: "white", borderRadius: 20, padding: 22, shadowColor: "#8ab7c2", shadowOpacity: 0.24, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 },
  title: { color: colors.teal, fontSize: 25, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 6, marginBottom: 12 },
  roleTitle: { color: colors.text, fontSize: 14, fontWeight: "900", marginBottom: 8 },
  roles: { flexDirection: "row", gap: 8, marginBottom: 8 },
  roleButton: { flex: 1, borderWidth: 1, borderColor: "#dbe5ee", borderRadius: 10, paddingVertical: 9, alignItems: "center", backgroundColor: "#f7fbff" },
  roleButtonActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  roleText: { fontSize: 12, color: colors.muted, fontWeight: "800" },
  roleTextActive: { color: "white" },
  helperText: { color: colors.muted, fontSize: 11, marginBottom: 10 },
  label: { color: "#696969", fontSize: 14, marginLeft: 16, marginBottom: 7, marginTop: 8 },
  input: { height: 52, backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, fontSize: 14, color: colors.text, marginBottom: 8 },
  button: { height: 54, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 12 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
  fingerprintButton: { borderWidth: 1.5, borderColor: colors.teal, borderRadius: 12, padding: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#f6fffd", marginTop: 12 },
  fingerprintIcon: { fontSize: 18 },
  fingerprintText: { color: colors.teal, fontSize: 14, fontWeight: "800" },
  registerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 18 },
  registerText: { fontSize: 13, color: colors.muted },
  registerLink: { color: colors.teal, fontSize: 13, fontWeight: "800" },
});
