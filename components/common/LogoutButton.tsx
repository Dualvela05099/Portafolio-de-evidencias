import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useLogoutViewModel } from "@/viewmodels/useLogoutViewModel";

type Props = {
  compact?: boolean;
  style?: ViewStyle;
};

export default function LogoutButton({ compact = false, style }: Props) {
  const { logout } = useLogoutViewModel();

  return (
    <TouchableOpacity
      onPress={logout}
      style={[compact ? styles.compactButton : styles.button, style]}
      activeOpacity={0.85}
    >
      <Ionicons name="log-out-outline" size={compact ? 20 : 22} color={compact ? colors.teal : "white"} />
      {!compact && <Text style={styles.buttonText}>Cerrar sesión</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
  compactButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
