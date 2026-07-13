import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/theme";
import { useAvisosViewModel } from "@/viewmodels/useAvisosViewModel";

export default function Avisos() {
  const vm = useAvisosViewModel();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.head}>Avisos</Text></View>
        <View style={styles.row}>
          <Text style={styles.today}>Hoy</Text>
          <TouchableOpacity onPress={vm.clean}><Text style={styles.clean}>Limpiar todo</Text></TouchableOpacity>
        </View>
        {vm.notices.length === 0 && <Text style={styles.empty}>No tienes avisos nuevos.</Text>}
        {vm.notices.map((x, i) => (
          <TouchableOpacity key={x.id} style={styles.notice} onPress={() => vm.handleNoticePress(x, i)}>
            <Text style={styles.noticeTitle}>{x.titulo}</Text>
            <Text style={styles.noticeSub}>{x.mensaje || "Hace 1 hora"}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.today}>Anteriores</Text>
        {vm.previous.map((x) => (
          <TouchableOpacity key={x.id} style={styles.notice} onPress={() => vm.handlePreviousPress(x)}>
            <Text style={styles.noticeTitle}>{x.titulo}</Text>
            <Text style={styles.noticeSub}>{x.mensaje}</Text>
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
  head: { color: "white", fontSize: 18, fontWeight: "900" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20 },
  today: { fontSize: 13, color: colors.muted, marginHorizontal: 20, marginTop: 20, marginBottom: 8 },
  clean: { fontSize: 12, color: colors.teal, fontWeight: "900" },
  empty: { color: colors.muted, textAlign: "center", marginTop: 20 },
  notice: { backgroundColor: "white", marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 12, minHeight: 76, shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 3 }, shadowRadius: 7, elevation: 2 },
  noticeTitle: { fontSize: 14, fontWeight: "900", color: colors.text },
  noticeSub: { fontSize: 11, color: colors.muted, marginTop: 8 },
});
