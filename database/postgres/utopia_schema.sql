-- =============================================================================
-- UTOPIA Clínica Médica — Esquema PostgreSQL
-- =============================================================================
-- Uso:
--   psql -U postgres -f database/postgres/utopia_schema.sql
--   -- o dentro de psql:
--   \i database/postgres/utopia_schema.sql
-- =============================================================================

BEGIN;

-- Base de datos (opcional; ejecutar conectado a postgres)
-- CREATE DATABASE utopia_clinica ENCODING 'UTF8';
-- \c utopia_clinica

DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS recetas CASCADE;
DROP TABLE IF EXISTS historial_medico CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS administradores CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TYPE rol_usuario AS ENUM ('paciente', 'medico', 'admin');
CREATE TYPE estado_cita AS ENUM ('Pendiente', 'Completada', 'Cancelada', 'En curso', 'En sala de espera');

-- ---------------------------------------------------------------------------
-- Usuarios (autenticación central)
-- ---------------------------------------------------------------------------
CREATE TABLE usuarios (
    id              VARCHAR(64)     PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    rol             rol_usuario     NOT NULL,
    nombre          VARCHAR(255)    NOT NULL,
    telefono        VARCHAR(50),
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_rol ON usuarios (rol);
CREATE INDEX idx_usuarios_email ON usuarios (email);

-- ---------------------------------------------------------------------------
-- Pacientes
-- ---------------------------------------------------------------------------
CREATE TABLE pacientes (
    usuario_id              VARCHAR(64)     PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    edad                    VARCHAR(10),
    direccion               VARCHAR(500),
    sexo                    VARCHAR(20),
    fecha_nacimiento        DATE,
    tipo_sangre             VARCHAR(10),
    alergias                TEXT,
    contacto_emergencia     VARCHAR(255),
    parentesco_emergencia   VARCHAR(100),
    telefono_emergencia     VARCHAR(50)
);

-- ---------------------------------------------------------------------------
-- Médicos
-- ---------------------------------------------------------------------------
CREATE TABLE medicos (
    usuario_id      VARCHAR(64)     PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    especialidad    VARCHAR(150)    NOT NULL,
    cedula          VARCHAR(100)    UNIQUE,
    consultorio     VARCHAR(255),
    horario         VARCHAR(255),
    estado          VARCHAR(50)     NOT NULL DEFAULT 'Activo'
);

CREATE INDEX idx_medicos_especialidad ON medicos (especialidad);
CREATE INDEX idx_medicos_estado ON medicos (estado);

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------
CREATE TABLE administradores (
    usuario_id  VARCHAR(64)     PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    area        VARCHAR(150)    NOT NULL DEFAULT 'Administración',
    permisos    TEXT            NOT NULL DEFAULT 'Médicos, citas y avisos'
);

-- ---------------------------------------------------------------------------
-- Citas
-- ---------------------------------------------------------------------------
CREATE TABLE citas (
    id                  VARCHAR(64)     PRIMARY KEY,
    paciente_id         VARCHAR(64)     REFERENCES usuarios(id) ON DELETE SET NULL,
    medico_id           VARCHAR(64)     REFERENCES usuarios(id) ON DELETE SET NULL,
    paciente_nombre     VARCHAR(255),
    medico_nombre       VARCHAR(255),
    especialidad        VARCHAR(150),
    fecha               DATE,
    hora                TIME,
    motivo              TEXT,
    estado              estado_cita     NOT NULL DEFAULT 'Pendiente',
    creado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citas_paciente ON citas (paciente_id);
CREATE INDEX idx_citas_medico ON citas (medico_id);
CREATE INDEX idx_citas_estado ON citas (estado);
CREATE INDEX idx_citas_fecha ON citas (fecha);

-- ---------------------------------------------------------------------------
-- Historial médico
-- ---------------------------------------------------------------------------
CREATE TABLE historial_medico (
    id              VARCHAR(64)     PRIMARY KEY,
    paciente_id     VARCHAR(64)     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico_id       VARCHAR(64)     REFERENCES usuarios(id) ON DELETE SET NULL,
    cita_id         VARCHAR(64)     REFERENCES citas(id) ON DELETE SET NULL,
    diagnostico     TEXT,
    tratamiento     TEXT,
    notas           TEXT,
    fecha           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historial_paciente ON historial_medico (paciente_id);

-- ---------------------------------------------------------------------------
-- Recetas
-- ---------------------------------------------------------------------------
CREATE TABLE recetas (
    id              VARCHAR(64)     PRIMARY KEY,
    paciente_id     VARCHAR(64)     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico_id       VARCHAR(64)     REFERENCES usuarios(id) ON DELETE SET NULL,
    medicamentos    TEXT,
    indicaciones    TEXT,
    foto_uri        TEXT,
    fecha           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recetas_paciente ON recetas (paciente_id);

-- ---------------------------------------------------------------------------
-- Notificaciones / Avisos
-- ---------------------------------------------------------------------------
CREATE TABLE notificaciones (
    id              VARCHAR(64)     PRIMARY KEY,
    usuario_id      VARCHAR(64)     REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo          VARCHAR(255)    NOT NULL,
    mensaje         TEXT,
    tipo            VARCHAR(100),
    leida           BOOLEAN         NOT NULL DEFAULT FALSE,
    fecha           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_usuario ON notificaciones (usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones (leida);

-- ---------------------------------------------------------------------------
-- Trigger: actualizar actualizado_en
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_actualizado
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

CREATE TRIGGER trg_citas_actualizado
    BEFORE UPDATE ON citas
    FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

-- ---------------------------------------------------------------------------
-- Datos de prueba (mismos que la app móvil)
-- ---------------------------------------------------------------------------
INSERT INTO usuarios (id, email, password, rol, nombre, telefono) VALUES
    ('paciente-demo', 'paciente@gmail.com', '123456', 'paciente', 'Paciente Utopía', '55 1234 5678'),
    ('medico-demo',   'doctor@gmail.com',   '123456', 'medico',   'Dr. Juan Pérez',  '55 2468 1357'),
    ('admin-demo',    'admin@gmail.com',    '123456', 'admin',    'Administrador Utopía', '55 9876 5432');

INSERT INTO pacientes (usuario_id, edad, direccion, tipo_sangre, alergias, contacto_emergencia, telefono_emergencia) VALUES
    ('paciente-demo', '25', 'Ciudad de México', 'O+', 'Ninguna registrada', 'Familiar', '55 8765 4321');

INSERT INTO medicos (usuario_id, especialidad, cedula, consultorio, estado) VALUES
    ('medico-demo', 'Cardiólogo', 'MED-UTOPIA-2026', 'Consultorio 3 · Planta alta', 'Activo');

INSERT INTO administradores (usuario_id, area, permisos) VALUES
    ('admin-demo', 'Admin', 'Médicos, citas y avisos');

INSERT INTO citas (id, paciente_id, medico_id, paciente_nombre, medico_nombre, especialidad, fecha, hora, motivo, estado) VALUES
    ('cita-demo-001', 'paciente-demo', 'medico-demo', 'Paciente Utopía', 'Dr. Juan Pérez', 'Cardiología', '2026-06-10', '10:00', 'Consulta general', 'Pendiente');

INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, tipo, leida) VALUES
    ('notif-001', 'paciente-demo', 'Cita Confirmada', 'Tu cita fue registrada correctamente', 'cita', FALSE),
    ('notif-002', 'paciente-demo', 'Recordatorio', 'Tienes una cita próxima', 'recordatorio', FALSE),
    ('notif-003', 'paciente-demo', 'Cita Modificada', 'Hace 1 hora', 'cita', FALSE);

COMMIT;

-- Verificación rápida
-- SELECT u.email, u.rol, u.nombre FROM usuarios u ORDER BY u.rol;
