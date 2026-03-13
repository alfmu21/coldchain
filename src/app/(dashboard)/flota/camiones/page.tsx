import Header from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'

export default async function CamionesPage() {
  const camiones = await prisma.camion.findMany({
    orderBy: { createdAt: 'desc' },
    include: { empresa: true, _count: { select: { sensores: true, transportes: true } } },
  })

  return (
    <div>
      <Header title="Flota - Camiones" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">{camiones.length} camiones registrados</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nuevo Camión
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {camiones.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-12">No hay camiones registrados</p>
          ) : (
            camiones.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{c.patente}</h3>
                  <span className={`w-2.5 h-2.5 rounded-full ${c.activo ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
                <p className="text-gray-600 text-sm">{c.marca} {c.modelo} {c.anio}</p>
                <p className="text-gray-400 text-xs mt-1">{c.empresa?.nombre ?? '-'}</p>
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <span>{c._count.sensores} sensores</span>
                  <span>{c._count.transportes} transportes</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
