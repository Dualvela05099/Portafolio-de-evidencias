import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const fechas = [23, 24, 25, 26, 27, 28, 29];

type EstadoCita = "Completada" | "En curso" | "En sala" | "Cancelada" | "Pendiente";

const estadoColores: Record<EstadoCita, string> = {
  Completada: "#66BB6A",
  "En curso": "#0097A7",
  "En sala": "#FFA726",
  Cancelada: "#EF5350",
  Pendiente: "#90A4AE",
};

const citas = [
  { id: "1", hora: "08:00", paciente: "Juan Pérez", motivo: "Control general", estado: "Completada" as EstadoCita },
  { id: "2", hora: "09:00", paciente: "María López", motivo: "Dolor de cabeza", estado: "En curso" as EstadoCita },
  { id: "3", hora: "10:00", paciente: "Carlos Ruiz", motivo: "Hipertensión", estado: "En sala" as EstadoCita },
  { id: "4", hora: "11:00", paciente: "Ana Torres", motivo: "Revisión lab.", estado: "Pendiente" as EstadoCita },
  { id: "5", hora: "12:00", paciente: "Luis Morales", motivo: "Diabetes", estado: "Cancelada" as EstadoCita },
  { id: "6", hora: "14:00", paciente: "Sofía Ramos", motivo: "Gripe", estado: "Pendiente" as EstadoCita },
];

export default function Agenda() {
  const [diaSeleccionado, setDiaSeleccionado] = useState(5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Agenda</Text>
        <Text style={styles.subtitulo}>Junio 2025</Text>
        <View style={styles.daysRow}>
          {dias.map((d, i) => (
            <TouchableOpacity key={d} onPress={() => setDiaSeleccionado(i)}
              style={[styles.dayBtn, diaSeleccionado === i && styles.dayBtnActive]}>
              <Text style={[styles.dayName, diaSeleccionado === i && styles.dayTextActive]}>{d}</Text>
              <Text style={[styles.dayNum, diaSeleccionado === i && styles.dayTextActive]}>{fechas[i]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 40 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, gap: 14 }}>
        {(Object.keys(estadoColores) as EstadoCita[]).map((estado) => (
          <View key={estado} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: estadoColores[estado] }} />
            <Text style={{ fontSize: 11, color: "#607D8B", fontWeight: "600" }}>{estado}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {citas.map((cita) => (
          <TouchableOpacity key={cita.id} style={styles.citaCard}>
            <View style={[styles.estadoBar, { backgroundColor: estadoColores[cita.estado] }]} />
            <Text style={styles.citaHora}>{cita.hora}</Text>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.citaPaciente}>{cita.paciente}</Text>
              <Text style={styles.citaMotivo}>{cita.motivo}</Text>
            </View>
            <View style={[styles.estadoBadge, { backgroundColor: estadoColores[cita.estado] + "22" }]}>
              <Text style={[styles.estadoText, { color: estadoColores[cita.estado] }]}>{cita.estado}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    backgroundColor: colors.teal, paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  titulo: { color: "white", fontSize: 22, fontWeight: "700" },
  subtitulo: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 14 },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayBtn: { alignItems: "center", paddingVertical: 8, paddingHorizontal: 6, borderRadius: 14, minWidth: 38 },
  dayBtnActive: { backgroundColor: "white" },
  dayName: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" },
  dayNum: { color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: "700", marginTop: 2 },
  dayTextActive: { color: colors.teal },
  citaCard: {
    backgroundColor: "white", marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, flexDirection: "row", alignItems: "center",
    padding: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  estadoBar: { width: 4, height: 40, borderRadius: 4, marginRight: 4 },
  citaHora: { fontSize: 14, fontWeight: "700", color: "#37474F", marginLeft: 6 },
  citaPaciente: { fontSize: 14, fontWeight: "600", color: "#263238" },
  citaMotivo: { fontSize: 12, color: "#90A4AE", marginTop: 2 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  estadoText: { fontSize: 11, fontWeight: "700" },
});
