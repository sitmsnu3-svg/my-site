import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { canAfford, addCurrency } from '@/lib/economy'

export async function GET() {
  try {
    const guilds = await prisma.guild.findMany({
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            level: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(guilds)
  } catch (error) {
    console.error('Get guilds error:', error)
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

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user can afford guild creation (50 mana)
    const canCreate = await canAfford(payload.userId, 50)
    if (!canCreate) {
      return NextResponse.json(
        { error: 'Недостаточно маны для создания гильдии (требуется 50)' },
        { status: 400 }
      )
    }

    // Deduct cost
    await addCurrency(payload.userId, -50, 'Создание гильдии')

    const guild = await prisma.guild.create({
      data: {
        name,
        description,
        leaderId: payload.userId,
      },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            level: true,
          },
        },
      },
    })

    // Add leader to guild
    await prisma.user.update({
      where: { id: payload.userId },
      data: { guildId: guild.id },
    })

    return NextResponse.json(guild)
  } catch (error) {
    console.error('Create guild error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
