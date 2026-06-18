import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication (only frontend pages, not API routes)
const protectedRoutes = ['/admin']

// Routes that require admin role (only frontend pages, not API routes)
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes entirely
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      // Redirect to login for protected routes
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if route requires admin role
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    
    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
