import { useCallback, useEffect, useState } from "react";
import { citaService } from "@/services/api/CitaService";
import { authService } from "@/services/api/AuthService";
import type { Cita } from "@/types";

const FILTERS = ["Todas", "Próximas", "Completadas", "Canceladas"] as const;

export function useAppointments() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [filter, setFilter] = useState<string>("Todas");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const sesion = await authService.getSession();
    const propias = await citaService.getByPaciente(sesion);
    setCitas(propias);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancelar = useCallback(
    async (id: string) => {
      await citaService.update(id, { estado: "Cancelada" });
      await load();
      return true;
    },
    [load]
  );

  const filtered = citaService.filterByEstado(citas, filter);

  return { citas, filtered, filter, setFilter, loading, reload: load, cancelar, filters: FILTERS };
}

export function useAdminAppointments() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setCitas(await citaService.getAll());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cambiarEstado = useCallback(
    async (id: string, estado: string) => {
      await citaService.update(id, { estado });
      await load();
    },
    [load]
  );

  const filtered = citas.filter((c) =>
    `${c.pacienteNombre || ""} ${c.fecha || ""} ${c.especialidad || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return { citas, filtered, query, setQuery, reload: load, cambiarEstado };
}
