'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface PageHeaderProps {
  name: string
  path: string
  action?: React.ReactNode
}

export default function PageHeader({ name, path, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] tracking-[0.3em]">
          <span className="h-[1px] w-8 bg-blue-400" />
          {path}
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
          {name}
        </h2>
      </div>

      {action && <div className="flex items-center gap-4">{action}</div>}
    </motion.div>
  )
}