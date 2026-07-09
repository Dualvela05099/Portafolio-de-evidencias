import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";
import { useMisCitasViewModel } from "@/viewmodels/useMisCitasViewModel";

export default function MisCitas() {
  const vm = useMisCitasViewModel();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.titleH}>Mis citas</Text></View>
        <View style={styles.filters}>
          {vm.filters.map((f) => (
            <TouchableOpacity key={f} onPress={() => vm.setFilter(f)} style={[styles.filter, vm.filter === f && styles.filterA]}>
              <Text style={[styles.filterT, vm.filter === f && { color: "white" }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeline}>
          {vm.citas.length === 0 ? <Text style={styles.empty}>Todavía no tienes citas guardadas.</Text> : null}
          {vm.citas.map((c, i) => (
            <TouchableOpacity key={c.id} style={styles.item} onPress={vm.goToDetalles}>
              <View style={[styles.line, { backgroundColor: c.estado === "Cancelada" ? "#ef4444" : ["#20b26b", "#f59e0b", "#1976d2"][i % 3] }]} />
              <View style={styles.card}>
                <Text style={styles.name}>Cita médica</Text>
                <Text style={styles.sub}>{c.especialidad || "Consulta"}</Text>
                <Text style={styles.sub}>{c.fecha || "Fecha pendiente"} · {c.hora || "Hora pendiente"}</Text>
                <Text style={styles.state}>{c.estado || "Pendiente"}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={vm.goToAgendar}><Text style={styles.modify}>Modificar</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => vm.handleCancelar(c.id)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={vm.goToAgendar}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbfdfd" },
  scroll: { paddingBottom: 120 },
  header: { height: 82, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingTop: 20 },
  titleH: { color: "white", fontSize: 18, fontWeight: "900" },
  filters: { flexDirection: "row", gap: 8, padding: 20, flexWrap: "wrap" },
  filter: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18, backgroundColor: "white" },
  filterA: { backgroundColor: colors.teal },
  filterT: { fontSize: 12, color: colors.muted, fontWeight: "800" },
  timeline: { paddingHorizontal: 24 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 20, fontWeight: "700" },
  item: { flexDirection: "row", marginBottom: 14 },
  line: { width: 4, borderRadius: 2, marginRight: 12 },
  card: { flex: 1, backgroundColor: "white", borderRadius: 14, padding: 14 },
  name: { fontWeight: "900", fontSize: 15, color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 3 },
  state: { fontSize: 12, color: colors.teal, fontWeight: "900", marginTop: 5 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 18, marginTop: 8 },
  modify: { fontSize: 12, color: "#1976d2", fontWeight: "800" },
  cancel: { fontSize: 12, color: "#ef4444", fontWeight: "800" },
  fab: { position: "absolute", right: 20, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.22, shadowOffset: { width: 0, height: 10 }, shadowRadius: 12, elevation: 8 },
  fabText: { color: "white", fontSize: 32, lineHeight: 34, fontWeight: "900" },
});
