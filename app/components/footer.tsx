'use client'

import { motion } from 'framer-motion'
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope,
    FaPhone, FaMapMarkerAlt, FaArrowUp, FaYoutube, FaTerminal
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import Link from 'next/link'
import { useState } from 'react'

const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com/abhibhrt', label: 'GH' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com/in/abhibhrt', label: 'LI' },
    { icon: <FaTwitter />, href: 'https://twitter.com/abhibhrt', label: 'TW' },
    { icon: <SiLeetcode />, href: 'https://leetcode.com/abhibhrt', label: 'LC' },
    { icon: <FaYoutube />, href: 'https://youtube.com/@loopsafar', label: 'YT' },
]

export default function Footer() {
    const [email, setEmail] = useState('')
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-10 overflow-hidden">
            {/* Structural Background Element */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* --- BRAND COLUMN --- */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Status: Available for hire</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white tracking-tighter uppercase">
                                Abhishek <span className="text-slate-500">Bharti</span>
                            </h3>
                            <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-sm font-light">
                                Architecting high-integrity digital systems. Specialized in Full-Stack Engineering and Distributed Web Architectures.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-500">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-500" />
                                <a href="mailto:abhibharti365@gmail.com" className="hover:text-white transition-colors">ABHIBHARTI365@GMAIL.COM</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span>BHOPAL, IN </span>
                            </div>
                        </div>
                    </div>

                    {/* --- NAVIGATION & TECH --- */}
                    <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-mono text-white mb-6 uppercase tracking-widest border-l-2 border-blue-600 pl-3">Index</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                {['Projects', 'About', 'Skills', 'Resume'].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase()}`} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                            <span className="h-[1px] w-0 bg-blue-500 group-hover:w-3 transition-all" />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-mono text-white mb-6 uppercase tracking-widest border-l-2 border-blue-600 pl-3">Stack</h4>
                            <ul className="space-y-2 text-[11px] font-mono text-slate-500 uppercase">
                                <li>Next.js 14</li>
                                <li>TypeScript</li>
                                <li>Node.js</li>
                                <li>MongoDB</li>
                            </ul>
                        </div>
                    </div>

                    {/* --- NEWSLETTER --- */}
                    <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <FaTerminal className="text-blue-500 text-xs" />
                            <h4 className="text-xs font-mono uppercase tracking-widest">Subscriber Portal</h4>
                        </div>
                        <p className="text-slate-400 text-xs mb-6 font-light">Receive technical updates and project briefings directly.</p>
                        
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="USER_EMAIL@DOMAIN.COM"
                                className="bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-blue-600 transition-colors"
                            />
                            <button className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white text-[10px] font-mono font-bold py-3 transition-all uppercase tracking-[0.2em]">
                                Establish Connection
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- FOOTER BOTTOM --- */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-3">
                        {socialLinks.map((social, i) => (
                            <a 
                                key={i} 
                                href={social.href}
                                className="w-8 h-8 flex items-center justify-center border border-slate-800 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all text-sm"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        © {currentYear} System_Abhishek_Bharti • Ver_2.0.0_Stable
                    </p>

                    <button 
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
                    >
                        RETURN_TO_TOP 
                        <FaArrowUp className="group-hover:-translate-y-1 transition-transform text-blue-500" />
                    </button>
                </div>
            </div>
        </footer>
    )
}