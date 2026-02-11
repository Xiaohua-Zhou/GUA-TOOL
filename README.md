# 阿瓜的实用小工具

一个功能齐全的实用工具箱集合，包含倒计时、随机数生成、骰子投掷器、单位换算器、日期计算器、二维码生成器、决策轮盘、数字转换器、计算器、颜色转换器、Markdown 编辑器和 CSS 渐变生成器。

## ✨ 功能介绍

### 1. 倒计时器
设置倒计时，精确到秒，支持暂停、重置和音频提醒。
- 适用于考试、烹饪、运动倒计时等场景

### 2. 随机数生成器
在指定范围内生成随机数，支持生成多个随机数和去重。
- 适用于抽奖、随机选择、密码生成等场景

### 3. 骰子投掷器
支持 D4、D6、D8、D10、D12、D20、D100 等多种骰子类型，可设置骰子数量和全局加值。
- 适用于桌游、TRPG、概率计算等场景

### 4. 单位换算器
支持长度、重量、温度、面积、体积、时间、速度、数据存储等多种单位换算。
- 日常计算必备工具

### 5. 日期计算器
计算两个日期之间的天数、工作日，或计算指定天数后的日期。
- 适用于项目规划、倒计时、纪念日等场景

### 6. 二维码生成器
将文本或链接转换为二维码图片，支持自定义颜色和大小，支持下载。
- 适用于分享链接、名片、促销活动等场景

### 7. 决策轮盘
添加选项后旋转轮盘，随机选择一个选项，支持自定义轮盘颜色和指针样式。
- 适用于无法做决定时、抽奖、游戏等场景

### 8. 数字转换器
支持二进制、八进制、十进制、十六进制之间的转换，实时预览结果。
- 适用于编程、数学计算、数字转换等场景

### 9. 计算器
支持基本四则运算、百分比、平方根等常用计算功能。
- 日常计算必备

### 10. 颜色转换器
支持 HEX、RGB、HSL、CMYK 等多种颜色格式转换，提供颜色预览。
- 适用于设计、前端开发、颜色搭配等场景

### 11. Markdown 编辑器
实时预览 Markdown 编辑器，支持常用 Markdown 语法和数学公式。
- 适用于文档编写、笔记、博客写作等场景

### 12. CSS 渐变生成器
生成线性和径向渐变，支持自定义多个颜色节点，实时预览并复制 CSS 代码。
- 适用于网页设计、UI 开发、视觉效果设计等场景

## 🚀 快速开始

### Windows 用户

双击 `start-robust.bat` 文件即可启动：
```
双击 start-robust.bat
→ 服务器自动启动
→ 浏览器自动打开
→ 开始使用
```

### macOS / Linux 用户

```bash
chmod +x start.sh  # 首次运行需要添加执行权限
./start.sh
```

然后在浏览器中访问：http://localhost:3000

## 💡 使用说明

### 基本操作

1. **选择工具**：点击顶部的功能标签切换不同的工具
2. **输入参数**：根据工具提示输入相关参数
3. **查看结果**：工具会实时显示计算结果
4. **复制/下载**：支持复制结果或下载生成的文件

### 响应式设计

工具箱完全支持响应式设计，可在以下设备上流畅使用：
- 📱 手机
- 📱 平板
- 💻 桌面电脑
- 🖥️ 大屏显示器

## 🌐 在线访问

如果不想本地安装，也可以在线使用（需要部署到服务器后）。

## 🤝 关于作者

**@阿瓜**

- GitHub: [Xiaohua-Zhou/GUA-TOOL](https://github.com/Xiaohua-Zhou/GUA-TOOL)
- Bilibili: [3060829](https://space.bilibili.com/3060829)

## 📁 项目结构

```
projects/
├── src/
│   ├── app/                    # Next.js 应用目录
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 主页面（工具箱入口）
│   │   ├── globals.css        # 全局样式
│   │   └── favicon.ico        # 网站图标
│   │
│   ├── components/            # React 组件
│   │   ├── ui/               # shadcn/ui 基础组件库
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...            # 其他 UI 组件
│   │   │
│   │   ├── countdown-timer.tsx        # 倒计时器
│   │   ├── random-number-generator.tsx # 随机数生成器
│   │   ├── dice-roller.tsx            # 骰子投掷器
│   │   ├── unit-converter.tsx         # 单位换算器
│   │   ├── date-calculator.tsx        # 日期计算器
│   │   ├── qrcode-generator.tsx       # 二维码生成器
│   │   ├── decision-wheel.tsx         # 决策轮盘
│   │   ├── number-converter.tsx       # 数字转换器
│   │   ├── calculator.tsx             # 计算器
│   │   ├── color-converter.tsx        # 颜色转换器
│   │   ├── markdown-editor.tsx        # Markdown 编辑器
│   │   └── css-gradient-generator.tsx # CSS 渐变生成器
│   │
│   ├── hooks/                # React Hooks
│   │   └── use-mobile.ts    # 移动端检测 Hook
│   │
│   └── lib/                  # 工具函数
│       └── utils.ts         # 通用工具函数
│
├── public/                   # 静态资源
├── package.json             # 项目依赖配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.ts       # Tailwind CSS 配置
├── next.config.ts           # Next.js 配置
├── postcss.config.mjs       # PostCSS 配置
│
├── start-robust.bat         # Windows 启动脚本
├── start.ps1                # PowerShell 启动脚本
├── start.sh                 # macOS/Linux 启动脚本
└── README.md                # 项目说明文档
```

## 📝 技术栈

本项目基于以下技术构建：
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## 🛠️ 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

访问：http://localhost:3000

### 构建生产版本

```bash
pnpm run build
pnpm run start
```

### 依赖管理

**注意**：本项目必须使用 pnpm 作为包管理器。

```bash
# 安装依赖
pnpm install

# 添加新依赖
pnpm add package-name

# 添加开发依赖
pnpm add -D package-name
```

## 📄 许可证

本项目仅供学习和个人使用。

## 🙏 致谢

感谢所有开源项目使用者！

---

**有问题？欢迎在 GitHub 提 Issue 或联系作者！**
