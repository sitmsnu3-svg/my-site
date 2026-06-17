'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { motion } from 'framer-motion'

interface Guild {
  id: string
  name: string
  description: string
  leader: { username: string; level: number }
  _count: { members: number }
}

export default function GuildsPage() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/guilds')
      .then(r => r.json())
      .then(data => {
        setGuilds(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleCreateGuild = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка создания клуба')
        setSubmitting(false)
        return
      }

      setShowCreateForm(false)
      setName('')
      setDescription('')
      
      // Refresh guilds
      fetch('/api/guilds')
        .then(r => r.json())
        .then(data => setGuilds(data))
      
      setSubmitting(false)
    } catch (err) {
      setError('Произошла ошибка')
      setSubmitting(false)
    }
  }

  const handleJoinGuild = async (guildId: string) => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/join`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Ошибка вступления')
        return
      }

      alert('Вы успешно вступили в клуб!')
      
      // Refresh guilds
      fetch('/api/guilds')
        .then(r => r.json())
        .then(data => setGuilds(data))
    } catch (err) {
      alert('Произошла ошибка')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <h1 className="text-3xl text-white font-semibold">Клубы OtakuZone</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Отмена' : '+ Создать клуб'}
          </Button>
        </motion.div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <h2 className="text-xl text-white mb-4 font-semibold">Создать клуб</h2>
              <p className="text-slate-400 text-sm mb-4">Стоимость: 50 💎 Маны</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateGuild} className="space-y-4">
                <Input
                  label="Название клуба"
                  placeholder="Название"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  label="Описание"
                  placeholder="Описание клуба..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Создание...' : 'Создать клуб'}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center text-primary-500">Загрузка...</div>
        ) : guilds.length === 0 ? (
          <Card>
            <p className="text-center text-slate-400">Клубов пока нет. Будьте первым!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guilds.map((guild) => (
              <Card key={guild.id} hover>
                <h3 className="text-xl text-white mb-2 font-semibold">{guild.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{guild.description}</p>
                <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                  <span>Лидер: <span className="text-primary-500">{guild.leader.username}</span></span>
                  <span>Ур. {guild.leader.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-500">{guild._count.members} участников</span>
                  <Button
                    variant="secondary"
                    onClick={() => handleJoinGuild(guild.id)}
                  >
                    Вступить (50💎)
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
