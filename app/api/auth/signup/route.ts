// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { connectDB } from '@/app/api/lib/db';
import { User } from '@/app/api/models/user.model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, email, phone, address } = body ?? {};


    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUsersCount = await User.countDocuments({});

    if (existingUsersCount >= 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration is closed. A primary user already exists.',
        },
        { status: 403 }
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      address,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}