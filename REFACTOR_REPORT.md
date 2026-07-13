# REFACTOR_REPORT.md — Migración UTOPIA a MVVM

## Resumen

El proyecto **Utopia Clínica Médica** fue refactorizado de una arquitectura monolítica (pantallas con lógica + `utils/database.js`) a **MVVM + Clean Architecture**, manteniendo la misma interfaz, navegación, rutas Expo Router y comportamiento funcional.

---

## Arquitectura anterior

```
app/                    → Pantallas con lógica mezclada (API, validaciones, sensores)
components/             → UI compartida + EditableProfile con lógica de persistencia
utils/database.js       → Monolito AsyncStorage (auth, CRUD, seed, sesión)
```

**Problemas detectados:**
- Lógica de negocio dentro de pantallas (`index.tsx`, `mis-citas.tsx`, `scanner.tsx`, etc.)
- Duplicación del escáner entre paciente y médico (~330 líneas idénticas)
- Duplicación de inputs de formulario en registro
- Sin separación API / sensores
- JavaScript sin tipos en la capa de datos
- Sin preparación para backend REST

---

## Arquitectura nueva

```
app/                          → Vistas (solo UI + ViewModels)
components/
  common/                     → LogoutButton, EditableProfile, ScannerView
  ui/                         → Card, AppLogo
  forms/                      → FormInput
  theme.ts                    → Re-export de constants/theme
constants/
  api.ts                      → Config REST (USE_REMOTE_API=false)
  storageKeys.ts              → Claves AsyncStorage
  theme.ts                    → Paleta de colores
contexts/
  AuthContext.tsx             → Sesión global + seed inicial
hooks/
  useAuth.ts                  → Re-export AuthContext
  useAppointments.ts          → Citas paciente/admin
  useBiometric.ts             → Huella digital
  useCamera.ts                → Cámara y códigos
  useGyroscope.ts             → Giroscopio + sensor de luz
  useGPS.ts                   → GPS (preparado)
models/                       → Paciente, Medico, Administrador, Usuario, Cita, Historial, Notificacion
services/
  api/                        → Auth, Paciente, Medico, Administrador, Cita, Historial, Notification + client REST
  sensors/                    → Biometric, Camera, Gyroscope, GPS
types/                        → Tipos TypeScript centralizados
utils/                        → storage, id, normalize, database.ts (compatibilidad)
viewmodels/                   → Lógica de pantallas (hooks MVVM)
```

### Flujo MVVM

```
Vista (app/*.tsx)
    ↓ eventos / estado
ViewModel (viewmodels/use*ViewModel.ts)
    ↓
Hooks reutilizables (hooks/*)
    ↓
Services (services/api/*, services/sensors/*)
    ↓
LocalRepository / AsyncStorage  —  o  —  ApiClient REST (futuro)
```

---

## Rutas Expo Router (sin cambios)

| Ruta | Pantalla |
|------|----------|
| `/` | Login |
| `/register` | Registro paso 1 |
| `/registro-datos` | Registro paso 2 |
| `/registro-emergencia` | Registro paso 3 |
| `/confirmacion` | Confirmación cita |
| `/detalles-cita` | Detalle de cita |
| `/paciente/*` | Tabs paciente |
| `/medico/*` | Tabs médico |
| `/admin/*` | Tabs administrador |

> **Decisión:** Se mantuvo la estructura `app/paciente`, `app/medico`, `app/admin` en lugar de grupos `(auth)/(paciente)` para **no alterar URLs ni navegación**, cumpliendo la restricción de UX.

---

## Archivos modificados

### Nuevos (capa de dominio y servicios)
- `types/index.ts`
- `constants/storageKeys.ts`, `constants/api.ts`, `constants/theme.ts`
- `models/*.ts` (7 modelos)
- `utils/storage.ts`, `utils/id.ts`, `utils/normalize.ts`, `utils/database.ts`
- `services/api/*.ts` (8 servicios + localRepository + client)
- `services/sensors/*.ts` (4 servicios)
- `contexts/AuthContext.tsx`
- `hooks/*.ts` (6 hooks)
- `viewmodels/*.ts` (12 viewmodels)
- `components/common/*`, `components/ui/*`, `components/forms/*`

### Pantallas refactorizadas
- `app/_layout.tsx` — AuthProvider
- `app/index.tsx`, `register.tsx`, `registro-datos.tsx`, `registro-emergencia.tsx`
- `app/paciente/mis-citas.tsx`, `agendar-cita.tsx`, `avisos.tsx`, `scanner.tsx`, `perfil.tsx`
- `app/medico/scanner.tsx`, `perfil.tsx`
- `app/admin/admin-medicos.tsx`, `admin-citas.tsx`, `avisos.tsx`, `perfil.tsx`

### Eliminados
- `utils/database.js` — reemplazado por servicios tipados

### Re-exports de compatibilidad
- `components/Card.tsx`, `AppLogo.tsx`, `LogoutButton.tsx`, `EditableProfile.tsx`
- `components/theme.ts` → `@/constants/theme`
- `utils/database.ts` — funciones legacy delegando a servicios

---

## Decisiones de arquitectura

| Decisión | Motivo |
|----------|--------|
| ViewModels como hooks React | Patrón MVVM idiomático en React Native |
| `LocalDataRepository` central | Un solo punto AsyncStorage; fácil swap a REST |
| `API_CONFIG.USE_REMOTE_API = false` | Backend no implementado; estructura lista |
| `AuthContext` con seed en mount | Evita `useEffect` duplicado en login |
| `ScannerView` compartido | Elimina ~330 líneas duplicadas paciente/médico |
| `FormInput` compartido | DRY en flujo de registro |
| `GPSService` stub | Preparado para `expo-location`; no existía UI previa |
| Historial ↔ Recetas | `HistorialService` gestiona ambos (recetas ya en DB local) |

---

## Sensores

| Sensor | Servicio | Hook | Estado |
|--------|----------|------|--------|
| Biometría | `BiometricService` | `useBiometric` | ✅ Login con huella |
| Cámara | `CameraService` | `useCamera` | ✅ Escáner recetas |
| Giroscopio + Luz | `GyroscopeService` | `useGyroscope` | ✅ Escáner recetas |
| GPS | `GPSService` | `useGPS` | ⚙️ Preparado (sin UI previa) |

---

## Preparación backend REST

En `constants/api.ts`:

```typescript
USE_REMOTE_API: false  // Cambiar a true cuando Express+MySQL esté listo
BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api"
```

Cada servicio en `services/api/` ya tiene ramas `if (API_CONFIG.USE_REMOTE_API)` que llaman a `apiClient`.

---

## Mejoras realizadas

1. **Separación de responsabilidades** — pantallas solo renderizan
2. **TypeScript estricto** en toda la capa de datos
3. **SOLID / DRY** — servicios únicos, escáner unificado
4. **Testabilidad** — ViewModels y servicios aislados
5. **Código muerto eliminado** — `database.js`, lógica duplicada de escáner
6. **Compatibilidad** — re-exports para imports legacy de componentes

---

## Verificaciones ejecutadas

| Verificación | Resultado |
|--------------|-----------|
| `npx tsc --noEmit` | ✅ Sin errores |
| Imports rotos | ✅ Corregidos |
| Rutas Expo Router | ✅ Sin cambios de URL |
| Navegación tabs | ✅ Layouts intactos |

---

## Cómo ejecutar

```bash
npm install
npx expo start
```

Usuarios de prueba sin cambios:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Paciente | paciente@gmail.com | 123456 |
| Doctor | doctor@gmail.com | 123456 |
| Admin | admin@gmail.com | 123456 |

---

## Próximos pasos sugeridos (fuera de alcance)

1. Activar `USE_REMOTE_API` e implementar Express + MySQL
2. Instalar `expo-location` y conectar `GPSService`
3. Migrar pantallas estáticas (`agenda.tsx`, `detalles-cita.tsx`) a ViewModels con datos reales
4. Agrupar rutas en `(auth)`, `(paciente)` si se desea organización visual sin cambiar URLs

---

*Refactorización completada: junio 2026*
