'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

// HEX 转 RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// RGB 转 HEX
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// RGB 转 HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// HSL 转 RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState<string | null>(null);

  // 从 HEX 更新
  const handleHexChange = (value: string) => {
    setHex(value);
    const rgbValue = hexToRgb(value);
    if (rgbValue) {
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    }
  };

  // 从 RGB 更新
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  // 从 HSL 更新
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [channel]: value };
    setHsl(newHsl);
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbValue);
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b));
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newHex = rgbToHex(r, g, b);
    const newHsl = rgbToHsl(r, g, b);
    
    setHex(newHex);
    setRgb({ r, g, b });
    setHsl(newHsl);
  };

  // 判断颜色亮度，决定文字颜色
  const getTextColor = () => {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // 预设颜色
  const presetColors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16',
    '#10B981', '#06B6D4', '#3B82F6', '#6366F1',
    '#8B5CF6', '#EC4899', '#000000', '#FFFFFF',
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center p-6 pb-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            颜色转换器
          </h1>
        </div>
      </div>

      {/* 颜色预览 */}
      <div className="px-6 pb-6">
        <div 
          className="w-full h-32 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center"
          style={{ backgroundColor: hex }}
        >
          <span 
            className="text-2xl font-bold font-mono"
            style={{ color: getTextColor() }}
          >
            {hex.toUpperCase()}
          </span>
        </div>

        {/* 随机颜色按钮 */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={generateRandomColor}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            随机颜色
          </Button>
        </div>

        {/* 预设颜色 */}
        <div className="mt-4">
          <Label className="text-sm font-semibold mb-2 block">预设颜色</Label>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleHexChange(color)}
                className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-all shadow-sm hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 颜色格式输入 */}
      <div className="px-6 pb-6 space-y-4">
        {/* HEX */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">HEX</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(hex, 'HEX')}
              className="h-8"
            >
              {copied === 'HEX' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  复制
                </>
              )}
            </Button>
          </div>
          <Input
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#FFFFFF"
            className="font-mono h-12 text-lg"
            maxLength={7}
          />
        </div>

        {/* RGB */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">RGB</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
              className="h-8"
            >
              {copied === 'RGB' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  复制
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">R (红)</Label>
              <Input
                type="number"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                min={0}
                max={255}
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">G (绿)</Label>
              <Input
                type="number"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                min={0}
                max={255}
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">B (蓝)</Label>
              <Input
                type="number"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                min={0}
                max={255}
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* HSL */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">HSL</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
              className="h-8"
            >
              {copied === 'HSL' ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  复制
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">H (色相)</Label>
              <Input
                type="number"
                value={hsl.h}
                onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                min={0}
                max={360}
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">S (饱和度 %)</Label>
              <Input
                type="number"
                value={hsl.s}
                onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">L (亮度 %)</Label>
              <Input
                type="number"
                value={hsl.l}
                onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="text-sm font-semibold mb-3 text-foreground">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">🎨 自动转换</p>
              <p>在任意格式输入，自动转换到其他格式</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">📋 一键复制</p>
              <p>点击复制按钮获取 CSS 格式的颜色代码</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">🎲 随机颜色</p>
              <p>点击按钮生成随机颜色获取灵感</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">🔘 预设颜色</p>
              <p>点击预设颜色快速选择常用颜色</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
