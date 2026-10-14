import mongoose, { Schema, models, Document } from 'mongoose'

export interface IContactMessage extends Document {
  name: string
  email: string
  message: string
  createdAt: Date
  updatedAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export const ContactMessage = models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema)