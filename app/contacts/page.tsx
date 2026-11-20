'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import PageHeader from '@/app/components/page-header'
import CommonLoading from '@/app/components/loading'
import ContactInfo from './contact-info'
import ContactForm from './contact-form'
import UpdateProfileModal from './update-profile-modal'
import AdminMessages, { ReceivedMessage } from './admin-messages'
import { useAuthStore } from '@/app/store/useAuthStore'
import { FiEdit3 } from 'react-icons/fi'

interface ContactData {
  email: string
  whatsapp: string
  phone: string
  mapUrl: string
}

interface ContactDetails {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)

  const [messages, setMessages] = useState<ReceivedMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false)

  const { isAdmin } = useAuthStore()

  const [details, setDetails] = useState<ContactDetails>({
    name: '',
    email: '',
    message: '',
  })

  const fetchContactDetails = useCallback(async () => {
    try {
      setIsMapLoading(true)
      const res = await axios.get('/api/contacts')
      setContactData(res.data ?? null)
    } catch (error) {
      console.error('Failed to fetch contact details:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMessages = useCallback(async () => {
    if (!isAdmin) return
    setMessagesLoading(true)
    try {
      const res = await axios.get('/api/admin/contacts')
      setMessages(res.data?.messages ?? [])
    } catch (error) {
      console.error('Failed to fetch admin messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchContactDetails()
  }, [fetchContactDetails])

  useEffect(() => {
    if (isAdmin) {
      fetchMessages()
    } else {
      setMessages([])
    }
  }, [isAdmin, fetchMessages])

  const handleDeleteMessage = async (id: string) => {
    try {
      await axios.delete(`/api/admin/contacts?id=${id}`)
      setMessages((prev) => prev.filter((msg) => msg._id !== id))
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null)
    setStatusType(null)

    try {
      await axios.post('/api/contacts', details)
      setStatusType('success')
      setStatusMessage('Message sent successfully. I will get back to you soon.')
      setDetails({ name: '', email: '', message: '' })
      if (isAdmin) fetchMessages()
    } catch (error) {
      console.error('Failed to send message:', error)
      setStatusType('error')
      setStatusMessage('Failed to transmit message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen py-24 pt-30 px-6 overflow-hidden" id="contact">
      <div className="relative z-10 max-w-7xl mx-auto">
        <PageHeader
          name="Get In Touch"
          path="abhibhrt/contacts"
          action={
            isAdmin && (
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="cursor-pointer w-12 h-12 rounded-full bg-blue-600/30 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                title="Update Profile & Map"
              >
                <FiEdit3 size={14} />
              </button>
            )
          }
        />

        {loading ? (
          <CommonLoading text="Loading Contact Modules..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ContactInfo
              contactData={contactData}
              isMapLoading={isMapLoading}
              setIsMapLoading={setIsMapLoading}
            />

            <div className="lg:col-span-7">
              <ContactForm
                details={details}
                setDetails={setDetails}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                statusMessage={statusMessage}
                statusType={statusType}
              />

              {isAdmin && (
                <AdminMessages
                  messages={messages}
                  loading={messagesLoading}
                  onDelete={handleDeleteMessage}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        currentMapUrl={contactData?.mapUrl}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchContactDetails}
      />
    </section>
  )
}