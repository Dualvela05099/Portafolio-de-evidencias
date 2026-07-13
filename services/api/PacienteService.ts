import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Paciente } from "@/types";

export class PacienteService {
  async getAll(): Promise<Paciente[]> {
    console.log(`[PacienteService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[PacienteService.getAll] ✅ GET /pacientes desde backend");
      const response = await apiClient.get<Paciente[]>(API_CONFIG.ENDPOINTS.PACIENTES);
      return response.data;
    }
    
    console.warn("[PacienteService.getAll] ⚠️ Usando storage local (desarrollo)");
    return localDataRepository.getPacientes();
  }

  async save(paciente: Partial<Paciente>): Promise<Paciente> {
    console.log(`[PacienteService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}, email=${paciente.email || paciente.correo}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[PacienteService.save] ✅ POST /pacientes al backend");
      const response = await apiClient.post<Paciente>(API_CONFIG.ENDPOINTS.PACIENTES, paciente);
      console.log("[PacienteService.save] ✅ Respuesta recibida:", response.data?.id);
      return response.data;
    }
    
    console.warn("[PacienteService.save] ⚠️ Guardando en storage local");
    return localDataRepository.savePaciente(paciente);
  }

  async update(id: string, data: Partial<Paciente>): Promise<Paciente | null> {
    console.log(`[PacienteService.update] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[PacienteService.update] ✅ PATCH /pacientes/${id}`);
      const response = await apiClient.patch<Paciente>(`${API_CONFIG.ENDPOINTS.PACIENTES}/${id}`, data);
      return response.data;
    }
    
    return localDataRepository.updatePaciente(id, data);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[PacienteService.delete] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[PacienteService.delete] ✅ DELETE /pacientes/${id}`);
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.PACIENTES}/${id}`);
      return true;
    }
    
    return localDataRepository.deletePaciente(id);
  }
}

export const pacienteService = new PacienteService();
