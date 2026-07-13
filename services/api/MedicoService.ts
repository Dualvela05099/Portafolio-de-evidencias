import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Medico } from "@/types";

export class MedicoService {
  async getAll(): Promise<Medico[]> {
    console.log(`[MedicoService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[MedicoService.getAll] ✅ GET /medicos desde backend");
      const response = await apiClient.get<Medico[]>(API_CONFIG.ENDPOINTS.MEDICOS);
      console.log(`[MedicoService.getAll] ✅ ${response.data?.length || 0} médicos encontrados`);
      return response.data;
    }
    
    console.warn("[MedicoService.getAll] ⚠️ Usando storage local");
    return localDataRepository.getMedicos();
  }

  async save(medico: Partial<Medico>): Promise<Medico> {
    console.log(`[MedicoService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}, email=${medico.email}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[MedicoService.save] ✅ POST /medicos al backend");
      const response = await apiClient.post<Medico>(API_CONFIG.ENDPOINTS.MEDICOS, medico);
      return response.data;
    }
    
    return localDataRepository.saveMedico(medico);
  }

  async update(id: string, data: Partial<Medico>): Promise<Medico | null> {
    console.log(`[MedicoService.update] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[MedicoService.update] ✅ PATCH /medicos/${id}`);
      const response = await apiClient.patch<Medico>(`${API_CONFIG.ENDPOINTS.MEDICOS}/${id}`, data);
      return response.data;
    }
    
    return localDataRepository.updateMedico(id, data);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[MedicoService.delete] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[MedicoService.delete] ✅ DELETE /medicos/${id}`);
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.MEDICOS}/${id}`);
      return true;
    }
    
    return localDataRepository.deleteMedico(id);
  }
}

export const medicoService = new MedicoService();
