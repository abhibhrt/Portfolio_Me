'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

interface ContactData {
  email: string
  whatsapp: string
  phone: string
  mapUrl: string
}

interface ContactInfoProps {
  contactData: ContactData | null
  isMapLoading: boolean
  setIsMapLoading: (loading: boolean) => void
}

export default function ContactInfo({ contactData, isMapLoading, setIsMapLoading }: ContactInfoProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      {contactData ? (
        <>
          <ContactMethod
            icon={<FiMail size={20} />}
            label="Email"
            value={contactData.email}
            href={`mailto:${contactData.email}`}
          />
          <ContactMethod
            icon={<FaWhatsapp size={20} />}
            label="WhatsApp"
            value={contactData.whatsapp}
            href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, '')}`}
          />
          <ContactMethod
            icon={<FiPhone size={20} />}
            label="Direct Call"
            value={contactData.phone}
            href={`tel:${contactData.phone}`}
          />

          {/* Map */}
          <div className="relative mt-8 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden aspect-video shadow-xl">
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <iframe
              src={contactData.mapUrl}
              className={`w-full h-full transition-opacity duration-700 ${
                isMapLoading ? 'opacity-0' : 'opacity-80'
              }`}
              onLoad={() => setIsMapLoading(false)}
              loading="lazy"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-lg bg-black/20 backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase text-slate-500">Contact Details Not Found</span>
        </div>
      )}
    </div>
  )
}

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
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 5 }}
      className="flex items-center gap-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all rounded-lg shadow-lg group"
    >
      <div className="p-3 bg-white/5 border border-white/10 text-blue-400 rounded-sm group-hover:bg-blue-500 group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-white font-medium text-sm">{value}</p>
      </div>
    </motion.a>
  )
}