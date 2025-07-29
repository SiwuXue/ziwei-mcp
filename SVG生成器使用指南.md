# 紫微斗数SVG生成器使用指南

## 概述

本指南介绍如何使用增强的紫微斗数SVG生成器，该生成器支持模板化生成、增量更新、多种图表类型和自定义主题。

## 核心特性

### 🎨 模板化生成
- 支持多种预定义模板
- 变量替换和条件渲染
- 模板缓存和优化
- 自定义模板注册

### ⚡ 增量更新
- 智能差异检测
- 只更新变化部分
- 显著提升性能
- 自动降级机制

### 📊 多种图表类型
- 传统命盘 (traditional_chart)
- 现代轮盘 (modern_wheel)
- 网格布局 (grid_layout)
- 星曜关系图 (star_relationship)
- 运势时间线 (fortune_timeline)
- 合婚雷达图 (compatibility_radar)

### 🎭 自定义主题
- 经典主题 (classic)
- 暗色主题 (dark)
- 中国风主题 (chinese)
- 简约主题 (minimal)
- 支持自定义主题创建

## 快速开始

### 1. 基本使用

```javascript
const { IntegratedSVGGenerator } = require('./src/core/integrated-svg-generator');

// 创建生成器实例
const generator = new IntegratedSVGGenerator({
  enableIncremental: true,
  enableCaching: true,
  defaultTheme: 'classic',
  defaultChartType: 'traditional_chart'
});

// 生成传统命盘
const chartData = {
  palaces: [
    {
      name: '命宫',
      ganZhi: '甲子',
      stars: ['紫微', '天府'],
      brightness: ['庙', '旺']
    },
    // ... 其他11个宫位
  ],
  theme: 'classic'
};

const svg = await generator.generateChart(chartData, {
  chartType: 'traditional_chart',
  width: 800,
  height: 600,
  theme: 'classic'
});

console.log('生成的SVG:', svg);
```

### 2. 主题切换

```javascript
// 切换到暗色主题
const darkSvg = await generator.generateChart(chartData, {
  chartType: 'traditional_chart',
  theme: 'dark',
  width: 800,
  height: 600
});

// 使用中国风主题
const chineseSvg = await generator.generateChart(chartData, {
  chartType: 'traditional_chart',
  theme: 'chinese',
  width: 800,
  height: 600
});
```

### 3. 不同图表类型

#### 现代轮盘图

```javascript
const wheelSvg = await generator.generateChart(chartData, {
  chartType: 'modern_wheel',
  theme: 'minimal',
  width: 600,
  height: 600,
  enableAnimations: true
});
```

#### 星曜关系图

```javascript
const relationshipData = {
  nodes: [
    {
      id: 'ziwei',
      name: '紫微',
      type: 'main_star',
      brightness: '庙',
      x: 300,
      y: 200
    },
    {
      id: 'tianfu',
      name: '天府',
      type: 'main_star',
      brightness: '旺',
      x: 400,
      y: 300
    }
  ],
  edges: [
    {
      source: { x: 300, y: 200 },
      target: { x: 400, y: 300 },
      type: 'mutual_support',
      label: '相辅',
      color: '#4CAF50'
    }
  ]
};

const relationshipSvg = await generator.generateChart(relationshipData, {
  chartType: 'star_relationship',
  theme: 'classic',
  width: 800,
  height: 600
});
```

#### 运势时间线

```javascript
const timelineData = {
  timeline: {
    startYear: 2020,
    endYear: 2030
  },
  events: [
    {
      year: 2024,
      title: '事业高峰',
      description: '紫微入命，事业运佳',
      type: 'career',
      timeRatio: 0.4,
      color: '#FF9800'
    },
    {
      year: 2026,
      title: '感情机遇',
      description: '红鸾星动，姻缘到来',
      type: 'love',
      timeRatio: 0.6,
      color: '#E91E63'
    }
  ],
  periods: [
    {
      name: '大运：甲子',
      startYear: 2020,
      endYear: 2030,
      type: 'major_luck',
      color: '#2196F3'
    }
  ]
};

const timelineSvg = await generator.generateChart(timelineData, {
  chartType: 'fortune_timeline',
  theme: 'modern',
  width: 1000,
  height: 400
});
```

#### 合婚雷达图

```javascript
const compatibilityData = {
  axes: [
    { label: '性格匹配', maxValue: 100 },
    { label: '事业协调', maxValue: 100 },
    { label: '财运互补', maxValue: 100 },
    { label: '健康和谐', maxValue: 100 },
    { label: '子女缘分', maxValue: 100 },
    { label: '家庭和睦', maxValue: 100 }
  ],
  data: [
    {
      name: '男方',
      color: '#2196F3',
      values: [
        { value: 85 },
        { value: 92 },
        { value: 78 },
        { value: 88 },
        { value: 75 },
        { value: 90 }
      ]
    },
    {
      name: '女方',
      color: '#E91E63',
      values: [
        { value: 88 },
        { value: 85 },
        { value: 82 },
        { value: 90 },
        { value: 85 },
        { value: 87 }
      ]
    }
  ]
};

const radarSvg = await generator.generateChart(compatibilityData, {
  chartType: 'compatibility_radar',
  theme: 'classic',
  width: 600,
  height: 600
});
```

## 高级功能

### 1. 自定义主题

```javascript
// 创建自定义主题
const customTheme = {
  name: 'sunset',
  colors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFD23F',
    background: '#FFF8E1',
    surface: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#666666',
    borderPrimary: '#FF6B35',
    borderSecondary: '#F7931E'
  },
  fonts: {
    fontFamily: 'Arial, sans-serif',
    titleSize: '18px',
    subtitleSize: '14px',
    bodySize: '12px',
    captionSize: '10px'
  },
  spacing: {
    small: 4,
    medium: 8,
    large: 16,
    xlarge: 24
  }
};

// 注册自定义主题
generator.themeManager.registerTheme('sunset', customTheme);

// 使用自定义主题
const customSvg = await generator.generateChart(chartData, {
  chartType: 'traditional_chart',
  theme: 'sunset',
  width: 800,
  height: 600
});
```

### 2. 增量更新示例

```javascript
// 第一次生成
const initialData = {
  palaces: [
    { name: '命宫', stars: ['紫微'] },
    // ... 其他宫位
  ]
};

const svg1 = await generator.generateChart(initialData, {
  chartType: 'traditional_chart',
  enableIncremental: true
});

// 修改数据（只改变一个宫位的星曜）
const updatedData = {
  ...initialData,
  palaces: [
    { name: '命宫', stars: ['紫微', '天府'] }, // 添加了天府星
    ...initialData.palaces.slice(1)
  ]
};

// 第二次生成（将使用增量更新）
const svg2 = await generator.generateChart(updatedData, {
  chartType: 'traditional_chart',
  enableIncremental: true
});

console.log('增量更新完成');
```

### 3. 批量生成

```javascript
// 批量生成不同主题的图表
const themes = ['classic', 'dark', 'chinese', 'minimal'];
const results = [];

for (const theme of themes) {
  const svg = await generator.generateChart(chartData, {
    chartType: 'traditional_chart',
    theme: theme,
    width: 800,
    height: 600
  });
  
  results.push({
    theme: theme,
    svg: svg
  });
}

console.log(`生成了 ${results.length} 个不同主题的图表`);
```

### 4. 性能监控

```javascript
// 获取性能统计
const stats = generator.getStats();
console.log('生成器统计:', {
  总生成次数: stats.totalGenerations,
  缓存命中率: `${(stats.cacheHitRate * 100).toFixed(2)}%`,
  增量更新率: `${(stats.incrementalRate * 100).toFixed(2)}%`,
  平均生成时间: `${stats.averageGenerationTime.toFixed(2)}ms`,
  错误次数: stats.errorCount
});

// 重置统计
generator.resetStats();

// 清理缓存
generator.clearCache();
```

## 配置选项

### 生成器配置

```javascript
const generator = new IntegratedSVGGenerator({
  // 增量更新
  enableIncremental: true,
  
  // 缓存
  enableCaching: true,
  
  // 优化
  enableOptimization: true,
  
  // 默认设置
  defaultTheme: 'classic',
  defaultChartType: 'traditional_chart',
  
  // 动画和交互
  enableAnimations: true,
  enableInteractivity: false,
  
  // 输出格式
  outputFormat: 'svg', // 'svg' | 'png' | 'pdf'
  quality: 'high'      // 'low' | 'medium' | 'high'
});
```

### 图表配置

```javascript
const options = {
  // 图表类型
  chartType: 'traditional_chart',
  
  // 尺寸
  width: 800,
  height: 600,
  
  // 主题
  theme: 'classic',
  
  // 功能开关
  enableAnimations: true,
  enableInteractivity: false,
  enableOptimization: true,
  
  // 输出
  outputFormat: 'svg',
  quality: 'high'
};
```

## 最佳实践

### 1. 性能优化

```javascript
// 启用所有优化功能
const optimizedGenerator = new IntegratedSVGGenerator({
  enableIncremental: true,
  enableCaching: true,
  enableOptimization: true
});

// 批量处理时复用生成器实例
const batchGenerate = async (dataList) => {
  const results = [];
  
  for (const data of dataList) {
    const svg = await optimizedGenerator.generateChart(data, {
      chartType: 'traditional_chart',
      enableIncremental: true
    });
    results.push(svg);
  }
  
  return results;
};
```

### 2. 错误处理

```javascript
try {
  const svg = await generator.generateChart(chartData, options);
  console.log('生成成功');
} catch (error) {
  console.error('生成失败:', error.message);
  
  // 降级处理
  const fallbackSvg = await generator.generateChart(chartData, {
    ...options,
    enableIncremental: false,
    enableOptimization: false
  });
}
```

### 3. 内存管理

```javascript
// 定期清理缓存
setInterval(() => {
  const stats = generator.getStats();
  
  // 如果缓存命中率低，清理缓存
  if (stats.cacheHitRate < 0.3) {
    generator.clearCache();
    console.log('缓存已清理');
  }
}, 60000); // 每分钟检查一次
```

## 扩展开发

### 1. 自定义图表类型

```javascript
// 注册新的图表类型模板
generator.templateManager.registerTemplate('custom_chart', {
  name: '自定义图表',
  category: 'chart',
  variables: ['width', 'height', 'data', 'theme.*'],
  template: `
    <svg width="{{width}}" height="{{height}}" 
         xmlns="http://www.w3.org/2000/svg" class="custom-chart">
      <!-- 自定义SVG内容 -->
    </svg>
  `
});

// 使用自定义图表类型
const customSvg = await generator.generateChart(data, {
  chartType: 'custom_chart'
});
```

### 2. 自定义验证器

```javascript
// 扩展验证方法
generator.validateCustomChart = function(data) {
  const errors = [];
  
  if (!data.customField) {
    errors.push('缺少自定义字段');
  }
  
  return { valid: errors.length === 0, errors };
};
```

## 故障排除

### 常见问题

1. **生成失败**
   - 检查数据格式是否正确
   - 验证主题是否存在
   - 确认图表类型是否支持

2. **性能问题**
   - 启用缓存和增量更新
   - 减少不必要的重新生成
   - 定期清理缓存

3. **样式问题**
   - 检查主题配置
   - 验证CSS类名
   - 确认模板变量

### 调试模式

```javascript
// 启用详细日志
const debugGenerator = new IntegratedSVGGenerator({
  debug: true,
  logLevel: 'verbose'
});

// 查看详细统计
const detailedStats = debugGenerator.getStats();
console.log('详细统计:', JSON.stringify(detailedStats, null, 2));
```

## 总结

增强的SVG生成器提供了强大的功能：

- ✅ **模板化生成**：灵活的模板系统，支持变量替换和条件渲染
- ✅ **增量更新**：智能差异检测，只更新变化部分
- ✅ **多种图表**：支持6种不同类型的紫微斗数图表
- ✅ **自定义主题**：4种内置主题，支持自定义主题创建
- ✅ **高性能**：缓存机制、优化算法、批量处理
- ✅ **易扩展**：模块化设计，支持自定义扩展

通过合理使用这些功能，可以显著提升紫微斗数图表的生成效率和视觉效果。