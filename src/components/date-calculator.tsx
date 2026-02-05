'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, CalendarDays, Clock, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

// 工作日计算
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0=周日, 6=周六
};

const isHoliday = (date: Date): boolean => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const holidays = [
    '1-1',   // 元旦
    '5-1',   // 劳动节
    '10-1',  // 国庆节
  ];
  return holidays.includes(`${month}-${day}`);
};

const countWorkDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    if (!isWeekend(current) && !isHoliday(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

// 计算两个日期之间的差异
const calculateDateDiff = (date1: Date, date2: Date) => {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // 包含首尾两天
  const diffWeeks = Math.floor((diffDays + 6) / 7);
  const diffMonths = Math.abs((date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth()));
  const diffYears = Math.abs(date2.getFullYear() - date1.getFullYear());
  
  // 计算工作日（包含首尾两天）
  const workDays = countWorkDays(
    date1 < date2 ? date1 : date2,
    date1 < date2 ? date2 : date1
  );
  
  return {
    days: diffDays,
    weeks: diffWeeks,
    months: diffMonths,
    years: diffYears,
    workDays,
    totalHours: diffDays * 24,
    totalMinutes: diffDays * 24 * 60,
  };
};

// 日期推算
const calculateTargetDate = (startDate: Date, amount: number, unit: string): Date => {
  const result = new Date(startDate);
  
  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }
  
  return result;
};

export default function DateCalculator() {
  const [tab, setTab] = useState<'diff' | 'add'>('diff');

  // 日期差值计算
  const [diffDate1, setDiffDate1] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [diffDate2, setDiffDate2] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });

  const diffResult = useMemo(() => {
    return calculateDateDiff(new Date(diffDate1), new Date(diffDate2));
  }, [diffDate1, diffDate2]);

  // 日期推算
  const [calcStartDate, setCalcStartDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [calcAmount, setCalcAmount] = useState(30);
  const [calcUnit, setCalcUnit] = useState('days');

  const calcResult = useMemo(() => {
    return calculateTargetDate(new Date(calcStartDate), calcAmount, calcUnit);
  }, [calcStartDate, calcAmount, calcUnit]);

  // 格式化日期显示
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  // 快速设置日期
  const setQuickDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            日期计算器
          </h1>
        </div>
      </div>

      {/* 功能切换 */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'diff' | 'add')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 sm:mb-8 p-1.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl sm:rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm h-auto min-h-[64px] sm:min-h-[72px] items-stretch">
          <TabsTrigger
            value="diff"
            className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-xl text-sm sm:text-base py-3 sm:py-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center"
          >
            日期差值
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-xl text-sm sm:text-base py-3 sm:py-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center"
          >
            日期推算
          </TabsTrigger>
        </TabsList>

        {/* 日期差值计算 */}
        <TabsContent value="diff" className="focus:outline-none">
          <div className="space-y-4 sm:space-y-6">
            {/* 日期输入和快速设置 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* 开始日期 */}
              <div className="space-y-2 sm:space-y-3">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                  <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
                    开始日期
                  </Label>
                  <Input
                    type="date"
                    value={diffDate1}
                    onChange={(e) => setDiffDate1(e.target.value)}
                    className="h-10 sm:h-12 text-base sm:text-lg"
                  />
                  <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    {formatDate(new Date(diffDate1))}
                  </div>
                </div>

                {/* 开始日期快速设置 */}
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    快速设置
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate1(setQuickDate(0))}
                      className="h-9 sm:h-10 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-xs sm:text-sm"
                    >
                      今天
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate1(setQuickDate(-1))}
                      className="h-10 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    >
                      昨天
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate1(setQuickDate(-7))}
                      className="h-10 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    >
                      上周
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate1(setQuickDate(-30))}
                      className="h-10 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    >
                      上月
                    </Button>
                  </div>
                </div>
              </div>

              {/* 结束日期 */}
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                  <Label className="text-base font-semibold mb-3 block text-foreground">
                    结束日期
                  </Label>
                  <Input
                    type="date"
                    value={diffDate2}
                    onChange={(e) => setDiffDate2(e.target.value)}
                    className="h-12 text-lg"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    {formatDate(new Date(diffDate2))}
                  </div>
                </div>
                
                {/* 结束日期快速设置 */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    快速设置
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate2(setQuickDate(0))}
                      className="h-10 border-green-200 hover:border-green-400 hover:bg-green-50"
                    >
                      今天
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate2(setQuickDate(1))}
                      className="h-10 border-green-200 hover:border-green-400 hover:bg-green-50"
                    >
                      明天
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate2(setQuickDate(7))}
                      className="h-10 border-green-200 hover:border-green-400 hover:bg-green-50"
                    >
                      下周
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDiffDate2(setQuickDate(30))}
                      className="h-10 border-green-200 hover:border-green-400 hover:bg-green-50"
                    >
                      下月
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 计算结果 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 border border-primary/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                计算结果
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.days}</p>
                  <p className="text-sm text-muted-foreground mt-1">天数</p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.weeks}</p>
                  <p className="text-sm text-muted-foreground mt-1">周数</p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.months}</p>
                  <p className="text-sm text-muted-foreground mt-1">月数</p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.years}</p>
                  <p className="text-sm text-muted-foreground mt-1">年数</p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.workDays}</p>
                  <p className="text-sm text-muted-foreground mt-1">工作日</p>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{diffResult.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">小时</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 日期推算 */}
        <TabsContent value="add" className="focus:outline-none">
          <div className="space-y-6">
            {/* 日期输入 */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <Label className="text-base font-semibold mb-3 block text-foreground">
                起始日期
              </Label>
              <div className="flex gap-4">
                <Input
                  type="date"
                  value={calcStartDate}
                  onChange={(e) => setCalcStartDate(e.target.value)}
                  className="h-12 text-lg flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCalcStartDate(setQuickDate(0))}
                    className="h-12 w-12"
                  >
                    <Calendar className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {formatDate(new Date(calcStartDate))}
              </div>
            </div>

            {/* 数量和单位 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <Label className="text-base font-semibold mb-3 block text-foreground">
                  数量
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCalcAmount(Math.max(-9999, calcAmount - 1))}
                    className="h-12 w-12"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <Input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(-9999, Math.min(9999, parseInt(e.target.value) || 0)))}
                    className="h-12 text-lg text-center font-mono font-semibold"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCalcAmount(Math.min(9999, calcAmount + 1))}
                    className="h-12 w-12"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <Label className="text-base font-semibold mb-3 block text-foreground">
                  单位
                </Label>
                <Select value={calcUnit} onValueChange={setCalcUnit}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days" className="text-base">天</SelectItem>
                    <SelectItem value="weeks" className="text-base">周</SelectItem>
                    <SelectItem value="months" className="text-base">月</SelectItem>
                    <SelectItem value="years" className="text-base">年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 快速选择 */}
            <div>
              <Label className="text-base font-semibold mb-3 block text-foreground">
                快速选择
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(1)}
                  className="h-10"
                >
                  1 天
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(7)}
                  className="h-10"
                >
                  1 周
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(30)}
                  className="h-10"
                >
                  1 月
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(90)}
                  className="h-10"
                >
                  3 月
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(180)}
                  className="h-10"
                >
                  6 月
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCalcAmount(365)}
                  className="h-10"
                >
                  1 年
                </Button>
              </div>
            </div>

            {/* 计算结果 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 border border-primary/30">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                推算结果
              </h2>
              <div className="text-center">
                <div className="mb-4">
                  <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {calcAmount > 0 ? '未来' : calcAmount < 0 ? '过去' : '当天'}
                </p>
                <p className="text-3xl font-bold text-primary mb-2">
                  {Math.abs(calcAmount)} {calcUnit === 'days' ? '天' : calcUnit === 'weeks' ? '周' : calcUnit === 'months' ? '个月' : '年'}
                  {calcAmount > 0 ? '后' : calcAmount < 0 ? '前' : ''}
                </p>
                <div className="mt-4 p-4 bg-background rounded-xl">
                  <p className="text-2xl font-semibold text-foreground">
                    {formatDate(calcResult)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {calcResult.toISOString().split('T')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
