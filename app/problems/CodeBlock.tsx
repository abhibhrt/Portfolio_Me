'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheck, FiFileText, FiCode } from 'react-icons/fi';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';

const customNeonTheme: { [key: string]: React.CSSProperties } = {
  'hljs-keyword': { color: '#ff79c6', fontWeight: 'bold' },
  'hljs-string': { color: '#50fa7b' },
  'hljs-title': { color: '#bd93f9' },
  'hljs-section': { color: '#bd93f9' },
  'hljs-built_in': { color: '#8be9fd' },
  'hljs-comment': { color: '#6272a4', fontStyle: 'italic' },
  'hljs-number': { color: '#ffb86c' },
  'hljs-function': { color: '#50fa7b' },
  'hljs-params': { color: '#f8f8f2' },
  'hljs': { display: 'block', overflowX: 'auto', background: 'transparent', color: '#f8f8f2', padding: '0.5em' }
};

SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface CodeModalProps {
  problem: any;
  onClose: () => void;
  initialTab?: 'code' | 'notes';
}

export const CodeModal = ({ problem, onClose, initialTab = 'code' }: CodeModalProps) => {
  const [activeTab, setActiveTab] = useState<'code' | 'notes'>(initialTab);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (problem?.code?.sourceCode) {
      navigator.clipboard.writeText(problem.code.sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!problem) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10 z-[100]">
      {/* Overlay Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Glass Modal Container */}
      <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl rounded-xl overflow-hidden z-10">

        {/* Tab Switcher & Right-aligned Close Button */}
        <div className="flex justify-between items-center border-b border-white/10 bg-black/40 px-4">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
                activeTab === 'code' 
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiCode /> Source Code
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-8 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
                activeTab === 'notes' 
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiFileText /> Logical Notes
            </button>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 bg-white/5 border border-white/10 rounded-md"
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/30">
          {activeTab === 'code' ? (
            <div className="relative">
              <button 
                onClick={handleCopy} 
                className="absolute top-4 right-6 z-20 bg-white/10 hover:bg-blue-600 text-white p-2 rounded-md transition-all backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
                title="Copy Code"
              >
                {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy size={16} />}
              </button>
              
              <SyntaxHighlighter 
                language={(problem.code?.language || 'cpp').toLowerCase()} 
                style={customNeonTheme}
                customStyle={{ 
                  margin: 0, 
                  padding: '32px', 
                  fontSize: '13px', 
                  lineHeight: '1.8', 
                  background: 'transparent',
                  fontFamily: '"Fira Code", "JetBrains Mono", monospace'
                }}
                showLineNumbers
                lineNumberStyle={{ color: '#475569', minWidth: '2.5em' }}
              >
                {problem.code?.sourceCode || '// No source code provided.'}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="relative p-8 md:p-12 min-h-[300px]" style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '100% 2.5rem'
            }}>
              <p className="text-slate-300 text-sm leading-[2.5rem] font-mono whitespace-pre-wrap">
                {problem.note || "No notes available for this problem yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};