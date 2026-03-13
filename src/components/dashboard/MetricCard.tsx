'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
    title: string
    value: number | string
    subtitle?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    gradient: string
    index?: number
}

export default function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    gradient,
    index = 0,
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="metric-card hover-lift group"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <motion.p
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                        className="text-3xl font-bold text-slate-800"
                    >
                        {value}
                    </motion.p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={cn(
                            'flex items-center gap-1 mt-2 text-xs font-medium',
                            trend.isPositive ? 'text-emerald-600' : 'text-red-500'
                        )}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-slate-400 font-normal">vs ayer</span>
                        </div>
                    )}
                </div>

                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg',
                        `bg-gradient-to-br ${gradient}`
                    )}
                >
                    <Icon className="w-7 h-7 text-white" />
                </motion.div>
            </div>

            {/* Decorative gradient line */}
            <div className={cn(
                'absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity',
                `bg-gradient-to-r ${gradient}`
            )} />
        </motion.div>
    )
}
