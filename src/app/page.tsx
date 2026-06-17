'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  slug?: string
  _count: { threads: number }
}

interface Thread {
  id: string
  title: string
  author: { username: string; level: number; class: string }
  category: { name: string }
  views: number
  _count: { comments: number }
  createdAt: string
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [recentThreads, setRecentThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/threads').then(r => r.json()),
    ])
      .then(([catsData, threadsData]) => {
        setCategories(catsData)
        setRecentThreads(threadsData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Добро пожаловать в <span className="text-primary-500">OtakuZone</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Премиальное сообщество для обсуждения аниме, манги и японской культуры
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-primary-500">Загрузка...</div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl text-white mb-8 font-bold">Категории</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/forum/${category.slug || category.id}`}
                  >
                    <Card hover gradient className="h-full">
                      <div className="text-5xl mb-4">{category.icon}</div>
                      <h3 className="text-2xl text-white mb-3 font-bold">
                        {category.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                      <div className="flex items-center gap-2 text-primary-500 text-sm font-medium">
                        <span>{category._count.threads} тем</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl text-white mb-8 font-bold">Последние темы</h2>
              <div className="space-y-4">
                {recentThreads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                  >
                    <Card hover>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl text-white font-semibold mb-3 hover:text-primary-500 transition-colors">
                            {thread.title}
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs">
                                {thread.author.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{thread.author.username}</span>
                              <span className="text-slate-500">Ур. {thread.author.level}</span>
                            </span>
                            <span className="px-3 py-1 bg-dark-800 rounded-full text-xs font-medium text-slate-300">
                              {thread.category.name}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <span>👁</span>
                              <span>{thread.views}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <span>💬</span>
                              <span>{thread._count.comments}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
