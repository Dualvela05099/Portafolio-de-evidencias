import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";

export function useRegistroDatosViewModel() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [sexo, setSexo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");

  const edad = useMemo(() => {
    if (!fechaNacimiento) return "";
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha.getTime())) return "";

    const hoy = new Date();
    let years = hoy.getFullYear() - fecha.getFullYear();
    const monthDiff = hoy.getMonth() - fecha.getMonth();
    const dayDiff = hoy.getDate() - fecha.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years -= 1;
    }

    return `${Math.max(years, 0)}`;
  }, [fechaNacimiento]);

  const continuar = useCallback(async () => {
    if (!nombre.trim() || !apellidoPaterno.trim() || !telefono.trim()) {
      Alert.alert("Datos incompletos", "Ingresa al menos nombre, apellido paterno y teléfono.");
      return;
    }

    const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
    await authService.saveRegistroTemporal({
      nombre: nombreCompleto,
      name: nombreCompleto,
      apellidoPaterno,
      apellidoMaterno,
      sexo,
      fechaNacimiento,
      telefono,
      phone: telefono,
      edad,
    });
    router.push("/registro-detalles");
  }, [nombre, apellidoPaterno, apellidoMaterno, sexo, fechaNacimiento, telefono]);

  useEffect(() => {
    const loadTempData = async () => {
      const temp = await authService.getRegistroTemporal();
      if (!temp) return;

      if (temp.nombre || temp.name) {
        const parts = (temp.nombre || temp.name).trim().split(" ");
        setNombre(parts[0] || "");
        setApellidoPaterno(parts[1] || temp.apellidoPaterno || "");
        setApellidoMaterno(parts.slice(2).join(" ") || temp.apellidoMaterno || "");
      }
      if (temp.sexo) setSexo(temp.sexo);
      if (temp.fechaNacimiento) setFechaNacimiento(temp.fechaNacimiento);
      if (temp.telefono || temp.phone) setTelefono(temp.telefono || temp.phone || "");
    };

    loadTempData();
  }, []);

  const goBack = useCallback(() => router.back(), []);

  return {
    nombre,
    setNombre,
    apellidoPaterno,
    setApellidoPaterno,
    apellidoMaterno,
    setApellidoMaterno,
    sexo,
    setSexo,
    fechaNacimiento,
    setFechaNacimiento,
    telefono,
    setTelefono,
    continuar,
    goBack,
  };
}
