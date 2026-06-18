import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            level: true,
            class: true,
          },
        },
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                level: true,
                class: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.thread.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Get thread error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
