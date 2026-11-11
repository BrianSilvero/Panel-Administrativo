/* Configuración del panel. SIN secretos: nada de claves ni tokens acá.
   modo 'demo' → datos de prueba (js/api/mock.js). 'real' → js/api/remote.js (todavía vacío). */
export const CONFIG = Object.freeze({
  modo: 'demo',
  /* Datos del cliente: lo único que cambia al usar el panel para otro negocio
     (más los datos de js/demo/ y la imagen en img/). El ícono de la pestaña es genérico. */
  cliente: 'Fredy',
  logo: 'img/logo-fredy.jpg',
  logoAlt: 'Fredy Puerto Madero',
  inactividadMin: 15,
  /* "Vista del cliente": dirección de la web pública (ej. 'https://fredy.com.ar').
     null = todavía sin configurar. Cada sección abre su página equivalente. */
  webPublica: null,
  /* Secciones del menú que este cliente no usa (ej. ['shows', 'pedidos']). */
  seccionesOcultas: [],
  paginasWeb: {
    inicio: '/', carta: '/carta.html', pedidos: '/pedir.html', reservas: '/reservar.html',
    horarios: '/contacto.html', shows: '/noches-de-show.html', resumen: '/', ajustes: '/',
  },
});
