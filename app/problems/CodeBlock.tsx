'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiCheck, FiFileText, FiCode, FiExternalLink } from 'react-icons/fi';


import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';


const customNeonTheme: { [key: string]: React.CSSProperties } = {
  'hljs-keyword': { color: '#ff79c6', fontWeight: 'bold' }, // Pink
  'hljs-string': { color: '#50fa7b' },                     // Green
  'hljs-title': { color: '#bd93f9' },                      // Violet
  'hljs-section': { color: '#bd93f9' },                    // Violet
  'hljs-built_in': { color: '#8be9fd' },                   // Cyan/Blue
  'hljs-comment': { color: '#6272a4', fontStyle: 'italic' }, // Muted Blue-Grey
  'hljs-number': { color: '#ffb86c' },                     // Orange
  'hljs-function': { color: '#50fa7b' },                   // Green
  'hljs-params': { color: '#f8f8f2' },                     // Whiteish
  'hljs': { display: 'block', overflowX: 'auto', background: '#0f172a', color: '#f8f8f2', padding: '0.5em' }
};

SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface CodeModalProps {
  problem: any;
  onClose: () => void;
  initialTab?: 'code' | 'notes'; // Optional: direct tab opening
}

export const CodeModal = ({ problem, onClose, initialTab = 'code' }: CodeModalProps) => {
  const [activeTab, setActiveTab] = useState<'code' | 'notes'>(initialTab);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(problem.code.sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 z-[100]">
      <div className="absolute inset-0" onClick={onClose}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl rounded-lg overflow-hidden z-10"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tighter truncate max-w-[200px]">
              {problem.problemName}
            </h3>
          </div>
          
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><FiX size={22} /></button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/50 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'code' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <FiCode /> Source Code
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'notes' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <FiFileText /> Logical Notes
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
          <AnimatePresence mode="wait">
            {activeTab === 'code' ? (
              <motion.div 
                key="code"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="relative"
              >
                <button onClick={handleCopy} className="absolute top-4 right-6 z-20 bg-slate-800/80 hover:bg-blue-600 text-white p-2 rounded-md transition-all backdrop-blur-sm border border-slate-700">
                  {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy size={16} />}
                </button>
                <SyntaxHighlighter 
                  language={(problem.code.language || 'cpp').toLowerCase()} 
                  style={customNeonTheme}
                  customStyle={{ 
                    margin: 0, padding: '32px', fontSize: '14px', lineHeight: '1.8', background: 'transparent',
                    fontFamily: '"Fira Code", "JetBrains Mono", monospace'
                  }}
                  showLineNumbers
                  lineNumberStyle={{ color: '#3b4252', minWidth: '2.5em' }}
                >
                  {problem.code.sourceCode}
                </SyntaxHighlighter>
              </motion.div>
            ) : (
              <motion.div 
                key="notes"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="p-10"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 text-emerald-500 mb-6">
                    <FiFileText size={20} />
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Developer Observations</span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed font-serif italic whitespace-pre-wrap border-l-4 border-slate-800 pl-8">
                    {problem.note || "No notes available for this problem yet."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900">
           <a href={problem.problemUrl} target="_blank" className="flex items-center gap-2 text-[9px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
              Verify Solution <FiExternalLink />
            </a>
        </div>
      </motion.div>
    </div>
  );
};