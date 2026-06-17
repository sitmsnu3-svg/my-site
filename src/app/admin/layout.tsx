'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data || data.role !== 'ADMIN') {
          router.push('/')
          return
        }
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        router.push('/')
      })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <Navbar />
        <div className="text-center text-primary-500">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: '/admin', label: '📊 Обзор', icon: '📊' },
    { href: '/admin/users', label: '👥 Пользователи', icon: '👥' },
    { href: '/admin/categories', label: '📁 Категории', icon: '📁' },
    { href: '/admin/threads', label: '💬 Темы', icon: '💬' },
    { href: '/admin/guilds', label: '⚔️ Гильдии', icon: '⚔️' },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-800 min-h-screen p-6 border-r border-dark-700">
          <h1 className="text-2xl font-bold text-white mb-8">🛡️ Админ-панель</h1>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-300 hover:bg-dark-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-dark-700">
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-dark-700 transition-colors"
            >
              ← Вернуться на сайт
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
