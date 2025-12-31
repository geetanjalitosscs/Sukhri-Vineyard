@echo off
echo Starting Backend Server...
echo.
cd /d %~dp0
npm run start:dev
pause

