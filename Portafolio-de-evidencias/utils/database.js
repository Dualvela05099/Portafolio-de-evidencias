import AsyncStorage from "@react-native-async-storage/async-storage";

export const DB_KEYS = {
  PACIENTES: "db_pacientes",
  MEDICOS: "db_medicos",
  ADMINS: "db_admins",
  CITAS: "db_citas",
  RECETAS: "db_recetas",
  TEMP_REGISTER: "temp_register",
  SESION: "sesion_actual",
  DB_READY: "db_seed_ready",
};

const now = () => new Date().toISOString();
const generarId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export const obtenerDatos = async (key) => {
  try {
    const datos = await AsyncStorage.getItem(key);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.log(`Error al obtener ${key}:`, error);
    return [];
  }
};

export const guardarDatos = async (key, datos) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.log(`Error al guardar ${key}:`, error);
    return false;
  }
};

const normalizarCorreo = (correo = "") => correo.trim().toLowerCase();

const upsert = async (key, item, rol) => {
  const lista = await obtenerDatos(key);
  const correo = normalizarCorreo(item.correo || item.email);
  const id = item.id || lista.find((x) => normalizarCorreo(x.correo || x.email) === correo)?.id || generarId();

  const nuevo = {
    id,
    ...item,
    correo,
    email: correo,
    rol,
    actualizadoEn: now(),
  };

  const existe = lista.some((x) => x.id === id || normalizarCorreo(x.correo || x.email) === correo);
  const actualizada = existe
    ? lista.map((x) => (x.id === id || normalizarCorreo(x.correo || x.email) === correo ? { ...x, ...nuevo } : x))
    : [...lista, { ...nuevo, creadoEn: now() }];

  await guardarDatos(key, actualizada);
  return actualizada.find((x) => x.id === id || normalizarCorreo(x.correo || x.email) === correo);
};

export const guardarPaciente = async (paciente) => {
  return upsert(
    DB_KEYS.PACIENTES,
    {
      nombre: paciente.nombre || paciente.name || "",
      name: paciente.nombre || paciente.name || "",
      correo: paciente.correo || paciente.email || "",
      telefono: paciente.telefono || paciente.phone || "",
      edad: paciente.edad || "",
      direccion: paciente.direccion || "",
      sexo: paciente.sexo || "",
      fechaNacimiento: paciente.fechaNacimiento || "",
      sangre: paciente.sangre || "",
      alergias: paciente.alergias || "",
      contactoEmergencia: paciente.contactoEmergencia || paciente.emergency || "",
      parentescoEmergencia: paciente.parentescoEmergencia || "",
      telefonoEmergencia: paciente.telefonoEmergencia || "",
      password: paciente.password || "123456",
      ...paciente,
    },
    "paciente"
  );
};

export const obtenerPacientes = async () => obtenerDatos(DB_KEYS.PACIENTES);
export const actualizarPaciente = async (id, nuevosDatos) => {
  const pacientes = await obtenerPacientes();
  const actualizados = pacientes.map((p) => (p.id === id ? { ...p, ...nuevosDatos, actualizadoEn: now() } : p));
  await guardarDatos(DB_KEYS.PACIENTES, actualizados);
  return actualizados.find((p) => p.id === id) || null;
};
export const eliminarPaciente = async (id) => {
  const pacientes = await obtenerPacientes();
  await guardarDatos(DB_KEYS.PACIENTES, pacientes.filter((p) => p.id !== id));
  return true;
};

export const guardarMedico = async (medico) => {
  return upsert(
    DB_KEYS.MEDICOS,
    {
      nombre: medico.nombre || medico.name || "",
      name: medico.nombre || medico.name || "",
      correo: medico.correo || medico.email || "",
      telefono: medico.telefono || medico.phone || "",
      especialidad: medico.especialidad || medico.role || "",
      cedula: medico.cedula || medico.license || "",
      consultorio: medico.consultorio || medico.office || "",
      horario: medico.horario || "",
      estado: medico.estado || "Activo",
      password: medico.password || "123456",
      ...medico,
    },
    "medico"
  );
};

export const obtenerMedicos = async () => obtenerDatos(DB_KEYS.MEDICOS);
export const actualizarMedico = async (id, nuevosDatos) => {
  const medicos = await obtenerMedicos();
  const actualizados = medicos.map((m) => (m.id === id ? { ...m, ...nuevosDatos, actualizadoEn: now() } : m));
  await guardarDatos(DB_KEYS.MEDICOS, actualizados);
  return actualizados.find((m) => m.id === id) || null;
};
export const eliminarMedico = async (id) => {
  const medicos = await obtenerMedicos();
  await guardarDatos(DB_KEYS.MEDICOS, medicos.filter((m) => m.id !== id));
  return true;
};

export const guardarAdmin = async (admin) => {
  return upsert(
    DB_KEYS.ADMINS,
    {
      nombre: admin.nombre || admin.name || "",
      name: admin.nombre || admin.name || "",
      correo: admin.correo || admin.email || "",
      telefono: admin.telefono || admin.phone || "",
      area: admin.area || admin.role || "Administración",
      permisos: admin.permisos || admin.permissions || "Médicos, citas y avisos",
      password: admin.password || "123456",
      ...admin,
    },
    "admin"
  );
};

export const obtenerAdmins = async () => obtenerDatos(DB_KEYS.ADMINS);
export const actualizarAdmin = async (id, nuevosDatos) => {
  const admins = await obtenerAdmins();
  const actualizados = admins.map((a) => (a.id === id ? { ...a, ...nuevosDatos, actualizadoEn: now() } : a));
  await guardarDatos(DB_KEYS.ADMINS, actualizados);
  return actualizados.find((a) => a.id === id) || null;
};
export const eliminarAdmin = async (id) => {
  const admins = await obtenerAdmins();
  await guardarDatos(DB_KEYS.ADMINS, admins.filter((a) => a.id !== id));
  return true;
};

export const guardarCita = async (cita) => {
  const citas = await obtenerDatos(DB_KEYS.CITAS);
  const nueva = { id: cita.id || generarId(), estado: "Pendiente", creadoEn: now(), ...cita };
  await guardarDatos(DB_KEYS.CITAS, [...citas, nueva]);
  return nueva;
};
export const obtenerCitas = async () => obtenerDatos(DB_KEYS.CITAS);
export const actualizarCita = async (id, nuevosDatos) => {
  const citas = await obtenerCitas();
  const actualizadas = citas.map((c) => (c.id === id ? { ...c, ...nuevosDatos, actualizadoEn: now() } : c));
  await guardarDatos(DB_KEYS.CITAS, actualizadas);
  return actualizadas.find((c) => c.id === id) || null;
};
export const eliminarCita = async (id) => {
  const citas = await obtenerCitas();
  await guardarDatos(DB_KEYS.CITAS, citas.filter((c) => c.id !== id));
  return true;
};

export const guardarReceta = async (receta) => {
  const recetas = await obtenerDatos(DB_KEYS.RECETAS);
  const nueva = { id: receta.id || generarId(), fecha: now(), ...receta };
  await guardarDatos(DB_KEYS.RECETAS, [...recetas, nueva]);
  return nueva;
};
export const obtenerRecetas = async () => obtenerDatos(DB_KEYS.RECETAS);
export const eliminarReceta = async (id) => {
  const recetas = await obtenerRecetas();
  await guardarDatos(DB_KEYS.RECETAS, recetas.filter((r) => r.id !== id));
  return true;
};

export const guardarRegistroTemporal = async (datos) => {
  const actual = await AsyncStorage.getItem(DB_KEYS.TEMP_REGISTER);
  const parsed = actual ? JSON.parse(actual) : {};
  await AsyncStorage.setItem(DB_KEYS.TEMP_REGISTER, JSON.stringify({ ...parsed, ...datos }));
};

export const obtenerRegistroTemporal = async () => {
  const datos = await AsyncStorage.getItem(DB_KEYS.TEMP_REGISTER);
  return datos ? JSON.parse(datos) : {};
};

export const limpiarRegistroTemporal = async () => AsyncStorage.removeItem(DB_KEYS.TEMP_REGISTER);

export const loginUsuario = async (correo, password, rol) => {
  const key = rol === "medico" ? DB_KEYS.MEDICOS : rol === "admin" ? DB_KEYS.ADMINS : DB_KEYS.PACIENTES;
  const usuarios = await obtenerDatos(key);
  const encontrado = usuarios.find(
    (u) => normalizarCorreo(u.correo || u.email) === normalizarCorreo(correo) && String(u.password) === String(password)
  );
  return encontrado || null;
};

export const obtenerUsuarioDemoPorRol = async (rol) => {
  const key = rol === "medico" ? DB_KEYS.MEDICOS : rol === "admin" ? DB_KEYS.ADMINS : DB_KEYS.PACIENTES;
  const usuarios = await obtenerDatos(key);
  return usuarios[0] || null;
};

export const guardarSesionActual = async (usuario) => AsyncStorage.setItem(DB_KEYS.SESION, JSON.stringify(usuario));
export const obtenerSesionActual = async () => {
  const sesion = await AsyncStorage.getItem(DB_KEYS.SESION);
  return sesion ? JSON.parse(sesion) : null;
};
export const cerrarSesion = async () => AsyncStorage.removeItem(DB_KEYS.SESION);

export const seedDatabase = async () => {
  const ready = await AsyncStorage.getItem(DB_KEYS.DB_READY);
  if (ready === "true") return;

  await guardarPaciente({
    id: "paciente-demo",
    nombre: "Paciente Utopía",
    name: "Paciente Utopía",
    correo: "paciente@gmail.com",
    email: "paciente@gmail.com",
    telefono: "55 1234 5678",
    phone: "55 1234 5678",
    edad: "25",
    direccion: "Ciudad de México",
    sangre: "O+",
    alergias: "Ninguna registrada",
    contactoEmergencia: "Familiar",
    emergency: "Familiar · 55 8765 4321",
    telefonoEmergencia: "55 8765 4321",
    password: "123456",
  });

  await guardarMedico({
    id: "medico-demo",
    nombre: "Dr. Juan Pérez",
    name: "Dr. Juan Pérez",
    correo: "doctor@gmail.com",
    email: "doctor@gmail.com",
    telefono: "55 2468 1357",
    especialidad: "Cardiólogo",
    role: "Cardiólogo",
    cedula: "MED-UTOPIA-2026",
    license: "MED-UTOPIA-2026",
    consultorio: "Consultorio 3 · Planta alta",
    office: "Consultorio 3 · Planta alta",
    password: "123456",
  });

  await guardarAdmin({
    id: "admin-demo",
    nombre: "Administrador Utopía",
    name: "Administrador Utopía",
    correo: "admin@gmail.com",
    email: "admin@gmail.com",
    telefono: "55 9876 5432",
    area: "Admin",
    role: "Admin",
    permisos: "Médicos, citas y avisos",
    permissions: "Médicos, citas y avisos",
    password: "123456",
  });

  await guardarCita({ pacienteNombre: "Paciente Utopía", medicoNombre: "Dr. Juan Pérez", especialidad: "Cardiología", fecha: "Miércoles 10 Jun", hora: "10:00", motivo: "Consulta general", estado: "Pendiente" });
  await AsyncStorage.setItem(DB_KEYS.DB_READY, "true");
};

export const verTodaLaBase = async () => {
  const base = {
    pacientes: await obtenerPacientes(),
    medicos: await obtenerMedicos(),
    admins: await obtenerAdmins(),
    citas: await obtenerCitas(),
    recetas: await obtenerRecetas(),
    sesionActual: await obtenerSesionActual(),
  };
  console.log("BASE DE DATOS LOCAL:", base);
  return base;
};

export const borrarBaseDeDatos = async () => {
  await AsyncStorage.multiRemove([
    DB_KEYS.PACIENTES,
    DB_KEYS.MEDICOS,
    DB_KEYS.ADMINS,
    DB_KEYS.CITAS,
    DB_KEYS.RECETAS,
    DB_KEYS.TEMP_REGISTER,
    DB_KEYS.SESION,
    DB_KEYS.DB_READY,
  ]);
};
