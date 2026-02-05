'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator as CalculatorIcon, RotateCcw, History, TrendingUp, Type } from 'lucide-react';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [scientificMode, setScientificMode] = useState(false);

  // 基础按钮
  const basicButtons = [
    { value: 'C', type: 'function', variant: 'destructive' as const, wide: false, primary: false },
    { value: '(', type: 'function', variant: 'secondary' as const, wide: false, primary: false },
    { value: ')', type: 'function', variant: 'secondary' as const, wide: false, primary: false },
    { value: '÷', type: 'operator', variant: 'default' as const, wide: false, primary: false },
    
    { value: '7', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '8', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '9', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '×', type: 'operator', variant: 'default' as const, wide: false, primary: false },
    
    { value: '4', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '5', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '6', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '-', type: 'operator', variant: 'default' as const, wide: false, primary: false },
    
    { value: '1', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '2', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '3', type: 'number', variant: 'outline' as const, wide: false, primary: false },
    { value: '+', type: 'operator', variant: 'default' as const, wide: false, primary: false },
    
    { value: '0', type: 'number', variant: 'outline' as const, wide: true, primary: false },
    { value: '.', type: 'function', variant: 'secondary' as const, wide: false, primary: false },
    { value: '%', type: 'function', variant: 'secondary' as const, wide: false, primary: false },
    { value: '=', type: 'function', variant: 'default' as const, wide: false, primary: true },
    
    { value: 'DEL', type: 'function', variant: 'outline' as const, wide: true, primary: false },
  ];

  // 科学计算按钮
  const scientificButtons = [
    // 第一行：三角函数
    { value: 'sin', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'cos', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'tan', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'π', type: 'constant', variant: 'secondary' as const, wide: false, primary: false },
    
    // 第二行：平方和平方根
    { value: 'x²', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: '√', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: '^', type: 'operator', variant: 'default' as const, wide: false, primary: false },
    { value: 'e', type: 'constant', variant: 'secondary' as const, wide: false, primary: false },
    
    // 第三行：对数
    { value: 'log', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'ln', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: '!', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'ABS', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    
    // 第四行：常数和函数
    { value: 'EXP', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'asin', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'acos', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
    { value: 'atan', type: 'scientific', variant: 'secondary' as const, wide: false, primary: false },
  ];

  const buttons = scientificMode ? [...basicButtons, ...scientificButtons] : basicButtons;

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }

    if (value === '=') {
      calculateResult();
      return;
    }

    // 处理常数
    if (value === 'π') {
      setExpression(prev => prev + Math.PI.toFixed(8));
      return;
    }

    if (value === 'e') {
      setExpression(prev => prev + Math.E.toFixed(8));
      return;
    }

    // 处理科学函数（添加括号）
    if (['sin', 'cos', 'tan', 'log', 'ln', 'asin', 'acos', 'atan', '√', 'ABS'].includes(value)) {
      const funcName = value === '√' ? 'sqrt' : value === 'ln' ? 'log' : value;
      setExpression(prev => prev + funcName + '(');
      return;
    }

    // 处理平方
    if (value === 'x²') {
      setExpression(prev => prev + '^2');
      return;
    }

    // 处理阶乘
    if (value === '!') {
      setExpression(prev => prev + '!');
      return;
    }

    // 处理指数
    if (value === 'EXP') {
      setExpression(prev => prev + 'e');
      return;
    }

    // 检查是否可以添加
    const lastChar = expression.slice(-1);
    const operators = ['+', '-', '×', '÷', '^'];
    
    // 防止连续运算符
    if (operators.includes(value) && operators.includes(lastChar)) {
      setExpression(prev => prev.slice(0, -1) + value);
      return;
    }

    // 防止小数点连续
    if (value === '.') {
      const parts = expression.split(/[\+\-\×\÷\(\)\^]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) {
        return;
      }
    }

    setExpression(prev => prev + value);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculateResult = () => {
    try {
      if (!expression.trim()) return;

      // 替换运算符和函数为 JavaScript 可以识别的符号
      let evalExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/(\d+)%/g, '($1/100)')
        .replace(/\^/g, '**');

      // 处理阶乘
      evalExpression = evalExpression.replace(/(\d+)!/g, 'factorial($1)');

      // 创建安全的计算环境
      const result = new Function('Math', 'factorial', `
        "use strict";
        const { sin, cos, tan, asin, acos, atan, sqrt, log, abs, exp, pow, PI, E } = Math;
        const ln = Math.log;
        const e = Math.E;
        return (${evalExpression});
      `)(Math, factorial);
      
      if (isNaN(result) || !isFinite(result)) {
        setResult('Error');
        return;
      }

      // 格式化结果
      const formattedResult = formatNumber(result);
      
      // 添加到历史记录
      setHistory(prev => [`${expression} = ${formattedResult}`, ...prev].slice(0, 10));
      
      setResult(formattedResult);
      setExpression('');
    } catch (error) {
      setResult('Error');
    }
  };

  const formatNumber = (num: number): string => {
    // 处理非常小或非常大的数，使用科学计数法
    if (Math.abs(num) < 0.000001 && num !== 0) {
      return num.toExponential(6);
    }
    if (Math.abs(num) > 999999999) {
      return num.toExponential(6);
    }
    
    // 处理小数位数
    if (!Number.isInteger(num)) {
      // 最多保留 10 位小数，去掉末尾的 0
      return parseFloat(num.toFixed(10)).toString();
    }
    return num.toString();
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // 键盘支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;

      if (/[0-9]/.test(key)) {
        handleButtonClick(key);
      } else if (['+', '-', '*', '/', '%', '(', ')', '.', '^'].includes(key)) {
        const mappedKey = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleButtonClick(mappedKey);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleButtonClick('=');
      } else if (key === 'Escape') {
        handleButtonClick('C');
      } else if (key === 'Backspace') {
        handleButtonClick('DEL');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expression]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题和模式切换 */}
      <div className="text-center p-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CalculatorIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              计算器
            </h1>
          </div>
          <Button
            variant={scientificMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScientificMode(!scientificMode)}
            className="gap-2"
          >
            {scientificMode ? (
              <>
                <Type className="w-4 h-4" />
                基础模式
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                科学模式
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 显示区域 */}
      <div className="px-6 pb-4">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-inner">
          {/* 表达式显示 */}
          <div className="h-16 flex items-end justify-end mb-2 overflow-x-auto">
            <span className="text-2xl text-muted-foreground font-mono">
              {expression || '\u00A0'}
            </span>
          </div>
          
          {/* 结果显示 */}
          <div className="h-20 flex items-end justify-end">
            <span className="text-5xl font-bold text-foreground font-mono">
              {result}
            </span>
          </div>
        </div>
      </div>

      {/* 键盘区域 */}
      <div className="px-6 pb-6">
        <div className={`grid gap-3 ${scientificMode ? 'grid-cols-4' : 'grid-cols-4'}`}>
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              onClick={() => handleButtonClick(btn.value)}
              className={`
                h-16 ${btn.type === 'scientific' || btn.type === 'constant' ? 'text-base' : 'text-xl'} font-semibold
                ${btn.type === 'operator' ? 'bg-primary/10 hover:bg-primary/20 text-primary' : ''}
                ${btn.type === 'scientific' ? 'bg-gradient-to-br from-primary/5 to-primary/10 text-primary' : ''}
                ${btn.type === 'constant' ? 'bg-gradient-to-br from-primary/10 to-primary/15 text-primary font-mono' : ''}
                ${btn.primary ? 'bg-primary hover:bg-primary/90 text-white h-16' : ''}
                ${btn.wide ? 'col-span-2' : ''}
                transition-all duration-200
                ${btn.type === 'number' ? 'hover:scale-105 active:scale-95' : ''}
              `}
            >
              {btn.value}
            </Button>
          ))}
        </div>
      </div>

      {/* 历史记录 */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">计算历史</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            disabled={history.length === 0}
            className="h-8 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            清空
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            暂无计算历史
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50 font-mono text-sm hover:bg-muted/70 transition-colors cursor-pointer"
                onClick={() => {
                  const parts = item.split(' = ');
                  if (parts[1] && !isNaN(parseFloat(parts[1]))) {
                    setExpression(parts[1]);
                    setResult(parts[1]);
                  }
                }}
              >
                <div className="text-muted-foreground">{item.split(' = ')[0]}</div>
                <div className="text-lg font-semibold text-foreground">{item.split(' = ')[1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="text-sm font-semibold mb-3 text-foreground">
            键盘快捷键{scientificMode ? ' & 科学功能' : ''}
          </h3>
          <div className={`grid gap-2 text-xs text-muted-foreground ${scientificMode ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div>数字键 0-9：输入数字</div>
            <div>+ - * / ^：运算符</div>
            <div>Enter 或 =：计算结果</div>
            <div>Esc：清空 (C)</div>
            <div>Backspace：删除 (DEL)</div>
            <div>( )：括号</div>
            {scientificMode && (
              <>
                <div>sin/cos/tan：三角函数</div>
                <div>log/ln：对数函数</div>
                <div>√：平方根</div>
                <div>^：幂运算</div>
                <div>!：阶乘</div>
                <div>π/e：常数</div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
