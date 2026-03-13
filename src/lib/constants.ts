// Roles de usuario
export const ROL_USUARIO = {
  ADMIN: 'ADMIN',
  TRANSPORTISTA: 'TRANSPORTISTA',
  CLIENTE: 'CLIENTE',
  ASEGURADORA: 'ASEGURADORA',
} as const

// Estados de transporte
export const ESTADO_TRANSPORTE = {
  PROGRAMADO: 'PROGRAMADO',
  EN_CURSO: 'EN_CURSO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO',
  CON_INCIDENTE: 'CON_INCIDENTE',
} as const

// Tipos de sensor
export const TIPO_SENSOR = {
  TEMPERATURA: 'TEMPERATURA',
  HUMEDAD: 'HUMEDAD',
  GPS: 'GPS',
} as const

// Tipos de alerta
export const TIPO_ALERTA = {
  TEMPERATURA_ALTA: 'TEMPERATURA_ALTA',
  TEMPERATURA_BAJA: 'TEMPERATURA_BAJA',
  HUMEDAD_ALTA: 'HUMEDAD_ALTA',
  HUMEDAD_BAJA: 'HUMEDAD_BAJA',
  SIN_CONEXION: 'SIN_CONEXION',
  BATERIA_BAJA: 'BATERIA_BAJA',
} as const

// Severidad de alerta
export const SEVERIDAD_ALERTA = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
} as const

// Resultado de certificado
export const RESULTADO_CERTIFICADO = {
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
  CON_OBSERVACIONES: 'CON_OBSERVACIONES',
} as const

// Colores para severidad
export const SEVERIDAD_COLORES = {
  BAJA: 'text-blue-600 bg-blue-50',
  MEDIA: 'text-yellow-600 bg-yellow-50',
  ALTA: 'text-orange-600 bg-orange-50',
  CRITICA: 'text-red-600 bg-red-50',
} as const

// Colores para estado de transporte
export const ESTADO_COLORES = {
  PROGRAMADO: 'text-gray-600 bg-gray-50',
  EN_CURSO: 'text-green-600 bg-green-50',
  COMPLETADO: 'text-blue-600 bg-blue-50',
  CANCELADO: 'text-red-600 bg-red-50',
  CON_INCIDENTE: 'text-orange-600 bg-orange-50',
} as const
