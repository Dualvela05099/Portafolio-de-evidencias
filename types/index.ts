export type UserRole = "paciente" | "medico" | "admin";

export type CitaEstado = "Pendiente" | "Completada" | "Cancelada" | string;

export interface BaseEntity {
  id: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface Usuario extends BaseEntity {
  nombre?: string;
  name?: string;
  correo?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  password?: string;
  rol?: UserRole;
}

export interface Paciente extends Usuario {
  edad?: string;
  direccion?: string;
  calle?: string;
  numero?: string;
  colonia?: string;
  localidad?: string;
  municipio?: string;
  estado?: string;
  codigoPostal?: string;
  sexo?: string;
  fechaNacimiento?: string;
  sangre?: string;
  alergias?: string;
  contactoEmergencia?: string;
  parentescoEmergencia?: string;
  telefonoEmergencia?: string;
  emergency?: string;
}

export interface Medico extends Usuario {
  especialidad?: string;
  role?: string;
  cedula?: string;
  license?: string;
  consultorio?: string;
  office?: string;
  horario?: string;
  estado?: string;
}

export interface Administrador extends Usuario {
  area?: string;
  role?: string;
  permisos?: string;
  permissions?: string;
}

export interface Cita extends BaseEntity {
  pacienteId?: string;
  pacienteNombre?: string;
  medicoId?: string;
  medicoNombre?: string;
  especialidad?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  estado?: CitaEstado;
}

export interface Historial extends BaseEntity {
  pacienteId?: string;
  medicoId?: string;
  citaId?: string;
  diagnostico?: string;
  tratamiento?: string;
  notas?: string;
  fecha?: string;
}

export interface Receta extends BaseEntity {
  pacienteId?: string;
  medicoId?: string;
  medicamentos?: string;
  indicaciones?: string;
  fecha?: string;
  fotoUri?: string;
}

export interface Notificacion extends BaseEntity {
  titulo: string;
  mensaje?: string;
  tipo?: string;
  leida?: boolean;
  fecha?: string;
}

export interface RegistroTemporal {
  correo?: string;
  email?: string;
  password?: string;
  rol?: UserRole;
  nombre?: string;
  name?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  sexo?: string;
  fechaNacimiento?: string;
  telefono?: string;
  phone?: string;
  edad?: string;
  direccion?: string;
  sangre?: string;
  alergias?: string;
  contactoEmergencia?: string;
  parentescoEmergencia?: string;
  telefonoEmergencia?: string;
}

export type LightStatus = "Buena iluminación" | "Poca luz" | "Demasiada luz" | "No disponible";

export type OrientationStatus = "Vertical" | "Horizontal" | "Inclinado" | "Estable";

export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}
