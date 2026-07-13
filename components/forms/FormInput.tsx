import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/constants/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  small?: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
  placeholder?: string;
};

export default function FormInput({
  label,
  value,
  onChangeText,
  small,
  keyboardType = "default",
  placeholder,
}: Props) {
  return (
    <View style={[styles.wrap, small && { flex: 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder ?? `Ingresa tu ${label.toLowerCase()}`}
        placeholderTextColor="#9aa3ae"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 13, color: "#696969", marginLeft: 14, marginBottom: 6 },
  input: {
    height: 48,
    backgroundColor: colors.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 13,
  },
});
