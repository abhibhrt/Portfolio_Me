'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/useAuthStore'
import ConfirmModal from '@/app/components/confirm-modal'
import ProjectDetailsModal, { Project } from './ProjectDetailsModal'

interface ProjectCardProps {
  project: Project
  index: number
  onEdit: (project: Project) => void
  onDeleteSuccess: () => void
}

export default function ProjectCard({
  project,
  index,
  onEdit,
  onDeleteSuccess,
}: ProjectCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { isAdmin } = useAuthStore()

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
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsDetailsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsDetailsOpen(true)
          }
        }}
        className="group relative aspect-video bg-black/40 border border-white/10 hover:border-blue-500/50 transition-all duration-500 rounded-lg overflow-hidden shadow-xl cursor-pointer select-none"
      >
        {/* Project Image */}
        <img
          src={project.url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Transparent / Gradient Overlay for Title & Bottom-to-Top Description */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-colors duration-300 flex flex-col justify-end p-5">
          {/* Title on Image */}
          <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight drop-shadow">
            {project.title}
          </h3>

          {/* Description Animating from Bottom to Top on Hover */}
          <motion.div
            initial={false}
            animate={
              isHovered
                ? { opacity: 1, y: 0, maxHeight: 160 }
                : { opacity: 0, y: 24, maxHeight: 0 }
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-2 text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Admin Controls (Top Right, stops card click) */}
        {isAdmin && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button
              onClick={() => onEdit(project)}
              className="p-2 bg-black/70 hover:bg-blue-600 text-blue-300 hover:text-white border border-white/15 rounded transition-colors cursor-pointer"
              title="Edit Project"
            >
              <FiEdit2 size={13} />
            </button>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="p-2 bg-black/70 hover:bg-red-600 text-red-300 hover:text-white border border-white/15 rounded transition-colors cursor-pointer"
              title="Delete Project"
            >
              <FiTrash2 size={13} />
            </button>
          </div>
        )}

        {/* Bottom Aesthetic Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      <ProjectDetailsModal
        project={project}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

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