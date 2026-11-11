/* Reservas: barra de día, resumen, lista por horario con nota y estado,
   confirmar / cancelar, "¿Vino?" después del horario, ver detalle y anotar una reserva. */
import { api } from '../api/index.js';
import { h, icono } from '../core/dom.js';
import { encabezado, avisar, confirmar, intentar, campo, mostrarErrores } from '../core/ui.js';
import {
  ESTADOS_RESERVA, fechaISO, fechaLargaISO, ordenServicio, reservaPasada, validarReserva,
} from '../core/rules.js';

const ui = { dia: 0, abierta: null, anotando: false }; // se conserva al redibujar

const nombreDia = (d) => ({ '-1': 'Ayer', 0: 'Hoy', 1: 'Mañana' }[d] || '');
const personasTxt = (n) => `${n} ${n === 1 ? 'persona' : 'personas'}`;

function formAnotar(fecha, refrescar) {
  const c = {
    hora: campo({ id: 'res-hora', label: 'Hora', control: h('input', { class: 'input', type: 'time', step: 900 }) }),
    personas: campo({ id: 'res-personas', label: 'Personas', control: h('input', { class: 'input', type: 'number', min: 1, max: 40, inputmode: 'numeric', placeholder: 'Ej: 4' }) }),
    nombre: campo({ id: 'res-nombre', label: 'Nombre', control: h('input', { class: 'input', autocomplete: 'off', placeholder: 'Ej: Laura' }) }),
    contacto: campo({ id: 'res-contacto', label: 'Teléfono o email', control: h('input', { class: 'input', autocomplete: 'off', placeholder: 'Ej: 11 2345-6789' }) }),
    nota: campo({ id: 'res-nota', label: 'Nota (opcional)', ayuda: 'Ej: ocasión especial o algo para la mesa.', control: h('input', { class: 'input', autocomplete: 'off', maxlength: 200, placeholder: 'Ej: Es un cumpleaños' }) }),
  };
  const cerrar = async () => { ui.anotando = false; await refrescar(); document.getElementById('btn-anotar')?.focus(); };
  const guardar = async (e) => {
    e.preventDefault();
    const datos = {
      fecha, hora: c.hora.control.value, personas: Number(c.personas.control.value),
      nombre: c.nombre.control.value, contacto: c.contacto.control.value, nota: c.nota.control.value,
    };
    if (mostrarErrores(c, validarReserva(datos).errores)) return;
    const r = await intentar(() => api.anotarReserva(datos), c);
    if (r) { avisar(`Reserva anotada: ${r.hora} · ${personasTxt(r.personas)}.`); cerrar(); }
  };
  return h('form', {
    class: 'card form-inline stack', 'aria-labelledby': 'anotar-t', novalidate: true,
    on: { submit: guardar, keydown: (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } } },
  },
  h('div', {}, h('h2', { id: 'anotar-t', text: 'Anotar reserva' }), h('p', { class: 'help sub', text: `Para el ${fechaLargaISO(fecha).toLowerCase()}. Queda confirmada.` })),
  h('div', { class: 'grid-2' }, c.hora.wrap, c.personas.wrap),
  h('div', { class: 'grid-2' }, c.nombre.wrap, c.contacto.wrap),
  c.nota.wrap,
  h('div', { class: 'btn-row' },
    h('button', { class: 'btn pri', type: 'submit' }, 'Guardar reserva'),
    h('button', { class: 'btn', type: 'button', on: { click: cerrar } }, 'Cancelar')),
  );
}

function fila(r, { refrescar, abre }) {
  const est = ESTADOS_RESERVA[r.estado];
  const pasada = reservaPasada(r, new Date(), abre);
  const origen = r.origen === 'web' ? 'Por la web' : 'Anotada por teléfono';
  const detalle = [
    origen, r.nota ? `“${r.nota}”` : null,
    r.recordatorio ? `Recordatorio enviado ${r.recordatorio}` : null,
    r.avisoEmergencia ? `Avisada del cierre de emergencia ${r.avisoEmergencia}` : null,
  ].filter(Boolean).join(' · ');

  const accion = async (nombre, mensaje) => {
    const x = await intentar(() => api.accionReserva(r.id, nombre));
    if (x) { avisar(mensaje); refrescar(); }
  };
  const cancelar = async () => {
    const ok = await confirmar({
      titulo: `¿Cancelar la reserva de las ${r.hora}?`,
      texto: `${r.nombre} · ${personasTxt(r.personas)}. Avisale al cliente que se canceló.`,
      si: 'Sí, cancelar reserva', no: 'No, volver', peligro: true,
    });
    if (ok) { ui.abierta = null; accion('cancelar', `Reserva de las ${r.hora} cancelada.`); }
  };
  const btn = (txt, id, click, pri = false) => h('button', { class: pri ? 'btn pri' : 'btn', type: 'button', id: `${id}-${r.id}`, on: { click } }, txt);
  const ver = () => btn(ui.abierta === r.id ? 'Cerrar' : 'Ver', 'ver', async () => {
    ui.abierta = ui.abierta === r.id ? null : r.id;
    await refrescar();
    document.getElementById(`ver-${r.id}`)?.focus();
  });

  let etiqueta = h('span', { class: ['tag', est.tag], text: est.label });
  let acciones = null;
  if (r.estado === 'por-confirmar') {
    acciones = h('div', { class: 'btn-row' },
      btn('Cancelar', 'cancelar', cancelar),
      btn('Confirmar', 'confirmar', () => accion('confirmar', `Reserva de las ${r.hora} confirmada.`), true));
  } else if (r.estado === 'confirmada' && pasada && r.asistio === undefined) {
    acciones = h('div', { class: 'btn-row vino', role: 'group', 'aria-label': `¿Vino la reserva de las ${r.hora}?` },
      h('span', { class: 'vino-t', text: '¿Vino?' }),
      btn('Sí', 'vino', () => accion('vino', `Listo: la reserva de las ${r.hora} vino.`), true),
      btn('No vino', 'novino', () => accion('no-vino', `Anotado: la reserva de las ${r.hora} no vino.`)));
  } else if (r.estado === 'confirmada') {
    if (r.asistio === true) etiqueta = h('span', { class: 'tag ok', text: 'Vino' });
    if (r.asistio === false) etiqueta = h('span', { class: 'tag neutro', text: 'No vino' });
    acciones = ver();
  }

  const abierta = ui.abierta === r.id && r.estado === 'confirmada';
  return h('div', { class: ['row reserva', r.estado === 'cancelada' && 'cancelada'], role: 'listitem', 'data-foco': `res-${r.id}`, tabindex: '-1' },
    h('span', { class: 'hora', text: r.hora }),
    h('div', { class: 'reserva-info' },
      h('b', { text: r.nombre }), ` · ${personasTxt(r.personas)}`,
      h('div', { class: 'help', text: detalle })),
    etiqueta,
    acciones,
    abierta ? h('div', { class: 'reserva-detalle' },
      h('dl', { class: 'datos' },
        h('dt', { text: 'Contacto' }), h('dd', { text: r.contacto || '—' }),
        h('dt', { text: 'Origen' }), h('dd', { text: origen }),
        h('dt', { text: 'Nota' }), h('dd', { text: r.nota || 'Sin nota' })),
      r.asistio === undefined ? h('div', { class: 'btn-row' }, btn('Cancelar reserva', 'cancelar', cancelar)) : null,
    ) : null,
  );
}

export default async function reservas({ refrescar }) {
  const [lista, estado] = await Promise.all([api.reservas(), api.estado()]);
  const abre = estado.horarioHoy.abre;
  const fecha = fechaISO(ui.dia);
  const delDia = lista.filter((r) => r.fecha === fecha)
    .sort((a, b) => (a.estado === 'cancelada') - (b.estado === 'cancelada') || ordenServicio(a.hora, abre) - ordenServicio(b.hora, abre));
  const vigentes = delDia.filter((r) => r.estado !== 'cancelada');
  const personas = vigentes.reduce((n, r) => n + r.personas, 0);
  const ausencias = vigentes.filter((r) => r.asistio === false).length;

  const cambiarDia = async (d) => { ui.dia += d; ui.abierta = null; await refrescar(); document.getElementById(d < 0 ? 'dia-ant' : 'dia-sig')?.focus(); };
  const web = async () => {
    const r = await intentar(() => api.reservasWeb(!estado.reservasWeb));
    if (r) { avisar(r.reservasWeb ? 'Reservas por la web: activadas.' : 'Reservas por la web: desactivadas. Solo se anotan a mano.'); refrescar(); }
  };
  const anotar = async () => { ui.anotando = true; await refrescar(); document.getElementById('res-hora')?.focus(); };

  return h('div', { class: 'page' },
    encabezado('Reservas', 'Las que entran por la web y las que anotás vos.',
      ui.anotando ? null : h('button', { class: 'btn pri', type: 'button', id: 'btn-anotar', on: { click: anotar } }, icono('mas', 20), 'Anotar reserva')),

    h('div', { class: 'card dia' },
      h('div', { class: 'dia-nav' },
        h('button', { class: 'btn', type: 'button', id: 'dia-ant', 'aria-label': 'Día anterior', on: { click: () => cambiarDia(-1) } }, h('span', { 'aria-hidden': 'true', text: '←' })),
        h('div', { class: 'dia-txt', 'aria-live': 'polite' },
          h('b', { text: nombreDia(ui.dia) || fechaLargaISO(fecha).split(' ')[0] }),
          h('span', { class: 'muted', text: fechaLargaISO(fecha) })),
        h('button', { class: 'btn', type: 'button', id: 'dia-sig', 'aria-label': 'Día siguiente', on: { click: () => cambiarDia(1) } }, h('span', { 'aria-hidden': 'true', text: '→' })),
      ),
      h('div', { class: 'dia-resumen' },
        h('span', {},
          h('b', { text: String(vigentes.length) }), vigentes.length === 1 ? ' reserva · ' : ' reservas · ',
          h('b', { text: String(personas) }), personas === 1 ? ' persona' : ' personas',
          ausencias ? h('span', { class: 'muted', text: ` · ${ausencias} no ${ausencias === 1 ? 'vino' : 'vinieron'}` }) : null),
        h('button', { class: 'switch plain', type: 'button', role: 'switch', id: 'sw-reservas-web', 'aria-checked': String(estado.reservasWeb), on: { click: web } },
          h('i', { 'aria-hidden': 'true' }),
          h('span', { class: 'switch-txt' }, 'Reservas por la web: ', h('b', { text: estado.reservasWeb ? 'Sí' : 'No' }))),
      ),
    ),

    ui.anotando ? formAnotar(fecha, refrescar) : null,

    h('section', { class: 'card flush', 'aria-label': `Reservas del ${fechaLargaISO(fecha)}` },
      delDia.length
        ? h('div', { role: 'list' }, delDia.map((r) => fila(r, { refrescar, abre })))
        : h('div', { class: 'row' }, h('span', { class: 'muted', text: 'No hay reservas para este día.' })),
    ),
    h('p', { class: 'help', text: 'Turnos, cupos y reglas de cancelación: pendiente de definir con Fredy.' }),
  );
}
