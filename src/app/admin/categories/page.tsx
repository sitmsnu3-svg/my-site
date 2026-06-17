'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  slug: string
  requireRole: string | null
  rules: string | null
  _count: { threads: number }
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    slug: '',
    requireRole: '',
    rules: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const roles = ['', 'ADVENTURER', 'MODERATOR', 'ADMIN', 'GAME_MASTER', 'GUARDIAN']

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      const method = editingCategory ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requireRole: formData.requireRole || null,
        }),
      })

      if (res.ok) {
        if (editingCategory) {
          setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c))
        } else {
          const newCategory = await res.json()
          setCategories([...categories, newCategory])
        }
        setShowCreateForm(false)
        setEditingCategory(null)
        setFormData({ name: '', description: '', icon: '', slug: '', requireRole: '', rules: '' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      slug: category.slug,
      requireRole: category.requireRole || '',
      rules: category.rules || '',
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📁 Управление категориями</h1>
        <Button onClick={() => {
          setShowCreateForm(!showCreateForm)
          setEditingCategory(null)
          setFormData({ name: '', description: '', icon: '', slug: '', requireRole: '', rules: '' })
        }}>
          {showCreateForm ? 'Отмена' : '+ Создать категорию'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Название"
              placeholder="Название категории"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Slug"
              placeholder="url-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <Input
              label="Иконка"
              placeholder="🎮"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            <Textarea
              label="Описание"
              placeholder="Описание категории..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Требуемая роль для создания тем
              </label>
              <select
                value={formData.requireRole}
                onChange={(e) => setFormData({ ...formData, requireRole: e.target.value })}
                className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role || 'Нет (все пользователи)'}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              label="Правила раздела"
              placeholder="Правила для этой категории..."
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Сохранение...' : (editingCategory ? 'Обновить' : 'Создать')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingCategory(null)
                  setFormData({ name: '', description: '', icon: '', slug: '', requireRole: '', rules: '' })
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center text-primary-500">Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    {category.requireRole && (
                      <span className="px-2 py-1 rounded text-xs font-bold text-yellow-400 bg-dark-700">
                        {category.requireRole}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{category.description}</p>
                  <p className="text-slate-500 text-xs mb-2">Slug: {category.slug}</p>
                  {category.rules && (
                    <div className="bg-dark-700 rounded p-3 mt-2">
                      <p className="text-slate-300 text-sm whitespace-pre-line">{category.rules}</p>
                    </div>
                  )}
                  <p className="text-slate-500 text-xs mt-2">{category._count.threads} тем</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(category)}>
                    Редактировать
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(category.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
