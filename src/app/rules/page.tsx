'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  requireRole: string | null
  rules: string | null
}

export default function RulesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Правила форума</h1>
        <p className="text-slate-400 mb-8">Ознакомьтесь с правилами каждого раздела перед публикацией</p>
        
        {loading ? (
          <div className="text-center text-primary-500">Загрузка...</div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl text-white font-bold mb-2">{category.name}</h2>
                      <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                      
                      {category.requireRole && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 text-sm font-medium">
                            ⚠️ Для создания тем в этом разделе требуется роль: {category.requireRole}
                          </p>
                        </div>
                      )}
                      
                      {category.rules && (
                        <div className="bg-dark-800/50 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-3">Правила раздела:</h3>
                          <div className="text-slate-300 text-sm whitespace-pre-line">
                            {category.rules}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
