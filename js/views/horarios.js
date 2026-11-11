/* Horarios: sin boceto. "Próximamente" + la tabla en solo lectura (brief 6.7). */
import { api } from '../api/index.js';
import { h } from '../core/dom.js';
import { encabezado } from '../core/ui.js';

export default async function horarios() {
  const tabla = await api.horarios();
  return h('div', { class: 'page narrow' },
    encabezado('Horarios', 'Próximamente vas a poder cambiarlos desde acá.'),
    h('section', { class: 'card', 'aria-labelledby': 'hor-t' },
      h('h2', { id: 'hor-t', text: 'Horarios de la semana' }),
      h('table', { class: 'tabla' },
        h('caption', { class: 'sr-only', text: 'Horarios de apertura y cierre por día' }),
        h('thead', {}, h('tr', {},
          h('th', { scope: 'col', text: 'Día' }), h('th', { scope: 'col', text: 'Abre' }), h('th', { scope: 'col', text: 'Cierra' }))),
        h('tbody', {}, tabla.map((d) => h('tr', {},
          h('th', { scope: 'row', text: d.dia }), h('td', { text: d.abre }), h('td', { text: d.cierra })))),
      ),
    ),
  );
}
