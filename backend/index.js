const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.options("*", cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "utopia-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Utopia Clínica backend está en línea",
    api: "/api",
    database: process.env.DB_NAME || "utopia_clinica",
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "API Utopia Clínica disponible",
    endpoints: [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/session",
      "/api/pacientes",
      "/api/medicos",
      "/api/administradores",
      "/api/citas",
      "/api/historial",
      "/api/recetas",
      "/api/notificaciones",
    ],
  });
});

function mapBasicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    rol: row.rol,
    nombre: row.nombre,
    telefono: row.telefono,
  };
}

function mapPacienteRow(row) {
  if (!row) return null;
  return {
    ...mapBasicUser(row),
    edad: row.edad,
    direccion: row.direccion,
    sexo: row.sexo,
    fechaNacimiento: row.fecha_nacimiento ? row.fecha_nacimiento.toISOString().slice(0, 10) : undefined,
    sangre: row.tipo_sangre,
    alergias: row.alergias,
    contactoEmergencia: row.contacto_emergencia,
    parentescoEmergencia: row.parentesco_emergencia,
    telefonoEmergencia: row.telefono_emergencia,
  };
}

function mapMedicoRow(row) {
  if (!row) return null;
  return {
    ...mapBasicUser(row),
    especialidad: row.especialidad,
    cedula: row.cedula,
    consultorio: row.consultorio,
    horario: row.horario,
    estado: row.estado,
  };
}

function mapAdminRow(row) {
  if (!row) return null;
  return {
    ...mapBasicUser(row),
    area: row.area,
    permisos: row.permisos,
  };
}

function mapCitaRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    pacienteNombre: row.paciente_nombre,
    medicoId: row.medico_id,
    medicoNombre: row.medico_nombre,
    especialidad: row.especialidad,
    fecha: row.fecha ? row.fecha.toISOString().slice(0, 10) : undefined,
    hora: row.hora ? row.hora.toString() : undefined,
    motivo: row.motivo,
    estado: row.estado,
    creadoEn: row.creado_en,
    actualizadoEn: row.actualizado_en,
  };
}

function mapHistorialRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    medicoId: row.medico_id,
    citaId: row.cita_id,
    diagnostico: row.diagnostico,
    tratamiento: row.tratamiento,
    notas: row.notas,
    fecha: row.fecha ? row.fecha.toISOString() : undefined,
    creadoEn: row.creado_en,
  };
}

function mapRecetaRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    medicoId: row.medico_id,
    medicamentos: row.medicamentos,
    indicaciones: row.indicaciones,
    fotoUri: row.foto_uri,
    fecha: row.fecha ? row.fecha.toISOString() : undefined,
    creadoEn: row.creado_en,
  };
}

function mapNotificacionRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    usuarioId: row.usuario_id,
    titulo: row.titulo,
    mensaje: row.mensaje,
    tipo: row.tipo,
    leida: row.leida,
    fecha: row.fecha ? row.fecha.toISOString() : undefined,
    creadoEn: row.creado_en,
  };
}

function sendError(res, error, status = 500) {
  console.error(error);
  res.status(status).json({ error: error.message || "Internal server error" });
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`[LOGIN] Recibido - email: ${email}, rol: ${role}`);
    
    if (!email || !password || !role) {
      console.error("[LOGIN] Parámetros faltantes");
      return res.status(400).json({ error: "email, password and role are required" });
    }

    console.log("[LOGIN] Buscando usuario por email y rol...");
    const result = await pool.query(
      "SELECT id, email, rol, nombre, telefono, password FROM usuarios WHERE LOWER(email) = LOWER($1) AND rol = $2",
      [email, role]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      console.warn(`[LOGIN] Usuario no encontrado para ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, userRow.password || "");
    if (!match) {
      console.warn(`[LOGIN] Contraseña inválida para ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
      rol: userRow.rol,
      nombre: userRow.nombre,
      telefono: userRow.telefono,
    };

    console.log(`[LOGIN] ✅ Usuario autenticado: ${user.id}`);
    req.session.user = user;
    res.json(user);
  } catch (error) {
    console.error("[LOGIN] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.post("/api/auth/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      email,
      password,
      nombre,
      telefono,
      rol = "paciente",
      edad,
      direccion,
      sexo,
      fechaNacimiento,
      sangre,
      alergias,
      contactoEmergencia,
      parentescoEmergencia,
      telefonoEmergencia,
    } = req.body;

    console.log(`[REGISTER] Recibido - email: ${email}, nombre: ${nombre}, rol: ${rol}`);

    if (!email || !password || !nombre || !rol) {
      console.error("[REGISTER] Parámetros faltantes");
      return res.status(400).json({ error: "email, password, nombre and rol are required" });
    }

    // Verificar si el email ya existe (ignorando mayúsculas/minúsculas)
    const exists = await client.query("SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)", [email]);
    if (exists.rows.length > 0) {
      console.warn(`[REGISTER] Email ya registrado: ${email}`);
      return res.status(409).json({ error: "El correo ya pertenece a una cuenta activa en el sistema" });
    }

    console.log("[REGISTER] Iniciando transacción...");
    await client.query("BEGIN");

    const userId = uuid();
    console.log(`[REGISTER] Generado userId: ${userId}`);
    console.log("[REGISTER] Ejecutando INSERT en usuarios...");
    const hashed = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO usuarios (id, email, password, rol, nombre, telefono) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, email, hashed, rol, nombre, telefono || null]
    );
    console.log("[REGISTER] ✅ Usuario insertado en tabla usuarios");

    if (rol === "paciente") {
      console.log("[REGISTER] Ejecutando INSERT en pacientes...");
      await client.query(
        "INSERT INTO pacientes (usuario_id, edad, direccion, sexo, fecha_nacimiento, tipo_sangre, alergias, contacto_emergencia, parentesco_emergencia, telefono_emergencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          userId,
          edad || null,
          direccion || null,
          sexo || null,
          fechaNacimiento || null,
          sangre || null,
          alergias || null,
          contactoEmergencia || null,
          parentescoEmergencia || null,
          telefonoEmergencia || null,
        ]
      );
      console.log("[REGISTER] ✅ Paciente insertado en tabla pacientes");
    }

    console.log("[REGISTER] Ejecutando COMMIT...");
    await client.query("COMMIT");
    console.log("[REGISTER] ✅ Transacción completada");
    
    const newUser = { id: userId, email, rol, nombre, telefono };
    req.session.user = newUser;
    res.status(201).json(newUser);
  } catch (error) {
    console.error("[REGISTER] Error SQL:", error.message);
    console.log("[REGISTER] Ejecutando ROLLBACK...");
    await client.query("ROLLBACK");
    sendError(res, error);
  } finally {
    client.release();
  }
});

app.post("/api/auth/session", (req, res) => {
  const user = req.body;
  req.session.user = user;
  res.json(req.session.user || null);
});

app.get("/api/auth/session", (req, res) => {
  res.json(req.session.user || null);
});

app.get("/api/auth/check-email", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "El correo es requerido" });
    }

    const result = await pool.query(
      "SELECT 1 FROM usuarios WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [String(email)]
    );
    res.json({ exists: result.rowCount > 0 });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return sendError(res, error);
    }
    res.json({ success: true });
  });
});

app.get("/api/pacientes", async (req, res) => {
  try {
    console.log("[GET /api/pacientes] Recuperando todos los pacientes...");
    const result = await pool.query(
      `SELECT u.id, u.email, u.rol, u.nombre, u.telefono, p.edad, p.direccion, p.sexo, p.fecha_nacimiento, p.tipo_sangre, p.alergias, p.contacto_emergencia, p.parentesco_emergencia, p.telefono_emergencia
       FROM usuarios u
       LEFT JOIN pacientes p ON p.usuario_id = u.id
       WHERE u.rol = $1`,
      ["paciente"]
    );
    console.log(`[GET /api/pacientes] ✅ ${result.rows.length} pacientes encontrados en BD`);
    res.json(result.rows.map(mapPacienteRow));
  } catch (error) {
    console.error("[GET /api/pacientes] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.post("/api/pacientes", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      email,
      password,
      nombre,
      telefono,
      edad,
      direccion,
      sexo,
      fechaNacimiento,
      sangre,
      alergias,
      contactoEmergencia,
      parentescoEmergencia,
      telefonoEmergencia,
    } = req.body;

    console.log(`[POST /api/pacientes] Recibido - email: ${email}, nombre: ${nombre}`);

      if (!email || !password || !nombre) {
        console.error("[POST /api/pacientes] Parámetros faltantes");
        return res.status(400).json({ error: "email, password and nombre are required" });
      }

      // Verificar email existente
      const exists = await client.query("SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)", [email]);
      if (exists.rows.length > 0) {
        console.warn(`[POST /api/pacientes] Email ya registrado: ${email}`);
        return res.status(409).json({ error: "El correo ya pertenece a una cuenta activa en el sistema" });
      }

      console.log("[POST /api/pacientes] Iniciando transacción...");
      await client.query("BEGIN");
      const userId = uuid();
      console.log(`[POST /api/pacientes] Generado userId: ${userId}`);
      console.log("[POST /api/pacientes] Ejecutando INSERT en usuarios...");
      const hashed = await bcrypt.hash(password, 10);
      await client.query(
        "INSERT INTO usuarios (id, email, password, rol, nombre, telefono) VALUES ($1, $2, $3, $4, $5, $6)",
        [userId, email, hashed, "paciente", nombre, telefono || null]
      );
      console.log("[POST /api/pacientes] ✅ Usuario insertado");
    
    console.log("[POST /api/pacientes] Ejecutando INSERT en pacientes...");
    await client.query(
      "INSERT INTO pacientes (usuario_id, edad, direccion, sexo, fecha_nacimiento, tipo_sangre, alergias, contacto_emergencia, parentesco_emergencia, telefono_emergencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        userId,
        edad || null,
        direccion || null,
        sexo || null,
        fechaNacimiento || null,
        sangre || null,
        alergias || null,
        contactoEmergencia || null,
        parentescoEmergencia || null,
        telefonoEmergencia || null,
      ]
    );
    console.log("[POST /api/pacientes] ✅ Paciente insertado");
    
    console.log("[POST /api/pacientes] Ejecutando COMMIT...");
    await client.query("COMMIT");
    console.log("[POST /api/pacientes] ✅ Transacción completada");
    
    res.status(201).json({ id: userId, email, nombre, telefono, rol: "paciente" });
  } catch (error) {
    console.error("[POST /api/pacientes] Error SQL:", error.message);
    console.log("[POST /api/pacientes] Ejecutando ROLLBACK...");
    await client.query("ROLLBACK");
    sendError(res, error);
  } finally {
    client.release();
  }
});

app.patch("/api/pacientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      telefono,
      edad,
      direccion,
      sexo,
      fechaNacimiento,
      sangre,
      alergias,
      contactoEmergencia,
      parentescoEmergencia,
      telefonoEmergencia,
    } = req.body;

    await pool.query(
      "UPDATE usuarios SET nombre = COALESCE($1, nombre), telefono = COALESCE($2, telefono) WHERE id = $3",
      [nombre, telefono, id]
    );
    await pool.query(
      `UPDATE pacientes SET
         edad = COALESCE($1, edad),
         direccion = COALESCE($2, direccion),
         sexo = COALESCE($3, sexo),
         fecha_nacimiento = COALESCE($4, fecha_nacimiento),
         tipo_sangre = COALESCE($5, tipo_sangre),
         alergias = COALESCE($6, alergias),
         contacto_emergencia = COALESCE($7, contacto_emergencia),
         parentesco_emergencia = COALESCE($8, parentesco_emergencia),
         telefono_emergencia = COALESCE($9, telefono_emergencia)
       WHERE usuario_id = $10`,
      [
        edad || null,
        direccion || null,
        sexo || null,
        fechaNacimiento || null,
        sangre || null,
        alergias || null,
        contactoEmergencia || null,
        parentescoEmergencia || null,
        telefonoEmergencia || null,
        id,
      ]
    );

    const result = await pool.query(
      `SELECT u.id, u.email, u.rol, u.nombre, u.telefono, p.edad, p.direccion, p.sexo, p.fecha_nacimiento, p.tipo_sangre, p.alergias, p.contacto_emergencia, p.parentesco_emergencia, p.telefono_emergencia
       FROM usuarios u
       LEFT JOIN pacientes p ON p.usuario_id = u.id
       WHERE u.id = $1`,
      [id]
    );
    res.json(mapPacienteRow(result.rows[0]));
  } catch (error) {
    sendError(res, error);
  }
});

app.delete("/api/pacientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/medicos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.rol, u.nombre, u.telefono, m.especialidad, m.cedula, m.consultorio, m.horario, m.estado
       FROM usuarios u
       LEFT JOIN medicos m ON m.usuario_id = u.id
       WHERE u.rol = $1`,
      ["medico"]
    );
    res.json(result.rows.map(mapMedicoRow));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/medicos", async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, nombre, telefono, especialidad, cedula, consultorio, horario, estado } = req.body;
    if (!email || !password || !nombre || !especialidad) {
      return res.status(400).json({ error: "email, password, nombre and especialidad are required" });
    }
    // Verificar email existente
    const exists = await client.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "El correo ya pertenece a una cuenta activa en el sistema" });
    }
    await client.query("BEGIN");
    const userId = uuid();
    const hashed = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO usuarios (id, email, password, rol, nombre, telefono) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, email, hashed, "medico", nombre, telefono || null]
    );
    await client.query(
      "INSERT INTO medicos (usuario_id, especialidad, cedula, consultorio, horario, estado) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, especialidad, cedula || null, consultorio || null, horario || null, estado || "Activo"]
    );
    await client.query("COMMIT");
    res.status(201).json({ id: userId, email, nombre, telefono, rol: "medico", especialidad, cedula, consultorio, horario, estado });
  } catch (error) {
    await client.query("ROLLBACK");
    sendError(res, error);
  } finally {
    client.release();
  }
});

app.patch("/api/medicos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, especialidad, cedula, consultorio, horario, estado } = req.body;

    await pool.query("UPDATE usuarios SET nombre = COALESCE($1, nombre), telefono = COALESCE($2, telefono) WHERE id = $3", [nombre, telefono, id]);
    await pool.query(
      `UPDATE medicos SET
         especialidad = COALESCE($1, especialidad),
         cedula = COALESCE($2, cedula),
         consultorio = COALESCE($3, consultorio),
         horario = COALESCE($4, horario),
         estado = COALESCE($5, estado)
       WHERE usuario_id = $6`,
      [especialidad || null, cedula || null, consultorio || null, horario || null, estado || null, id]
    );

    const result = await pool.query(
      `SELECT u.id, u.email, u.rol, u.nombre, u.telefono, m.especialidad, m.cedula, m.consultorio, m.horario, m.estado
       FROM usuarios u
       LEFT JOIN medicos m ON m.usuario_id = u.id
       WHERE u.id = $1`,
      [id]
    );
    res.json(mapMedicoRow(result.rows[0]));
  } catch (error) {
    sendError(res, error);
  }
});

app.delete("/api/medicos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/administradores", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.rol, u.nombre, u.telefono, a.area, a.permisos
       FROM usuarios u
       LEFT JOIN administradores a ON a.usuario_id = u.id
       WHERE u.rol = $1`,
      ["admin"]
    );
    res.json(result.rows.map(mapAdminRow));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/administradores", async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, nombre, telefono, area, permisos } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: "email, password and nombre are required" });
    }
    // Verificar email existente
    const exists = await client.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "El correo ya pertenece a una cuenta activa en el sistema" });
    }
    await client.query("BEGIN");
    const userId = uuid();
    const hashed = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO usuarios (id, email, password, rol, nombre, telefono) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, email, hashed, "admin", nombre, telefono || null]
    );
    await client.query(
      "INSERT INTO administradores (usuario_id, area, permisos) VALUES ($1, $2, $3)",
      [userId, area || "Administración", permisos || "Médicos, citas y avisos"]
    );
    await client.query("COMMIT");
    res.status(201).json({ id: userId, email, nombre, telefono, rol: "admin", area, permisos });
  } catch (error) {
    await client.query("ROLLBACK");
    sendError(res, error);
  } finally {
    client.release();
  }
});

app.get("/api/citas", async (req, res) => {
  try {
    console.log("[GET /api/citas] Recuperando todas las citas...");
    const result = await pool.query("SELECT * FROM citas ORDER BY fecha DESC, hora DESC");
    console.log(`[GET /api/citas] ✅ ${result.rows.length} citas encontradas en BD`);
    res.json(result.rows.map(mapCitaRow));
  } catch (error) {
    console.error("[GET /api/citas] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.post("/api/citas", async (req, res) => {
  try {
    const { pacienteId, pacienteNombre, medicoId, medicoNombre, especialidad, fecha, hora, motivo, estado } = req.body;
    console.log(`[POST /api/citas] Recibido - paciente: ${pacienteNombre}, fecha: ${fecha}, hora: ${hora}`);
    
    const citaId = uuid();
    console.log(`[POST /api/citas] Generado citaId: ${citaId}`);
    console.log("[POST /api/citas] Ejecutando INSERT en citas...");
    
    await pool.query(
      `INSERT INTO citas (id, paciente_id, medico_id, paciente_nombre, medico_nombre, especialidad, fecha, hora, motivo, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [citaId, pacienteId || null, medicoId || null, pacienteNombre || null, medicoNombre || null, especialidad || null, fecha || null, hora || null, motivo || null, estado || "Pendiente"]
    );
    console.log("[POST /api/citas] ✅ Cita insertada en tabla citas");
    
    const result = await pool.query("SELECT * FROM citas WHERE id = $1", [citaId]);
    console.log("[POST /api/citas] ✅ Cita recuperada de BD");
    res.status(201).json(mapCitaRow(result.rows[0]));
  } catch (error) {
    console.error("[POST /api/citas] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.patch("/api/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pacienteId, pacienteNombre, medicoId, medicoNombre, especialidad, fecha, hora, motivo, estado } = req.body;
    await pool.query(
      `UPDATE citas SET
         paciente_id = COALESCE($1, paciente_id),
         paciente_nombre = COALESCE($2, paciente_nombre),
         medico_id = COALESCE($3, medico_id),
         medico_nombre = COALESCE($4, medico_nombre),
         especialidad = COALESCE($5, especialidad),
         fecha = COALESCE($6, fecha),
         hora = COALESCE($7, hora),
         motivo = COALESCE($8, motivo),
         estado = COALESCE($9, estado)
       WHERE id = $10`,
      [pacienteId || null, pacienteNombre || null, medicoId || null, medicoNombre || null, especialidad || null, fecha || null, hora || null, motivo || null, estado || null, id]
    );
    const result = await pool.query("SELECT * FROM citas WHERE id = $1", [id]);
    res.json(mapCitaRow(result.rows[0]));
  } catch (error) {
    sendError(res, error);
  }
});

app.delete("/api/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM citas WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/historial", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM historial_medico ORDER BY fecha DESC");
    res.json(result.rows.map(mapHistorialRow));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/historial", async (req, res) => {
  try {
    const { pacienteId, medicoId, citaId, diagnostico, tratamiento, notas, fecha } = req.body;
    console.log(`[POST /api/historial] Recibido - pacienteId: ${pacienteId}, diagnostico: ${diagnostico}`);
    
    const historialId = uuid();
    console.log(`[POST /api/historial] Generado historialId: ${historialId}`);
    console.log("[POST /api/historial] Ejecutando INSERT en historial_medico...");
    
    await pool.query(
      `INSERT INTO historial_medico (id, paciente_id, medico_id, cita_id, diagnostico, tratamiento, notas, fecha)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [historialId, pacienteId, medicoId || null, citaId || null, diagnostico || null, tratamiento || null, notas || null, fecha || null]
    );
    console.log("[POST /api/historial] ✅ Historial insertado en tabla historial_medico");
    
    const result = await pool.query("SELECT * FROM historial_medico WHERE id = $1", [historialId]);
    res.status(201).json(mapHistorialRow(result.rows[0]));
  } catch (error) {
    console.error("[POST /api/historial] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.get("/api/recetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recetas ORDER BY fecha DESC");
    res.json(result.rows.map(mapRecetaRow));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/recetas", async (req, res) => {
  try {
    const { pacienteId, medicoId, medicamentos, indicaciones, fotoUri, fecha } = req.body;
    console.log(`[POST /api/recetas] Recibido - pacienteId: ${pacienteId}, medicamentos: ${medicamentos}`);
    
    const recetaId = uuid();
    console.log(`[POST /api/recetas] Generado recetaId: ${recetaId}`);
    console.log("[POST /api/recetas] Ejecutando INSERT en recetas...");
    
    await pool.query(
      `INSERT INTO recetas (id, paciente_id, medico_id, medicamentos, indicaciones, foto_uri, fecha)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [recetaId, pacienteId, medicoId || null, medicamentos || null, indicaciones || null, fotoUri || null, fecha || null]
    );
    console.log("[POST /api/recetas] ✅ Receta insertada en tabla recetas");
    
    const result = await pool.query("SELECT * FROM recetas WHERE id = $1", [recetaId]);
    res.status(201).json(mapRecetaRow(result.rows[0]));
  } catch (error) {
    console.error("[POST /api/recetas] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.delete("/api/recetas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM recetas WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/notificaciones", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notificaciones ORDER BY fecha DESC");
    res.json(result.rows.map(mapNotificacionRow));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/notificaciones", async (req, res) => {
  try {
    const { usuarioId, titulo, mensaje, tipo, leida } = req.body;
    console.log(`[POST /api/notificaciones] Recibido - usuarioId: ${usuarioId}, titulo: ${titulo}`);
    
    const id = uuid();
    console.log(`[POST /api/notificaciones] Generado notificaciónId: ${id}`);
    console.log("[POST /api/notificaciones] Ejecutando INSERT en notificaciones...");
    
    await pool.query(
      `INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, tipo, leida)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, usuarioId || null, titulo || "Aviso", mensaje || null, tipo || null, leida || false]
    );
    console.log("[POST /api/notificaciones] ✅ Notificación insertada en tabla notificaciones");
    
    const result = await pool.query("SELECT * FROM notificaciones WHERE id = $1", [id]);
    res.status(201).json(mapNotificacionRow(result.rows[0]));
  } catch (error) {
    console.error("[POST /api/notificaciones] Error SQL:", error.message);
    sendError(res, error);
  }
});

app.delete("/api/notificaciones/today", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (userId) {
      await pool.query("DELETE FROM notificaciones WHERE usuario_id = $1", [userId]);
    } else {
      await pool.query("DELETE FROM notificaciones");
    }
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

async function startServer() {
  try {
    console.log("🔌 Verificando conexión a PostgreSQL...");
    await pool.query("SELECT 1");

    const server = app.listen(port, () => {
      console.log(`\n✅ Backend iniciado en http://localhost:${port}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME || "utopia_clinica"}`);
      console.log(`👤 Usuario BD: ${process.env.DB_USER || "utopia_user"}`);
      console.log(`🔌 Conexión PostgreSQL activa`);
      console.log(`📝 Todos los logs de SQL estarán disponibles aquí\n`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ El puerto ${port} ya está en uso. Detén el servidor que ocupa el puerto o cambia PORT en backend/.env.`);
      } else {
        console.error("❌ Error al iniciar el servidor:", error.message || error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a PostgreSQL:", error.message || error);
    process.exit(1);
  }
}

startServer();
