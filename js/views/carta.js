/* Carta: buscador, categorías, lista de platos, disponibilidad y edición en línea
   con vista previa (guardar, foto, ordenar y borrar). */
import { api } from '../api/index.js';
import { h, montar, icono } from '../core/dom.js';
import { encabezado, pestanas, avisar, confirmar, intentar, campo, mostrarErrores } from '../core/ui.js';
import { puede } from '../core/perms.js';
import { precio, precioPlato, validarPlato } from '../core/rules.js';

const es = (t) => (t && t.es) || '';
const FOTO_OK = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/; // solo fotos que achicamos nosotros

// Estado de la pantalla: se conserva al redibujar después de una acción
const ui = { cat: 'parrilla', busqueda: '', editando: null, fotoNueva: undefined };

/* ---------- Foto: se achica a 320×240 en el navegador antes de guardarla ---------- */
function achicarFoto(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) return reject(new Error('Elegí una imagen (JPG o PNG).'));
    if (archivo.size > 8 * 1024 * 1024) return reject(new Error('La foto es muy pesada (máximo 8 MB).'));
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No pudimos leer la foto.'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No pudimos abrir la foto.'));
      img.onload = () => {
        const W = 320, H = 240;
        const escala = Math.max(W / img.width, H / img.height);
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        c.getContext('2d').drawImage(img, (W - img.width * escala) / 2, (H - img.height * escala) / 2, img.width * escala, img.height * escala);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

function miniatura(foto) {
  return foto && FOTO_OK.test(foto)
    ? h('img', { class: 'thumb', src: foto, alt: '', width: 64, height: 48 })
    : h('div', { class: 'thumb', 'aria-hidden': 'true' });
}

/* ---------- Fila de un plato ---------- */
function interruptor(plato, refrescar) {
  const on = plato.disponible;
  return h('button', {
    class: 'switch', type: 'button', role: 'switch', id: `sw-${plato.id}`, 'aria-checked': String(on),
    'aria-label': `Disponible en la web: ${es(plato.nombre)}`,
    on: { click: async () => {
      const r = await intentar(() => api.disponibilidad(plato.id, !on));
      if (r) { avisar(`${es(plato.nombre)}: ${r.disponible ? 'disponible' : 'sin stock'}.`); refrescar(); }
    } },
  }, h('i', { 'aria-hidden': 'true' }), h('span', { class: 'switch-txt', text: on ? 'Sí' : 'Sin stock' }));
}

function fila(plato, refrescar) {
  return h('div', { class: 'row', 'data-foco': `plato-${plato.id}`, tabindex: '-1' },
    miniatura(plato.foto),
    h('div', { class: 'plato-info' },
      h('div', { class: 'plato-nombre', text: es(plato.nombre) }),
      es(plato.descripcion) ? h('div', { class: 'help', text: es(plato.descripcion) }) : null,
    ),
    h('div', { class: 'plato-precio', text: precioPlato(plato) }),
    interruptor(plato, refrescar),
    h('button', {
      class: 'btn', type: 'button', id: `ed-${plato.id}`, 'aria-label': `Editar ${es(plato.nombre)}`,
      on: { click: async () => { ui.editando = plato.id; ui.fotoNueva = undefined; await refrescar(); document.getElementById(`n-${plato.id}`)?.focus(); } },
    }, 'Editar'),
  );
}

/* ---------- Edición (también sirve para un plato nuevo) ---------- */
function vistaPrevia(c, fotoActual) {
  const thumb = h('div', { class: 'prev-thumb' }, miniatura(fotoActual));
  const nombre = h('div', { class: 'prev-nombre' });
  const desc = h('div', { class: 'prev-desc' });
  const pre = h('div', { class: 'prev-precio' });
  const pintar = () => {
    nombre.textContent = c.nombre.control.value.trim() || 'Nombre del plato';
    desc.textContent = c.descripcion.control.value.trim() || 'Descripción del plato.';
    const n = Number(c.precio.control.value.replace(/\D/g, ''));
    pre.textContent = n ? precio(n) : '$ [PRECIO]';
  };
  for (const k of ['nombre', 'precio', 'descripcion']) c[k].control.addEventListener('input', pintar);
  pintar();
  const nodo = h('div', { class: 'prev', 'aria-live': 'polite' },
    h('div', { class: 'prev-titulo', text: 'Así lo ve el cliente' }),
    h('div', { class: 'prev-plato' }, thumb, h('div', { class: 'prev-texto' }, nombre, desc), pre));
  nodo.cambiarFoto = (foto) => montar(thumb, miniatura(foto));
  return nodo;
}

function edicion(plato, { rol, refrescar, esNuevo, primero, ultimo }) {
  const id = plato.id;
  const c = {
    nombre: campo({ id: `n-${id}`, label: 'Nombre', control: h('input', { class: 'input', value: es(plato.nombre), placeholder: 'Ej: Bife de chorizo', autocomplete: 'off' }) }),
    precio: campo({ id: `p-${id}`, label: 'Precio', control: h('input', { class: 'input', inputmode: 'numeric', value: plato.precio ?? '', placeholder: 'Ej: 15000', autocomplete: 'off' }) }),
    descripcion: campo({ id: `d-${id}`, label: 'Descripción', ayuda: 'Una o dos frases. Termina con punto.', control: h('input', { class: 'input', value: es(plato.descripcion), placeholder: 'Ej: Corte jugoso a la parrilla, con chimichurri.', autocomplete: 'off' }) }),
  };
  const fotoActual = ui.fotoNueva !== undefined ? ui.fotoNueva : plato.foto;
  const prev = vistaPrevia(c, fotoActual);
  const elegirFoto = h('input', { type: 'file', accept: 'image/*', class: 'sr-only', id: `f-${id}`, tabindex: '-1', 'aria-hidden': 'true' });
  elegirFoto.addEventListener('change', async () => {
    const archivo = elegirFoto.files[0];
    if (!archivo) return;
    try {
      ui.fotoNueva = await achicarFoto(archivo);
      prev.cambiarFoto(ui.fotoNueva);
      avisar('Foto lista. Tocá "Guardar" para que se vea en la web.');
    } catch (err) { avisar(err.message); }
  });

  const cerrar = async (foco) => {
    ui.editando = null; ui.fotoNueva = undefined;
    await refrescar();
    if (foco) document.getElementById(foco)?.focus();
  };

  const guardar = async (e) => {
    e.preventDefault();
    const datos = { nombre: c.nombre.control.value, precio: c.precio.control.value, descripcion: c.descripcion.control.value };
    if (mostrarErrores(c, validarPlato(datos).errores)) return;
    const r = await intentar(() => api.guardarPlato({
      id: esNuevo ? undefined : id, categoria: plato.categoria, ...datos,
      foto: ui.fotoNueva,
    }), c);
    if (!r) return;
    avisar(esNuevo ? `Agregado a la carta: ${es(r.nombre)}.` : `Guardado: ${es(r.nombre)}. Ya se ve en la web.`);
    await cerrar(`ed-${r.id}`);
  };

  const mover = async (dir) => {
    const r = await intentar(() => api.moverPlato(id, dir));
    if (r && r.movido) { avisar(dir < 0 ? 'Subió un lugar.' : 'Bajó un lugar.'); refrescar(); }
  };

  const borrar = async () => {
    const ok = await confirmar({
      titulo: `¿Borrar "${es(plato.nombre)}"?`,
      texto: 'Se saca de la carta de la web. Si solo no hay por hoy, mejor marcalo "Sin stock".',
      si: 'Sí, borrar', no: 'No, volver', peligro: true,
    });
    if (ok && await intentar(() => api.borrarPlato(id))) { avisar(`Borrado: ${es(plato.nombre)}.`); cerrar('btn-agregar'); }
  };

  return h('form', {
    class: 'row editando', 'aria-label': esNuevo ? 'Plato nuevo' : `Editando ${es(plato.nombre)}`, novalidate: true,
    'data-foco': `plato-${id}`, tabindex: '-1',
    on: { submit: guardar, keydown: (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar(esNuevo ? 'btn-agregar' : `ed-${id}`); } } },
  },
  h('div', { class: 'editando-t', text: esNuevo ? 'Plato nuevo' : `Editando: ${es(plato.nombre)}` }),
  h('div', { class: 'grid-2' }, c.nombre.wrap, c.precio.wrap),
  h('div', { class: 'ancho' }, c.descripcion.wrap),
  prev,
  elegirFoto,
  h('div', { class: 'btn-row ancho' },
    h('button', { class: 'btn pri', type: 'submit' }, esNuevo ? 'Agregar a la carta' : 'Guardar'),
    h('button', { class: 'btn', type: 'button', on: { click: () => cerrar(esNuevo ? 'btn-agregar' : `ed-${id}`) } }, 'Cancelar'),
    h('button', { class: 'btn empuja', type: 'button', on: { click: () => elegirFoto.click() } }, fotoActual ? 'Cambiar foto' : 'Agregar foto'),
  ),
  esNuevo ? null : h('div', { class: 'btn-row ancho secundario' },
    h('span', { class: 'help', text: 'Orden en la carta:' }),
    // Lo que no se puede hacer no se muestra (el primero no tiene "Subir")
    primero ? null : h('button', { class: 'btn', type: 'button', id: `sub-${id}`, on: { click: () => mover(-1) } }, 'Subir'),
    ultimo ? null : h('button', { class: 'btn', type: 'button', id: `baj-${id}`, on: { click: () => mover(1) } }, 'Bajar'),
    puede(rol, 'platos.borrar')
      ? h('button', { class: 'btn peligro empuja', type: 'button', on: { click: borrar } }, 'Borrar plato')
      : h('span', { class: 'help empuja', text: 'Para borrar un plato, pedíselo al dueño.' }),
  ),
  );
}

/* ---------- Pantalla ---------- */
export default async function carta({ sesion, refrescar }) {
  const [categorias, grupos, platos] = await Promise.all([api.categorias(), api.grupos(), api.platos()]);
  if (!categorias.some((c) => c.id === ui.cat)) ui.cat = categorias[0].id;
  let panelActual = null;

  const buscador = h('input', { class: 'input', id: 'buscar', type: 'search', placeholder: 'Ej: bife, provoleta…', autocomplete: 'off', value: ui.busqueda });

  function pintar() {
    if (!panelActual) return;
    const q = ui.busqueda.trim().toLowerCase();
    const lista = platos.filter((p) => (q ? es(p.nombre).toLowerCase().includes(q) : p.categoria === ui.cat));
    const nombreCat = categorias.find((c) => c.id === ui.cat).nombre;
    const titulo = q ? `Resultados para "${ui.busqueda.trim()}"` : `Platos de ${nombreCat}`;
    const nuevo = ui.editando === 'nuevo' && !q
      ? edicion({ id: 'nuevo', categoria: ui.cat, nombre: { es: '' }, descripcion: { es: '' }, precio: null }, { rol: sesion.rol, refrescar, esNuevo: true })
      : null;

    montar(panelActual, h('section', { class: 'card flush', 'aria-label': titulo },
      h('div', { class: 'lista-cab' },
        h('span', { text: lista.length === 1 ? '1 plato' : `${lista.length} platos` }),
        h('span', { text: 'Disponible en la web' })),
      nuevo,
      lista.length
        ? lista.map((p, i) => {
          const hermanos = lista.filter((x) => (x.grupo || null) === (p.grupo || null));
          return [
            // Subtítulo cuando cambia el grupo (ej. Bodega: Malbec, Blancos…)
            !q && p.grupo && p.grupo !== lista[i - 1]?.grupo
              ? h('div', { class: 'grupo-cab', text: grupos.find((g) => g.id === p.grupo)?.nombre || '' })
              : null,
            ui.editando === p.id
              ? edicion(p, { rol: sesion.rol, refrescar, primero: hermanos[0] === p, ultimo: hermanos[hermanos.length - 1] === p })
              : fila(p, refrescar),
          ];
        })
        : h('div', { class: 'row' }, h('span', { class: 'muted', text: q ? 'No encontramos platos con ese nombre.' : 'Todavía no hay platos en esta categoría.' })),
    ));
  }

  const { lista: tabs, panel } = pestanas({
    etiqueta: 'Categorías',
    items: categorias.map((c) => ({ id: c.id, label: c.nombre })),
    actual: ui.cat,
    alElegir: (id, p) => {
      if (id !== ui.cat) { ui.editando = null; ui.fotoNueva = undefined; }
      ui.cat = id; panelActual = p; pintar();
    },
  });

  buscador.addEventListener('input', () => { ui.busqueda = buscador.value; ui.editando = null; pintar(); });

  const agregar = async () => {
    ui.busqueda = ''; ui.editando = 'nuevo'; ui.fotoNueva = undefined;
    await refrescar();
    document.getElementById('n-nuevo')?.focus();
  };

  return h('div', { class: 'page' },
    encabezado('Carta', 'Los cambios se ven en la web apenas tocás “Guardar”.',
      puede(sesion.rol, 'platos.agregar')
        ? h('button', { class: 'btn pri', type: 'button', id: 'btn-agregar', on: { click: agregar } }, icono('mas', 20), 'Agregar plato')
        : null),
    h('div', { class: 'barra' },
      h('div', { class: 'barra-buscar' }, h('label', { class: 'sr-only', for: 'buscar' }, 'Buscar un plato'), buscador),
    ),
    tabs,
    panel,
    h('p', { class: 'help', text: 'Para ordenar o borrar un plato, tocá “Editar”. Así la lista queda limpia y no se borra nada sin querer.' }),
  );
}
