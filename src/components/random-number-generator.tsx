'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dice6, Copy, RefreshCw } from 'lucide-react';

export default function RandomNumberGenerator() {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [isUnique, setIsUnique] = useState(false);

  const handleGenerate = () => {
    if (minValue > maxValue) {
      alert('最小值不能大于最大值！');
      return;
    }
    
    if (count < 1 || count > 1000) {
      alert('生成数量必须在 1 到 1000 之间！');
      return;
    }

    if (isUnique && (maxValue - minValue + 1) < count) {
      alert('范围内唯一数字不足，无法生成指定数量的不重复随机数！');
      return;
    }

    const generatedNumbers: number[] = [];
    const usedNumbers = new Set<number>();

    while (generatedNumbers.length < count) {
      const randomNum = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

      if (isUnique && usedNumbers.has(randomNum)) {
        continue;
      }

      generatedNumbers.push(randomNum);
      if (isUnique) {
        usedNumbers.add(randomNum);
      }
    }

    setResults(generatedNumbers);
  };

  const handleClear = () => {
    setResults([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(', '));
    alert('已复制到剪贴板！');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Dice6 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            随机数生成器
          </h1>
        </div>
      </div>

      {/* 参数设置 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Label htmlFor="minValue">最小值</Label>
          <Input
            id="minValue"
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
            className="h-10 sm:h-12 text-base sm:text-lg"
            placeholder="输入最小值"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Label htmlFor="maxValue">最大值</Label>
          <Input
            id="maxValue"
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            className="h-10 sm:h-12 text-base sm:text-lg"
            placeholder="输入最大值"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <Label htmlFor="count">生成数量 (1-1000)</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-10 sm:h-12 text-base sm:text-lg"
            placeholder="输入生成数量"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2 justify-end">
          <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isUnique}
              onChange={(e) => setIsUnique(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm sm:text-base text-foreground font-medium">
              生成不重复的数字
            </span>
          </label>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 sm:mb-8">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="min-w-[120px] sm:min-w-[140px] h-10 sm:h-12 text-sm sm:text-base font-semibold"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          生成随机数
        </Button>

        <Button
          onClick={handleClear}
          size="lg"
          variant="outline"
          className="min-w-[120px] sm:min-w-[140px] h-10 sm:h-12 text-sm sm:text-base font-semibold"
          disabled={results.length === 0}
        >
          清空结果
        </Button>
      </div>

      {/* 结果显示 */}
      {results.length > 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              生成结果 ({results.length} 个)
            </h2>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              复制结果
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {results.map((num, index) => (
              <span
                key={index}
                className="inline-flex items-center justify-center min-w-[50px] sm:min-w-[60px] h-8 sm:h-10 px-2 sm:px-3 bg-background rounded-lg border border-border text-sm sm:text-base font-mono font-semibold text-foreground shadow-sm"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 统计信息 */}
      {results.length > 0 && (
        <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-muted/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">最小值</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{Math.min(...results)}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">最大值</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{Math.max(...results)}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">平均值</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">总和</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {results.reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
