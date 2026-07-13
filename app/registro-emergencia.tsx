import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppLogo from "@/components/ui/AppLogo";
import FormInput from "@/components/forms/FormInput";
import { colors } from "@/constants/theme";
import { useRegistroEmergenciaViewModel } from "@/viewmodels/useRegistroEmergenciaViewModel";

export default function EmergenciaScreen() {
  const vm = useRegistroEmergenciaViewModel();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.phoneCard}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={vm.goBack}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <AppLogo size={124} />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Contacto de emergencia</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <FormInput label="Nombre completo" value={vm.contactoEmergencia} onChangeText={vm.setContactoEmergencia} placeholder="Ingresa nombre completo" />
          <FormInput label="Parentesco" value={vm.parentescoEmergencia} onChangeText={vm.setParentescoEmergencia} placeholder="Ingresa parentesco" />
          <FormInput label="Teléfono celular" value={vm.telefonoEmergencia} onChangeText={vm.setTelefonoEmergencia} keyboardType="phone-pad" placeholder="Ingresa teléfono celular" />
          <TouchableOpacity style={styles.button} onPress={vm.finish}><Text style={styles.buttonText}>Terminar registro</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f3f3" },
  scroll: { alignItems: "center", paddingVertical: 28 },
  phoneCard: { width: "90%", maxWidth: 420, minHeight: 680, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" },
  header: { height: 270, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", top: 34, left: 22, zIndex: 2 },
  backText: { color: "white", fontSize: 30 },
  card: { width: "86%", alignSelf: "center", marginTop: -54, backgroundColor: "white", borderRadius: 22, padding: 22, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 },
  title: { color: colors.teal, fontSize: 23, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 18 },
  button: { height: 54, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginTop: 4 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
});
