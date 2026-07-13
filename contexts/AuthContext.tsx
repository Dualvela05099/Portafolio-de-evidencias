import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/api/AuthService";
import type { Usuario, UserRole } from "@/types";

interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  saveSession: (usuario: Usuario) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string, role: UserRole) => Promise<Usuario | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const sesion = await authService.getSession();
    setUser(sesion);
  }, []);

  useEffect(() => {
    authService.seedDatabase().finally(async () => {
      await refreshSession();
      setLoading(false);
    });
  }, [refreshSession]);

  const saveSession = useCallback(async (usuario: Usuario) => {
    await authService.saveSession(usuario);
    setUser(usuario);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    const usuario = await authService.login({ email, password, role });
    if (usuario) {
      await saveSession(usuario);
    }
    return usuario;
  }, [saveSession]);

  const value = useMemo(
    () => ({ user, loading, refreshSession, saveSession, logout, login }),
    [user, loading, refreshSession, saveSession, logout, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
}
