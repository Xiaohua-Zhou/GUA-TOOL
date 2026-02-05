'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';

// 物理量类型定义
export type CategoryType = 
  | 'time' 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'area' 
  | 'volume' 
  | 'speed' 
  | 'data' 
  | 'pressure' 
  | 'energy';

// 单位定义
interface Unit {
  symbol: string;
  name: string;
  toBase?: (value: number) => number;  // 转换为基准单位
  fromBase?: (value: number) => number;  // 从基准单位转换
}

// 物理量配置
const CATEGORIES: Record<CategoryType, { name: string; units: Record<string, Unit> }> = {
  time: {
    name: '时间',
    units: {
      ns: { symbol: 'ns', name: '纳秒', toBase: (v) => v / 1e9, fromBase: (v) => v * 1e9 },
      µs: { symbol: 'µs', name: '微秒', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      ms: { symbol: 'ms', name: '毫秒', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      s: { symbol: 's', name: '秒', toBase: (v) => v, fromBase: (v) => v },
      min: { symbol: 'min', name: '分钟', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      h: { symbol: 'h', name: '小时', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      d: { symbol: 'd', name: '天', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      w: { symbol: 'w', name: '周', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      mo: { symbol: 'mo', name: '月', toBase: (v) => v * 2629746, fromBase: (v) => v / 2629746 },
      y: { symbol: 'y', name: '年', toBase: (v) => v * 31556952, fromBase: (v) => v / 31556952 },
    },
  },
  length: {
    name: '长度',
    units: {
      nm: { symbol: 'nm', name: '纳米', toBase: (v) => v / 1e9, fromBase: (v) => v * 1e9 },
      µm: { symbol: 'µm', name: '微米', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      mm: { symbol: 'mm', name: '毫米', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cm: { symbol: 'cm', name: '厘米', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      m: { symbol: 'm', name: '米', toBase: (v) => v, fromBase: (v) => v },
      km: { symbol: 'km', name: '千米', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      in: { symbol: 'in', name: '英寸', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { symbol: 'ft', name: '英尺', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      yd: { symbol: 'yd', name: '码', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mi: { symbol: 'mi', name: '英里', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      nmi: { symbol: 'nmi', name: '海里', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    },
  },
  weight: {
    name: '重量',
    units: {
      mg: { symbol: 'mg', name: '毫克', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      g: { symbol: 'g', name: '克', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      kg: { symbol: 'kg', name: '千克', toBase: (v) => v, fromBase: (v) => v },
      t: { symbol: 't', name: '吨', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      oz: { symbol: 'oz', name: '盎司', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
      lb: { symbol: 'lb', name: '磅', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
      st: { symbol: 'st', name: '英石', toBase: (v) => v * 6350.29, fromBase: (v) => v / 6350.29 },
      lt: { symbol: 'lt', name: '英吨', toBase: (v) => v * 1016047, fromBase: (v) => v / 1016047 },
      sht: { symbol: 'sht', name: '美吨', toBase: (v) => v * 907185, fromBase: (v) => v / 907185 },
    },
  },
  temperature: {
    name: '温度',
    units: {
      c: { symbol: '°C', name: '摄氏度', toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15 },
      f: { symbol: '°F', name: '华氏度', toBase: (v) => (v - 32) * 5/9 + 273.15, fromBase: (v) => (v - 273.15) * 9/5 + 32 },
      k: { symbol: 'K', name: '开尔文', toBase: (v) => v, fromBase: (v) => v },
    },
  },
  area: {
    name: '面积',
    units: {
      mm2: { symbol: 'mm²', name: '平方毫米', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      cm2: { symbol: 'cm²', name: '平方厘米', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      m2: { symbol: 'm²', name: '平方米', toBase: (v) => v, fromBase: (v) => v },
      ha: { symbol: 'ha', name: '公顷', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      km2: { symbol: 'km²', name: '平方千米', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      in2: { symbol: 'in²', name: '平方英寸', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
      ft2: { symbol: 'ft²', name: '平方英尺', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      yd2: { symbol: 'yd²', name: '平方码', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      ac: { symbol: 'ac', name: '英亩', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      mu: { symbol: '亩', name: '亩', toBase: (v) => v * 666.667, fromBase: (v) => v / 666.667 },
    },
  },
  volume: {
    name: '体积',
    units: {
      ml: { symbol: 'mL', name: '毫升', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      l: { symbol: 'L', name: '升', toBase: (v) => v, fromBase: (v) => v },
      m3: { symbol: 'm³', name: '立方米', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm3: { symbol: 'cm³', name: '立方厘米', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      floz: { symbol: 'fl oz', name: '流体盎司', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
      cup: { symbol: 'cup', name: '杯', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      pt: { symbol: 'pt', name: '品脱', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      qt: { symbol: 'qt', name: '夸脱', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      gal: { symbol: 'gal', name: '加仑', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      bbl: { symbol: 'bbl', name: '桶', toBase: (v) => v * 158.987, fromBase: (v) => v / 158.987 },
    },
  },
  speed: {
    name: '速度',
    units: {
      mps: { symbol: 'm/s', name: '米/秒', toBase: (v) => v, fromBase: (v) => v },
      kph: { symbol: 'km/h', name: '千米/时', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { symbol: 'mph', name: '英里/时', toBase: (v) => v / 2.23694, fromBase: (v) => v * 2.23694 },
      fps: { symbol: 'ft/s', name: '英尺/秒', toBase: (v) => v / 3.28084, fromBase: (v) => v * 3.28084 },
      kn: { symbol: 'kn', name: '节', toBase: (v) => v / 1.94384, fromBase: (v) => v * 1.94384 },
      mach: { symbol: 'Ma', name: '马赫', toBase: (v) => v * 343, fromBase: (v) => v / 343 },
    },
  },
  data: {
    name: '数据存储',
    units: {
      b: { symbol: 'b', name: '位', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
      B: { symbol: 'B', name: '字节', toBase: (v) => v, fromBase: (v) => v },
      KB: { symbol: 'KB', name: '千字节', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      MB: { symbol: 'MB', name: '兆字节', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      GB: { symbol: 'GB', name: '吉字节', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      TB: { symbol: 'TB', name: '太字节', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
      PB: { symbol: 'PB', name: '拍字节', toBase: (v) => v * 1125899906842624, fromBase: (v) => v / 1125899906842624 },
    },
  },
  pressure: {
    name: '压强',
    units: {
      pa: { symbol: 'Pa', name: '帕斯卡', toBase: (v) => v, fromBase: (v) => v },
      kpa: { symbol: 'kPa', name: '千帕', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      mpa: { symbol: 'MPa', name: '兆帕', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      bar: { symbol: 'bar', name: '巴', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      mbar: { symbol: 'mbar', name: '毫巴', toBase: (v) => v * 100, fromBase: (v) => v / 100 },
      atm: { symbol: 'atm', name: '大气压', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      psi: { symbol: 'psi', name: '磅/平方英寸', toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
      mmhg: { symbol: 'mmHg', name: '毫米汞柱', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
      torr: { symbol: 'Torr', name: '托', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
    },
  },
  energy: {
    name: '能量',
    units: {
      j: { symbol: 'J', name: '焦耳', toBase: (v) => v, fromBase: (v) => v },
      kj: { symbol: 'kJ', name: '千焦', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cal: { symbol: 'cal', name: '卡路里', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      kcal: { symbol: 'kcal', name: '千卡', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      kwh: { symbol: 'kWh', name: '千瓦时', toBase: (v) => v * 3600000, fromBase: (v) => v / 3600000 },
      btu: { symbol: 'BTU', name: '英热单位', toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
      ev: { symbol: 'eV', name: '电子伏特', toBase: (v) => v * 1.60218e-19, fromBase: (v) => v / 1.60218e-19 },
      erg: { symbol: 'erg', name: '尔格', toBase: (v) => v / 1e7, fromBase: (v) => v * 1e7 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryType>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('1');

  // 当前类别的单位列表
  const currentUnits = CATEGORIES[category].units;
  const unitKeys = Object.keys(currentUnits);

  // 当类别改变时，重置单位选择
  const handleCategoryChange = (newCategory: CategoryType) => {
    setCategory(newCategory);
    const newUnits = CATEGORIES[newCategory].units;
    const newUnitKeys = Object.keys(newUnits);
    setFromUnit(newUnitKeys[0]);
    setToUnit(newUnitKeys[Math.min(1, newUnitKeys.length - 1)]);
    setInputValue('1');
  };

  // 执行换算
  const convertedValue = useMemo(() => {
    const fromUnitConfig = currentUnits[fromUnit];
    const toUnitConfig = currentUnits[toUnit];
    const inputNum = parseFloat(inputValue) || 0;

    if (!fromUnitConfig.toBase || !toUnitConfig.fromBase) {
      return 0;
    }

    // 转换为基准单位，再转换为目标单位
    const baseValue = fromUnitConfig.toBase(inputNum);
    const result = toUnitConfig.fromBase(baseValue);
    return result;
  }, [inputValue, fromUnit, toUnit, currentUnits]);

  // 格式化输出，避免科学计数法
  const formatResult = (value: number) => {
    if (value === 0) return '0';
    if (Math.abs(value) < 0.000001 || Math.abs(value) > 999999999) {
      return value.toExponential(6);
    }
    // 移除不必要的零
    return parseFloat(value.toPrecision(10)).toString();
  };

  // 交换单位和数值
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(formatResult(convertedValue));
  };

  // 快速选择常用值
  const quickValues = [1, 10, 100, 1000];

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <ArrowLeftRight className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            单位换算器
          </h1>
        </div>
      </div>

      {/* 物理量选择 */}
      <div className="mb-6 sm:mb-8">
        <Label htmlFor="category" className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">
          选择物理量
        </Label>
        <Select value={category} onValueChange={(v) => handleCategoryChange(v as CategoryType)}>
          <SelectTrigger id="category" className="h-10 sm:h-12 text-base sm:text-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORIES).map(([key, config]) => (
              <SelectItem key={key} value={key} className="text-sm sm:text-base">
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 换算区域 */}
      <div className="space-y-4 sm:space-y-6">
        {/* 源单位和目标单位并排 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center">
          {/* 源单位 */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              从
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-10 sm:h-12 text-base sm:text-lg"
                placeholder="输入数值"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitKeys.map((key) => (
                    <SelectItem key={key} value={key} className="text-sm sm:text-base">
                      {currentUnits[key].name} ({currentUnits[key].symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 交换按钮 */}
          <div className="flex justify-center lg:flex">
            <Button
              onClick={handleSwap}
              variant="outline"
              size="lg"
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0"
            >
              <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          {/* 目标单位 */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-foreground">
              到
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                type="text"
                value={formatResult(convertedValue)}
                readOnly
                className="h-10 sm:h-12 text-base sm:text-lg font-mono font-semibold bg-muted/50"
              />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="h-10 sm:h-12 text-base sm:text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitKeys.map((key) => (
                    <SelectItem key={key} value={key} className="text-sm sm:text-base">
                      {currentUnits[key].name} ({currentUnits[key].symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 移动端显示的交换按钮 */}
        <div className="flex justify-center lg:hidden">
          <Button
            onClick={handleSwap}
            variant="outline"
            size="lg"
            className="rounded-full h-12 w-12 p-0"
          >
            <ArrowLeftRight className="w-6 h-6" />
          </Button>
        </div>

        {/* 快速选择值 */}
        <div>
          <Label className="text-base font-semibold mb-3 block text-foreground">
            快速选择
          </Label>
          <div className="flex flex-wrap gap-2">
            {quickValues.map((value) => (
              <Button
                key={value}
                variant="outline"
                onClick={() => setInputValue(value.toString())}
                className="h-10 px-4"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        {/* 换算公式说明 */}
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {inputValue || '0'} {currentUnits[fromUnit].symbol}
            </span>
            {' '}= {' '}
            <span className="font-semibold text-foreground">
              {formatResult(convertedValue)} {currentUnits[toUnit].symbol}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
