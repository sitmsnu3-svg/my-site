'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

interface Thread {
  id: string
  title: string
  content: string
  author: { username: string; id: string }
  category: { name: string; id: string }
  views: number
  _count: { comments: number }
  createdAt: string
}

export default function AdminThreads() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/admin/threads')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setThreads(data)
        } else {
          console.error('Expected array but got:', data)
          setThreads([])
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setThreads([])
      })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту тему? Все комментарии также будут удалены.')) return

    try {
      const res = await fetch(`/api/admin/threads/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setThreads(threads.filter(t => t.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.author.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">💬 Управление темами</h1>
      
      <Card className="mb-6">
        <Input
          placeholder="Поиск по названию или автору..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {loading ? (
        <div className="text-center text-primary-500">Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <Card key={thread.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{thread.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span>Автор: <span className="text-primary-500">{thread.author.username}</span></span>
                    <span>Категория: <span className="text-primary-500">{thread.category.name}</span></span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span>👁 {thread.views}</span>
                    <span>💬 {thread._count.comments}</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Создан: {new Date(thread.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`/thread/${thread.id}`}
                      className="text-primary-500 hover:underline text-sm"
                    >
                      Просмотреть на сайте →
                    </Link>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(thread.id)}
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
