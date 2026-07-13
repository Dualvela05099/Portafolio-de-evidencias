import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

const summaryCards = [
  { label: "Citas hoy", value: "8", icon: "calendar", color: "#0097A7" },
  { label: "En sala", value: "2", icon: "people", color: "#FFA726" },
  { label: "Completadas", value: "5", icon: "checkmark-circle", color: "#66BB6A" },
  { label: "Pendientes", value: "1", icon: "time", color: "#EF5350" },
];

const nextPatients = [
  { name: "Juan Pérez", time: "10:00", status: "En sala", statusColor: "#FFA726" },
  { name: "María López", time: "10:30", status: "Pendiente", statusColor: "#90A4AE" },
  { name: "Carlos Ruiz", time: "11:00", status: "Confirmado", statusColor: "#66BB6A" },
];

export default function DoctorIndex() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Buenos días,</Text>
          <Text style={styles.doctorName}>Dr. García</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={28} color="white" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <Text style={styles.sectionTitle}>Resumen del día</Text>
        <View style={styles.cardsGrid}>
          {summaryCards.map((card) => (
            <View key={card.label} style={styles.summaryCard}>
              <Ionicons name={card.icon as any} size={26} color={card.color} />
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Próximos pacientes</Text>
        {nextPatients.map((p) => (
          <TouchableOpacity key={p.name} style={styles.patientRow}>
            <View style={styles.patientAvatarSmall}>
              <Ionicons name="person-outline" size={20} color={colors.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{p.name}</Text>
              <Text style={styles.patientTime}>{p.time} hrs</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: p.statusColor + "22" }]}>
              <Text style={[styles.statusText, { color: p.statusColor }]}>{p.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0BEC5" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="add-circle-outline" size={24} color={colors.teal} />
            <Text style={styles.actionLabel}>Nueva cita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="document-text-outline" size={24} color={colors.teal} />
            <Text style={styles.actionLabel}>Nueva receta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="search-outline" size={24} color={colors.teal} />
            <Text style={styles.actionLabel}>Buscar paciente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    backgroundColor: colors.teal,
    paddingTop: 58,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  doctorName: { color: "white", fontSize: 22, fontWeight: "700" },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#37474F", marginHorizontal: 20, marginTop: 22, marginBottom: 12 },
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  summaryCard: {
    backgroundColor: "white", borderRadius: 16, padding: 16,
    width: "46%", marginHorizontal: "2%", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardValue: { fontSize: 28, fontWeight: "800", color: "#263238", marginTop: 6 },
  cardLabel: { fontSize: 12, color: "#78909C", marginTop: 2 },
  patientRow: {
    backgroundColor: "white", marginHorizontal: 20, marginBottom: 10,
    borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  patientAvatarSmall: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.teal + "18",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  patientName: { fontSize: 14, fontWeight: "600", color: "#263238" },
  patientTime: { fontSize: 12, color: "#90A4AE", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },
  actionsRow: {
    flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20,
    backgroundColor: "white", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  actionBtn: { alignItems: "center", gap: 6 },
  actionLabel: { fontSize: 11, color: "#546E7A", fontWeight: "600", textAlign: "center" },
});
