// app/api/models/user.model.ts
import mongoose, { Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 2. Updated Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: [true, 'Username is required'], 
      unique: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    name: { 
      type: String, 
      trim: true 
    },
    email: { 
      type: String, 
      unique: true, 
      lowercase: true, 
      trim: true,
      sparse: true
    },
    phone: { 
      type: String, 
      trim: true 
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' }
    }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>('User', UserSchema);