/* Sesión del panel. En modo demo vive en sessionStorage (se borra al cerrar la pestaña).
   Se cierra sola tras un rato sin uso. */
import { CONFIG } from '../config.js';

const CLAVE = 'fredy-admin:sesion';

export function leerSesion() {
  try {
    const s = JSON.parse(sessionStorage.getItem(CLAVE) || 'null');
    if (s && typeof s.rol === 'string' && typeof s.nombre === 'string') return s;
  } catch { /* sesión rota o sin almacenamiento */ }
  return null;
}

export function iniciarSesion(datos) {
  try { sessionStorage.setItem(CLAVE, JSON.stringify(datos)); } catch { /* demo sin almacenamiento */ }
}

export function cerrarSesion(motivo) {
  try {
    sessionStorage.removeItem(CLAVE);
    if (motivo) sessionStorage.setItem('fredy-admin:motivo', motivo);
  } catch { /* nada */ }
  location.replace('index.html');
}

export function motivoCierre() {
  try {
    const m = sessionStorage.getItem('fredy-admin:motivo');
    sessionStorage.removeItem('fredy-admin:motivo');
    return m;
  } catch { return null; }
}

/** Cierra la sesión si no se toca nada durante CONFIG.inactividadMin minutos. */
export function vigilarInactividad() {
  const ms = CONFIG.inactividadMin * 60 * 1000;
  let ultimo = Date.now();
  const tocar = () => { ultimo = Date.now(); };
  // Solo gestos de una persona. No se usa 'scroll' porque también lo disparan cosas
  // automáticas (volver arriba al cambiar de sección); la rueda, el teclado y los toques sí.
  for (const ev of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
    window.addEventListener(ev, tocar, { passive: true });
  }
  setInterval(() => {
    if (Date.now() - ultimo > ms) cerrarSesion('inactividad');
  }, 30 * 1000);
}
