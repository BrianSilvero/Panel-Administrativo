/* Avisos cortos (toast) y confirmaciones con palabras. */
import { h } from './dom.js';
import { mensajeDeError } from '../api/errors.js';

export function avisar(texto, ms = 3200) {
  const zona = document.getElementById('avisos');
  if (!zona) return;
  const t = h('div', { class: 'toast', text: texto });
  zona.append(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('transitionend', () => t.remove(), { once: true });
    setTimeout(() => t.remove(), 400); // por si no hay transición (movimiento reducido)
  }, ms);
}

/** confirmar({ titulo, texto, si: 'Sí, borrar', no: 'Cancelar' }) → Promise<boolean> */
export function confirmar({ titulo, texto, si = 'Sí', no = 'Cancelar', peligro = false }) {
  return new Promise((resolve) => {
    const cerrar = (v) => { dlg.close(); dlg.remove(); resolve(v); };
    const dlg = h('dialog', { class: 'dialog', 'aria-labelledby': 'dlg-titulo' },
      h('h2', { id: 'dlg-titulo', text: titulo }),
      h('p', { text: texto }),
      h('div', { class: 'btn-row' },
        h('button', { class: peligro ? 'btn danger' : 'btn pri', type: 'button', on: { click: () => cerrar(true) } }, si),
        // En acciones peligrosas el foco arranca en "No", para que un Enter apurado no cierre nada.
        h('button', { class: 'btn', type: 'button', autofocus: peligro, on: { click: () => cerrar(false) } }, no),
      ),
    );
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(false); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

/** Encabezado de pantalla: título + subtítulo a la izquierda, acción (o cinta) a la derecha. */
export function encabezado(titulo, subtitulo, derecha) {
  return h('div', { class: 'page-head' },
    h('div', {}, h('h1', { text: titulo }), subtitulo ? h('p', { text: subtitulo }) : null),
    derecha || null,
  );
}

/** Pestañas accesibles (flechas ← → para moverse). items: [{ id, label }].
    Devuelve { lista, panel } y llama a alElegir(id, panel) con el panel a llenar. */
export function pestanas({ etiqueta, items, actual, alElegir }) {
  const panel = h('div', { role: 'tabpanel', id: `panel-${items[0].id}`, tabindex: '-1' });
  const botones = items.map((it) => h('button', {
    class: 'tab', role: 'tab', type: 'button', id: `tab-${it.id}`,
    'aria-controls': panel.id,
    on: { click: () => elegir(it.id), keydown: mover },
  }, it.label));
  const lista = h('div', { class: 'tabs', role: 'tablist', 'aria-label': etiqueta }, botones);

  function elegir(id, foco = false) {
    botones.forEach((b, i) => {
      const on = items[i].id === id;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', b.id); if (foco) b.focus(); }
    });
    alElegir(id, panel);
  }
  function mover(e) {
    const i = botones.indexOf(e.currentTarget);
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % botones.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + botones.length) % botones.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = botones.length - 1;
    if (j === null) return;
    e.preventDefault();
    elegir(items[j].id, true);
  }
  elegir(actual || items[0].id);
  return { lista, panel };
}

/** Para lo que necesita el backend real (Mi cuenta, Historial). */
export function proximamente() {
  avisar('Esto se conecta cuando tengamos el sistema real.');
}

/* ---------- Formularios ---------- */

/** Campo con <label> visible, ayuda opcional y lugar para el error (leído por lectores de pantalla). */
export function campo({ id, label, control, ayuda }) {
  control.id = id;
  const help = ayuda ? h('span', { class: 'help', id: `${id}-help`, text: ayuda }) : null;
  const err = h('span', { class: 'error', id: `${id}-err`, hidden: true });
  control.setAttribute('aria-describedby', [help && help.id, err.id].filter(Boolean).join(' '));
  return {
    control,
    wrap: h('div', { class: 'field' }, h('label', { for: id }, label), control, help, err),
    error(msg) {
      err.textContent = msg || '';
      err.hidden = !msg;
      if (msg) control.setAttribute('aria-invalid', 'true'); else control.removeAttribute('aria-invalid');
    },
  };
}

/** Marca los errores de cada campo y lleva el foco al primero. Devuelve true si hubo errores. */
export function mostrarErrores(campos, errores = {}) {
  let primero = null;
  for (const [k, c] of Object.entries(campos)) {
    c.error(errores[k]);
    if (errores[k] && !primero) primero = c.control;
  }
  if (primero) primero.focus();
  return !!primero;
}

/** Ejecuta una acción de datos: si falla, muestra el motivo (y marca los campos). Devuelve null si falló. */
export async function intentar(fn, campos) {
  try {
    return await fn();
  } catch (err) {
    if (!(err && err.name === 'ErrorApi')) console.error(err);
    if (err && err.campos && campos) mostrarErrores(campos, err.campos);
    avisar(mensajeDeError(err));
    return null;
  }
}
