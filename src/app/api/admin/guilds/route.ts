import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const guilds = await prisma.guild.findMany({
      include: {
        leader: {
          select: {
            username: true,
            id: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(guilds)
  } catch (error) {
    console.error('Error fetching guilds:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
