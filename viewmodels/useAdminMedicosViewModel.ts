import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { medicoService } from "@/services/api/MedicoService";
import type { Medico } from "@/types";

export function useAdminMedicosViewModel() {
  const [query, setQuery] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [correo, setCorreo] = useState("");

  const load = useCallback(async () => {
    setMedicos(await medicoService.getAll());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const agregar = useCallback(async () => {
    if (!nombre.trim() || !especialidad.trim() || !correo.trim()) {
      Alert.alert("Datos incompletos", "Ingresa nombre, especialidad y correo del médico.");
      return;
    }
    await medicoService.save({
      nombre,
      name: nombre,
      especialidad,
      role: especialidad,
      correo,
      email: correo,
      password: "123456",
      estado: "Activo",
    });
    setNombre("");
    setEspecialidad("");
    setCorreo("");
    await load();
    Alert.alert("Médico guardado", "El médico se guardó en la base local.");
  }, [nombre, especialidad, correo, load]);

  const borrar = useCallback(
    async (id: string) => {
      await medicoService.delete(id);
      await load();
      Alert.alert("Médico eliminado", "El registro fue eliminado de la base local.");
    },
    [load]
  );

  const showDetail = useCallback((medico: Medico) => {
    Alert.alert(medico.nombre || medico.name || "Médico", `Correo: ${medico.correo || medico.email || ""}`);
  }, []);

  const filtered = medicos.filter((d) =>
    `${d.nombre || d.name || ""} ${d.especialidad || d.role || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return {
    query,
    setQuery,
    medicos: filtered,
    nombre,
    setNombre,
    especialidad,
    setEspecialidad,
    correo,
    setCorreo,
    agregar,
    borrar,
    showDetail,
  };
}
