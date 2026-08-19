import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '阿瓜的实用小工具',
    template: '%s | 阿瓜的实用小工具',
  },
  description: '一个功能齐全的实用工具箱集合',
  keywords: [
    '实用工具',
    '倒计时',
    '随机数生成',
    '骰子投掷器',
    '单位换算器',
    '日期计算器',
    '二维码生成器',
    '决策轮盘',
    '数字转换器',
    '计算器',
    '颜色转换器',
    'Markdown 编辑器',
    'CSS 渐变生成器',
  ],
  authors: [{ name: '@阿瓜' }],
  generator: 'Next.js',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
