/** Re-export de compatibilidad hacia servicios MVVM. @deprecated Usar servicios en @/services/api */
export { authService } from "@/services/api/AuthService";
export { pacienteService } from "@/services/api/PacienteService";
export { medicoService } from "@/services/api/MedicoService";
export { administradorService } from "@/services/api/AdministradorService";
export { citaService } from "@/services/api/CitaService";
export { historialService } from "@/services/api/HistorialService";
export { notificationService } from "@/services/api/NotificationService";
export { STORAGE_KEYS as DB_KEYS } from "@/constants/storageKeys";

import { authService } from "@/services/api/AuthService";
import { pacienteService } from "@/services/api/PacienteService";
import { medicoService } from "@/services/api/MedicoService";
import { administradorService } from "@/services/api/AdministradorService";
import { citaService } from "@/services/api/CitaService";
import { historialService } from "@/services/api/HistorialService";
import type { UserRole } from "@/types";

export const seedDatabase = () => authService.seedDatabase();
export const loginUsuario = (correo: string, password: string, rol: UserRole) =>
  authService.login({ email: correo, password, role: rol });
export const obtenerUsuarioDemoPorRol = (rol: UserRole) => authService.getDemoUserByRole(rol);
export const guardarSesionActual = (usuario: Parameters<typeof authService.saveSession>[0]) =>
  authService.saveSession(usuario);
export const obtenerSesionActual = () => authService.getSession();
export const cerrarSesion = () => authService.logout();
export const guardarRegistroTemporal = (datos: Parameters<typeof authService.saveRegistroTemporal>[0]) =>
  authService.saveRegistroTemporal(datos);
export const obtenerRegistroTemporal = () => authService.getRegistroTemporal();
export const limpiarRegistroTemporal = () => authService.clearRegistroTemporal();
export const guardarPaciente = (paciente: Parameters<typeof pacienteService.save>[0]) =>
  pacienteService.save(paciente);
export const obtenerPacientes = () => pacienteService.getAll();
export const actualizarPaciente = (id: string, data: Parameters<typeof pacienteService.update>[1]) =>
  pacienteService.update(id, data);
export const eliminarPaciente = (id: string) => pacienteService.delete(id);
export const guardarMedico = (medico: Parameters<typeof medicoService.save>[0]) =>
  medicoService.save(medico);
export const obtenerMedicos = () => medicoService.getAll();
export const actualizarMedico = (id: string, data: Parameters<typeof medicoService.update>[1]) =>
  medicoService.update(id, data);
export const eliminarMedico = (id: string) => medicoService.delete(id);
export const guardarAdmin = (admin: Parameters<typeof administradorService.save>[0]) =>
  administradorService.save(admin);
export const obtenerAdmins = () => administradorService.getAll();
export const actualizarAdmin = (id: string, data: Parameters<typeof administradorService.update>[1]) =>
  administradorService.update(id, data);
export const eliminarAdmin = (id: string) => administradorService.delete(id);
export const guardarCita = (cita: Parameters<typeof citaService.save>[0]) => citaService.save(cita);
export const obtenerCitas = () => citaService.getAll();
export const actualizarCita = (id: string, data: Parameters<typeof citaService.update>[1]) =>
  citaService.update(id, data);
export const eliminarCita = (id: string) => citaService.delete(id);
export const guardarReceta = (receta: Parameters<typeof historialService.saveReceta>[0]) =>
  historialService.saveReceta(receta);
export const obtenerRecetas = () => historialService.getRecetas();
export const eliminarReceta = (id: string) => historialService.deleteReceta(id);
