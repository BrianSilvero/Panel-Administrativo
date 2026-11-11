/* Pausas de reservas online y de pedidos para retirar. La misma pausa se ve en Inicio
   y en Pedidos. Al vencer se reanuda sola (lo aplica api.revisar / la API al leer). */
import { api } from '../api/index.js';
import { h } from '../core/dom.js';
import { avisar, intentar } from '../core/ui.js';
import { PAUSAS, horaDeMs, pausaVigente } from '../core/rules.js';

/**
 * tipo: 'reservas' | 'pedidos'
 * opciones: { titulo, recibiendo, porEmergencia, clase, refrescar }
 */
export function filaPausa(tipo, estado, { titulo, recibiendo = 'Recibiendo', clase = 'pausa', refrescar }) {
  const pausa = estado.pausas[tipo];
  const enPausa = pausaVigente(pausa);
  const porEmergencia = !!estado.emergencia;
  const nombre = titulo.toLowerCase();

  if (porEmergencia) {
    return h('div', { class: clase, 'data-foco': `pausa-${tipo}`, tabindex: '-1' }, h('div', { class: 'pausa-estado' },
      h('span', { class: 'dot hollow', 'aria-hidden': 'true' }),
      h('b', { text: `${titulo}:` }), h('span', { text: 'En pausa por el cierre de emergencia' })));
  }

  const reanudar = async () => {
    if (await intentar(() => api.reanudar(tipo))) { avisar(`${titulo}: se reanudó.`); refrescar(); }
  };
  const pausar = async (op) => {
    const r = await intentar(() => api.pausar(tipo, op.id));
    if (r) { avisar(`${titulo}: en pausa hasta las ${horaDeMs(r.hasta)}.`); refrescar(); }
  };

  return h('div', { class: clase, 'data-foco': `pausa-${tipo}`, tabindex: '-1' },
    h('div', { class: 'pausa-estado' },
      h('span', { class: enPausa ? 'dot hollow' : 'dot', 'aria-hidden': 'true' }),
      h('b', { text: `${titulo}:` }),
      enPausa
        ? h('span', {}, `En pausa hasta las ${horaDeMs(pausa.hasta)} · `,
          h('button', { class: 'link', type: 'button', id: `reanudar-${tipo}`, on: { click: reanudar } }, 'Reanudar ahora'))
        : h('span', { text: recibiendo }),
    ),
    enPausa ? null : h('div', { class: 'btn-row', role: 'group', 'aria-label': `Pausar ${nombre}` },
      h('span', { class: 'help', 'aria-hidden': 'true', text: 'Pausar:' }),
      PAUSAS.map((op) => h('button', {
        class: 'btn', type: 'button', id: `pausar-${tipo}-${op.id}`,
        'aria-label': `Pausar ${nombre}: ${op.label}`, on: { click: () => pausar(op) },
      }, op.label)),
    ),
  );
}
