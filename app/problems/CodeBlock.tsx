'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheck, FiFileText, FiCode } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Import KaTeX styles for math formulas ($and$$)
import 'katex/dist/katex.min.css';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative bg-slate-950/80 backdrop-blur-2xl border border-white/10 w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden z-10">
        
        {/* Header Tabs */}
        <div className="flex justify-between items-center border-b border-white/10 bg-black/40 px-6 py-2.5">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wider transition-all cursor-pointer ${
                activeTab === 'code' 
                  ? 'text-blue-400 bg-blue-500/15 border border-blue-500/30 shadow-sm shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiCode className="text-sm" /> Source Code
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wider transition-all cursor-pointer ${
                activeTab === 'notes' 
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiFileText className="text-sm" /> Revision Notes
            </button>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/30">
          {activeTab === 'code' ? (
            <div className="relative">
              <button 
                onClick={handleCopy} 
                className="absolute top-4 right-6 z-20 bg-white/10 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all backdrop-blur-md border border-white/10 cursor-pointer shadow-lg"
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
            <div className="p-6 md:p-10 max-w-4xl mx-auto">
              {problem.note ? (
                <div className="space-y-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold text-white border-b border-white/10 pb-3 mb-4 tracking-tight">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-2 mt-6 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-emerald-400 mt-6 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm inline-block"></span>
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xs font-semibold text-slate-200 mt-3 mb-1 uppercase tracking-wider">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-amber-300/90 not-italic font-mono text-xs px-1 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                          {children}
                        </em>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4 text-sm text-slate-300">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-4 text-sm text-slate-300">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed pl-1 marker:text-emerald-500">
                          {children}
                        </li>
                      ),
                      code: ({ className, children, ...props }: any) => {
                        // Avoid styling KaTeX math elements with the pink code badge
                        if (className?.includes('math')) {
                          return <code className={className} {...props}>{children}</code>;
                        }
                        return (
                          <code
                            className="bg-white/10 text-pink-400 font-mono text-[12px] px-1.5 py-0.5 rounded border border-white/10"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-emerald-500/70 bg-emerald-500/5 px-4 py-2 rounded-r-md my-3 italic text-slate-300 text-sm">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {problem.note}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FiFileText className="text-slate-600 text-4xl mb-3" />
                  <p className="text-slate-400 font-mono text-sm">
                    No revision notes generated yet.
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    Mark problem as solved with code to auto-generate notes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};