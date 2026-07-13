import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import Card from "@/components/ui/Card";
import LogoutButton from "@/components/common/LogoutButton";
import { useProfileViewModel, type ProfileField } from "@/viewmodels/useProfileViewModel";

type EditableProfileProps = {
  storageKey: string;
  headerTitle: string;
  headerSub: string;
  avatarIcon: keyof typeof Ionicons.glyphMap;
  defaultName: string;
  defaultRole: string;
  fields: ProfileField[];
};

export default function EditableProfile({
  storageKey,
  headerTitle,
  headerSub,
  avatarIcon,
  defaultName,
  defaultRole,
  fields,
}: EditableProfileProps) {
  const { width } = useWindowDimensions();
  const isSmallPhone = width < 380;

  const { values, isEditing, setIsEditing, updateValue, saveProfile, cancelEdit, resetProfile } =
    useProfileViewModel({ storageKey, defaultName, defaultRole, fields });

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={[styles.headerTitle, isSmallPhone && styles.headerTitleSmall]}>{headerTitle}</Text>
              <Text style={styles.headerSub}>{headerSub}</Text>
            </View>
            <LogoutButton compact />
          </View>

          <View style={styles.contentWrap}>
            <Card style={styles.profileCard}>
              <View style={styles.avatar}>
                <Ionicons name={avatarIcon} size={isSmallPhone ? 36 : 42} color={colors.teal} />
              </View>

              {isEditing ? (
                <>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput value={values.name} onChangeText={(text) => updateValue("name", text)} style={styles.mainInput} placeholder="Nombre" />
                  <Text style={styles.inputLabel}>Rol / especialidad</Text>
                  <TextInput value={values.role} onChangeText={(text) => updateValue("role", text)} style={styles.mainInput} placeholder="Rol" />
                </>
              ) : (
                <>
                  <Text style={styles.name}>{values.name}</Text>
                  <Text style={styles.role}>{values.role}</Text>
                </>
              )}
            </Card>

            <View style={styles.section}>
              {fields.map((field) => (
                <Card style={styles.infoCard} key={field.key}>
                  <Ionicons name={field.icon} size={24} color={colors.teal} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{field.label}</Text>
                    {isEditing ? (
                      <TextInput
                        value={values[field.key]}
                        onChangeText={(text) => updateValue(field.key, text)}
                        style={[styles.fieldInput, field.multiline && styles.multilineInput]}
                        keyboardType={field.keyboardType ?? "default"}
                        multiline={field.multiline}
                        placeholder={field.label}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{values[field.key]}</Text>
                    )}
                  </View>
                </Card>
              ))}
            </View>

            {isEditing ? (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={cancelEdit}>
                  <Ionicons name="close-outline" size={22} color={colors.tealDark} />
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={saveProfile}>
                  <Ionicons name="save-outline" size={22} color="white" />
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={22} color="white" />
                <Text style={styles.editText}>Editar datos</Text>
              </TouchableOpacity>
            )}

            <LogoutButton />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f9f8" },
  keyboardView: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 140 },
  header: { minHeight: 116, backgroundColor: colors.teal, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  headerTextBlock: { flex: 1 },
  headerTitle: { color: "white", fontSize: 21, fontWeight: "900" },
  headerTitleSmall: { fontSize: 18 },
  headerSub: { color: "white", opacity: 0.85, marginTop: 4, fontSize: 13 },
  contentWrap: { width: "100%", maxWidth: 520, alignSelf: "center" },
  profileCard: { marginHorizontal: 16, marginTop: -26, alignItems: "center", paddingVertical: 24, paddingHorizontal: 18 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#edf3ff", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name: { color: colors.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
  role: { color: colors.muted, fontSize: 14, marginTop: 4, textAlign: "center" },
  inputLabel: { width: "100%", color: colors.muted, fontSize: 12, fontWeight: "800", marginTop: 10, marginBottom: 6 },
  mainInput: { width: "100%", minHeight: 48, backgroundColor: "#f1f6ff", borderRadius: 12, borderWidth: 1, borderColor: "#d4deef", paddingHorizontal: 14, color: colors.text, fontSize: 15, fontWeight: "700" },
  section: { paddingHorizontal: 16, marginTop: 18, gap: 12 },
  infoCard: { padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 14 },
  infoContent: { flex: 1, minWidth: 0 },
  infoLabel: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  infoValue: { color: colors.text, fontSize: 15, fontWeight: "900", marginTop: 3, flexShrink: 1 },
  fieldInput: { minHeight: 44, backgroundColor: "#f1f6ff", borderRadius: 10, borderWidth: 1, borderColor: "#d4deef", paddingHorizontal: 12, paddingVertical: 8, color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 7 },
  multilineInput: { minHeight: 72, textAlignVertical: "top" },
  editButton: { minHeight: 52, borderRadius: 14, backgroundColor: colors.tealDark, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginHorizontal: 16, marginTop: 22, marginBottom: 12, paddingHorizontal: 14 },
  editText: { color: "white", fontSize: 16, fontWeight: "900" },
  actionRow: { flexDirection: "row", gap: 12, marginHorizontal: 16, marginTop: 22, marginBottom: 12 },
  actionButton: { flex: 1, minHeight: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6, paddingHorizontal: 8 },
  cancelButton: { backgroundColor: "#e9f7f4", borderWidth: 1, borderColor: colors.teal },
  saveButton: { backgroundColor: colors.tealDark },
  cancelText: { color: colors.tealDark, fontSize: 15, fontWeight: "900" },
  saveText: { color: "white", fontSize: 15, fontWeight: "900" },
  resetButton: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 8 },
  resetText: { color: colors.tealDark, fontWeight: "800", fontSize: 13 },
});
