/* Reglas del negocio que no dependen de la pantalla. */

export const ZONA = 'America/Argentina/Buenos_Aires';

/** Minutos para confirmar un pedido antes de que pase solo a "No llegó". */
export const MIN_CONFIRMAR_PEDIDO = 30;

/** Pasos del pedido para retirar (sin zonas grises). */
export const ESTADOS_PEDIDO = {
  'por-confirmar': { paso: 1, label: 'Por confirmar', tag: 'warn' },
  'en-preparacion': { paso: 2, label: 'En preparación', tag: 'info' },
  'listo': { paso: 3, label: 'Listo para retirar', tag: 'ok' },
  'retirado': { paso: 4, label: 'Retirado', tag: 'neutro' },
  'no-llego': { paso: 0, label: 'No llegó', tag: 'neutro' },
  'cancelado': { paso: 0, label: 'Cancelado', tag: 'neutro' },
};

export const ESTADOS_RESERVA = {
  'por-confirmar': { label: 'Por confirmar', tag: 'warn' },
  'confirmada': { label: 'Confirmada', tag: 'ok' },
  'cancelada': { label: 'Cancelada', tag: 'neutro' },
};

/** Hora "HH:MM" en Buenos Aires. */
export function horaAhora(fecha = new Date()) {
  return new Intl.DateTimeFormat('es-AR', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false }).format(fecha);
}

/** "Lunes 3 de noviembre" */
export function fechaLarga(fecha = new Date()) {
  const t = new Intl.DateTimeFormat('es-AR', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long' }).format(fecha);
  const limpio = t.replace(',', '');
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

const aMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** ¿Está abierto ahora? Soporta horarios que pasan la medianoche (10:00 a 02:00). */
export function estaAbierto({ abre, cierra }, fecha = new Date()) {
  const ahora = aMin(horaAhora(fecha));
  const a = aMin(abre);
  const c = aMin(cierra);
  return a <= c ? ahora >= a && ahora < c : ahora >= a || ahora < c;
}

/** Formato de precio argentino: 15000 → "$ 15.000". Sin precio → "$ [PRECIO]". */
export function precio(n) {
  if (typeof n !== 'number') return '$ [PRECIO]';
  return '$ ' + new Intl.NumberFormat('es-AR').format(n);
}

/** Rango de precios: 5000 a 7000 → "$ 5.000 - $ 7.000". */
export function precioPlato(p) {
  return typeof p.precioHasta === 'number' ? `${precio(p.precio)} - ${precio(p.precioHasta)}` : precio(p.precio);
}

/* =========================================================
   Cierre de emergencia
   Qué pasa al activarlo:
   1. La web cambia el cartel "Abierto" por el cartel de emergencia.
   2. Reservas online y pedidos para retirar quedan pausados mientras dure.
   3. Se calcula qué reservas caen dentro del cierre y, si el encargado quiere,
      se les avisa por mail (el envío real llega con el backend).
   Termina solo cuando alguien toca "Reabrir el local": una emergencia
   no se da por resuelta sola aunque pase la hora estimada.
   ========================================================= */
export const EMERGENCIA = {
  duraciones: [
    { id: 'corta', label: 'Menos de 1 hora', minutos: 60, corta: true },
    { id: 'media', label: 'Entre 1 y 3 horas', minutos: 180, corta: false },
    { id: 'dia', label: 'El resto del día', minutos: null, corta: false, hastaCierre: true },
    { id: 'nose', label: 'Todavía no sé', minutos: null, corta: false, ventana: 120 },
  ],
};

export function duracionEmergencia(id) {
  return EMERGENCIA.duraciones.find((d) => d.id === id) || EMERGENCIA.duraciones[0];
}

/** "21:40" + 60 → "22:40" (da la vuelta a la medianoche). */
export function sumarMinutos(hhmm, min) {
  const t = (aMin(hhmm) + min) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/** Minutos desde `desde` hasta `hasta`, siempre hacia adelante (cruza medianoche). */
const minutosEntre = (desde, hasta) => (aMin(hasta) - aMin(desde) + 1440) % 1440;

/** Hora estimada de reapertura (null si no se sabe o si es recién mañana). */
export function horaReapertura(dur, ahora) {
  return dur.minutos ? sumarMinutos(ahora, dur.minutos) : null;
}

/** Minutos que abarca el cierre, para saber qué reservas toca. */
export function ventanaEmergencia(dur, ahora, cierre) {
  if (dur.minutos) return dur.minutos;
  if (dur.hastaCierre) return minutosEntre(ahora, cierre);
  return dur.ventana;
}

/** Reservas de hoy que caen dentro del cierre (las que ya pasaron no cuentan). */
export function reservasAfectadas(reservas, ventanaMin, ahora) {
  return reservas
    .filter((r) => r.estado !== 'cancelada')
    .filter((r) => minutosEntre(ahora, r.hora) <= ventanaMin)
    .sort((a, b) => minutosEntre(ahora, a.hora) - minutosEntre(ahora, b.hora));
}

/** Texto del cartel que reemplaza a "Abierto" en la web. */
export function cartelEmergencia(dur, ahora, abre) {
  if (dur.hastaCierre) return `Hoy cerramos antes por un imprevisto. Volvemos mañana a las ${abre}.`;
  const vuelve = horaReapertura(dur, ahora);
  if (vuelve) return `Cerrado momentáneamente por un imprevisto. Volvemos a abrir a las ${vuelve}.`;
  return 'Cerrado momentáneamente por un imprevisto. Volvé a consultar en un rato.';
}

/** Aviso por mail a una reserva afectada. Si el cierre es corto se mantiene la reserva;
    si es largo, se le pide reprogramar. */
export function avisoReserva(dur, hora) {
  if (dur.corta) {
    return `Hola. Tuvimos un imprevisto y el local está cerrado por un rato. Por ahora tu reserva de las ${hora} sigue en pie; si cambia algo, te avisamos. Si preferís, podés cancelarla desde este mail.`;
  }
  return `Hola. Por un imprevisto hoy no vamos a poder recibirte a las ${hora}. Te pedimos disculpas. Respondé este mail o escribinos por WhatsApp y te ayudamos a reprogramar.`;
}

/** ¿Ya pasó la hora estimada de reapertura? (cruza medianoche sin problema) */
export function emergenciaVencida(em, ahora = horaAhora()) {
  if (!em || !em.hasta) return false;
  return minutosEntre(em.desde, ahora) >= minutosEntre(em.desde, em.hasta);
}

/* =========================================================
   Fase 3: reglas para las acciones del panel
   ========================================================= */

/** Fecha "AAAA-MM-DD" en Buenos Aires, con días de diferencia (-1 ayer, 1 mañana). */
export function fechaISO(dias = 0, base = new Date()) {
  const d = new Date(base.getTime() + dias * 86400000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** "Lunes 3 de noviembre" para una fecha "AAAA-MM-DD". */
export function fechaLargaISO(iso) {
  return fechaLarga(new Date(`${iso}T12:00:00-03:00`));
}

/** Hora "HH:MM" de un instante guardado en milisegundos. */
export const horaDeMs = (ms) => horaAhora(new Date(ms));

/** Milisegundos hasta la próxima vez que el reloj marque `hhmm` (en Buenos Aires). */
export function msHastaHora(hhmm, ahora = new Date()) {
  const min = minutosEntre(horaAhora(ahora), hhmm) || 1440;
  return min * 60000 - ahora.getSeconds() * 1000;
}

/** Orden de servicio: el día del local arranca a la hora de apertura (las 00:30 van después de las 23:00). */
export function ordenServicio(hhmm, abre = '10:00') {
  return minutosEntre(abre, hhmm);
}

/* ---------- Pausas ---------- */
export const PAUSAS = [
  { id: '20', label: '20 min', minutos: 20 },
  { id: '40', label: '40 min', minutos: 40 },
  { id: 'manana', label: 'Hasta mañana', hastaApertura: true },
];

/** Cuándo termina una pausa (ms). "Hasta mañana" = próxima apertura. */
export function finDePausa(opcionId, abre, ahora = new Date()) {
  const op = PAUSAS.find((p) => p.id === opcionId);
  if (!op) throw new Error('Pausa desconocida');
  return op.hastaApertura ? ahora.getTime() + msHastaHora(abre, ahora) : ahora.getTime() + op.minutos * 60000;
}

/** Una pausa vencida se reanuda sola. */
export const pausaVigente = (p, ahoraMs = Date.now()) => !!(p && p.hasta > ahoraMs);

/* ---------- Pedidos para retirar: máquina de estados ---------- */
/** Desde cada estado, qué acciones existen y a qué estado llevan. Lo que no figura, no se puede. */
export const TRANSICIONES_PEDIDO = {
  'por-confirmar': { confirmar: 'en-preparacion', 'no-llego': 'no-llego' },
  'en-preparacion': { listo: 'listo', cancelar: 'cancelado' },
  'listo': { retirado: 'retirado', reavisar: 'listo' },
};

export function puedeAccionPedido(estado, accion) {
  return !!(TRANSICIONES_PEDIDO[estado] && TRANSICIONES_PEDIDO[estado][accion]);
}

/** Un pedido sin confirmar a los 30 min pasa solo a "No llegó". */
export function pedidoVencido(p, ahoraMs = Date.now()) {
  return p.estado === 'por-confirmar' && ahoraMs - p.creado >= MIN_CONFIRMAR_PEDIDO * 60000;
}

/** Minutos que le quedan para confirmarse (0 si ya venció). */
export function minutosParaConfirmar(p, ahoraMs = Date.now()) {
  return Math.max(0, Math.ceil((p.creado + MIN_CONFIRMAR_PEDIDO * 60000 - ahoraMs) / 60000));
}

export function avisoListo(codigo, direccion) {
  return `Tu pedido ${codigo} ya está listo para retirar en ${direccion}. ¡Te esperamos!`;
}

/** Link de WhatsApp con el aviso escrito. El mensaje lo manda una persona. */
export function linkWhatsApp(tel, texto) {
  const num = String(tel).replace(/\D/g, '');
  if (num.length < 8) throw new Error('Teléfono inválido');
  return `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
}

/* ---------- Reservas ---------- */
export const ACCIONES_RESERVA = {
  'por-confirmar': ['confirmar', 'cancelar'],
  'confirmada': ['cancelar', 'vino', 'no-vino'],
};

/** ¿Ya pasó el horario de la reserva? (para preguntar "¿Vino?") */
export function reservaPasada(r, ahora = new Date(), abre = '10:00') {
  const hoy = fechaISO(0, ahora);
  if (r.fecha < hoy) return true;
  if (r.fecha > hoy) return false;
  return ordenServicio(r.hora, abre) <= ordenServicio(horaAhora(ahora), abre);
}

/* ---------- Validaciones (mensajes en lenguaje simple) ---------- */
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Devuelve { datos limpios, errores {campo: mensaje} }. */
export function validarPlato({ nombre, precio, descripcion }) {
  const errores = {};
  const n = String(nombre || '').trim();
  const pr = String(precio ?? '').replace(/[^\d]/g, '');
  let d = String(descripcion || '').trim();
  if (!n) errores.nombre = 'Escribí el nombre del plato.';
  else if (n.length > 80) errores.nombre = 'Usá menos de 80 letras.';
  if (!pr) errores.precio = 'Escribí el precio, solo números. Ej: 15000';
  else if (Number(pr) < 1 || Number(pr) > 10000000) errores.precio = 'Revisá el precio: tiene que ser entre 1 y 10.000.000.';
  if (d.length > 200) errores.descripcion = 'Usá una o dos frases (menos de 200 letras).';
  if (d && !/[.!?]$/.test(d)) d += '.'; // "Termina con punto": lo agregamos solos
  return { datos: { nombre: n, precio: Number(pr), descripcion: d }, errores };
}

export function validarHorario({ abre, cierra }) {
  const errores = {};
  if (!HHMM.test(abre || '')) errores.abre = 'Elegí la hora de apertura.';
  if (!HHMM.test(cierra || '')) errores.cierra = 'Elegí la hora de cierre.';
  if (!errores.abre && !errores.cierra && abre === cierra) errores.cierra = 'Tiene que ser distinta de la hora de apertura.';
  return { datos: { abre, cierra }, errores };
}

export function validarReserva({ hora, nombre, personas, contacto, nota }) {
  const errores = {};
  const n = String(nombre || '').trim();
  const p = Number(personas);
  const c = String(contacto || '').trim();
  if (!HHMM.test(hora || '')) errores.hora = 'Elegí la hora.';
  if (!n) errores.nombre = 'Escribí el nombre de quien reserva.';
  else if (n.length > 60) errores.nombre = 'Usá menos de 60 letras.';
  if (!Number.isInteger(p) || p < 1 || p > 40) errores.personas = 'Escribí cuántas personas (de 1 a 40).';
  if (!c) errores.contacto = 'Escribí un teléfono o un email.';
  else if (!/^[+\d\s()-]{8,20}$/.test(c) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) errores.contacto = 'Revisá el teléfono o el email.';
  const nt = String(nota || '').trim().slice(0, 200);
  return { datos: { hora, nombre: n, personas: p, contacto: c, nota: nt }, errores };
}

export function validarInvitacion({ email, rol }) {
  const errores = {};
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errores.email = 'Revisá el email. Ej: nombre@ejemplo.com';
  if (!['dueno', 'encargado'].includes(rol)) errores.rol = 'Elegí un rol.';
  return { datos: { email: e, rol }, errores };
}

/* =========================================================
   Shows: noches fijas (todas las semanas) + shows con fecha
   ========================================================= */
export const DIAS_SEMANA = [
  { n: 1, corto: 'Lun', largo: 'lunes' }, { n: 2, corto: 'Mar', largo: 'martes' },
  { n: 3, corto: 'Mié', largo: 'miércoles' }, { n: 4, corto: 'Jue', largo: 'jueves' },
  { n: 5, corto: 'Vie', largo: 'viernes' }, { n: 6, corto: 'Sáb', largo: 'sábados' },
  { n: 0, corto: 'Dom', largo: 'domingos' },
];

/** "Jueves, viernes y sábados desde las 22:00" (así lo lee el cliente en la web). */
export function textoNoches({ dias, hora }) {
  const nombres = DIAS_SEMANA.filter((d) => dias.includes(d.n)).map((d) => d.largo); // ya en plural: "jueves", "sábados"
  if (!nombres.length) return 'Sin noches de show fijas';
  const lista = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
  return `${lista.charAt(0).toUpperCase()}${lista.slice(1)} desde las ${hora}`;
}

/** "Vie 14/11" para una fecha "AAAA-MM-DD". */
export function fechaCorta(iso) {
  const d = new Date(`${iso}T12:00:00-03:00`);
  const dia = DIAS_SEMANA.find((x) => x.n === d.getUTCDay());
  const [, m, dd] = iso.split('-');
  return `${dia.corto} ${Number(dd)}/${Number(m)}`;
}

export function validarNoches({ dias, hora }) {
  const errores = {};
  const lista = [...new Set((dias || []).map(Number))].filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  if (!HHMM.test(hora || '')) errores.hora = 'Elegí desde qué hora.';
  return { datos: { dias: lista.sort(), hora }, errores };
}

export function validarShow({ nombre, fecha, hora, descripcion, publicado }, hoy = fechaISO()) {
  const errores = {};
  const n = String(nombre || '').trim();
  let d = String(descripcion || '').trim();
  if (!n) errores.nombre = 'Escribí el nombre del show o del artista.';
  else if (n.length > 80) errores.nombre = 'Usá menos de 80 letras.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) errores.fecha = 'Elegí la fecha.';
  else if (fecha < hoy) errores.fecha = 'La fecha ya pasó. Elegí hoy o un día que venga.';
  if (!HHMM.test(hora || '')) errores.hora = 'Elegí la hora.';
  if (d.length > 300) errores.descripcion = 'Usá menos de 300 letras (dos o tres frases).';
  if (d && !/[.!?]$/.test(d)) d += '.';
  return { datos: { nombre: n, fecha, hora, descripcion: d, publicado: !!publicado }, errores };
}
