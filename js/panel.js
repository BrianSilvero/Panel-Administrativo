/* Panel: una sola página; cada sección se elige por el hash (#inicio, #carta…). */
import { api, esDemo } from './api/index.js';
import { CONFIG } from './config.js';
import { h, montar, icono } from './core/dom.js';
import { ROLES } from './core/perms.js';
import { leerSesion, cerrarSesion, vigilarInactividad } from './core/session.js';
import { avisar } from './core/ui.js';
import { mensajeDeError } from './api/errors.js';

import inicio from './views/inicio.js';
import carta from './views/carta.js';
import pedidos from './views/pedidos.js';
import reservas from './views/reservas.js';
import shows from './views/shows.js';
import horarios from './views/horarios.js';
import resumen from './views/resumen.js';
import ajustes from './views/ajustes.js';
import { bannerEmergencia } from './views/emergencia.js';

const sesion = leerSesion();
if (!sesion) location.replace('index.html');

// Menú, en el orden del brief
const SECCIONES = [
  { id: 'inicio', label: 'Inicio', icono: 'inicio', vista: inicio },
  { id: 'carta', label: 'Carta', icono: 'carta', vista: carta },
  { id: 'pedidos', label: 'Pedidos para retirar', icono: 'pedidos', vista: pedidos },
  { id: 'reservas', label: 'Reservas', icono: 'reservas', vista: reservas },
  { id: 'shows', label: 'Shows', icono: 'shows', vista: shows },
  { id: 'horarios', label: 'Horarios', icono: 'horarios', vista: horarios },
  { id: 'resumen', label: 'Resumen', icono: 'resumen', vista: resumen },
  { id: 'ajustes', label: 'Ajustes', icono: 'ajustes', vista: ajustes },
];

// Plantilla: un cliente puede no usar alguna sección (config.js → seccionesOcultas)
for (let i = SECCIONES.length - 1; i >= 0; i--) {
  if (CONFIG.seccionesOcultas.includes(SECCIONES[i].id)) SECCIONES.splice(i, 1);
}

const menu = document.getElementById('menu');
const contenido = document.getElementById('contenido');

/** Cinta "Modo demo" con "Reiniciar datos": va una sola vez, abajo del menú lateral,
    para dejar libre el encabezado de cada pantalla. */
function cintaDemo() {
  if (!esDemo) return null;
  return h('div', { class: 'demo-side' },
    h('span', { text: 'Modo demo · datos de prueba' }),
    h('button', { type: 'button', on: { click: async () => {
      await api.reiniciar();
      avisar('Listo: los datos de prueba volvieron al inicio.');
      mostrar({ refresco: true });
    } } }, 'Reiniciar datos'),
  );
}

/* refrescar(): vuelve a dibujar la pantalla actual después de una acción, sin mover el
   scroll y devolviendo el foco al mismo botón (o a la tarjeta, si el botón ya no está). */
const ctx = { sesion, ir: (id) => { location.hash = id; }, refrescar: () => mostrar({ refresco: true }) };

function armarMenu(actual) {
  montar(menu, SECCIONES.map((s) => h('a', {
    href: '#' + s.id,
    'aria-current': s.id === actual ? 'page' : null,
  }, icono(s.icono), s.label)));
  montar(vista, botonVistaCliente(actual));
}

/** "Vista del cliente": abre en otra pestaña la página de la web que corresponde a la sección. */
const vista = h('div', { class: 'vista-cliente' });
menu.after(vista);

function botonVistaCliente(seccion) {
  const partes = [icono('ojo'), 'Vista del cliente'];
  const base = CONFIG.webPublica;
  if (!base) {
    return h('button', { class: 'btn vista', type: 'button', id: 'vista-cliente',
      on: { click: () => avisar('La vista del cliente se configura más adelante, cuando la web esté publicada.') } }, partes);
  }
  const url = new URL(CONFIG.paginasWeb[seccion] || '/', base).href;
  return h('a', { class: 'btn vista', id: 'vista-cliente', href: url, target: '_blank', rel: 'noopener noreferrer',
    'aria-label': 'Vista del cliente (se abre en otra pestaña)' }, partes);
}

let primeraVez = true;

async function mostrar(opts = {}) {
  const refresco = opts.refresco === true;
  const id = location.hash.slice(1);
  const sec = SECCIONES.find((s) => s.id === id) || SECCIONES[0];
  if (sec.id !== id) { history.replaceState(null, '', '#' + sec.id); }

  // Para devolver el foco después de redibujar
  const activo = document.activeElement;
  const focoId = refresco && activo && activo.id && contenido.contains(activo) ? activo.id : null;
  const focoTarjeta = refresco && activo ? activo.closest?.('[data-foco]')?.dataset.foco : null;
  const scroll = window.scrollY;

  armarMenu(sec.id);
  document.title = `${sec.label} · Panel ${CONFIG.cliente}`;

  try {
    const [nodo, estado] = await Promise.all([sec.vista(ctx), api.estado()]);
    // Mientras haya un cierre de emergencia, el cartel queda arriba de todas las pantallas.
    const banner = estado.emergencia ? bannerEmergencia(estado.emergencia, { alCambiar: ctx.refrescar }) : null;
    if (banner) nodo.prepend(banner);
    montar(contenido, nodo);
  } catch (err) {
    console.error(err);
    montar(contenido, h('div', { class: 'page' },
      h('h1', { text: 'No pudimos abrir esta sección' }),
      h('p', { class: 'muted', text: mensajeDeError(err) })));
  }

  if (refresco) {
    window.scrollTo(0, scroll);
    const destino = (focoId && document.getElementById(focoId))
      || (focoTarjeta && contenido.querySelector(`[data-foco="${CSS.escape(focoTarjeta)}"]`));
    if (destino) destino.focus({ preventScroll: true });
    else if (activo && !document.body.contains(activo) && !document.querySelector('dialog[open]')) {
      // El botón tocado desapareció (ej. el pedido pasó a otra pestaña): el foco va al título
      const h1 = contenido.querySelector('h1');
      if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    }
  } else if (!primeraVez) {
    // Al cambiar de sección, el foco va al título (lectores de pantalla y teclado).
    const h1 = contenido.querySelector('h1');
    if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  primeraVez = false;
}

/** ¿Hay alguien escribiendo o con una ventana abierta? Entonces no se redibuja solo. */
const ocupado = () => !!document.querySelector('.editando, .form-inline, dialog[open]')
  || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

/** Cada 20 s: pausas que vencieron, pedidos sin confirmar a los 30 min, contadores de minutos. */
function vigilarVencimientos() {
  setInterval(async () => {
    if (document.hidden || ocupado()) return;
    const cambio = await api.revisar();
    // Se redibuja si algo venció, o cada tanto para actualizar "quedan N min"
    if (cambio || ['inicio', 'pedidos'].includes(location.hash.slice(1))) mostrar({ refresco: true });
    if (cambio) avisar('Se actualizó la información (una pausa terminó o un pedido venció).');
  }, 20 * 1000);
}

// Marca del cliente en el menú (nombre y logo desde config.js)
document.querySelector('.brand-name').textContent = CONFIG.cliente;
document.querySelector('.brand img').src = CONFIG.logo;

if (sesion) {
  document.getElementById('me-nombre').textContent = sesion.nombre;
  document.getElementById('me-rol').textContent = ROLES[sesion.rol] || '';
  document.getElementById('salir').addEventListener('click', () => cerrarSesion());
  const cinta = cintaDemo();
  if (cinta) document.querySelector('.me').prepend(cinta);
  window.addEventListener('hashchange', () => mostrar());
  vigilarInactividad();
  vigilarVencimientos();
  mostrar();
}
