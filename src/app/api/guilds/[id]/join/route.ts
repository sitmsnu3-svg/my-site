import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { canAfford, addCurrency } from '@/lib/economy'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user can afford joining (50 mana)
    const canJoin = await canAfford(payload.userId, 50)
    if (!canJoin) {
      return NextResponse.json(
        { error: 'Недостаточно маны для вступления в гильдию (требуется 50)' },
        { status: 400 }
      )
    }

    // Deduct cost
    await addCurrency(payload.userId, -50, 'Вступление в гильдию')

    // Update user guild
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: { guildId: params.id },
      include: { guild: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Join guild error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
