import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import MetricCard from '@/components/dashboard/MetricCard'
import TemperatureChart from '@/components/dashboard/TemperatureChart'
import ActiveTransportsMap from '@/components/dashboard/ActiveTransportsMap'
import RecentAlertsList from '@/components/dashboard/RecentAlertsList'
import RecentTransportsList from '@/components/dashboard/RecentTransportsList'
import {
  Truck,
  Bell,
  Thermometer,
  Award,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { ESTADO_TRANSPORTE } from '@/lib/constants'

async function getDashboardData() {
  const [
    transportesActivos,
    alertasHoy,
    flotaTotal,
    certificadosTotal,
    ultimasAlertas,
    transportesRecientes,
    lecturasRecientes,
  ] = await Promise.all([
    prisma.transporte.count({ where: { estado: ESTADO_TRANSPORTE.EN_CURSO } }),
    prisma.alerta.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.camion.count({ where: { activo: true } }),
    prisma.certificado.count(),
    prisma.alerta.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: { transporte: true, sensor: true },
    }),
    prisma.transporte.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { camion: true },
    }),
    prisma.lectura.findMany({
      take: 24,
      orderBy: { timestamp: 'desc' },
      where: { temperatura: { not: null } },
    }),
  ])

  return {
    transportesActivos,
    alertasHoy,
    flotaTotal,
    certificadosTotal,
    ultimasAlertas,
    transportesRecientes,
    lecturasRecientes,
  }
}

// Sample data for chart when no real data exists
const sampleChartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperatura: 3 + Math.random() * 3,
  humedad: 65 + Math.random() * 15,
}))

// Sample data for map
const sampleTransports = [
  { id: '1', codigo: 'TRANS-001', origen: 'Santiago', destino: 'Valparaíso', lat: -33.45, lng: -70.65, temperatura: 4.2, estado: 'normal' as const, progreso: 65 },
  { id: '2', codigo: 'TRANS-002', origen: 'Santiago', destino: 'Concepción', lat: -33.45, lng: -70.65, temperatura: 8.5, estado: 'warning' as const, progreso: 30 },
  { id: '3', codigo: 'TRANS-003', origen: 'Antofagasta', destino: 'Santiago', lat: -33.45, lng: -70.65, temperatura: 2.1, estado: 'normal' as const, progreso: 85 },
]

export default async function DashboardPage() {
  const data = await getDashboardData()

  const metricas = [
    {
      title: 'Transportes Activos',
      value: data.transportesActivos,
      subtitle: 'En curso ahora',
      icon: Truck,
      gradient: 'from-blue-500 to-cyan-500',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Alertas Hoy',
      value: data.alertasHoy,
      subtitle: 'Requieren atención',
      icon: Bell,
      gradient: 'from-red-500 to-orange-500',
      trend: { value: 5, isPositive: false },
    },
    {
      title: 'Flota Total',
      value: data.flotaTotal,
      subtitle: 'Camiones activos',
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Certificados',
      value: data.certificadosTotal,
      subtitle: 'Emitidos totales',
      icon: Award,
      gradient: 'from-violet-500 to-purple-500',
      trend: { value: 8, isPositive: true },
    },
  ]

  // Prepare chart data
  const chartData = data.lecturasRecientes.length > 0
    ? data.lecturasRecientes
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map(l => ({
        time: l.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        temperatura: l.temperatura ?? 0,
        humedad: l.humedad ?? 0,
      }))
    : sampleChartData

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Monitoreo en tiempo real de la cadena de frío"
      />

      <div className="p-6 space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((m, index) => (
            <MetricCard
              key={m.title}
              title={m.title}
              value={m.value}
              subtitle={m.subtitle}
              icon={m.icon}
              gradient={m.gradient}
              trend={m.trend}
              index={index}
            />
          ))}
        </div>

        {/* Gráfico y Mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemperatureChart
            data={chartData}
            title="Temperatura del Sistema"
            showHumidity={true}
          />
          <ActiveTransportsMap transports={sampleTransports} />
        </div>

        {/* Alertas y Transportes recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAlertsList alerts={data.ultimasAlertas.map(a => ({
            id: a.id,
            tipo: a.tipo,
            severidad: a.severidad,
            mensaje: a.mensaje,
            timestamp: a.timestamp,
            transporte: a.transporte ? { codigo: a.transporte.codigo } : undefined,
            sensor: a.sensor ? { codigo: a.sensor.codigo } : undefined,
          }))} />
          <RecentTransportsList transports={data.transportesRecientes.map(t => ({
            id: t.id,
            codigo: t.codigo,
            origen: t.origen,
            destino: t.destino,
            estado: t.estado,
            fechaInicio: t.fechaInicio,
            fechaFin: t.fechaFin,
            camion: t.camion ? { patente: t.camion.patente } : undefined,
          }))} />
        </div>

        {/* Quick stats footer */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Resumen del Sistema</p>
                <p className="text-lg font-semibold">ColdChain Tracker está operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{data.transportesActivos}</p>
                <p className="text-xs text-slate-400">Transportes activos</p>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-center">
                <p className="text-2xl font-bold">{data.flotaTotal}</p>
                <p className="text-xs text-slate-400">Sensores activos</p>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">99.9%</p>
                <p className="text-xs text-slate-400">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
