// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import Footer from './components/footer'
import { AlertProvider } from './hooks/useAlert'
import Alert from './components/alert'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abhishek Bharti - Full Stack Developer',
  description: 'Full Stack Developer Portfolio',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AlertProvider>
          <Alert />
          <Navbar />
          {children}
          <Footer />
        </AlertProvider>
      </body>
    </html>
  )
}