'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiHelpCircle, FiCheck, FiX } from 'react-icons/fi'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  onYes: () => void
  onNo: () => void
}

export default function ConfirmModal({
  isOpen,
  title = 'System Confirmation',
  message,
  onYes,
  onNo,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl overflow-hidden"
        >
          {/* Top Aesthetic Accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent" />
          <div className="absolute top-2 right-4 font-mono text-[9px] text-slate-500 uppercase">
            Prompt
          </div>

          {/* Content */}
          <div className="flex items-start gap-4 mb-8 mt-2">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-sm">
              <FiHelpCircle size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                {title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onNo}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs tracking-widest uppercase transition-all rounded-sm border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <FiX size={14} className="text-red-400" /> No
            </button>
            <button
              onClick={onYes}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-widest uppercase transition-all rounded-sm shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <FiCheck size={14} /> Yes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}