'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка регистрации')
        setLoading(false)
        return
      }

      if (data.token) {
        router.push('/')
        router.refresh()
      } else {
        setError('Ошибка получения токена')
        setLoading(false)
      }
    } catch (err) {
      setError('Произошла ошибка')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card>
          <h1 className="text-3xl text-white text-center mb-8 font-bold">
            Регистрация в OtakuZone
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              label="Имя пользователя"
              placeholder="NarutoFan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Пароль"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" disabled={loading}>
              {loading ? 'Регистрация...' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Уже есть аккаунт?{' '}
            <a href="/auth/login" className="text-primary-500 hover:underline font-medium">
              Войти
            </a>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
