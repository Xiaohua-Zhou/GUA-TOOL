'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Play, Pause, RotateCcw, Clock, Bell } from 'lucide-react';

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 计算初始总秒数
  useEffect(() => {
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(total);
    if (!isRunning && !isPaused) {
      setRemainingSeconds(total);
    }
  }, [hours, minutes, seconds, isRunning, isPaused]);

  // 倒计时逻辑
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            setShowCompletionDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  const handleStart = () => {
    if (totalSeconds === 0) {
      return;
    }
    if (isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setRemainingSeconds(totalSeconds);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setShowCompletionDialog(false);
    setRemainingSeconds(totalSeconds);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleConfirmCompletion = () => {
    setShowCompletionDialog(false);
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(totalSeconds);
  };

  // 格式化时间显示
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 进度百分比
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            倒计时器
          </h1>
        </div>
      </div>

      {/* 时间显示 */}
      <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
        <div className="relative">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums tracking-wider">
            {formatTime(remainingSeconds)}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full mb-4 sm:mb-6 lg:mb-8">
        <Progress value={progress} className="h-2 sm:h-3 bg-primary/20" />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-2">
          <span>{formatTime(totalSeconds - remainingSeconds)} 已过</span>
          <span>{formatTime(remainingSeconds)} 剩余</span>
        </div>
      </div>

      {/* 时间输入 */}
      <div className={`transition-all duration-300 ${isRunning || isPaused ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">小时</label>
            <Input
              type="number"
              min="0"
              max="99"
              value={hours}
              onChange={(e) => setHours(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              className="w-20 sm:w-24 h-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold"
            />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-primary mt-4 sm:mt-6">:</span>
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">分钟</label>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 sm:w-24 h-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold"
            />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-primary mt-4 sm:mt-6">:</span>
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">秒</label>
            <Input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 sm:w-24 h-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold"
            />
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-4 sm:mb-6 lg:mb-8">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            size="lg"
            className="min-w-[100px] sm:min-w-[120px] h-10 sm:h-12 text-sm sm:text-base font-semibold"
            disabled={totalSeconds === 0 || remainingSeconds === 0}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {isPaused ? '继续' : '开始'}
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            size="lg"
            variant="outline"
            className="min-w-[100px] sm:min-w-[120px] h-10 sm:h-12 text-sm sm:text-base font-semibold"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            暂停
          </Button>
        )}

        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="min-w-[100px] sm:min-w-[120px] h-10 sm:h-12 text-sm sm:text-base font-semibold"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          重置
        </Button>
      </div>

      {/* 快速选择 */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {[
          { label: '1 分钟', value: 1 },
          { label: '5 分钟', value: 5 },
          { label: '10 分钟', value: 10 },
          { label: '15 分钟', value: 15 },
          { label: '25 分钟', value: 25 },
          { label: '30 分钟', value: 30 },
        ].map((preset) => (
          <Button
            key={preset.label}
            onClick={() => {
              setHours(0);
              setMinutes(preset.value);
              setSeconds(0);
            }}
            size="sm"
            variant="outline"
            className="h-8 sm:h-9 text-xs sm:text-sm"
            disabled={isRunning || isPaused}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* 倒计时完成对话框 */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-bounce" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl sm:text-2xl font-bold">
              倒计时结束！
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm sm:text-base">
              您设定的专注时间已到
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 sm:flex-row sm:gap-2">
            <AlertDialogAction
              onClick={handleConfirmCompletion}
              className="w-full sm:w-auto h-10 sm:h-12 text-sm sm:text-base font-semibold"
            >
              我知道了
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
