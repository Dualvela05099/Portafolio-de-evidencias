import React from "react";
import EditableProfile from "@/components/EditableProfile";

export default function PerfilPaciente() {
  return (
    <EditableProfile
      storageKey="perfil-paciente"
      headerTitle="Perfil del paciente"
      headerSub="Cuenta activa"
      avatarIcon="person"
      defaultName="Paciente Utopía"
      defaultRole="Paciente"
      fields={[
        { key: "email", label: "Correo", value: "paciente@gmail.com", icon: "mail-outline", keyboardType: "email-address" },
        { key: "phone", label: "Teléfono", value: "55 1234 5678", icon: "call-outline", keyboardType: "phone-pad" },
        { key: "nextAppointment", label: "Próxima cita", value: "Miércoles 10 Jun · 10:00 AM", icon: "calendar-outline" },
        { key: "emergency", label: "Contacto de emergencia", value: "Familiar · 55 8765 4321", icon: "medical-outline", multiline: true },
      ]}
    />
  );
}
