'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Truck,
  Package,
  Bell,
  FileBarChart,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Activity,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    href: '/transportes',
    label: 'Transportes',
    icon: Package,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    href: '/flota/camiones',
    label: 'Flota',
    icon: Truck,
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    href: '/alertas',
    label: 'Alertas',
    icon: Bell,
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    href: '/reportes',
    label: 'Reportes',
    icon: FileBarChart,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    href: '/certificados',
    label: 'Certificados',
    icon: Award,
    gradient: 'from-indigo-500 to-blue-500'
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-12 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-24 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      {/* Logo */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Thermometer size={22} className="text-white" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  ColdChain
                </h1>
                <p className="text-xs text-slate-400 tracking-wider">TRACKER</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'sidebar-link group relative',
                  isActive && 'active'
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active background gradient */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon with gradient on hover */}
                <div className={cn(
                  'relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                  isActive
                    ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                    : 'bg-slate-700/50 group-hover:bg-slate-700'
                )}>
                  <Icon size={18} className={cn(
                    'transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  )} />
                </div>

                {/* Label */}
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'relative z-10 font-medium transition-colors whitespace-nowrap',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator dot */}
                {isActive && !collapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Live indicator */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-4 mb-4 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-xs text-emerald-400 font-medium">Sistema Activo</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <Activity size={12} />
              <span>Monitoreo en tiempo real</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2 relative z-10">
        <Link
          href="/configuracion"
          className="sidebar-link group"
          title={collapsed ? 'Configuración' : undefined}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-700/50 group-hover:bg-slate-700 transition-colors">
            <Settings size={18} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-400 group-hover:text-white transition-colors"
              >
                Configuración
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="sidebar-link group w-full"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-700/50 group-hover:bg-red-500/20 transition-colors">
            <LogOut size={18} className="text-slate-400 group-hover:text-red-400 transition-colors" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-400 group-hover:text-red-400 transition-colors"
              >
                Cerrar sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
