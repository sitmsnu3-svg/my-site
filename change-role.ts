import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function changeRole() {
  const username = process.argv[2]
  const newRole = process.argv[3]

  if (!username || !newRole) {
    console.log('Использование: npx ts-node change-role.ts <username> <role>')
    console.log('Пример: npx ts-node change-role.ts username MODERATOR')
    console.log('Доступные роли: ADVENTURER, MODERATOR, ADMIN, GAME_MASTER, GUARDIAN')
    process.exit(1)
  }

  const validRoles = ['ADVENTURER', 'MODERATOR', 'ADMIN', 'GAME_MASTER', 'GUARDIAN']
  
  if (!validRoles.includes(newRole)) {
    console.log(`Неверная роль. Доступные роли: ${validRoles.join(', ')}`)
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { username },
      data: { role: newRole }
    })

    console.log(`✅ Роль пользователя ${user.username} изменена на ${newRole}`)
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

changeRole()
