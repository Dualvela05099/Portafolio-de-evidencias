# Backend Utopia Clínica

Este backend expone una API REST que conecta la app Expo con PostgreSQL usando el esquema `database/postgres/utopia_schema.sql`.

## Setup

1. Copia el archivo de ejemplo:

```bash
cd backend
copy .env.example .env
```

2. Ajusta las variables en `.env`:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `SESSION_SECRET`

3. Instala dependencias:

```bash
npm install
```

4. Crea la base de datos y ejecuta el script SQL:

```bash
psql -U postgres -d utopia_clinica -f ../database/postgres/utopia_schema.sql
```

5. Inicia el servidor:

```bash
npm start
```

## Endpoints principales

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/session`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `GET /api/pacientes`
- `GET /api/medicos`
- `GET /api/administradores`
- `GET /api/citas`
- `GET /api/historial`
- `GET /api/recetas`
- `GET /api/notificaciones`

## Notas

- El backend usa `express-session` para mantener una sesión basada en cookies.
- La app Expo debe habilitar `USE_REMOTE_API` y apuntar a `http://localhost:3000/api`.
