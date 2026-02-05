'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { Download, Copy, Link, Type, RefreshCw, Upload, CheckCircle, XCircle, Scan } from 'lucide-react';

// 生成器组件
function QRCodeEncoder() {
  const [inputValue, setInputValue] = useState('https://example.com');
  const [qrSize, setQrSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // 二维码最大字符数限制
  const MAX_CHARS = 2000;

  const handleInputChange = (value: string) => {
    // 限制最大字符数
    if (value.length > MAX_CHARS) {
      setError(`内容过长！最大支持 ${MAX_CHARS} 个字符，当前 ${value.length} 个字符`);
      setInputValue(value.slice(0, MAX_CHARS));
    } else {
      setError('');
      setInputValue(value);
    }
  };

  const handleDownload = () => {
    const svg = document.querySelector('#qrcode-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: '示例链接', value: 'https://example.com' },
    { label: 'WiFi', value: 'WIFI:S:MyNetwork;T:WPA;P:MyPassword;;' },
    { label: '邮箱', value: 'mailto:example@email.com' },
    { label: '电话', value: 'tel:+1234567890' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Link className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            二维码生成器
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="qr-input" className="text-base font-semibold text-foreground">
                输入内容
              </Label>
              <span className={`text-sm ${inputValue.length > MAX_CHARS * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {inputValue.length} / {MAX_CHARS}
              </span>
            </div>
            <Textarea
              id="qr-input"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="输入文字、链接或任何文本..."
              className={`h-32 text-base resize-none ${error ? 'border-destructive focus:border-destructive' : ''}`}
              maxLength={MAX_CHARS}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <XCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {!error && (
              <p className="text-sm text-muted-foreground mt-2">
                支持文字、链接、WiFi 信息、联系方式等
              </p>
            )}
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block text-foreground">
              快速预设
            </Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  onClick={() => setInputValue(preset.value)}
                  className="h-10"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="qr-size" className="text-base font-semibold mb-3 block text-foreground">
              二维码大小
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="qr-size"
                type="number"
                min="128"
                max="512"
                step="32"
                value={qrSize}
                onChange={(e) => setQrSize(Math.max(128, Math.min(512, parseInt(e.target.value) || 256)))}
                className="h-12 text-lg w-32"
              />
              <span className="text-muted-foreground">像素</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 h-12 text-base font-semibold"
              disabled={!inputValue.trim()}
            >
              <Download className="w-5 h-5 mr-2" />
              下载二维码
            </Button>
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              disabled={!inputValue.trim()}
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? '已复制' : '复制文本'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            {inputValue.trim() && !error ? (
              <QRCodeSVG
                id="qrcode-svg"
                value={inputValue}
                size={qrSize}
                level="M"
                includeMargin={true}
              />
            ) : error ? (
              <div
                className="flex items-center justify-center bg-destructive/10 rounded-lg"
                style={{ width: qrSize, height: qrSize, maxWidth: '100%' }}
              >
                <div className="text-center p-4">
                  <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                  <p className="text-destructive text-sm font-medium">
                    内容超出限制
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    请减少内容长度
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center bg-muted rounded-lg"
                style={{ width: qrSize, height: qrSize, maxWidth: '100%' }}
              >
                <div className="text-center">
                  <Type className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-sm">
                    输入内容生成二维码
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
              <span>实时生成，无需点击确认</span>
            </div>
            <p className="text-xs text-muted-foreground">
              支持中文、emoji、特殊字符等
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-foreground mb-2">🌐 网页链接</p>
            <p className="text-muted-foreground">输入完整的网址（以 http:// 或 https:// 开头）</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">📱 WiFi 信息</p>
            <p className="text-muted-foreground">格式：WIFI:S:网络名;T:加密方式;P:密码;;</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">📧 联系方式</p>
            <p className="text-muted-foreground">邮箱格式：mailto:example@email.com</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">📞 电话号码</p>
            <p className="text-muted-foreground">格式：tel:+1234567890</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">📝 字符限制</p>
            <p className="text-muted-foreground">最多支持 {MAX_CHARS} 个字符，超过限制将自动截断</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">💡 提示</p>
            <p className="text-muted-foreground">支持中文、emoji、特殊字符等</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 解码器组件
function QRCodeDecoder() {
  const [decodedText, setDecodedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setDecodedText('');
    setImagePreview('');
    setIsDecoding(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setDecodedText(code.data);
          setImagePreview(e.target?.result as string);
        } else {
          setError('未检测到二维码，请上传包含二维码的图片');
        }
        setIsDecoding(false);
      };
      img.onerror = () => {
        setError('图片加载失败，请重试');
        setIsDecoding(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(decodedText);
  };

  const handleClear = () => {
    setDecodedText('');
    setError('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Scan className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            二维码解码器
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="qr-upload" className="text-base font-semibold mb-3 block text-foreground">
              上传二维码图片
            </Label>
            <div className="relative">
              <input
                id="qr-upload"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 text-base font-semibold"
                variant={error ? 'destructive' : 'default'}
              >
                <Upload className="w-5 h-5 mr-2" />
                {isDecoding ? '解码中...' : '选择图片'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              支持 PNG、JPG、SVG 等常见图片格式
            </p>
          </div>

          {imagePreview && (
            <div>
              <Label className="text-base font-semibold mb-3 block text-foreground">
                图片预览
              </Label>
              <div className="bg-background rounded-xl p-4 border border-border">
                <img
                  src={imagePreview}
                  alt="上传的二维码"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              disabled={!decodedText && !error}
            >
              清空
            </Button>
            <Button
              onClick={handleCopyResult}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              disabled={!decodedText}
            >
              <Copy className="w-5 h-5 mr-2" />
              复制结果
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="text-base font-semibold mb-3 block text-foreground">
            解码结果
          </Label>
          <div className="flex-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 min-h-[400px]">
            {isDecoding ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">正在解码...</p>
                </div>
              </div>
            ) : decodedText ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">解码成功</span>
                </div>
                <Textarea
                  value={decodedText}
                  readOnly
                  className="flex-1 text-base font-mono resize-none"
                />
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <XCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                  <p className="text-destructive">{error}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Scan className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-sm">
                    上传图片自动解码二维码内容
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-foreground mb-2">📷 支持格式</p>
            <p className="text-muted-foreground">PNG、JPG、SVG 等常见图片格式</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">🔍 解码能力</p>
            <p className="text-muted-foreground">支持各种类型的二维码，包括中文、特殊字符等</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">✨ 自动识别</p>
            <p className="text-muted-foreground">上传图片后自动识别并解码，无需额外操作</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">💡 提示</p>
            <p className="text-muted-foreground">请确保图片清晰、二维码完整、光照均匀</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 主组件
export default function QRCodeGenerator() {
  const [tab, setTab] = useState<'encoder' | 'decoder'>('encoder');

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'encoder' | 'decoder')} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 p-1.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm h-auto min-h-[72px] items-stretch">
        <TabsTrigger 
          value="encoder" 
          className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-xl text-base py-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center"
        >
          <Link className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
          <span className="whitespace-nowrap">生成器</span>
        </TabsTrigger>
        <TabsTrigger 
          value="decoder" 
          className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-xl text-base py-4 transition-all duration-300 hover:bg-muted/70 flex items-center justify-center"
        >
          <Scan className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
          <span className="whitespace-nowrap">解码器</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="encoder" className="focus:outline-none">
        <QRCodeEncoder />
      </TabsContent>

      <TabsContent value="decoder" className="focus:outline-none">
        <QRCodeDecoder />
      </TabsContent>
    </Tabs>
  );
}
