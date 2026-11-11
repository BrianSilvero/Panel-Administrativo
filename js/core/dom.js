/* Creación segura de HTML (anti-XSS).
   Regla: los textos que escribe el personal o el cliente entran SIEMPRE como
   texto (textContent / nodos de texto). Acá no existe innerHTML. */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** h('button', { class: 'btn', on: { click } }, 'Guardar') */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  aplicar(el, attrs);
  agregar(el, children);
  return el;
}

function aplicar(el, attrs) {
  if (!attrs) return;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'on') {
      for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
    } else if (k === 'class') {
      el.className = Array.isArray(v) ? v.filter(Boolean).join(' ') : v;
    } else if (k === 'text') {
      el.textContent = String(v);
    } else if (k === 'style' && typeof v === 'object') {
      for (const [p, val] of Object.entries(v)) el.style.setProperty(p, val);
    } else if (k in el && typeof v !== 'string' && k !== 'list') {
      el[k] = v; // propiedades como value, checked, disabled
    } else {
      el.setAttribute(k, v === true ? '' : String(v));
    }
  }
}

function agregar(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false || c === '') continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/** Vacía un nodo y le pone hijos nuevos. */
export function montar(el, ...children) {
  el.replaceChildren();
  agregar(el, children);
  return el;
}

/* ---------- Íconos: SVG de trazo, 22px, aria-hidden ---------- */
const ICONOS = {
  inicio: [['path', { d: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' }]],
  carta: [['rect', { x: 5, y: 3, width: 14, height: 18, rx: 2 }], ['path', { d: 'M9 8h6M9 12h6M9 16h4' }]],
  pedidos: [['path', { d: 'M5 8h14l-1 12H6z' }], ['path', { d: 'M9 8V6a3 3 0 0 1 6 0v2' }]],
  reservas: [['rect', { x: 3, y: 5, width: 18, height: 16, rx: 2 }], ['path', { d: 'M3 10h18M8 3v4M16 3v4' }]],
  horarios: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 7v5l3 2' }]],
  resumen: [['path', { d: 'M4 20h16' }], ['path', { d: 'M7 16v-5M12 16V7M17 16v-8' }]],
  ajustes: [['path', { d: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12' }], ['circle', { cx: 16, cy: 6, r: 2 }], ['circle', { cx: 10, cy: 12, r: 2 }], ['circle', { cx: 18, cy: 18, r: 2 }]],
  mas: [['path', { d: 'M12 5v14M5 12h14' }]],
  whatsapp: [['path', { d: 'M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z' }]],
  alerta: [['path', { d: 'M12 3.5L2.5 20h19z' }], ['path', { d: 'M12 10v4.5M12 17.2v.1' }]],
  shows: [['path', { d: 'M9 18V5l11-2v13' }], ['circle', { cx: 6, cy: 18, r: 3 }], ['circle', { cx: 17, cy: 16, r: 3 }]],
  ojo: [['path', { d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z' }], ['circle', { cx: 12, cy: 12, r: 3 }]],
  candado: [['rect', { x: 5, y: 11, width: 14, height: 10, rx: 2 }], ['path', { d: 'M8 11V8a4 4 0 0 1 8 0v3' }]],
};

export function icono(nombre, size = 22) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const base = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false' };
  for (const [k, v] of Object.entries(base)) svg.setAttribute(k, String(v));
  for (const [tag, at] of ICONOS[nombre] || []) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(at)) n.setAttribute(k, String(v));
    svg.append(n);
  }
  return svg;
}
