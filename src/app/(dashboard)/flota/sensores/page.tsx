import Header from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'

const TIPO_BADGE: Record<string, string> = {
  TEMPERATURA: 'bg-red-100 text-red-700',
  HUMEDAD: 'bg-blue-100 text-blue-700',
  GPS: 'bg-green-100 text-green-700',
}

export default async function SensoresPage() {
  const sensores = await prisma.sensor.findMany({
    orderBy: { createdAt: 'desc' },
    include: { camion: true },
  })

  return (
    <div>
      <Header title="Flota - Sensores" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{sensores.length} sensores registrados</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nuevo Sensor
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Código</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Camión</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Última Lectura</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sensores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay sensores registrados</td>
                </tr>
              ) : (
                sensores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{s.codigo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_BADGE[s.tipo] ?? ''}`}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.camion.patente}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {s.ultimaLectura ? formatDateTime(s.ultimaLectura) : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
