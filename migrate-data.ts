import { PrismaClient } from '@prisma/client'
import Database from 'sqlite3'
import { open } from 'sqlite'
import * as path from 'path'

const sqlitePath = path.join(__dirname, 'prisma', 'dev.db')

async function migrateData() {
  console.log('Начинаем миграцию данных из SQLite в PostgreSQL...')
  
  // Подключение к SQLite
  const sqlite = await open({
    filename: sqlitePath,
    driver: Database.Database
  })
  
  // Подключение к PostgreSQL
  const prisma = new PrismaClient()
  
  try {
    // Миграция пользователей
    console.log('Миграция пользователей...')
    const users = await sqlite.all('SELECT * FROM User')
    
    for (const user of users) {
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            level: user.level,
            xp: user.xp,
            currency: user.currency,
            class: user.class,
            guildId: user.guildId,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        })
        console.log(`  ✓ Пользователь: ${user.username}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с пользователем ${user.username}:`, error.message)
      }
    }
    
    // Миграция гильдий
    console.log('Миграция гильдий...')
    const guilds = await sqlite.all('SELECT * FROM Guild')
    
    for (const guild of guilds) {
      try {
        await prisma.guild.upsert({
          where: { id: guild.id },
          update: {},
          create: {
            id: guild.id,
            name: guild.name,
            description: guild.description,
            leaderId: guild.leaderId,
            createdAt: new Date(guild.createdAt),
            updatedAt: new Date(guild.updatedAt)
          }
        })
        console.log(`  ✓ Гильдия: ${guild.name}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с гильдией ${guild.name}:`, error.message)
      }
    }
    
    // Миграция категорий
    console.log('Миграция категорий...')
    const categories = await sqlite.all('SELECT * FROM Category')
    
    for (const category of categories) {
      try {
        await prisma.category.upsert({
          where: { id: category.id },
          update: {},
          create: {
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            slug: category.slug,
            requireRole: category.requireRole,
            rules: category.rules,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt)
          }
        })
        console.log(`  ✓ Категория: ${category.name}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с категорией ${category.name}:`, error.message)
      }
    }
    
    // Миграция тем
    console.log('Миграция тем...')
    const threads = await sqlite.all('SELECT * FROM Thread')
    
    for (const thread of threads) {
      try {
        await prisma.thread.upsert({
          where: { id: thread.id },
          update: {},
          create: {
            id: thread.id,
            title: thread.title,
            content: thread.content,
            authorId: thread.authorId,
            categoryId: thread.categoryId,
            parentId: thread.parentId,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.updatedAt),
            views: thread.views,
            currencyReward: thread.currencyReward
          }
        })
        console.log(`  ✓ Тема: ${thread.title}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с темой ${thread.title}:`, error.message)
      }
    }
    
    // Миграция комментариев
    console.log('Миграция комментариев...')
    const comments = await sqlite.all('SELECT * FROM Comment')
    
    for (const comment of comments) {
      try {
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: {},
          create: {
            id: comment.id,
            content: comment.content,
            authorId: comment.authorId,
            threadId: comment.threadId,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt)
          }
        })
        console.log(`  ✓ Комментарий: ${comment.id}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с комментарием ${comment.id}:`, error.message)
      }
    }
    
    // Миграция транзакций
    console.log('Миграция транзакций...')
    const transactions = await sqlite.all('SELECT * FROM Transaction')
    
    for (const transaction of transactions) {
      try {
        await prisma.transaction.upsert({
          where: { id: transaction.id },
          update: {},
          create: {
            id: transaction.id,
            userId: transaction.userId,
            amount: transaction.amount,
            reason: transaction.reason,
            createdAt: new Date(transaction.createdAt)
          }
        })
        console.log(`  ✓ Транзакция: ${transaction.id}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с транзакцией ${transaction.id}:`, error.message)
      }
    }
    
    // Миграция уведомлений
    console.log('Миграция уведомлений...')
    const notifications = await sqlite.all('SELECT * FROM Notification')
    
    for (const notification of notifications) {
      try {
        await prisma.notification.upsert({
          where: { id: notification.id },
          update: {},
          create: {
            id: notification.id,
            userId: notification.userId,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: new Date(notification.createdAt)
          }
        })
        console.log(`  ✓ Уведомление: ${notification.id}`)
      } catch (error: any) {
        console.log(`  ✗ Ошибка с уведомлением ${notification.id}:`, error.message)
      }
    }
    
    console.log('\n✅ Миграция данных завершена успешно!')
    
  } catch (error: any) {
    console.error('❌ Ошибка при миграции:', error)
  } finally {
    await sqlite.close()
    await prisma.$disconnect()
  }
}

migrateData()
