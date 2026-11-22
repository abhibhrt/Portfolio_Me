'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
    const router = useRouter()

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-xl overflow-hidden"
            >
                <div className="p-8 sm:p-12 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="font-mono text-6xl sm:text-7xl font-bold tracking-tighter text-white">
                            4<span className="text-slate-500">0</span>4
                        </p>
                        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                            <span className="text-white">Page </span>
                            <span className="text-slate-400">Not Found</span>
                        </h1>
                        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                            The page or resource you requested does not exist, may have been moved, or the URL is incorrect.
                        </p>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-mono text-xs uppercase tracking-widest rounded-sm border border-white/10 transition-all cursor-pointer"
                        >
                            <FiArrowLeft size={14} />
                            Go Back
                        </button>

                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-widest rounded-sm shadow-lg transition-all"
                        >
                            <FiHome size={14} />
                            Return Home
                        </Link>
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            </motion.div>
        </section>
    )
}