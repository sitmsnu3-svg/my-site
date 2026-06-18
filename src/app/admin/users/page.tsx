'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface User {
  id: string
  username: string
  email: string
  role: string
  level: number
  xp: number
  currency: number
  class: string | null
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState('')
  const [updating, setUpdating] = useState(false)

  const roles = ['ADVENTURER', 'MODERATOR', 'ADMIN', 'GAME_MASTER', 'GUARDIAN']

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          console.error('Expected array but got:', data)
          setUsers([])
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setUsers([])
      })
  }, [])

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return

    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
        setSelectedUser(null)
        setNewRole('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-400'
      case 'MODERATOR': return 'text-yellow-400'
      case 'GAME_MASTER': return 'text-purple-400'
      case 'GUARDIAN': return 'text-blue-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">👥 Управление пользователями</h1>
      
      <Card className="mb-6">
        <Input
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {loading ? (
        <div className="text-center text-primary-500">Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{user.username}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleColor(user.role)} bg-dark-700`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{user.email}</p>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>Ур. {user.level}</span>
                    <span>XP: {user.xp}</span>
                    <span>💎 {user.currency}</span>
                    {user.class && <span>Класс: {user.class}</span>}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    Создан: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedUser(user)
                    setNewRole(user.role)
                  }}
                >
                  Изменить роль
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Изменить роль для {selectedUser.username}
            </h2>
            <p className="text-slate-400 mb-4">Текущая роль: {selectedUser.role}</p>
            
            <div className="space-y-2 mb-4">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setNewRole(role)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    newRole === role
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-slate-300 hover:bg-dark-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateRole} disabled={updating}>
                {updating ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedUser(null)
                  setNewRole('')
                }}
              >
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
