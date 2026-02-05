# Generate ANSI-encoded batch file with Chinese characters
# Run this script once to create the proper batch file

$batchContent = @"
@echo off
chcp 936 >nul
echo ========================================
echo   实用工具箱 - 一键启动脚本
echo ========================================
echo.

REM 检查 pnpm 是否安装
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 pnpm，正在尝试自动安装...
    echo.
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo.
        echo [失败] pnpm 安装失败！
        echo 请手动执行以下命令后再运行此脚本：
        echo   npm install -g pnpm
        echo.
        pause
        exit /b 1
    )
    echo [成功] pnpm 安装完成！
    echo.
)

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [提示] 检测到首次运行，正在安装依赖...
    echo.
    call pnpm install
    if %errorlevel% neq 0 (
        echo.
        echo [失败] 依赖安装失败！
        echo 请检查网络连接或手动执行: pnpm install
        echo.
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成！
    echo.
)

REM 启动开发服务器
echo [启动] 正在启动开发服务器...
echo.
echo ========================================
echo   服务将在 http://localhost:3000 启动
echo   按 Ctrl+C 可停止服务器
echo ========================================
echo.

REM 在新窗口启动服务器
start "开发服务器" cmd /k "pnpm run dev"

REM 等待服务器启动（增加等待时间）
echo [提示] 等待服务器启动...
timeout /t 10 /nobreak >nul

REM 检测服务器是否启动成功
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 服务器尚未就绪，继续等待...
    timeout /t 10 /nobreak >nul
)

REM 打开浏览器
echo [提示] 正在打开浏览器...
start http://localhost:3000

echo.
echo [成功] 服务器已启动，浏览器已打开！
echo.
echo [注意] 服务器日志在新窗口中运行。
echo       关闭该窗口即可停止服务器。
echo.
echo [提示] 如果浏览器显示错误，请稍等几秒后刷新页面。
echo.
pause
"@

# Save as ANSI (GBK) encoding
$encoding = [System.Text.Encoding]::GetEncoding("GB2312")
[System.IO.File]::WriteAllText("$PSScriptRoot\start.bat", $batchContent, $encoding)

Write-Host "SUCCESS: start.bat has been created with correct encoding!" -ForegroundColor Green
Write-Host "Now you can double-click start.bat to run the project." -ForegroundColor Yellow
