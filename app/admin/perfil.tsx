import React from "react";
import EditableProfile from "@/components/common/EditableProfile";

export default function PerfilAdmin() {
  return (
    <EditableProfile
      storageKey="perfil-admin"
      headerTitle="Perfil administrador"
      headerSub="Panel de control"
      avatarIcon="settings"
      defaultName="Administrador Utopía"
      defaultRole="Admin"
      fields={[
        { key: "email", label: "Correo", value: "admin@gmail.com", icon: "mail-outline", keyboardType: "email-address" },
        { key: "permissions", label: "Permisos", value: "Médicos, citas y avisos", icon: "key-outline", multiline: true },
        { key: "doctors", label: "Médicos registrados", value: "320 médicos activos", icon: "medical-outline" },
        { key: "appointments", label: "Citas de hoy", value: "154 citas registradas", icon: "calendar-outline" },
      ]}
    />
  );
}
