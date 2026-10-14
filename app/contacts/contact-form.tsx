'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiSend } from 'react-icons/fi'

interface ContactDetails {
  name: string
  email: string
  message: string
}

interface ContactFormProps {
  details: ContactDetails
  setDetails: React.Dispatch<React.SetStateAction<ContactDetails>>
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  statusMessage: string | null
  statusType: 'success' | 'error' | null
}

export default function ContactForm({
  details,
  setDetails,
  onSubmit,
  isSubmitting,
  statusMessage,
  statusType,
}: ContactFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-7 bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 relative rounded-lg shadow-xl"
    >
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-500 uppercase">
        Query Form
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={details.name}
            onChange={(v) => setDetails((prev) => ({ ...prev, name: v }))}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={details.email}
            onChange={(v) => setDetails((prev) => ({ ...prev, email: v }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
            Message
          </label>
          <textarea
            required
            rows={5}
            placeholder="Type your message here..."
            value={details.message}
            onChange={(e) =>
              setDetails((prev) => ({ ...prev, message: e.target.value }))
            }
            className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-colors resize-none text-sm"
          />
        </div>

        {statusMessage && (
          <p
            className={`text-xs font-mono ${
              statusType === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 rounded-sm shadow-lg cursor-pointer"
        >
          {isSubmitting ? 'Transmitting...' : 'Send Message'}
          <FiSend
            className={`transition-transform group-hover:translate-x-1 ${
              isSubmitting ? 'animate-pulse' : ''
            }`}
          />
        </button>
      </form>
    </motion.div>
  )
}

function FormInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
        {label}
      </label>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-colors text-sm"
      />
    </div>
  )
}