import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

const infoMedico = {
  nombre: "Dr. García Fernández",
  especialidad: "Medicina General",
  cedula: "MX-1234567",
  hospital: "Utopía Clínica",
  email: "garcia@utopiaclinica.mx",
  telefono: "+52 722 123 4567",
};

const estadisticas = [
  { label: "Pacientes", value: "128" },
  { label: "Citas este mes", value: "64" },
  { label: "Recetas emitidas", value: "211" },
];

export default function Perfil() {
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [disponible, setDisponible] = React.useState(true);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <Text style={styles.nombre}>{infoMedico.nombre}</Text>
          <Text style={styles.especialidad}>{infoMedico.especialidad}</Text>
          <Text style={styles.hospital}>{infoMedico.hospital}</Text>
          <View style={styles.statsRow}>
            {estadisticas.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Información personal</Text>
        <View style={styles.infoCard}>
          {[
            { icon: "card-outline", label: "Cédula profesional", value: infoMedico.cedula },
            { icon: "mail-outline", label: "Correo electrónico", value: infoMedico.email },
            { icon: "call-outline", label: "Teléfono", value: infoMedico.telefono },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name={item.icon as any} size={18} color={colors.teal} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Configuración</Text>
        <View style={styles.configCard}>
          <View style={styles.configRow}>
            <View style={styles.configLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.teal} />
              <Text style={styles.configLabel}>Notificaciones</Text>
            </View>
            <Switch value={notificaciones} onValueChange={setNotificaciones}
              trackColor={{ false: "#CFD8DC", true: colors.teal }} thumbColor="white" />
          </View>
          <View style={[styles.configRow, { borderTopWidth: 1, borderTopColor: "#F4F6F8" }]}>
            <View style={styles.configLeft}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.teal} />
              <Text style={styles.configLabel}>Disponible para citas</Text>
            </View>
            <Switch value={disponible} onValueChange={setDisponible}
              trackColor={{ false: "#CFD8DC", true: colors.teal }} thumbColor="white" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.infoCard}>
          {[
            { icon: "lock-closed-outline", label: "Cambiar contraseña" },
            { icon: "help-circle-outline", label: "Ayuda y soporte" },
            { icon: "information-circle-outline", label: "Acerca de Utopía Clínica" },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name={item.icon as any} size={18} color={colors.teal} />
              </View>
              <Text style={[styles.infoValue, { flex: 1 }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF5350" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    backgroundColor: colors.teal, paddingTop: 58, paddingBottom: 24, paddingHorizontal: 20,
    alignItems: "center", borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 10, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)",
  },
  nombre: { color: "white", fontSize: 20, fontWeight: "700" },
  especialidad: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 2 },
  hospital: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: "row", marginTop: 20, gap: 28 },
  statItem: { alignItems: "center" },
  statValue: { color: "white", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#37474F", marginHorizontal: 20, marginTop: 22, marginBottom: 10 },
  infoCard: {
    backgroundColor: "white", marginHorizontal: 20, borderRadius: 16, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  infoRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#F4F6F8",
  },
  infoIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.teal + "18",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  infoLabel: { fontSize: 11, color: "#90A4AE" },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#263238" },
  configCard: {
    backgroundColor: "white", marginHorizontal: 20, borderRadius: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  configRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
  configLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  configLabel: { fontSize: 14, fontWeight: "500", color: "#263238" },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginHorizontal: 20, marginTop: 20, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: "#FFCDD2", backgroundColor: "#FFF8F8",
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#EF5350" },
});
