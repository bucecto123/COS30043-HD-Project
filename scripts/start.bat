@echo off
echo ========================================
echo   Da Nang Deals - Starting Servers
echo ========================================
echo.

:: Start backend in a new window
echo Starting backend server on http://localhost:3000...
start "Backend Server" cmd /k "cd /d %~dp0..\backend && npm start"

:: Wait a moment for backend to initialize
timeout /t 2 /nobreak > nul

:: Start frontend in a new window
echo Starting frontend server on http://localhost:5173...
start "Frontend Server" cmd /k "cd /d %~dp0..\frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   - Backend:  http://localhost:3000
echo   - Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to open the app in your browser...
pause > nul
start http://localhost:5173
