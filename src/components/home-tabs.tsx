'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
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
import PixelCircleGenerator from '@/components/pixel-circle-generator';
import FileTransfer from '@/components/file-transfer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Clock,
  Dice6,
  Dice3,
  ArrowLeftRight,
  CalendarDays,
  QrCode,
  HelpCircle,
  Languages,
  Calculator as CalculatorIcon,
  Palette,
  FileText,
  Sparkles,
  CircleDot,
  Smartphone,
} from 'lucide-react';

const TABS = [
  { value: 'countdown', label: '倒计时', icon: Clock },
  { value: 'random', label: '随机数', icon: Dice6 },
  { value: 'dice', label: '骰子', icon: Dice3 },
  { value: 'unit', label: '单位换算', icon: ArrowLeftRight },
  { value: 'date', label: '日期计算', icon: CalendarDays },
  { value: 'qrcode', label: '二维码', icon: QrCode },
  { value: 'wheel', label: '决策轮盘', icon: HelpCircle },
  { value: 'number', label: '数字转换', icon: Languages },
  { value: 'calculator', label: '计算器', icon: CalculatorIcon },
  { value: 'color', label: '颜色转换', icon: Palette },
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'gradient', label: 'CSS 渐变', icon: Sparkles },
  { value: 'pixel-circle', label: '像素圆', icon: CircleDot },
  { value: 'transfer', label: '文件传输', icon: Smartphone },
];

const TAB_VALUES = TABS.map((t) => t.value);

function HomeTabsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('countdown');

  // 从 URL 读取 tab 参数
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TAB_VALUES.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2 w-full max-w-6xl mx-auto mb-6 sm:mb-8 p-2 sm:p-2.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl sm:rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm h-auto min-h-[60px] sm:min-h-[72px] items-stretch">
        {TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px]"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-1.5 md:mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
            <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-sm">
              {label}
            </span>
          </TabsTrigger>
        ))}
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
      <TabsContent value="pixel-circle" className="focus:outline-none">
        <PixelCircleGenerator />
      </TabsContent>
      <TabsContent value="transfer" className="focus:outline-none">
        <FileTransfer />
      </TabsContent>
    </Tabs>
  );
}

export default function HomeTabs() {
  return (
    <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
      <HomeTabsContent />
    </Suspense>
  );
}
