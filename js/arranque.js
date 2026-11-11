/* Se carga en <head> como script clásico (no módulo) para aplicar el tamaño
   de letra antes de pintar la página y evitar el "salto" al cargar.
   Misma clave que js/core/prefs.js. */
(function () {
  try {
    var v = localStorage.getItem('fredy-admin:letra');
    if (v === 'grande' || v === 'muy-grande') document.documentElement.setAttribute('data-letra', v);
  } catch (e) { /* sin almacenamiento: queda Normal */ }
})();
