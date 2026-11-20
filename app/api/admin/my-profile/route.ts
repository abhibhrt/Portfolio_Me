import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/api/lib/db';
import { User } from '@/app/api/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || '';

function getTokenFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return '';

  const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  return cookies['token'] || '';
}

function extractMapSrc(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  return srcMatch ? srcMatch[1] : trimmed;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token found' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
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

export async function POST(request: Request) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token found' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const body = await request.json();
    const { name, email, phone, address, mapUrl } = body;

    const cleanMapUrl = extractMapSrc(mapUrl);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: { name, email, phone, address, mapUrl: cleanMapUrl } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}