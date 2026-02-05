# 项目一键启动脚本 (PowerShell)
# 使用方法：右键点击文件 -> 使用 PowerShell 运行，或在 PowerShell 中执行: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  实用工具箱 - 一键启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 pnpm 是否安装
$pnpmInstalled = Get-Command pnpm -ErrorAction SilentlyContinue

if (-not $pnpmInstalled) {
    Write-Host "[提示] 未检测到 pnpm，正在尝试自动安装..." -ForegroundColor Yellow
    Write-Host ""
    try {
        npm install -g pnpm
        Write-Host "[成功] pnpm 安装完成！" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host ""
        Write-Host "[失败] pnpm 安装失败！" -ForegroundColor Red
        Write-Host "请手动执行以下命令后再运行此脚本：" -ForegroundColor Yellow
        Write-Host "  npm install -g pnpm" -ForegroundColor White
        Write-Host ""
        Read-Host "按回车键退出"
        exit 1
    }
}

# 检查 node_modules 是否存在
if (-not (Test-Path "node_modules")) {
    Write-Host "[提示] 检测到首次运行，正在安装依赖..." -ForegroundColor Yellow
    Write-Host ""
    try {
        pnpm install
        Write-Host "[成功] 依赖安装完成！" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host ""
        Write-Host "[失败] 依赖安装失败！" -ForegroundColor Red
        Write-Host "请检查网络连接或手动执行: pnpm install" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "按回车键退出"
        exit 1
    }
}

# 启动开发服务器
Write-Host "[启动] 正在启动开发服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host "  按 Ctrl+C 可停止服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 在新窗口启动服务器
$devWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm run dev" -PassThru

# 等待服务器启动（增加等待时间）
Write-Host "[提示] 等待服务器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 检测服务器是否启动成功
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
} catch {
    Write-Host "[警告] 服务器尚未就绪，继续等待..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# 打开浏览器
Write-Host "[提示] 正在打开浏览器..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "[成功] 服务器已启动，浏览器已打开！" -ForegroundColor Green
Write-Host ""
Write-Host "[注意] 服务器日志在新窗口中运行。" -ForegroundColor Cyan
Write-Host "       关闭该窗口即可停止服务器。" -ForegroundColor Cyan
Write-Host ""
Write-Host "[提示] 如果浏览器显示错误，请稍等几秒后刷新页面。" -ForegroundColor Cyan
Write-Host ""
Read-Host "按回车键退出"
