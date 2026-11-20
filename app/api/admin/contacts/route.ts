import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/app/api/lib/db'
import { ContactMessage } from '@/app/api/models/contacts.model'

const JWT_SECRET = process.env.JWT_SECRET || ''

function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {})

  const token = cookies['token']
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const decoded = verifyAdminToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const decoded = verifyAdminToken(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    await connectDB()
    await ContactMessage.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: 'Message deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}