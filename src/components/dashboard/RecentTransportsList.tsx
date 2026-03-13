'use client'

import { motion } from 'framer-motion'
import { Package, MapPin, Clock, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

interface Transport {
    id: string
    codigo: string
    origen: string
    destino: string
    estado: string
    fechaInicio: Date | null
    fechaFin: Date | null
    camion?: {
        patente: string
    }
}

interface RecentTransportsListProps {
    transports: Transport[]
}

const getEstadoStyles = (estado: string) => {
    switch (estado) {
        case 'EN_CURSO':
            return {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                badge: 'bg-emerald-100 text-emerald-700',
                icon: CheckCircle,
                iconColor: 'text-emerald-500',
                label: 'En curso',
            }
        case 'COMPLETADO':
            return {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-700',
                icon: CheckCircle,
                iconColor: 'text-blue-500',
                label: 'Completado',
            }
        case 'CON_INCIDENTE':
            return {
                bg: 'bg-red-50',
                border: 'border-red-200',
                badge: 'bg-red-100 text-red-700',
                icon: AlertCircle,
                iconColor: 'text-red-500',
                label: 'Con incidente',
            }
        case 'CANCELADO':
            return {
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                badge: 'bg-slate-100 text-slate-700',
                icon: XCircle,
                iconColor: 'text-slate-500',
                label: 'Cancelado',
            }
        default:
            return {
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                badge: 'bg-slate-100 text-slate-600',
                icon: Clock,
                iconColor: 'text-slate-400',
                label: 'Programado',
            }
    }
}

export default function RecentTransportsList({ transports }: RecentTransportsListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Transportes Recientes</h3>
                            <p className="text-xs text-slate-500">Últimas operaciones de logística</p>
                        </div>
                    </div>
                    <Link
                        href="/transportes"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                        Ver todos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Transports list */}
            <div className="divide-y divide-slate-50">
                {transports.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 text-sm">No hay transportes registrados</p>
                        <p className="text-slate-400 text-xs mt-1">Los nuevos transportes aparecerán aquí</p>
                    </div>
                ) : (
                    transports.map((transport, index) => {
                        const styles = getEstadoStyles(transport.estado)
                        const Icon = styles.icon

                        return (
                            <motion.div
                                key={transport.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Status icon */}
                                    <div className={`w-10 h-10 rounded-lg ${styles.bg} border ${styles.border} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                {transport.codigo}
                                            </span>
                                            {transport.camion && (
                                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                    {transport.camion.patente}
                                                </span>
                                            )}
                                        </div>

                                        {/* Route */}
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-emerald-500" />
                                                <span className="truncate max-w-24">{transport.origen}</span>
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-red-500" />
                                                <span className="truncate max-w-24">{transport.destino}</span>
                                            </div>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {transport.fechaInicio
                                                    ? formatDateTime(transport.fechaInicio)
                                                    : 'Por iniciar'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge} flex-shrink-0`}>
                                        {styles.label}
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>

            {/* Footer with stats */}
            {transports.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                En curso: {transports.filter(t => t.estado === 'EN_CURSO').length}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Completados: {transports.filter(t => t.estado === 'COMPLETADO').length}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Incidentes: {transports.filter(t => t.estado === 'CON_INCIDENTE').length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
