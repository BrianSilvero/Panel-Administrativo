/* Backend real: se completa en otra etapa (ver docs/API.md).
   Debe exponer las mismas funciones que mock.js para que ninguna vista cambie. */
import { ErrorApi } from './errors.js';

const pendiente = async () => { throw new ErrorApi('El backend real todavía no está conectado.', 'sin-backend'); };

export const remote = new Proxy({}, { get: () => pendiente });
