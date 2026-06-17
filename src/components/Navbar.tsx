'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.id) setUser(data)
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const playClickSound = () => {
    const audio = new Audio('/sounds/sao_click.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-panel fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-dark-700/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" onMouseDown={playClickSound}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              O
            </div>
            <h1 className="text-2xl font-bold text-white">
              Otaku<span className="text-primary-500">Zone</span>
            </h1>
          </motion.div>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            onMouseDown={playClickSound}
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Главная
          </Link>
          <Link
            href="/guilds"
            onMouseDown={playClickSound}
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Клубы
          </Link>
          <Link
            href="/rules"
            onMouseDown={playClickSound}
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Правила
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{user.username}</p>
                  <p className="text-xs text-slate-400">Ур. {user.level} • 💎 {user.currency}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  setUser(null)
                  window.location.href = '/'
                }}
                onMouseDown={playClickSound}
                className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-slate-300 hover:bg-dark-700 hover:border-dark-600 transition-all"
              >
                Выйти
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                onMouseDown={playClickSound}
                className="px-5 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-slate-300 hover:bg-dark-700 hover:border-dark-600 transition-all font-medium"
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                onMouseDown={playClickSound}
                className="px-5 py-2.5 btn-gradient rounded-xl text-white font-medium"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
