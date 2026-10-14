'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiLink, FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/useAuthStore'
import { useAuthCheck } from '@/app/hooks/useAuthCheck'
import ConfirmModal from '@/app/components/confirm-modal'

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'PROJECTS', path: '/projects' },
  { name: 'CONTACT', path: '/contacts' },
  { name: 'PROBLEMS', path: '/problems' },
]

export default function Navbar() {
  useAuthCheck()

  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const { isAdmin, user, clearAuth } = useAuthStore()

  const handleLogoutConfirm = async (choice: boolean) => {
    setIsLogoutModalOpen(false)
    if (!choice) return

    try {
      await axios.post('/api/auth/signout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      closeMenu()
      router.push('/')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 py-4"
      >
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            lastScrollY > 50 ? 'bg-black/20 backdrop-blur-md shadow-lg' : 'bg-transparent'
          }`}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/icon.png" alt="Elite Logo" className="w-9 h-9" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-[0.2em] text-white font-mono">
                  {isAdmin && user ? user.name || user.username : 'abhibhrt'}
                </span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                  {isAdmin && user ? user.email || 'Admin Session' : 'Software Developer'}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <Link key={item.path} href={item.path}>
                    <div className="relative group flex items-center gap-2">
                      {isActive && (
                        <motion.span layoutId="activeTab" className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                      <span
                        className={`text-[11px] font-mono tracking-[0.2em] transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              })}

              {isAdmin ? (
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="cursor-pointer ml-4 px-5 py-2 border border-red-500/50 text-red-400 text-[10px] font-mono tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 rounded-sm backdrop-blur-sm"
                >
                  LOGOUT <FiLogOut className="inline-block mb-0.5 ml-1" />
                </button>
              ) : (
                <Link href="https://linkedin.com/in/abhibhrt" target="_blank" rel="noopener noreferrer">
                  <button className="cursor-pointer ml-4 px-5 py-2 border border-blue-600/50 text-blue-400 text-[10px] font-mono tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-sm backdrop-blur-sm">
                    CONNECT <FiLink className="inline-block mb-0.5 ml-1" />
                  </button>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-300 hover:text-white transition-colors"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[300px] bg-black/60 backdrop-blur-2xl md:hidden p-8"
            >
              <div className="flex flex-col h-full">
                <div className="mb-12 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase italic">
                    Navigation Menu
                  </span>
                  <button onClick={closeMenu} className="text-slate-400 hover:text-white">
                    <FiX size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {navItems.map((item, idx) => (
                    <Link key={item.path} href={item.path} onClick={closeMenu}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`text-2xl my-6 font-bold tracking-tighter ${
                          pathname === item.path ? 'text-blue-500' : 'text-slate-400'
                        }`}
                      >
                        <span className="text-sm font-mono mr-4 opacity-30">0{idx + 1}</span>
                        <span className="text-sm font-mono mr-4">{item.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-10 border-t border-slate-800/50 space-y-4">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Global Status: {isAdmin ? <span className="text-emerald-400">Authenticated</span> : 'Online'}
                  </p>

                  {isAdmin ? (
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="w-full py-4 bg-red-600/80 backdrop-blur-sm text-white font-mono text-xs tracking-widest uppercase hover:bg-red-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Logout Session <FiLogOut size={14} />
                    </button>
                  ) : (
                    <button className="w-full py-4 bg-blue-600/80 backdrop-blur-sm text-white font-mono text-xs tracking-widest uppercase hover:bg-blue-600 transition-colors cursor-pointer">
                      Ping System
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Session Termination"
        message="Are you sure you want to terminate your active admin session?"
        onYes={() => handleLogoutConfirm(true)}
        onNo={() => handleLogoutConfirm(false)}
      />
    </>
  )
}