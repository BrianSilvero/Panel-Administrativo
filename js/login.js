/* Ingreso. En modo demo se entra con un rol de prueba; el ingreso real
   (email + contraseña + código de 6 números) llega con el backend. */
import { api, esDemo } from './api/index.js';
import { CONFIG } from './config.js';
import { iniciarSesion, leerSesion, motivoCierre } from './core/session.js';

const $ = (id) => document.getElementById(id);

// Marca del cliente (config.js)
document.title = `Ingresar · Panel ${CONFIG.cliente}`;
const logo = document.querySelector('.login-logo');
logo.src = CONFIG.logo;
logo.alt = CONFIG.logoAlt;

if (leerSesion()) location.replace('panel.html');

// Mostrar / Ocultar contraseña (con palabra, nunca solo un ícono)
$('ver-clave').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const visible = $('clave').type === 'text';
  $('clave').type = visible ? 'password' : 'text';
  btn.textContent = visible ? 'Mostrar' : 'Ocultar';
  btn.setAttribute('aria-pressed', String(!visible));
});

function aviso(texto) {
  const p = $('aviso-ingreso');
  p.textContent = texto;
  p.hidden = !texto;
}

$('form-ingreso').addEventListener('submit', (e) => {
  e.preventDefault();
  if (esDemo) {
    aviso('En el modo demo usá los botones "Entrar como Dueño" o "Entrar como Encargado".');
    return;
  }
  aviso('El ingreso real todavía no está conectado.');
});

if (esDemo) {
  $('cinta').hidden = false;
  $('ingreso-demo').hidden = false;
  for (const btn of document.querySelectorAll('[data-rol]')) {
    btn.addEventListener('click', async () => {
      const u = await api.usuarioDemo(btn.dataset.rol);
      if (!u) return;
      iniciarSesion({ rol: u.rol, nombre: u.nombre, email: u.email });
      location.href = 'panel.html#inicio';
    });
  }
}

if (motivoCierre() === 'inactividad') {
  aviso('Cerramos tu sesión porque no se usó por un rato. Volvé a entrar.');
}
