'use client'

import { motion } from 'framer-motion'
import { FaDownload, FaReact, FaNodeJs } from 'react-icons/fa'
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs } from 'react-icons/si'
import { TbReportAnalytics } from 'react-icons/tb'

const stats = [
    { label: 'PROJECTS', value: '25+', color: 'text-blue-400' },
    { label: 'EXP.', value: '2 YRS', color: 'text-emerald-400' },
    { label: 'STACK', value: '15+', color: 'text-amber-400' },
    { label: 'CERTS', value: '8+', color: 'text-rose-400' },
]

export default function AboutSection() {
    return (
        <section className="py-24 px-6 relative border-t border-white/5">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col mb-20">
                    <span className="text-xs font-mono text-blue-400 tracking-[0.4em] uppercase mb-4">Identification / 01</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                        About <span className="text-slate-500">Me</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* --- LEFT: CREDENTIAL CARD --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5"
                    >
                        <div className="p-1 rounded-sm">
                            <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl">
                                <div className="flex items-start justify-between mb-12">
                                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                                        <img className='w-10 h-10 object-contain' src="https://upload.wikimedia.org/wikipedia/en/3/36/Indian_Institute_of_Information_Technology%2C_Bhopal_Logo.png" alt="Institute_Logo" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 border border-white/10 bg-white/5 px-2.5 py-1 rounded-sm">BATCH 2025</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">IIIT Bhopal</h3>
                                <p className="text-slate-400 font-mono text-xs mb-6 uppercase tracking-widest">B.Tech / Electronics & Comm.</p>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Specializing in building high-performance full-stack systems.
                                        Architecting modern interfaces with <span className="text-blue-400 font-medium">React/Next.js</span> and
                                        scalable backends using <span className="text-emerald-400 font-medium">Node/Express</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mt-4 rounded-lg overflow-hidden backdrop-blur-md">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-black/40 backdrop-blur-xl p-6 flex flex-col items-center">
                                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                                    <span className="text-[10px] font-mono text-slate-400 tracking-wider mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- RIGHT: TECH STACK VISUAL --- */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h3 className="flex items-center gap-3 text-white font-bold mb-8 tracking-tight text-sm font-mono">
                                <TbReportAnalytics className="text-blue-400 text-lg" />
                                CORE STACK ARCHITECTURE
                            </h3>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="bg-black/40 backdrop-blur-xl rounded-lg p-8 border border-white/10 shadow-xl"
                            >
                                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                    {[
                                        { name: 'React', icon: <FaReact className="w-10 h-10 text-cyan-400" />, color: 'border-cyan-400/40 hover:border-cyan-400' },
                                        { name: 'Node.js', icon: <FaNodeJs className="w-10 h-10 text-green-500" />, color: 'border-green-500/40 hover:border-green-500' },
                                        { name: 'MongoDB', icon: <SiMongodb className="w-10 h-10 text-green-600" />, color: 'border-green-600/40 hover:border-green-600' },
                                        { name: 'Express', icon: <SiExpress className="w-10 h-10 text-slate-300" />, color: 'border-slate-500/40 hover:border-slate-300' },
                                        { name: 'Next.js', icon: <SiNextdotjs className="w-10 h-10 text-white" />, color: 'border-white/40 hover:border-white' },
                                        { name: 'TypeScript', icon: <SiTypescript className="w-10 h-10 text-blue-500" />, color: 'border-blue-500/40 hover:border-blue-500' },
                                    ].map((tech, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                            className="flex flex-col items-center group"
                                        >
                                            <div className={`w-20 h-20 rounded-full border-2 ${tech.color} p-4 flex items-center justify-center bg-black/60 backdrop-blur-md mb-2 transition-all duration-300 shadow-lg`}>
                                                {tech.icon}
                                            </div>
                                            <span className="text-slate-300 text-xs font-mono group-hover:text-white transition-colors">{tech.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RESUME CALL TO ACTION --- */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 relative overflow-hidden group rounded-lg shadow-xl"
                        >
                            {/* Decorative Grid Overlay */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h4 className="text-2xl font-black text-white leading-none mb-2 tracking-tight">TECHNICAL RESUME</h4>
                                    <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Update: Dec 2025 • Ver. 4.0.2</p>
                                </div>

                                <a
                                    href="/Abhishek_Bharti.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white text-black px-8 py-4 font-bold text-xs font-mono tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-sm shadow-lg"
                                >
                                    <FaDownload />
                                    Download CV
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}