import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Card from "@/components/Card";
import LogoutButton from "@/components/LogoutButton";
import { colors } from "@/components/theme";

export default function DoctorHome() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenido, Dr. Juan Pérez</Text>
            <Text style={styles.headerSub}>Cardiólogo · Panel médico</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push("/medico/perfil")} style={styles.profile}>
              <Ionicons name="medical" size={28} color={colors.teal} />
            </TouchableOpacity>
            <LogoutButton compact />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del día</Text>
          <View style={styles.statsRow}>
            <Stat n="8" l="Citas" c="#1976d2" />
            <Stat n="5" l="Pendientes" c="#20b26b" />
            <Stat n="1" l="En consulta" c="#f59e0b" />
            <Stat n="0" l="Canceladas" c="#c084fc" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones del doctor</Text>
          <View style={styles.actionsRow}>
            <Action title="Pacientes\ndel día" icon="people-outline" onPress={() => router.push("/medico/pacientes")} bg="#e1fff3" />
            <Action title="Agenda\nmédica" icon="calendar-outline" onPress={() => router.push("/medico/agenda")} bg="#e5f5ff" />
            <Action title="Escanear\nreceta" icon="scan-outline" onPress={() => router.push("/medico/scanner")} bg="#fff5dc" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima cita</Text>
          <Patient name="María Gonzales" time="09:00 AM" status="Revisión general" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Citas pendientes</Text>
          {[
            ["Pedro Venegas", "10:30 AM", "Consulta inicial"],
            ["Carmen Huerta", "11:30 AM", "Seguimiento"],
            ["Rocio Duran", "12:30 PM", "Chequeo rutinario"],
          ].map(([name, time, status]) => (
            <Patient key={name} name={name} time={time} status={status} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ n, l, c }: { n: string; l: string; c: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={[styles.statN, { color: c }]}>{n}</Text>
      <Text style={styles.statL}>{l}</Text>
    </Card>
  );
}

function Action({ title, icon, bg, onPress }: { title: string; icon: keyof typeof Ionicons.glyphMap; bg: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.action, { backgroundColor: bg }]}> 
      <Ionicons name={icon} size={28} color={colors.teal} />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Patient({ name, time, status }: { name: string; time: string; status: string }) {
  return (
    <TouchableOpacity style={styles.patient}>
      <View style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.patientName}>{name}</Text>
        <Text style={styles.patientSub}>{status}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.teal} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f9f8" },
  scroll: { paddingBottom: 120 },
  header: { height: 112, backgroundColor: colors.teal, paddingHorizontal: 20, paddingTop: 26, flexDirection: "row", justifyContent: "space-between" },
  greeting: { color: "white", fontSize: 17, fontWeight: "900" },
  headerSub: { color: "white", fontSize: 12, opacity: 0.85, marginTop: 4 },
  profile: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#edf3ff", alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  section: { paddingHorizontal: 20, marginTop: 22 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, height: 82, alignItems: "center", justifyContent: "center" },
  statN: { fontSize: 24, fontWeight: "900" },
  statL: { fontSize: 10, color: colors.muted, textAlign: "center", marginTop: 4 },
  actionsRow: { flexDirection: "row", gap: 10 },
  action: { flex: 1, height: 92, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionText: { marginTop: 8, fontSize: 11, color: colors.text, fontWeight: "800", textAlign: "center" },
  patient: { backgroundColor: "white", borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#f1f5ff", marginRight: 14 },
  patientName: { fontSize: 15, fontWeight: "900", color: colors.text },
  patientSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  time: { fontSize: 11, color: colors.teal, fontWeight: "800", marginRight: 8 },
});
