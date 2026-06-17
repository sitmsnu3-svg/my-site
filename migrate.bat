@echo off
echo Running Prisma migrations for PostgreSQL...
echo.
echo Make sure PostgreSQL is running and DATABASE_URL is set in .env
echo.
npx prisma migrate dev
echo.
echo Migration completed!
pause
