'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiTrendingUp,
  FiImage,
  FiBookOpen,
  FiLogOut,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

import Progress from './sections/appointments'; // Renamed import internally for logic
import ProjectManager from './sections/projects';
import Story from './sections/stories';

/* -------------------------------------------------------------------------- */
/* Types                                   */
/* -------------------------------------------------------------------------- */

type SectionKey = 'progress' | 'projects' | 'story';

interface SectionConfig {
  icon: IconType;
  title: string;
  code: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                 */
/* -------------------------------------------------------------------------- */

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<SectionKey>('progress');

  const router = useRouter();

  const sections: Record<SectionKey, SectionConfig> = {
    progress: {
      icon: FiTrendingUp,
      title: 'Progress Tracking',
      code: 'STS-01',
    },
    projects: {
      icon: FiImage,
      title: 'Manage Projects',
      code: 'IMG-02',
    },
    story: {
      icon: FiBookOpen,
      title: 'Story Archive',
      code: 'LIT-03',
    },
  };

  /* ------------------------------- Handlers -------------------------------- */

  const handleLogout = (): void => {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Terminate administrative session?')) return;

    window.localStorage.removeItem('admin');
    window.dispatchEvent(new Event('admin-logout'));
    router.push('/admin');
  };

  const renderContent = (): JSX.Element | null => {
    switch (activeSection) {
      case 'progress':
        return <Progress />;
      case 'projects':
        return <ProjectManager />;
      case 'story':
        return <Story />;
      default:
        return null;
    }
  };

  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden pt-16 md:pt-20">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="bg-slate-900 text-white flex flex-col z-10 shadow-2xl overflow-hidden"
      >
        {/* Branding */}
        <div className="h-20 flex items-center px-6 shrink-0 border-b border-slate-800/50">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  Registry <span className="text-blue-500">Admin</span>
                </h1>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Hajela Hospital v2.0
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-2 px-3">
          {(Object.entries(sections) as [SectionKey, SectionConfig][]).map(
            ([key, { icon: Icon, title, code }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center h-12 transition-all duration-300 relative group overflow-hidden cursor-pointer rounded-sm ${
                  activeSection === key
                    ? 'text-white bg-blue-600/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {activeSection === key && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                  />
                )}

                <div className="flex items-center px-4 z-10">
                  <Icon
                    className={`text-lg flex-shrink-0 ${
                      activeSection === key ? 'text-blue-500' : ''
                    }`}
                  />

                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-4 flex flex-col items-start"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {title}
                        </span>
                        <span className="text-[7px] font-mono text-slate-600 tracking-tighter">
                          {code}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            )
          )}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center h-12 px-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 cursor-pointer rounded-sm"
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            {sidebarOpen && (
              <span className="ml-4 text-[10px] font-black uppercase tracking-widest">
                Logout Session
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Header */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 relative z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 hover:bg-slate-800 transition-colors text-slate-400 border border-slate-700 rounded-sm cursor-pointer"
            >
              {sidebarOpen ? <FiX size={16} /> : <FiMenu size={16} />}
            </button>

            <div className="h-6 w-px bg-slate-800" />

            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                {sections[activeSection].title}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Secure Admin Terminal
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                Abhishek Bharti
              </p>
              <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                Root Administrator
              </p>
            </div>

            <div className="w-10 h-10 border border-slate-700 p-0.5 rounded-sm bg-slate-800 shadow-xl">
              <img
                src="/dp.jpeg"
                alt="admin-avatar"
                className="w-full h-full object-cover rounded-[1px] grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 overflow-auto relative bg-slate-950">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />
          
          <div className="relative z-10 max-w-7xl mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;