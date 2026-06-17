'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Thread {
  id: string
  title: string
  author: { username: string; level: number; class: string }
  views: number
  _count: { comments: number }
  createdAt: string
  parentId?: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  requireRole: string | null
  rules: string | null
}

export default function ForumPage() {
  const params = useParams()
  const router = useRouter()
  const [threads, setThreads] = useState<Thread[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/threads?categoryId=${params.categoryId}`).then(r => r.json()),
      fetch('/api/auth/me').then(r => r.json()).catch(() => null),
    ])
      .then(([threadsData, userData]) => {
        setThreads(threadsData)
        if (userData?.id) setUser(userData)
        if (threadsData.length > 0) {
          setCategory(threadsData[0].category)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.categoryId])

  const canCreateThread = () => {
    if (!user || !category) return false
    if (!category.requireRole) return true
    return user.role === 'ADMIN' || user.role === category.requireRole
  }

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          categoryId: params.categoryId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка создания темы')
        setSubmitting(false)
        return
      }

      setShowCreateForm(false)
      setTitle('')
      setContent('')
      
      // Refresh threads
      fetch(`/api/threads?categoryId=${params.categoryId}`)
        .then(r => r.json())
        .then(data => setThreads(data))
      
      setSubmitting(false)
    } catch (err) {
      setError('Произошла ошибка')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6">
            <Link href="/" onMouseDown={playClickSound} className="text-primary-500 hover:underline font-medium">
              ← Главная
            </Link>
            <h1 className="text-3xl text-white mt-2 font-bold">{category?.name || 'Категория'}</h1>
            {category?.description && (
              <p className="text-slate-400 mt-2">{category.description}</p>
            )}
          </div>

          {category?.rules && (
            <Card className="mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📜</div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Правила раздела</h3>
                  <div className="text-slate-300 text-sm whitespace-pre-line">{category.rules}</div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <div></div>
            {canCreateThread() ? (
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Отмена' : '+ Создать тему'}
              </Button>
            ) : user ? (
              <div className="text-yellow-400 text-sm">
                {category?.requireRole 
                  ? `⚠️ Для создания тем требуется роль: ${category.requireRole}`
                  : '⚠️ Для создания тем требуется авторизация'
                }
              </div>
            ) : (
              <Link href="/auth/login" onMouseDown={playClickSound}>
                <Button>Войти для создания темы</Button>
              </Link>
            )}
          </div>
        </motion.div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <h2 className="text-xl text-white mb-4 font-semibold">Создать тему</h2>
              <p className="text-slate-400 text-sm mb-4">Стоимость: 10 💎 Маны</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateThread} className="space-y-4">
                <Input
                  label="Заголовок"
                  placeholder="Название темы"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  label="Содержание"
                  placeholder="Ваше сообщение..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Создание...' : 'Создать тему'}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center text-primary-500">Загрузка...</div>
        ) : threads.length === 0 ? (
          <Card>
            <p className="text-center text-slate-400">Тем пока нет. Будьте первым!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                onMouseDown={playClickSound}
              >
                <Card hover>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg text-white font-semibold mb-2 hover:text-primary-500 transition-colors">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>
                          <span className="text-white font-medium">{thread.author.username}</span>
                          <span className="text-xs ml-1 text-slate-500">Ур. {thread.author.level}</span>
                        </span>
                        <span>👁 {thread.views}</span>
                        <span>💬 {thread._count.comments}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
