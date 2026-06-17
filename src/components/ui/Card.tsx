'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export default function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px -10px rgba(244, 63, 94, 0.2)' } : {}}
      className={`rounded-2xl p-6 ${gradient ? 'gradient-border' : 'glass-panel'} ${hover ? 'transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
