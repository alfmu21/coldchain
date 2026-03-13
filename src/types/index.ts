// Tipos base del sistema ColdChain Tracker

export type RolUsuario = 'ADMIN' | 'TRANSPORTISTA' | 'CLIENTE' | 'ASEGURADORA'
export type TipoEmpresa = 'TRANSPORTISTA' | 'CLIENTE' | 'ASEGURADORA'
export type TipoSensor = 'TEMPERATURA' | 'HUMEDAD' | 'GPS'
export type EstadoTransporte = 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO' | 'CON_INCIDENTE'
export type TipoAlerta = 'TEMPERATURA_ALTA' | 'TEMPERATURA_BAJA' | 'HUMEDAD_ALTA' | 'HUMEDAD_BAJA' | 'SIN_CONEXION' | 'BATERIA_BAJA'
export type SeveridadAlerta = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
export type ResultadoCertificado = 'APROBADO' | 'RECHAZADO' | 'CON_OBSERVACIONES'

export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: RolUsuario
  empresaId?: string | null
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Empresa {
  id: string
  nombre: string
  rut: string
  tipo: TipoEmpresa
  direccion?: string | null
  telefono?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Camion {
  id: string
  patente: string
  marca?: string | null
  modelo?: string | null
  anio?: number | null
  empresaId: string
  empresa?: Empresa
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sensor {
  id: string
  codigo: string
  camionId: string
  camion?: Camion
  tipo: TipoSensor
  fechaInstalacion: Date
  ultimaLectura?: Date | null
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transporte {
  id: string
  codigo: string
  camionId: string
  camion?: Camion
  origen: string
  destino: string
  fechaInicio?: Date | null
  fechaFin?: Date | null
  estado: EstadoTransporte
  temperaturaMin?: number | null
  temperaturaMax?: number | null
  humedadMin?: number | null
  humedadMax?: number | null
  descripcion?: string | null
  clienteNombre?: string | null
  clienteRut?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Lectura {
  id: string
  sensorId: string
  sensor?: Sensor
  transporteId: string
  transporte?: Transporte
  timestamp: Date
  temperatura?: number | null
  humedad?: number | null
  latitud?: number | null
  longitud?: number | null
  sincronizado: boolean
  createdAt: Date
}

export interface Alerta {
  id: string
  sensorId: string
  sensor?: Sensor
  transporteId: string
  transporte?: Transporte
  tipo: TipoAlerta
  severidad: SeveridadAlerta
  mensaje: string
  valor?: number | null
  umbral?: number | null
  timestamp: Date
  reconocida: boolean
  reconocidaPor?: string | null
  reconocidaEn?: Date | null
  createdAt: Date
}

export interface Certificado {
  id: string
  transporteId: string
  transporte?: Transporte
  codigo: string
  fechaEmision: Date
  resultado: ResultadoCertificado
  observaciones?: string | null
  txHash?: string | null
  smartContract?: string | null
  verificado: boolean
  createdAt: Date
}

// Payload IoT
export interface LecturaPayload {
  sensorCodigo: string
  transporteCodigo: string
  timestamp: string
  temperatura?: number
  humedad?: number
  latitud?: number
  longitud?: number
  bateria?: number
}

export interface BatchLecturaPayload {
  lecturas: LecturaPayload[]
}

// Respuestas API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Métricas del dashboard
export interface DashboardMetrics {
  transportesActivos: number
  alertasHoy: number
  flotaTotal: number
  certificadosEmitidos: number
}
