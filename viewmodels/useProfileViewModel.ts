import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/services/api/AuthService";
import { pacienteService } from "@/services/api/PacienteService";
import { medicoService } from "@/services/api/MedicoService";
import { administradorService } from "@/services/api/AdministradorService";
import type { Usuario } from "@/types";
import type { Ionicons } from "@expo/vector-icons";

export type ProfileField = {
  key: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
};

type ProfileConfig = {
  storageKey: string;
  defaultName: string;
  defaultRole: string;
  fields: ProfileField[];
};

type ProfileValues = Record<string, string>;

function mapDbUserToValues(
  dbUser: Usuario | null,
  defaultName: string,
  defaultRole: string,
  defaultValues: ProfileValues
): ProfileValues {
  if (!dbUser) return {};

  const record = dbUser as Usuario & Record<string, string | undefined>;

  return {
    name: record.name || record.nombre || defaultName,
    role: record.role || record.especialidad || record.area || defaultRole,
    email: record.email || record.correo || defaultValues.email,
    phone: record.phone || record.telefono || defaultValues.phone,
    emergency: record.emergency || record.contactoEmergencia || defaultValues.emergency,
    license: record.license || record.cedula || defaultValues.license,
    office: record.office || record.consultorio || defaultValues.office,
    permissions: record.permissions || record.permisos || defaultValues.permissions,
  };
}

export function useProfileViewModel(config: ProfileConfig) {
  const { storageKey, defaultName, defaultRole, fields } = config;

  const profileRole = storageKey.includes("medico")
    ? "medico"
    : storageKey.includes("admin")
      ? "admin"
      : "paciente";

  const defaultValues = useMemo<ProfileValues>(() => {
    const values: ProfileValues = {
      name: defaultName,
      role: defaultRole,
    };
    fields.forEach((field) => {
      values[field.key] = field.value;
    });
    return values;
  }, [defaultName, defaultRole, fields]);

  const [values, setValues] = useState<ProfileValues>(defaultValues);
  const [savedValues, setSavedValues] = useState<ProfileValues>(defaultValues);
  const [isEditing, setIsEditing] = useState(false);

  const loadUserFromDatabase = useCallback(async (): Promise<Usuario | null> => {
    const sesion = await authService.getSession();
    if (sesion?.rol === profileRole) return sesion;

    if (profileRole === "medico") {
      const medicos = await medicoService.getAll();
      return medicos[0] ?? null;
    }
    if (profileRole === "admin") {
      const admins = await administradorService.getAll();
      return admins[0] ?? null;
    }
    const pacientes = await pacienteService.getAll();
    return pacientes[0] ?? null;
  }, [profileRole]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        const dbUser = await loadUserFromDatabase();
        const dbValues = mapDbUserToValues(dbUser, defaultName, defaultRole, defaultValues);
        const parsed = saved ? (JSON.parse(saved) as ProfileValues) : {};
        const merged = { ...defaultValues, ...dbValues, ...parsed };
        setValues(merged);
        setSavedValues(merged);
      } catch (error) {
        console.log("Error al cargar perfil:", error);
      }
    };

    loadProfile();
  }, [defaultValues, storageKey, defaultName, defaultRole, loadUserFromDatabase]);

  const updateValue = useCallback((key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const saveProfile = useCallback(async () => {
    if (!values.name?.trim()) {
      Alert.alert("Dato faltante", "El nombre no puede quedar vacío.");
      return;
    }

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(values));

      let dbUser: Usuario | null = null;
      if (profileRole === "medico") {
        dbUser = await medicoService.save(values);
      } else if (profileRole === "admin") {
        dbUser = await administradorService.save(values);
      } else {
        dbUser = await pacienteService.save(values);
      }

      if (dbUser) {
        await authService.saveSession(dbUser);
      }

      setSavedValues(values);
      setIsEditing(false);
      Alert.alert("Datos guardados", "Tu perfil se actualizó correctamente en la base de datos local.");
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los datos.");
      console.log(error);
    }
  }, [values, storageKey, profileRole]);

  const cancelEdit = useCallback(() => {
    setValues(savedValues);
    setIsEditing(false);
  }, [savedValues]);

  const resetProfile = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setValues(defaultValues);
      setSavedValues(defaultValues);
      setIsEditing(false);
      Alert.alert("Perfil restaurado", "Se recuperaron los datos de ejemplo.");
    } catch {
      Alert.alert("Error", "No se pudo restaurar el perfil.");
    }
  }, [storageKey, defaultValues]);

  return {
    values,
    isEditing,
    setIsEditing,
    updateValue,
    saveProfile,
    cancelEdit,
    resetProfile,
  };
}
