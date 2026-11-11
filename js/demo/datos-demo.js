/* Datos de PRUEBA para el modo demo. Sin datos personales reales: ni nombres, ni teléfonos,
   ni pedidos de clientes. La carta, los precios, el horario y la dirección sí son los
   públicos de Fredy (Brian lo pidió el 03/11/2026).

   Es una función porque pedidos y reservas se arman con horas relativas a "ahora":
   así el demo muestra un pedido a punto de vencer y reservas que ya pasaron ("¿Vino?"). */
import { CATEGORIAS_DEMO, GRUPOS_DEMO, PLATOS_DEMO } from './carta-demo.js';
import { horaAhora, sumarMinutos, fechaISO } from '../core/rules.js';

const TEL_PRUEBA = '5491100000000';      // número inventado: wa.me no lo encuentra
const CONTACTO_PRUEBA = '+54 11 0000-0000';
const NOMBRE = '[Nombre de prueba]';

export function crearDatosDemo(ahora = new Date()) {
  const t = ahora.getTime();
  const hace = (min) => t - min * 60000;
  // Reservas alrededor de la hora actual, en turnos de media hora
  const ahoraHHMM = horaAhora(ahora);
  const [hh, mm] = ahoraHHMM.split(':').map(Number);
  const base = `${String(hh).padStart(2, '0')}:${mm < 30 ? '00' : '30'}`;
  const hoy = fechaISO(0, ahora);
  const manana = fechaISO(1, ahora);
  // Próximo viernes y sábado (para los shows de ejemplo)
  const diaSemana = new Date(`${hoy}T12:00:00-03:00`).getUTCDay();
  const hastaViernes = ((5 - diaSemana + 7) % 7) || 7;
  const viernes = fechaISO(hastaViernes, ahora);
  const sabado = fechaISO(hastaViernes + 1, ahora);

  return {
    negocio: {
      nombre: 'Fredy',
      direccion: 'Av. Alicia Moreau de Justo 1798',
    },

    usuarios: {
      dueno: { nombre: '[Nombre]', email: 'tunombre@ejemplo.com', rol: 'dueno' },
      encargado: { nombre: '[Nombre]', email: 'encargado@ejemplo.com', rol: 'encargado' },
    },

    // Estado del local (lo que ve el cliente en la web)
    estado: {
      emergencia: null,                       // ver EMERGENCIA en js/core/rules.js
      horarioHoy: { abre: '10:00', cierra: '02:00', fecha: null }, // fecha = cambio solo para ese día
      cerradoHoy: null,                       // 'AAAA-MM-DD' = cerrado ese día
      reservasWeb: true,
      pausas: { reservas: null, pedidos: null }, // null = recibiendo · { hasta: ms } = en pausa
    },

    horarios: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      .map((dia) => ({ dia, abre: '10:00', cierra: '02:00' })),

    // nombre y descripcion preparados para idiomas ({es, en, pt}); la interfaz usa solo es.
    categorias: CATEGORIAS_DEMO,
    grupos: GRUPOS_DEMO,
    platos: PLATOS_DEMO.map((p) => (p.nombre.es === 'Entraña' ? { ...p, disponible: false } : { ...p })),

    // Pedidos para retirar: sin precios ni pagos. `creado` y `avisado` en milisegundos.
    pedidos: [
      { codigo: 'F-0143', estado: 'por-confirmar', creado: hace(27), retiro: 'Lo antes posible', nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['1', 'Asado de Tira Banderita'], ['1', 'Papas Fritas a la Provenzal']], aclaracion: '' },
      { codigo: 'F-0142', estado: 'por-confirmar', creado: hace(4), retiro: 'Lo antes posible', nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['1', 'Bife de Chorizo (400 gr)'], ['1', 'Provoleta Grillada'], ['2', 'Agua Mineral / Saborizada']], aclaracion: 'la provoleta bien dorada' },
      { codigo: 'F-0141', estado: 'en-preparacion', creado: hace(12), retiro: sumarMinutos(ahoraHHMM, 30), nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['2', 'Vacío del Fino'], ['1', 'Papas Fritas a la Provenzal']], aclaracion: '' },
      { codigo: 'F-0140', estado: 'listo', creado: hace(25), avisado: hace(3), retiro: 'Lo antes posible', nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['1', 'Picaña'], ['1', 'Ensalada Mixta']], aclaracion: '' },
      { codigo: 'F-0139', estado: 'retirado', creado: hace(55), cerrado: hace(20), retiro: 'Lo antes posible', nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['1', 'Milanesa de Ternera']], aclaracion: '' },
      { codigo: 'F-0138', estado: 'no-llego', creado: hace(80), cerrado: hace(50), motivo: 'vencido', retiro: 'Lo antes posible', nombre: NOMBRE, whatsapp: TEL_PRUEBA,
        items: [['2', 'Empanadas de lomo a cuchillo (Fritas)']], aclaracion: '' },
    ],

    // Reservas. La nota la escribe el cliente; se borra junto con la reserva.
    reservas: [
      { id: 'r1', fecha: hoy, hora: sumarMinutos(base, -60 + 1440), nombre: NOMBRE, personas: 4, origen: 'web', contacto: CONTACTO_PRUEBA, nota: '', estado: 'confirmada', recordatorio: '20:00' },
      { id: 'r2', fecha: hoy, hora: sumarMinutos(base, -30 + 1440), nombre: NOMBRE, personas: 2, origen: 'telefono', contacto: CONTACTO_PRUEBA, nota: '', estado: 'confirmada' },
      { id: 'r3', fecha: hoy, hora: sumarMinutos(base, 30), nombre: NOMBRE, personas: 2, origen: 'web', contacto: CONTACTO_PRUEBA, nota: 'Mesa afuera si se puede', estado: 'por-confirmar' },
      { id: 'r4', fecha: hoy, hora: sumarMinutos(base, 60), nombre: NOMBRE, personas: 6, origen: 'telefono', contacto: CONTACTO_PRUEBA, nota: '', estado: 'confirmada' },
      { id: 'r5', fecha: hoy, hora: sumarMinutos(base, 90), nombre: NOMBRE, personas: 3, origen: 'web', contacto: CONTACTO_PRUEBA, nota: 'Es un cumpleaños', estado: 'confirmada', recordatorio: '20:00' },
      { id: 'r6', fecha: manana, hora: '21:00', nombre: NOMBRE, personas: 2, origen: 'web', contacto: CONTACTO_PRUEBA, nota: '', estado: 'por-confirmar' },
    ],

    // Shows: noches fijas (como hoy en la web) + shows con fecha. Nombres de ejemplo.
    shows: {
      noches: { dias: [4, 5, 6], hora: '22:00' },
      lista: [
        { id: 's1', nombre: '[Nombre del show de tango]', fecha: viernes, hora: '22:00', descripcion: 'Tango clásico y milongas en vivo.', publicado: true },
        { id: 's2', nombre: '[Nombre del show de folclore]', fecha: sabado, hora: '22:30', descripcion: '', publicado: false },
      ],
    },

    equipo: [
      { id: 'u1', nombre: '[Nombre]', email: 'tunombre@ejemplo.com', rol: 'dueno' },
      { id: 'u2', nombre: '[Nombre]', email: 'encargado@ejemplo.com', rol: 'encargado' },
    ],
  };
}
