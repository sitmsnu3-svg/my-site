# SAO Forum - Аниме Форум в стиле Sword Art Online

Геймифицированный веб-форум с визуальным стилем "Лайт-фэнтези / Иссекай", вдохновленный Sword Art Online и Mushoku Tensei.

## 🎮 Особенности

- **Геймификация**: Система уровней, XP и валюты "Мана"
- **Экономика**: Создание тем, комментарии, вступление в гильдии требуют и награждают ману
- **Гильдии**: Создавайте и вступайте в гильдии
- **SAO-стиль**: Темная тема, неоновые акценты, эффекты стекла, анимации
- **Звуковые эффекты**: SAO-стиль звуки при взаимодействии

## 🛠 Технологический стек

- **Frontend**: Next.js 14+ (App Router), TypeScript, React
- **Styling**: Tailwind CSS с кастомной конфигурацией
- **Animations**: Framer Motion
- **Database**: PostgreSQL с Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.io (инфраструктура готова)

## 📋 Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd site
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**
   
   Создайте файл `.env` на основе `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sao_forum?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```

4. **Настройте базу данных PostgreSQL**
   
   Убедитесь, что PostgreSQL установлен и работает. Создайте базу данных:
   ```sql
   CREATE DATABASE sao_forum;
   ```

5. **Примените миграции Prisma**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Заполните базу демо-данными**
   ```bash
   npx prisma db seed
   ```
   
   Это создаст:
   - Пользователя "Kirito" (GAME_MASTER, 99 уровень, 9999 Маны)
   - Пользователя "Asuna" (GUARDIAN, 50 уровень)
   - Гильдию "Черные коты полнолуния"
   - 2 категории и 3 тестовые темы

7. **Запустите сервер разработки**
   ```bash
   npm run dev
   ```

   Приложение будет доступно по адресу: http://localhost:3000

## 🎨 Визуальный стиль

- **Цвета**: Темно-синий/черный фон, неоновый голубой (Cyan-400) и фиолетовый (Purple-500) акценты
- **Эффекты**: Полупрозрачные панели с blur, светящиеся границы, неоновые тени
- **Шрифты**: Orbitron (фэнтези) для заголовков, Inter для текста
- **Анимации**: Плавные появления через Framer Motion

## 💰 Экономика

### Заработок
- Создание темы: +20 XP, +15 Маны (стоимость: 10 Маны)
- Комментарий: +5 XP, +2 Маны
- Получение лайка: +3 XP, +1 Мана

### Траты
- Создание темы: 10 Маны
- Создание гильдии: 50 Ман
- Вступление в гильдию: 50 Ман

### Уровни
- Формула: XP >= level * 100
- При повышении уровня отправляется уведомление

## 📁 Структура проекта

```
site/
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   └── seed.ts                # Демо-данные
├── public/
│   └── sounds/
│       └── sao_click.mp3      # Звуковой эффект (добавьте свой файл)
├── src/
│   ├── app/
│   │   ├── api/               # API маршруты
│   │   │   ├── auth/          # Аутентификация
│   │   │   ├── threads/       # Темы
│   │   │   ├── comments/      # Комментарии
│   │   │   ├── categories/    # Категории
│   │   │   ├── guilds/        # Гильдии
│   │   │   └── notifications/ # Уведомления
│   │   ├── auth/              # Страницы авторизации
│   │   ├── forum/             # Страницы форума
│   │   ├── thread/            # Страница темы
│   │   ├── guilds/            # Страница гильдий
│   │   ├── globals.css        # Глобальные стили
│   │   ├── layout.tsx         # Корневой layout
│   │   └── page.tsx           # Главная страница
│   ├── components/
│   │   ├── Navbar.tsx         # Навигация
│   │   └── ui/                # UI компоненты
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Textarea.tsx
│   └── lib/
│       ├── prisma.ts          # Prisma клиент
│       ├── auth.ts            # JWT функции
│       └── economy.ts         # Логика экономики
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🔐 Демо-пользователи

После запуска seed скрипта:

- **Kirito**
  - Email: kirito@sao.com
  - Пароль: password123
  - Роль: GAME_MASTER
  - Уровень: 99
  - Мана: 9999

- **Asuna**
  - Email: asuna@sao.com
  - Пароль: password123
  - Роль: GUARDIAN
  - Уровень: 50
  - Мана: 2500

## 🚀 Развертывание на Render

### Бесплатный тариф Render (256MB RAM, 0.1 CPU)

#### 1. Подготовка проекта

Проект уже оптимизирован для развертывания на Render:
- `next.config.js` настроен с `output: 'standalone'` для уменьшения размера бандла
- Добавлен health check endpoint `/api/health` для мониторинга
- Оптимизированы зависимости и память
- Настроен PostgreSQL вместо SQLite

#### 2. Создание PostgreSQL базы данных на Render

1. Зайдите на [render.com](https://render.com)
2. Создайте новый PostgreSQL сервис (бесплатный тариф)
3. После создания скопируйте **Internal Database URL**

#### 3. Настройка переменных окружения

В настройках вашего Render Web Service добавьте следующие переменные:

```env
DATABASE_URL=<ваш-postgresql-url-из-шага-2>
JWT_SECRET=<случайный-секретный-ключ>
NEXT_PUBLIC_SOCKET_URL=<ваш-домен-на-render>
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**Важно**: Замените `<ваш-postgresql-url-из-шага-2>` на скопированный URL из PostgreSQL сервиса.

#### 4. Создание Web Service

1. Подключите ваш репозиторий к Render
2. Создайте новый **Web Service**
3. Настройте следующие параметры:

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Environment:**
- **Runtime**: Node (выберите последнюю версию)
- **Region**: Ближайший к вашим пользователям

**Advanced:**
- **Health Check Path**: `/api/health`

#### 5. Автоматическая конфигурация (опционально)

Создайте файл `render.yaml` в корне проекта для автоматической настройки:

```yaml
services:
  - type: web
    name: otakuzone
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_TELEMETRY_DISABLED
        value: "1"
```

#### 6. Первичная миграция базы данных

После первого деплоя выполните миграции через Render Shell:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Или добавьте в `package.json` скрипт для автоматического запуска:

```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

#### 7. Оптимизация для бесплатного тарифа

Проект уже оптимизирован для ограничений бесплатного тарифа:
- ✅ Стandalone режим для уменьшения памяти
- ✅ Оптимизация импортов Prisma
- ✅ Отключена телеметрия Next.js
- ✅ Сжатие включено
- ✅ Неоптимизированные изображения (для экономии памяти)
- ✅ Health check для быстрого пробуждения

#### 8. Мониторинг

- Health check endpoint: `https://ваш-домен.render.com/api/health`
- Логи доступны в панели Render
- При проблемах с памятью сайт может "спать" - первый запрос может занять больше времени

## 🚀 Локальная разработка

Для локальной разработки с PostgreSQL:

1. Установите PostgreSQL и создайте базу данных:
   ```sql
   CREATE DATABASE otakuzone;
   ```

2. Настройте `.env` файл:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/otakuzone?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```

3. Примените миграции:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Заполните демо-данными:
   ```bash
   npx prisma db seed
   ```

5. Запустите сервер:
   ```bash
   npm run dev
   ```
   или
   ```bash
   start.bat
   ```

## 📝 Лицензия

MIT

## 🎮 Играйте и наслаждайтесь!

Создано в стиле Sword Art Online для сообщества аниме-фанатов.
