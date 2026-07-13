import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";

const pacientesMock = [
  { id: "1", nombre: "Juan Pérez", edad: 34, motivo: "Control general", estado: "En sala", estadoColor: "#FFA726" },
  { id: "2", nombre: "María López", edad: 28, motivo: "Dolor de cabeza", estado: "Pendiente", estadoColor: "#90A4AE" },
  { id: "3", nombre: "Carlos Ruiz", edad: 52, motivo: "Hipertensión", estado: "Confirmado", estadoColor: "#66BB6A" },
  { id: "4", nombre: "Ana Torres", edad: 41, motivo: "Revisión de laboratorio", estado: "Completada", estadoColor: "#42A5F5" },
  { id: "5", nombre: "Luis Morales", edad: 60, motivo: "Diabetes tipo 2", estado: "Cancelada", estadoColor: "#EF5350" },
  { id: "6", nombre: "Sofía Ramos", edad: 23, motivo: "Gripe", estado: "En sala", estadoColor: "#FFA726" },
];

export default function Pacientes() {
  const [busqueda, setBusqueda] = useState("");
  const filtrados = pacientesMock.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Pacientes del día</Text>
        <Text style={styles.subtitulo}>{pacientesMock.length} pacientes registrados</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#90A4AE" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          placeholderTextColor="#B0BEC5"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={18} color="#B0BEC5" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 110, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="person-outline" size={48} color="#CFD8DC" />
            <Text style={styles.emptyText}>Sin resultados</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{item.nombre[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.detalle}>{item.edad} años · {item.motivo}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.estadoColor + "22" }]}>
              <Text style={[styles.badgeText, { color: item.estadoColor }]}>{item.estado}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    backgroundColor: colors.teal, paddingTop: 58, paddingBottom: 22, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  titulo: { color: "white", fontSize: 22, fontWeight: "700" },
  subtitulo: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 },
  searchContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "white",
    marginHorizontal: 20, marginTop: 16, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#37474F" },
  card: {
    backgroundColor: "white", marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.teal,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  avatarInitial: { color: "white", fontSize: 18, fontWeight: "700" },
  nombre: { fontSize: 15, fontWeight: "600", color: "#263238" },
  detalle: { fontSize: 12, color: "#90A4AE", marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { color: "#B0BEC5", fontSize: 14 },
});
