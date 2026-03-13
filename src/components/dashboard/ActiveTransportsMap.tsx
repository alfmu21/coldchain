'use client'

import { motion } from 'framer-motion'
import { MapPin, Navigation, Truck, Clock } from 'lucide-react'

interface TransportLocation {
    id: string
    codigo: string
    origen: string
    destino: string
    lat: number
    lng: number
    temperatura: number
    estado: 'normal' | 'warning' | 'danger'
    progreso: number
}

interface ActiveTransportsMapProps {
    transports: TransportLocation[]
}

export default function ActiveTransportsMap({ transports }: ActiveTransportsMapProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Transportes Activos</h3>
                            <p className="text-xs text-slate-500">Ubicación en tiempo real</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {transports.length} activos
                    </span>
                </div>
            </div>

            {/* Map placeholder with animated background */}
            <div className="relative h-80 map-placeholder">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Animated transport markers */}
                {transports.map((transport, index) => (
                    <motion.div
                        key={transport.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                        className="absolute cursor-pointer group"
                        style={{
                            left: `${20 + index * 25}%`,
                            top: `${30 + (index % 3) * 20}%`,
                        }}
                    >
                        {/* Pulse animation */}
                        <div className={`absolute inset-0 rounded-full ${transport.estado === 'normal' ? 'bg-emerald-500' :
                                transport.estado === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                            } opacity-30 animate-ping`} style={{ width: 40, height: 40, marginLeft: -8, marginTop: -8 }} />

                        {/* Marker */}
                        <div className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${transport.estado === 'normal' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                                transport.estado === 'warning' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                                    'bg-gradient-to-br from-red-400 to-red-600'
                            }`}>
                            <Truck className="w-3 h-3 text-white" />
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-white rounded-lg shadow-xl p-3 min-w-48 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-800">{transport.codigo}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${transport.estado === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                                            transport.estado === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {transport.temperatura}°C
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 space-y-1">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{transport.origen} → {transport.destino}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Progreso: {transport.progreso}%</span>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${transport.progreso}%` }}
                                        transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                                        className={`h-full rounded-full ${transport.estado === 'normal' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                                                transport.estado === 'warning' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                                                    'bg-gradient-to-r from-red-400 to-rose-400'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Chile silhouette hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-9xl">🇨🇱</span>
                </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                            <span className="text-slate-600">Normal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
                            <span className="text-slate-600">Advertencia</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600" />
                            <span className="text-slate-600">Crítico</span>
                        </div>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Ver mapa completo →
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
