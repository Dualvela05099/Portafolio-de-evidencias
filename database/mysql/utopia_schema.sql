-- =============================================================================
-- UTOPIA Clínica Médica — Esquema MySQL (XAMPP)
-- =============================================================================
-- Uso en XAMPP:
--   1. Iniciar Apache y MySQL desde el panel de XAMPP
--   2. Abrir phpMyAdmin: http://localhost/phpmyadmin
--   3. Pestaña "Importar" → seleccionar este archivo
--      — o —
--   Desde consola (ruta típica XAMPP en Windows):
--   "C:\xampp\mysql\bin\mysql.exe" -u root -p < database\mysql\utopia_schema.sql
--
-- Usuario por defecto XAMPP: root (sin contraseña)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS utopia_clinica
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE utopia_clinica;

DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS recetas;
DROP TABLE IF EXISTS historial_medico;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS administradores;
DROP TABLE IF EXISTS medicos;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS usuarios;

-- ---------------------------------------------------------------------------
-- Usuarios (autenticación central)
-- ---------------------------------------------------------------------------
CREATE TABLE usuarios (
    id              VARCHAR(64)     NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    rol             ENUM('paciente', 'medico', 'admin') NOT NULL,
    nombre          VARCHAR(255)    NOT NULL,
    telefono        VARCHAR(50)     DEFAULT NULL,
    creado_en       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_email (email),
    KEY idx_usuarios_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Pacientes
-- ---------------------------------------------------------------------------
CREATE TABLE pacientes (
    usuario_id              VARCHAR(64)     NOT NULL,
    edad                    VARCHAR(10)     DEFAULT NULL,
    direccion               VARCHAR(500)    DEFAULT NULL,
    sexo                    VARCHAR(20)     DEFAULT NULL,
    fecha_nacimiento        DATE            DEFAULT NULL,
    tipo_sangre             VARCHAR(10)     DEFAULT NULL,
    alergias                TEXT            DEFAULT NULL,
    contacto_emergencia     VARCHAR(255)    DEFAULT NULL,
    parentesco_emergencia   VARCHAR(100)    DEFAULT NULL,
    telefono_emergencia     VARCHAR(50)     DEFAULT NULL,
    PRIMARY KEY (usuario_id),
    CONSTRAINT fk_pacientes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Médicos
-- ---------------------------------------------------------------------------
CREATE TABLE medicos (
    usuario_id      VARCHAR(64)     NOT NULL,
    especialidad    VARCHAR(150)    NOT NULL,
    cedula          VARCHAR(100)    DEFAULT NULL,
    consultorio     VARCHAR(255)    DEFAULT NULL,
    horario         VARCHAR(255)    DEFAULT NULL,
    estado          VARCHAR(50)     NOT NULL DEFAULT 'Activo',
    PRIMARY KEY (usuario_id),
    UNIQUE KEY uk_medicos_cedula (cedula),
    KEY idx_medicos_especialidad (especialidad),
    KEY idx_medicos_estado (estado),
    CONSTRAINT fk_medicos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------
CREATE TABLE administradores (
    usuario_id  VARCHAR(64)     NOT NULL,
    area        VARCHAR(150)    NOT NULL DEFAULT 'Administración',
    permisos    TEXT            NOT NULL,
    PRIMARY KEY (usuario_id),
    CONSTRAINT fk_administradores_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Citas
-- ---------------------------------------------------------------------------
CREATE TABLE citas (
    id                  VARCHAR(64)     NOT NULL,
    paciente_id         VARCHAR(64)     DEFAULT NULL,
    medico_id           VARCHAR(64)     DEFAULT NULL,
    paciente_nombre     VARCHAR(255)    DEFAULT NULL,
    medico_nombre       VARCHAR(255)    DEFAULT NULL,
    especialidad        VARCHAR(150)    DEFAULT NULL,
    fecha               DATE            DEFAULT NULL,
    hora                TIME            DEFAULT NULL,
    motivo              TEXT            DEFAULT NULL,
    estado              ENUM('Pendiente', 'Completada', 'Cancelada', 'En curso', 'En sala de espera')
                        NOT NULL DEFAULT 'Pendiente',
    creado_en           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_citas_paciente (paciente_id),
    KEY idx_citas_medico (medico_id),
    KEY idx_citas_estado (estado),
    KEY idx_citas_fecha (fecha),
    CONSTRAINT fk_citas_paciente
        FOREIGN KEY (paciente_id) REFERENCES usuarios (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_citas_medico
        FOREIGN KEY (medico_id) REFERENCES usuarios (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Historial médico
-- ---------------------------------------------------------------------------
CREATE TABLE historial_medico (
    id              VARCHAR(64)     NOT NULL,
    paciente_id     VARCHAR(64)     NOT NULL,
    medico_id       VARCHAR(64)     DEFAULT NULL,
    cita_id         VARCHAR(64)     DEFAULT NULL,
    diagnostico     TEXT            DEFAULT NULL,
    tratamiento     TEXT            DEFAULT NULL,
    notas           TEXT            DEFAULT NULL,
    fecha           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creado_en       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_historial_paciente (paciente_id),
    CONSTRAINT fk_historial_paciente
        FOREIGN KEY (paciente_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_historial_medico
        FOREIGN KEY (medico_id) REFERENCES usuarios (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_historial_cita
        FOREIGN KEY (cita_id) REFERENCES citas (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Recetas
-- ---------------------------------------------------------------------------
CREATE TABLE recetas (
    id              VARCHAR(64)     NOT NULL,
    paciente_id     VARCHAR(64)     NOT NULL,
    medico_id       VARCHAR(64)     DEFAULT NULL,
    medicamentos    TEXT            DEFAULT NULL,
    indicaciones    TEXT            DEFAULT NULL,
    foto_uri        TEXT            DEFAULT NULL,
    fecha           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creado_en       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_recetas_paciente (paciente_id),
    CONSTRAINT fk_recetas_paciente
        FOREIGN KEY (paciente_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_recetas_medico
        FOREIGN KEY (medico_id) REFERENCES usuarios (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Notificaciones / Avisos
-- ---------------------------------------------------------------------------
CREATE TABLE notificaciones (
    id              VARCHAR(64)     NOT NULL,
    usuario_id      VARCHAR(64)     DEFAULT NULL,
    titulo          VARCHAR(255)    NOT NULL,
    mensaje         TEXT            DEFAULT NULL,
    tipo            VARCHAR(100)    DEFAULT NULL,
    leida           TINYINT(1)      NOT NULL DEFAULT 0,
    fecha           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creado_en       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_notificaciones_usuario (usuario_id),
    KEY idx_notificaciones_leida (leida),
    CONSTRAINT fk_notificaciones_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

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
    ('cita-demo-001', 'paciente-demo', 'medico-demo', 'Paciente Utopía', 'Dr. Juan Pérez', 'Cardiología', '2026-06-10', '10:00:00', 'Consulta general', 'Pendiente');

INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, tipo, leida) VALUES
    ('notif-001', 'paciente-demo', 'Cita Confirmada', 'Tu cita fue registrada correctamente', 'cita', 0),
    ('notif-002', 'paciente-demo', 'Recordatorio', 'Tienes una cita próxima', 'recordatorio', 0),
    ('notif-003', 'paciente-demo', 'Cita Modificada', 'Hace 1 hora', 'cita', 0);

-- Verificación rápida
-- SELECT u.email, u.rol, u.nombre FROM usuarios u ORDER BY u.rol;
