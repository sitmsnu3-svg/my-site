'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'

interface Stats {
  users: number
  threads: number
  comments: number
  guilds: number
  categories: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    threads: 0,
    comments: 0,
    guilds: 0,
    categories: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setStats(data)
        } else {
          console.error('Expected object but got:', data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Пользователи', value: stats.users, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Темы', value: stats.threads, icon: '💬', color: 'from-purple-500 to-purple-600' },
    { label: 'Комментарии', value: stats.comments, icon: '💭', color: 'from-green-500 to-green-600' },
    { label: 'Гильдии', value: stats.guilds, icon: '⚔️', color: 'from-red-500 to-red-600' },
    { label: 'Категории', value: stats.categories, icon: '📁', color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">📊 Обзор системы</h1>
      
      {loading ? (
        <div className="text-center text-primary-500">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label} hover className="bg-gradient-to-br from-dark-800 to-dark-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-5xl">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-br from-dark-800 to-dark-900">
        <h2 className="text-xl font-bold text-white mb-4">🚀 Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-white"
          >
            👥 Управление пользователями
          </a>
          <a
            href="/admin/categories"
            className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-white"
          >
            📁 Управление категориями
          </a>
          <a
            href="/admin/threads"
            className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-white"
          >
            💬 Управление темами
          </a>
          <a
            href="/admin/guilds"
            className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-white"
          >
            ⚔️ Управление гильдиями
          </a>
        </div>
      </Card>
    </div>
  )
}
