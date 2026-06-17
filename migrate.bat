@echo off
echo Starting database migration...
cd /d %~dp0
npx prisma generate
npx prisma db push
npx prisma db seed
echo Migration completed!
pause
