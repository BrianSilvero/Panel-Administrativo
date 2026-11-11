/* Errores de datos con un mensaje que se le puede mostrar al personal.
   `campos` trae el mensaje de cada campo inválido: { nombre: 'Escribí el nombre…' }. */
export class ErrorApi extends Error {
  constructor(mensaje, codigo = 'error', campos = null) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.codigo = codigo;
    this.campos = campos;
  }
}

export function mensajeDeError(err) {
  if (err instanceof ErrorApi) return err.message;
  return 'Algo no funcionó. Probá de nuevo en un momento.';
}
