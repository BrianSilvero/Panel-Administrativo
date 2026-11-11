/* Cierre de emergencia: la ventana para activarlo y el cartel que queda arriba de todo
   el panel mientras dura. La lógica (horas, cartel, reservas afectadas) vive en rules.js. */
import { api, esDemo } from '../api/index.js';
import { h, montar } from '../core/dom.js';
import { avisar, confirmar } from '../core/ui.js';
import {
  EMERGENCIA, duracionEmergencia, horaAhora, horaReapertura, ventanaEmergencia,
  reservasAfectadas, cartelEmergencia, avisoReserva, emergenciaVencida, fechaISO,
} from '../core/rules.js';

/** Abre la ventana. Llama a alCambiar() cuando el local quedó cerrado. */
export async function abrirCierreEmergencia({ alCambiar }) {
  const [estado, todas] = await Promise.all([api.estado(), api.reservas()]);
  const reservas = todas.filter((r) => r.fecha === fechaISO()); // solo las de hoy
  const { abre, cierra } = estado.horarioHoy;
  const ahora = horaAhora();
  let dur = duracionEmergencia('corta');
  let afectadas = [];

  const cartel = h('p', { class: 'cartel-web' });
  const zonaReservas = h('div', { class: 'stack-sm' });
  const avisarChk = h('input', { type: 'checkbox', id: 'em-avisar', checked: true });

  const opciones = EMERGENCIA.duraciones.map((d) => h('label', { class: 'radio-card' },
    h('input', { type: 'radio', name: 'em-dur', value: d.id, checked: d.id === dur.id,
      on: { change: () => { dur = d; pintar(); } } }),
    h('span', { text: d.label })));

  function pintar() {
    cartel.textContent = cartelEmergencia(dur, ahora, abre);
    afectadas = reservasAfectadas(reservas, ventanaEmergencia(dur, ahora, cierra), ahora);

    if (!afectadas.length) {
      montar(zonaReservas, h('p', { class: 'muted', text: 'No hay reservas en ese horario. No hace falta avisar a nadie.' }));
      return;
    }
    const personas = afectadas.reduce((n, r) => n + r.personas, 0);
    montar(zonaReservas,
      h('p', {}, h('b', { text: `${afectadas.length} ${afectadas.length === 1 ? 'reserva' : 'reservas'}` }), ` · ${personas} personas`),
      h('ul', { class: 'lista-simple' }, afectadas.map((r) =>
        h('li', {}, h('b', { text: r.hora }), ` · ${r.nombre} · ${r.personas} ${r.personas === 1 ? 'persona' : 'personas'}`))),
      h('label', { class: 'check', for: 'em-avisar' }, avisarChk,
        h('span', { text: dur.corta ? 'Avisarles por mail que puede haber demora' : 'Avisarles por mail que no vamos a poder recibirlos' })),
      h('details', { class: 'detalle' },
        h('summary', { text: 'Ver el mensaje que les llega' }),
        h('p', { class: 'mensaje', text: avisoReserva(dur, afectadas[0].hora) })),
    );
  }
  pintar();

  const dlg = h('dialog', { class: 'dialog dialog-lg', 'aria-labelledby': 'em-t' },
    h('form', { method: 'dialog', class: 'stack', on: { submit: (e) => { e.preventDefault(); activar(); } } },
      h('div', {},
        h('h2', { id: 'em-t', text: 'Cierre de emergencia' }),
        h('p', { class: 'muted sub', text: 'La web va a mostrar que el local está cerrado y se pausan las reservas y los pedidos para retirar. Se vuelve a abrir solo cuando toques “Reabrir el local”.' })),
      h('fieldset', { class: 'fs' },
        h('legend', { text: '¿Cuánto creés que va a durar?' }),
        h('div', { class: 'radio-cards' }, opciones)),
      h('section', { class: 'stack-sm', 'aria-labelledby': 'em-web' },
        h('h3', { id: 'em-web', text: 'Así se ve en la web' }),
        cartel),
      h('section', { class: 'stack-sm', 'aria-labelledby': 'em-res' },
        h('h3', { id: 'em-res', text: 'Reservas de hoy que se ven afectadas' }),
        zonaReservas),
      esDemo ? h('p', { class: 'help', text: 'Modo demo: no se manda ningún mail ni cambia la web real.' }) : null,
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn danger', type: 'submit' }, 'Cerrar el local ahora'),
        h('button', { class: 'btn', type: 'button', on: { click: () => cerrar() } }, 'Cancelar')),
    ),
  );

  function cerrar() { dlg.close(); dlg.remove(); }
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(); });

  async function activar() {
    const avisarA = afectadas.length > 0 && avisarChk.checked;
    // Segunda pregunta: un cierre de emergencia se ve en la web al instante.
    const ok = await confirmar({
      titulo: '¿Estás seguro de cerrar el local?',
      texto: `La web va a mostrar: “${cartelEmergencia(dur, ahora, abre)}”`
        + (avisarA ? ` Se va a avisar a ${afectadas.length} ${afectadas.length === 1 ? 'reserva' : 'reservas'}.` : ''),
      si: 'Sí, cerrar el local',
      no: 'No, volver',
      peligro: true,
    });
    if (!ok) return;
    await api.activarEmergencia({
      duracion: dur.id,
      desde: ahora,
      hasta: horaReapertura(dur, ahora),
      cartel: cartelEmergencia(dur, ahora, abre),
      avisar: avisarA,
      reservas: afectadas.map((r) => r.id),
    });
    cerrar();
    avisar(avisarA
      ? `Local cerrado. Se avisó a ${afectadas.length} ${afectadas.length === 1 ? 'reserva' : 'reservas'}.`
      : 'Local cerrado. La web ya muestra el cartel de emergencia.');
    alCambiar();
  }

  document.body.append(dlg);
  dlg.showModal();
  opciones[0].querySelector('input').focus();
}

/** Cartel que queda arriba de todas las pantallas mientras el cierre está activo. */
export function bannerEmergencia(em, { alCambiar }) {
  const vencida = emergenciaVencida(em);
  return h('section', { class: 'banner-em', role: 'region', 'aria-label': 'Cierre de emergencia activo' },
    h('div', { class: 'banner-em-txt' },
      h('b', { text: `Local cerrado por emergencia desde las ${em.desde}` }),
      h('span', { text: `La web muestra: “${em.cartel}”` }),
      em.avisadas.length ? h('span', { text: `Se avisó a ${em.avisadas.length} ${em.avisadas.length === 1 ? 'reserva' : 'reservas'}.` }) : null,
      vencida ? h('span', { class: 'banner-em-alerta', text: `Ya pasó la hora estimada (${em.hasta}). Si ya está todo bien, reabrí el local.` }) : null,
    ),
    h('button', { class: 'btn pri', type: 'button', on: { click: async () => {
      const ok = await confirmar({
        titulo: '¿Reabrir el local?',
        texto: 'La web vuelve a mostrar “Abierto” y se reanudan las reservas y los pedidos.',
        si: 'Sí, reabrir', no: 'Todavía no',
      });
      if (!ok) return;
      await api.terminarEmergencia();
      avisar('Listo: el local volvió a abrir en la web.');
      alCambiar();
    } } }, 'Reabrir el local'),
  );
}
