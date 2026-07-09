import { API_CONFIG } from "@/constants/api";
import { apiClient } from "@/services/api/client";
import { localDataRepository } from "@/services/api/localRepository";
import type { LoginCredentials, RegistroTemporal, Usuario, UserRole } from "@/types";

export class AuthService {
  async seedDatabase(): Promise<void> {
    return localDataRepository.seed();
  }

  async login(credentials: LoginCredentials): Promise<Usuario | null> {
    console.log(`[AuthService.login] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}, email=${credentials.email}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[AuthService.login] ✅ Usando API remota");
      try {
        const response = await apiClient.post<Usuario>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.success && response.data) {
          return response.data;
        }
      } catch (error) {
        console.warn("[AuthService.login] ❌ No se pudo conectar al backend, usando login local", error);
      }

      await localDataRepository.seed();
      return localDataRepository.login(credentials.email, credentials.password, credentials.role);
    }
    
    console.warn("[AuthService.login] ⚠️ USANDO DATOS LOCALES (API_CONFIG.USE_REMOTE_API=false)");
    return localDataRepository.login(credentials.email, credentials.password, credentials.role);
  }

  async getDemoUserByRole(role: UserRole): Promise<Usuario | null> {
    return localDataRepository.getDemoUserByRole(role);
  }

  async saveSession(usuario: Usuario): Promise<void> {
    console.log(`[AuthService.saveSession] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[AuthService.saveSession] ✅ Guardando sesión en backend");
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.SESSION, usuario);
      } catch (error) {
        console.warn("[AuthService.saveSession] ❌ No se pudo guardar sesión en backend, se guardará localmente", error);
      }
      await localDataRepository.saveSession(usuario);
      return;
    }
    
    console.warn("[AuthService.saveSession] ⚠️ Guardando sesión en storage local");
    await localDataRepository.saveSession(usuario);
  }

  async getSession(): Promise<Usuario | null> {
    if (API_CONFIG.USE_REMOTE_API) {
      try {
        const response = await apiClient.get<Usuario>(API_CONFIG.ENDPOINTS.AUTH.SESSION);
        if (response.success) {
          return response.data;
        }
        console.warn("[AuthService.getSession] ⚠️ Sesión remota no válida, intentando sesión local");
        return localDataRepository.getSession();
      } catch (error) {
        console.warn("[AuthService.getSession] ❌ No se pudo recuperar sesión remota, usando sesión local", error);
        return localDataRepository.getSession();
      }
    }
    return localDataRepository.getSession();
  }

  async checkEmailExists(email: string): Promise<boolean> {
    if (!email.trim()) return false;

    if (API_CONFIG.USE_REMOTE_API) {
      const response = await apiClient.get<{ exists: boolean }>(
        `${API_CONFIG.ENDPOINTS.AUTH.CHECK_EMAIL}?email=${encodeURIComponent(email)}`
      );
      return response.success ? response.data.exists : false;
    }

    return localDataRepository.emailExists(email);
  }

  async logout(): Promise<void> {
    console.log(`[AuthService.logout] USE_REMOTE_API=${API_CONFIG.USE_REMOTE_API}`);
    
    if (API_CONFIG.USE_REMOTE_API) {
      console.log("[AuthService.logout] ✅ Desconectando desde backend");
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
      } catch (error) {
        console.warn("[AuthService.logout] ❌ No se pudo cerrar sesión remota, igualmente limpiando sesión local", error);
      }
      await localDataRepository.clearSession();
      return;
    }
    
    console.warn("[AuthService.logout] ⚠️ Limpiando sesión local");
    await localDataRepository.clearSession();
  }

  async saveRegistroTemporal(data: Partial<RegistroTemporal>): Promise<void> {
    console.log(`[AuthService.saveRegistroTemporal] Guardando datos temporales`);
    return localDataRepository.saveRegistroTemporal(data);
  }

  async getRegistroTemporal(): Promise<RegistroTemporal> {
    return localDataRepository.getRegistroTemporal();
  }

  async clearRegistroTemporal(): Promise<void> {
    return localDataRepository.clearRegistroTemporal();
  }
}

export const authService = new AuthService();
