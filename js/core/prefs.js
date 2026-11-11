/* Tamaño de letra (solo se elige en Ajustes). Se guarda en este dispositivo.
   js/arranque.js lo aplica antes de pintar; acá se lee y se cambia. */

const CLAVE = 'fredy-admin:letra';

export const TAMANOS = [
  { id: 'normal', label: 'Normal', aa: 22, px: 17 },
  { id: 'grande', label: 'Grande', aa: 30, px: 20 },
  { id: 'muy-grande', label: 'Muy grande', aa: 38, px: 24 },
];

export function letraActual() {
  try {
    const v = localStorage.getItem(CLAVE);
    if (TAMANOS.some((t) => t.id === v)) return v;
  } catch { /* sin almacenamiento */ }
  return 'normal';
}

export function aplicarLetra(id) {
  const html = document.documentElement;
  if (id === 'normal') html.removeAttribute('data-letra');
  else html.setAttribute('data-letra', id);
}

export function guardarLetra(id) {
  if (!TAMANOS.some((t) => t.id === id)) return;
  aplicarLetra(id);
  try { localStorage.setItem(CLAVE, id); } catch { /* se aplica igual, solo no se recuerda */ }
}
