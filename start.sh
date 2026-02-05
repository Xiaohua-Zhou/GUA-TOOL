#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "  实用工具箱 - 一键启动脚本"
echo "========================================"
echo ""

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}[提示] 未检测到 pnpm，正在尝试自动安装...${NC}"
    echo ""
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}[失败] pnpm 安装失败！${NC}"
        echo "请手动执行以下命令后再运行此脚本："
        echo "  npm install -g pnpm"
        echo ""
        exit 1
    fi
    echo -e "${GREEN}[成功] pnpm 安装完成！${NC}"
    echo ""
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[提示] 检测到首次运行，正在安装依赖...${NC}"
    echo ""
    pnpm install
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}[失败] 依赖安装失败！${NC}"
        echo "请检查网络连接或手动执行: pnpm install"
        echo ""
        exit 1
    fi
    echo -e "${GREEN}[成功] 依赖安装完成！${NC}"
    echo ""
fi

# 启动开发服务器
echo -e "${GREEN}[启动] 正在启动开发服务器...${NC}"
echo ""
echo "========================================"
echo "  服务将在 http://localhost:3000 启动"
echo "  按 Ctrl+C 可停止服务器"
echo "========================================"
echo ""

pnpm run dev
