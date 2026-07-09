import { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authService } from "@/services/api/AuthService";
import { useEffect } from "react";
import { goBack as _noop } from "expo-router";

// Genera una lista de 100 alergias de ejemplo
const ALLERGIAS = Array.from({ length: 100 }, (_, i) => {
  const base = ["Polen", "Ácaros", "Lácteos", "Maní", "Mariscos", "Penicilina", "Aspirina", "Moho", "Picadura de abeja", "Gluten"];
  return `${base[i % base.length]} ${Math.floor(i / base.length) + 1}`;
});

export function useRegistroDetallesViewModel() {
  const [direccion, setDireccion] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [colonia, setColonia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [sangre, setSangre] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAlergias, setSelectedAlergias] = useState<string[]>([]);

  const bloodTypes = useMemo(() => ["A+","A-","B+","B-","AB+","AB-","O+","O-"], []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return ALLERGIAS.filter((a) => a.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  const addAllergy = useCallback((alergia: string) => {
    if (selectedAlergias.includes(alergia)) return;
    if (selectedAlergias.length >= 10) {
      Alert.alert("Límite alcanzado", "Solo puedes seleccionar hasta 10 alergias.");
      return;
    }
    setSelectedAlergias((s) => [...s, alergia]);
    setSearch("");
  }, [selectedAlergias]);

  const removeAllergy = useCallback((alergia: string) => {
    setSelectedAlergias((s) => s.filter((a) => a !== alergia));
  }, []);

  const continuar = useCallback(async () => {
    try {
      const temp = await authService.getRegistroTemporal();
      await authService.saveRegistroTemporal({
        ...temp,
        direccion: `${calle} ${numero} ${colonia} ${localidad} ${municipio} ${estado} ${codigoPostal}`.trim(),
        calle,
        numero,
        colonia,
        localidad,
        municipio,
        estado,
        codigoPostal,
        sangre,
        alergias: selectedAlergias.join(", "),
      });
      router.push("/registro-emergencia");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", `No se pudo guardar: ${msg}`);
    }
  }, [direccion, sangre, selectedAlergias]);

  const goBack = useCallback(() => router.back(), []);

  // Cargar datos temporales si existen
  useEffect(() => {
    const load = async () => {
      const temp = await authService.getRegistroTemporal();
      if (!temp) return;
      if (temp.calle) setCalle(temp.calle);
      if (temp.numero) setNumero(temp.numero);
      if (temp.colonia) setColonia(temp.colonia);
      if (temp.localidad) setLocalidad(temp.localidad);
      if (temp.municipio) setMunicipio(temp.municipio);
      if (temp.estado) setEstado(temp.estado);
      if (temp.codigoPostal) setCodigoPostal(temp.codigoPostal);
      if (temp.sangre) setSangre(temp.sangre);
      if (temp.alergias) setSelectedAlergias((temp.alergias as string).split(",").map((s) => s.trim()).filter(Boolean));
    };
    load();
  }, []);

  return {
    direccion,
    setDireccion,
    calle,
    setCalle,
    numero,
    setNumero,
    colonia,
    setColonia,
    localidad,
    setLocalidad,
    municipio,
    setMunicipio,
    estado,
    setEstado,
    codigoPostal,
    setCodigoPostal,
    sangre,
    setSangre,
    bloodTypes,
    search,
    setSearch,
    suggestions,
    selectedAlergias,
    addAllergy,
    removeAllergy,
    continuar,
    goBack,
  };
}
