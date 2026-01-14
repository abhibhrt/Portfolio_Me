import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connectDB } from '@/app/api/lib/db';
import { User } from '@/app/api/models/user.model';

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET missing in environment variables');
}

/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  try {
    console.log('Auth request received');
    const body = await request.json();

    const { username, password } = body ?? {};

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    await connectDB();

    /* -------------------------- Fetch ALL users -------------------------- */
    const users = await User.find({});

    /* ------------------------ SAFETY: single user only ------------------------ */
    if (users.length > 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Security violation: multiple users detected',
        },
        { status: 500 }
      );
    }

    let user = await User.findOne({ username: username });

    /* -------------------------- First-time bootstrap -------------------------- */
    if (!user && users.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        username: username || 'admin',
        password: hashedPassword,
      });
    } else {
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    /* ---------------------------------- JWT ---------------------------------- */
    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Auth error:', error);

    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}