@echo off
echo Миграция данных из SQLite в PostgreSQL...
echo.

echo Шаг 1: Установка зависимостей для миграции...
call npm install sqlite sqlite3 @types/sqlite3

echo.
echo Шаг 2: Запуск миграции данных...
call npm run migrate:data

echo.
echo Миграция завершена!
pause
