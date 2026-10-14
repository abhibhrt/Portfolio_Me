'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/useAuthStore'
import ConfirmModal from '@/app/components/confirm-modal'

interface Project {
  _id: string
  title: string
  description: string
  features: string
  url: string
  createdAt: string
  github?: string
  visit?: string
}

interface ProjectCardProps {
  project: Project
  index: number
  onEdit: (project: Project) => void
  onDeleteSuccess: () => void
}

export default function ProjectCard({ project, index, onEdit, onDeleteSuccess }: ProjectCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { isAdmin } = useAuthStore()

  const tags = project.features ? project.features.split(',').map(t => t.trim()) : []
  const displayDate = new Date(project.createdAt).getFullYear().toString()

  const handleDeleteConfirm = async (choice: boolean) => {
    setIsConfirmOpen(false)
    if (!choice) return

    try {
      await axios.delete(`/api/admin/projects/${project._id}`)
      onDeleteSuccess()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 rounded-lg overflow-hidden shadow-xl"
      >
        {/* Card Top Bar */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-black/60">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(project)}
                  className="text-blue-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="text-red-400 hover:text-white transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            )}
            <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">
              ID: {project._id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden border-b border-white/10">
          <img
            src={project.url}
            alt={project.title}
            className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <a
              href={project.github || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white text-black hover:bg-blue-600 hover:text-white transition-all rounded-sm shadow-lg"
            >
              <FiGithub size={18} />
            </a>
            <a
              href={project.visit || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white text-black hover:bg-blue-600 hover:text-white transition-all rounded-sm shadow-lg"
            >
              <FiExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase">
            <FiCalendar className="text-blue-400" />
            {displayDate}
          </div>

          <h3 className="text-xl font-bold text-white uppercase group-hover:text-blue-400 transition-colors tracking-tight">
            {project.title}
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
            {project.description}
          </p>

          {/* Dynamic Tags */}
          <div className="pt-4 flex flex-wrap gap-2">
            {tags.map((tag, i) => {
              const isPrivate = tag.toLowerCase().includes('private')
              return (
                <span
                  key={i}
                  className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 border rounded-sm ${
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

        {/* Bottom Aesthetic Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Purge Project Module"
        message={`Are you sure you want to delete "${project.title}"?`}
        onYes={() => handleDeleteConfirm(true)}
        onNo={() => handleDeleteConfirm(false)}
      />
    </>
  )
}