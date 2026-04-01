@echo off
echo Stopping all dev servers...

:: Kill processes on port 3000 (backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing backend (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill processes on port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Killing frontend (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All dev servers stopped!
echo Port 3000 and 5173 are now free.
