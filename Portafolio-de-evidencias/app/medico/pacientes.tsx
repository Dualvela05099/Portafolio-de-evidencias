import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/components/theme";

const data = [
  ["María Gonzales", "Revisión general", "Completada", "#d7f6e8", "#159665"],
  ["Pedro Venegas", "Electrocardiograma", "En curso", "#d8f5f5", "#159c9c"],
  ["Carmen Huerta", "Consulta inicial", "En sala de espera", "#fff0d8", "#f59e0b"],
  ["Rocio Duran", "Seguimiento", "Cancelada", "#ffc7c7", "#ff6b6b"],
  ["Luis Ortega", "Chequeo rutinario", "Pendiente", "#dceeff", "#3699ff"],
];

export default function Pacientes() {
  const [query, setQuery] = useState("");
  const filtered = data.filter((x) => x[0].toLowerCase().includes(query.toLowerCase()));
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.head}>Pacientes del día</Text></View>
        <TextInput value={query} onChangeText={setQuery} style={styles.search} placeholder="Buscar paciente" />
        {filtered.map((x) => (
          <TouchableOpacity key={x[0]} style={styles.row} onPress={() => router.push("/detalles-cita")}>
            <View><Text style={styles.name}>{x[0]}</Text><Text style={styles.sub}>{x[1]}</Text></View>
            <View style={[styles.badge, { backgroundColor: x[3] }]}><Text style={[styles.badgeT, { color: x[4] }]}>{x[2]}</Text></View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#fbfdfd" }, scroll: { paddingBottom: 120 }, header: { height: 82, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingTop: 20 }, head: { color: "white", fontWeight: "900", fontSize: 17 }, search: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, margin: 20, paddingHorizontal: 14 }, row: { marginHorizontal: 20, backgroundColor: "white", borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" }, name: { fontWeight: "900", color: colors.text }, sub: { color: colors.muted, fontSize: 12, marginTop: 4 }, badge: { paddingHorizontal: 10, height: 24, borderRadius: 12, justifyContent: "center" }, badgeT: { fontSize: 11, fontWeight: "900" } });
