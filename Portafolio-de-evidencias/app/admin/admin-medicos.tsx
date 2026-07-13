import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/theme";
import { eliminarMedico, guardarMedico, obtenerMedicos } from "@/utils/database";

type Medico = { id: string; nombre?: string; name?: string; especialidad?: string; role?: string; correo?: string; email?: string; estado?: string };

export default function AdminMedicos() {
  const [query, setQuery] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [correo, setCorreo] = useState("");

  const cargar = async () => setMedicos(await obtenerMedicos());

  useEffect(() => {
    cargar();
  }, []);

  const agregar = async () => {
    if (!nombre.trim() || !especialidad.trim() || !correo.trim()) {
      Alert.alert("Datos incompletos", "Ingresa nombre, especialidad y correo del médico.");
      return;
    }
    await guardarMedico({ nombre, name: nombre, especialidad, role: especialidad, correo, email: correo, password: "123456", estado: "Activo" });
    setNombre("");
    setEspecialidad("");
    setCorreo("");
    await cargar();
    Alert.alert("Médico guardado", "El médico se guardó en la base local.");
  };

  const borrar = async (id: string) => {
    await eliminarMedico(id);
    await cargar();
    Alert.alert("Médico eliminado", "El registro fue eliminado de la base local.");
  };

  const filtered = medicos.filter((d) => `${d.nombre || d.name || ""} ${d.especialidad || d.role || ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.head}>Médicos</Text></View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Registrar médico</Text>
          <TextInput value={nombre} onChangeText={setNombre} style={styles.input} placeholder="Nombre del médico" />
          <TextInput value={especialidad} onChangeText={setEspecialidad} style={styles.input} placeholder="Especialidad" />
          <TextInput value={correo} onChangeText={setCorreo} style={styles.input} placeholder="Correo" keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={styles.saveButton} onPress={agregar}><Text style={styles.saveText}>Guardar médico</Text></TouchableOpacity>
        </View>

        <TextInput value={query} onChangeText={setQuery} style={styles.search} placeholder="Buscar médico" />
        {filtered.map((d) => (
          <TouchableOpacity key={d.id} style={styles.row} onPress={() => Alert.alert(d.nombre || d.name || "Médico", `Correo: ${d.correo || d.email || ""}`)}>
            <View style={{ flex: 1 }}><Text style={styles.name}>{d.nombre || d.name}</Text><Text style={styles.sub}>{d.especialidad || d.role}</Text></View>
            <Text style={styles.state}>{d.estado || "Activo"}</Text>
            <TouchableOpacity onPress={() => borrar(d.id)}><Ionicons name="trash-outline" size={20} color="#ef4444" /></TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#fbfdfd" }, scroll: { paddingBottom: 120 }, header: { height: 82, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingTop: 20 }, head: { color: "white", fontWeight: "900", fontSize: 18 }, form: { backgroundColor: "white", margin: 20, borderRadius: 16, padding: 16 }, formTitle: { fontWeight: "900", color: colors.text, marginBottom: 10 }, input: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, marginBottom: 10, paddingHorizontal: 14 }, saveButton: { height: 44, borderRadius: 10, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }, saveText: { color: "white", fontWeight: "900" }, search: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, marginHorizontal: 20, marginBottom: 14, paddingHorizontal: 14 }, row: { marginHorizontal: 20, backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12 }, name: { fontWeight: "900", color: colors.text }, sub: { color: colors.muted, fontSize: 12, marginTop: 4 }, state: { color: "#20b26b", fontWeight: "900", fontSize: 12 } });
