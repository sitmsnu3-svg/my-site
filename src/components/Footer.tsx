'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [cookieConsent, setCookieConsent] = useState(false)

  const playClickSound = () => {
    const audio = new Audio('/sounds/sao_click.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})
  }

  return (
    <>
      <footer className="glass-panel border-t border-dark-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">OtakuZone</h3>
              <p className="text-slate-400 text-sm">
                Премиальное сообщество для обсуждения аниме, манги и японской культуры
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Навигация</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" onMouseDown={playClickSound} className="text-slate-400 hover:text-primary-500 transition-colors text-sm">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/guilds" onMouseDown={playClickSound} className="text-slate-400 hover:text-primary-500 transition-colors text-sm">
                    Клубы
                  </Link>
                </li>
                <li>
                  <Link href="/faq" onMouseDown={playClickSound} className="text-slate-400 hover:text-primary-500 transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Правовая информация</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" onMouseDown={playClickSound} className="text-slate-400 hover:text-primary-500 transition-colors text-sm">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/data-processing" onMouseDown={playClickSound} className="text-slate-400 hover:text-primary-500 transition-colors text-sm">
                    Обработка персональных данных
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-700/50 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} OtakuZone. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      {!cookieConsent && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 glass-panel border-t border-dark-700/50 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h4 className="text-white font-semibold mb-1">Важная информация</h4>
                <p className="text-slate-400 text-sm">
                  Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
                  <Link href="/privacy" onMouseDown={playClickSound} className="text-primary-500 hover:underline">
                    политикой конфиденциальности
                  </Link>
                  .
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCookieConsent(true)
                  localStorage.setItem('cookieConsent', 'true')
                }}
                onMouseDown={playClickSound}
                className="px-6 py-2 btn-gradient rounded-xl text-white font-medium whitespace-nowrap"
              >
                Я согласен
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
