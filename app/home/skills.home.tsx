'use client'

import { motion } from 'framer-motion'
import { FaTools, FaDatabase } from 'react-icons/fa'
import { GrUserExpert } from 'react-icons/gr'

interface Skill {
    name: string
    icon: React.ReactNode
    level: number
}

interface SkillCategoryProps {
    title: string
    skills: Skill[]
    icon?: React.ReactNode
    delay?: number
}

const SkillCategory = ({ title, skills, icon, delay = 0 }: SkillCategoryProps) => {
    // Get the appropriate icon component based on title
    const getCategoryIcon = () => {
        if (title === "Tools") {
            return <FaTools className="text-2xl text-emerald-400" />
        } else if (title === "Back-End") {
            return <FaDatabase className="text-2xl text-blue-400" />
        } else if (title === "Soft Skills") {
            return <GrUserExpert className="text-2xl text-yellow-400" />
        }
        return icon
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">{getCategoryIcon()}</div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="text-xl">{skill.icon}</div>
                                <span className="text-gray-200 font-medium">{skill.name}</span>
                            </div>
                            <span className="text-cyan-400 font-bold text-sm">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: delay + index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default SkillCategory