'use client'

import { Bell, Search, User, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title section */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </motion.div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Notificaciones</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { type: 'alert', title: 'Alerta de temperatura', desc: 'Camión ABC-123 superó umbral', time: 'Hace 5 min' },
                    { type: 'success', title: 'Transporte completado', desc: 'Ruta Santiago-Valparaíso', time: 'Hace 15 min' },
                    { type: 'info', title: 'Nuevo sensor conectado', desc: 'Sensor RFID-004 activado', time: 'Hace 1 hora' },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-100' :
                            notif.type === 'success' ? 'bg-emerald-100' : 'bg-blue-100'
                          }`}>
                          {notif.type === 'alert' && <span className="text-red-500">⚠️</span>}
                          {notif.type === 'success' && <span className="text-emerald-500">✓</span>}
                          {notif.type === 'info' && <span className="text-blue-500">ℹ</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 truncate">{notif.desc}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User menu */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-2 pr-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700">Admin</p>
              <p className="text-xs text-slate-500">admin@coldchain.cl</p>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}
