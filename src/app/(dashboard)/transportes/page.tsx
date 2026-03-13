import Header from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const ESTADO_BADGE: Record<string, string> = {
  PROGRAMADO: 'bg-gray-100 text-gray-700',
  EN_CURSO: 'bg-green-100 text-green-700',
  COMPLETADO: 'bg-blue-100 text-blue-700',
  CANCELADO: 'bg-red-100 text-red-700',
  CON_INCIDENTE: 'bg-orange-100 text-orange-700',
}

export default async function TransportesPage() {
  const transportes = await prisma.transporte.findMany({
    orderBy: { createdAt: 'desc' },
    include: { camion: true },
  })

  return (
    <div>
      <Header title="Transportes" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{transportes.length} transportes registrados</p>
          <Link
            href="/transportes/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Nuevo Transporte
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Código</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Ruta</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Camión</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transportes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No hay transportes registrados
                  </td>
                </tr>
              ) : (
                transportes.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      <Link href={`/transportes/${t.id}`}>{t.codigo}</Link>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{t.origen} → {t.destino}</td>
                    <td className="px-6 py-4 text-gray-600">{t.camion.patente}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[t.estado] ?? ''}`}>
                        {t.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(t.createdAt)}</td>
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
