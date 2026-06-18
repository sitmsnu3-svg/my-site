import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { addXP, addCurrency, canAfford } from '@/lib/economy'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const threads = await prisma.thread.findMany({
      where: categoryId ? { categoryId } : undefined,
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
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error('Get threads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const { title, content, categoryId, parentId } = await request.json()

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get category to check permissions
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      console.error('Category not found for ID:', categoryId)
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category requires specific role
    if (category.requireRole) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check if user has required role (MODERATOR or ADMIN)
      const hasPermission = user.role === 'ADMIN' || user.role === category.requireRole
      
      if (!hasPermission) {
        // If creating a subtopic, check if parent thread exists and user can create subtopics
        if (parentId) {
          const parentThread = await prisma.thread.findUnique({
            where: { id: parentId },
            include: { category: true },
          })

          if (!parentThread) {
            return NextResponse.json(
              { error: 'Parent thread not found' },
              { status: 404 }
            )
          }

          // Users can create subtopics in threads even if they can't create main topics
          // This is for the "Япония и японский язык" category
        } else {
          return NextResponse.json(
            { error: 'Для создания тем в этом разделе требуется роль ' + category.requireRole },
            { status: 403 }
          )
        }
      }
    }

    // Check if user can afford thread creation (10 mana)
    const canCreate = await canAfford(payload.userId, 10)
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Недостаточно маны для создания темы (требуется 10)' },
        { status: 400 }
      )
    }

    // Deduct cost and add rewards
    await addCurrency(payload.userId, -10, 'Создание темы')
    await addXP(payload.userId, 20)
    await addCurrency(payload.userId, 15, 'Награда за тему')

    const thread = await prisma.thread.create({
      data: {
        title,
        content,
        authorId: payload.userId,
        categoryId,
        parentId,
        currencyReward: 15,
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
        category: true,
      },
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Create thread error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
