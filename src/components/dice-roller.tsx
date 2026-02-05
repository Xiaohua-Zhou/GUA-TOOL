'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dice3, RotateCw, Plus, Minus } from 'lucide-react';

// 骰子类型定义
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

interface DiceConfig {
  type: DiceType;
  sides: number;
  name: string;
  color: string;
  bgColor: string;
}

// 骰子配置
const DICE_CONFIGS: DiceConfig[] = [
  { type: 'd4', sides: 4, name: 'D4', color: '#ef4444', bgColor: 'bg-red-500' },
  { type: 'd6', sides: 6, name: 'D6', color: '#3b82f6', bgColor: 'bg-blue-500' },
  { type: 'd8', sides: 8, name: 'D8', color: '#22c55e', bgColor: 'bg-green-500' },
  { type: 'd10', sides: 10, name: 'D10', color: '#eab308', bgColor: 'bg-yellow-500' },
  { type: 'd12', sides: 12, name: 'D12', color: '#a855f7', bgColor: 'bg-purple-500' },
  { type: 'd20', sides: 20, name: 'D20', color: '#ec4899', bgColor: 'bg-pink-500' },
  { type: 'd100', sides: 100, name: 'D100', color: '#f97316', bgColor: 'bg-orange-500' },
];

interface DiceState {
  [key: string]: {
    count: number;
  };
}

interface RollResult {
  type: DiceType;
  name: string;
  count: number;
  rolls: number[];
  total: number;
}

export default function DiceRoller() {
  const [diceStates, setDiceStates] = useState<DiceState>({
    d4: { count: 0 },
    d6: { count: 0 },
    d8: { count: 0 },
    d10: { count: 0 },
    d12: { count: 0 },
    d20: { count: 0 },
    d100: { count: 0 },
  });

  const [globalModifier, setGlobalModifier] = useState(0);
  const [results, setResults] = useState<RollResult[]>([]);
  const [totalSum, setTotalSum] = useState(0);

  const handleDiceChange = (type: DiceType, delta: number) => {
    setDiceStates((prev) => ({
      ...prev,
      [type]: {
        count: Math.max(0, Math.min(20, prev[type].count + delta)),
      },
    }));
  };

  const handleRoll = () => {
    const rollResults: RollResult[] = [];
    let sum = 0;

    DICE_CONFIGS.forEach((config) => {
      const state = diceStates[config.type];
      if (state.count > 0) {
        const rolls: number[] = [];
        for (let i = 0; i < state.count; i++) {
          rolls.push(Math.floor(Math.random() * config.sides) + 1);
        }
        const total = rolls.reduce((a, b) => a + b, 0);

        rollResults.push({
          type: config.type,
          name: config.name,
          count: state.count,
          rolls,
          total,
        });

        sum += total;
      }
    });

    // 最后加上全局加值
    const finalSum = sum + globalModifier;
    setResults(rollResults);
    setTotalSum(finalSum);
  };

  const handleClear = () => {
    setResults([]);
    setTotalSum(0);
  };

  const handleReset = () => {
    setDiceStates({
      d4: { count: 0 },
      d6: { count: 0 },
      d8: { count: 0 },
      d10: { count: 0 },
      d12: { count: 0 },
      d20: { count: 0 },
      d100: { count: 0 },
    });
    setGlobalModifier(0);
    setResults([]);
    setTotalSum(0);
  };

  const totalCount = Object.values(diceStates).reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Dice3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            骰子投掷器
          </h1>
        </div>
      </div>

      {/* 骰子选择区域 - 紧凑表格布局 */}
      <div className="bg-background rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">选择骰子</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {DICE_CONFIGS.map((config) => (
            <div
              key={config.type}
              className={`relative rounded-lg border-2 transition-all ${
                diceStates[config.type].count > 0
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* 顶部颜色条 */}
              <div
                className={`h-1 rounded-t-lg ${config.bgColor}`}
                style={{ backgroundColor: config.color }}
              />
              
              <div className="p-3 sm:p-4 md:p-5">
                {/* 骰子名称 */}
                <div className="text-center mb-3 sm:mb-4">
                  <div
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ color: config.color }}
                  >
                    {config.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{config.sides}面</div>
                </div>

                {/* 数量控制 */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 p-0"
                    onClick={() => handleDiceChange(config.type, -1)}
                    disabled={diceStates[config.type].count === 0}
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>

                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={diceStates[config.type].count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setDiceStates((prev) => ({
                        ...prev,
                        [config.type]: { count: Math.max(0, Math.min(20, val)) },
                      }));
                    }}
                    className="w-16 sm:w-18 md:w-20 h-8 sm:h-9 md:h-10 text-center text-sm sm:text-base md:text-lg flex-1"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 p-0"
                    onClick={() => handleDiceChange(config.type, 1)}
                    disabled={diceStates[config.type].count >= 20}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 全局加值 */}
      <div className="bg-background rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Label htmlFor="global-modifier" className="text-sm sm:text-base font-medium whitespace-nowrap">
              全局加值：
            </Label>
            <Input
              id="global-modifier"
              type="number"
              value={globalModifier || ''}
              onChange={(e) => setGlobalModifier(Number(e.target.value))}
              className="w-24 sm:w-28 md:w-32 h-10 sm:h-11 text-center text-sm sm:text-base md:text-lg"
              placeholder="+0"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
            <span>已选择：</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{totalCount}</span>
            <span>个骰子</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
        <Button
          onClick={handleRoll}
          size="lg"
          className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-11 sm:h-12 md:h-13 text-sm sm:text-base md:text-lg font-semibold"
          disabled={totalCount === 0}
        >
          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          投掷骰子
        </Button>

        <Button
          onClick={handleClear}
          size="lg"
          variant="outline"
          className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-11 sm:h-12 md:h-13 text-sm sm:text-base md:text-lg font-semibold"
          disabled={results.length === 0}
        >
          清空结果
        </Button>

        <Button
          onClick={handleReset}
          size="lg"
          variant="secondary"
          className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] h-11 sm:h-12 md:h-13 text-sm sm:text-base md:text-lg font-semibold"
        >
          重置设置
        </Button>
      </div>

      {/* 结果显示 */}
      {results.length > 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              投掷结果
            </h2>
            <div className="text-right sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">总合计</p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{totalSum}</p>
                {globalModifier !== 0 && (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    ({totalSum - globalModifier} {globalModifier > 0 ? '+' : ''}{globalModifier})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-background rounded-lg p-3 sm:p-4 border border-border"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                      style={{ backgroundColor: DICE_CONFIGS.find(c => c.type === result.type)?.color }}
                    />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {result.count}{result.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-muted-foreground">小计</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{result.total}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {result.rolls.map((roll, rollIndex) => (
                    <span
                      key={rollIndex}
                      className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border text-sm sm:text-base font-mono font-semibold ${
                        result.type === 'd20' && roll === 20
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-muted/30 border-border text-foreground'
                      }`}
                    >
                      {roll}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 加值说明 */}
          {globalModifier !== 0 && (
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg">
                <span className="text-muted-foreground">骰子总和：</span>
                <span className="font-bold text-foreground">{totalSum - globalModifier}</span>
                <span className="text-muted-foreground">加值：</span>
                <span className={`font-bold ${globalModifier > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {globalModifier > 0 ? '+' : ''}{globalModifier}
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="font-bold text-2xl sm:text-3xl text-primary">{totalSum}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
