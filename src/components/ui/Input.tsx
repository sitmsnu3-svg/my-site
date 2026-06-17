'use client'

import { motion } from 'framer-motion'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  label?: string
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
}: InputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-slate-300 text-sm font-medium mb-2">{label}</label>}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
      />
    </div>
  )
}
