@echo off
title BankChain Tchad - Frontend
echo ============================================
echo   BankChain Tchad - Frontend
echo ============================================
echo.

:: Tue l'ancien processus sur le port 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
  taskkill /F /PID %%a >nul 2>&1
)
:: Tue aussi 5174
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174 "') do (
  taskkill /F /PID %%a >nul 2>&1
)

cd /D D:\smart\bankchain-tchad\frontend
echo [OK] Demarrage du serveur sur http://localhost:5173
echo.
node node_modules\vite\bin\vite.js --host --port 5173
pause
