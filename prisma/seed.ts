import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create categories
  const categories = [
    {
      name: 'Аниме и манга',
      slug: 'anime-manga',
      description: 'Обсуждение аниме и манги со всего мира',
      icon: '🎬',
      requireRole: null,
      rules: '1. Уважайте мнения других участников\n2. Используйте спойлеры для важных сюжетных поворотов\n3. Не публикуйте пиратский контент\n4. Соблюдайте правила форума'
    },
    {
      name: 'Аниме и манга в России',
      slug: 'anime-manga-russia',
      description: 'Российское аниме-сообщество, локализации, мероприятия',
      icon: '🇷🇺',
      requireRole: null,
      rules: '1. Обсуждайте российские релизы и локализации\n2. Делитесь информацией о мероприятиях\n3. Поддерживайте отечественных создателей\n4. Соблюдайте правила форума'
    },
    {
      name: 'Иная анимация и комиксы',
      slug: 'other-animation-comics',
      description: 'Западная анимация, веб-комиксы, манхва и другое',
      icon: '📚',
      requireRole: null,
      rules: '1. Уважайте все направления анимации и комиксов\n2. Используйте теги для обозначения типа контента\n3. Не публикуйте пиратский контент\n4. Соблюдайте правила форума'
    },
    {
      name: 'Игры',
      slug: 'games',
      description: 'Анимешные игры, JRPG, визуальные новеллы и гейминг',
      icon: '🎮',
      requireRole: null,
      rules: '1. Обсуждайте игры в рамках правил\n2. Не публикуйте пиратские ссылки\n3. Используйте спойлеры для сюжетных моментов\n4. Соблюдайте правила форума'
    },
    {
      name: 'Обмен и продажа',
      slug: 'exchange-sale',
      description: 'Брелки, анимешные игры, мерч и другие товары',
      icon: '🛒',
      requireRole: null,
      rules: '1. Указывайте точное описание и состояние товара\n2. Используйте реальные фотографии\n3. Соблюдайте правила безопасной торговли\n4. Администрация не несёт ответственности за сделки\n5. Соблюдайте правила форума'
    },
    {
      name: 'Книги и музыка',
      slug: 'books-music',
      description: 'Лайт-новеллы, ранобэ, J-Pop, аниме-саундтреки',
      icon: '🎵',
      requireRole: null,
      rules: '1. Уважайте авторов и создателей\n2. Не публикуйте пиратский контент\n3. Делитесь легальными источниками\n4. Соблюдайте правила форума'
    },
    {
      name: 'Япония и японский язык',
      slug: 'japan-japanese',
      description: 'Культура Японии, изучение языка, путешествия',
      icon: '�',
      requireRole: 'MODERATOR', // Only moderators and admins can create topics
      rules: '1. Создавать темы могут только модераторы и администраторы\n2. Пользователи могут создавать подтемы внутри тем\n3. Уважайте японскую культуру\n4. Используйте корректную информацию\n5. Соблюдайте правила форума'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Seed completed successfully')
  console.log('📝 Categories created:', categories.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
