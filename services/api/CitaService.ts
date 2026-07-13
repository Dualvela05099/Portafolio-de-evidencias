import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { Cita, Usuario } from "@/types";

export class CitaService {
  async getAll(): Promise<Cita[]> {
    console.log(`[CitaService.getAll] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[CitaService.getAll] ✅ GET /citas desde backend");
      try {
        const response = await apiClient.get<Cita[]>(API_CONFIG.ENDPOINTS.CITAS);
        if (response.success) {
          console.log(`[CitaService.getAll] ✅ ${response.data?.length || 0} citas encontradas`);
          return response.data;
        }
        console.warn("[CitaService.getAll] ⚠️ Error en respuesta remota, usando storage local");
        return localDataRepository.getCitas();
      } catch (error) {
        console.warn("[CitaService.getAll] ❌ No se pudo recuperar citas remotas, usando storage local", error);
        return localDataRepository.getCitas();
      }
    }
    
    console.warn("[CitaService.getAll] ⚠️ Usando storage local");
    return localDataRepository.getCitas();
  }

  async getByPaciente(sesion: Usuario | null): Promise<Cita[]> {
    const todas = await this.getAll();
    return todas.filter(
      (c) =>
        !sesion?.id ||
        !c.pacienteId ||
        c.pacienteId === sesion.id ||
        c.pacienteNombre === sesion.name ||
        c.pacienteNombre === sesion.nombre
    );
  }

  async save(cita: Partial<Cita>): Promise<Cita> {
    console.log(`[CitaService.save] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[CitaService.save] ✅ POST /citas - ${cita.pacienteNombre} para ${cita.fecha} ${cita.hora}`);
      try {
        const response = await apiClient.post<Cita>(API_CONFIG.ENDPOINTS.CITAS, cita);
        if (!response.success) {
          throw new Error(response.message || "Error al guardar la cita en el servidor");
        }
        console.log(`[CitaService.save] ✅ Cita guardada con ID: ${response.data?.id}`);
        return response.data;
      } catch (error) {
        console.warn("[CitaService.save] ❌ No se pudo guardar la cita en backend, usando storage local", error);
        return localDataRepository.saveCita(cita);
      }
    }
    
    console.warn("[CitaService.save] ⚠️ Guardando cita en storage local");
    return localDataRepository.saveCita(cita);
  }

  async update(id: string, data: Partial<Cita>): Promise<Cita | null> {
    console.log(`[CitaService.update] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[CitaService.update] ✅ PATCH /citas/${id}`);
      const response = await apiClient.patch<Cita>(`${API_CONFIG.ENDPOINTS.CITAS}/${id}`, data);
      return response.data;
    }
    
    return localDataRepository.updateCita(id, data);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`[CitaService.delete] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log(`[CitaService.delete] ✅ DELETE /citas/${id}`);
      await apiClient.delete(`${API_CONFIG.ENDPOINTS.CITAS}/${id}`);
      return true;
    }
    
    return localDataRepository.deleteCita(id);
  }

  filterByEstado(citas: Cita[], filter: string): Cita[] {
    if (filter === "Todas") return citas;
    if (filter === "Canceladas") return citas.filter((c) => c.estado === "Cancelada");
    if (filter === "Completadas") return citas.filter((c) => c.estado === "Completada");
    return citas.filter((c) => c.estado !== "Cancelada" && c.estado !== "Completada");
  }
}

export const citaService = new CitaService();
