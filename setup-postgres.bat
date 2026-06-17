@echo off
echo Настройка PostgreSQL для OtakuZone...
echo.

echo Шаг 1: Проверка наличия .env файла
if not exist .env (
    echo Файл .env не найден. Создаю на основе .env.example...
    copy .env.example .env
    echo.
    echo ВАЖНО: Отредактируйте файл .env и укажите правильные данные PostgreSQL:
    echo DATABASE_URL="postgresql://user:password@localhost:5432/otakuzone?schema=public"
    echo.
    pause
) else (
    echo Файл .env найден.
)

echo.
echo Шаг 2: Генерация Prisma клиента...
call npx prisma generate

echo.
echo Шаг 3: Применение миграций к базе данных...
call npx prisma migrate dev --name init

echo.
echo Шаг 4: Заполнение демо-данными...
call npx prisma db seed

echo.
echo Настройка завершена!
echo Теперь можно запустить сервер: start.bat
pause
