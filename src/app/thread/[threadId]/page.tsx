'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  author: { username: string; level: number; class: string }
  createdAt: string
}

interface Thread {
  id: string
  title: string
  content: string
  author: { username: string; level: number; class: string }
  category: { name: string; id: string }
  views: number
  comments: Comment[]
  createdAt: string
}

export default function ThreadPage() {
  const params = useParams()
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/threads/${params.threadId}`)
      .then(r => r.json())
      .then(data => {
        setThread(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.threadId])

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          threadId: params.threadId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка отправки комментария')
        setSubmitting(false)
        return
      }

      setCommentContent('')
      
      // Refresh thread
      fetch(`/api/threads/${params.threadId}`)
        .then(r => r.json())
        .then(data => setThread(data))
      
      setSubmitting(false)
    } catch (err) {
      setError('Произошла ошибка')
      setSubmitting(false)
    }
  }

  const playClickSound = () => {
    const audio = new Audio('/sounds/sao_click.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center text-primary-500">Загрузка...</div>
        ) : thread ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link
                href={`/forum/${thread.category.id}`}
                onMouseDown={playClickSound}
                className="text-primary-500 hover:underline"
              >
                ← {thread.category.name}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <h1 className="text-3xl text-primary-500 mb-4 font-semibold">{thread.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-dark-700/50">
                  <span>
                    Автор: <span className="text-primary-500">{thread.author.username}</span>
                  </span>
                  <span>Ур. {thread.author.level}</span>
                  <span className="text-primary-500">{thread.author.class}</span>
                  <span>👁 {thread.views}</span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap">{thread.content}</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl text-primary-500 mb-4 font-semibold">
                Комментарии ({thread.comments.length})
              </h2>

              {thread.comments.length === 0 ? (
                <Card>
                  <p className="text-center text-slate-400">Комментариев пока нет</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {thread.comments.map((comment) => (
                    <Card key={comment.id}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-primary-500 font-semibold">{comment.author.username}</span>
                          <span className="text-xs text-slate-400">Ур. {comment.author.level}</span>
                          <span className="text-xs text-primary-500">{comment.author.class}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap">{comment.content}</p>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h3 className="text-xl text-primary-500 mb-4 font-semibold">Добавить комментарий</h3>
                <p className="text-slate-400 text-sm mb-4">Награда: +5 XP, +2 💎 Маны</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleComment} className="space-y-4">
                  <Textarea
                    placeholder="Ваш комментарий..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={4}
                  />
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Отправка...' : 'Отправить'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </>
        ) : (
          <Card>
            <p className="text-center text-slate-400">Тема не найдена</p>
          </Card>
        )}
      </div>
    </div>
  )
}
