/* Backend de mentira para el modo demo. Los cambios viven en sessionStorage
   (se pierden al cerrar la pestaña) y "Reiniciar datos" vuelve al inicio.
   Cada acción valida igual que lo hará el backend real: reglas en core/rules.js,
   permisos en core/perms.js. */
import { crearDatosDemo } from '../demo/datos-demo.js';
import { ErrorApi } from './errors.js';
import { puede } from '../core/perms.js';
import { leerSesion } from '../core/session.js';
import {
  fechaISO, finDePausa, pausaVigente, TRANSICIONES_PEDIDO, pedidoVencido,
  ACCIONES_RESERVA, validarPlato, validarHorario, validarReserva, validarInvitacion,
  validarNoches, validarShow,
} from '../core/rules.js';

const CLAVE = 'fredy-admin:demo:v4'; // subir la versión si cambia la forma de los datos
let memoria = null; // respaldo si sessionStorage no está disponible

function cargar() {
  try {
    const s = sessionStorage.getItem(CLAVE);
    if (s) return JSON.parse(s);
  } catch { /* uso memoria */ }
  if (!memoria) memoria = crearDatosDemo();
  return memoria;
}

function guardar(datos) {
  memoria = datos;
  try { sessionStorage.setItem(CLAVE, JSON.stringify(datos)); } catch { /* queda en memoria */ }
}

const copia = (v) => structuredClone(v);

function exigir(permiso) {
  const s = leerSesion();
  if (!s || !puede(s.rol, permiso)) throw new ErrorApi('Tu usuario no tiene permiso para hacer esto.', 'sin-permiso');
}

function invalido(errores) {
  if (Object.keys(errores).length) throw new ErrorApi('Revisá los datos marcados.', 'invalido', errores);
}

/** Aplica lo que vence solo: pausas que terminaron y pedidos sin confirmar a los 30 min. */
function aplicarVencimientos(d, ahora = Date.now()) {
  let cambio = false;
  for (const k of ['reservas', 'pedidos']) {
    if (d.estado.pausas[k] && !pausaVigente(d.estado.pausas[k], ahora)) { d.estado.pausas[k] = null; cambio = true; }
  }
  for (const p of d.pedidos) {
    if (pedidoVencido(p, ahora)) { p.estado = 'no-llego'; p.motivo = 'vencido'; p.cerrado = ahora; cambio = true; }
  }
  // "Cerrar por hoy" y el horario cambiado valen solo para ese día
  const hoy = fechaISO();
  if (d.estado.cerradoHoy && d.estado.cerradoHoy !== hoy) { d.estado.cerradoHoy = null; cambio = true; }
  if (d.estado.horarioHoy.fecha && d.estado.horarioHoy.fecha !== hoy) { d.estado.horarioHoy = { abre: '10:00', cierra: '02:00', fecha: null }; cambio = true; }
  return cambio;
}

/** Lee, aplica vencimientos y guarda si algo cambió. */
function leer() {
  const d = cargar();
  if (aplicarVencimientos(d)) guardar(d);
  return d;
}

/** Abre los datos, deja que `fn` los cambie y guarda. Devuelve lo que devuelva `fn`. */
function cambiar(fn) {
  const d = leer();
  const r = fn(d);
  guardar(d);
  return r === undefined ? undefined : copia(r);
}

export const mock = {
  /* ---------- Lecturas ---------- */
  async usuarioDemo(rol) { return copia(cargar().usuarios[rol] || null); },
  async negocio() { return copia(leer().negocio); },
  async estado() { return copia(leer().estado); },
  async horarios() { return copia(leer().horarios); },
  async categorias() { return copia(leer().categorias); },
  async grupos() { return copia(leer().grupos || []); },
  async platos() { return copia(leer().platos).sort((a, b) => a.orden - b.orden); },
  async pedidos() { return copia(leer().pedidos).sort((a, b) => b.creado - a.creado); },
  async reservas() { return copia(leer().reservas); },
  async equipo() { exigir('equipo'); return copia(leer().equipo); },
  async shows() {
    const s = copia(leer().shows);
    s.lista.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    return s;
  },

  /** Lo llama el panel cada tanto: aplica vencimientos y avisa si algo cambió. */
  async revisar() {
    const d = cargar();
    const cambio = aplicarVencimientos(d);
    if (cambio) guardar(d);
    return cambio;
  },

  async reiniciar() {
    memoria = null;
    try { sessionStorage.removeItem(CLAVE); } catch { /* nada */ }
  },

  /* ---------- Carta ---------- */
  /** Crea (sin id) o actualiza un plato. */
  async guardarPlato({ id, categoria, nombre, precio, descripcion, foto }) {
    exigir(id ? 'platos.editar' : 'platos.agregar');
    const { datos, errores } = validarPlato({ nombre, precio, descripcion });
    invalido(errores);
    return cambiar((d) => {
      if (id) {
        const p = d.platos.find((x) => x.id === id);
        if (!p) throw new ErrorApi('Ese plato ya no está en la carta.', 'no-existe');
        p.nombre = { ...p.nombre, es: datos.nombre };
        p.descripcion = { ...p.descripcion, es: datos.descripcion };
        p.precio = datos.precio;
        if (foto !== undefined) p.foto = foto;
        return p;
      }
      if (!d.categorias.some((c) => c.id === categoria)) throw new ErrorApi('Elegí una categoría.', 'invalido');
      for (const p of d.platos) if (p.categoria === categoria) p.orden += 1; // el nuevo va primero
      const nuevo = {
        id: 'nuevo-' + Date.now().toString(36), categoria, nombre: { es: datos.nombre },
        descripcion: { es: datos.descripcion }, precio: datos.precio, disponible: true, orden: 1,
      };
      if (foto) nuevo.foto = foto;
      d.platos.push(nuevo);
      return nuevo;
    });
  },

  async disponibilidad(id, disponible) {
    exigir('platos.editar');
    return cambiar((d) => {
      const p = d.platos.find((x) => x.id === id);
      if (!p) throw new ErrorApi('Ese plato ya no está en la carta.', 'no-existe');
      p.disponible = !!disponible;
      return p;
    });
  },

  /** Sube (-1) o baja (+1) un plato dentro de su categoría (y de su grupo, en Bodega). */
  async moverPlato(id, dir) {
    exigir('platos.editar');
    return cambiar((d) => {
      const p = d.platos.find((x) => x.id === id);
      if (!p) throw new ErrorApi('Ese plato ya no está en la carta.', 'no-existe');
      const lista = d.platos.filter((x) => x.categoria === p.categoria && (x.grupo || null) === (p.grupo || null))
        .sort((a, b) => a.orden - b.orden);
      const i = lista.indexOf(p);
      const otro = lista[i + dir];
      if (!otro) return { movido: false };
      [p.orden, otro.orden] = [otro.orden, p.orden];
      return { movido: true };
    });
  },

  async borrarPlato(id) {
    exigir('platos.borrar');
    return cambiar((d) => {
      const i = d.platos.findIndex((x) => x.id === id);
      if (i < 0) throw new ErrorApi('Ese plato ya no está en la carta.', 'no-existe');
      d.platos.splice(i, 1);
      return { borrado: true };
    });
  },

  /* ---------- Estado del local y pausas ---------- */
  async pausar(tipo, opcionId) {
    exigir('local.estado');
    if (!['reservas', 'pedidos'].includes(tipo)) throw new ErrorApi('Pausa desconocida.', 'invalido');
    return cambiar((d) => {
      d.estado.pausas[tipo] = { hasta: finDePausa(opcionId, d.estado.horarioHoy.abre), opcion: opcionId };
      return d.estado.pausas[tipo];
    });
  },

  async reanudar(tipo) {
    exigir('local.estado');
    return cambiar((d) => { d.estado.pausas[tipo] = null; return { ok: true }; });
  },

  async cerrarHoy(cerrar) {
    exigir('local.estado');
    return cambiar((d) => { d.estado.cerradoHoy = cerrar ? fechaISO() : null; return d.estado; });
  },

  async horarioHoy({ abre, cierra }) {
    exigir('local.estado');
    const { datos, errores } = validarHorario({ abre, cierra });
    invalido(errores);
    return cambiar((d) => { d.estado.horarioHoy = { ...datos, fecha: fechaISO() }; return d.estado.horarioHoy; });
  },

  /* ---------- Cierre de emergencia ---------- */
  /** `datos`: { duracion, desde, hasta, cartel, avisar, reservas:[ids] } */
  async activarEmergencia(datos) {
    exigir('local.estado');
    return cambiar((d) => {
      d.estado.emergencia = {
        duracion: datos.duracion, desde: datos.desde, hasta: datos.hasta, cartel: datos.cartel,
        avisadas: datos.avisar ? datos.reservas : [],
      };
      if (datos.avisar) for (const r of d.reservas) if (datos.reservas.includes(r.id)) r.avisoEmergencia = datos.desde;
      return d.estado.emergencia;
    });
  },

  async terminarEmergencia() {
    exigir('local.estado');
    return cambiar((d) => { d.estado.emergencia = null; return { ok: true }; });
  },

  /* ---------- Pedidos para retirar ---------- */
  /** Aplica una acción de la máquina de estados (ver TRANSICIONES_PEDIDO). */
  async accionPedido(codigo, accion) {
    exigir('pedidos');
    return cambiar((d) => {
      const p = d.pedidos.find((x) => x.codigo === codigo);
      if (!p) throw new ErrorApi('No encontramos ese pedido.', 'no-existe');
      const destino = TRANSICIONES_PEDIDO[p.estado]?.[accion];
      if (!destino) throw new ErrorApi('Este pedido ya cambió de estado. Actualizamos la lista.', 'estado');
      const ahora = Date.now();
      p.estado = destino;
      if (accion === 'listo' || accion === 'reavisar') p.avisado = ahora;
      if (accion === 'confirmar') p.confirmado = ahora;
      if (['no-llego', 'cancelar', 'retirado'].includes(accion)) p.cerrado = ahora;
      if (accion === 'no-llego') p.motivo = 'manual';
      return p;
    });
  },

  /* ---------- Reservas ---------- */
  async accionReserva(id, accion) {
    exigir('reservas');
    return cambiar((d) => {
      const r = d.reservas.find((x) => x.id === id);
      if (!r) throw new ErrorApi('No encontramos esa reserva.', 'no-existe');
      if (!(ACCIONES_RESERVA[r.estado] || []).includes(accion)) throw new ErrorApi('Esta reserva ya cambió. Actualizamos la lista.', 'estado');
      if (accion === 'confirmar') r.estado = 'confirmada';
      if (accion === 'cancelar') r.estado = 'cancelada';
      if (accion === 'vino') r.asistio = true;
      if (accion === 'no-vino') r.asistio = false; // las ausencias se cuentan en total, nunca por persona
      return r;
    });
  },

  async anotarReserva(datos) {
    exigir('reservas');
    const { datos: v, errores } = validarReserva(datos);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha || '')) errores.fecha = 'Elegí el día.';
    invalido(errores);
    return cambiar((d) => {
      const r = { id: 'r' + Date.now().toString(36), fecha: datos.fecha, ...v, origen: 'telefono', estado: 'confirmada' };
      d.reservas.push(r);
      return r;
    });
  },

  async reservasWeb(activas) {
    exigir('reservas');
    return cambiar((d) => { d.estado.reservasWeb = !!activas; return d.estado; });
  },

  /* ---------- Shows ---------- */
  async guardarNoches(datos) {
    exigir('shows');
    const { datos: v, errores } = validarNoches(datos);
    invalido(errores);
    return cambiar((d) => { d.shows.noches = v; return d.shows.noches; });
  },

  /** Crea (sin id) o edita un show con fecha. */
  async guardarShow({ id, ...datos }) {
    exigir('shows');
    const { datos: v, errores } = validarShow(datos);
    invalido(errores);
    return cambiar((d) => {
      if (id) {
        const s = d.shows.lista.find((x) => x.id === id);
        if (!s) throw new ErrorApi('Ese show ya no está en la lista.', 'no-existe');
        Object.assign(s, v);
        return s;
      }
      const nuevo = { id: 's' + Date.now().toString(36), ...v };
      d.shows.lista.push(nuevo);
      return nuevo;
    });
  },

  async borrarShow(id) {
    exigir('shows');
    return cambiar((d) => {
      const antes = d.shows.lista.length;
      d.shows.lista = d.shows.lista.filter((x) => x.id !== id);
      if (d.shows.lista.length === antes) throw new ErrorApi('Ese show ya no está en la lista.', 'no-existe');
      return { borrado: true };
    });
  },

  /* ---------- Equipo ---------- */
  async invitar(datos) {
    exigir('equipo');
    const { datos: v, errores } = validarInvitacion(datos);
    invalido(errores);
    return cambiar((d) => {
      if (d.equipo.some((u) => u.email === v.email)) throw new ErrorApi('Esa persona ya está en el equipo.', 'invalido', { email: 'Ese email ya tiene acceso.' });
      const u = { id: 'u' + Date.now().toString(36), nombre: v.email, email: v.email, rol: v.rol, pendiente: true };
      d.equipo.push(u);
      return u;
    });
  },

  async quitarAcceso(id) {
    exigir('equipo');
    return cambiar((d) => {
      const u = d.equipo.find((x) => x.id === id);
      if (!u) throw new ErrorApi('Esa persona ya no está en el equipo.', 'no-existe');
      if (u.rol === 'dueno' && d.equipo.filter((x) => x.rol === 'dueno').length === 1) {
        throw new ErrorApi('Tiene que quedar al menos un dueño.', 'invalido');
      }
      d.equipo = d.equipo.filter((x) => x.id !== id);
      return { ok: true };
    });
  },
};
