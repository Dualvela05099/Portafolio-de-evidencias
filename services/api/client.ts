import { API_CONFIG } from "@/constants/api";
import type { ApiResponse } from "@/types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiNetworkError extends Error {
  constructor(message: string, public readonly url: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "ApiNetworkError";
  }
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiNetworkError) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return [
    error.name === "AbortError",
    error.message === "Failed to fetch",
    error.message.includes("Network request failed"),
    error.message.includes("fetch"),
  ].some(Boolean);
}

/**
 * Cliente HTTP preparado para API REST Express + PostgreSQL.
 * Usa el backend remoto por defecto; deshabilitar con EXPO_PUBLIC_USE_REMOTE_API=false.
 */
export class ApiClient {
  private baseUrl = API_CONFIG.BASE_URL;
  private timeout = API_CONFIG.TIMEOUT_MS;

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    if (!API_CONFIG.USE_REMOTE_API) {
      throw new Error("API remota deshabilitada. Usar servicios locales.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method ?? "GET";

    try {
      console.log(`[ApiClient] ${method} ${url}`, options.body || "");

      const response = await fetch(url, {
        method,
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      let data: T | null = null;
      try {
        data = (await response.json()) as T;
      } catch {
        data = null;
      }

      console.log(`[ApiClient] ✅ ${response.status} - ${method} ${endpoint}`);

      return {
        data: data as T,
        success: response.ok,
        message: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isNetworkError(error)) {
        console.warn(`[ApiClient] ⚠️ Backend no disponible para ${endpoint}:`, message);
        throw new ApiNetworkError(
          `No se pudo conectar al backend en ${url}. Verifica que el servidor esté en ejecución y que la URL sea correcta.`,
          url,
          error
        );
      }

      console.error(`[ApiClient] ❌ Error en ${endpoint}:`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
