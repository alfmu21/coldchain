import Header from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

const RESULTADO_BADGE: Record<string, string> = {
  APROBADO: 'bg-green-100 text-green-700',
  RECHAZADO: 'bg-red-100 text-red-700',
  CON_OBSERVACIONES: 'bg-yellow-100 text-yellow-700',
}

export default async function CertificadosPage() {
  const certificados = await prisma.certificado.findMany({
    orderBy: { createdAt: 'desc' },
    include: { transporte: true },
  })

  return (
    <div>
      <Header title="Certificados" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{certificados.length} certificados emitidos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Código</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Transporte</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Resultado</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Fecha Emisión</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Blockchain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {certificados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay certificados emitidos</td>
                </tr>
              ) : (
                certificados.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{c.codigo}</td>
                    <td className="px-6 py-4 text-gray-700">{c.transporte.codigo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${RESULTADO_BADGE[c.resultado] ?? ''}`}>
                        {c.resultado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(c.fechaEmision)}</td>
                    <td className="px-6 py-4">
                      {c.verificado ? (
                        <span className="text-green-600 text-xs font-medium">Verificado</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Pendiente</span>
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
