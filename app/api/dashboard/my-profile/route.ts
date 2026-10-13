// app/api/dashboard/my-profile/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/api/lib/db';
import { User } from '@/app/api/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: Request) {
  try {
    await connectDB();

    // 1. Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    let token = '';

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc: any, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies['token'];
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token found' },
        { status: 401 }
      );
    }

    // 2. Verify token and extract user id
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 3. Fetch user from database (excluding password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}