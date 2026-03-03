import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '阿瓜的实用小工具',
    template: '%s | 阿瓜的实用小工具',
  },
  description:
    '一个功能齐全的实用工具箱集合，包含倒计时、随机数生成、骰子投掷器、单位换算器、日期计算器、二维码生成器、决策轮盘、数字转换器、计算器、颜色转换器、Markdown 编辑器和 CSS 渐变生成器。',
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
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: '阿瓜的实用小工具',
    description:
      '一个功能齐全的实用工具箱集合，包含倒计时、随机数生成、骰子投掷器、单位换算器、日期计算器、二维码生成器、决策轮盘、数字转换器、计算器、颜色转换器、Markdown 编辑器和 CSS 渐变生成器。',
    url: 'https://guatool.top',
    siteName: '阿瓜的实用小工具',
    locale: 'zh_CN',
    type: 'website',
    // images: [
    //   {
    //     url: '',
    //     width: 1200,
    //     height: 630,
    //     alt: '阿瓜的实用小工具',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: '阿瓜的实用小工具',
  //   description:
  //     '一个功能齐全的实用工具箱集合，包含倒计时、随机数生成、骰子投掷器、单位换算器、日期计算器、二维码生成器、决策轮盘、数字转换器、计算器、颜色转换器、Markdown 编辑器和 CSS 渐变生成器。',
  //   // images: [''],
  // },
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
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
