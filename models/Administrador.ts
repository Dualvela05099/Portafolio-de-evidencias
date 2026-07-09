export type { Administrador } from "@/types";

import type { Administrador } from "@/types";

export const mapAdministradorFields = (admin: Partial<Administrador>): Partial<Administrador> => ({
  nombre: admin.nombre || admin.name || "",
  name: admin.nombre || admin.name || "",
  correo: admin.correo || admin.email || "",
  telefono: admin.telefono || admin.phone || "",
  area: admin.area || admin.role || "Administración",
  permisos: admin.permisos || admin.permissions || "Médicos, citas y avisos",
  password: admin.password || "123456",
  ...admin,
});
