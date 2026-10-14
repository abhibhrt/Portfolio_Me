import { NextResponse } from 'next/server'
import { connectDB } from '../lib/db'
import { User } from '../models/user.model'
import { ContactMessage } from '../models/contacts.model'

export async function GET() {
  try {
    await connectDB()

    const adminUser = await User.findOne({})

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Contact details not found' },
        { status: 404 }
      )
    }
 
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d40192.30845307541!2d77.41823089476793!3d23.23106021217998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1780330535483!5m2!1sen!2sin`

    const contactData = {
      email: adminUser.email,
      phone: adminUser.phone,
      whatsapp: adminUser.phone,
      mapUrl: mapUrl,
    }

    return NextResponse.json(contactData, { status: 200 })
  } catch (error) {
    console.error('Error fetching contact details:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    })

    return NextResponse.json(
      { message: 'Message sent successfully', data: newMessage },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}