@echo off
echo Migrating from SQLite to PostgreSQL...
echo.
echo IMPORTANT: Before running this script:
echo 1. Install PostgreSQL and create a database
echo 2. Update .env file with your PostgreSQL connection string
echo 3. Make sure you have pg_dump installed if you want to migrate existing data
echo.

pause

echo Step 1: Reset Prisma migrations...
rmdir /s /q prisma\migrations 2>nul

echo Step 2: Generate Prisma client...
call npx prisma generate

echo Step 3: Create new migration...
call npx prisma migrate dev --name init

echo Step 4: Push schema to database...
call npx prisma db push

echo.
echo Migration completed!
echo You can now run the project with: npm run dev
