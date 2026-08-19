import type { Metadata } from 'next';
import HomeTabs from '@/components/home-tabs';

export const metadata: Metadata = {
  title: '阿瓜的实用小工具',
  description: '一个功能齐全的实用工具箱集合',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            阿瓜的实用小工具
          </h1>
        </div>

        {/* 功能标签页 */}
        <HomeTabs />

        {/* 页脚 */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground">@阿瓜</p>
            <span className="text-xs text-muted-foreground">|</span>
            <a
              href="https://github.com/Xiaohua-Zhou/GUA-TOOL/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <span className="text-xs text-muted-foreground">|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              沪ICP备2026006016号-1
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
