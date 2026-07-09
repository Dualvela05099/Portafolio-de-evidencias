export type { Medico } from "@/types";

import type { Medico } from "@/types";

export const mapMedicoFields = (medico: Partial<Medico>): Partial<Medico> => ({
  nombre: medico.nombre || medico.name || "",
  name: medico.nombre || medico.name || "",
  correo: medico.correo || medico.email || "",
  telefono: medico.telefono || medico.phone || "",
  especialidad: medico.especialidad || medico.role || "",
  cedula: medico.cedula || medico.license || "",
  consultorio: medico.consultorio || medico.office || "",
  horario: medico.horario || "",
  estado: medico.estado || "Activo",
  password: medico.password || "123456",
  ...medico,
});
