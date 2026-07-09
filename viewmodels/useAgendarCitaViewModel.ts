import { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";
import { citaService } from "@/services/api/CitaService";
import type { Cita } from "@/types";

const DOCTORS = [
  { id: "1", name: "Dra. Carmen López", specialty: "Cardiología" },
  { id: "2", name: "Dr. Andrés Ramírez", specialty: "Pediatría" },
  { id: "3", name: "Dra. Lucía Herrera", specialty: "Dermatología" },
  { id: "4", name: "Dr. Raúl Méndez", specialty: "Neurología" },
  { id: "5", name: "Dra. Elena Vázquez", specialty: "Ginecología" },
];

export function useAgendarCitaViewModel() {
  const [date, setDate] = useState(10);
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [showDoctorList, setShowDoctorList] = useState(false);

  const selectedDoctor = useMemo(
    () => DOCTORS.find((doctor) => doctor.id === selectedDoctorId) ?? DOCTORS[0],
    [selectedDoctorId]
  );

  const save = useCallback(async () => {
    const sesion = await authService.getSession();
    const formattedDate = `2026-06-${String(date).padStart(2, "0")}`;

    const citaData: Partial<Cita> = {
      pacienteId: sesion?.id || "",
      pacienteNombre: sesion?.name || sesion?.nombre || "Paciente",
      medicoId: selectedDoctor.id,
      medicoNombre: selectedDoctor.name,
      especialidad: selectedDoctor.specialty,
      fecha: formattedDate,
      hora: time,
      motivo: reason || "Consulta general",
      estado: "Pendiente",
    };

    try {
      await citaService.save(citaData);
      Alert.alert("Cita agendada", `Tu cita quedó para el ${date} de junio a las ${time}.`, [
        { text: "Aceptar", onPress: () => router.push("/confirmacion") },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(
        "No se pudo agendar la cita",
        message || "Ocurrió un error al guardar la cita. Verifica tu conexión y vuelve a intentarlo."
      );
    }
  }, [date, time, reason, selectedDoctor]);

  const goBack = useCallback(() => router.back(), []);
  const toggleDoctorList = useCallback(() => setShowDoctorList((value) => !value), []);
  const selectDoctor = useCallback((id: string) => {
    setSelectedDoctorId(id);
    setShowDoctorList(false);
  }, []);

  return {
    date,
    setDate,
    time,
    setTime,
    reason,
    setReason,
    save,
    goBack,
    showDoctorList,
    toggleDoctorList,
    selectDoctor,
    selectedDoctor,
    doctors: DOCTORS,
  };
}
