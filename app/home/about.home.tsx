'use client'

import { motion } from 'framer-motion'
import { FaDownload, FaReact, FaNodeJs, FaGitAlt, FaUniversity } from 'react-icons/fa'
import { SiTypescript, SiJavascript, SiMongodb, SiExpress, SiTailwindcss, SiNextdotjs, SiRedux, SiDocker } from 'react-icons/si'
import { TbApi, TbReportAnalytics } from 'react-icons/tb'

const stats = [
    { label: 'PROJECTS', value: '25+', color: 'text-blue-500' },
    { label: 'EXP.', value: '2 YRS', color: 'text-emerald-500' },
    { label: 'STACK', value: '15+', color: 'text-amber-500' },
    { label: 'CERTS', value: '8+', color: 'text-rose-500' },
]

export default function AboutSection() {
    return (
        <section className="bg-slate-950 py-24 px-6 relative border-t border-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col mb-20">
                    <span className="text-xs font-mono text-blue-500 tracking-[0.4em] uppercase mb-4">Identification / 01</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                        About <span className="text-slate-500">Me</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* --- LEFT: CREDENTIAL CARD --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-slate-900 border border-slate-800 p-1 rounded-sm">
                            <div className="border border-slate-800 p-8 bg-slate-950">
                                <div className="flex items-start justify-between mb-12">
                                    <div className="p-1 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                                        <img className='w-10 h-10' src="https://upload.wikimedia.org/wikipedia/en/3/36/Indian_Institute_of_Information_Technology%2C_Bhopal_Logo.png" alt="Institute_Logo" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-1">BATCH 2025</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">IIIT Bhopal</h3>
                                <p className="text-slate-400 font-mono text-xs mb-6 uppercase tracking-widest">B.Tech / Electronics & Comm.</p>

                                <div className="space-y-4 border-t border-slate-900 pt-6">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Specializing in building high-performance full-stack systems.
                                        Architecting modern interfaces with <span className="text-blue-400">React/Next.js</span> and
                                        scalable backends using <span className="text-emerald-400">Node/Express</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 gap-px bg-slate-800 border border-slate-800 mt-4 rounded-sm overflow-hidden">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-slate-950 p-6 flex flex-col items-center">
                                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                                    <span className="text-[10px] font-mono text-slate-500 tracking-tighter">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- RIGHT: TECH STACK VISUAL --- */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h3 className="flex items-center gap-3 text-white font-bold mb-8 tracking-tight">
                                <TbReportAnalytics className="text-blue-500" />
                                CORE STACK ARCHITECTURE
                            </h3>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                viewport={{ once: true }}
                                className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-l p-8 border border-gray-700/50"
                            >

                                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                    {[
                                        { name: 'React', icon: <FaReact className="w-12 h-12 text-cyan-400" />, color: 'border-cyan-400' },
                                        { name: 'Node.js', icon: <FaNodeJs className="w-12 h-12 text-green-500" />, color: 'border-green-500' },
                                        { name: 'MongoDB', icon: <SiMongodb className="w-12 h-12 text-green-600" />, color: 'border-green-600' },
                                        { name: 'Express', icon: <SiExpress className="w-12 h-12 text-gray-300" />, color: 'border-gray-400' },
                                        { name: 'Next.js', icon: <SiNextdotjs className="w-12 h-12 text-white" />, color: 'border-white' },
                                        { name: 'TypeScript', icon: <SiTypescript className="w-12 h-12 text-blue-500" />, color: 'border-blue-500' },
                                    ].map((tech, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ y: -5 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className={`w-20 h-20 rounded-full border-2 ${tech.color} p-4 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm mb-2`}>
                                                {tech.icon}
                                            </div>
                                            <span className="text-white font-medium">{tech.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* --- RESUME CALL TO ACTION --- */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="p-8 bg-blue-600 relative overflow-hidden group rounded-sm"
                        >
                            {/* Decorative Grid Overlay */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)'}} />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h4 className="text-2xl font-black text-white leading-none mb-2">TECHNICAL DOSSIER</h4>
                                    <p className="text-blue-100 text-xs font-mono uppercase tracking-widest">Update: Dec 2025 • Ver. 4.0.2</p>
                                </div>

                                <a
                                    href="/Abhishek_Bharti.pdf"
                                    className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-slate-950 hover:text-white transition-colors duration-300"
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

function TechCard({ icon, name }: { icon: React.ReactNode; name: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-sm group hover:border-blue-500/50 transition-colors"
        >
            <div className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <span className="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
                {name}
            </span>
        </motion.div>
    )
}