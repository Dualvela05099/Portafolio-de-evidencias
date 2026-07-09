import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useAdminMedicosViewModel } from "@/viewmodels/useAdminMedicosViewModel";

export default function AdminMedicos() {
  const vm = useAdminMedicosViewModel();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.head}>Médicos</Text></View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Registrar médico</Text>
          <TextInput value={vm.nombre} onChangeText={vm.setNombre} style={styles.input} placeholder="Nombre del médico" />
          <TextInput value={vm.especialidad} onChangeText={vm.setEspecialidad} style={styles.input} placeholder="Especialidad" />
          <TextInput value={vm.correo} onChangeText={vm.setCorreo} style={styles.input} placeholder="Correo" keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={styles.saveButton} onPress={vm.agregar}><Text style={styles.saveText}>Guardar médico</Text></TouchableOpacity>
        </View>

        <TextInput value={vm.query} onChangeText={vm.setQuery} style={styles.search} placeholder="Buscar médico" />
        {vm.medicos.map((d) => (
          <TouchableOpacity key={d.id} style={styles.row} onPress={() => vm.showDetail(d)}>
            <View style={{ flex: 1 }}><Text style={styles.name}>{d.nombre || d.name}</Text><Text style={styles.sub}>{d.especialidad || d.role}</Text></View>
            <Text style={styles.state}>{d.estado || "Activo"}</Text>
            <TouchableOpacity onPress={() => vm.borrar(d.id)}><Ionicons name="trash-outline" size={20} color="#ef4444" /></TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbfdfd" },
  scroll: { paddingBottom: 120 },
  header: { height: 82, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingTop: 20 },
  head: { color: "white", fontWeight: "900", fontSize: 18 },
  form: { backgroundColor: "white", margin: 20, borderRadius: 16, padding: 16 },
  formTitle: { fontWeight: "900", color: colors.text, marginBottom: 10 },
  input: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, marginBottom: 10, paddingHorizontal: 14 },
  saveButton: { height: 44, borderRadius: 10, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  saveText: { color: "white", fontWeight: "900" },
  search: { height: 44, backgroundColor: "#f1f6ff", borderRadius: 10, marginHorizontal: 20, marginBottom: 14, paddingHorizontal: 14 },
  row: { marginHorizontal: 20, backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontWeight: "900", color: colors.text },
  sub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  state: { color: "#20b26b", fontWeight: "900", fontSize: 12 },
});
