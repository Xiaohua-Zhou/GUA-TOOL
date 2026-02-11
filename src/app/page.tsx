import type { Metadata } from 'next';
import CountdownTimer from '@/components/countdown-timer';
import RandomNumberGenerator from '@/components/random-number-generator';
import DiceRoller from '@/components/dice-roller';
import UnitConverter from '@/components/unit-converter';
import DateCalculator from '@/components/date-calculator';
import QRCodeGenerator from '@/components/qrcode-generator';
import DecisionWheel from '@/components/decision-wheel';
import NumberConverter from '@/components/number-converter';
import Calculator from '@/components/calculator';
import ColorConverter from '@/components/color-converter';
import MarkdownEditor from '@/components/markdown-editor';
import CSSGradientGenerator from '@/components/css-gradient-generator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, Dice6, Dice3, ArrowLeftRight, CalendarDays, QrCode, HelpCircle, Languages, Calculator as CalculatorIcon, Palette, FileText, Sparkles, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: '阿瓜的实用小工具 - 倒计时 & 随机数 & 骰子投掷器 & 单位换算器 & 日期计算器 & 二维码生成器 & 决策轮盘 & 数字转换 & 计算器 & 颜色转换 & Markdown 编辑器 & CSS 渐变生成器',
  description: '阿瓜的实用小工具集合，包含倒计时、随机数、骰子投掷器、单位换算器、日期计算器、二维码生成器、决策轮盘、数字转换器、计算器、颜色转换器、Markdown 编辑器和 CSS 渐变生成器',
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
        <Tabs defaultValue="countdown" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-6xl mx-auto mb-6 sm:mb-8 p-2 sm:p-2.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl sm:rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm h-auto min-h-[60px] sm:min-h-[72px] items-stretch">
            <TabsTrigger
              value="countdown"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">倒计时</span>
            </TabsTrigger>
            <TabsTrigger
              value="random"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Dice6 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">随机数</span>
            </TabsTrigger>
            <TabsTrigger
              value="dice"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Dice3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">骰子</span>
            </TabsTrigger>
            <TabsTrigger
              value="unit"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">单位换算</span>
            </TabsTrigger>
            <TabsTrigger
              value="date"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">日期计算</span>
            </TabsTrigger>
            <TabsTrigger
              value="qrcode"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">二维码</span>
            </TabsTrigger>
            <TabsTrigger
              value="wheel"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">决策轮盘</span>
            </TabsTrigger>
            <TabsTrigger
              value="number"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">数字转换</span>
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <CalculatorIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">计算器</span>
            </TabsTrigger>
            <TabsTrigger
              value="color"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">颜色转换</span>
            </TabsTrigger>
            <TabsTrigger
              value="markdown"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">Markdown</span>
            </TabsTrigger>
            <TabsTrigger
              value="gradient"
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">CSS 渐变</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="countdown" className="focus:outline-none">
            <CountdownTimer />
          </TabsContent>

          <TabsContent value="random" className="focus:outline-none">
            <RandomNumberGenerator />
          </TabsContent>

          <TabsContent value="dice" className="focus:outline-none">
            <DiceRoller />
          </TabsContent>

          <TabsContent value="unit" className="focus:outline-none">
            <UnitConverter />
          </TabsContent>

          <TabsContent value="date" className="focus:outline-none">
            <DateCalculator />
          </TabsContent>

          <TabsContent value="qrcode" className="focus:outline-none">
            <QRCodeGenerator />
          </TabsContent>

          <TabsContent value="wheel" className="focus:outline-none">
            <DecisionWheel />
          </TabsContent>

          <TabsContent value="number" className="focus:outline-none">
            <NumberConverter />
          </TabsContent>

          <TabsContent value="calculator" className="focus:outline-none">
            <Calculator />
          </TabsContent>

          <TabsContent value="color" className="focus:outline-none">
            <ColorConverter />
          </TabsContent>

          <TabsContent value="markdown" className="focus:outline-none">
            <MarkdownEditor />
          </TabsContent>

          <TabsContent value="gradient" className="focus:outline-none">
            <CSSGradientGenerator />
          </TabsContent>
        </Tabs>

        {/* 页脚 */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* 水印 */}
            <p className="text-xs sm:text-sm text-muted-foreground">
              @阿瓜
            </p>

            {/* 社交链接按钮 */}
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://github.com/Xiaohua-Zhou/GUA-TOOL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white no-underline rounded-lg sm:rounded-xl hover:from-gray-600 hover:to-gray-800 dark:hover:from-gray-500 dark:hover:to-gray-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base font-medium text-white">GitHub</span>
              </a>

              <a
                href="https://space.bilibili.com/3060829"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white no-underline rounded-lg sm:rounded-xl hover:from-pink-400 hover:to-rose-400 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                </svg>
                <span className="text-sm sm:text-base font-medium text-white">Bilibili</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
