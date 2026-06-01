'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

interface ContactDetails {
    name: string
    email: string
    message: string
}

export default function Contact() {
    const [isMapLoading, setIsMapLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)

    const [details, setDetails] = useState<ContactDetails>({
        name: '',
        email: '',
        message: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatusMessage(null)

        // Simulate network delay
        setTimeout(() => {
            setIsSubmitting(false)
            setStatusType('success')
            setStatusMessage('Message sent successfully. I will get back to you soon.')
            setDetails({ name: '', email: '', message: '' })
        }, 1200)
    }

    return (
        <section
            className="relative min-h-screen bg-slate-950 py-24 pt-30 px-6 overflow-hidden"
            id="contact"
        >
            {/* Background Data Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] tracking-[0.3em] mb-2">
                        <span className="h-[1px] w-8 bg-blue-500" />
                        abhibhrt/contacts
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
                        Get In <span className="text-slate-500">Touch</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* LEFT */}
                    <div className="lg:col-span-5 space-y-6">
                        <ContactMethod
                            icon={<FiMail size={20} />}
                            label="Email"
                            value="abhibharti365@gmail.com"
                            href="mailto:abhibharti365@gmail.com"
                        />
                        <ContactMethod
                            icon={<FaWhatsapp size={20} />}
                            label="WhatsApp"
                            value="+91 9713397975"
                            href="https://wa.me/919713397975"
                        />
                        <ContactMethod
                            icon={<FiPhone size={20} />}
                            label="Direct Call"
                            value="+91 9713397975"
                            href="tel:+919713397975"
                        />

                        {/* Map */}
                        <div className="relative mt-8 rounded-sm border border-slate-800 bg-slate-900/50 overflow-hidden aspect-video">
                            {isMapLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d40192.30845307541!2d77.41823089476793!3d23.23106021217998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1780330535483!5m2!1sen!2sin"
                                className={`w-full h-full transition-opacity duration-700 ${isMapLoading ? 'opacity-0' : 'opacity-90'
                                    }`}
                                onLoad={() => setIsMapLoading(false)}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-7 bg-slate-900/30 border border-slate-800 p-8 md:p-12 relative"
                    >
                        <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-700 uppercase">
                            Terminal_Form_v1.0
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput
                                    label="Name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={details.name}
                                    onChange={(v) => setDetails({ ...details, name: v })}
                                />
                                <FormInput
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={details.email}
                                    onChange={(v) => setDetails({ ...details, email: v })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Type your message here..."
                                    value={details.message}
                                    onChange={(e) =>
                                        setDetails({ ...details, message: e.target.value })
                                    }
                                    className="w-full bg-transparent border-b border-slate-800 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Status Message */}
                            {statusMessage && (
                                <p
                                    className={`text-sm ${statusType === 'success'
                                        ? 'text-emerald-400'
                                        : 'text-red-400'
                                        }`}
                                >
                                    {statusMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Transmitting...' : 'Send Message'}
                                <FiSend
                                    className={`transition-transform group-hover:translate-x-1 ${isSubmitting ? 'animate-pulse' : ''
                                        }`}
                                />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

/* HELPERS */

function ContactMethod({
    icon,
    label,
    value,
    href,
}: {
    icon: React.ReactNode
    label: string
    value: string
    href: string
}) {
    return (
        <motion.a
            href={href}
            whileHover={{ x: 5 }}
            className="flex items-center gap-6 p-4 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all"
        >
            <div className="p-3 bg-slate-800 text-blue-500 rounded-sm">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </motion.a>
    )
}

function FormInput({
    label,
    type,
    placeholder,
    value,
    onChange,
}: {
    label: string
    type: string
    placeholder: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                {label}
            </label>
            <input
                required
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent border-b border-slate-800 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    )
}