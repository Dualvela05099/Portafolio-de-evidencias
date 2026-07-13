import { Platform } from "react-native";

/**
 * Configuración para consumir la API REST del backend.
 * 
 * IMPORTANTE: 
 * - USE_REMOTE_API debe ser TRUE para usar PostgreSQL directamente
 * - Si es FALSE, usará datos en memoria (SOLO para desarrollo sin backend)
 * - Variables de entorno (desde .env.local):
 *   - EXPO_PUBLIC_USE_REMOTE_API=true
 *   - EXPO_PUBLIC_API_URL=http://localhost:3000/api
 */
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL ??
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:3000/api`
    : "http://localhost:3000/api");

const baseUrl = Platform.OS === "android" && rawBaseUrl.includes("localhost")
  ? rawBaseUrl.replace("localhost", "10.0.2.2")
  : rawBaseUrl;

export const API_CONFIG = {
  USE_REMOTE_API: process.env.EXPO_PUBLIC_USE_REMOTE_API !== "false",
  BASE_URL: baseUrl,
  TIMEOUT_MS: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REGISTER: "/auth/register",
      SESSION: "/auth/session",
      CHECK_EMAIL: "/auth/check-email",
    },
    PACIENTES: "/pacientes",
    MEDICOS: "/medicos",
    ADMINS: "/administradores",
    CITAS: "/citas",
    HISTORIAL: "/historial",
    NOTIFICACIONES: "/notificaciones",
    RECETAS: "/recetas",
  },
} as const;

// Log de configuración en desarrollo
if (process.env.NODE_ENV === "development" || process.env.ENV === "development") {
  console.log(
    "[API_CONFIG]",
    API_CONFIG.USE_REMOTE_API ? "✅ API REMOTA HABILITADA" : "❌ API LOCAL HABILITADA (DESARROLLO)",
    `- Base URL: ${API_CONFIG.BASE_URL}`
  );
}
