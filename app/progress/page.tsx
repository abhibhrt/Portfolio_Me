'use client'

import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiLink,
  FiCheck,
  FiX,
} from 'react-icons/fi';

// --- TYPES ---
interface ProgressItem {
  date: string
  category: string
  status: number
  note: string
  record: string[]
}

// --- STATIC DATA ---
const PROGRESS_DATA: ProgressItem[] = [
  {
    date: '2025-01-02',
    category: 'Frontend',
    status: 1,
    note: 'Implemented hero section animations and layout polish.',
    record: ['https://github.com/example/frontend-commit'],
  },
  {
    date: '2025-01-04',
    category: 'Backend',
    status: 0,
    note: 'API design postponed due to missing server infrastructure.',
    record: [],
  },
  {
    date: '2025-01-06',
    category: 'UI/UX',
    status: 1,
    note: 'Refined dark theme contrast and spacing system.',
    record: ['https://dribbble.com/example'],
  },
  {
    date: '2025-01-10',
    category: 'Frontend',
    status: 1,
    note: 'Progress calendar and table components completed.',
    record: [],
  },
]

const Progress = () => {
  const [monthOffset, setMonthOffset] = useState(0)
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [activeRecord, setActiveRecord] = useState<string[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  // --- DERIVED DATA ---
  const categories = useMemo(
    () => ['All', ...new Set(PROGRESS_DATA.map((i) => i.category))],
    []
  )

  const filteredData = useMemo(
    () =>
      selectedCategory === 'All'
        ? PROGRESS_DATA
        : PROGRESS_DATA.filter((i) => i.category === selectedCategory),
    [selectedCategory]
  )

  const contributionData = useMemo(() => {
    const data: Record<string, number[]> = {}

    PROGRESS_DATA.forEach((item) => {
      const [y, m, d] = item.date.split('-')
      const day = parseInt(d)
      const key = `${y}-${m}`

      if (!data[key]) {
        const days = new Date(parseInt(y), parseInt(m), 0).getDate()
        data[key] = Array(days).fill(0)
      }

      if (item.status === 1) data[key][day - 1] = 1
    })

    return data
  }, [])

  const getMonthInfo = (offset: number) => {
    const today = new Date()
    const current = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = current.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const key = `${year}-${String(month + 1).padStart(2, '0')}`

    const dates: (Date | null)[] = Array(firstDay).fill(null)
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i))
    }

    return {
      dates,
      contributions: contributionData[key] || Array(daysInMonth).fill(0),
      monthName: current.toLocaleString('default', { month: 'long' }),
      year,
      isCurrentMonth:
        year === today.getFullYear() && month === today.getMonth(),
    }
  }

  const { dates, contributions, monthName, year, isCurrentMonth } =
    getMonthInfo(monthOffset)

  return (
    <section className="relative min-h-screen bg-slate-950 py-24 pt-30 px-6" id="Progress">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
              <span className="h-[1px] w-8 bg-blue-500" />
              Efficiency_Metrics
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
              My <span className="text-slate-500">Progress</span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={classNames(
                  'px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-all',
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-800 text-slate-500 hover:border-slate-600'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TABLE */}
          <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredData.map((item, i) => (
                  <tr key={i} className="hover:bg-blue-500/5">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-xs text-white uppercase">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.status ? (
                        <FiCheck className="text-emerald-500 inline" />
                      ) : (
                        <FiX className="text-red-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button onClick={() => setActiveNote(item.note)}>
                        <FiFileText />
                      </button>
                      {item.record.length > 0 && (
                        <button onClick={() => setActiveRecord(item.record)}>
                          <FiLink />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CALENDAR */}
          <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-mono text-xs text-white uppercase">
                {monthName} {year}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setMonthOffset((p) => p - 1)}>
                  <FiChevronLeft />
                </button>
                <button
                  disabled={isCurrentMonth}
                  onClick={() => setMonthOffset((p) => p + 1)}
                  className={isCurrentMonth ? 'opacity-20' : ''}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {dates.map((date, i) =>
                date ? (
                  <div
                    key={i}
                    className={classNames(
                      'aspect-square flex items-center justify-center text-[10px] border',
                      contributions[date.getDate() - 1]
                        ? 'bg-blue-600/20 border-blue-600/50 text-blue-400'
                        : 'border-slate-800 text-slate-600'
                    )}
                  >
                    {date.getDate()}
                  </div>
                ) : (
                  <div key={i} />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {(activeNote || activeRecord) && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur flex items-center justify-center p-6 z-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => {
                  setActiveNote(null)
                  setActiveRecord(null)
                }}
                className="absolute top-4 right-4"
              >
                <FiX />
              </button>

              {activeNote && <p className="text-slate-300">{activeNote}</p>}

              {activeRecord && (
                <ul className="space-y-3">
                  {activeRecord.map((l, i) => (
                    <li key={i}>
                      <a href={l} target="_blank" className="text-blue-400">
                        Resource {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Progress