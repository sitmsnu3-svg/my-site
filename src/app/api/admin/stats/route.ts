import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    console.log('Admin stats API - Token:', token ? 'exists' : 'missing')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    console.log('Admin stats API - Decoded:', decoded)
    
    if (!decoded || decoded.role !== 'ADMIN') {
      console.log('Admin stats API - Role check failed:', decoded?.role)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [users, threads, comments, guilds, categories] = await Promise.all([
      prisma.user.count(),
      prisma.thread.count(),
      prisma.comment.count(),
      prisma.guild.count(),
      prisma.category.count(),
    ])

    return NextResponse.json({
      users,
      threads,
      comments,
      guilds,
      categories,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
