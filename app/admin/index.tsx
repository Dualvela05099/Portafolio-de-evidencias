import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Card from "@/components/Card";
import LogoutButton from "@/components/LogoutButton";
import { colors } from "@/components/theme";

export default function AdminHome() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenido, Administrador</Text>
            <Text style={styles.headerSub}>Panel de control general</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push("/admin/perfil")} style={styles.profile}>
              <Ionicons name="settings" size={28} color={colors.teal} />
            </TouchableOpacity>
            <LogoutButton compact />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen general</Text>
          <View style={styles.statsRow}>
            <Stat n="320" l="Médicos" c="#1976d2" />
            <Stat n="154" l="Citas hoy" c="#f59e0b" />
            <Stat n="28" l="Pendientes" c="#20b26b" />
            <Stat n="4" l="Canceladas" c="#c084fc" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones administrativas</Text>
          <View style={styles.actionsRow}>
            <Action title="Gestionar\nmédicos" icon="medical-outline" onPress={() => router.push("/admin/admin-medicos")} bg="#e5f5ff" />
            <Action title="Revisar\ncitas" icon="calendar-outline" onPress={() => router.push("/admin/admin-citas")} bg="#fff5dc" />
            <Action title="Avisos\ndel sistema" icon="notifications-outline" onPress={() => router.push("/admin/avisos")} bg="#f2ddff" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Citas hoy</Text>
          <Card style={{ padding: 16 }}>
            <Text style={styles.rowText}>Confirmadas <Text style={styles.right}>88</Text></Text>
            <Text style={styles.rowText}>Pendientes <Text style={styles.right}>28</Text></Text>
            <Text style={styles.rowText}>Canceladas <Text style={styles.right}>4</Text></Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avisos importantes</Text>
          {["Mantenimiento programado", "Alta demanda en pediatría", "Revisión de agenda semanal"].map((name) => (
            <TouchableOpacity key={name} style={styles.notice}>
              <View style={styles.noticeIcon}><Ionicons name="alert-circle-outline" size={22} color={colors.teal} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.noticeTitle}>{name}</Text>
                <Text style={styles.noticeSub}>10:00 AM · Pendiente</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.teal} />
            </TouchableOpacity>
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
  statN: { fontSize: 22, fontWeight: "900" },
  statL: { fontSize: 9, color: colors.muted, textAlign: "center", marginTop: 4 },
  actionsRow: { flexDirection: "row", gap: 10 },
  action: { flex: 1, height: 92, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionText: { marginTop: 8, fontSize: 11, color: colors.text, fontWeight: "800", textAlign: "center" },
  rowText: { fontSize: 14, color: colors.text, marginBottom: 8 },
  right: { fontWeight: "900" },
  notice: { backgroundColor: "white", borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3 },
  noticeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#e5f5ff", alignItems: "center", justifyContent: "center", marginRight: 12 },
  noticeTitle: { fontSize: 15, fontWeight: "900", color: colors.text },
  noticeSub: { fontSize: 12, color: colors.muted, marginTop: 3 },
});
