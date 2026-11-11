/* Único punto de acceso a los datos. Las vistas importan `api` de acá y no saben
   si los datos vienen del demo o del backend real. */
import { CONFIG } from '../config.js';
import { mock } from './mock.js';
import { remote } from './remote.js';

export const api = CONFIG.modo === 'demo' ? mock : remote;
export const esDemo = CONFIG.modo === 'demo';
