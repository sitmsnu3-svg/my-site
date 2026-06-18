import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = ['/admin', '/api/admin']

// Routes that require admin role
const adminRoutes = ['/admin', '/api/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      // Redirect to login for protected routes
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      // Return 401 for API routes
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if route requires admin role
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    
    if (isAdminRoute && payload.role !== 'ADMIN') {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
