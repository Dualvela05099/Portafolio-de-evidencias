# Utopia Clínica Médica 

App mobile con Expo Router y React Native. Base de datos local con AsyncStorage.

## Estructura del proyecto

```
app/
├── index.tsx                 # Login
├── register.tsx              # Registro paso 1
├── registro-datos.tsx        # Registro paso 2
├── registro-emergencia.tsx   # Registro paso 3
├── confirmacion.tsx          # Confirmación
├── detalles-cita.tsx         # Detalle de cita
│
├── admin/                    ←  Arlette
│   ├── index.tsx
│   ├── admin-medicos.tsx
│   ├── admin-citas.tsx
│   ├── avisos.tsx
│   └── perfil.tsx
│
├── medico/                   ← Ihan
│   ├── index.tsx
│   ├── agenda.tsx
│   ├── pacientes.tsx
│   ├── scanner.tsx
│   └── perfil.tsx
│
└── paciente/                 ← Adan & Osbaldo
    ├── index.tsx
    ├── agenda.tsx
    ├── agendar-cita.tsx
    ├── avisos.tsx
    ├── citas.tsx
    ├── mis-citas.tsx
    ├── scanner.tsx
    └── perfil.tsx

components/                   # Compartidos — coordinar cambios
utils/
└── database.js               # Compartido — coordinar cambios
```

## División de trabajo

| Persona | Carpeta | Descripción |
|---|---|---|
| **Arlette** | `app/admin/` | Todas las pantallas del administrador |
| **Ihan** | `app/medico/` | Todas las pantallas del médico |
| **Adan & Osbaldo** | `app/paciente/` | Todas las pantallas del paciente |

> Las pantallas de autenticación (`app/index.tsx`, `app/register.tsx`, etc.) y los archivos de `components/` y `utils/` son **compartidos**. Avisar al equipo antes de modificarlos.

## Instalar y correr

```bash
npm install
npx expo start
```

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Paciente | paciente@gmail.com | 123456 |
| Doctor | doctor@gmail.com | 123456 |
| Admin | admin@gmail.com | 123456 |
