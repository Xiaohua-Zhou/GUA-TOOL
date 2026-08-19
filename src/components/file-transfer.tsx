'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  QrCode,
  Smartphone,
  Send,
  FileText,
  Image as ImageIcon,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DevicePair {
  id: string;
  pair_code: string;
  device_1_name: string;
  device_2_name: string | null;
  status: 'pending' | 'paired' | 'expired';
  expires_at: string;
  created_at: string;
}

interface Transfer {
  id: string;
  pair_id: string;
  sender_id: string;
  type: 'text' | 'image' | 'file';
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
}

export default function FileTransfer() {
  const [pair, setPair] = useState<DevicePair | null>(null);
  const [deviceId] = useState(() => {
    const saved = localStorage.getItem('transfer-device-id');
    if (saved) return saved;
    const newId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('transfer-device-id', newId);
    return newId;
  });
  const [deviceName] = useState(() => {
    const saved = localStorage.getItem('transfer-device-name');
    if (saved) return saved;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const name = isMobile ? '手机设备' : '电脑设备';
    localStorage.setItem('transfer-device-name', name);
    return name;
  });

  const [textMessage, setTextMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualPairCode, setManualPairCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCreatedAtRef = useRef<string | null>(null);
  const receivedIdsRef = useRef<Set<string>>(new Set());

  // 自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transfers]);

  // 初始化时检查 localStorage 中的配对信息
  useEffect(() => {
    const savedPairId = localStorage.getItem('transfer-pair-id');
    const savedPairCode = localStorage.getItem('transfer-pair-code');
    const savedDevice1 = localStorage.getItem('transfer-pair-device1');
    const savedDevice2 = localStorage.getItem('transfer-pair-device2');

    if (savedPairId && savedPairCode) {
      // 从服务器查询配对状态
      fetch(`/api/transfer/pair?pairId=${savedPairId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'paired') {
            setPair({
              id: savedPairId,
              pair_code: savedPairCode,
              device_1_name: savedDevice1 || deviceName,
              device_2_name: savedDevice2,
              status: 'paired',
              expires_at: data.expires_at,
              created_at: data.created_at,
            });
          } else if (data.status === 'expired' || data.status === 'pending') {
            // 清除过期的配对信息
            localStorage.removeItem('transfer-pair-id');
            localStorage.removeItem('transfer-pair-code');
            localStorage.removeItem('transfer-pair-device1');
            localStorage.removeItem('transfer-pair-device2');
          }
        })
        .catch(err => {
          console.error('Error checking pair status:', err);
        });
    }
  }, [deviceName]);

  // 轮询接收新传输
  useEffect(() => {
    if (!pair || pair.status !== 'paired') return;

    const pollInterval = setInterval(async () => {
      try {
        const url = `/api/transfer/receive?pairId=${pair.id}&deviceId=${deviceId}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.transfers && data.transfers.length > 0) {
          setTransfers(prev => {
            // 过滤掉已存在的消息，避免重复
            const newTransfers = data.transfers.filter((t: Transfer) => !receivedIdsRef.current.has(t.id));

            if (newTransfers.length > 0) {
              // 将新消息的 ID 添加到已接收集合中
              newTransfers.forEach((t: Transfer) => receivedIdsRef.current.add(t.id));
              return [...prev, ...newTransfers];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error polling transfers:', error);
      }
    }, 2000);

    setIsPolling(true);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [pair, deviceId]);

  // 创建配对
  const createPair = async () => {
    try {
      const response = await fetch('/api/transfer/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          deviceName,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setPair({
        id: data.pairId,
        pair_code: data.pairCode,
        device_1_name: deviceName,
        device_2_name: null,
        status: 'pending',
        expires_at: data.expiresAt,
        created_at: new Date().toISOString(),
      });

      // 轮询配对状态
      pollPairStatus(data.pairId);
    } catch (error) {
      console.error('Error creating pair:', error);
      alert('创建配对失败，请重试');
    }
  };

  // 轮询配对状态
  const pollPairStatus = async (pairId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/transfer/pair?pairId=${pairId}`);
        const data = await response.json();

        if (data.status === 'paired' || data.status === 'expired') {
          clearInterval(interval);
          setPair(data);

          if (data.status === 'paired') {
            // 保存配对信息
            localStorage.setItem('transfer-pair-id', data.id);
            localStorage.setItem('transfer-pair-code', data.pair_code);
            localStorage.setItem('transfer-pair-device1', data.device_1_name);
            localStorage.setItem('transfer-pair-device2', data.device_2_name);
          } else if (data.status === 'expired') {
            // 清除配对信息
            localStorage.removeItem('transfer-pair-id');
            localStorage.removeItem('transfer-pair-code');
            localStorage.removeItem('transfer-pair-device1');
            localStorage.removeItem('transfer-pair-device2');
            setPair(null);
            setTransfers([]);
            receivedIdsRef.current.clear();
            lastCreatedAtRef.current = null;
            alert('配对已过期，请重新创建');
          }
        }
      } catch (error) {
        console.error('Error polling pair status:', error);
      }
    }, 2000);
  };

  // 清除配对
  const clearPair = () => {
    localStorage.removeItem('transfer-pair-id');
    localStorage.removeItem('transfer-pair-code');
    localStorage.removeItem('transfer-pair-device1');
    localStorage.removeItem('transfer-pair-device2');
    setPair(null);
    setTransfers([]);
    receivedIdsRef.current.clear();
    lastCreatedAtRef.current = null;
  };

  // 验证配对码（手动输入）
  const verifyPairCode = async () => {
    const code = manualPairCode.trim();
    if (!code) {
      alert('请输入配对码');
      return;
    }

    if (code.length !== 6) {
      alert('配对码必须是6位数字');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/transfer/pair/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairCode: code,
          deviceId,
          deviceName,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // 配对成功
      setPair({
        id: data.pairId,
        pair_code: code,
        device_1_name: data.device1Name,
        device_2_name: data.device2Name,
        status: 'paired',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5分钟后过期
        created_at: new Date().toISOString(),
      });

      // 保存配对信息
      localStorage.setItem('transfer-pair-id', data.pairId);
      localStorage.setItem('transfer-pair-code', code);
      localStorage.setItem('transfer-pair-device1', data.device1Name);
      localStorage.setItem('transfer-pair-device2', data.device2Name);

      // 关闭手动输入界面
      setShowManualInput(false);
      setManualPairCode('');

      alert('配对成功！');
    } catch (error) {
      console.error('Error verifying pair code:', error);
      alert(error instanceof Error ? error.message : '配对失败，请检查配对码是否正确');
    } finally {
      setIsVerifying(false);
    }
  };

  // 发送文本
  const sendText = async () => {
    if (!textMessage.trim() || !pair) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('pairId', pair.id);
      formData.append('senderId', deviceId);
      formData.append('type', 'text');
      formData.append('content', textMessage);

      const response = await fetch('/api/transfer/send', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setTextMessage('');
    } catch (error) {
      console.error('Error sending text:', error);
      alert('发送失败，请重试');
    } finally {
      setIsSending(false);
    }
  };

  // 发送文件
  const sendFile = async () => {
    if (!selectedFile || !pair) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('pairId', pair.id);
      formData.append('senderId', deviceId);

      // 根据文件类型决定 type
      if (selectedFile.type.startsWith('image/')) {
        formData.append('type', 'image');
      } else {
        formData.append('type', 'file');
      }

      formData.append('file', selectedFile);

      const response = await fetch('/api/transfer/send', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending file:', error);
      alert('发送失败，请重试');
    } finally {
      setIsSending(false);
    }
  };

  // 下载文件
  const downloadFile = async (url: string, filename: string) => {
    try {
      // 使用后端代理下载文件（避免 CORS 问题）
      const proxyUrl = `/api/transfer/download?fileUrl=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);

      // 如果代理下载失败，尝试在新标签页打开
      try {
        window.open(url, '_blank');
      } catch (error2) {
        console.error('Error opening in new tab:', error2);
        alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 判断是否为发送方
  const isSender = (transfer: Transfer) => transfer.sender_id === deviceId;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-4 sm:p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold">文件传输</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {pair ? (
                  pair.status === 'paired' ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        已连接到 {pair.device_1_name === deviceName ? pair.device_2_name : pair.device_1_name}
                      </span>
                    </span>
                  ) : pair.status === 'pending' ? (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      等待配对中...
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      配对已过期
                    </span>
                  )
                ) : (
                  '未配对'
                )}
              </p>
            </div>
          </div>
          {!pair && (
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <Button onClick={createPair} size="sm" className="text-xs sm:text-sm">
                <QrCode className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">创建配对</span>
                <span className="sm:hidden">配对</span>
              </Button>
              <Button
                onClick={() => setShowManualInput(!showManualInput)}
                size="sm"
                variant="outline"
                className="text-xs sm:text-sm"
              >
                {showManualInput ? '取消' : (
                  <>
                    <span className="hidden sm:inline">手动输入配对码</span>
                    <span className="sm:hidden">输入码</span>
                  </>
                )}
              </Button>
            </div>
          )}
          {pair && pair.status === 'paired' && (
            <Button onClick={clearPair} size="sm" variant="outline" className="text-xs sm:text-sm flex-shrink-0">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">断开配对</span>
              <span className="sm:hidden">断开</span>
            </Button>
          )}
          {pair && pair.status === 'expired' && (
            <Button onClick={createPair} size="sm" variant="outline" className="text-xs sm:text-sm flex-shrink-0">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              重新配对
            </Button>
          )}
        </div>

        {/* 配对二维码 */}
        {pair && pair.status === 'pending' && (
          <div className="mb-6 p-4 sm:p-6 bg-muted/50 rounded-lg">
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center">
                用手机扫描二维码进行配对
              </p>
              <div className="bg-white p-3 sm:p-4 rounded-lg">
                <QRCodeSVG
                  value={`${window.location.origin}/transfer?code=${pair.pair_code}`}
                  size={180}
                  level="M"
                />
              </div>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg font-mono font-bold tracking-widest">
                {pair.pair_code}
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                配对码将在 {new Date(pair.expires_at).toLocaleTimeString()} 过期
              </p>
            </div>
          </div>
        )}

        {/* 手动输入配对码 */}
        {showManualInput && !pair && (
          <div className="mb-6 p-4 sm:p-6 bg-muted/50 rounded-lg">
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center">
                输入另一台设备显示的6位配对码进行连接
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md px-2 sm:px-0">
                <Input
                  type="text"
                  placeholder="例如: 123456"
                  value={manualPairCode}
                  onChange={(e) => {
                    // 只允许输入数字
                    const value = e.target.value.replace(/\D/g, '');
                    // 限制为6位
                    setManualPairCode(value.slice(0, 6));
                  }}
                  maxLength={6}
                  className="font-mono text-center text-xl sm:text-2xl tracking-widest"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualPairCode.length === 6) {
                      verifyPairCode();
                    }
                  }}
                />
                <Button
                  onClick={verifyPairCode}
                  disabled={isVerifying || manualPairCode.length !== 6}
                  className="min-w-[80px] sm:min-w-[100px] w-full sm:w-auto text-xs sm:text-sm"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                      连接中
                    </>
                  ) : (
                    '连接'
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center px-4">
                提示：确保另一台设备已显示配对码，配对码有效期为5分钟
              </p>
            </div>
          </div>
        )}

        {/* 传输区域 */}
        {pair && pair.status === 'paired' && (
          <>
            {/* 消息列表 */}
            <ScrollArea className="h-[300px] sm:h-[400px] border rounded-lg mb-4 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {transfers.length === 0 && (
                  <div className="text-center text-muted-foreground py-6 sm:py-8">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm sm:text-base">暂无传输记录</p>
                    <p className="text-xs sm:text-sm">开始发送文件或文字吧</p>
                  </div>
                )}

                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className={`flex ${isSender(transfer) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 min-w-0 ${
                        isSender(transfer)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <span className="text-xs font-medium flex-shrink-0">
                          {isSender(transfer) ? '我' : (pair.device_1_name === deviceName ? pair.device_2_name : pair.device_1_name)}
                        </span>
                        <span className="text-xs opacity-70 flex-shrink-0">
                          {new Date(transfer.created_at).toLocaleTimeString()}
                        </span>
                      </div>

                      {transfer.type === 'text' ? (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words break-all">
                          {transfer.content}
                        </p>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            {transfer.type === 'image' ? (
                              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            ) : (
                              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm font-medium truncate flex-1">
                              {transfer.file_name}
                            </span>
                            {transfer.file_size && (
                              <span className="text-xs opacity-70 flex-shrink-0">
                                ({formatFileSize(transfer.file_size)})
                              </span>
                            )}
                          </div>
                          {transfer.type === 'image' && transfer.file_url && (
                            <img
                              src={transfer.file_url}
                              alt={transfer.file_name || '图片'}
                              className="max-w-full max-h-[150px] sm:max-h-[200px] rounded-md"
                            />
                          )}
                          {!isSender(transfer) && transfer.file_url && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="mt-2 text-xs sm:text-sm"
                              onClick={() => downloadFile(transfer.file_url!, transfer.file_name!)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              下载
                            </Button>
                          )}
                          {isSender(transfer) && (
                            <p className="text-xs opacity-70">已发送</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* 发送区域 */}
            <div className="space-y-2 sm:space-y-3">
              {/* 文本输入 */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  placeholder="输入要发送的文字..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  rows={2}
                  className="resize-none text-xs sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendText();
                    }
                  }}
                />
                <Button
                  onClick={sendText}
                  disabled={isSending || !textMessage.trim()}
                  className="self-end sm:self-auto text-xs sm:text-sm"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  发送
                </Button>
              </div>

              {/* 文件上传 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxSize = 10 * 1024 * 1024; // 10MB
                      if (file.size > maxSize) {
                        alert('文件大小不能超过 10MB');
                        e.target.value = '';
                        setSelectedFile(null);
                        return;
                      }
                      setSelectedFile(file);
                    } else {
                      setSelectedFile(null);
                    }
                  }}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs sm:text-sm"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  选择文件
                </Button>
                {selectedFile && (
                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate" title={`${selectedFile.name} (${formatFileSize(selectedFile.size)})`}>
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  </div>
                )}
                <Button
                  onClick={sendFile}
                  disabled={isSending || !selectedFile}
                  className="text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  发送文件
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
