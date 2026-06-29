import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/components/theme";
import { actualizarCita, obtenerCitas, obtenerSesionActual } from "@/utils/database";

const filters = ["Todas", "Próximas", "Completadas", "Canceladas"];

type Cita = {
  id: string;
  especialidad?: string;
  fecha?: string;
  hora?: string;
  estado?: string;
  motivo?: string;
};

export default function MisCitas() {
  const [filter, setFilter] = useState("Todas");
  const [citas, setCitas] = useState<Cita[]>([]);

  const cargarCitas = async () => {
    const sesion = await obtenerSesionActual();
    const todas = await obtenerCitas();
    const propias = todas.filter((c: any) => !sesion?.id || !c.pacienteId || c.pacienteId === sesion.id || c.pacienteNombre === sesion.name || c.pacienteNombre === sesion.nombre);
    setCitas(propias);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const cancelar = async (id: string) => {
    await actualizarCita(id, { estado: "Cancelada" });
    await cargarCitas();
    Alert.alert("Cita cancelada", "La cita fue marcada como cancelada en la base local.");
  };

  const filtered = citas.filter((c) => {
    if (filter === "Todas") return true;
    if (filter === "Canceladas") return c.estado === "Cancelada";
    if (filter === "Completadas") return c.estado === "Completada";
    return c.estado !== "Cancelada" && c.estado !== "Completada";
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.titleH}>Mis citas</Text></View>
        <View style={styles.filters}>
          {filters.map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filter, filter === f && styles.filterA]}>
              <Text style={[styles.filterT, filter === f && { color: "white" }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeline}>
          {filtered.length === 0 ? <Text style={styles.empty}>Todavía no tienes citas guardadas.</Text> : null}
          {filtered.map((c, i) => (
            <TouchableOpacity key={c.id} style={styles.item} onPress={() => router.push("/detalles-cita")}>
              <View style={[styles.line, { backgroundColor: c.estado === "Cancelada" ? "#ef4444" : ["#20b26b", "#f59e0b", "#1976d2"][i % 3] }]} />
              <View style={styles.card}>
                <Text style={styles.name}>Cita médica</Text>
                <Text style={styles.sub}>{c.especialidad || "Consulta"}</Text>
                <Text style={styles.sub}>{c.fecha || "Fecha pendiente"} · {c.hora || "Hora pendiente"}</Text>
                <Text style={styles.state}>{c.estado || "Pendiente"}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => router.push("/paciente/agendar-cita")}><Text style={styles.modify}>Modificar</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => cancelar(c.id)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
});
