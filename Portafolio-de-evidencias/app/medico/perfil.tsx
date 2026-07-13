import React from "react";
import EditableProfile from "@/components/EditableProfile";

export default function PerfilMedico() {
  return (
    <EditableProfile
      storageKey="perfil-medico"
      headerTitle="Perfil médico"
      headerSub="Panel profesional"
      avatarIcon="medical"
      defaultName="Dr. Juan Pérez"
      defaultRole="Cardiólogo"
      fields={[
        { key: "email", label: "Correo", value: "doctor@gmail.com", icon: "mail-outline", keyboardType: "email-address" },
        { key: "license", label: "Cédula profesional", value: "MED-UTOPIA-2026", icon: "id-card-outline" },
        { key: "appointments", label: "Citas de hoy", value: "8 citas programadas", icon: "calendar-outline" },
        { key: "office", label: "Consultorio", value: "Consultorio 3 · Planta alta", icon: "business-outline", multiline: true },
      ]}
    />
  );
}
