'use client'

import { FiLoader } from 'react-icons/fi'

interface CommonLoadingProps {
  text?: string
}

export default function CommonLoading({ text = 'Loading...' }: CommonLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <FiLoader className="animate-spin mb-4 text-blue-400" size={24} />
      <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{text}</span>
    </div>
  )
}