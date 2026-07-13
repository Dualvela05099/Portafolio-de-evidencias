import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useAgendarCitaViewModel } from "@/viewmodels/useAgendarCitaViewModel";

export default function Agendar() {
  const vm = useAgendarCitaViewModel();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={vm.goBack}><Ionicons name="arrow-back" size={22} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar cita</Text>
          <View style={{ width: 22 }} />
        </View>

        <TouchableOpacity style={styles.doctor} onPress={vm.toggleDoctorList}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.doc}>{vm.selectedDoctor.name}</Text>
            <Text style={styles.sub}>{vm.selectedDoctor.specialty}</Text>
          </View>
          <Ionicons name="caret-down" size={20} color={colors.teal} />
        </TouchableOpacity>

        {vm.showDoctorList && (
          <View style={styles.doctorList}>
            {vm.doctors.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                onPress={() => vm.selectDoctor(doc.id)}
                style={[styles.doctorOption, vm.selectedDoctor.id === doc.id && styles.doctorOptionActive]}
              >
                <Text style={styles.doctorOptionText}>{doc.name}</Text>
                <Text style={styles.doctorOptionSub}>{doc.specialty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.title}>Selecciona una fecha</Text>
        <View style={styles.calendar}>
          <Text style={styles.month}>Junio 2026</Text>
          <View style={styles.grid}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
              <TouchableOpacity key={n} onPress={() => vm.setDate(n)} style={[styles.date, vm.date === n && styles.dateActive]}>
                <Text style={[styles.dateText, vm.date === n && { color: "white" }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.title}>Horarios disponibles</Text>
        <View style={styles.times}>
          {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map((t) => (
            <TouchableOpacity key={t} onPress={() => vm.setTime(t)} style={[styles.time, vm.time === t && styles.timeActive]}>
              <Text style={[styles.timeText, vm.time === t && { color: "white" }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Motivo de consulta</Text>
        <TextInput value={vm.reason} onChangeText={vm.setReason} style={styles.note} multiline placeholder="Describe brevemente el motivo de tu visita..." />

        <TouchableOpacity style={styles.button} onPress={vm.save}><Text style={styles.buttonText}>Agendar cita</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fbfdfd" },
  scroll: { paddingBottom: 120 },
  header: { height: 82, backgroundColor: colors.teal, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { color: "white", fontSize: 17, fontWeight: "900" },
  doctor: { margin: 20, padding: 14, backgroundColor: "white", borderRadius: 18, flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#f1f5ff", marginRight: 12 },
  doc: { fontSize: 15, fontWeight: "900", color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 3 },
  title: { fontSize: 16, fontWeight: "900", color: colors.text, marginHorizontal: 20, marginTop: 14, marginBottom: 12 },
  calendar: { backgroundColor: "white", marginHorizontal: 20, borderRadius: 18, padding: 16 },
  month: { textAlign: "center", fontWeight: "900", color: colors.text, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  date: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  dateActive: { backgroundColor: colors.teal },
  dateText: { color: colors.text, fontWeight: "700" },
  times: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginHorizontal: 20 },
  time: { width: "30%", height: 42, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", backgroundColor: "white" },
  timeActive: { backgroundColor: colors.teal },
  timeText: { fontWeight: "800", color: colors.text },
  note: { height: 76, backgroundColor: "white", borderRadius: 12, marginHorizontal: 20, padding: 14, textAlignVertical: "top" },
  button: { height: 52, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", marginHorizontal: 20, marginTop: 18 },
  buttonText: { color: "white", fontWeight: "900" },
  doctorList: { marginHorizontal: 20, backgroundColor: "white", borderRadius: 18, padding: 10, marginBottom: 12 },
  doctorOption: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 10, backgroundColor: "#fafbff" },
  doctorOptionActive: { borderColor: colors.teal, backgroundColor: "#e8f7ff" },
  doctorOptionText: { fontSize: 14, fontWeight: "900", color: colors.text },
  doctorOptionSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
