import Header from '@/components/layout/Header'

export default function ReportesPage() {
  return (
    <div>
      <Header title="Reportes" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-400 text-lg">Módulo de reportes en desarrollo</p>
          <p className="text-gray-300 text-sm mt-2">Próximamente: exportación PDF, CSV y Excel</p>
        </div>
      </div>
    </div>
  )
}
