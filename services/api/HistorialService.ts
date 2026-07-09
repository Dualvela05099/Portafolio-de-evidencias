import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Historial, Receta } from "@/types";

export class HistorialService {
  async getAll(): Promise<Historial[]> {
    console.log(`[HistorialService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[HistorialService.getAll] ✅ GET /historial desde backend");
      const response = await apiClient.get<Historial[]>(API_CONFIG.ENDPOINTS.HISTORIAL);
      return response.data;
    }
    
    return localDataRepository.getHistorial();
  }

  async save(historial: Partial<Historial>): Promise<Historial> {
    console.log(`[HistorialService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[HistorialService.save] ✅ POST /historial al backend");
      const response = await apiClient.post<Historial>(API_CONFIG.ENDPOINTS.HISTORIAL, historial);
      return response.data;
    }
    
    return localDataRepository.saveHistorial(historial);
  }

  async getRecetas(): Promise<Receta[]> {
    console.log(`[HistorialService.getRecetas] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[HistorialService.getRecetas] ✅ GET /recetas desde backend");
      const response = await apiClient.get<Receta[]>(API_CONFIG.ENDPOINTS.RECETAS);
      return response.data;
    }
    
    return localDataRepository.getRecetas();
  }

  async saveReceta(receta: Partial<Receta>): Promise<Receta> {
    console.log(`[HistorialService.saveReceta] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[HistorialService.saveReceta] ✅ POST /recetas al backend");
      const response = await apiClient.post<Receta>(API_CONFIG.ENDPOINTS.RECETAS, receta);
      return response.data;
    }
    
    return localDataRepository.saveReceta(receta);
  }

  async deleteReceta(id: string): Promise<boolean> {
    console.log(`[HistorialService.deleteReceta] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[HistorialService.deleteReceta] ✅ DELETE /recetas/${id}`);
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.RECETAS}/${id}`);
      return true;
    }
    
    return localDataRepository.deleteReceta(id);
  }
}

export const historialService = new HistorialService();
