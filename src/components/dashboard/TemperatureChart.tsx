'use client'

import { motion } from 'framer-motion'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'
import { Thermometer, TrendingUp } from 'lucide-react'

interface TemperatureChartProps {
    data: Array<{
        time: string
        temperatura: number
        humedad?: number
    }>
    title?: string
    showHumidity?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name === 'temperatura' ? '🌡️' : '💧'} {entry.name}: {entry.value.toFixed(1)}°
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function TemperatureChart({
    data,
    title = 'Temperatura en Tiempo Real',
    showHumidity = false
}: TemperatureChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Thermometer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">{title}</h3>
                        <p className="text-xs text-slate-500">Últimas 24 horas</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Normal
                    </span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="temperatura"
                            name="temperatura"
                            stroke="#f97316"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                        {showHumidity && (
                            <Area
                                type="monotone"
                                dataKey="humedad"
                                name="humedad"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorHumidity)"
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Temperature range indicators */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                        <span className="text-slate-500">Mín: 2°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
                        <span className="text-slate-500">Máx: 8°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                        <span className="text-slate-500">Prom: 4°C</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
