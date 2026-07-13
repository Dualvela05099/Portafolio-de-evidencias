export const STORAGE_KEYS = {
  PACIENTES: "db_pacientes",
  MEDICOS: "db_medicos",
  ADMINS: "db_admins",
  CITAS: "db_citas",
  RECETAS: "db_recetas",
  HISTORIAL: "db_historial",
  NOTIFICACIONES: "db_notificaciones",
  TEMP_REGISTER: "temp_register",
  SESION: "sesion_actual",
  DB_READY: "db_seed_ready",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
