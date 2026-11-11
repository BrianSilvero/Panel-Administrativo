/* Ajustes: tamaño de letra (funciona), mi cuenta, equipo e historial (solo dueño). */
import { api } from '../api/index.js';
import { h } from '../core/dom.js';
import { encabezado, proximamente, avisar, confirmar, intentar, campo, mostrarErrores } from '../core/ui.js';
import { validarInvitacion } from '../core/rules.js';
import { puede, ROLES } from '../core/perms.js';
import { TAMANOS, letraActual, guardarLetra } from '../core/prefs.js';

function tamanoLetra() {
  let actual = letraActual();
  const opciones = TAMANOS.map((t) => h('button', {
    class: 'opt', type: 'button', role: 'radio', 'data-id': t.id,
    on: { click: () => elegir(t.id), keydown: mover },
  },
  h('span', { class: 'opt-aa', 'aria-hidden': 'true', style: { 'font-size': `${t.aa}px` }, text: 'Aa' }),
  h('span', { class: 'opt-label', text: t.label })));

  function marcar() {
    opciones.forEach((b) => {
      const on = b.dataset.id === actual;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function elegir(id, foco = false) {
    if (id === actual) return;
    actual = id;
    guardarLetra(id);
    marcar();
    if (foco) opciones.find((b) => b.dataset.id === id).focus();
    avisar(`Tamaño de letra: ${TAMANOS.find((t) => t.id === id).label}`);
  }
  function mover(e) {
    const i = TAMANOS.findIndex((t) => t.id === actual);
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(i + 1, TAMANOS.length - 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(i - 1, 0);
    if (j === null) return;
    e.preventDefault();
    elegir(TAMANOS[j].id, true);
  }
  marcar();

  return h('section', { class: 'card stack', 'aria-labelledby': 'tl' },
    h('div', {},
      h('h2', { id: 'tl', text: 'Tamaño de letra' }),
      h('p', { class: 'muted sub', text: 'Elegí cómo leés mejor. Se guarda en este celular o computadora.' })),
    h('div', { class: 'opts', role: 'radiogroup', 'aria-labelledby': 'tl' }, opciones),
    h('div', { class: 'muestra' },
      h('div', { class: 'muestra-t', text: 'Así se ve el panel' }),
      h('div', { class: 'text-2', text: 'Bife de Chorizo (400 gr) · $ 32.000 · Disponible' })),
  );
}

let invitando = false; // se conserva al redibujar

function formInvitar(refrescar) {
  const rol = h('select', { class: 'input' },
    h('option', { value: 'encargado', text: 'Encargado' }),
    h('option', { value: 'dueno', text: 'Dueño' }));
  const c = {
    email: campo({ id: 'inv-email', label: 'Email', control: h('input', { class: 'input', type: 'email', autocomplete: 'off', placeholder: 'Ej: nombre@ejemplo.com' }) }),
    rol: campo({ id: 'inv-rol', label: 'Rol', ayuda: 'El encargado no puede borrar platos ni ver el equipo.', control: rol }),
  };
  const cerrar = async () => { invitando = false; await refrescar(); document.getElementById('btn-invitar')?.focus(); };
  const enviar = async (e) => {
    e.preventDefault();
    const datos = { email: c.email.control.value, rol: c.rol.control.value };
    if (mostrarErrores(c, validarInvitacion(datos).errores)) return;
    const u = await intentar(() => api.invitar(datos), c);
    if (u) { avisar(`Invitación enviada a ${u.email}.`); cerrar(); }
  };
  return h('form', {
    class: 'form-inline stack-sm invitar', 'aria-label': 'Invitar persona', novalidate: true,
    on: { submit: enviar, keydown: (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } } },
  },
  h('div', { class: 'grid-2' }, c.email.wrap, c.rol.wrap),
  h('p', { class: 'help', text: 'Le llega un mail con un link para crear su contraseña. En el demo no se manda nada.' }),
  h('div', { class: 'btn-row' },
    h('button', { class: 'btn pri', type: 'submit' }, 'Enviar invitación'),
    h('button', { class: 'btn', type: 'button', on: { click: cerrar } }, 'Cancelar')),
  );
}

export default async function ajustes({ sesion, refrescar }) {
  const esDueno = puede(sesion.rol, 'equipo');
  const equipo = esDueno ? await api.equipo() : [];

  const quitar = async (u) => {
    const ok = await confirmar({
      titulo: `¿Quitarle el acceso a ${u.nombre}?`,
      texto: 'No va a poder entrar más al panel. Si cambia de idea, lo podés invitar de nuevo.',
      si: 'Sí, quitar acceso', no: 'No, volver', peligro: true,
    });
    if (ok && await intentar(() => api.quitarAcceso(u.id))) { avisar(`Se quitó el acceso a ${u.nombre}.`); refrescar(); }
  };

  return h('div', { class: 'page narrow' },
    encabezado('Ajustes'),
    tamanoLetra(),

    h('section', { class: 'card', 'aria-labelledby': 'mc' },
      h('h2', { id: 'mc', class: 'mb', text: 'Mi cuenta' }),
      h('div', { class: 'li' },
        h('div', {}, h('b', { text: 'Email' }), h('br'), h('span', { class: 'muted', text: sesion.email || '' })),
        h('button', { class: 'btn', type: 'button', 'aria-label': 'Cambiar email', on: { click: proximamente } }, 'Cambiar')),
      h('div', { class: 'li' },
        h('div', {}, h('b', { text: 'Contraseña' })),
        h('button', { class: 'btn', type: 'button', on: { click: proximamente } }, 'Cambiar contraseña')),
      h('div', { class: 'li' },
        h('div', {}, h('b', { text: 'Verificación en dos pasos' }), h('br'), h('span', { class: 'muted', text: 'Código por app en el celular' })),
        h('span', { class: 'tag ok', text: 'Activada' })),
    ),

    esDueno ? h('section', { class: 'card', 'aria-labelledby': 'eq' },
      h('div', { class: 'page-head mb' },
        h('div', {}, h('h2', { id: 'eq', text: 'Equipo' }), h('p', { class: 'help sub', text: 'Sólo lo ve el dueño. Un usuario por persona.' })),
        invitando ? null : h('button', { class: 'btn', type: 'button', id: 'btn-invitar', on: { click: async () => { invitando = true; await refrescar(); document.getElementById('inv-email')?.focus(); } } }, 'Invitar persona')),
      invitando ? formInvitar(refrescar) : null,
      equipo.map((u) => h('div', { class: 'li', 'data-foco': `u-${u.id}`, tabindex: '-1' },
        h('div', {}, h('b', { text: u.nombre }), ` · ${ROLES[u.rol]}`, u.pendiente ? h('span', { class: 'tag warn espacio', text: 'Invitación enviada' }) : null),
        u.email === sesion.email
          ? h('span', { class: 'muted', text: 'Vos' })
          : h('button', { class: 'btn', type: 'button', id: `quitar-${u.id}`, 'aria-label': `Quitar acceso a ${u.nombre}`, on: { click: () => quitar(u) } }, 'Quitar acceso'))),
    ) : null,

    esDueno && puede(sesion.rol, 'historial') ? h('section', { class: 'card page-head', 'aria-labelledby': 'hi' },
      h('div', {}, h('h2', { id: 'hi', text: 'Historial de cambios' }), h('p', { class: 'help sub', text: 'Quién cambió qué y cuándo. Podés deshacer un cambio.' })),
      h('button', { class: 'btn', type: 'button', on: { click: proximamente } }, 'Ver historial'),
    ) : null,
  );
}
