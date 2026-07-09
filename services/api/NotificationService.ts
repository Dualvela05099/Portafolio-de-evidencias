import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Notificacion } from "@/types";

const DEFAULT_NOTICES = ["Cita Confirmada", "Recordatorio", "Cita Modificada"];
const PREVIOUS_NOTICES = ["Cita Cancelada", "Correo Enviado"];

export class NotificationService {
  async getAll(): Promise<Notificacion[]> {
    console.log(`[NotificationService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[NotificationService.getAll] ✅ GET /notificaciones desde backend");
      const response = await apiClient.get<Notificacion[]>(API_CONFIG.ENDPOINTS.NOTIFICACIONES);
      console.log(`[NotificationService.getAll] ✅ ${response.data?.length || 0} notificaciones encontradas`);
      return response.data;
    }
    
    console.warn("[NotificationService.getAll] ⚠️ Usando almacenamiento local");
    const stored = await localDataRepository.getNotificaciones();
    if (stored.length > 0) return stored;
    return DEFAULT_NOTICES.map((titulo, i) => ({
      id: `default-${i}`,
      titulo,
      mensaje: i === 1 ? "Tienes una cita próxima" : "Hace 1 hora",
      leida: false,
    }));
  }

  async getPrevious(): Promise<Notificacion[]> {
    return PREVIOUS_NOTICES.map((titulo, i) => ({
      id: `prev-${i}`,
      titulo,
      mensaje: "Ayer",
      leida: true,
    }));
  }

  async save(notificacion: Partial<Notificacion>): Promise<Notificacion> {
    console.log(`[NotificationService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[NotificationService.save] ✅ POST /notificaciones - ${notificacion.titulo}`);
      const response = await apiClient.post<Notificacion>(
        API_CONFIG.ENDPOINTS.NOTIFICACIONES,
        notificacion
      );
      return response.data;
    }
    
    console.warn("[NotificationService.save] ⚠️ Guardando notificación en storage local");
    return localDataRepository.saveNotificacion(notificacion);
  }

  async clearToday(): Promise<void> {
    console.log(`[NotificationService.clearToday] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[NotificationService.clearToday] ✅ DELETE /notificaciones/today");
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.NOTIFICACIONES}/today`);
      return;
    }
    
    await localDataRepository.clearNotificaciones();
  }
}

export const notificationService = new NotificationService();
