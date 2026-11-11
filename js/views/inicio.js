/* Inicio: estado del local (cerrar por hoy, cambiar horario de hoy), pausas,
   tres accesos con número y atajos. */
import { api } from '../api/index.js';
import { h, icono } from '../core/dom.js';
import { encabezado, avisar, confirmar, intentar, campo, mostrarErrores } from '../core/ui.js';
import { fechaLarga, estaAbierto, fechaISO, validarHorario } from '../core/rules.js';
import { abrirCierreEmergencia } from './emergencia.js';
import { filaPausa } from './pausas.js';

let editandoHorario = false; // estado de la pantalla: se conserva al redibujar

function formHorario(estado, refrescar) {
  const c = {
    abre: campo({ id: 'hoy-abre', label: 'Abre', control: h('input', { class: 'input', type: 'time', value: estado.horarioHoy.abre }) }),
    cierra: campo({ id: 'hoy-cierra', label: 'Cierra', control: h('input', { class: 'input', type: 'time', value: estado.horarioHoy.cierra }) }),
  };
  const guardar = async (e) => {
    e.preventDefault();
    const datos = { abre: c.abre.control.value, cierra: c.cierra.control.value };
    if (mostrarErrores(c, validarHorario(datos).errores)) return;
    if (await intentar(() => api.horarioHoy(datos), c)) {
      editandoHorario = false;
      avisar(`Horario de hoy: de ${datos.abre} a ${datos.cierra} hs.`);
      await refrescar();
      document.getElementById('horario-editar')?.focus();
    }
  };
  return h('form', { class: 'form-inline stack-sm', 'aria-label': 'Cambiar horario de hoy', on: { submit: guardar } },
    h('p', { class: 'help', text: 'Vale solo para hoy. Mañana vuelve al horario de siempre.' }),
    h('div', { class: 'grid-2' }, c.abre.wrap, c.cierra.wrap),
    h('div', { class: 'btn-row' },
      h('button', { class: 'btn pri', type: 'submit' }, 'Guardar'),
      h('button', { class: 'btn', type: 'button', id: 'horario-cancelar', on: { click: async () => { editandoHorario = false; await refrescar(); document.getElementById('horario-editar')?.focus(); } } }, 'Cancelar')),
  );
}

function tarjetaEstado(estado, refrescar) {
  const { abre, cierra } = estado.horarioHoy;
  const em = estado.emergencia;
  const cerradoHoy = estado.cerradoHoy === fechaISO();
  const abierto = !em && !cerradoHoy && estaAbierto({ abre, cierra });
  const titulo = em ? 'Cerrado por emergencia' : cerradoHoy ? 'Cerrado por hoy' : abierto ? 'Abierto ahora' : 'Cerrado';
  const cambiado = estado.horarioHoy.fecha === fechaISO();

  const cerrarHoy = async () => {
    const ok = await confirmar({
      titulo: '¿Cerrar por hoy?',
      texto: `La web va a mostrar "Cerrado" hasta mañana a las 10:00.`,
      si: 'Sí, cerrar por hoy', no: 'No, volver', peligro: true,
    });
    if (ok && await intentar(() => api.cerrarHoy(true))) { avisar('Listo: hoy la web muestra "Cerrado".'); refrescar(); }
  };
  const abrirHoy = async () => {
    if (await intentar(() => api.cerrarHoy(false))) { avisar('Listo: el local vuelve a figurar abierto hoy.'); refrescar(); }
  };

  let acciones = null;
  if (!em && cerradoHoy) {
    acciones = h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', id: 'abrir-hoy', on: { click: abrirHoy } }, 'Volver a abrir hoy'));
  } else if (!em && !editandoHorario) {
    acciones = h('div', { class: 'btn-row' },
      h('button', { class: 'btn', type: 'button', id: 'horario-editar', on: { click: async () => { editandoHorario = true; await refrescar(); document.getElementById('hoy-abre')?.focus(); } } }, 'Cambiar horario de hoy'),
      h('button', { class: 'btn', type: 'button', id: 'cerrar-hoy', on: { click: cerrarHoy } }, 'Cerrar por hoy'));
  }

  return h('section', { class: 'card estado', 'aria-labelledby': 'estado-t', 'data-foco': 'estado', tabindex: '-1' },
    h('div', { class: 'estado-info' },
      h('h2', { id: 'estado-t', class: 'kicker', text: 'Estado del local (lo que ve el cliente en la web)' }),
      h('div', { class: 'estado-grande' },
        h('span', { class: em ? 'dot danger' : abierto ? 'dot' : 'dot hollow', 'aria-hidden': 'true' }),
        titulo),
      h('div', { class: 'text-2' }, `Hoy de ${abre} a ${cierra} hs`, cambiado ? h('span', { class: 'muted', text: ' · cambiado solo por hoy' }) : null),
    ),
    acciones,
    !em && !cerradoHoy && editandoHorario ? formHorario(estado, refrescar) : null,
  );
}

/** Botón de emergencia: rojo, arriba a la derecha de Inicio. Pide confirmación antes de cerrar. */
function botonEmergencia(refrescar) {
  return h('button', { class: 'btn danger btn-em', type: 'button', id: 'btn-emergencia', 'aria-haspopup': 'dialog',
    on: { click: () => abrirCierreEmergencia({ alCambiar: refrescar }) } },
  icono('alerta', 22), 'Cierre de emergencia');
}

function acceso(etiqueta, numero, enlace, href) {
  return h('a', { class: 'card acceso', href },
    h('span', { class: 'muted', text: etiqueta }),
    h('span', { class: 'numero', text: String(numero) }),
    h('span', { class: 'acceso-link' }, enlace, ' ', h('span', { 'aria-hidden': 'true', text: '→' })),
  );
}

export default async function inicio({ sesion, refrescar }) {
  const [estado, pedidos, reservas, platos] = await Promise.all([
    api.estado(), api.pedidos(), api.reservas(), api.platos(),
  ]);
  const hoy = fechaISO();
  const porConfirmar = pedidos.filter((p) => p.estado === 'por-confirmar').length;
  const reservasHoy = reservas.filter((r) => r.fecha === hoy && r.estado !== 'cancelada').length;
  const sinStock = platos.filter((p) => !p.disponible).length;

  return h('div', { class: 'page' },
    encabezado(`Hola, ${sesion.nombre}`, fechaLarga(), estado.emergencia ? null : botonEmergencia(refrescar)),
    tarjetaEstado(estado, refrescar),

    h('section', { class: 'card stack', 'aria-labelledby': 'pausas-t' },
      h('h2', { id: 'pausas-t', text: 'Pausas' }),
      filaPausa('reservas', estado, { titulo: 'Reservas online', refrescar }),
      filaPausa('pedidos', estado, { titulo: 'Pedidos para retirar', refrescar }),
    ),

    h('div', { class: 'accesos' },
      acceso('Pedidos por confirmar', porConfirmar, 'Ver pedidos', '#pedidos'),
      acceso('Reservas de hoy', reservasHoy, 'Ver reservas', '#reservas'),
      acceso('Platos sin stock', sinStock, 'Ver carta', '#carta'),
    ),

    h('section', { class: 'card stack', 'aria-labelledby': 'rap-t' },
      h('h2', { id: 'rap-t', text: '¿Qué querés hacer?' }),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn', href: '#carta' }, 'Cambiar un precio'),
        h('a', { class: 'btn', href: '#carta' }, 'Marcar un plato sin stock'),
        h('a', { class: 'btn', href: '#reservas' }, 'Anotar una reserva'),
        h('a', { class: 'btn', href: '#horarios' }, 'Cambiar horarios'),
      ),
    ),
  );
}
