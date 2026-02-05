'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Copy,
  RefreshCw,
  Sparkles,
  Palette,
  Layers
} from 'lucide-react';

type GradientType = 'linear' | 'radial';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [linearAngle, setLinearAngle] = useState(90);
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 });
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 }
  ]);
  const [copied, setCopied] = useState(false);

  // 添加颜色节点
  const addColorStop = () => {
    const newPosition = Math.floor(Math.random() * 100);
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    setColorStops([
      ...colorStops,
      { id: Date.now().toString(), color: newColor, position: newPosition }
    ]);
  };

  // 删除颜色节点
  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) {
      alert('至少需要保留两个颜色节点');
      return;
    }
    setColorStops(colorStops.filter(stop => stop.id !== id));
  };

  // 更新颜色节点
  const updateColorStop = (id: string, field: keyof ColorStop, value: string | number) => {
    setColorStops(colorStops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  // 生成 CSS 渐变代码
  const generateCSS = (): string => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${linearAngle}deg, ${colorString})`;
    } else {
      return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${colorString})`;
    }
  };

  const cssCode = `background: ${generateCSS()};`;

  // 复制 CSS 代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 随机生成渐变
  const generateRandomGradient = () => {
    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    const randomAngle = Math.floor(Math.random() * 360);
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 个颜色
    
    setColorStops(
      Array.from({ length: count }, (_, i) => ({
        id: Date.now().toString() + i,
        color: randomColor(),
        position: Math.floor((i / (count - 1)) * 100)
      }))
    );
    setLinearAngle(randomAngle);
    setRadialPosition({ x: 50, y: 50 });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">CSS 渐变生成器</h2>
            <p className="text-sm text-muted-foreground">创建漂亮的渐变背景</p>
          </div>
        </div>
        <Button
          onClick={generateRandomGradient}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          随机生成
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 渐变类型选择 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">渐变类型</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={gradientType === 'linear' ? 'default' : 'outline'}
                onClick={() => setGradientType('linear')}
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                线性渐变
              </Button>
              <Button
                variant={gradientType === 'radial' ? 'default' : 'outline'}
                onClick={() => setGradientType('radial')}
                className="gap-2"
              >
                <Palette className="w-4 h-4" />
                径向渐变
              </Button>
            </div>
          </div>

          {/* 线性渐变 - 角度控制 */}
          {gradientType === 'linear' && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                角度: {linearAngle}°
              </Label>
              <Input
                type="range"
                min="0"
                max="360"
                value={linearAngle}
                onChange={(e) => setLinearAngle(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>
          )}

          {/* 径向渐变 - 中心位置控制 */}
          {gradientType === 'radial' && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                中心位置: X {radialPosition.x}%, Y {radialPosition.y}%
              </Label>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">X 轴</div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={radialPosition.x}
                    onChange={(e) => setRadialPosition({ ...radialPosition, x: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Y 轴</div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={radialPosition.y}
                    onChange={(e) => setRadialPosition({ ...radialPosition, y: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 颜色节点 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">颜色节点</Label>
              <Button
                onClick={addColorStop}
                variant="outline"
                size="sm"
                className="gap-1 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                添加颜色
              </Button>
            </div>
            <div className="space-y-3">
              {colorStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                      className="flex-1 h-10 font-mono text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-muted-foreground">位置:</span>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => updateColorStop(stop.id, 'position', Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12 text-right">{stop.position}%</span>
                  </div>
                  <Button
                    onClick={() => removeColorStop(stop.id)}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* CSS 代码输出 */}
          <div>
            <Label className="text-sm font-medium mb-2 block">CSS 代码</Label>
            <div className="relative">
              <pre className="bg-muted/50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                {cssCode}
              </pre>
              <Button
                onClick={handleCopy}
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="space-y-4">
          <Label className="text-sm font-medium block">实时预览</Label>
          <div
            className="w-full aspect-square rounded-2xl shadow-xl border-4 border-border transition-all duration-300"
            style={{
              background: generateCSS()
            }}
          />
          
          {/* 渐变信息 */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">渐变类型:</span>
              <span className="font-medium">
                {gradientType === 'linear' ? `线性 (${linearAngle}°)` : '径向'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">颜色数量:</span>
              <span className="font-medium">{colorStops.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">位置范围:</span>
              <span className="font-medium">
                {Math.min(...colorStops.map(s => s.position))}% - {Math.max(...colorStops.map(s => s.position))}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
