#!/bin/bash

# Start both backend and frontend dev servers

echo "Starting Backend Server..."
cd backend
start "Backend Server" cmd /k "node server.js"

echo "Waiting for backend to start..."
timeout /t 2 /nobreak >nul

echo "Starting Frontend Dev Server..."
cd ../frontend
start "Frontend Dev Server" cmd /k "npm run dev"

echo ""
echo "Both servers are starting!"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
