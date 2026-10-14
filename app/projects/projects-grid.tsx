'use client'

import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './projects-card'

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

interface ProjectsGridProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDeleteSuccess: () => void
}

export default function ProjectsGrid({ projects, onEdit, onDeleteSuccess }: ProjectsGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id}
            project={project}
            index={index}
            onEdit={onEdit}
            onDeleteSuccess={onDeleteSuccess}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}