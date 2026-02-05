'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Download,
  Wand2,
  Eye,
  Edit3,
  Maximize2,
  FileCode,
  FileImage,
  File,
  Copy,
  Trash2
} from 'lucide-react';
import { saveAs } from 'file-saver';

type ViewMode = 'split' | 'edit' | 'preview';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(`# Markdown 编辑器使用指南

欢迎使用 Markdown 编辑器！以下是支持的语法示例。

## 1. 文本格式

### 标题
使用 \`#\` 创建标题，支持 H1-H6。

### 粗体和斜体
- **粗体文本**：使用 \`**粗体**\`
- *斜体文本*：使用 \`*斜体*\`
- ***粗斜体***：使用 \`***粗斜体***\`

### 引用
> 引用文本使用 \`>\` 开头
> 可以多行引用

### 水平线
使用 \`---\` 或 \`***\` 创建分隔线

---

## 2. 列表

### 无序列表
- 苹果
- 香蕉
- 橙子

### 有序列表
1. 第一步：学习 Markdown
2. 第二步：练习编写
3. 第三步：掌握技巧

### 嵌套列表
- 水果
  - 苹果
  - 香蕉
- 蔬菜
  - 西红柿
  - 黄瓜

## 3. 代码

### 行内代码
使用 \` \`代码\` \` 创建行内代码，例如 \`console.log("Hello")\`

### 代码块
使用三个反引号 \` \`\` \` 创建代码块：

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("World"));
\`\`\`

## 4. 链接和图片

### 链接
[访问百度](https://www.baidu.com)

### 图片
![示例图片](https://via.placeholder.com/150)

## 5. 表格

| 姓名 | 年龄 | 职业 | 状态 |
|------|------|------|------|
| 张三 | 25 | **工程师** | 在职 |
| 李四 | 30 | *设计师* | 在职 |
| 王五 | 28 | \`开发者\` | 休假 |

表格内支持：**粗体**、*斜体*、\`代码\`、$公式$

## 6. 数学公式

### 行内公式
公式 $x^2 + y^2 = z^2$ 可以嵌入到文本中

### 块级公式
$$
E = mc^2
$$

### 常用数学符号

#### 希腊字母
- 希腊字母：$\\alpha, \\beta, \\gamma, \\delta, \\theta, \\pi, \\omega$
- 无穷大：$\\infty$

#### 上下标
- 上标：$x^2$, $x^{n+1}$
- 下标：$x_1$, $x_{n+1}$

#### 分数与根号
- 分数：$\\frac{a}{b} = \\frac{c}{d}$
- 平方根：$\\sqrt{x}$, $\\sqrt{a^2 + b^2}$

#### 向量与修饰
- 向量：$\\vec{AB}$
- 上划线：$\\overline{AB}$
- 下划线：$\\underline{AB}$
- 括号标注：$\\overbrace{a+b+c}^{text}$, $\\underbrace{a+b+c}_{text}$

#### 求和与积分
- 求和：$\\sum_{i=1}^{n} x_i$
- 积分：$\\int_{a}^{b} f(x)dx$

#### 矩阵
$$
\\begin{matrix}
a & b \\\\
c & d
\\end{matrix}
$$

#### 关系符号
- 不等：$a \\le b$, $a \\ge b$, $a \\ne b$
- 近似：$a \\approx b$
- 等价：$a \\equiv b$
- 箭头：$a \\rightarrow b$, $a \\leftarrow b$

## 7. 复杂示例

### 数学公式综合
$$
\\int_{-\\infty}^{\\infty} e^{-x^2}dx = \\sqrt{\\pi}
$$

$$
\\vec{F} = m\\vec{a}
$$

### 表格与公式结合
| 公式 | 说明 | 数值 |
|------|------|------|
| $\\pi$ | 圆周率 | 3.14159 |
| $\\sqrt{2}$ | 根号2 | 1.41421 |
| $\\frac{\\phi}{2}$ | 黄金比例/2 | 0.80902 |

---

## 提示

- 点击 **格式化** 按钮可以自动格式化 Markdown 文本
- 使用 **复制** 按钮复制当前内容
- 使用 **清空** 按钮清空编辑器
- 支持导出为 HTML、PDF 或 Word 格式

开始编辑你的 Markdown 文档吧！`);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [fileName, setFileName] = useState('document');
  const previewRef = useRef<HTMLDivElement>(null);

  // 内置轻量级数学公式渲染器
  const renderMath = (latex: string, displayMode: boolean = false): string => {
    let html = latex.trim();
    
    // 常见数学符号映射
    const symbolMap: Record<string, string> = {
      '\\alpha': 'α',
      '\\beta': 'β',
      '\\gamma': 'γ',
      '\\delta': 'δ',
      '\\epsilon': 'ε',
      '\\zeta': 'ζ',
      '\\eta': 'η',
      '\\theta': 'θ',
      '\\iota': 'ι',
      '\\kappa': 'κ',
      '\\lambda': 'λ',
      '\\mu': 'μ',
      '\\nu': 'ν',
      '\\xi': 'ξ',
      '\\pi': 'π',
      '\\rho': 'ρ',
      '\\sigma': 'σ',
      '\\tau': 'τ',
      '\\upsilon': 'υ',
      '\\phi': 'φ',
      '\\chi': 'χ',
      '\\psi': 'ψ',
      '\\omega': 'ω',
      '\\infty': '∞',
      '\\sum': '∑',
      '\\prod': '∏',
      '\\int': '∫',
      '\\partial': '∂',
      '\\nabla': '∇',
      '\\Delta': 'Δ',
      '\\times': '×',
      '\\div': '÷',
      '\\pm': '±',
      '\\mp': '∓',
      '\\cdot': '·',
      '\\le': '≤',
      '\\ge': '≥',
      '\\neq': '≠',
      '\\approx': '≈',
      '\\equiv': '≡',
      '\\rightarrow': '→',
      '\\leftarrow': '←',
      '\\Rightarrow': '⇒',
      '\\Leftarrow': '⇐',
      '\\leftrightarrow': '↔',
      '\\Leftrightarrow': '⇔',
      '\\cdots': '⋯',
      '\\ldots': '…',
      '\\vdots': '⋮',
      '\\ddots': '⋱'
    };
    
    // 替换希腊字母和符号
    Object.keys(symbolMap).forEach(key => {
      const regex = new RegExp(key.replace(/\\/g, '\\\\'), 'g');
      html = html.replace(regex, symbolMap[key]);
    });
    
    // 处理上标 x^2
    html = html.replace(/\^(\{[^}]+\}|[^\s\{\}])/g, (match, content) => {
      const text = content.replace(/^\{|\}$/g, '');
      return `<sup>${text}</sup>`;
    });
    
    // 处理下标 x_n
    html = html.replace(/_(\{[^}]+\}|[^\s\{\}])/g, (match, content) => {
      const text = content.replace(/^\{|\}$/g, '');
      return `<sub>${text}</sub>`;
    });
    
    // 处理简单分数 \frac{a}{b}
    html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, 
      '<span class="math-fraction"><span class="math-numerator">$1</span><span class="math-denominator">$2</span></span>'
    );
    
    // 处理平方根 \sqrt{x}
    html = html.replace(/\\sqrt(\{[^}]+\}|[^\s\{\}])/g, (match, content) => {
      const text = content.replace(/^\{|\}$/g, '');
      return `<span class="math-sqrt"><span class="math-sqrt-symbol">√</span><span class="math-sqrt-content">${text}</span></span>`;
    });
    
    // 处理向量箭头 \vec{x}
    html = html.replace(/\\vec\{([^}]+)\}/g, '<span class="math-vector">$1&#x2192;</span>');
    html = html.replace(/\\vec ([^\s\{]+)/g, '<span class="math-vector">$1&#x2192;</span>');
    
    // 处理上划线 \overline{abc}
    html = html.replace(/\\overline\{([^}]+)\}/g, '<span class="math-overline">$1</span>');
    
    // 处理下划线 \underline{abc}
    html = html.replace(/\\underline\{([^}]+)\}/g, '<span class="math-underline">$1</span>');
    
    // 处理带括号的上标 \overbrace{a+b}^c
    html = html.replace(/\\overbrace\{([^}]+)\}\^(\{[^}]+\}|[^\s\{])/g, (match, content, power) => {
      const powText = power.replace(/^\{|\}$/g, '');
      return `<span class="math-overbrace"><span class="math-brace-content">$1</span><span class="math-brace-label">${powText}</span></span>`;
    });
    
    // 处理带括号的下标 \underbrace{a+b}_c
    html = html.replace(/\\underbrace\{([^}]+)\}_(\{[^}]+\}|[^\s\{])/g, (match, content, sub) => {
      const subText = sub.replace(/^\{|\}$/g, '');
      return `<span class="math-underbrace"><span class="math-brace-content">$1</span><span class="math-brace-label">${subText}</span></span>`;
    });
    
    // 处理矩阵（简化版，只显示为表格）
    html = html.replace(/\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}/g, (match, content) => {
      const rows = content.split('\\\\').filter((r: string) => r.trim());
      const tableHtml = rows.map((row: string) => {
        const cells = row.split('&').map((c: string) => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="math-matrix"><table><tbody>${tableHtml}</tbody></table></div>`;
    });
    
    // 处理 array 环境（同 matrix）
    html = html.replace(/\\begin\{array\}[\s\S]*?\\\\([\s\S]*?)\\end\{array\}/g, (match, content) => {
      const rows = content.split('\\\\').filter((r: string) => r.trim());
      const tableHtml = rows.map((row: string) => {
        const cells = row.split('&').map((c: string) => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="math-matrix"><table><tbody>${tableHtml}</tbody></table></div>`;
    });
    
    // 处理积分上下限 \int_a^b
    html = html.replace(/\\int(_\{[^}]+\}|_[^\s\{])?(\^\{[^}]+\}|\^[^\s\{])?/g, (match, lower, upper) => {
      let result = '∫';
      if (lower) {
        const lowerText = lower.replace(/^[_\{\}]|[\{\}]$/g, '');
        result = `<sub>${lowerText}</sub>` + result;
      }
      if (upper) {
        const upperText = upper.replace(/^[^\{\}]|\{|\}/g, '');
        result += `<sup>${upperText}</sup>`;
      }
      return result;
    });
    
    // 处理求和 \sum_{i=1}^n
    html = html.replace(/\\sum(_\{[^}]+\}|_[^\s\{])?(\^\{[^}]+\}|\^[^\s\{])?/g, (match, lower, upper) => {
      let result = '∑';
      if (lower) {
        const lowerText = lower.replace(/^[_\{\}]|[\{\}]$/g, '');
        result = `<sub>${lowerText}</sub>` + result;
      }
      if (upper) {
        const upperText = upper.replace(/^[^\{\}]|\{|\}/g, '');
        result += `<sup>${upperText}</sup>`;
      }
      return result;
    });
    
    // 清理剩余的反斜杠
    html = html.replace(/\\([^\s\{\}])/g, '$1');
    
    // 添加 CSS 类
    const className = displayMode ? 'math-display' : 'math-inline';
    return `<span class="${className}">${html}</span>`;
  };

  // 行内格式处理函数
  const parseInline = (text: string): string => {
    return text
      // 转义 HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // 行内代码（优先处理，保护反引号内内容不被其他格式解析）
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 图片（避免与链接冲突）
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full" />')
      // 行内数学公式 $...$
      .replace(/\$([^$\n]+?)\$/g, (match, latex) => renderMath(latex, false))
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // 粗斜体（***粗斜体***）- 优先处理，避免被粗体正则部分匹配
      .replace(/\*\*\*([^*]+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // 粗体（**粗体**）
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      // 斜体（*斜体*）
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  };

  // 简单的 Markdown 转 HTML 函数
  const parseMarkdown = (text: string): string => {
    let html = text;
    const lines = html.split('\n');
    let output: string[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let inTable = false;
    let tableRows: Array<{ type: string; cells: string[] }> = [];
    let inMathBlock = false; // 数学公式块
    let mathBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // 检测代码块
      if (line.trim().match(/^[\`]{3}/)) {
        if (inCodeBlock) {
          // 结束代码块
          output.push('<pre><code>' + codeContent.join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>');
          codeContent = [];
        }
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // 检测数学公式块 ($$...$$)
      if (/^\$\$/.test(line.trim())) {
        if (inMathBlock) {
          // 结束数学公式块并渲染
          const mathContent = mathBlockContent.join('\n').trim();
          const renderedMath = renderMath(mathContent, true);
          output.push(renderedMath);
          mathBlockContent = [];
        } else {
          inMathBlock = true;
        }
        continue;
      }

      if (inMathBlock) {
        mathBlockContent.push(line);
        continue;
      }

      // 检测表格
      if (line.trim().match(/^\|/)) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        // 跳过分隔行（|---|---|）
        if (!line.trim().match(/^\|[\s\-:]+\|[\s\-:]+/)) {
          const cells = line.split('|').filter((cell, index, arr) => index > 0 && index < arr.length);
          const rowClass = i === 0 || (i > 0 && lines[i-1].trim().match(/^\|[\s\-:]+\|/)) ? 'header' : 'row';
          tableRows.push({
            type: rowClass,
            cells: cells.map(cell => cell.trim())
          });
        }
        continue;
      } else if (inTable) {
        // 表格结束
        output.push('<table class="markdown-table">');
        tableRows.forEach((row, idx) => {
          if (row.type === 'header') {
            output.push('<thead><tr>');
            row.cells.forEach(cell => {
              output.push('<th>' + parseInline(cell) + '</th>');
            });
            output.push('</tr></thead>');
          } else {
            output.push('<tbody><tr>');
            row.cells.forEach(cell => {
              output.push('<td>' + parseInline(cell) + '</td>');
            });
            output.push('</tr></tbody>');
          }
        });
        output.push('</table>');
        inTable = false;
        tableRows = [];
      }

      // 标题 (# ## ### #### ##### ######)
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = parseInline(headerMatch[2]);
        output.push('<h' + level + '>' + content + '</h' + level + '>');
        continue;
      }

      // 水平线 (--- 或 ***)
      if (line.trim().match(/^[-*]{3,}$/)) {
        output.push('<hr>');
        continue;
      }

      // 引用 (> text)
      const quoteMatch = line.match(/^>\s+(.+)$/);
      if (quoteMatch) {
        output.push('<blockquote>' + quoteMatch[1] + '</blockquote>');
        continue;
      }

      // 无序列表 (- 或 * 或 +)
      const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
      if (ulMatch) {
        output.push('<ul><li>' + ulMatch[1] + '</li></ul>');
        continue;
      }

      // 有序列表 (1. item)
      const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
      if (olMatch) {
        output.push('<ol><li>' + olMatch[1] + '</li></ol>');
        continue;
      }

      // 空行
      if (line.trim() === '') {
        output.push('');
        continue;
      }

      // 普通文本段落
      let processedLine = parseInline(line);

      output.push(processedLine);
    }

    // 处理未关闭的表格
    if (inTable && tableRows.length > 0) {
      output.push('<table class="markdown-table">');
      tableRows.forEach((row) => {
        if (row.type === 'header') {
          output.push('<thead><tr>');
          row.cells.forEach(cell => output.push('<th>' + parseInline(cell) + '</th>'));
          output.push('</tr></thead>');
        } else {
          output.push('<tbody><tr>');
          row.cells.forEach(cell => output.push('<td>' + parseInline(cell) + '</td>'));
          output.push('</tr></tbody>');
        }
      });
      output.push('</table>');
    }

    // 合并连续的列表
    let result: string[] = [];
    for (let i = 0; i < output.length; i++) {
      const line = output[i];
      
      // 合并连续的 ul
      if (line === '<ul><li>' && result.length > 0 && result[result.length - 1].match(/<\/li><\/ul>$/)) {
        result[result.length - 1] = result[result.length - 1].replace(/<\/li><\/ul>$/, '</li>');
        result.push(line.replace('<ul><li>', '<li>'));
        continue;
      }
      
      // 合并连续的 ol
      if (line === '<ol><li>' && result.length > 0 && result[result.length - 1].match(/<\/li><\/ol>$/)) {
        result[result.length - 1] = result[result.length - 1].replace(/<\/li><\/ol>$/, '</li>');
        result.push(line.replace('<ol><li>', '<li>'));
        continue;
      }

      result.push(line);
    }

    // 添加闭合标签
    result = result.map(line => {
      if (line.match(/<li>.*$/) && !line.match(/<\/li>$/)) {
        return line + '</li>';
      }
      return line;
    });

    // 添加段落标签
    let finalOutput = [];
    for (let i = 0; i < result.length; i++) {
      const line = result[i];
      
      // 跳过空行、数学公式块和已经包含 HTML 标签的行
      if (line === '' || line.match(/^<[a-z]/i) || line.match(/^\$\$/)) {
        finalOutput.push(line);
        continue;
      }

      // 普通文本添加段落标签
      if (i === 0 || result[i-1] === '' || result[i-1].match(/^<\//)) {
        finalOutput.push('<p>' + line);
      } else if (i === result.length - 1 || result[i+1] === '' || result[i+1].match(/^</)) {
        finalOutput.push(line + '</p>');
      } else {
        finalOutput.push(line + '<br>');
      }
    }

    // 关闭未闭合的段落
    let htmlResult = finalOutput.join('\n');
    
    // 清理多余的段落标签
    htmlResult = htmlResult.replace(/<p>\s*<\/p>/g, '');
    htmlResult = htmlResult.replace(/<p>(<h[1-6]>)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<pre>)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/pre>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<ul>)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/ul>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<ol>)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/ol>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<blockquote>)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/blockquote>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<hr>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(<table)/g, '$1');
    htmlResult = htmlResult.replace(/(<\/table>)<\/p>/g, '$1');
    htmlResult = htmlResult.replace(/<p>(\$\$)/g, '$1');
    htmlResult = htmlResult.replace(/(\$\$)<\/p>/g, '$1');

    return htmlResult;
  };

  // 格式化 Markdown
  const formatMarkdown = (text: string): string => {
    const lines = text.split('\n');
    const formatted: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // 检测代码块
      if (line.trim().match(/^[\`]{3}/)) {
        inCodeBlock = !inCodeBlock;
        formatted.push(line);
        continue;
      }

      if (inCodeBlock) {
        formatted.push(line);
        continue;
      }

      // 移除行尾空白
      line = line.trimEnd();

      // 处理空行
      if (line === '') {
        if (formatted.length === 0 || formatted[formatted.length - 1] !== '') {
          formatted.push('');
        }
        continue;
      }

      // 标题格式化
      line = line.replace(/^(#{1,6})([^#\s])/, '$1 $2');

      // 无序列表格式化
      line = line.replace(/^(\s*[-*+])([^-\s])/, '$1 $2');

      // 有序列表格式化
      line = line.replace(/^(\s*\d+)([^.)\s])/, '$1. $2');

      // 引用格式化
      line = line.replace(/^(\s*>)([^>\s])/, '$1 $2');

      formatted.push(line);
    }

    return formatted.join('\n');
  };

  const handleFormat = () => {
    setMarkdown(formatMarkdown(markdown));
  };

  // 导出为 .md 文件
  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, fileName + '.md');
  };

  // 导出为 HTML 文件
  const exportHTML = () => {
    const htmlContent = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>' + fileName + '</title>\n    <script>\n        window.MathJax = {\n            tex: {\n                inlineMath: [[\'$\', \'$\'], [\'\\\\(\', \\\\)\\\']],\n                displayMath: [[\'$$\', \'$$\'], [\'\\\\[\', \'\\\]\']],\n                processEscapes: true,\n                processEnvironments: true\n            },\n            options: {\n                skipHtmlTags: [\'script\', \'noscript\', \'style\', \'textarea\', \'pre\', \'code\']\n            }\n        };\n        \n        // 自动尝试多个 CDN\n        (function() {\n            var cdnUrls = [\n                \'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\',\n                \'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js\',\n                \'https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js\'\n            ];\n            \n            function loadScript(url, index) {\n                var script = document.createElement(\'script\');\n                script.src = url;\n                script.async = true;\n                script.id = \'MathJax-script\';\n                script.onload = function() {\n                    console.log(\'MathJax loaded from\', url);\n                };\n                script.onerror = function() {\n                    if (index < cdnUrls.length - 1) {\n                        console.warn(\'Failed to load MathJax from\', url, \', trying next CDN...\');\n                        loadScript(cdnUrls[index + 1], index + 1);\n                    } else {\n                        console.error(\'All MathJax CDNs failed to load\');\n                    }\n                };\n                document.head.appendChild(script);\n            }\n            \n            loadScript(cdnUrls[0], 0);\n        })();\n    </script>\n    <style>\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Microsoft YaHei\', Arial, sans-serif;\n            max-width: 800px;\n            margin: 40px auto;\n            padding: 20px;\n            line-height: 1.6;\n            color: #333;\n        }\n        h1, h2, h3, h4, h5, h6 {\n            margin-top: 1.5em;\n            margin-bottom: 0.5em;\n            line-height: 1.25;\n        }\n        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }\n        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }\n        h3 { font-size: 1.25em; }\n        code {\n            padding: 0.2em 0.4em;\n            margin: 0;\n            font-size: 85%;\n            background-color: rgba(27,31,35,0.05);\n            border-radius: 3px;\n        }\n        pre {\n            padding: 16px;\n            overflow: auto;\n            font-size: 85%;\n            line-height: 1.45;\n            background-color: #f6f8fa;\n            border-radius: 3px;\n        }\n        pre code {\n            background-color: transparent;\n            padding: 0;\n        }\n        blockquote {\n            padding: 0 1em;\n            color: #6a737d;\n            border-left: 0.25em solid #dfe2e5;\n            margin: 0;\n        }\n        ul, ol {\n            padding-left: 2em;\n            margin: 0;\n        }\n        table.markdown-table {\n            border-collapse: collapse;\n            width: 100%;\n            margin: 1em 0;\n            border-spacing: 0;\n        }\n        table.markdown-table th,\n        table.markdown-table td {\n            border: 1px solid #dfe2e5;\n            padding: 6px 13px;\n            text-align: left;\n        }\n        table.markdown-table tr:nth-child(2n) {\n            background-color: #f6f8fa;\n        }\n        table.markdown-table thead {\n            background-color: #f6f8fa;\n        }\n        img {\n            max-width: 100%;\n            height: auto;\n        }\n        a {\n            color: #0366d6;\n            text-decoration: none;\n        }\n        a:hover {\n            text-decoration: underline;\n        }\n        /* 数学公式样式 */\n        .mjx-chtml {\n            margin: 0.5em 0;\n        }\n    </style>\n</head>\n<body>\n' + parseMarkdown(markdown) + '\n</body>\n</html>';

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, fileName + '.html');
  };

  // 导出为 Word 文档
  const exportWord = () => {
    const htmlContent = parseMarkdown(markdown);
    const wordContent = '<!DOCTYPE html>\n<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">\n<head>\n    <meta charset="UTF-8">\n    <title>' + fileName + '</title>\n    <script>\n        window.MathJax = {\n            tex: {\n                inlineMath: [[\'$\', \'$\'], [\'\\\\(\', \\\\)\\\']],\n                displayMath: [[\'$$\', \'$$\'], [\'\\\\[\', \'\\\]\']],\n                processEscapes: true,\n                processEnvironments: true\n            },\n            options: {\n                skipHtmlTags: [\'script\', \'noscript\', \'style\', \'textarea\', \'pre\', \'code\']\n            }\n        };\n        \n        // 自动尝试多个 CDN\n        (function() {\n            var cdnUrls = [\n                \'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\',\n                \'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js\',\n                \'https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js\'\n            ];\n            \n            function loadScript(url, index) {\n                var script = document.createElement(\'script\');\n                script.src = url;\n                script.async = true;\n                script.id = \'MathJax-script\';\n                script.onload = function() {\n                    console.log(\'MathJax loaded from\', url);\n                };\n                script.onerror = function() {\n                    if (index < cdnUrls.length - 1) {\n                        console.warn(\'Failed to load MathJax from\', url, \', trying next CDN...\');\n                        loadScript(cdnUrls[index + 1], index + 1);\n                    } else {\n                        console.error(\'All MathJax CDNs failed to load\');\n                    }\n                };\n                document.head.appendChild(script);\n            }\n            \n            loadScript(cdnUrls[0], 0);\n        })();\n    </script>\n    <style>\n        body {\n            font-family: \'Microsoft YaHei\', Arial, sans-serif;\n            line-height: 1.6;\n            margin: 20px;\n        }\n        h1, h2, h3, h4, h5, h6 {\n            color: #2c3e50;\n        }\n        code {\n            background-color: #f4f4f4;\n            padding: 2px 4px;\n            border-radius: 3px;\n        }\n        pre {\n            background-color: #f4f4f4;\n            padding: 16px;\n            overflow-x: auto;\n            border-radius: 4px;\n        }\n        pre code {\n            background-color: transparent;\n            padding: 0;\n        }\n        blockquote {\n            border-left: 4px solid #ddd;\n            padding-left: 16px;\n            color: #666;\n        }\n        table.markdown-table {\n            border-collapse: collapse;\n            width: 100%;\n            margin: 1em 0;\n        }\n        table.markdown-table th,\n        table.markdown-table td {\n            border: 1px solid #ddd;\n            padding: 8px 12px;\n        }\n        table.markdown-table th {\n            background-color: #f4f4f4;\n        }\n        .mjx-chtml {\n            margin: 0.5em 0;\n        }\n    </style>\n</head>\n<body>\n' + htmlContent + '\n</body>\n</html>';

    const blob = new Blob(['\ufeff', wordContent], {
      type: 'application/msword'
    });
    saveAs(blob, fileName + '.doc');
  };

  // 导出为 PDF 文档（简化版，使用 HTML 打印）
  const exportPDF = () => {
    // 创建一个包含所有内容的 HTML 文件，提示用户使用浏览器打印功能
    const htmlContent = parseMarkdown(markdown);
    const printContent = '<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>' + fileName + '</title>\n    <style>\n        @media print {\n            body {\n                margin: 0;\n                padding: 20px;\n            }\n        }\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Microsoft YaHei\', Arial, sans-serif;\n            max-width: 800px;\n            margin: 40px auto;\n            padding: 20px;\n            line-height: 1.6;\n            color: #333;\n        }\n        h1, h2, h3, h4, h5, h6 {\n            margin-top: 1.5em;\n            margin-bottom: 0.5em;\n        }\n        code {\n            padding: 0.2em 0.4em;\n            background-color: rgba(27,31,35,0.05);\n            border-radius: 3px;\n        }\n        pre {\n            padding: 16px;\n            overflow: auto;\n            background-color: #f6f8fa;\n            border-radius: 3px;\n        }\n        blockquote {\n            padding: 0 1em;\n            color: #6a737d;\n            border-left: 0.25em solid #dfe2e5;\n        }\n        table.markdown-table {\n            border-collapse: collapse;\n            width: 100%;\n            margin: 1em 0;\n        }\n        table.markdown-table th,\n        table.markdown-table td {\n            border: 1px solid #ccc;\n            padding: 6px 13px;\n            text-align: left;\n        }\n        table.markdown-table th {\n            background-color: #f4f4f4;\n        }\n        table.markdown-table tr:nth-child(2n) {\n            background-color: #f9f9f9;\n        }\n    </style>\n</head>\n<body>\n' + htmlContent + '\n<script>\n    window.onload = function() {\n        window.print();\n    }\n</script>\n</body>\n</html>';

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, fileName + '.html');
    alert('PDF 文件已生成。请在浏览器中打开该文件，使用打印功能（Ctrl+P 或 Cmd+P）并选择"保存为 PDF"来导出 PDF。');
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      alert('已复制到剪贴板');
    } catch (error) {
      alert('复制失败');
    }
  };

  // 清空内容
  const handleClear = () => {
    if (confirm('确定要清空所有内容吗？')) {
      setMarkdown('');
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background to-muted/20">
      {/* 标题 */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Markdown 编辑器
          </h1>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-background rounded-xl p-3 sm:p-4 border border-border mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
          {/* 文件名 */}
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="filename" className="text-sm whitespace-nowrap">文件名：</Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="h-9 sm:h-10 text-sm"
              placeholder="输入文件名"
            />
          </div>

          {/* 视图模式切换 */}
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('split')}
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              className="h-9 sm:h-10"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              分屏
            </Button>
            <Button
              onClick={() => setViewMode('edit')}
              variant={viewMode === 'edit' ? 'default' : 'outline'}
              size="sm"
              className="h-9 sm:h-10"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              编辑
            </Button>
            <Button
              onClick={() => setViewMode('preview')}
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              className="h-9 sm:h-10"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              预览
            </Button>
          </div>

          {/* 格式化 */}
          <Button
            onClick={handleFormat}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10"
          >
            <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            格式化
          </Button>
        </div>

        {/* 导出按钮组 */}
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <Button
            onClick={exportMarkdown}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            导出 .md
          </Button>
          <Button
            onClick={exportWord}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            <File className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            导出 Word
          </Button>
          <Button
            onClick={exportHTML}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            导出 HTML
          </Button>
          <Button
            onClick={exportPDF}
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            导出 PDF
          </Button>
          
          <div className="flex-1"></div>
          
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm"
          >
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            复制
          </Button>
          <Button
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="h-9 sm:h-10 text-xs sm:text-sm text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
            清空
          </Button>
        </div>
      </div>

      {/* 编辑器和预览区域 */}
      <div className={'grid gap-4 sm:gap-6 ' + (viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
        {/* 编辑器 */}
        {viewMode === 'split' || viewMode === 'edit' ? (
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">编辑器</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[500px] sm:h-[600px] lg:h-[700px] p-4 resize-none focus:outline-none text-sm sm:text-base font-mono leading-relaxed bg-background"
              placeholder="开始编写您的 Markdown 文档..."
              spellCheck={false}
            />
          </div>
        ) : null}

        {/* 预览 */}
        {viewMode === 'split' || viewMode === 'preview' ? (
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">预览</span>
              </div>
            </div>
            <div ref={previewRef} className="h-[500px] sm:h-[600px] lg:h-[700px] overflow-auto p-4 sm:p-6">
              <style>{`
                .markdown-table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 1em 0;
                }
                .markdown-table th,
                .markdown-table td {
                  border: 1px solid #dfe2e5;
                  padding: 6px 13px;
                  text-align: left;
                }
                .markdown-table th {
                  background-color: #f6f8fa;
                  font-weight: 600;
                }
                .dark .markdown-table th,
                .dark .markdown-table td {
                  border-color: #444;
                }
                .dark .markdown-table th {
                  background-color: #1e293b;
                }
                .dark .markdown-table tr:nth-child(2n) {
                  background-color: rgba(255,255,255,0.05);
                }
                /* 标题样式 */
                h1, h2, h3, h4, h5, h6 {
                  margin-top: 1.5em;
                  margin-bottom: 0.5em;
                  font-weight: 600;
                  line-height: 1.25;
                }
                h1 { font-size: 2em; border-bottom: 1px solid currentColor; padding-bottom: 0.3em; }
                h2 { font-size: 1.5em; border-bottom: 1px solid currentColor; padding-bottom: 0.3em; }
                h3 { font-size: 1.25em; }
                h4 { font-size: 1em; }
                h5 { font-size: 0.875em; }
                h6 { font-size: 0.85em; color: #6b7280; }
                /* 代码块样式 */
                pre {
                  background-color: #f6f8fa;
                  padding: 1em;
                  overflow-x: auto;
                  border-radius: 0.375em;
                  margin: 1em 0;
                  border: 1px solid #e5e7eb;
                }
                .dark pre {
                  background-color: #1e293b;
                  border-color: #334155;
                }
                code {
                  background-color: rgba(27,31,35,0.05);
                  padding: 0.2em 0.4em;
                  border-radius: 0.2em;
                  font-size: 0.85em;
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                }
                .dark code {
                  background-color: rgba(255,255,255,0.1);
                }
                pre code {
                  background-color: transparent;
                  padding: 0;
                  border-radius: 0;
                  font-size: 0.875em;
                }
                /* 引用样式 */
                blockquote {
                  padding: 0 1em;
                  color: #6b7280;
                  border-left: 0.25em solid #dfe2e5;
                  margin: 1em 0;
                }
                .dark blockquote {
                  color: #9ca3af;
                  border-left-color: #4b5563;
                }
                /* 列表样式 */
                ul, ol {
                  padding-left: 2em;
                  margin: 1em 0;
                }
                li {
                  margin: 0.25em 0;
                }
                /* 分隔线样式 */
                hr {
                  margin: 2em 0;
                  border: 0;
                  border-top: 1px solid #e5e7eb;
                }
                .dark hr {
                  border-top-color: #374151;
                }
                /* 链接样式 */
                a {
                  color: #2563eb;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
                .dark a {
                  color: #60a5fa;
                }
                /* 数学公式样式 */
                .math-display {
                  display: block;
                  margin: 1em 0;
                  padding: 0.5em;
                  text-align: center;
                  overflow-x: auto;
                }
                .math-inline {
                  display: inline;
                  padding: 0 0.2em;
                }
                .math-fraction {
                  display: inline-block;
                  text-align: center;
                  vertical-align: middle;
                  margin: 0 0.2em;
                }
                .math-numerator {
                  display: block;
                  padding: 0.1em 0.5em;
                }
                .math-denominator {
                  display: block;
                  border-top: 1px solid currentColor;
                  padding: 0.1em 0.5em;
                }
                .math-sqrt {
                  display: inline-flex;
                  align-items: center;
                  margin: 0 0.2em;
                }
                .math-sqrt-symbol {
                  font-size: 1.2em;
                  line-height: 1;
                  margin-right: 0.1em;
                }
                .math-sqrt-content {
                  border-top: 1px solid currentColor;
                  padding-top: 1px;
                }
                .math-vector {
                  display: inline;
                  text-decoration: none;
                }
                .math-overline {
                  display: inline;
                  border-top: 1px solid currentColor;
                  padding-top: 1px;
                }
                .math-underline {
                  display: inline;
                  border-bottom: 1px solid currentColor;
                  padding-bottom: 1px;
                }
                .math-overbrace,
                .math-underbrace {
                  display: inline-block;
                  position: relative;
                  margin: 0 0.3em;
                }
                .math-brace-content {
                  display: block;
                }
                .math-brace-label {
                  position: absolute;
                  font-size: 0.7em;
                  text-align: center;
                }
                .math-overbrace .math-brace-label {
                  top: -1.2em;
                  left: 50%;
                  transform: translateX(-50%);
                  border-top: 1px solid currentColor;
                  padding-top: 0.2em;
                }
                .math-underbrace .math-brace-label {
                  bottom: -1.2em;
                  left: 50%;
                  transform: translateX(-50%);
                  border-bottom: 1px solid currentColor;
                  padding-bottom: 0.2em;
                }
                .math-matrix {
                  display: inline-block;
                  margin: 0.5em 0;
                  overflow-x: auto;
                }
                .math-matrix table {
                  border-collapse: collapse;
                  vertical-align: middle;
                }
                .math-matrix td {
                  padding: 0.2em 0.5em;
                  text-align: center;
                  border: 1px solid #dfe2e5;
                }
                .dark .math-matrix td {
                  border-color: #444;
                }
                sup, sub {
                  font-size: 0.7em;
                  line-height: 1;
                }
              `}</style>
              <article
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
