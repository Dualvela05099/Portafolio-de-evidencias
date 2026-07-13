import type { Paciente } from "@/types";

export type { Paciente } from "@/types";

export const mapPacienteFields = (paciente: Partial<Paciente>): Partial<Paciente> => ({
  nombre: paciente.nombre || paciente.name || "",
  name: paciente.nombre || paciente.name || "",
  correo: paciente.correo || paciente.email || "",
  telefono: paciente.telefono || paciente.phone || "",
  edad: paciente.edad || "",
  direccion: paciente.direccion || "",
  sexo: paciente.sexo || "",
  fechaNacimiento: paciente.fechaNacimiento || "",
  sangre: paciente.sangre || "",
  alergias: paciente.alergias || "",
  contactoEmergencia: paciente.contactoEmergencia || paciente.emergency || "",
  parentescoEmergencia: paciente.parentescoEmergencia || "",
  telefonoEmergencia: paciente.telefonoEmergencia || "",
  password: paciente.password || "123456",
  ...paciente,
});
