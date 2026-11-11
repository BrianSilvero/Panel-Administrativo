/* Pedidos para retirar (pantalla "D" del boceto). Sin precios ni pagos.
   Máquina de estados en core/rules.js (TRANSICIONES_PEDIDO); la API la hace cumplir. */
import { api } from '../api/index.js';
import { h, montar, icono } from '../core/dom.js';
import { encabezado, pestanas, avisar, confirmar, intentar } from '../core/ui.js';
import {
  ESTADOS_PEDIDO, MIN_CONFIRMAR_PEDIDO, horaDeMs, minutosParaConfirmar, avisoListo, linkWhatsApp,
} from '../core/rules.js';
import { filaPausa } from './pausas.js';

const ACTIVOS = ['por-confirmar', 'en-preparacion', 'listo'];
const ui = { tab: 'activos' }; // se conserva al redibujar

function pasos() {
  const nombres = ['Por confirmar', 'En preparación', 'Listo para retirar', 'Retirado'];
  return h('ol', { class: 'pasos', 'aria-label': 'Pasos de un pedido' },
    nombres.map((n, i) => h('li', { class: 'paso' }, h('i', { 'aria-hidden': 'true', text: String(i + 1) }), n)));
}

/** Abre WhatsApp con el aviso escrito. Se llama dentro del clic para que el navegador no lo bloquee. */
function abrirWhatsApp(p, direccion) {
  try {
    const url = linkWhatsApp(p.whatsapp, avisoListo(p.codigo, direccion));
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch {
    avisar('Este pedido no tiene un WhatsApp válido. Avisale por otro medio.');
    return false;
  }
}

function botones(p, { direccion, refrescar }) {
  const accion = async (nombre, mensaje) => {
    const r = await intentar(() => api.accionPedido(p.codigo, nombre));
    if (r) { avisar(mensaje); refrescar(); }
    return r;
  };
  const b = (txt, { pri = false, id, icon, click }) => h('button', {
    class: pri ? 'btn pri' : 'btn', type: 'button', id: `${id}-${p.codigo}`, on: { click },
  }, icon ? icono(icon, 20) : null, txt);

  if (p.estado === 'por-confirmar') {
    return [
      b('Sí, confirmar pedido', { pri: true, id: 'confirmar', click: () => accion('confirmar', `${p.codigo}: confirmado, pasa a "En preparación".`) }),
      b('No llegó', { id: 'nollego', click: async () => {
        const ok = await confirmar({ titulo: `¿${p.codigo} no llegó?`, texto: 'Pasa a "No llegaron / cancelados". Usalo si el mensaje de WhatsApp no te llegó.', si: 'Sí, no llegó', no: 'No, volver' });
        if (ok) accion('no-llego', `${p.codigo}: marcado como "No llegó".`);
      } }),
    ];
  }
  if (p.estado === 'en-preparacion') {
    return [
      b('Avisar que está listo', { pri: true, id: 'avisar', icon: 'whatsapp', click: () => {
        if (abrirWhatsApp(p, direccion)) accion('listo', `${p.codigo}: listo para retirar. Enviá el mensaje en WhatsApp.`);
      } }),
      b('Cancelar pedido', { id: 'cancelar', click: async () => {
        const ok = await confirmar({ titulo: `¿Cancelar ${p.codigo}?`, texto: 'Avisale al cliente por WhatsApp que el pedido se canceló.', si: 'Sí, cancelar pedido', no: 'No, volver', peligro: true });
        if (ok) accion('cancelar', `${p.codigo}: cancelado.`);
      } }),
    ];
  }
  if (p.estado === 'listo') {
    return [
      b('Marcar como retirado', { pri: true, id: 'retirado', click: () => accion('retirado', `${p.codigo}: retirado. ¡Listo!`) }),
      b('Volver a avisar', { id: 'reavisar', icon: 'whatsapp', click: () => {
        if (abrirWhatsApp(p, direccion)) accion('reavisar', `${p.codigo}: aviso abierto de nuevo en WhatsApp.`);
      } }),
    ];
  }
  return [];
}

function lineaDerecha(p) {
  if (p.estado === 'listo' && p.avisado) return `Avisado a las ${horaDeMs(p.avisado)}`;
  if (p.estado === 'retirado') return `Retirado a las ${horaDeMs(p.cerrado)}`;
  if (p.estado === 'cancelado') return `Cancelado a las ${horaDeMs(p.cerrado)}`;
  if (p.estado === 'no-llego') return p.motivo === 'vencido' ? `No se confirmó en ${MIN_CONFIRMAR_PEDIDO} min` : `Marcado a las ${horaDeMs(p.cerrado)}`;
  return `${horaDeMs(p.creado)} · ${p.retiro === 'Lo antes posible' ? 'Retira lo antes posible' : `Retira a las ${p.retiro}`}`;
}

function tarjeta(p, ctx) {
  const est = ESTADOS_PEDIDO[p.estado];
  const etiqueta = est.paso ? `${est.paso} · ${est.label}` : est.label;
  const items = p.items.map(([n, plato]) => `${n} × ${plato}`).join(', ');
  const btns = botones(p, ctx);
  const quedan = p.estado === 'por-confirmar' ? minutosParaConfirmar(p) : null;

  return h('article', {
    class: ['card stack pedido', p.estado === 'por-confirmar' && 'pendiente', !ACTIVOS.includes(p.estado) && 'cerrado'],
    'aria-labelledby': `ped-${p.codigo}`, 'data-foco': `ped-${p.codigo}`, tabindex: '-1',
  },
  h('div', { class: 'pedido-cab' },
    h('div', { class: 'pedido-id' },
      h('h3', { class: 'codigo', id: `ped-${p.codigo}`, text: p.codigo }),
      h('span', { class: ['tag', est.tag], text: etiqueta })),
    h('span', { class: 'muted', text: lineaDerecha(p) }),
  ),
  h('div', {},
    h('span', { text: `${p.nombre} · ${items}` }),
    p.aclaracion ? h('div', { class: 'help', text: `Aclaración: ${p.aclaracion}` }) : null,
  ),
  p.estado === 'por-confirmar'
    ? h('div', { class: ['ayuda-warn', quedan <= 5 && 'urgente'] },
      '¿Te llegó el mensaje con el código ', h('b', { text: p.codigo }),
      ' por WhatsApp? Confirmalo después de pasarle el total. ',
      h('b', { text: quedan === 1 ? 'Queda 1 minuto' : `Quedan ${quedan} minutos` }),
      ' antes de que pase solo a “No llegaron”.')
    : null,
  btns.length ? h('div', { class: 'btn-row' }, btns) : null,
  p.estado === 'en-preparacion'
    ? h('span', { class: 'help', text: 'Abre WhatsApp con el aviso escrito para este cliente; lo enviás vos.' })
    : null,
  );
}

export default async function pedidos({ refrescar }) {
  const [lista, estado, negocio] = await Promise.all([api.pedidos(), api.estado(), api.negocio()]);
  const ctx = { direccion: negocio.direccion, refrescar };
  // Activos: por paso, y dentro de cada paso el más viejo primero (es el que vence antes)
  const activos = lista.filter((p) => ACTIVOS.includes(p.estado))
    .sort((a, b) => ACTIVOS.indexOf(a.estado) - ACTIVOS.indexOf(b.estado) || a.creado - b.creado);
  const grupos = {
    activos,
    retirados: lista.filter((p) => p.estado === 'retirado'),
    perdidos: lista.filter((p) => p.estado === 'no-llego' || p.estado === 'cancelado'),
  };
  const vacios = {
    activos: 'No hay pedidos activos. Cuando un cliente mande uno por WhatsApp, aparece acá.',
    retirados: 'Todavía no se retiró ningún pedido hoy.',
    perdidos: 'No hay pedidos que no llegaron ni cancelados.',
  };

  const { lista: tabs, panel } = pestanas({
    etiqueta: 'Filtrar pedidos',
    items: [
      { id: 'activos', label: `Activos (${grupos.activos.length})` },
      { id: 'retirados', label: `Retirados hoy (${grupos.retirados.length})` },
      { id: 'perdidos', label: `No llegaron / cancelados (${grupos.perdidos.length})` },
    ],
    actual: ui.tab,
    alElegir: (id, p) => {
      ui.tab = id;
      const g = grupos[id];
      montar(p, h('div', { class: 'pedidos' },
        g.length ? g.map((x) => tarjeta(x, ctx)) : h('p', { class: 'card muted', text: vacios[id] })));
    },
  });

  return h('div', { class: 'page' },
    encabezado('Pedidos para retirar', 'Llegan por WhatsApp desde la web. El total y el cobro los manejás vos.'),
    h('section', { class: 'card flush', 'aria-label': 'Recepción de pedidos' },
      filaPausa('pedidos', estado, {
        titulo: 'Pedidos', recibiendo: 'Recibiendo · en la web el botón está activo', clase: 'recepcion', refrescar,
      })),
    pasos(),
    tabs,
    panel,
    h('p', { class: 'help', text: 'No se guardan precios ni pagos. Los pedidos se borran solos a los [N] días (plazo a definir con Fredy).' }),
  );
}
