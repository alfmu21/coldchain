'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Thermometer, Droplets, Wifi, Battery, Clock, ArrowRight } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface Alert {
    id: string
    tipo: string
    severidad: string
    mensaje: string
    timestamp: Date
    transporte?: {
        codigo: string
    }
    sensor?: {
        codigo: string
    }
}

interface RecentAlertsListProps {
    alerts: Alert[]
}

const getAlertIcon = (tipo: string) => {
    switch (tipo) {
        case 'TEMPERATURA_ALTA':
        case 'TEMPERATURA_BAJA':
            return Thermometer
        case 'HUMEDAD_ALTA':
        case 'HUMEDAD_BAJA':
            return Droplets
        case 'SIN_CONEXION':
            return Wifi
        case 'BATERIA_BAJA':
            return Battery
        default:
            return AlertTriangle
    }
}

const getAlertStyles = (severidad: string) => {
    switch (severidad) {
        case 'CRITICA':
            return {
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: 'bg-red-100 text-red-600',
                badge: 'bg-red-100 text-red-700',
                pulse: true,
            }
        case 'ALTA':
            return {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                icon: 'bg-orange-100 text-orange-600',
                badge: 'bg-orange-100 text-orange-700',
                pulse: true,
            }
        case 'MEDIA':
            return {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                icon: 'bg-amber-100 text-amber-600',
                badge: 'bg-amber-100 text-amber-700',
                pulse: false,
            }
        default:
            return {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'bg-blue-100 text-blue-600',
                badge: 'bg-blue-100 text-blue-700',
                pulse: false,
            }
    }
}

export default function RecentAlertsList({ alerts }: RecentAlertsListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center relative">
                            <AlertTriangle className="w-5 h-5 text-white" />
                            {alerts.some(a => a.severidad === 'CRITICA') && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Alertas Recientes</h3>
                            <p className="text-xs text-slate-500">Últimas notificaciones del sistema</p>
                        </div>
                    </div>
                    <Link
                        href="/alertas"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                        Ver todas
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Alerts list */}
            <div className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                    {alerts.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-sm">No hay alertas recientes</p>
                            <p className="text-slate-400 text-xs mt-1">El sistema funciona normalmente</p>
                        </div>
                    ) : (
                        alerts.map((alert, index) => {
                            const Icon = getAlertIcon(alert.tipo)
                            const styles = getAlertStyles(alert.severidad)

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 ${styles.bg} border-l-4 ${styles.border} hover:bg-opacity-70 transition-colors cursor-pointer group`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`relative w-10 h-10 rounded-lg ${styles.icon} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-5 h-5" />
                                            {styles.pulse && (
                                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                                                        {alert.mensaje}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                        {alert.transporte && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <span className="font-medium">{alert.transporte.codigo}</span>
                                                            </span>
                                                        )}
                                                        {alert.sensor && (
                                                            <span className="inline-flex items-center gap-1">
                                                                • {alert.sensor.codigo}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge} flex-shrink-0`}>
                                                    {alert.severidad}
                                                </span>
                                            </div>

                                            {/* Timestamp */}
                                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDateTime(alert.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with summary */}
            {alerts.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Críticas: {alerts.filter(a => a.severidad === 'CRITICA').length}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Medias: {alerts.filter(a => a.severidad === 'MEDIA' || a.severidad === 'ALTA').length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
