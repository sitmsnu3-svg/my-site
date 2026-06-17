import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { addXP, addCurrency } from '@/lib/economy'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { content, threadId } = await request.json()

    if (!content || !threadId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add rewards for commenting
    await addXP(payload.userId, 5)
    await addCurrency(payload.userId, 2, 'Комментарий')

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: payload.userId,
        threadId,
      },
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
    })

    // Notify thread author
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { authorId: true },
    })

    if (thread && thread.authorId !== payload.userId) {
      await prisma.notification.create({
        data: {
          userId: thread.authorId,
          message: `💬 Новый комментарий в вашей теме`,
          isRead: false,
        },
      })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
