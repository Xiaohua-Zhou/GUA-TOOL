@echo off
echo ========================================
echo   Toolbox - Quick Start Script
echo ========================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] pnpm not found, installing...
    echo.
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install pnpm!
        echo Please run manually: npm install -g pnpm
        echo.
        pause
        exit /b 1
    )
    echo [SUCCESS] pnpm installed!
    echo.
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] First run detected, installing dependencies...
    echo.
    call pnpm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo Please check network or run: pnpm install
        echo.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed!
    echo.
)

REM Start development server
echo [STARTING] Starting development server...
echo.
echo ========================================
echo   Server will run at http://localhost:3000
echo   Press Ctrl+C to stop
echo ========================================
echo.

REM Start server in new window
start "Dev Server" cmd /k "pnpm run dev"

REM Wait for server to start (increase timeout)
echo [INFO] Waiting for server to start...
timeout /t 10 /nobreak >nul

REM Check if server is running
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Server not ready yet, waiting longer...
    timeout /t 10 /nobreak >nul
)

REM Open browser
echo [INFO] Opening browser...
start http://localhost:3000

echo.
echo [SUCCESS] Server started and browser opened!
echo.
echo [NOTE] Server logs are running in the new window.
echo       Close that window to stop the server.
echo.
echo [TIP] If browser shows error, wait a few more seconds and refresh.
echo.
pause
