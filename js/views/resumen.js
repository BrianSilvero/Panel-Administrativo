/* Resumen: sin boceto. Antes de construirlo se le muestra un borrador a Brian (brief 6.8). */
import { h } from '../core/dom.js';
import { encabezado } from '../core/ui.js';

export default async function resumen() {
  return h('div', { class: 'page narrow' },
    encabezado('Resumen', 'Próximamente: visitas a la carta, toques en “Reservar”, reservas y ausencias.'),
    h('section', { class: 'card stack' },
      h('h2', { text: 'Próximamente' }),
      h('p', { class: 'muted', text: 'Acá vas a ver cuánta gente mira la carta y reserva, por día, semana o mes. Sin facturación y sin guardar quién fue.' }),
    ),
  );
}
