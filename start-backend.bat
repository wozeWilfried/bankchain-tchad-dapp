@echo off
title BankChain Tchad - Backend
echo ============================================
echo   BankChain Tchad - Backend
echo ============================================
echo.

:: Tue l'ancien processus sur le port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 "') do (
  taskkill /F /PID %%a >nul 2>&1
)

cd /D D:\smart\bankchain-tchad\backend
echo [OK] Demarrage du serveur sur http://localhost:3001
echo.
node src\server.js
pause
