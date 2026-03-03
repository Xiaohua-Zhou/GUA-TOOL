'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileImage, FileCode, RotateCcw } from 'lucide-react';

export default function PixelCircleGenerator() {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [drawMode, setDrawMode] = useState<'outline' | 'filled'>('outline');
  const [pixelCount, setPixelCount] = useState(0);
  const [displayScale, setDisplayScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showDiameter, setShowDiameter] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 重新计算并绘制
  const drawCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 画布固定为 65x65
    const canvasSize = 65;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // 清空画布
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // 计算像素圆在画布上的居中位置
    const offsetX = Math.floor((canvasSize - width) / 2);
    const offsetY = Math.floor((canvasSize - height) / 2);

    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radiusX = Math.floor(width / 2);
    const radiusY = Math.floor(height / 2);

    // 固定放大倍数为 10 倍
    const scale = 10;
    setDisplayScale(scale);

    // 更新 Canvas 显示尺寸
    const displaySize = canvasSize * scale;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    let count = 0;
    if (drawMode === 'outline') {
      // 绘制边线（使用中点画椭圆算法）
      count = drawEllipseOutline(ctx, offsetX + centerX, offsetY + centerY, radiusX, radiusY, canvasSize, canvasSize);
    } else {
      // 完全填充
      count = drawEllipseFilled(ctx, offsetX + centerX, offsetY + centerY, radiusX, radiusY, canvasSize, canvasSize);
    }

    // 绘制直径标记（灰色，可选）
    if (showDiameter) {
      drawDiameterMarkers(ctx, offsetX + centerX, offsetY + centerY, radiusX, radiusY, canvasSize, canvasSize);
    }

    // 绘制圆心（黑色）
    drawPixel(ctx, offsetX + centerX, offsetY + centerY, canvasSize, canvasSize, '#000000');

    setPixelCount(count);
  };

  // 绘制直径标记（灰色）
  const drawDiameterMarkers = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    w: number,
    h: number
  ) => {
    const color = '#6b7280'; // 灰色

    // 水平直径
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = 0;
      if ((dx * dx) / (rx * rx) <= 1) {
        drawPixel(ctx, x, cy, w, h, color);
      }
    }

    // 竖直直径
    for (let y = 0; y < h; y++) {
      const dx = 0;
      const dy = y - cy;
      if ((dy * dy) / (ry * ry) <= 1) {
        drawPixel(ctx, cx, y, w, h, color);
      }
    }
  };

  // 绘制椭圆边线（中点画椭圆算法）
  const drawEllipseOutline = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    w: number,
    h: number
  ): number => {
    let count = 0;
    let x = 0;
    let y = ry;

    // 计算椭圆的两个参数
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    const twoRx2 = 2 * rx2;
    const twoRy2 = 2 * ry2;
    let p = Math.floor(ry2 - rx2 * ry + 0.25 * rx2);
    let px = 0;
    let py = twoRx2 * y;

    // 第一象限
    while (px < py) {
      x++;
      px += twoRy2;
      if (p < 0) {
        p += ry2 + px;
      } else {
        y--;
        py -= twoRx2;
        p += ry2 + px - py;
      }

      // 绘制8个对称点（对于椭圆是4个对称点）
      drawPixel(ctx, cx + x, cy + y, w, h);
      drawPixel(ctx, cx - x, cy + y, w, h);
      drawPixel(ctx, cx + x, cy - y, w, h);
      drawPixel(ctx, cx - x, cy - y, w, h);
      count += 4;
    }

    // 第二象限
    p = Math.floor(
      ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2
    );
    while (y > 0) {
      y--;
      py -= twoRx2;
      if (p > 0) {
        p += rx2 - py;
      } else {
        x++;
        px += twoRy2;
        p += rx2 - py + px;
      }

      drawPixel(ctx, cx + x, cy + y, w, h);
      drawPixel(ctx, cx - x, cy + y, w, h);
      drawPixel(ctx, cx + x, cy - y, w, h);
      drawPixel(ctx, cx - x, cy - y, w, h);
      count += 4;
    }

    return count;
  };

  // 绘制填充椭圆
  const drawEllipseFilled = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    w: number,
    h: number
  ): number => {
    let count = 0;
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // 检查点是否在椭圆内
        const dx = x - cx;
        const dy = y - cy;
        if ((dx * dx) / rx2 + (dy * dy) / ry2 <= 1) {
          drawPixel(ctx, x, y, w, h);
          count++;
        }
      }
    }

    return count;
  };

  // 绘制单个像素
  const drawPixel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string = '#ef4444' // 默认红色
  ) => {
    if (x >= 0 && x < w && y >= 0 && y < h) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  // 下载为 PNG
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 创建临时 canvas 用于放大导出
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // 放大 10 倍
    const scale = 10;
    const originalSize = 65;
    const scaledSize = originalSize * scale;
    
    tempCanvas.width = scaledSize;
    tempCanvas.height = scaledSize;

    // 启用像素化缩放
    tempCtx.imageSmoothingEnabled = false;
    
    // 将原始 canvas 绘制到放大的 canvas 上
    tempCtx.drawImage(canvas, 0, 0, scaledSize, scaledSize);

    const link = document.createElement('a');
    link.download = `pixel-circle-${width}x${height}-${drawMode}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  // 下载为 SVG
  const downloadSVG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 画布固定为 65x65
    const canvasSize = 65;
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
    const pixels = imageData.data;

    // 放大 10 倍
    const scale = 10;
    const scaledSize = canvasSize * scale;

    // 构建 SVG 内容（使用放大后的尺寸）
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${scaledSize}" height="${scaledSize}" viewBox="0 0 ${scaledSize} ${scaledSize}">`;
    svgContent += `<rect width="100%" height="100%" fill="white"/>`;

    for (let y = 0; y < canvasSize; y++) {
      for (let x = 0; x < canvasSize; x++) {
        const index = (y * canvasSize + x) * 4;
        if (pixels[index] === 0) {
          // 黑色像素（放大为 10x10 的矩形）
          svgContent += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="black"/>`;
        }
      }
    }

    svgContent += '</svg>';

    // 创建 Blob 并下载
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `pixel-circle-${width}x${height}-${drawMode}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 重置为默认值
  const handleReset = () => {
    setWidth(16);
    setHeight(16);
    setDrawMode('outline');
  };

  // 当参数变化时重新绘制
  useEffect(() => {
    drawCircle();
  }, [width, height, drawMode, showDiameter]);

  return (
    <Card className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <FileImage className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            像素圆生成器
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-4 sm:gap-6 lg:gap-8">
        {/* 左侧：参数设置 */}
        <div className="space-y-4 sm:space-y-6 xl:space-y-5">
          {/* 尺寸设置 */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              圆的尺寸
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width" className="text-sm text-muted-foreground mb-1.5 block">
                  水平宽度（像素）
                </Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="64"
                  value={width}
                  onChange={(e) => setWidth(Math.max(1, Math.min(64, parseInt(e.target.value) || 1)))}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-sm text-muted-foreground mb-1.5 block">
                  竖直高度（像素）
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="64"
                  value={height}
                  onChange={(e) => setHeight(Math.max(1, Math.min(64, parseInt(e.target.value) || 1)))}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              建议范围：1-64 像素
            </p>
          </div>

          {/* 绘画方式 */}
          <div>
            <Label htmlFor="drawMode" className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              绘画方式
            </Label>
            <Select value={drawMode} onValueChange={(value: 'outline' | 'filled') => setDrawMode(value)}>
              <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                <SelectValue placeholder="选择绘画方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">绘制边线</SelectItem>
                <SelectItem value="filled">完全填充</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 显示选项 */}
          <div className="space-y-3">
            <Label className="text-sm sm:text-base font-semibold block text-foreground">
              显示选项
            </Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">显示网格</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDiameter}
                  onChange={(e) => setShowDiameter(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">显示直径标记</span>
              </label>
            </div>
          </div>

          {/* 像素统计 */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">使用像素数</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">{pixelCount}</p>
              </div>
              <div className="text-3xl">🎨</div>
            </div>
          </div>

          {/* 重置按钮 */}
          <Button onClick={handleReset} variant="outline" className="w-full h-10 sm:h-12">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            重置为默认
          </Button>
        </div>

        {/* 右侧：预览和下载 */}
        <div className="space-y-4 sm:space-y-6 flex flex-col">
          {/* 预览区域 */}
          <div className="flex-1 flex flex-col min-h-[400px]">
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              预览图
            </Label>
            <div className="flex-1 bg-background rounded-lg border border-border p-6 overflow-auto flex items-center justify-center relative">
              {/* 独立的背景网格 */}
              {showGrid && (
                <div 
                  className="absolute border border-border"
                  style={{
                    width: `${65 * displayScale}px`,
                    height: `${65 * displayScale}px`,
                    backgroundImage: `
                      linear-gradient(to right, rgba(229, 231, 235, 0.5) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: `${displayScale}px ${displayScale}px`
                  }}
                />
              )}
              {/* 像素圆 Canvas */}
              <canvas
                ref={canvasRef}
                className="border border-border shadow-lg relative"
                style={{
                  imageRendering: 'pixelated'
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              网格尺寸：65 × 65 像素 | 像素圆尺寸：{width} × {height} 像素 | 放大倍数：{displayScale}x
            </p>
          </div>

          {/* 下载按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadPNG} className="flex-1 h-10 sm:h-12">
              <FileImage className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              下载 PNG
            </Button>
            <Button onClick={downloadSVG} variant="outline" className="flex-1 h-10 sm:h-12">
              <FileCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              下载 SVG
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
