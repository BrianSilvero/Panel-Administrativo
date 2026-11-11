/* Roles y permisos (brief, sección 7). Los roles definitivos se confirman con Fredy.
   Lo que un rol no puede hacer no se muestra. */

export const ROLES = {
  dueno: 'Dueño',
  encargado: 'Encargado',
};

const PERMISOS = {
  'platos.editar': ['dueno', 'encargado'],
  'platos.agregar': ['dueno', 'encargado'],
  'platos.borrar': ['dueno'],
  'local.estado': ['dueno', 'encargado'],
  'pedidos': ['dueno', 'encargado'],
  'reservas': ['dueno', 'encargado'],
  'shows': ['dueno', 'encargado'],
  'resumen': ['dueno', 'encargado'],
  'equipo': ['dueno'],
  'historial': ['dueno'],
};

export function puede(rol, permiso) {
  return (PERMISOS[permiso] || []).includes(rol);
}
