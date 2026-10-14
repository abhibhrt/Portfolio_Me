// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect both admin pages and admin API routes if needed
  const isProtectedRoute = 
    path.startsWith('/admin') || 
    path.startsWith('/api/admin');

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: No token provided' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: Invalid token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

// Add all paths you want to protect here
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};