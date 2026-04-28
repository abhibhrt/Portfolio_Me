'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiCommand, FiLink } from 'react-icons/fi'

const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contacts' },
    { name: 'PROBLEMS', path: '/problems' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const closeMenu = () => setIsOpen(false)

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'
                    }`}
            >
                {/* HUD Background Layer */}
                <div className={`absolute inset-0 transition-all duration-300 ${scrolled
                        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl'
                        : 'bg-transparent'
                    }`} />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex items-center justify-between h-12">

                        {/* ELITE LOGO */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <img src="/icon.png" alt="Elite Logo" className="w-9 h-9 mt-2" />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-[0.2em] text-white font-mono">
                                    abhibhrt
                                </span>
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                                    Software Developer
                                </span>
                            </div>
                        </Link>

                        {/* DESKTOP NAV - MONO STYLE */}
                        <div className="hidden md:flex items-center space-x-10">
                            {navItems.map(item => {
                                const isActive = pathname === item.path
                                return (
                                    <Link key={item.path} href={item.path}>
                                        <div className="relative group flex items-center gap-2">
                                            {isActive && (
                                                <motion.span
                                                    layoutId="activeTab"
                                                    className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                                />
                                            )}
                                            <span className={`text-[11px] font-mono tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                                                }`}>
                                                {item.name}
                                            </span>
                                        </div>
                                    </Link>
                                )
                            })}

                            {/* CTA BUTTON */}
                            <Link href="https://linkedin.com/in/abhibhrt" target="_blank" rel="noopener noreferrer">
                                <button className="cursor-pointer ml-4 px-5 py-2 border border-blue-600/50 text-blue-400 text-[10px] font-mono tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-sm">
                                    CONNECT <FiLink className="inline-block mb-0.5" />
                                </button>
                            </Link>
                        </div>

                        {/* MOBILE TOGGLE */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-slate-400 hover:text-white transition-colors"
                        >
                            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* MOBILE MENU - ARCHITECTURAL SLIDE */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md md:hidden"
                            onClick={closeMenu}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[300px] bg-slate-950 border-l border-slate-800 md:hidden p-8"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-12 flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase italic">Navigation Menu</span>
                                    <button onClick={closeMenu} className="text-slate-400 hover:text-white"><FiX size={24} /></button>
                                </div>

                                <div className="space-y-8">
                                    {navItems.map((item, idx) => (
                                        <Link key={item.path} href={item.path} onClick={closeMenu}>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`text-2xl my-6 font-bold tracking-tighter ${pathname === item.path ? 'text-blue-500' : 'text-slate-500'
                                                    }`}
                                            >
                                                <span className="text-s font-mono mr-4 opacity-30">0{idx + 1}</span>
                                                <span className="text-s font-mono mr-4">{item.name}</span>

                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10 border-t border-slate-900">
                                    <p className="text-[10px] font-mono text-slate-600 uppercase mb-4 tracking-widest">Global Status: Online</p>
                                    <button className="w-full py-4 bg-blue-600 text-white font-mono text-xs tracking-widest uppercase hover:bg-blue-700 transition-colors">
                                        Ping System
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}