import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppLogo from "@/components/ui/AppLogo";
import FormInput from "@/components/forms/FormInput";
import { colors } from "@/constants/theme";
import { useRegistroDetallesViewModel } from "@/viewmodels/useRegistroDetallesViewModel";

export default function RegistroDetallesScreen() {
  const vm = useRegistroDetallesViewModel();

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.topText}>Detalles médicos</Text>
        <View style={styles.phoneCard}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={vm.goBack}><Text style={styles.backText}>←</Text></TouchableOpacity>
            <AppLogo size={135} />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Tu perfil médico</Text>
            <Text style={styles.subtitle}>Completa tu dirección, tipo de sangre y alergias.</Text>

            <Text style={styles.label}>Dirección</Text>
            <FormInput label="Calle" value={vm.calle} onChangeText={vm.setCalle} />
            <FormInput label="Número" value={vm.numero} onChangeText={vm.setNumero} />
            <FormInput label="Colonia" value={vm.colonia} onChangeText={vm.setColonia} />
            <FormInput label="Localidad" value={vm.localidad} onChangeText={vm.setLocalidad} />
            <FormInput label="Municipio" value={vm.municipio} onChangeText={vm.setMunicipio} />
            <FormInput label="Estado" value={vm.estado} onChangeText={vm.setEstado} />
            <FormInput label="Código postal" value={vm.codigoPostal} onChangeText={vm.setCodigoPostal} keyboardType="numeric" />

            <Text style={styles.label}>Tipo de sangre</Text>
            <View style={styles.dropdownContainer}>
              {vm.bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodOption,
                    vm.sangre === type && styles.bloodOptionActive,
                  ]}
                  onPress={() => vm.setSangre(type)}
                >
                  <Text style={[styles.bloodText, vm.sangre === type && styles.bloodTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Alergias</Text>
            <TextInput
              value={vm.search}
              onChangeText={vm.setSearch}
              style={styles.input}
              placeholder="Busca alergias"
              placeholderTextColor="#8d96a3"
            />

            <View style={styles.selectedRow}>
              {vm.selectedAlergias.map((alergia) => (
                <View key={alergia} style={styles.chip}>
                  <Text style={styles.chipText}>{alergia}</Text>
                  <TouchableOpacity onPress={() => vm.removeAllergy(alergia)} style={styles.chipClose}>
                    <Text style={styles.chipCloseText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {vm.suggestions.length > 0 && (
              <View style={styles.suggestionsCard}>
                {vm.suggestions.map((item) => (
                  <TouchableOpacity key={item} style={styles.suggestionItem} onPress={() => vm.addAllergy(item)}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={vm.continuar}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f3f3" },
  scroll: { alignItems: "center", paddingBottom: 32 },
  topText: { width: "90%", maxWidth: 420, color: "#b5b5b5", fontSize: 16, marginTop: 10, marginBottom: 10 },
  phoneCard: { width: "90%", maxWidth: 420, minHeight: 760, backgroundColor: "#fbfbfb", borderRadius: 26, overflow: "hidden" },
  header: { height: 280, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", top: 34, left: 22, zIndex: 2 },
  backText: { color: "white", fontSize: 30 },
  card: { width: "86%", alignSelf: "center", marginTop: -62, backgroundColor: "white", borderRadius: 22, paddingHorizontal: 22, paddingVertical: 24, shadowColor: "#8ab7c2", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 8 },
  title: { color: colors.teal, fontSize: 26, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 8, marginBottom: 18 },
  label: { color: "#696969", fontSize: 14, marginBottom: 8 },
  input: { minHeight: 52, backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, fontSize: 15, color: colors.text, marginBottom: 16 },
  textArea: { minHeight: 104, paddingTop: 14, textAlignVertical: "top" },
  dropdownContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  bloodOption: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input },
  bloodOptionActive: { borderColor: colors.teal, backgroundColor: "#e8f7fb" },
  bloodText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  bloodTextActive: { color: colors.teal },
  selectedRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  chip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: "#eef7fb", borderWidth: 1, borderColor: "#c8e7ef" },
  chipText: { color: colors.text, fontSize: 13, marginRight: 8 },
  chipClose: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#d6f0fb", alignItems: "center", justifyContent: "center" },
  chipCloseText: { color: colors.teal, fontSize: 14, lineHeight: 16, fontWeight: "700" },
  suggestionsCard: { borderRadius: 16, backgroundColor: "#f7fbff", borderWidth: 1, borderColor: "#dce8ef", padding: 10, marginBottom: 16 },
  suggestionItem: { paddingVertical: 10 },
  suggestionText: { color: colors.text, fontSize: 14 },
  button: { height: 58, borderRadius: 12, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "900" },
});
