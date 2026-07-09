# 🧪 GUÍA DE VERIFICACIÓN - Integración PostgreSQL

## Objetivo
Verificar que la aplicación está usando PostgreSQL exclusivamente y que NO hay datos simulados o en memoria.

---

## ✅ PASO 1: Verificar Backend Ejecutándose

### En terminal:
```bash
cd backend
npm start
```

### Esperado en consola:
```
✅ Backend iniciado en http://localhost:3000
📊 Base de datos: utopia_clinica
👤 Usuario BD: utopia_user
🔌 Conexión PostgreSQL activa
📝 Todos los logs de SQL estarán disponibles aquí
```

**Si ves esto**: ✅ Backend funciona

---

## ✅ PASO 2: Test directo de API - Crear usuario

### En otra terminal:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "nombre": "Test Usuario",
    "telefono": "555-1234",
    "rol": "paciente",
    "edad": "30",
    "direccion": "Calle Test 123"
  }'
```

### Esperado en respuesta:
```json
{
  "id": "some-uuid-here",
  "email": "test@example.com",
  "rol": "paciente",
  "nombre": "Test Usuario",
  "telefono": "555-1234"
}
```

### Esperado en consola del backend:
```
[REGISTER] Recibido - email: test@example.com, nombre: Test Usuario, rol: paciente
[REGISTER] Iniciando transacción...
[REGISTER] Generado userId: some-uuid-here
[REGISTER] Ejecutando INSERT en usuarios...
[REGISTER] ✅ Usuario insertado en tabla usuarios
[REGISTER] Ejecutando INSERT en pacientes...
[REGISTER] ✅ Paciente insertado en tabla pacientes
[REGISTER] Ejecutando COMMIT...
[REGISTER] ✅ Transacción completada
```

**Si ves esto**: ✅ Backend inserta datos en PostgreSQL

---

## ✅ PASO 3: Verificar en PostgreSQL

### Conectarse a BD:
```bash
psql -U utopia_user -d utopia_clinica -h localhost
```

### Ejecutar queries:
```sql
-- Ver todos los usuarios
SELECT id, email, nombre, rol FROM usuarios ORDER BY creado_en DESC LIMIT 5;

-- Ver pacientes específico
SELECT * FROM usuarios u 
LEFT JOIN pacientes p ON p.usuario_id = u.id 
WHERE u.email = 'test@example.com';

-- Contar total de usuarios
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Ver citas creadas
SELECT id, paciente_nombre, medicoNombre, fecha, hora FROM citas ORDER BY creado_en DESC LIMIT 5;
```

### Esperado:
- El usuario debe aparecer en tabla `usuarios`
- Debe tener entrada en tabla `pacientes` (si rol=paciente)
- Datos deben coincidir exactamente con lo enviado

**Si ves los datos aquí**: ✅ PostgreSQL funciona

---

## ✅ PASO 4: Verificar Frontend Usa API Remota

### En consola del frontend (Expo):
Cuando registres un usuario desde la app, deberías ver logs como:

```
[API_CONFIG] ✅ API REMOTA HABILITADA - Base URL: http://localhost:3000/api
[AuthService.saveRegistroTemporal] Guardando datos temporales
[PacienteService.save] USE_REMOTE_API=true, email=test@gmail.com
[PacienteService.save] ✅ POST /pacientes al backend
[ApiClient] POST http://localhost:3000/api/pacientes {...}
[ApiClient] ✅ 201 - POST /pacientes
```

**NO deberías ver**:
```
⚠️ USANDO DATOS LOCALES (API_CONFIG.USE_REMOTE_API=false)
⚠️ Guardando en storage local
❌ API LOCAL HABILITADA (DESARROLLO)
```

Si ves advertencias de "storage local", significa que USE_REMOTE_API=false.

---

## 🔍 CHECKLIST DE VERIFICACIÓN

### Backend:
- [ ] Servidor inicia sin errores
- [ ] Se conecta a PostgreSQL sin problemas
- [ ] Logs muestran operaciones SQL

### API REST:
- [ ] POST /api/auth/register funciona
- [ ] GET /api/pacientes funciona
- [ ] POST /api/citas funciona
- [ ] Otros endpoints responden

### PostgreSQL:
- [ ] Usuarios se guardan en tabla `usuarios`
- [ ] Pacientes se guardan en tabla `pacientes`
- [ ] Citas se guardan en tabla `citas`
- [ ] Datos NO desaparecen al reiniciar

### Frontend:
- [ ] Logs muestran "[API_CONFIG] ✅ API REMOTA HABILITADA"
- [ ] Logs muestran "POST http://localhost:3000/api/..."
- [ ] NO hay advertencias de "storage local"

---

## 🚨 TROUBLESHOOTING

### Error: "Conexión rechazada" en http://localhost:3000

**Causa**: Backend no está corriendo
**Solución**:
```bash
cd backend
npm start
```

---

### Error: "psql: error: conexión rechazada" a PostgreSQL

**Causa**: PostgreSQL no está corriendo o credenciales incorrectas
**Solución**:
```bash
# Verificar PostgreSQL está corriendo
psql -U postgres  # Conectarse como admin

# Verificar base de datos existe
\l

# Importar esquema si no existe
\c utopia_clinica
\i database/postgres/utopia_schema.sql
```

---

### Logs muestran "⚠️ USANDO DATOS LOCALES"

**Causa**: `EXPO_PUBLIC_USE_REMOTE_API` no está en true
**Solución**:
1. Verificar `.env.local` contiene:
   ```
   EXPO_PUBLIC_USE_REMOTE_API=true
   ```
2. Recargar app
3. Si usa navegador web, limpiar localStorage y recargar

---

### Datos no aparecen en PostgreSQL

**Checklist**:
1. ¿Backend recibe los logs ([POST ...] Recibido)?
   - Si NO: Frontend no está mandando peticiones
   - Si SÍ: Continuar con siguiente punto

2. ¿Backend muestra "[✅ Insertado]"?
   - Si NO: Hay error SQL (ver error message)
   - Si SÍ: Continuar con siguiente punto

3. ¿PostgreSQL tiene acceso a datos?
   ```bash
   psql -U utopia_user -d utopia_clinica -c "SELECT COUNT(*) FROM usuarios;"
   ```
   - Si dice 0: Inserts no están ejecutándose (verificar logs del backend)
   - Si muestra número: ✅ Está funcionando

---

## 📋 FLOW COMPLETO DE PRUEBA

### 1. Preparación (5 min)
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: PostgreSQL
psql -U utopia_user -d utopia_clinica -h localhost

# Terminal 3: Frontend (si usas Expo)
npm start
```

### 2. Test de Backend (2 min)
```bash
# Terminal 4: Test de registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test1@test.com","password":"123456","nombre":"Test 1","rol":"paciente"}'
```

### 3. Verificar en PostgreSQL (1 min)
```sql
SELECT * FROM usuarios WHERE email = 'test1@test.com';
```

### 4. Test desde Frontend (3 min)
- Abre app
- Registra usuario
- Observa logs en consola del frontend
- Verifica en PostgreSQL

### 5. Agregar más datos (2 min)
- Agrega cita
- Agrega historial
- Observa que aparecen en BD

---

## ✅ INDICADORES DE ÉXITO

Si ves esto en PostgreSQL:

```bash
$ psql -U utopia_user -d utopia_clinica
```

```sql
utopia_clinica=> SELECT COUNT(*) FROM usuarios;
 count
-------
    10
(1 row)

utopia_clinica=> SELECT COUNT(*) FROM citas;
 count
-------
     5
(1 row)

utopia_clinica=> SELECT COUNT(*) FROM pacientes;
 count
-------
     8
(1 row)
```

Y si cada vez que registras un usuario o creas una cita el COUNT incrementa...

## 🎉 ¡TODO FUNCIONA CORRECTAMENTE!
