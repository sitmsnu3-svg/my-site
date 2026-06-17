import { prisma } from './prisma'

export async function addXP(userId: string, amount: number): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return

  const newXP = user.xp + amount
  const newLevel = Math.floor(newXP / 100) + 1

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel > user.level ? newLevel : user.level,
    },
  })

  // Check if level up
  if (newLevel > user.level) {
    await prisma.notification.create({
      data: {
        userId,
        message: `🎉 Поздравляем! Вы достигли уровня ${newLevel}!`,
        isRead: false,
      },
    })
  }
}

export async function addCurrency(userId: string, amount: number, reason: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        currency: {
          increment: amount,
        },
      },
    }),
    prisma.transaction.create({
      data: {
        userId,
        amount,
        reason,
      },
    }),
    prisma.notification.create({
      data: {
        userId,
        message: amount > 0 
          ? `💎 +${amount} Маны (${reason})`
          : `💎 ${amount} Маны (${reason})`,
        isRead: false,
      },
    }),
  ])
}

export async function checkLevelUp(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false

  const requiredXP = user.level * 100
  return user.xp >= requiredXP
}

export async function canAfford(userId: string, cost: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return false
  return user.currency >= cost
}
