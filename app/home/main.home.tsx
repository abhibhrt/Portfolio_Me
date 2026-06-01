'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiCode } from 'react-icons/fi'

export default function HomePage() {
    const [cursorText, setCursorText] = useState('')
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const texts = ['Full Stack Developer', 'Web Developer', 'Software Engineer']
        let currentIndex = 0
        let charIndex = 0
        let isDeleting = false

        const typeEffect = () => {
            const currentText = texts[currentIndex]
            if (!isDeleting && charIndex <= currentText.length) {
                setCursorText(currentText.substring(0, charIndex))
                charIndex++
            }
            if (isDeleting && charIndex >= 0) {
                setCursorText(currentText.substring(0, charIndex))
                charIndex--
            }
            if (!isDeleting && charIndex === currentText.length + 1) {
                timeoutRef.current = setTimeout(() => { isDeleting = true }, 2000)
                return
            }
            if (isDeleting && charIndex === 0) {
                isDeleting = false
                currentIndex = (currentIndex + 1) % texts.length
            }
            const speed = isDeleting ? 40 : 80
            timeoutRef.current = setTimeout(typeEffect, speed)
        }
        typeEffect()
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
    }, [])

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30">
            <div className="relative z-10">
                {/* HERO SECTION */}
                <div className="min-h-screen flex items-center justify-center px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            {/* LEFT CONTENT */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-center lg:text-left"
                                >
                                <header>
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-emerald-500 font-mono text-sm tracking-[0.2em] uppercase mb-4 block"
                                    >
                                        Available for projects
                                    </motion.span>

                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                                        Abhishek <span className="text-slate-400">Bharti</span>
                                    </h1>

                                    <div className="text-xl md:text-2xl font-medium text-slate-400 mb-8 h-8 flex items-center justify-center lg:justify-start">
                                        <span className="border-l-2 border-emerald-500 pl-4">{cursorText}</span>
                                        <motion.span
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="inline-block w-[2px] h-6 bg-emerald-500 ml-1"
                                        />
                                    </div>

                                    <div className="flex flex-row justify-center my-4 lg:justify-start">
                                        <Link href="/contacts">
                                            <motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md transition-colors duration-200 shadow-lg shadow-emerald-900/20"
                                            >
                                                <span>START PROJECT</span>
                                                <FiArrowRight />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </header>
                            </motion.div>

                            {/* RIGHT CONTENT - Model Position Maintained */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="flex justify-center items-center"
                            >
                                <div className="relative w-80 h-80 md:w-96 md:h-96">
                                    {/* ELITE DECORATIVE ELEMENTS */}
                                    <motion.div
                                        className="absolute inset-0 rounded-md border border-slate-800"
                                        animate={{ rotate: [0, 90] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    />
                                    <div className="absolute -inset-4 border border-emerald-500/10 rounded-md" />

                                    {/* CENTER CARD - Refactored for Elite Theme */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <motion.div
                                                className="w-56 h-72 bg-slate-900 border border-slate-800 rounded-md p-1 shadow-2xl"
                                                animate={{ y: [0, -12, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <div className="w-full h-full bg-slate-950 rounded-sm relative overflow-hidden group">
                                                    <Image
                                                        src="/dp.png"
                                                        alt="Abhishek Bharti"
                                                        fill
                                                        className="object-cover transition-all duration-700"
                                                        priority
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                                                        <div className="flex items-center gap-2">
                                                            <FiCode className="text-emerald-500 text-[30px]" />
                                                            <span className="text-[10px] tracking-[0.3em] font-bold text-slate-400 uppercase">Software Developer</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* MINIMALIST FLOATING ELEMENTS */}
                                    {[
                                        <div key="1" className="w-2 h-2 bg-emerald-500" />,
                                        <div key="2" className="w-1 h-1" />,
                                        <div key="3" className="w-4 h-4 border border-slate-700" />,
                                    ].map((el, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute"
                                            style={{
                                                top: `${20 + i * 25}%`,
                                                left: `${15 + i * 30}%`,
                                            }}
                                            animate={{ 
                                                y: [0, -30, 0], 
                                                opacity: [0.3, 1, 0.3],
                                                rotate: i === 2 ? [0, 180] : 0 
                                            }}
                                            transition={{
                                                duration: 4 + i,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            {el}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}