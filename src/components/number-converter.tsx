'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Languages, RefreshCw } from 'lucide-react';

// 中文数字映射
const CHINESE_NUMS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CHINESE_UNITS = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];
const CHINESE_BIG_NUMS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CHINESE_BIG_UNITS = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];

// 英语数字映射（基础0-19）
const ENGLISH_NUMS_UNDER20 = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
// 英语十位数（20, 30, 40...）
const ENGLISH_TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];
// 英语大单位
const ENGLISH_SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

// 阿拉伯数字转中文（大写）
function arabicToChinese(num: number, useBig: boolean = false): string {
  if (num === 0) return '零';
  if (num < 0) return '负' + arabicToChinese(-num, useBig);

  // 处理小数
  const numStr = num.toString();
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    const integerPart = arabicToChinese(parseFloat(parts[0]), useBig);
    // 小数部分也用大写中文数字逐位读出
    const nums = useBig ? CHINESE_BIG_NUMS : CHINESE_NUMS;
    const decimalPart = parts[1].split('').map(d => nums[parseInt(d)]).join('');
    return integerPart + '点' + decimalPart;
  }

  const nums = useBig ? CHINESE_BIG_NUMS : CHINESE_NUMS;
  const units = useBig ? CHINESE_BIG_UNITS : CHINESE_UNITS;

  const str = num.toString();
  let result = '';
  let zeroFlag = false;

  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i]);
    const pos = str.length - 1 - i;
    const unit = units[pos];

    if (digit === 0) {
      zeroFlag = true;
      if (pos % 4 === 0 && result.length > 0 && result[result.length - 1] !== '零') {
        result += nums[0];
      }
    } else {
      if (zeroFlag) {
        result += nums[0];
        zeroFlag = false;
      }
      result += nums[digit] + unit;
    }
  }

  // 处理连续的零
  result = result.replace(/零+/g, '零');
  result = result.replace(/零+$/, '');

  // 特殊处理：一十 → 十
  if (result.startsWith('一十')) {
    result = result.substring(1);
  }

  return result || nums[0];
}

// 中文转阿拉伯数字
function chineseToArabic(chinese: string): number {
  const nums: Record<string, number> = {};
  CHINESE_NUMS.forEach((n, i) => nums[n] = i);
  CHINESE_BIG_NUMS.forEach((n, i) => nums[n] = i);

  const units: Record<string, number> = {
    '十': 10,
    '拾': 10,
    '百': 100,
    '佰': 100,
    '千': 1000,
    '仟': 1000,
    '万': 10000,
    '亿': 100000000,
  };

  // 处理负数
  if (chinese.startsWith('负')) {
    return -chineseToArabic(chinese.substring(1));
  }

  // 处理小数
  if (chinese.includes('点')) {
    const parts = chinese.split('点');
    const integerPart = parseChineseInteger(parts[0], nums, units);
    const decimalStr = parts[1] || '0';
    // 小数部分逐位解析
    let decimalPart = 0;
    for (let i = 0; i < decimalStr.length; i++) {
      const char = decimalStr[i];
      if (nums[char] !== undefined) {
        decimalPart = decimalPart * 10 + nums[char];
      }
    }
    return integerPart + decimalPart / Math.pow(10, decimalStr.length);
  }

  return parseChineseInteger(chinese, nums, units);
}

// 解析中文整数部分
function parseChineseInteger(chinese: string, nums: Record<string, number>, units: Record<string, number>): number {
  let result = 0;
  let current = 0;
  let i = 0;

  while (i < chinese.length) {
    const char = chinese[i];

    if (nums[char] !== undefined) {
      current = nums[char];
    } else if (units[char] !== undefined) {
      if (units[char] >= 10000) {
        result = (result + current) * units[char];
        current = 0;
      } else {
        current *= units[char];
        result += current;
        current = 0;
      }
    }
    i++;
  }

  result += current;

  return result;
}

// 阿拉伯数字转英语
function arabicToEnglish(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'negative ' + arabicToEnglish(-num);

  // 处理小数
  const numStr = num.toString();
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    const integerPart = arabicToEnglish(parseFloat(parts[0]));
    // 小数部分用"point"和逐位数字
    const decimalPart = parts[1].split('').map(d => ENGLISH_NUMS_UNDER20[parseInt(d)]).join(' ');
    return integerPart + ' point ' + decimalPart;
  }

  const numInteger = Math.floor(num);

  if (numInteger < 20) {
    return ENGLISH_NUMS_UNDER20[numInteger];
  }

  if (numInteger < 100) {
    const tens = Math.floor(numInteger / 10);
    const ones = numInteger % 10;
    return ENGLISH_TENS[tens] + (ones ? '-' + ENGLISH_NUMS_UNDER20[ones] : '');
  }

  if (numInteger < 1000) {
    const hundreds = Math.floor(numInteger / 100);
    const remainder = numInteger % 100;
    return ENGLISH_NUMS_UNDER20[hundreds] + ' hundred' + (remainder ? ' ' + arabicToEnglish(remainder) : '');
  }

  // 处理更大的数字
  let scaleIndex = 0;
  let result = '';
  let temp = numInteger;

  while (temp > 0) {
    const group = temp % 1000;

    if (group > 0) {
      let groupStr = arabicToEnglish(group);
      if (scaleIndex > 0) {
        groupStr += ' ' + ENGLISH_SCALES[scaleIndex];
      }

      if (result) {
        result = groupStr + ', ' + result;
      } else {
        result = groupStr;
      }
    }

    temp = Math.floor(temp / 1000);
    scaleIndex++;
  }

  return result;
}

// 英语转阿拉伯数字
function englishToArabic(english: string): number {
  // 清理输入
  const cleaned = english.toLowerCase().replace(/[-,\s]/g, ' ');

  if (cleaned === 'zero') return 0;

  // 处理负数
  let isNegative = false;
  let processed = cleaned;
  if (processed.startsWith('negative')) {
    isNegative = true;
    processed = processed.substring(8);
  }

  // 处理小数
  if (processed.includes('point') || processed.includes('.')) {
    const separator = processed.includes('point') ? 'point' : '.';
    const parts = processed.split(separator);
    const integerPart = parseEnglishInteger(parts[0]);

    // 解析小数部分（逐位数字）
    let decimalPart = 0;
    if (parts[1]) {
      const decimalWords = parts[1].trim().split(' ');
      for (const word of decimalWords) {
        if (ENGLISH_NUMS_UNDER20.includes(word)) {
          decimalPart = decimalPart * 10 + ENGLISH_NUMS_UNDER20.indexOf(word);
        }
      }
    }

    const result = integerPart + decimalPart / Math.pow(10, parts[1]?.replace(/\s/g, '').length || 1);
    return isNegative ? -result : result;
  }

  const result = parseEnglishInteger(processed);
  return isNegative ? -result : result;
}

// 解析英语整数部分
function parseEnglishInteger(english: string): number {
  // 清理输入
  const cleaned = english.replace(/[-,\s]/g, '');

  // 构建映射
  const numMap: Record<string, number> = {};
  ENGLISH_NUMS_UNDER20.forEach((n, i) => numMap[n] = i);
  ENGLISH_TENS.forEach((n, i) => { if (n) numMap[n] = i * 10; });
  ENGLISH_SCALES.forEach((n, i) => { if (n) numMap[n] = Math.pow(1000, i); });
  numMap['hundred'] = 100;

  // 简单实现：支持基础转换
  let result = 0;
  let current = 0;
  let i = 0;

  while (i < cleaned.length) {
    let matched = false;

    // 尝试匹配最长单词
    for (let len = 10; len > 0; len--) {
      const substr = cleaned.substring(i, i + len);
      if (numMap[substr] !== undefined) {
        const value = numMap[substr];

        if (value >= 1000) {
          current = (current + value) * result;
          result = current;
          current = 0;
        } else if (value === 100) {
          current *= 100;
        } else if (value >= 20) {
          current += value;
        } else {
          current += value;
        }

        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      i++;
    }
  }

  result += current;

  return result;
}

export default function NumberConverter() {
  const [arabic, setArabic] = useState('');
  const [chinese, setChinese] = useState('');
  const [english, setEnglish] = useState('');

  // 清除函数
  const handleClear = () => {
    setArabic('');
    setChinese('');
    setEnglish('');
  };

  // 处理阿拉伯数字输入
  const handleArabicChange = (value: string) => {
    setArabic(value);

    const num = parseFloat(value) || 0;
    if (value && !isNaN(num)) {
      setChinese(arabicToChinese(num, true));
      setEnglish(arabicToEnglish(num));
    } else {
      setChinese('');
      setEnglish('');
    }
  };

  // 处理中文数字输入
  const handleChineseChange = (value: string) => {
    setChinese(value);

    if (value) {
      const num = chineseToArabic(value);
      if (!isNaN(num)) {
        setArabic(num.toString());
        setEnglish(arabicToEnglish(num));
      }
    } else {
      setArabic('');
      setEnglish('');
    }
  };

  // 处理英语数字输入
  const handleEnglishChange = (value: string) => {
    setEnglish(value);

    if (value) {
      const num = englishToArabic(value);
      if (!isNaN(num)) {
        setArabic(num.toString());
        setChinese(arabicToChinese(num, true));
      }
    } else {
      setArabic('');
      setChinese('');
    }
  };

  // 快速测试数字
  const testNumbers = [0, 1, 10, 100, 1000, 10000, 123456789, 3.14, 99.99, 0.5];

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Languages className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            数字转换器
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* 阿拉伯数字 */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
          <Label htmlFor="arabic" className="text-base font-semibold mb-3 block text-foreground">
            阿拉伯数字 (123.45)
          </Label>
          <Input
            id="arabic"
            type="text"
            value={arabic}
            onChange={(e) => handleArabicChange(e.target.value)}
            placeholder="输入阿拉伯数字（支持小数）..."
            className="h-12 text-lg"
          />
        </div>

        {/* 中文数字 */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
          <Label htmlFor="chinese" className="text-base font-semibold mb-3 block text-foreground">
            中文数字 (壹佰贰拾叁点肆伍)
          </Label>
          <Input
            id="chinese"
            value={chinese}
            onChange={(e) => handleChineseChange(e.target.value)}
            placeholder="输入中文数字（支持小数）..."
            className="h-12 text-lg"
          />
        </div>

        {/* 英语数字 */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
          <Label htmlFor="english" className="text-base font-semibold mb-3 block text-foreground">
            英语数字 (one hundred and twenty-three point four five)
          </Label>
          <Input
            id="english"
            value={english}
            onChange={(e) => handleEnglishChange(e.target.value)}
            placeholder="输入英语数字（支持小数）..."
            className="h-12 text-lg"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1 h-12 text-base font-semibold"
            disabled={!arabic && !chinese && !english}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            清空
          </Button>
        </div>

        {/* 快速测试 */}
        <div>
          <Label className="text-base font-semibold mb-3 block text-foreground">
            快速测试
          </Label>
          <div className="flex flex-wrap gap-2">
            {testNumbers.map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleArabicChange(num.toString())}
                className="h-10"
              >
                {num.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-foreground mb-2">🔄 自动转换</p>
            <p className="text-muted-foreground">在任意输入框输入数字，自动生成其他两种格式</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">📝 中文格式</p>
            <p className="text-muted-foreground">使用大写中文数字（壹、贰、叁...），小数部分用"点"和大写中文数字</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">🌐 英语格式</p>
            <p className="text-muted-foreground">支持标准英语数字格式，小数部分用"point"和逐位数字</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">💡 范围支持</p>
            <p className="text-muted-foreground">支持负数、小数、零到大数（亿级）的转换</p>
          </div>
        </div>
      </div>

      {/* 转换示例 */}
      <div className="mt-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">转换示例</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-4 p-3 bg-background rounded-lg">
            <div className="font-medium text-foreground">阿拉伯</div>
            <div className="font-medium text-foreground">中文</div>
            <div className="font-medium text-foreground">英语</div>
          </div>
          {[
            { a: '1', c: '壹', e: 'one' },
            { a: '12', c: '壹拾贰', e: 'twelve' },
            { a: '123', c: '壹佰贰拾叁', e: 'one hundred and twenty-three' },
            { a: '1000', c: '壹仟', e: 'one thousand' },
            { a: '10000', c: '壹万', e: 'ten thousand' },
            { a: '3.14', c: '叁点壹肆', e: 'three point one four' },
            { a: '99.99', c: '玖拾玖点玖玖', e: 'ninety-nine point nine nine' },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 p-3 bg-background rounded-lg">
              <div className="text-foreground">{item.a}</div>
              <div className="text-foreground">{item.c}</div>
              <div className="text-foreground text-xs">{item.e}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
