'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { HelpCircle, RefreshCw, Plus, Trash2, Sparkles, Gift } from 'lucide-react';

interface WheelOption {
  id: string;
  text: string;
  color: string;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export default function DecisionWheel() {
  const [options, setOptions] = useState<WheelOption[]>([
    { id: '1', text: '是', color: COLORS[0] },
    { id: '2', text: '否', color: COLORS[1] },
  ]);
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制轮盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 - 30; // 向左偏移 30 像素，给右侧指针留空间
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    if (options.length === 0) {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('添加选项开始', centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI) / 180;
      const endAngle = startAngle + sliceAngle;

      // 绘制扇形
      ctx.fillStyle = option.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // 绘制文字
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      
      // 截断过长的文字
      let text = option.text;
      if (text.length > 8) {
        text = text.substring(0, 7) + '...';
      }
      
      ctx.fillText(text, radius - 20, 0);
      ctx.restore();
    });

    // 绘制中心圆
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fill();

    // 绘制指针（三点钟位置，指向左，完全在轮盘外侧）
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // 指针尖端（最靠近圆盘的部分）
    ctx.moveTo(centerX + radius + 10, centerY);
    // 指针尾部（远离轮盘）
    ctx.lineTo(centerX + radius + 60, centerY - 12);
    ctx.lineTo(centerX + radius + 60, centerY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }, [options, rotation]);

  // 开始旋转
  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    // 随机选择结果
    const targetIndex = Math.floor(Math.random() * options.length);
    const sliceAngle = 360 / options.length;
    const targetAngle = targetIndex * sliceAngle;

    // 计算总旋转角度（多圈 + 目标角度）
    const spins = 5; // 旋转圈数
    const extraDegrees = Math.random() * sliceAngle; // 随机偏移
    const totalRotation = spins * 360 + targetAngle + extraDegrees - (rotation % 360);

    let currentRotation = rotation;
    const duration = 3000; // 3秒
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用 ease-out 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      currentRotation = rotation + totalRotation * easeOut;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 计算最终结果
        const finalAngle = currentRotation % 360;
        const normalizedAngle = (360 - finalAngle) % 360;
        const selectedIndex = Math.floor(normalizedAngle / sliceAngle);
        setResult(options[selectedIndex].text);
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // 添加选项
  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const colorIndex = options.length % COLORS.length;
    const newOptionObj: WheelOption = {
      id: Date.now().toString(),
      text: newOption.trim(),
      color: COLORS[colorIndex],
    };

    setOptions([...options, newOptionObj]);
    setNewOption('');
    setResult(null);
  };

  // 删除选项
  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
    setResult(null);
  };

  // 使用预设
  const usePreset = (presetOptions: string[]) => {
    const newOptions = presetOptions.map((text, index) => ({
      id: Date.now().toString() + index,
      text,
      color: COLORS[index % COLORS.length],
    }));
    setOptions(newOptions);
    setResult(null);
    setRotation(0);
  };

  // 快速预设
  const presets = [
    { label: '是/否', options: ['是', '否'] },
    { label: '午餐', options: ['米饭', '面条', '饺子', '汉堡', '沙拉'] },
    { label: '娱乐', options: ['看电影', '玩游戏', '看书', '听音乐', '运动'] },
    { label: '1-6', options: ['1', '2', '3', '4', '5', '6'] },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            决策轮盘
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* 左侧：轮盘 */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="relative w-full max-w-md">
            <canvas
              ref={canvasRef}
              width={440}
              height={400}
              className="max-w-full h-auto"
            />

            {/* 中心按钮 */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || options.length < 2}
              className="absolute top-1/2 left-[43.2%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSpinning ? (
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
              ) : (
                <span className="text-xl sm:text-2xl">GO</span>
              )}
            </button>
          </div>

          {/* 结果展示 */}
          {result && (
            <div className="w-full max-w-md bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">选择结果</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{result}</p>
            </div>
          )}
        </div>

        {/* 右侧：选项管理 */}
        <div className="space-y-4 sm:space-y-6">
          {/* 添加选项 */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              添加选项
            </Label>
            <div className="flex gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                placeholder="输入选项内容..."
                className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                disabled={isSpinning}
              />
              <Button
                onClick={handleAddOption}
                className="h-10 sm:h-12 px-3 sm:px-4"
                disabled={isSpinning || !newOption.trim()}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              当前选项：{options.length} 个
            </p>
          </div>

          {/* 快速预设 */}
          <div>
            <Label className="text-base font-semibold mb-3 block text-foreground">
              快速预设
            </Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  onClick={() => usePreset(preset.options)}
                  className="h-10"
                  disabled={isSpinning}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 选项列表 */}
          <div>
            <Label className="text-base font-semibold mb-3 block text-foreground">
              选项列表
            </Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                >
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="flex-1 text-sm">{option.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={isSpinning}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {options.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无选项，请添加</p>
                </div>
              )}
            </div>
          </div>

          {/* 操作提示 */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">使用提示</p>
                <p>至少添加 2 个选项后，点击中心按钮开始旋转</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-foreground mb-2">🎯 添加选项</p>
            <p className="text-muted-foreground">输入内容后按回车或点击添加按钮</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">🎨 颜色分配</p>
            <p className="text-muted-foreground">选项会自动分配不同的颜色</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">🎲 开始旋转</p>
            <p className="text-muted-foreground">点击轮盘中心的 GO 按钮</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">✨ 查看结果</p>
            <p className="text-muted-foreground">轮盘停止后会显示选择结果</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
