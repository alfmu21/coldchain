import Header from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'

const SEVERIDAD_BADGE: Record<string, string> = {
  BAJA: 'bg-blue-100 text-blue-700',
  MEDIA: 'bg-yellow-100 text-yellow-700',
  ALTA: 'bg-orange-100 text-orange-700',
  CRITICA: 'bg-red-100 text-red-700',
}

export default async function AlertasPage() {
  const alertas = await prisma.alerta.findMany({
    orderBy: { timestamp: 'desc' },
    include: { transporte: true, sensor: true },
    take: 100,
  })

  const noReconocidas = alertas.filter((a) => !a.reconocida).length

  return (
    <div>
      <Header title="Alertas" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            {noReconocidas > 0 && (
              <span className="text-red-600 font-medium">{noReconocidas} sin reconocer · </span>
            )}
            {alertas.length} alertas en total
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Severidad</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Mensaje</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Transporte</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alertas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No hay alertas registradas
                  </td>
                </tr>
              ) : (
                alertas.map((a) => (
                  <tr key={a.id} className={`hover:bg-gray-50 ${!a.reconocida ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERIDAD_BADGE[a.severidad] ?? ''}`}>
                        {a.severidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{a.tipo.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 text-gray-800">{a.mensaje}</td>
                    <td className="px-6 py-4 text-gray-500">{a.transporte.codigo}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDateTime(a.timestamp)}</td>
                    <td className="px-6 py-4">
                      {a.reconocida ? (
                        <span className="text-green-600 text-xs">Reconocida</span>
                      ) : (
                        <span className="text-red-600 text-xs font-medium">Pendiente</span>
                      )}
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
