'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiTrash2, FiClock, FiInbox } from 'react-icons/fi'
import ConfirmModal from '@/app/components/confirm-modal'

export interface ReceivedMessage {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
}

interface AdminMessagesProps {
  messages: ReceivedMessage[]
  loading: boolean
  onDelete: (id: string) => Promise<void>
}

export default function AdminMessages({
  messages,
  loading,
  onDelete,
}: AdminMessagesProps) {
  const [deleteTarget, setDeleteTarget] = useState<ReceivedMessage | null>(null)

  const handleConfirmDelete = async (choice: boolean) => {
    const target = deleteTarget
    setDeleteTarget(null)
    if (!choice || !target) return
    await onDelete(target._id)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-lg shadow-xl"
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <FiInbox className="text-blue-400" size={16} />
            <h3 className="text-xs font-mono text-white uppercase tracking-widest">
              Transmitted Queries ({messages.length})
            </h3>
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase">
            Admin Inbox
          </span>
        </div>

        {loading ? (
          <p className="text-xs font-mono text-slate-400 py-6 text-center">
            Loading incoming messages...
          </p>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
            <p className="text-[11px] font-mono uppercase text-slate-500">
              No messages received yet
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 bg-white/[0.03] border border-white/10 hover:border-blue-500/40 rounded-md transition-colors space-y-2.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {msg.name}
                    </h4>
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:underline"
                    >
                      <FiMail size={12} />
                      {msg.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <FiClock size={11} />
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => setDeleteTarget(msg)}
                      title="Delete Message"
                      className="p-1.5 text-red-400 hover:text-white hover:bg-red-600/80 rounded transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-1 border-t border-white/5">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Purge Message"
        message={
          deleteTarget
            ? `Delete message from "${deleteTarget.name}"?`
            : 'Delete this message?'
        }
        onYes={() => handleConfirmDelete(true)}
        onNo={() => handleConfirmDelete(false)}
      />
    </>
  )
}