import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Administrador } from "@/types";

export class AdministradorService {
  async getAll(): Promise<Administrador[]> {
    console.log(`[AdministradorService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[AdministradorService.getAll] ✅ GET /administradores desde backend");
      const response = await apiClient.get<Administrador[]>(API_CONFIG.ENDPOINTS.ADMINS);
      return response.data;
    }
    
    console.warn("[AdministradorService.getAll] ⚠️ Usando storage local");
    return localDataRepository.getAdmins();
  }

  async save(admin: Partial<Administrador>): Promise<Administrador> {
    console.log(`[AdministradorService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}, email=${admin.email}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[AdministradorService.save] ✅ POST /administradores al backend");
      const response = await apiClient.post<Administrador>(API_CONFIG.ENDPOINTS.ADMINS, admin);
      return response.data;
    }
    
    return localDataRepository.saveAdmin(admin);
  }

  async update(id: string, data: Partial<Administrador>): Promise<Administrador | null> {
    console.log(`[AdministradorService.update] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[AdministradorService.update] ✅ PATCH /administradores/${id}`);
      const response = await apiClient.patch<Administrador>(`${API_CONFIG.ENDPOINTS.ADMINS}/${id}`, data);
      return response.data;
    }
    
    return localDataRepository.updateAdmin(id, data);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[AdministradorService.delete] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[AdministradorService.delete] ✅ DELETE /administradores/${id}`);
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMINS}/${id}`);
      return true;
    }
    
    return localDataRepository.deleteAdmin(id);
  }
}

export const administradorService = new AdministradorService();
