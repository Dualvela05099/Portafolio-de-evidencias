import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useAdminCitasViewModel } from "@/viewmodels/useAdminCitasViewModel";

export default function AdminCitas() {
  const vm = useAdminCitasViewModel();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.head}>Citas</Text></View>
        <Text style={styles.label}>Rango de fechas</Text>
        <TextInput value={vm.query} onChangeText={vm.setQuery} style={styles.search} placeholder="Buscar paciente, fecha o especialidad" />
        {vm.citas.length === 0 ? <Text style={styles.empty}>No hay citas guardadas.</Text> : null}
        {vm.citas.map((c, i) => (
          <TouchableOpacity key={c.id} style={styles.row} onPress={vm.goToDetalles}>
            <View style={{ flex: 1 }}><Text style={styles.name}>{c.pacienteNombre || "Paciente"}</Text><Text style={styles.sub}>{c.hora || `${i + 8}:30`} · {c.fecha || "Fecha pendiente"} · {c.especialidad || "Consulta"}</Text></View>
            <Text style={[styles.state, { color: c.estado === "Cancelada" ? "#ef4444" : c.estado === "Completada" ? "#20b26b" : "#f59e0b" }]}>{c.estado || "Pendiente"}</Text>
            <TouchableOpacity onPress={() => vm.handleCambiarEstado(c.id, "Completada")}><Ionicons name="checkmark-circle-outline" size={22} color="#20b26b" /></TouchableOpacity>
            <TouchableOpacity onPress={() => vm.handleCambiarEstado(c.id, "Cancelada")}><Ionicons name="close-circle-outline" size={22} color="#ef4444" /></TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbfdfd" },
  scroll: { paddingBottom: 120 },
  header: { height: 82, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingTop: 20 },
  head: { color: "white", fontWeight: "900", fontSize: 18 },
  label: { fontSize: 13, color: colors.text, fontWeight: "900", marginHorizontal: 20, marginTop: 18 },
  search: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, marginHorizontal: 20, marginTop: 8, marginBottom: 16, paddingHorizontal: 14 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 20, fontWeight: "700" },
  row: { marginHorizontal: 20, backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontWeight: "900", color: colors.text },
  sub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  state: { fontWeight: "900", fontSize: 12 },
});
