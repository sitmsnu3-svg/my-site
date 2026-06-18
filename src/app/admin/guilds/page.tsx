'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Guild {
  id: string
  name: string
  description: string | null
  leader: { username: string; id: string }
  _count: { members: number }
  createdAt: string
}

export default function AdminGuilds() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/guilds')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGuilds(data)
        } else {
          console.error('Expected array but got:', data)
          setGuilds([])
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setGuilds([])
      })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту гильдию? Все участники будут исключены.')) return

    try {
      const res = await fetch(`/api/admin/guilds/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setGuilds(guilds.filter(g => g.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">⚔️ Управление гильдиями</h1>

      {loading ? (
        <div className="text-center text-primary-500">Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {guilds.map((guild) => (
            <Card key={guild.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{guild.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{guild.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span>Лидер: <span className="text-primary-500">{guild.leader.username}</span></span>
                    <span>Участников: <span className="text-primary-500">{guild._count.members}</span></span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Создана: {new Date(guild.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(guild.id)}
                >
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
