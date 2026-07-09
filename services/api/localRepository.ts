import { STORAGE_KEYS } from "@/constants/storageKeys";
import { generateId, nowISO } from "@/utils/id";
import { normalizeEmail } from "@/utils/normalize";
import { getStorageItem, getStorageList, removeStorageItem, setStorageItem, setStorageList } from "@/utils/storage";
import type { Paciente, Medico, Administrador, Cita, Receta, Historial, Notificacion, RegistroTemporal, Usuario, UserRole } from "@/types";
import { mapPacienteFields } from "@/models/Paciente";
import { mapMedicoFields } from "@/models/Medico";
import { mapAdministradorFields } from "@/models/Administrador";

async function upsertEntity<T extends { id: string; correo?: string; email?: string }>(
  key: typeof STORAGE_KEYS.PACIENTES | typeof STORAGE_KEYS.MEDICOS | typeof STORAGE_KEYS.ADMINS,
  item: Partial<T>,
  rol: UserRole
): Promise<T> {
  const lista = await getStorageList<T>(key);
  const correo = normalizeEmail(item.correo || item.email);
  const id =
    item.id ||
    lista.find((x) => normalizeEmail(x.correo || x.email) === correo)?.id ||
    generateId();

  const nuevo = {
    id,
    ...item,
    correo,
    email: correo,
    rol,
    actualizadoEn: nowISO(),
  } as unknown as T;

  const existe = lista.some(
    (x) => x.id === id || normalizeEmail(x.correo || x.email) === correo
  );

  const actualizada = existe
    ? lista.map((x) =>
        x.id === id || normalizeEmail(x.correo || x.email) === correo
          ? { ...x, ...nuevo }
          : x
      )
    : [...lista, { ...nuevo, creadoEn: nowISO() } as T];

  await setStorageList(key, actualizada);
  return actualizada.find((x) => x.id === id || normalizeEmail(x.correo || x.email) === correo)!;
}

export class LocalDataRepository {
  async getPacientes(): Promise<Paciente[]> {
    return getStorageList<Paciente>(STORAGE_KEYS.PACIENTES);
  }

  async savePaciente(paciente: Partial<Paciente>): Promise<Paciente> {
    return upsertEntity<Paciente>(
      STORAGE_KEYS.PACIENTES,
      mapPacienteFields(paciente) as Paciente,
      "paciente"
    );
  }

  async emailExists(email: string): Promise<boolean> {
    if (!email.trim()) return false;
    const normalized = normalizeEmail(email);
    const pacientes = await this.getPacientes();
    const medicos = await this.getMedicos();
    const admins = await this.getAdmins();
    const allUsers = [...pacientes, ...medicos, ...admins];
    return allUsers.some((user) => normalizeEmail(user.correo || user.email) === normalized);
  }

  async updatePaciente(id: string, data: Partial<Paciente>): Promise<Paciente | null> {
    const pacientes = await this.getPacientes();
    const actualizados = pacientes.map((p) =>
      p.id === id ? { ...p, ...data, actualizadoEn: nowISO() } : p
    );
    await setStorageList(STORAGE_KEYS.PACIENTES, actualizados);
    return actualizados.find((p) => p.id === id) ?? null;
  }

  async deletePaciente(id: string): Promise<boolean> {
    const pacientes = await this.getPacientes();
    await setStorageList(
      STORAGE_KEYS.PACIENTES,
      pacientes.filter((p) => p.id !== id)
    );
    return true;
  }

  async getMedicos(): Promise<Medico[]> {
    return getStorageList<Medico>(STORAGE_KEYS.MEDICOS);
  }

  async saveMedico(medico: Partial<Medico>): Promise<Medico> {
    return upsertEntity<Medico>(
      STORAGE_KEYS.MEDICOS,
      mapMedicoFields(medico) as Medico,
      "medico"
    );
  }

  async updateMedico(id: string, data: Partial<Medico>): Promise<Medico | null> {
    const medicos = await this.getMedicos();
    const actualizados = medicos.map((m) =>
      m.id === id ? { ...m, ...data, actualizadoEn: nowISO() } : m
    );
    await setStorageList(STORAGE_KEYS.MEDICOS, actualizados);
    return actualizados.find((m) => m.id === id) ?? null;
  }

  async deleteMedico(id: string): Promise<boolean> {
    const medicos = await this.getMedicos();
    await setStorageList(
      STORAGE_KEYS.MEDICOS,
      medicos.filter((m) => m.id !== id)
    );
    return true;
  }

  async getAdmins(): Promise<Administrador[]> {
    return getStorageList<Administrador>(STORAGE_KEYS.ADMINS);
  }

  async saveAdmin(admin: Partial<Administrador>): Promise<Administrador> {
    return upsertEntity<Administrador>(
      STORAGE_KEYS.ADMINS,
      mapAdministradorFields(admin) as Administrador,
      "admin"
    );
  }

  async updateAdmin(id: string, data: Partial<Administrador>): Promise<Administrador | null> {
    const admins = await this.getAdmins();
    const actualizados = admins.map((a) =>
      a.id === id ? { ...a, ...data, actualizadoEn: nowISO() } : a
    );
    await setStorageList(STORAGE_KEYS.ADMINS, actualizados);
    return actualizados.find((a) => a.id === id) ?? null;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const admins = await this.getAdmins();
    await setStorageList(
      STORAGE_KEYS.ADMINS,
      admins.filter((a) => a.id !== id)
    );
    return true;
  }

  async getCitas(): Promise<Cita[]> {
    return getStorageList<Cita>(STORAGE_KEYS.CITAS);
  }

  async saveCita(cita: Partial<Cita>): Promise<Cita> {
    const citas = await this.getCitas();
    const nueva: Cita = {
      id: cita.id || generateId(),
      estado: "Pendiente",
      creadoEn: nowISO(),
      ...cita,
    };
    await setStorageList(STORAGE_KEYS.CITAS, [...citas, nueva]);
    return nueva;
  }

  async updateCita(id: string, data: Partial<Cita>): Promise<Cita | null> {
    const citas = await this.getCitas();
    const actualizadas = citas.map((c) =>
      c.id === id ? { ...c, ...data, actualizadoEn: nowISO() } : c
    );
    await setStorageList(STORAGE_KEYS.CITAS, actualizadas);
    return actualizadas.find((c) => c.id === id) ?? null;
  }

  async deleteCita(id: string): Promise<boolean> {
    const citas = await this.getCitas();
    await setStorageList(
      STORAGE_KEYS.CITAS,
      citas.filter((c) => c.id !== id)
    );
    return true;
  }

  async getRecetas(): Promise<Receta[]> {
    return getStorageList<Receta>(STORAGE_KEYS.RECETAS);
  }

  async saveReceta(receta: Partial<Receta>): Promise<Receta> {
    const recetas = await this.getRecetas();
    const nueva: Receta = { id: receta.id || generateId(), fecha: nowISO(), ...receta };
    await setStorageList(STORAGE_KEYS.RECETAS, [...recetas, nueva]);
    return nueva;
  }

  async deleteReceta(id: string): Promise<boolean> {
    const recetas = await this.getRecetas();
    await setStorageList(
      STORAGE_KEYS.RECETAS,
      recetas.filter((r) => r.id !== id)
    );
    return true;
  }

  async getHistorial(): Promise<Historial[]> {
    return getStorageList<Historial>(STORAGE_KEYS.HISTORIAL);
  }

  async saveHistorial(historial: Partial<Historial>): Promise<Historial> {
    const items = await this.getHistorial();
    const nuevo: Historial = { id: historial.id || generateId(), ...historial };
    await setStorageList(STORAGE_KEYS.HISTORIAL, [...items, nuevo]);
    return nuevo;
  }

  async getNotificaciones(): Promise<Notificacion[]> {
    return getStorageList<Notificacion>(STORAGE_KEYS.NOTIFICACIONES);
  }

  async saveNotificacion(notificacion: Partial<Notificacion>): Promise<Notificacion> {
    const items = await this.getNotificaciones();
    const nueva: Notificacion = {
      id: notificacion.id || generateId(),
      titulo: notificacion.titulo || "Aviso",
      leida: false,
      fecha: nowISO(),
      ...notificacion,
    };
    await setStorageList(STORAGE_KEYS.NOTIFICACIONES, [...items, nueva]);
    return nueva;
  }

  async clearNotificaciones(): Promise<void> {
    await setStorageList(STORAGE_KEYS.NOTIFICACIONES, []);
  }

  async saveRegistroTemporal(data: Partial<RegistroTemporal>): Promise<void> {
    const actual = (await getStorageItem<RegistroTemporal>(STORAGE_KEYS.TEMP_REGISTER)) ?? {};
    await setStorageItem(STORAGE_KEYS.TEMP_REGISTER, { ...actual, ...data });
  }

  async getRegistroTemporal(): Promise<RegistroTemporal> {
    return (await getStorageItem<RegistroTemporal>(STORAGE_KEYS.TEMP_REGISTER)) ?? {};
  }

  async clearRegistroTemporal(): Promise<void> {
    await removeStorageItem(STORAGE_KEYS.TEMP_REGISTER);
  }

  async login(correo: string, password: string, rol: UserRole): Promise<Usuario | null> {
    const key =
      rol === "medico"
        ? STORAGE_KEYS.MEDICOS
        : rol === "admin"
          ? STORAGE_KEYS.ADMINS
          : STORAGE_KEYS.PACIENTES;
    const usuarios = await getStorageList<Usuario>(key);
    return (
      usuarios.find(
        (u) =>
          normalizeEmail(u.correo || u.email) === normalizeEmail(correo) &&
          String(u.password) === String(password)
      ) ?? null
    );
  }

  async getDemoUserByRole(rol: UserRole): Promise<Usuario | null> {
    const key =
      rol === "medico"
        ? STORAGE_KEYS.MEDICOS
        : rol === "admin"
          ? STORAGE_KEYS.ADMINS
          : STORAGE_KEYS.PACIENTES;
    const usuarios = await getStorageList<Usuario>(key);
    return usuarios[0] ?? null;
  }

  async saveSession(usuario: Usuario): Promise<void> {
    await setStorageItem(STORAGE_KEYS.SESION, usuario);
  }

  async getSession(): Promise<Usuario | null> {
    return getStorageItem<Usuario>(STORAGE_KEYS.SESION);
  }

  async clearSession(): Promise<void> {
    await removeStorageItem(STORAGE_KEYS.SESION);
  }

  async isSeeded(): Promise<boolean> {
    const ready = await getStorageItem<string>(STORAGE_KEYS.DB_READY);
    return ready === "true";
  }

  async markSeeded(): Promise<void> {
    await setStorageItem(STORAGE_KEYS.DB_READY, "true");
  }

  async seed(): Promise<void> {
    if (await this.isSeeded()) return;

    await this.savePaciente({
      id: "paciente-demo",
      nombre: "Paciente Utopía",
      name: "Paciente Utopía",
      correo: "paciente@gmail.com",
      email: "paciente@gmail.com",
      telefono: "55 1234 5678",
      phone: "55 1234 5678",
      edad: "25",
      direccion: "Ciudad de México",
      sangre: "O+",
      alergias: "Ninguna registrada",
      contactoEmergencia: "Familiar",
      emergency: "Familiar · 55 8765 4321",
      telefonoEmergencia: "55 8765 4321",
      password: "123456",
    });

    await this.saveMedico({
      id: "medico-demo",
      nombre: "Dr. Juan Pérez",
      name: "Dr. Juan Pérez",
      correo: "doctor@gmail.com",
      email: "doctor@gmail.com",
      telefono: "55 2468 1357",
      especialidad: "Cardiólogo",
      role: "Cardiólogo",
      cedula: "MED-UTOPIA-2026",
      license: "MED-UTOPIA-2026",
      consultorio: "Consultorio 3 · Planta alta",
      office: "Consultorio 3 · Planta alta",
      password: "123456",
    });

    await this.saveAdmin({
      id: "admin-demo",
      nombre: "Administrador Utopía",
      name: "Administrador Utopía",
      correo: "admin@gmail.com",
      email: "admin@gmail.com",
      telefono: "55 9876 5432",
      area: "Admin",
      role: "Admin",
      permisos: "Médicos, citas y avisos",
      permissions: "Médicos, citas y avisos",
      password: "123456",
    });

    await this.saveCita({
      pacienteNombre: "Paciente Utopía",
      medicoNombre: "Dr. Juan Pérez",
      especialidad: "Cardiología",
      fecha: "Miércoles 10 Jun",
      hora: "10:00",
      motivo: "Consulta general",
      estado: "Pendiente",
    });

    await this.markSeeded();
  }
}

export const localDataRepository = new LocalDataRepository();
