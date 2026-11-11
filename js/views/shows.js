/* Shows: arriba las noches fijas (todas las semanas), abajo los shows con fecha
   (nombre, fecha, hora, descripción) que se publican en la web en esa fecha. */
import { api } from '../api/index.js';
import { h, icono } from '../core/dom.js';
import { encabezado, avisar, confirmar, intentar, campo, mostrarErrores } from '../core/ui.js';
import { DIAS_SEMANA, textoNoches, fechaCorta, fechaISO, validarNoches, validarShow } from '../core/rules.js';

const ui = { editando: null, pasados: false }; // se conserva al redibujar

/* ---------- Noches fijas ---------- */
function tarjetaNoches(noches, refrescar) {
  const checks = DIAS_SEMANA.map((d) => h('input', { type: 'checkbox', id: `noche-${d.n}`, value: String(d.n), checked: noches.dias.includes(d.n) }));
  const hora = campo({ id: 'noches-hora', label: 'Desde las', control: h('input', { class: 'input', type: 'time', value: noches.hora }) });
  const vista = h('p', { class: 'cartel-noches', 'aria-live': 'polite' });
  const leer = () => ({ dias: checks.filter((c) => c.checked).map((c) => Number(c.value)), hora: hora.control.value });
  const pintar = () => { vista.textContent = textoNoches(validarNoches(leer()).datos); };
  for (const c of [...checks, hora.control]) c.addEventListener('input', pintar);
  pintar();

  const guardar = async (e) => {
    e.preventDefault();
    const datos = leer();
    if (mostrarErrores({ hora }, validarNoches(datos).errores)) return;
    const r = await intentar(() => api.guardarNoches(datos), { hora });
    if (r) { avisar(`Noches de show: ${textoNoches(r).toLowerCase()}.`); refrescar(); }
  };

  return h('form', { class: 'card stack', 'aria-labelledby': 'noches-t', novalidate: true, on: { submit: guardar } },
    h('div', {},
      h('h2', { id: 'noches-t', text: 'Noches de show (todas las semanas)' }),
      h('p', { class: 'help sub', text: 'Las noches de siempre. Se repiten cada semana aunque no cargues un show con nombre.' })),
    h('fieldset', { class: 'fs' },
      h('legend', { text: 'Días' }),
      h('div', { class: 'dias-check' }, DIAS_SEMANA.map((d, i) => h('label', { class: 'dia-check', for: checks[i].id }, checks[i], h('span', { text: d.corto })))),
    ),
    h('div', { class: 'noches-hora' }, hora.wrap),
    h('div', { class: 'stack-sm' }, h('span', { class: 'prev-titulo', text: 'Así lo ve el cliente' }), vista),
    h('div', { class: 'btn-row' }, h('button', { class: 'btn pri', type: 'submit', id: 'noches-guardar' }, 'Guardar')),
  );
}

/* ---------- Show con fecha: edición (también para uno nuevo) ---------- */
function edicion(show, { horaNoches, refrescar, esNuevo }) {
  const id = show.id;
  const c = {
    nombre: campo({ id: `sh-n-${id}`, label: 'Nombre del show o artista', control: h('input', { class: 'input', autocomplete: 'off', value: show.nombre || '', placeholder: 'Ej: Dúo de tango Los Porteños' }) }),
    fecha: campo({ id: `sh-f-${id}`, label: 'Fecha', control: h('input', { class: 'input', type: 'date', min: fechaISO(), value: show.fecha || '' }) }),
    hora: campo({ id: `sh-h-${id}`, label: 'Hora', control: h('input', { class: 'input', type: 'time', value: show.hora || horaNoches }) }),
    descripcion: campo({ id: `sh-d-${id}`, label: 'Descripción (opcional)', ayuda: 'Dos o tres frases: qué música, si hay baile, algo especial.',
      control: h('textarea', { class: 'input area', rows: 3, maxlength: 300, placeholder: 'Ej: Tango clásico y milongas en vivo.' }, show.descripcion || '') }),
  };
  const publicar = h('input', { type: 'checkbox', id: `sh-p-${id}`, checked: esNuevo ? true : !!show.publicado });

  const cerrar = async (foco) => { ui.editando = null; await refrescar(); if (foco) document.getElementById(foco)?.focus(); };
  const guardar = async (e) => {
    e.preventDefault();
    const datos = { nombre: c.nombre.control.value, fecha: c.fecha.control.value, hora: c.hora.control.value, descripcion: c.descripcion.control.value, publicado: publicar.checked };
    if (mostrarErrores(c, validarShow(datos).errores)) return;
    const r = await intentar(() => api.guardarShow({ id: esNuevo ? undefined : id, ...datos }), c);
    if (!r) return;
    avisar(`${r.publicado ? 'Publicado' : 'Guardado como borrador'}: ${r.nombre}, ${fechaCorta(r.fecha)} a las ${r.hora}.`);
    cerrar(`sh-ed-${r.id}`);
  };
  const borrar = async () => {
    const ok = await confirmar({ titulo: `¿Borrar "${show.nombre}"?`, texto: 'Se saca de la web. No se puede deshacer.', si: 'Sí, borrar show', no: 'No, volver', peligro: true });
    if (ok && await intentar(() => api.borrarShow(id))) { avisar(`Show borrado: ${show.nombre}.`); cerrar('btn-agregar-show'); }
  };

  return h('form', {
    class: 'row editando', novalidate: true, 'aria-label': esNuevo ? 'Show nuevo' : `Editando ${show.nombre}`,
    'data-foco': `show-${id}`, tabindex: '-1',
    on: { submit: guardar, keydown: (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar(esNuevo ? 'btn-agregar-show' : `sh-ed-${id}`); } } },
  },
  h('div', { class: 'editando-t', text: esNuevo ? 'Show nuevo' : `Editando: ${show.nombre}` }),
  c.nombre.wrap,
  h('div', { class: 'grid-2' }, c.fecha.wrap, c.hora.wrap),
  c.descripcion.wrap,
  h('label', { class: 'check', for: publicar.id }, publicar, h('span', { text: 'Publicar en la web' })),
  h('p', { class: 'help', text: 'Si no lo marcás, queda como borrador: lo ves acá pero no en la web.' }),
  h('div', { class: 'btn-row' },
    h('button', { class: 'btn pri', type: 'submit' }, esNuevo ? 'Agregar show' : 'Guardar'),
    h('button', { class: 'btn', type: 'button', on: { click: () => cerrar(esNuevo ? 'btn-agregar-show' : `sh-ed-${id}`) } }, 'Cancelar'),
    esNuevo ? null : h('button', { class: 'btn peligro empuja', type: 'button', on: { click: borrar } }, 'Borrar show')),
  );
}

function fila(s, refrescar, pasado) {
  return h('div', { class: ['row show', pasado && 'pasado'], role: 'listitem', 'data-foco': `show-${s.id}`, tabindex: '-1' },
    h('div', { class: 'show-fecha' }, h('b', { text: fechaCorta(s.fecha) }), h('span', { class: 'muted', text: s.hora })),
    h('div', { class: 'reserva-info' },
      h('b', { text: s.nombre }),
      s.descripcion ? h('div', { class: 'help', text: s.descripcion }) : null),
    pasado ? h('span', { class: 'tag neutro', text: 'Ya pasó' })
      : h('span', { class: s.publicado ? 'tag ok' : 'tag neutro', text: s.publicado ? 'Publicado' : 'Borrador' }),
    pasado ? null : h('button', { class: 'btn', type: 'button', id: `sh-ed-${s.id}`, 'aria-label': `Editar ${s.nombre}`,
      on: { click: async () => { ui.editando = s.id; await refrescar(); document.getElementById(`sh-n-${s.id}`)?.focus(); } } }, 'Editar'),
  );
}

export default async function shows({ refrescar }) {
  const datos = await api.shows();
  const hoy = fechaISO();
  const proximos = datos.lista.filter((s) => s.fecha >= hoy);
  const pasados = datos.lista.filter((s) => s.fecha < hoy).reverse();
  const ctx = { horaNoches: datos.noches.hora, refrescar };

  const agregar = async () => { ui.editando = 'nuevo'; await refrescar(); document.getElementById('sh-n-nuevo')?.focus(); };

  return h('div', { class: 'page' },
    encabezado('Shows', 'Las noches de show y los artistas que se ven en la web.'),
    tarjetaNoches(datos.noches, refrescar),

    h('div', { class: 'page-head' },
      h('h2', { text: 'Próximos shows' }),
      ui.editando === 'nuevo' ? null : h('button', { class: 'btn pri', type: 'button', id: 'btn-agregar-show', on: { click: agregar } }, icono('mas', 20), 'Agregar show')),

    h('section', { class: 'card flush', 'aria-label': 'Próximos shows' },
      ui.editando === 'nuevo' ? edicion({ id: 'nuevo' }, { ...ctx, esNuevo: true }) : null,
      proximos.length
        ? h('div', { role: 'list' }, proximos.map((s) => (ui.editando === s.id ? edicion(s, ctx) : fila(s, refrescar, false))))
        : h('div', { class: 'row' }, h('span', { class: 'muted', text: 'No hay shows con fecha. Las noches fijas se siguen viendo en la web.' })),
    ),

    pasados.length ? h('details', { class: 'detalle', open: ui.pasados, on: { toggle: (e) => { ui.pasados = e.currentTarget.open; } } },
      h('summary', { text: `Shows que ya pasaron (${pasados.length})` }),
      h('section', { class: 'card flush', 'aria-label': 'Shows que ya pasaron' }, h('div', { role: 'list' }, pasados.map((s) => fila(s, refrescar, true))))) : null,

    h('p', { class: 'help', text: 'En la web, cada show aparece en su fecha dentro de "Noches de show". Los borradores no se ven.' }),
  );
}
