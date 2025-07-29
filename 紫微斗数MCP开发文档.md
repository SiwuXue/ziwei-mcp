# 紫微斗数 MCP 开发文档

## 项目概述

### 项目名称
紫微斗数 MCP (Ziwei Doushu Model Context Protocol)

### 项目描述
基于 MCP 协议的紫微斗数命理分析工具，提供完整的紫微斗数排盘、解盘、运势分析等功能。支持命盘生成、可视化、数据持久化、智能解读等全方位功能。

### 技术栈
- **运行环境**: Node.js 18+
- **开发语言**: JavaScript (CommonJS)
- **协议标准**: MCP (Model Context Protocol)
- **依赖管理**: npm
- **数据库**: SQLite3
- **核心依赖**: 
  - @modelcontextprotocol/sdk: MCP协议支持
  - lunar-javascript: 农历转换
  - date-fns: 日期处理
  - sqlite3: 数据持久化
  - uuid: 唯一标识生成
  - zod: 数据验证

## 项目架构

### 目录结构
```
ziwei-mcp/
├── .codebuddy/                   # 代码助手配置
├── .promptx/                     # PromptX配置
│   ├── pouch.json
│   └── resource/
│       └── project.registry.json
├── .vscode/                      # VS Code配置
│   └── settings.json
├── config/                       # 配置文件
│   ├── persistence-config.js    # 数据持久化配置
│   └── sqlite-config.js         # SQLite配置
├── data/                         # 数据存储
│   ├── backups/                 # 数据备份
│   ├── charts.db                # SQLite数据库
│   └── charts.db-journal        # SQLite日志
├── src/                          # 源代码
│   ├── core/                    # 核心模块
│   │   ├── calendar.js          # 农历转换
│   │   ├── chart-generator.js   # 命盘生成器
│   │   ├── data-persistence.js  # 数据持久化
│   │   ├── enhanced-chart-generator.js # 增强命盘生成器
│   │   ├── enhanced-svg-generator.js   # 增强SVG生成器
│   │   ├── integrated-svg-generator.js # 集成SVG生成器
│   │   ├── sqlite-persistence.js       # SQLite持久化
│   │   ├── svg-incremental-updater.js  # SVG增量更新器
│   │   ├── svg-template-manager.js     # SVG模板管理器
│   │   └── svg-theme-manager.js        # SVG主题管理器
│   ├── data/                    # 数据模块
│   │   └── stars-database.js    # 星曜数据库
│   ├── services/                # 服务模块
│   │   └── professional-data-service.js # 专业数据服务
│   ├── tools/                   # MCP工具实现
│   │   ├── career-guidance.js   # 职业指导工具
│   │   ├── chart-interpreter.js # 命盘解读工具
│   │   ├── chart-visualizer.js  # 命盘可视化工具
│   │   ├── compatibility-analyzer.js # 合婚分析工具
│   │   ├── date-selector.js     # 择日工具
│   │   ├── education-guidance.js # 教育指导工具
│   │   ├── enhanced-chart-generator-tool.js # 增强命盘生成工具
│   │   ├── enhanced-chart-visualizer.js     # 增强命盘可视化工具
│   │   ├── enhanced-svg-chart-tool.js       # 增强SVG命盘工具
│   │   ├── fortune-analyzer.js  # 运势分析工具
│   │   ├── health-analyzer.js   # 健康分析工具
│   │   ├── life-timeline.js     # 人生时间轴工具
│   │   ├── mcp-handler.js       # MCP处理器
│   │   ├── palace-analyzer.js   # 宫位分析工具
│   │   ├── persistent-chart-tool.js # 持久化命盘工具
│   │   └── relationship-analyzer.js # 人际关系分析工具
│   └── index.js                 # 主入口文件
├── sqlite-config-simple.js      # 简化SQLite配置
├── sqlite-quickstart.js         # SQLite快速启动脚本
├── package.json                 # 项目配置
├── package-lock.json            # 依赖锁定文件
├── README.md                    # 项目说明
├── SQLite部署指南.md            # SQLite部署指南
├── SVG生成器使用指南.md         # SVG生成器使用指南
└── 紫微斗数MCP开发文档.md       # 本开发文档
```

## 核心功能模块

### 1. 命盘生成 (Chart Generator)

#### 功能描述
根据出生时间、地点生成完整的紫微斗数命盘，支持数据持久化存储和多种输入格式。

#### 输入参数
```javascript
{
  "birth_year": 1990,        // 出生年份
  "birth_month": 5,          // 出生月份 (1-12)
  "birth_day": 15,           // 出生日期 (1-31)
  "birth_hour": 14,          // 出生小时 (0-23)
  "gender": "male",          // 性别: "male" 或 "female"
  "name": "张三",            // 姓名 (可选)
  "location": "北京",         // 出生地点 (可选)
  "calendar_type": "solar"   // 历法类型: "solar" 或 "lunar"
}
```

#### 输出结果
```javascript
{
  "chart_id": "uuid-string",     // 命盘唯一标识
  "basic_info": {
    "name": "张三",
    "birth_date": "1990-05-15",
    "birth_time": "14:00",
    "gender": "male",
    "location": "北京",
    "lunar_date": "庚午年四月廿一",
    "age": 34
  },
  "palaces": [                   // 十二宫信息
    {
      "name": "命宫",
      "position": 1,
      "earthly_branch": "子",
      "element": "水",
      "main_stars": ["紫微", "天府"],
      "minor_stars": ["左辅", "右弼"],
      "four_modernizations": ["化科"],
      "brightness": "庙"
    }
    // ... 其他11个宫位
  ],
  "stars": [                     // 星曜详细信息
    {
      "name": "紫微",
      "palace": "命宫",
      "position": 1,
      "brightness": "庙",
      "category": "主星",
      "element": "土",
      "influence": "positive"
    }
    // ... 其他星曜
  ],
  "four_pillars": {
    "year": "庚午",
    "month": "辛巳",
    "day": "癸酉",
    "hour": "辛未"
  },
  "destiny": {
    "life_palace": "命宫",
    "body_palace": "迁移宫",
    "main_element": "土",
    "fortune_direction": "顺行"
  },
  "metadata": {
    "created_at": "2024-01-01T12:00:00Z",
    "version": "1.0.0",
    "calculation_method": "traditional"
  }
}
```

### 2. 命盘解读 (interpret_chart)

#### 功能描述
- 基于星曜组合进行智能解读
- 分析性格特征、事业运势、感情状况
- 提供个性化的人生建议
- 支持多维度解读视角
- 结合传统理论与现代应用

#### 输入参数
```javascript
{
  "chart_id": "uuid-string",    // 命盘ID
  "interpretation_type": "comprehensive", // 解读类型
  "focus_areas": ["personality", "career", "relationship"] // 重点分析领域
}
```

#### 输出结果
```javascript
{
  "interpretation_id": "uuid-string",
  "chart_id": "uuid-string",
  "comprehensive_analysis": {
    "personality": {
      "traits": ["领导力强", "有责任感", "追求完美"],
      "strengths": ["决策能力", "组织能力"],
      "weaknesses": ["过于严格", "缺乏灵活性"],
      "description": "详细的性格分析文本..."
    },
    "career": {
      "suitable_fields": ["管理", "金融", "教育"],
      "career_peak": "30-40岁",
      "advice": "建议在管理岗位发展...",
      "description": "详细的事业分析文本..."
    },
    "relationship": {
      "marriage_timing": "25-30岁",
      "partner_traits": ["温和", "体贴", "有耐心"],
      "relationship_advice": "需要多沟通...",
      "description": "详细的感情分析文本..."
    },
    "wealth": {
      "wealth_source": "正财为主",
      "investment_advice": "稳健投资",
      "financial_peak": "35-45岁",
      "description": "详细的财运分析文本..."
    },
    "health": {
      "attention_areas": ["心血管", "消化系统"],
      "health_advice": "注意饮食规律...",
      "description": "详细的健康分析文本..."
    }
  },
  "palace_analysis": [
    {
      "palace_name": "命宫",
      "stars": ["紫微", "天府"],
      "interpretation": "命宫有紫微天府，主贵气...",
      "influence": "positive"
    }
    // ... 其他宫位分析
  ],
  "star_combinations": [
    {
      "combination": "紫微+天府",
      "meaning": "帝王之相，贵气天成",
      "influence": "major_positive"
    }
    // ... 其他星曜组合
  ],
  "metadata": {
    "generated_at": "2024-01-01T12:00:00Z",
    "interpretation_method": "traditional_modern_combined"
  }
}
```

### 3. 宫位分析 (Palace Analyzer)

#### 功能描述
分析特定宫位的星曜组合及其含义。

#### 输入参数
```javascript
interface PalaceAnalysisInput {
  chart: ZiweiChart;
  palaceName: string;       // 宫位名称
  analysisType: 'basic' | 'detailed' | 'fortune';
}
```

#### 输出结果
```javascript
interface PalaceAnalysis {
  palace: {
    name: string;
    position: number;
    element: string;
    stars: Star[];
  };
  interpretation: {
    summary: string;
    personality?: string;
    career?: string;
    wealth?: string;
    relationship?: string;
    health?: string;
  };
  starCombinations: {
    combination: string;
    meaning: string;
    influence: 'positive' | 'negative' | 'neutral';
  }[];
  suggestions: string[];
}
```

### 4. 运势分析 (analyze_fortune)

#### 功能描述
- 分析特定时间段的运势变化
- 支持年运、月运、日运分析
- 提供趋势预测和建议
- 结合大运、流年、流月分析

#### 输入参数
```javascript
{
  "chart_id": "uuid-string",    // 命盘ID
  "analysis_period": {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "period_type": "yearly"      // yearly, monthly, daily
  },
  "focus_areas": ["career", "wealth", "relationship", "health"]
}
```

#### 输出结果
```javascript
{
  "fortune_analysis_id": "uuid-string",
  "chart_id": "uuid-string",
  "period_info": {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "period_type": "yearly",
    "current_age": 34
  },
  "overall_fortune": {
    "score": 75,                  // 总体运势评分 (0-100)
    "trend": "ascending",         // 趋势: ascending, stable, descending
    "summary": "2024年整体运势上升...",
    "key_months": ["3月", "7月", "11月"] // 关键月份
  },
  "detailed_analysis": {
    "career": {
      "score": 80,
      "trend": "positive",
      "peak_period": "7-9月",
      "challenges": "上半年需注意人际关系",
      "opportunities": "下半年有升职机会",
      "advice": "积极表现，把握机会"
    },
    "wealth": {
      "score": 70,
      "trend": "stable",
      "income_forecast": "稳定增长",
      "investment_advice": "适合稳健投资",
      "attention_period": "4-6月需谨慎理财"
    },
    "relationship": {
      "score": 65,
      "trend": "fluctuating",
      "favorable_period": "春季和秋季",
      "challenges": "夏季需注意沟通",
      "advice": "多关心伴侣，避免争执"
    },
    "health": {
      "score": 78,
      "trend": "stable",
      "attention_areas": ["肠胃", "睡眠"],
      "favorable_period": "秋冬季节",
      "advice": "规律作息，适度运动"
    }
  },
  "monthly_breakdown": [
    {
      "month": "2024-01",
      "overall_score": 72,
      "highlights": ["事业有进展", "财运平稳"],
      "challenges": ["健康需注意"],
      "advice": "把握工作机会，注意身体"
    }
    // ... 其他月份
  ],
  "astrological_factors": {
    "current_major_period": "己亥大运",
    "fleeting_year": "甲辰年",
    "key_transits": ["流年化禄入命宫"],
    "influential_stars": ["流年太岁", "流年天马"]
  }
}
```

### 5. 运势预测 (Fortune Predictor)

#### 功能描述
计算并分析大运、流年、流月运势。

#### 输入参数
```javascript
interface FortuneInput {
  chart: ZiweiChart;
  targetDate: string;       // 目标日期
  period: 'year' | 'month' | 'day';
  aspects: string[];        // 分析方面
}
```

#### 输出结果
```javascript
interface FortuneAnalysis {
  period: {
    type: string;
    startDate: string;
    endDate: string;
  };
  overallFortune: {
    score: number;          // 总体运势评分 1-100
    trend: 'rising' | 'stable' | 'declining';
    summary: string;
  };
  aspects: {
    career: FortuneAspect;
    wealth: FortuneAspect;
    relationship: FortuneAspect;
    health: FortuneAspect;
    study: FortuneAspect;
  };
  keyEvents: {
    date: string;
    event: string;
    impact: 'positive' | 'negative';
  }[];
  suggestions: string[];
}
```

### 6. 合婚分析 (Compatibility)

#### 功能描述
分析两人的紫微斗数命盘匹配度。

#### 输入参数
```javascript
interface CompatibilityInput {
  chart1: ZiweiChart;
  chart2: ZiweiChart;
  analysisDepth: 'basic' | 'comprehensive';
}
```

#### 输出结果
```javascript
interface CompatibilityAnalysis {
  overallScore: number;     // 总体匹配度 1-100
  compatibility: {
    personality: number;
    career: number;
    wealth: number;
    family: number;
    communication: number;
  };
  strengths: string[];
  challenges: string[];
  suggestions: string[];
  marriageAdvice: {
    bestMarriageTime: string[];
    precautions: string[];
  };
}
```

### 7. AI智能解盘 (Intelligent Interpretation)

#### 功能描述
基于AI技术提供个性化的深度命盘解析，结合现代心理学和传统命理学。

#### 输入参数
```javascript
interface IntelligentInterpretationInput {
  chart: ZiweiChart;
  focusAreas: string[];     // 重点分析领域
  lifeStage: string;        // 人生阶段
  currentConcerns: string[]; // 当前关注问题
}
```

#### 输出结果
```javascript
interface IntelligentAnalysis {
  personalityProfile: {
    coreTraits: string[];
    strengths: string[];
    challenges: string[];
    developmentSuggestions: string[];
  };
  lifeGuidance: {
    currentPhase: string;
    opportunities: string[];
    risks: string[];
    actionPlan: string[];
  };
  customizedAdvice: {
    area: string;
    analysis: string;
    recommendations: string[];
  }[];
}
```

### 8. 人生时间轴分析 (Life Timeline)

#### 功能描述
分析人生各个阶段的运势变化，提供详细的时间维度分析。

#### 输入参数
```javascript
interface LifeTimelineInput {
  chart: ZiweiChart;
  startAge: number;
  endAge: number;
  analysisGranularity: 'decade' | 'year' | 'month';
}
```

#### 输出结果
```javascript
interface LifeTimelineAnalysis {
  timeline: {
    period: string;
    age: number;
    fortuneScore: number;
    keyEvents: string[];
    opportunities: string[];
    challenges: string[];
    advice: string[];
  }[];
  majorTransitions: {
    age: number;
    description: string;
    preparation: string[];
  }[];
  overallTrends: {
    career: string;
    wealth: string;
    relationship: string;
    health: string;
  };
}
```

### 9. 人际关系分析 (Relationship Analysis)

#### 功能描述
分析个人的人际关系模式和社交特征。

#### 输入参数
```javascript
interface RelationshipAnalysisInput {
  chart: ZiweiChart;
  relationshipType: string;
  targetPersonChart?: ZiweiChart;
  analysisAspects: string[];
}
```

#### 输出结果
```javascript
interface RelationshipAnalysis {
  relationshipStyle: {
    communicationPattern: string;
    conflictResolution: string;
    emotionalExpression: string;
    trustBuilding: string;
  };
  compatibility: {
    score: number;
    strengths: string[];
    challenges: string[];
  };
  improvementSuggestions: {
    area: string;
    strategies: string[];
  }[];
}
```

### 10. 职业发展指导 (Career Guidance)

#### 功能描述
基于命盘特征提供专业的职业发展建议和决策支持。

#### 输入参数
```javascript
interface CareerGuidanceInput {
  chart: ZiweiChart;
  currentAge: number;
  careerStage: string;
  industries: string[];
  decisionType: string;
}
```

#### 输出结果
```javascript
interface CareerGuidanceAnalysis {
  careerAptitude: {
    suitableIndustries: string[];
    workStyle: string;
    leadershipPotential: string;
    entrepreneurialSpirit: string;
  };
  currentPhaseAnalysis: {
    opportunities: string[];
    challenges: string[];
    optimalTiming: string[];
  };
  decisionSupport: {
    recommendation: string;
    reasoning: string[];
    riskAssessment: string;
    successFactors: string[];
  };
}
```

### 11. 择日功能 (Auspicious Date Selection)

#### 功能描述
根据个人命盘选择适合的吉日良辰。

#### 输入参数
```javascript
interface DateSelectionInput {
  chart: ZiweiChart;
  eventType: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  timePreference: string;
  priority: string;
}
```

#### 输出结果
```javascript
interface DateSelectionResult {
  recommendedDates: {
    date: string;
    time: string;
    score: number;
    reasoning: string[];
  }[];
  avoidDates: {
    date: string;
    reason: string;
  }[];
  generalGuidelines: string[];
}
```

### 12. 命盘可视化 (Chart Visualization)

#### 功能描述
生成各种形式的命盘可视化图表。

#### 输入参数
```javascript
interface VisualizationInput {
  chart: ZiweiChart;
  visualizationType: string;
  includeElements: string[];
  colorScheme: string;
  outputFormat: string;
}
```

#### 输出结果
```javascript
interface VisualizationResult {
  imageData: string;        // Base64编码的图像数据
  metadata: {
    format: string;
    dimensions: {
      width: number;
      height: number;
    };
    elements: string[];
  };
  downloadUrl?: string;
}
```

### 13. 健康分析 (Health Analysis)

#### 功能描述
基于命盘分析健康趋势和养生建议。

#### 输入参数
```javascript
interface HealthAnalysisInput {
  chart: ZiweiChart;
  currentAge: number;
  healthConcerns: string[];
  analysisType: string;
}
```

#### 输出结果
```javascript
interface HealthAnalysis {
  healthProfile: {
    constitution: string;
    vulnerabilities: string[];
    strengths: string[];
  };
  riskAssessment: {
    period: string;
    risks: string[];
    preventiveMeasures: string[];
  }[];
  wellnessRecommendations: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
    mentalHealth: string[];
  };
}
```

### 14. 命盘图像生成 (get_chart_image)

#### 功能描述
- 生成高质量的紫微斗数命盘图像
- 支持多种主题和样式
- 可自定义颜色、字体、布局
- 支持SVG和PNG格式输出
- 适合打印和数字展示

#### 输入参数
```javascript
{
  "chart_id": "uuid-string",    // 命盘ID
  "image_options": {
    "format": "svg",            // 图像格式: svg, png
    "theme": "traditional",     // 主题: traditional, modern, elegant
    "size": "large",           // 尺寸: small, medium, large
    "include_interpretations": true, // 是否包含解读文字
    "color_scheme": "classic",  // 配色方案
    "font_style": "traditional" // 字体样式
  }
}
```

#### 输出结果
```javascript
{
  "image_id": "uuid-string",
  "chart_id": "uuid-string",
  "image_data": {
    "format": "svg",
    "content": "<svg>...</svg>", // SVG内容或base64编码
    "width": 800,
    "height": 800,
    "file_size": "45KB"
  },
  "generation_options": {
    "theme": "traditional",
    "color_scheme": "classic",
    "include_stars": true,
    "include_palaces": true,
    "include_elements": true
  },
  "metadata": {
    "generated_at": "2024-01-01T12:00:00Z",
    "generator_version": "2.0.0",
    "rendering_time": "1.2s"
  }
}
```

### 15. 星曜信息查询 (get_star_info)

#### 功能描述
- 查询特定星曜的详细信息
- 提供星曜属性、含义、影响
- 支持星曜组合分析
- 包含传统和现代解释

#### 输入参数
```javascript
{
  "star_name": "紫微",          // 星曜名称
  "context": {
    "palace": "命宫",           // 所在宫位 (可选)
    "brightness": "庙",        // 亮度 (可选)
    "other_stars": ["天府"]    // 同宫其他星曜 (可选)
  }
}
```

#### 输出结果
```javascript
{
  "star_info": {
    "name": "紫微",
    "category": "主星",
    "element": "土",
    "yin_yang": "阳",
    "brightness_levels": ["庙", "旺", "得地", "利益", "平和", "不得地", "陷"],
    "basic_meaning": "帝王星，主贵气、领导力",
    "personality_traits": [
      "领导能力强",
      "有责任感",
      "追求完美",
      "重视名誉"
    ],
    "career_influence": "适合管理、领导岗位",
    "relationship_influence": "在感情中较为主导",
    "wealth_influence": "财运稳定，多为正财",
    "health_influence": "注意心血管系统"
  },
  "contextual_analysis": {
    "in_palace": "命宫",
    "brightness": "庙",
    "palace_influence": "在命宫庙旺，主一生贵气...",
    "brightness_effect": "庙旺状态下，正面特质充分发挥...",
    "combination_effects": [
      {
        "with_star": "天府",
        "effect": "紫微天府同宫，帝王之相，主大贵",
        "influence_level": "very_positive"
      }
    ]
  },
  "traditional_interpretation": "紫微为北斗主星，化气为尊...",
  "modern_interpretation": "在现代社会中，紫微星代表管理才能..."
}
```

### 16. 宫位信息查询 (get_palace_info)

#### 功能描述
- 查询特定宫位的详细信息
- 提供宫位含义、主管事项
- 分析宫位内星曜配置
- 包含吉凶判断和建议

#### 输入参数
```javascript
{
  "palace_name": "命宫",       // 宫位名称
  "chart_context": {
    "chart_id": "uuid-string", // 命盘ID (可选)
    "stars_in_palace": ["紫微", "天府"], // 宫内星曜 (可选)
    "palace_position": 1        // 宫位位置 (可选)
  }
}
```

#### 输出结果
```javascript
{
  "palace_info": {
    "name": "命宫",
    "alternative_names": ["本命宫", "生命宫"],
    "primary_meanings": [
      "个人性格特质",
      "先天禀赋",
      "人生格局",
      "基本运势"
    ],
    "life_aspects": {
      "personality": "主导个人性格形成",
      "destiny": "决定人生基本格局",
      "fortune": "影响整体运势走向",
      "relationships": "影响人际交往方式"
    },
    "analysis_focus": [
      "主星组合",
      "四化星影响",
      "辅星配置",
      "宫位三方四正"
    ]
  },
  "contextual_analysis": {
    "stars_analysis": [
      {
        "star": "紫微",
        "influence": "主贵气，增强领导能力",
        "effect_level": "major_positive"
      },
      {
        "star": "天府",
        "influence": "主财库，增强稳定性",
        "effect_level": "positive"
      }
    ],
    "overall_assessment": {
      "strength_level": "very_strong",
      "fortune_trend": "ascending",
      "key_characteristics": ["贵气", "稳重", "有领导力"],
      "potential_challenges": ["过于严格", "缺乏变通"]
    },
    "three_directions_analysis": {
      "opposite_palace": "迁移宫",
      "supporting_palaces": ["官禄宫", "财帛宫"],
      "combined_influence": "三方四正配置良好，主事业财运俱佳"
    }
  },
  "traditional_interpretation": "命宫为十二宫之首，主一生格局...",
  "practical_guidance": {
    "strengths_to_develop": ["发挥领导才能", "建立权威地位"],
    "areas_to_improve": ["增强灵活性", "学会倾听他人"],
    "life_advice": ["适合从事管理工作", "注重个人修养"]
  }
}
```

### 17. 教育指导 (Educational Guidance)

#### 功能描述
为学生提供个性化的教育和学习指导。

#### 输入参数
```javascript
interface EducationGuidanceInput {
  chart: ZiweiChart;
  studentAge: number;
  educationLevel: string;
  subjectAreas: string[];
  guidanceType: string;
}
```

#### 输出结果
```javascript
interface EducationGuidanceResult {
  learningProfile: {
    learningStyle: string;
    strengths: string[];
    challenges: string[];
    motivation: string;
  };
  subjectRecommendations: {
    subject: string;
    aptitude: number;
    studyMethods: string[];
  }[];
  careerPathSuggestions: {
    field: string;
    suitability: number;
    requirements: string[];
  }[];
}
```

## MCP 工具定义

### 1. generate_ziwei_chart
```json
{
  "name": "generate_ziwei_chart",
  "description": "根据出生信息生成紫微斗数命盘",
  "inputSchema": {
    "type": "object",
    "properties": {
      "birthDate": {
        "type": "string",
        "description": "出生日期，格式：YYYY-MM-DD"
      },
      "birthTime": {
        "type": "string",
        "description": "出生时间，格式：HH:mm"
      },
      "gender": {
        "type": "string",
        "enum": ["male", "female"],
        "description": "性别"
      },
      "calendar": {
        "type": "string",
        "enum": ["solar", "lunar"],
        "default": "solar",
        "description": "历法类型"
      }
    },
    "required": ["birthDate", "birthTime", "gender"]
  }
}
```

### 2. analyze_palace
```json
{
  "name": "analyze_palace",
  "description": "分析紫微斗数命盘中特定宫位",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID（由generate_ziwei_chart返回）"
      },
      "palaceName": {
        "type": "string",
        "enum": ["命宫", "兄弟宫", "夫妻宫", "子女宫", "财帛宫", "疾厄宫", "迁移宫", "奴仆宫", "官禄宫", "田宅宫", "福德宫", "父母宫"],
        "description": "要分析的宫位名称"
      },
      "analysisType": {
        "type": "string",
        "enum": ["basic", "detailed"],
        "default": "basic",
        "description": "分析深度"
      }
    },
    "required": ["chartId", "palaceName"]
  }
}
```

### 3. predict_fortune
```json
{
  "name": "predict_fortune",
  "description": "预测运势（大运、流年、流月）",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "targetDate": {
        "type": "string",
        "description": "目标日期，格式：YYYY-MM-DD"
      },
      "period": {
        "type": "string",
        "enum": ["year", "month"],
        "default": "year",
        "description": "预测周期"
      },
      "aspects": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["career", "wealth", "relationship", "health", "study"]
        },
        "description": "要分析的运势方面"
      }
    },
    "required": ["chartId", "targetDate"]
  }
}
```

### 4. analyze_compatibility
```json
{
  "name": "analyze_compatibility",
  "description": "分析两人合婚匹配度",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chart1Id": {
        "type": "string",
        "description": "第一人命盘ID"
      },
      "chart2Id": {
        "type": "string",
        "description": "第二人命盘ID"
      },
      "analysisDepth": {
        "type": "string",
        "enum": ["basic", "comprehensive"],
        "default": "basic",
        "description": "分析深度"
      }
    },
    "required": ["chart1Id", "chart2Id"]
  }
}
```

### 5. intelligent_interpretation
```json
{
  "name": "intelligent_interpretation",
  "description": "AI智能解盘，提供个性化深度分析",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "focusAreas": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["personality", "career", "wealth", "relationship", "health", "family", "education"]
        },
        "description": "重点分析领域"
      },
      "lifeStage": {
        "type": "string",
        "enum": ["youth", "adult", "middle-age", "elderly"],
        "description": "人生阶段"
      },
      "currentConcerns": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "当前关注的问题"
      }
    },
    "required": ["chartId"]
  }
}
```

### 6. analyze_life_timeline
```json
{
  "name": "analyze_life_timeline",
  "description": "分析人生时间轴，包括大运流年详细分析",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "startAge": {
        "type": "number",
        "minimum": 0,
        "maximum": 120,
        "description": "起始年龄"
      },
      "endAge": {
        "type": "number",
        "minimum": 0,
        "maximum": 120,
        "description": "结束年龄"
      },
      "analysisGranularity": {
        "type": "string",
        "enum": ["decade", "year", "month"],
        "default": "year",
        "description": "分析粒度"
      }
    },
    "required": ["chartId", "startAge", "endAge"]
  }
}
```

### 7. analyze_relationships
```json
{
  "name": "analyze_relationships",
  "description": "分析人际关系，包括家庭、朋友、同事等",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "relationshipType": {
        "type": "string",
        "enum": ["family", "romantic", "friendship", "business", "mentor"],
        "description": "关系类型"
      },
      "targetPersonChart": {
        "type": "string",
        "description": "对方命盘ID（可选）"
      },
      "analysisAspects": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["communication", "trust", "conflict_resolution", "mutual_support", "growth_potential"]
        },
        "description": "分析维度"
      }
    },
    "required": ["chartId", "relationshipType"]
  }
}
```

### 8. career_guidance
```json
{
  "name": "career_guidance",
  "description": "职业发展指导和决策支持",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "currentAge": {
        "type": "number",
        "minimum": 16,
        "maximum": 70,
        "description": "当前年龄"
      },
      "careerStage": {
        "type": "string",
        "enum": ["student", "entry-level", "mid-career", "senior", "executive", "entrepreneur"],
        "description": "职业阶段"
      },
      "industries": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "感兴趣的行业"
      },
      "decisionType": {
        "type": "string",
        "enum": ["career_change", "job_selection", "promotion", "entrepreneurship", "retirement"],
        "description": "决策类型"
      }
    },
    "required": ["chartId", "currentAge", "careerStage"]
  }
}
```

### 9. select_auspicious_date
```json
{
  "name": "select_auspicious_date",
  "description": "择日功能，选择吉日良辰",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "eventType": {
        "type": "string",
        "enum": ["wedding", "business_opening", "moving", "travel", "investment", "surgery", "contract_signing"],
        "description": "事件类型"
      },
      "dateRange": {
        "type": "object",
        "properties": {
          "startDate": {
            "type": "string",
            "description": "开始日期 YYYY-MM-DD"
          },
          "endDate": {
            "type": "string",
            "description": "结束日期 YYYY-MM-DD"
          }
        },
        "required": ["startDate", "endDate"]
      },
      "timePreference": {
        "type": "string",
        "enum": ["morning", "afternoon", "evening", "any"],
        "default": "any",
        "description": "时间偏好"
      },
      "priority": {
        "type": "string",
        "enum": ["best_only", "good_dates", "avoid_bad"],
        "default": "good_dates",
        "description": "选择优先级"
      }
    },
    "required": ["chartId", "eventType", "dateRange"]
  }
}
```

### 10. generate_chart_visualization
```json
{
  "name": "generate_chart_visualization",
  "description": "生成命盘可视化图表",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "visualizationType": {
        "type": "string",
        "enum": ["traditional_chart", "modern_wheel", "palace_grid", "star_map", "fortune_timeline"],
        "default": "traditional_chart",
        "description": "可视化类型"
      },
      "includeElements": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["main_stars", "auxiliary_stars", "palace_names", "elements", "earthly_branches", "fortune_periods"]
        },
        "description": "包含的元素"
      },
      "colorScheme": {
        "type": "string",
        "enum": ["traditional", "modern", "colorful", "monochrome"],
        "default": "traditional",
        "description": "配色方案"
      },
      "outputFormat": {
        "type": "string",
        "enum": ["svg", "png", "pdf", "html"],
        "default": "svg",
        "description": "输出格式"
      }
    },
    "required": ["chartId"]
  }
}
```

### 11. health_analysis
```json
{
  "name": "health_analysis",
  "description": "健康分析和养生建议",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "currentAge": {
        "type": "number",
        "minimum": 0,
        "maximum": 120,
        "description": "当前年龄"
      },
      "healthConcerns": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["cardiovascular", "digestive", "respiratory", "nervous", "musculoskeletal", "mental_health"]
        },
        "description": "健康关注点"
      },
      "analysisType": {
        "type": "string",
        "enum": ["prevention", "current_issues", "long_term_trends"],
        "default": "prevention",
        "description": "分析类型"
      }
    },
    "required": ["chartId", "currentAge"]
  }
}
```

### 12. educational_guidance
```json
{
  "name": "educational_guidance",
  "description": "教育和学习指导",
  "inputSchema": {
    "type": "object",
    "properties": {
      "chartId": {
        "type": "string",
        "description": "命盘ID"
      },
      "studentAge": {
        "type": "number",
        "minimum": 3,
        "maximum": 30,
        "description": "学生年龄"
      },
      "educationLevel": {
        "type": "string",
        "enum": ["preschool", "elementary", "middle_school", "high_school", "university", "graduate"],
        "description": "教育阶段"
      },
      "subjectAreas": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["mathematics", "sciences", "languages", "arts", "social_studies", "technology", "sports"]
        },
        "description": "学科领域"
      },
      "guidanceType": {
        "type": "string",
        "enum": ["aptitude_assessment", "study_methods", "career_planning", "exam_preparation"],
        "description": "指导类型"
      }
    },
    "required": ["chartId", "studentAge", "educationLevel"]
  }
}
```

## 技术实现详解

### 核心算法实现

#### 1. 农历转换算法
基于 `lunar-javascript` 库实现高精度农历转换：

```javascript
const Lunar = require('lunar-javascript');
const { Solar } = require('lunar-javascript');

class LunarCalendar {
  // 公历转农历
  static solarToLunar(year, month, day, hour = 0) {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      hour: lunar.getHour(),
      yearInChinese: lunar.getYearInChinese(),
      monthInChinese: lunar.getMonthInChinese(),
      dayInChinese: lunar.getDayInChinese(),
      timeInChinese: lunar.getTimeInChinese()
    };
  }
  
  // 获取干支信息
  static getGanZhi(year, month, day, hour) {
    const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
    const lunar = solar.getLunar();
    
    return {
      yearGanZhi: lunar.getYearInGanZhi(),
      monthGanZhi: lunar.getMonthInGanZhi(),
      dayGanZhi: lunar.getDayInGanZhi(),
      hourGanZhi: lunar.getTimeInGanZhi()
    };
  }
}
```

#### 2. 星曜定位算法
实现传统紫微斗数星曜定位逻辑：

```javascript
class StarCalculator {
  // 紫微星定位算法
  static calculateZiweiPosition(lunarDay, hour) {
    // 紫微星定位口诀：寅宫起初一，顺数至生日
    const basePosition = 2; // 寅宫为2
    return ((basePosition + lunarDay - 1) % 12) || 12;
  }
  
  // 天府星定位算法
  static calculateTianfuPosition(ziweiPosition) {
    // 天府星与紫微星相对
    return ((ziweiPosition + 6 - 1) % 12) + 1;
  }
  
  // 计算十四主星位置
  static calculateMainStars(ziweiPos, tianfuPos) {
    const stars = {};
    
    // 紫微系星曜
    stars['紫微'] = ziweiPos;
    stars['天机'] = (ziweiPos % 12) + 1;
    stars['太阳'] = (ziweiPos + 1) % 12 + 1;
    stars['武曲'] = (ziweiPos + 2) % 12 + 1;
    stars['天同'] = (ziweiPos + 3) % 12 + 1;
    stars['廉贞'] = (ziweiPos + 4) % 12 + 1;
    
    // 天府系星曜
    stars['天府'] = tianfuPos;
    stars['太阴'] = (tianfuPos % 12) + 1;
    stars['贪狼'] = (tianfuPos + 1) % 12 + 1;
    stars['巨门'] = (tianfuPos + 2) % 12 + 1;
    stars['天相'] = (tianfuPos + 3) % 12 + 1;
    stars['天梁'] = (tianfuPos + 4) % 12 + 1;
    stars['七杀'] = (tianfuPos + 5) % 12 + 1;
    stars['破军'] = (tianfuPos + 6) % 12 + 1;
    
    return stars;
  }
}
```

#### 3. 宫位系统实现
```javascript
class PalaceSystem {
  // 确定命宫位置
  static getDestinyPalace(birthMonth, birthHour) {
    // 命宫定位：寅宫起正月，顺数至生月，再从生月宫起子时，顺数至生时
    const monthPosition = ((birthMonth - 1 + 2) % 12) + 1; // 寅宫起正月
    const hourIndex = Math.floor((birthHour + 1) / 2) % 12; // 时辰转换
    return ((monthPosition + hourIndex - 1) % 12) + 1;
  }
  
  // 确定身宫位置
  static getBodyPalace(birthMonth, birthHour) {
    // 身宫定位：寅宫起正月，逆数至生月，再从生月宫起子时，顺数至生时
    const monthPosition = ((2 - birthMonth + 12) % 12) + 1;
    const hourIndex = Math.floor((birthHour + 1) / 2) % 12;
    return ((monthPosition + hourIndex - 1) % 12) + 1;
  }
  
  // 排列十二宫
  static arrangePalaces(destinyPalace) {
    const palaceNames = [
      '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
      '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
    ];
    
    const palaces = [];
    for (let i = 0; i < 12; i++) {
      const position = ((destinyPalace + i - 1) % 12) + 1;
      palaces.push({
        name: palaceNames[i],
        position: position,
        earthlyBranch: this.getEarthlyBranch(position),
        element: this.getElement(position)
      });
    }
    
    return palaces;
  }
  
  // 获取地支
  static getEarthlyBranch(position) {
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return branches[(position - 1) % 12];
  }
  
  // 获取五行属性
  static getElement(position) {
    const elements = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
    return elements[(position - 1) % 12];
  }
}
```

### 数据持久化实现

#### SQLite数据库配置
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseManager {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/charts.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.initTables();
  }
  
  initTables() {
    // 创建命盘表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS charts (
        id TEXT PRIMARY KEY,
        name TEXT,
        birth_year INTEGER NOT NULL,
        birth_month INTEGER NOT NULL,
        birth_day INTEGER NOT NULL,
        birth_hour INTEGER NOT NULL,
        gender TEXT NOT NULL,
        location TEXT,
        lunar_date TEXT,
        chart_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建解读记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS interpretations (
        id TEXT PRIMARY KEY,
        chart_id TEXT NOT NULL,
        interpretation_type TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chart_id) REFERENCES charts(id)
      )
    `);
  }
  
  // 保存命盘
  async saveChart(chartData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO charts (id, name, birth_year, birth_month, birth_day, 
                           birth_hour, gender, location, lunar_date, chart_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        chartData.chart_id,
        chartData.basic_info.name,
        chartData.basic_info.birth_year,
        chartData.basic_info.birth_month,
        chartData.basic_info.birth_day,
        chartData.basic_info.birth_hour,
        chartData.basic_info.gender,
        chartData.basic_info.location,
        chartData.basic_info.lunar_date,
        JSON.stringify(chartData)
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }
  
  // 获取命盘
  async getChart(chartId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM charts WHERE id = ?',
        [chartId],
        (err, row) => {
          if (err) reject(err);
          else if (row) {
            resolve({
              ...row,
              chart_data: JSON.parse(row.chart_data)
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }
}
```

### MCP服务器架构实现

#### 主入口文件 (index.js)
```javascript
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { z } = require('zod');

const ChartGenerator = require('./src/core/chart-generator');
const ChartInterpreter = require('./src/core/chart-interpreter');
const FortuneAnalyzer = require('./src/core/fortune-analyzer');
const DatabaseManager = require('./src/data/database-manager');

class ZiweiMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ziwei-doushu-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.chartGenerator = new ChartGenerator();
    this.chartInterpreter = new ChartInterpreter();
    this.fortuneAnalyzer = new FortuneAnalyzer();
    this.dbManager = new DatabaseManager();
    
    this.setupHandlers();
  }
  
  setupHandlers() {
    // 工具列表处理
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_chart',
            description: '生成紫微斗数命盘',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: '姓名' },
                birth_year: { type: 'number', description: '出生年份' },
                birth_month: { type: 'number', description: '出生月份' },
                birth_day: { type: 'number', description: '出生日期' },
                birth_hour: { type: 'number', description: '出生时辰(0-23)' },
                gender: { type: 'string', enum: ['male', 'female'], description: '性别' },
                location: { type: 'string', description: '出生地点' }
              },
              required: ['birth_year', 'birth_month', 'birth_day', 'birth_hour', 'gender']
            }
          },
          {
            name: 'interpret_chart',
            description: '解读紫微斗数命盘',
            inputSchema: {
              type: 'object',
              properties: {
                chart_id: { type: 'string', description: '命盘ID' },
                interpretation_type: { 
                  type: 'string', 
                  enum: ['basic', 'detailed', 'fortune', 'career', 'relationship'],
                  description: '解读类型' 
                }
              },
              required: ['chart_id', 'interpretation_type']
            }
          },
          {
            name: 'analyze_fortune',
            description: '分析运势',
            inputSchema: {
              type: 'object',
              properties: {
                chart_id: { type: 'string', description: '命盘ID' },
                year: { type: 'number', description: '分析年份' },
                analysis_type: { 
                  type: 'string', 
                  enum: ['yearly', 'monthly', 'daily'],
                  description: '分析类型' 
                }
              },
              required: ['chart_id', 'year', 'analysis_type']
            }
          },
          {
            name: 'get_star_info',
            description: '获取星曜信息',
            inputSchema: {
              type: 'object',
              properties: {
                star_name: { type: 'string', description: '星曜名称' }
              },
              required: ['star_name']
            }
          },
          {
            name: 'get_palace_info',
            description: '获取宫位信息',
            inputSchema: {
              type: 'object',
              properties: {
                palace_name: { type: 'string', description: '宫位名称' }
              },
              required: ['palace_name']
            }
          },
          {
            name: 'get_chart_image',
            description: '生成命盘图像',
            inputSchema: {
              type: 'object',
              properties: {
                chart_id: { type: 'string', description: '命盘ID' },
                format: { 
                  type: 'string', 
                  enum: ['svg', 'png'],
                  default: 'svg',
                  description: '图像格式' 
                },
                style: { 
                  type: 'string', 
                  enum: ['traditional', 'modern', 'simple'],
                  default: 'traditional',
                  description: '图像风格' 
                }
              },
              required: ['chart_id']
            }
          }
        ]
      };
    });
    
    // 工具调用处理
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'generate_chart':
            return await this.handleGenerateChart(args);
          case 'interpret_chart':
            return await this.handleInterpretChart(args);
          case 'analyze_fortune':
            return await this.handleAnalyzeFortune(args);
          case 'get_star_info':
            return await this.handleGetStarInfo(args);
          case 'get_palace_info':
            return await this.handleGetPalaceInfo(args);
          case 'get_chart_image':
            return await this.handleGetChartImage(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.message}`
          }],
          isError: true
        };
      }
    });
  }
  
  async handleGenerateChart(args) {
    const chart = await this.chartGenerator.generateChart(args);
    await this.dbManager.saveChart(chart);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(chart, null, 2)
      }]
    };
  }
  
  async handleInterpretChart(args) {
    const interpretation = await this.chartInterpreter.interpretChart(
      args.chart_id, 
      args.interpretation_type
    );
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(interpretation, null, 2)
      }]
    };
  }
  
  async handleAnalyzeFortune(args) {
    const analysis = await this.fortuneAnalyzer.analyzeFortune(
      args.chart_id,
      args.year,
      args.analysis_type
    );
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(analysis, null, 2)
      }]
    };
  }
  
  async handleGetStarInfo(args) {
    const starInfo = await this.chartGenerator.getStarInfo(args.star_name);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(starInfo, null, 2)
      }]
    };
  }
  
  async handleGetPalaceInfo(args) {
    const palaceInfo = await this.chartGenerator.getPalaceInfo(args.palace_name);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(palaceInfo, null, 2)
      }]
    };
  }
  
  async handleGetChartImage(args) {
    const imageData = await this.chartGenerator.generateChartImage(
      args.chart_id,
      args.format,
      args.style
    );
    
    return {
      content: [{
        type: 'text',
        text: imageData
      }]
    };
  }
  
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Ziwei Doushu MCP server running on stdio');
  }
}

// 启动服务器
const server = new ZiweiMCPServer();
server.run().catch(console.error);

module.exports = ZiweiMCPServer;
```

### API使用示例

#### 1. 生成命盘示例
```javascript
// 调用generate_chart工具
const chartRequest = {
  name: "张三",
  birth_year: 1990,
  birth_month: 5,
  birth_day: 15,
  birth_hour: 14,
  gender: "male",
  location: "北京"
};

// 返回的命盘数据
const chartResponse = {
  chart_id: "chart_1234567890",
  basic_info: {
    name: "张三",
    birth_year: 1990,
    birth_month: 5,
    birth_day: 15,
    birth_hour: 14,
    gender: "male",
    location: "北京",
    lunar_date: "庚午年四月廿一日未时"
  },
  palaces: [
    {
      name: "命宫",
      position: 7,
      earthly_branch: "午",
      element: "火",
      main_stars: ["紫微", "天府"],
      minor_stars: ["左辅", "文昌"],
      four_transform: ["化权"]
    }
    // ... 其他11个宫位
  ],
  stars: {
    "紫微": { palace: "命宫", brightness: "庙", description: "帝星，主贵" },
    "天府": { palace: "命宫", brightness: "旺", description: "财库之星" }
    // ... 其他星曜
  }
};
```

#### 2. 命盘解读示例
```javascript
// 调用interpret_chart工具
const interpretRequest = {
  chart_id: "chart_1234567890",
  interpretation_type: "basic"
};

// 返回的解读结果
const interpretResponse = {
  interpretation_id: "interp_1234567890",
  chart_id: "chart_1234567890",
  interpretation_type: "basic",
  content: {
    personality: "紫微天府在命宫，性格稳重，具有领导才能...",
    career: "适合从事管理、金融、政府等行业...",
    wealth: "财运稳定，有积累财富的能力...",
    relationship: "感情专一，婚姻稳定...",
    health: "体质较好，注意心血管健康..."
  },
  created_at: "2024-01-15T10:30:00Z"
};
```

#### 3. 运势分析示例
```javascript
// 调用analyze_fortune工具
const fortuneRequest = {
  chart_id: "chart_1234567890",
  year: 2024,
  analysis_type: "yearly"
};

// 返回的运势分析
const fortuneResponse = {
  analysis_id: "fortune_1234567890",
  chart_id: "chart_1234567890",
  year: 2024,
  analysis_type: "yearly",
  fortune_analysis: {
    overall_score: 75,
    career_fortune: {
      score: 80,
      description: "事业运势较好，有升职加薪的机会",
      advice: "把握机会，积极表现"
    },
    wealth_fortune: {
      score: 70,
      description: "财运平稳，投资需谨慎",
      advice: "稳健理财，避免高风险投资"
    },
    relationship_fortune: {
      score: 75,
      description: "感情运势稳定，单身者有桃花运",
      advice: "珍惜身边人，主动表达"
    },
    health_fortune: {
      score: 65,
      description: "健康状况一般，注意休息",
      advice: "规律作息，适量运动"
    }
  },
  lucky_months: [3, 6, 9],
  unlucky_months: [1, 7],
  created_at: "2024-01-15T10:30:00Z"
};
```

## 数据结构设计

### 星曜数据结构
```javascript
interface Star {
  id: string;
  name: string;
  type: 'main' | 'auxiliary' | 'minor';
  category: string;
  element: string;
  brightness: 'bright' | 'normal' | 'dim';
  position: number;         // 所在宫位 1-12
  influence: {
    positive: string[];
    negative: string[];
  };
  combinations: {
    withStar: string;
    effect: string;
  }[];
}
```

### 宫位数据结构
```javascript
interface Palace {
  id: number;              // 宫位序号 1-12
  name: string;            // 宫位名称
  element: string;         // 五行属性
  earthlyBranch: string;   // 地支
  stars: Star[];           // 宫内星曜
  aspects: {
    career: number;
    wealth: number;
    relationship: number;
    health: number;
  };
}
```

## 开发规范

### 代码规范

#### ESLint 配置 (.eslintrc.js)
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error'
  }
};
```

#### Prettier 配置 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 命名规范
- **文件命名**: 使用 kebab-case (如: `chart-generator.js`)
- **类命名**: 使用 PascalCase (如: `ChartGenerator`)
- **函数/变量命名**: 使用 camelCase (如: `generateChart`)
- **常量命名**: 使用 UPPER_SNAKE_CASE (如: `MAX_RETRY_COUNT`)
- **私有方法**: 使用下划线前缀 (如: `_calculatePosition`)

#### JSDoc 注释规范
```javascript
/**
 * 生成紫微斗数命盘
 * @param {Object} birthData - 出生信息
 * @param {string} birthData.name - 姓名
 * @param {number} birthData.birth_year - 出生年份
 * @param {number} birthData.birth_month - 出生月份
 * @param {number} birthData.birth_day - 出生日期
 * @param {number} birthData.birth_hour - 出生时辰
 * @param {string} birthData.gender - 性别 ('male' | 'female')
 * @param {string} [birthData.location] - 出生地点
 * @returns {Promise<Object>} 命盘数据
 * @throws {ValidationError} 当输入数据无效时
 * @example
 * const chart = await generateChart({
 *   name: '张三',
 *   birth_year: 1990,
 *   birth_month: 5,
 *   birth_day: 15,
 *   birth_hour: 14,
 *   gender: 'male'
 * });
 */
async generateChart(birthData) {
  // 实现代码
}
```

### 测试规范

#### Jest 配置 (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/data/migrations/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

#### 测试文件结构
```
tests/
├── unit/                 # 单元测试
│   ├── core/
│   │   ├── chart-generator.test.js
│   │   └── chart-interpreter.test.js
│   └── services/
├── integration/          # 集成测试
│   ├── api.test.js
│   └── database.test.js
├── fixtures/            # 测试数据
│   ├── sample-charts.json
│   └── test-data.json
└── setup.js            # 测试环境设置
```

#### 测试示例
```javascript
// chart-generator.test.js
const ChartGenerator = require('../../src/core/chart-generator');
const { sampleBirthData } = require('../fixtures/test-data.json');

describe('ChartGenerator', () => {
  let chartGenerator;
  
  beforeEach(() => {
    chartGenerator = new ChartGenerator();
  });
  
  describe('generateChart', () => {
    it('should generate valid chart for valid birth data', async () => {
      // Arrange
      const birthData = sampleBirthData.valid;
      
      // Act
      const result = await chartGenerator.generateChart(birthData);
      
      // Assert
      expect(result).toHaveProperty('chart_id');
      expect(result).toHaveProperty('basic_info');
      expect(result).toHaveProperty('palaces');
      expect(result.palaces).toHaveLength(12);
    });
    
    it('should throw error for invalid birth data', async () => {
      // Arrange
      const invalidData = sampleBirthData.invalid;
      
      // Act & Assert
      await expect(chartGenerator.generateChart(invalidData))
        .rejects.toThrow('Invalid birth data');
    });
  });
});
```

### 错误处理规范

#### 自定义错误类
```javascript
// src/utils/errors.js
class ZiweiError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'ZiweiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class ValidationError extends ZiweiError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }
}

class DatabaseError extends ZiweiError {
  constructor(message, operation) {
    super(message, 'DATABASE_ERROR', 500);
    this.operation = operation;
  }
}

module.exports = {
  ZiweiError,
  ValidationError,
  DatabaseError
};
```

### 日志规范

#### 日志配置
```javascript
// src/utils/logger.js
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ziwei-doushu' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log') 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 文档规范
1. API 文档使用 JSDoc 生成
2. 每个工具必须有详细的使用说明
3. 提供完整的示例代码
4. 维护更新日志
5. 代码注释使用中文，便于理解
6. 重要算法必须有详细的实现说明

## 部署配置

### 环境要求
- **Node.js**: 18.0+ (推荐 18.17.0 LTS)
- **npm**: 8.0+ (推荐 9.0+)
- **SQLite**: 3.35+ (内置支持)
- **内存**: 最小 512MB，推荐 1GB+
- **磁盘空间**: 最小 100MB

### 环境变量配置

#### 开发环境 (.env.development)
```bash
# 应用配置
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# 数据库配置
DB_PATH=./data/charts.db
DB_BACKUP_ENABLED=true
DB_BACKUP_INTERVAL=3600000  # 1小时

# MCP 配置
MCP_SERVER_NAME=ziwei-doushu-server
MCP_SERVER_VERSION=1.0.0

# 功能开关
ENABLE_CHART_CACHE=true
ENABLE_INTERPRETATION_CACHE=true
CACHE_TTL=1800  # 30分钟

# 安全配置
MAX_REQUEST_SIZE=1mb
RATE_LIMIT_WINDOW=900000  # 15分钟
RATE_LIMIT_MAX=100
```

#### 生产环境 (.env.production)
```bash
# 应用配置
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# 数据库配置
DB_PATH=/app/data/charts.db
DB_BACKUP_ENABLED=true
DB_BACKUP_INTERVAL=1800000  # 30分钟
DB_BACKUP_PATH=/app/backups

# MCP 配置
MCP_SERVER_NAME=ziwei-doushu-server
MCP_SERVER_VERSION=1.0.0

# 性能配置
ENABLE_CHART_CACHE=true
ENABLE_INTERPRETATION_CACHE=true
CACHE_TTL=3600  # 1小时
MAX_CONCURRENT_REQUESTS=50

# 安全配置
MAX_REQUEST_SIZE=1mb
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=50
```

### 构建脚本

#### package.json scripts
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon --inspect src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write src/**/*.js",
    "format:check": "prettier --check src/**/*.js",
    "build": "npm run lint && npm run test",
    "prestart": "npm run build",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "db:backup": "node scripts/backup.js",
    "health-check": "node scripts/health-check.js"
  }
}
```

### Docker 部署

#### Dockerfile
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 生产镜像
FROM node:18-alpine AS production

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ziwei -u 1001

WORKDIR /app

# 复制依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=ziwei:nodejs package*.json ./

# 复制源代码
COPY --chown=ziwei:nodejs src/ ./src/
COPY --chown=ziwei:nodejs config/ ./config/
COPY --chown=ziwei:nodejs scripts/ ./scripts/

# 创建数据目录
RUN mkdir -p /app/data /app/logs /app/backups && \
    chown -R ziwei:nodejs /app/data /app/logs /app/backups

# 切换到非root用户
USER ziwei

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node scripts/health-check.js

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  ziwei-doushu:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: ziwei-doushu-server
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - LOG_LEVEL=info
    ports:
      - "3000:3000"
    volumes:
      - ziwei_data:/app/data
      - ziwei_logs:/app/logs
      - ziwei_backups:/app/backups
    healthcheck:
      test: ["CMD", "node", "scripts/health-check.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - ziwei_network

  # 可选：添加监控服务
  prometheus:
    image: prom/prometheus:latest
    container_name: ziwei-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - ziwei_network

volumes:
  ziwei_data:
    driver: local
  ziwei_logs:
    driver: local
  ziwei_backups:
    driver: local

networks:
  ziwei_network:
    driver: bridge
```

### 部署脚本

#### 自动化部署脚本 (deploy.sh)
```bash
#!/bin/bash

set -e

echo "开始部署紫微斗数 MCP 服务器..."

# 检查环境
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "错误: 需要 Node.js $REQUIRED_VERSION 或更高版本，当前版本: $NODE_VERSION"
    exit 1
fi

# 创建必要目录
mkdir -p data logs backups

# 安装依赖
echo "安装依赖..."
npm ci --only=production

# 运行数据库迁移
echo "运行数据库迁移..."
npm run db:migrate

# 运行测试
echo "运行测试..."
npm test

# 启动服务
echo "启动服务..."
npm start

echo "部署完成！"
```

### 监控配置

#### 健康检查脚本 (scripts/health-check.js)
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './data/charts.db';

function checkHealth() {
  return new Promise((resolve, reject) => {
    // 检查数据库文件
    if (!fs.existsSync(DB_PATH)) {
      reject(new Error('Database file not found'));
      return;
    }
    
    // 检查服务端口
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      if (res.statusCode === 200) {
        resolve('OK');
      } else {
        reject(new Error(`Health check failed with status ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Health check timeout')));
    req.end();
  });
}

checkHealth()
  .then(() => {
    console.log('Health check passed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Health check failed:', error.message);
    process.exit(1);
  });
```

### 性能优化配置

#### PM2 配置 (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'ziwei-doushu-server',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'data'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

## 安全配置

### 输入验证

#### 参数验证中间件
```javascript
const Joi = require('joi');

// 生日验证模式
const birthdateSchema = Joi.object({
  year: Joi.number().integer().min(1900).max(2100).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  day: Joi.number().integer().min(1).max(31).required(),
  hour: Joi.number().integer().min(0).max(23).required(),
  minute: Joi.number().integer().min(0).max(59).required()
});

// 性别验证模式
const genderSchema = Joi.string().valid('male', 'female').required();

// 地点验证模式
const locationSchema = Joi.object({
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  timezone: Joi.string().required()
});

/**
 * 验证生成命盘的输入参数
 */
function validateChartInput(input) {
  const schema = Joi.object({
    birthdate: birthdateSchema,
    gender: genderSchema,
    location: locationSchema,
    name: Joi.string().max(50).optional()
  });
  
  const { error, value } = schema.validate(input);
  if (error) {
    throw new ValidationError(`输入验证失败: ${error.details[0].message}`);
  }
  
  return value;
}
```

### 数据加密

#### 敏感数据加密
```javascript
const crypto = require('crypto');

class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.secretKey = process.env.ENCRYPTION_KEY || this.generateKey();
  }
  
  /**
   * 生成加密密钥
   */
  generateKey() {
    return crypto.randomBytes(32);
  }
  
  /**
   * 加密数据
   */
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  /**
   * 解密数据
   */
  decrypt(encryptedData) {
    const { encrypted, iv, authTag } = encryptedData;
    
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 访问控制

#### 速率限制
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');

// Redis 客户端（可选）
const redisClient = process.env.REDIS_URL ? 
  Redis.createClient({ url: process.env.REDIS_URL }) : null;

// 基础速率限制
const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100次请求
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  }) : undefined
});

// 严格速率限制（用于计算密集型操作）
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10, // 每个IP最多10次请求
  message: {
    error: 'Too many computation requests',
    retryAfter: '1 hour'
  }
});
```

### 数据脱敏

#### 敏感信息处理
```javascript
class DataSanitizer {
  /**
   * 脱敏个人信息
   */
  static sanitizePersonalInfo(data) {
    const sanitized = { ...data };
    
    // 姓名脱敏
    if (sanitized.name) {
      sanitized.name = this.maskName(sanitized.name);
    }
    
    // 生日脱敏（保留年份，模糊月日）
    if (sanitized.birthdate) {
      sanitized.birthdate = {
        year: sanitized.birthdate.year,
        month: '**',
        day: '**',
        hour: '**',
        minute: '**'
      };
    }
    
    // 地理位置脱敏
    if (sanitized.location) {
      sanitized.location = {
        longitude: this.maskCoordinate(sanitized.location.longitude),
        latitude: this.maskCoordinate(sanitized.location.latitude),
        timezone: sanitized.location.timezone
      };
    }
    
    return sanitized;
  }
  
  /**
   * 姓名脱敏
   */
  static maskName(name) {
    if (name.length <= 2) {
      return name.charAt(0) + '*';
    }
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }
  
  /**
   * 坐标脱敏
   */
  static maskCoordinate(coord) {
    return Math.round(coord * 100) / 100; // 保留2位小数
  }
}
```

## 最佳实践

### 代码组织

#### 项目结构最佳实践
```
ziwei-doushu-mcp/
├── src/
│   ├── controllers/          # 控制器层
│   │   ├── chart.controller.js
│   │   ├── interpretation.controller.js
│   │   └── fortune.controller.js
│   ├── services/            # 业务逻辑层
│   │   ├── chart.service.js
│   │   ├── calculation.service.js
│   │   └── interpretation.service.js
│   ├── models/              # 数据模型层
│   │   ├── chart.model.js
│   │   ├── star.model.js
│   │   └── palace.model.js
│   ├── utils/               # 工具函数
│   │   ├── lunar.util.js
│   │   ├── calculation.util.js
│   │   └── validation.util.js
│   ├── middleware/          # 中间件
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── config/              # 配置文件
│   │   ├── database.config.js
│   │   ├── logger.config.js
│   │   └── app.config.js
│   └── index.js             # 入口文件
├── tests/                   # 测试文件
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                    # 文档
├── scripts/                 # 脚本文件
├── config/                  # 环境配置
└── data/                    # 数据文件
```

### 性能优化

#### 缓存策略
```javascript
const NodeCache = require('node-cache');
const Redis = require('redis');

class CacheManager {
  constructor() {
    // 内存缓存（用于频繁访问的小数据）
    this.memoryCache = new NodeCache({
      stdTTL: 600, // 10分钟
      checkperiod: 120, // 2分钟检查一次过期
      useClones: false
    });
    
    // Redis缓存（用于大数据和分布式缓存）
    this.redisClient = process.env.REDIS_URL ? 
      Redis.createClient({ url: process.env.REDIS_URL }) : null;
  }
  
  /**
   * 获取缓存
   */
  async get(key, useRedis = false) {
    if (useRedis && this.redisClient) {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    }
    
    return this.memoryCache.get(key);
  }
  
  /**
   * 设置缓存
   */
  async set(key, value, ttl = 600, useRedis = false) {
    if (useRedis && this.redisClient) {
      await this.redisClient.setEx(key, ttl, JSON.stringify(value));
      return;
    }
    
    this.memoryCache.set(key, value, ttl);
  }
  
  /**
   * 生成缓存键
   */
  generateKey(type, params) {
    const paramString = JSON.stringify(params);
    const hash = crypto.createHash('md5').update(paramString).digest('hex');
    return `${type}:${hash}`;
  }
}
```

#### 数据库优化
```javascript
// 数据库连接池配置
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.connectionPool = [];
    this.maxConnections = 10;
  }
  
  /**
   * 初始化数据库连接
   */
  async initialize() {
    this.db = await open({
      filename: process.env.DB_PATH || './data/charts.db',
      driver: sqlite3.Database
    });
    
    // 性能优化设置
    await this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA cache_size = 1000;
      PRAGMA temp_store = MEMORY;
      PRAGMA mmap_size = 268435456;
    `);
    
    // 创建索引
    await this.createIndexes();
  }
  
  /**
   * 创建性能索引
   */
  async createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_charts_birth_info ON charts(birth_year, birth_month)',
      'CREATE INDEX IF NOT EXISTS idx_interpretations_chart_id ON interpretations(chart_id)',
      'CREATE INDEX IF NOT EXISTS idx_interpretations_type ON interpretations(interpretation_type)'
    ];
    
    for (const index of indexes) {
      await this.db.exec(index);
    }
  }
  
  /**
   * 批量插入优化
   */
  async batchInsert(table, records) {
    const stmt = await this.db.prepare(`
      INSERT INTO ${table} (${Object.keys(records[0]).join(', ')})
      VALUES (${Object.keys(records[0]).map(() => '?').join(', ')})
    `);
    
    await this.db.exec('BEGIN TRANSACTION');
    
    try {
      for (const record of records) {
        await stmt.run(Object.values(record));
      }
      await this.db.exec('COMMIT');
    } catch (error) {
      await this.db.exec('ROLLBACK');
      throw error;
    } finally {
      await stmt.finalize();
    }
  }
}
```

### 错误处理最佳实践

#### 统一错误处理
```javascript
// 自定义错误类型
class ZiweiError extends Error {
  constructor(message, code = 'ZIWEI_ERROR', statusCode = 500) {
    super(message);
    this.name = 'ZiweiError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends ZiweiError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

class CalculationError extends ZiweiError {
  constructor(message) {
    super(message, 'CALCULATION_ERROR', 422);
    this.name = 'CalculationError';
  }
}

// 全局错误处理中间件
function errorHandler(error, req, res, next) {
  // 记录错误日志
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  });
  
  // 返回错误响应
  if (error instanceof ZiweiError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        timestamp: error.timestamp
      }
    });
  }
  
  // 未知错误
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
}
```

### 测试最佳实践

#### 测试数据管理
```javascript
// 测试数据工厂
class TestDataFactory {
  /**
   * 生成测试用的生日数据
   */
  static createBirthdate(overrides = {}) {
    return {
      year: 1990,
      month: 5,
      day: 15,
      hour: 14,
      minute: 30,
      ...overrides
    };
  }
  
  /**
   * 生成测试用的地理位置数据
   */
  static createLocation(overrides = {}) {
    return {
      longitude: 116.4074,  // 北京
      latitude: 39.9042,
      timezone: 'Asia/Shanghai',
      ...overrides
    };
  }
  
  /**
   * 生成完整的命盘测试数据
   */
  static createChartData(overrides = {}) {
    return {
      birthdate: this.createBirthdate(overrides.birthdate),
      gender: 'male',
      location: this.createLocation(overrides.location),
      name: 'Test User',
      ...overrides
    };
  }
}

// 测试辅助函数
class TestHelpers {
  /**
   * 清理测试数据库
   */
  static async cleanDatabase(db) {
    await db.exec('DELETE FROM charts');
    await db.exec('DELETE FROM interpretations');
    await db.exec('DELETE FROM sqlite_sequence WHERE name IN ("charts", "interpretations")');
  }
  
  /**
   * 创建测试数据库
   */
  static async createTestDatabase() {
    const db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });
    
    // 创建表结构
    await db.exec(fs.readFileSync('./scripts/schema.sql', 'utf8'));
    
    return db;
  }
}
```

## 版本规划

### v1.0.0 (MVP)
- [x] 基础排盘功能
- [x] 简单宫位分析
- [x] 基础运势预测
- [x] MCP 协议集成

### v1.1.0 (核心扩展)
- [ ] 合婚分析功能
- [ ] 择日功能
- [ ] 详细解盘报告
- [ ] 基础可视化图表
- [ ] 人际关系分析

### v1.2.0 (智能化升级)
- [ ] AI 智能解盘
- [ ] 人生时间轴分析
- [ ] 职业发展指导
- [ ] 健康分析功能
- [ ] 教育指导功能

### v1.3.0 (可视化增强)
- [ ] 高级可视化图表
- [ ] 多种图表样式
- [ ] 交互式命盘
- [ ] 数据导出功能
- [ ] 报告生成器

### v2.0.0 (专业版)
- [ ] 高级预测算法
- [ ] 个性化建议系统
- [ ] 多语言支持
- [ ] 移动端适配
- [ ] 云端数据同步

### v2.1.0 (社交功能)
- [ ] 社交分享功能
- [ ] 用户社区
- [ ] 专家咨询
- [ ] 学习资源库
- [ ] 案例分析库

## 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request
5. 代码审查和合并

### 提交规范
```
type(scope): description

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 许可证

MIT License

## 联系方式

- 项目维护者：[您的姓名]
- 邮箱：[您的邮箱]
- 项目地址：[GitHub 仓库地址]

---

*本文档将随项目开发进度持续更新*