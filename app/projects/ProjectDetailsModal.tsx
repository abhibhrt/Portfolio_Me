'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink, FiCalendar } from 'react-icons/fi'

export interface Project {
  _id: string
  title: string
  description: string
  features: string
  url: string
  createdAt: string
  github?: string
  visit?: string
}

interface ProjectDetailsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!project) return null

  const tags = project.features
    ? project.features
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const displayDate = new Date(project.createdAt).getFullYear().toString()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-51 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/15 rounded-lg shadow-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
                  ID: {project._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
                  <FiCalendar size={12} />
                  {displayDate}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-black">
              <img
                src={project.url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Body */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
                  {project.title}
                </h2>

                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white/5 hover:bg-blue-600 text-white border border-white/15 hover:border-blue-500 rounded-sm transition-all"
                    >
                      <FiGithub size={14} />
                      Code
                    </a>
                  )}
                  {project.visit && (
                    <a
                      href={project.visit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white rounded-sm transition-all"
                    >
                      <FiExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              {/* Features / Tags */}
              {tags.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">
                    Features & Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => {
                      const isPrivate = tag.toLowerCase().includes('private')
                      return (
                        <span
                          key={i}
                          className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 border rounded-sm ${
                            isPrivate
                              ? 'border-red-500/30 text-red-400 bg-red-950/20'
                              : 'border-white/10 text-slate-300 bg-white/5'
                          }`}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}