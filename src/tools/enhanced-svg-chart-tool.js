/**
 * 增强SVG图表生成工具
 * 集成到MCP工具系统中的高级SVG生成器
 */

const { IntegratedSVGGenerator } = require("../core/integrated-svg-generator");
const { EnhancedChartGenerator } = require("../core/enhanced-chart-generator");
const { CalendarConverter } = require("../core/calendar");

class EnhancedSVGChartTool {
  constructor() {
    this.name = "enhanced_svg_chart";
    this.description =
      "增强版紫微斗数SVG图表生成工具，支持模板化生成、增量更新、多种图表类型和自定义主题";

    // 初始化组件
    this.svgGenerator = new IntegratedSVGGenerator({
      enableIncremental: true,
      enableCaching: true,
      enableOptimization: true,
      defaultTheme: "classic",
      defaultChartType: "traditional_chart",
      enableAnimations: true,
    });

    this.chartGenerator = new EnhancedChartGenerator();
    this.calendarConverter = new CalendarConverter();

    // 工具定义
    this.definition = {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: "object",
        properties: {
          // 基本信息
          birthInfo: {
            type: "object",
            description: "出生信息",
            properties: {
              year: { type: "integer", description: "出生年份" },
              month: { type: "integer", description: "出生月份" },
              day: { type: "integer", description: "出生日期" },
              hour: { type: "integer", description: "出生时辰(0-23)" },
              minute: { type: "integer", description: "出生分钟", default: 0 },
              gender: {
                type: "string",
                enum: ["male", "female"],
                description: "性别",
              },
              isLunar: {
                type: "boolean",
                description: "是否农历",
                default: false,
              },
            },
            required: ["year", "month", "day", "hour", "gender"],
          },

          // 图表配置
          chartConfig: {
            type: "object",
            description: "图表配置",
            properties: {
              type: {
                type: "string",
                enum: [
                  "traditional_chart", // 传统命盘
                  "modern_wheel", // 现代轮盘
                  "grid_layout", // 网格布局
                  "star_relationship", // 星曜关系图
                  "fortune_timeline", // 运势时间线
                  "compatibility_radar", // 合婚雷达图
                ],
                description: "图表类型",
                default: "traditional_chart",
              },
              theme: {
                type: "string",
                enum: ["classic", "dark", "chinese", "minimal"],
                description: "主题样式",
                default: "classic",
              },
              width: {
                type: "integer",
                description: "图表宽度",
                default: 800,
                minimum: 400,
                maximum: 2000,
              },
              height: {
                type: "integer",
                description: "图表高度",
                default: 600,
                minimum: 400,
                maximum: 2000,
              },
              enableAnimations: {
                type: "boolean",
                description: "启用动画效果",
                default: true,
              },
              enableInteractivity: {
                type: "boolean",
                description: "启用交互功能",
                default: false,
              },
              outputFormat: {
                type: "string",
                enum: ["svg", "png", "pdf"],
                description: "输出格式",
                default: "svg",
              },
              quality: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "输出质量",
                default: "high",
              },
            },
          },

          // 高级选项
          options: {
            type: "object",
            description: "高级选项",
            properties: {
              useProApi: {
                type: "boolean",
                description: "使用专业API",
                default: false,
              },
              enableIncremental: {
                type: "boolean",
                description: "启用增量更新",
                default: true,
              },
              includeAnalysis: {
                type: "boolean",
                description: "包含命理分析",
                default: true,
              },
              includeFortune: {
                type: "boolean",
                description: "包含运势预测",
                default: false,
              },
              customTheme: {
                type: "object",
                description: "自定义主题配置",
                properties: {
                  name: { type: "string", description: "主题名称" },
                  colors: {
                    type: "object",
                    description: "颜色配置",
                    properties: {
                      primary: { type: "string", description: "主色调" },
                      secondary: { type: "string", description: "次色调" },
                      accent: { type: "string", description: "强调色" },
                      background: { type: "string", description: "背景色" },
                      textPrimary: { type: "string", description: "主文字色" },
                      textSecondary: {
                        type: "string",
                        description: "次文字色",
                      },
                    },
                  },
                },
              },
              timelineRange: {
                type: "object",
                description: "时间线范围（用于运势时间线图表）",
                properties: {
                  startYear: { type: "integer", description: "开始年份" },
                  endYear: { type: "integer", description: "结束年份" },
                },
              },
              compatibilityTarget: {
                type: "object",
                description: "合婚对象信息（用于合婚雷达图）",
                properties: {
                  year: { type: "integer", description: "对方出生年份" },
                  month: { type: "integer", description: "对方出生月份" },
                  day: { type: "integer", description: "对方出生日期" },
                  hour: { type: "integer", description: "对方出生时辰" },
                  gender: {
                    type: "string",
                    enum: ["male", "female"],
                    description: "对方性别",
                  },
                },
              },
            },
          },
        },
        required: ["birthInfo"],
      },
    };
  }

  /**
   * 执行工具
   */
  async execute(params) {
    const startTime = performance.now();

    try {
      // 参数验证
      this.validateParams(params);

      // 提取参数
      const { birthInfo, chartConfig = {}, options = {} } = params;

      // 注册自定义主题（如果提供）
      if (options.customTheme) {
        await this.registerCustomTheme(options.customTheme);
      }

      // 生成命盘数据
      const chartData = await this.generateChartData(birthInfo, options);

      // 根据图表类型处理数据
      const processedData = await this.processDataForChartType(
        chartData,
        chartConfig.type || "traditional_chart",
        options,
      );

      // 生成SVG
      const svg = await this.generateSVG(processedData, chartConfig, options);

      // 生成分析报告（如果需要）
      const analysis = options.includeAnalysis
        ? await this.generateAnalysis(chartData, options)
        : null;

      // 构建结果
      const result = {
        success: true,
        data: {
          svg: svg,
          chartType: chartConfig.type || "traditional_chart",
          theme: chartConfig.theme || "classic",
          dimensions: {
            width: chartConfig.width || 800,
            height: chartConfig.height || 600,
          },
          birthInfo: this.formatBirthInfo(birthInfo),
          analysis: analysis,
          metadata: {
            generatedAt: new Date().toISOString(),
            generationTime: performance.now() - startTime,
            version: "2.0.0",
            features: {
              incremental: options.enableIncremental !== false,
              animations: chartConfig.enableAnimations !== false,
              interactivity: chartConfig.enableInteractivity === true,
              proApi: options.useProApi === true,
            },
          },
        },
        stats: this.svgGenerator.getStats(),
      };

      return result;
    } catch (error) {
      console.error("增强SVG图表生成失败:", error);

      return {
        success: false,
        error: {
          message: error.message,
          type: error.constructor.name,
          timestamp: new Date().toISOString(),
        },
        fallback: await this.generateFallbackChart(params),
      };
    }
  }

  /**
   * 参数验证
   */
  validateParams(params) {
    if (!params.birthInfo) {
      throw new Error("缺少出生信息");
    }

    const { year, month, day, hour, gender } = params.birthInfo;

    if (!year || year < 1900 || year > 2100) {
      throw new Error("出生年份无效");
    }

    if (!month || month < 1 || month > 12) {
      throw new Error("出生月份无效");
    }

    if (!day || day < 1 || day > 31) {
      throw new Error("出生日期无效");
    }

    if (hour === undefined || hour < 0 || hour > 23) {
      throw new Error("出生时辰无效");
    }

    if (!gender || !["male", "female"].includes(gender)) {
      throw new Error("性别信息无效");
    }
  }

  /**
   * 注册自定义主题
   */
  async registerCustomTheme(customTheme) {
    if (!customTheme.name) {
      throw new Error("自定义主题必须包含名称");
    }

    // 构建完整主题配置
    const themeConfig = {
      name: customTheme.name,
      colors: {
        primary: "#1976D2",
        secondary: "#424242",
        accent: "#FF9800",
        background: "#FFFFFF",
        surface: "#F5F5F5",
        textPrimary: "#212121",
        textSecondary: "#757575",
        borderPrimary: "#E0E0E0",
        borderSecondary: "#BDBDBD",
        ...customTheme.colors,
      },
      fonts: {
        fontFamily: "Arial, sans-serif",
        titleSize: "18px",
        subtitleSize: "14px",
        bodySize: "12px",
        captionSize: "10px",
        ...customTheme.fonts,
      },
      spacing: {
        small: 4,
        medium: 8,
        large: 16,
        xlarge: 24,
        ...customTheme.spacing,
      },
    };

    // 注册主题
    this.svgGenerator.themeManager.registerTheme(customTheme.name, themeConfig);

    console.log(`自定义主题 "${customTheme.name}" 已注册`);
  }

  /**
   * 生成命盘数据
   */
  async generateChartData(birthInfo, options) {
    // 转换日期
    const dateInfo = await this.convertDate(birthInfo);

    // 生成基础命盘
    const baseChart = await this.chartGenerator.generateChart(
      {
        ...birthInfo,
        ...dateInfo,
      },
      {
        useProApi: options.useProApi,
        includeAnalysis: true,
        includeFortune: options.includeFortune,
      },
    );

    return baseChart;
  }

  /**
   * 日期转换
   */
  async convertDate(birthInfo) {
    const { year, month, day, hour, minute = 0, isLunar = false } = birthInfo;

    let solarDate, lunarDate;

    if (isLunar) {
      // 农历转阳历
      solarDate = this.calendarConverter.lunarToSolar(year, month, day);
      lunarDate = { year, month, day };
    } else {
      // 阳历转农历
      solarDate = { year, month, day };
      lunarDate = this.calendarConverter.solarToLunar(year, month, day);
    }

    // 获取时辰信息
    const timeInfo = this.calendarConverter.getTimeInfo(hour, minute);

    return {
      solar: solarDate,
      lunar: lunarDate,
      time: timeInfo,
      ganZhi: {
        year: this.calendarConverter.getYearGanZhi(lunarDate.year),
        month: this.calendarConverter.getMonthGanZhi(
          lunarDate.year,
          lunarDate.month,
        ),
        day: this.calendarConverter.getDayGanZhi(
          solarDate.year,
          solarDate.month,
          solarDate.day,
        ),
        hour: this.calendarConverter.getHourGanZhi(hour),
      },
    };
  }

  /**
   * 根据图表类型处理数据
   */
  async processDataForChartType(chartData, chartType, options) {
    switch (chartType) {
      case "traditional_chart":
      case "modern_wheel":
      case "grid_layout":
        return this.processBasicChartData(chartData);

      case "star_relationship":
        return this.processStarRelationshipData(chartData);

      case "fortune_timeline":
        return this.processFortuneTimelineData(chartData, options);

      case "compatibility_radar":
        return this.processCompatibilityRadarData(chartData, options);

      default:
        throw new Error(`不支持的图表类型: ${chartType}`);
    }
  }

  /**
   * 处理基础图表数据
   */
  processBasicChartData(chartData) {
    return {
      palaces: chartData.palaces.map((palace, index) => ({
        id: index,
        name: palace.name,
        ganZhi: palace.ganZhi,
        stars: palace.stars.map((star) => ({
          name: star.name,
          brightness: star.brightness,
          type: star.type,
        })),
        elements: palace.elements || [],
      })),
      center: {
        name: chartData.owner?.name || "命主",
        birthInfo: chartData.birthInfo,
        mainStars: chartData.analysis?.mainStars || [],
      },
    };
  }

  /**
   * 处理星曜关系图数据
   */
  processStarRelationshipData(chartData) {
    const nodes = [];
    const edges = [];

    // 提取所有星曜作为节点
    chartData.palaces.forEach((palace, palaceIndex) => {
      palace.stars.forEach((star, starIndex) => {
        nodes.push({
          id: `${palaceIndex}-${starIndex}`,
          name: star.name,
          type: star.type,
          brightness: star.brightness,
          palace: palace.name,
          palaceIndex: palaceIndex,
        });
      });
    });

    // 分析星曜关系作为边
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const relationship = this.analyzeStarRelationship(nodes[i], nodes[j]);
        if (relationship) {
          edges.push({
            source: nodes[i],
            target: nodes[j],
            type: relationship.type,
            label: relationship.label,
            color: relationship.color,
            strength: relationship.strength,
          });
        }
      }
    }

    return { nodes, edges };
  }

  /**
   * 处理运势时间线数据
   */
  processFortuneTimelineData(chartData, options) {
    const currentYear = new Date().getFullYear();
    const timeRange = options.timelineRange || {
      startYear: currentYear,
      endYear: currentYear + 10,
    };

    const events = [];
    const periods = [];

    // 生成运势事件
    for (let year = timeRange.startYear; year <= timeRange.endYear; year++) {
      const yearFortune = this.calculateYearFortune(chartData, year);

      if (yearFortune.significantEvents.length > 0) {
        yearFortune.significantEvents.forEach((event) => {
          events.push({
            year: year,
            title: event.title,
            description: event.description,
            type: event.type,
            timeRatio:
              (year - timeRange.startYear) /
              (timeRange.endYear - timeRange.startYear),
            color: this.getEventColor(event.type),
            impact: event.impact,
          });
        });
      }
    }

    // 生成大运周期
    const majorLuckPeriods = this.calculateMajorLuckPeriods(
      chartData,
      timeRange,
    );
    periods.push(...majorLuckPeriods);

    return {
      timeline: {
        startYear: timeRange.startYear,
        endYear: timeRange.endYear,
      },
      events: events,
      periods: periods,
    };
  }

  /**
   * 处理合婚雷达图数据
   */
  processCompatibilityRadarData(chartData, options) {
    if (!options.compatibilityTarget) {
      throw new Error("合婚雷达图需要提供对方出生信息");
    }

    // 生成对方命盘
    const targetChart = this.chartGenerator.generateChart(
      options.compatibilityTarget,
    );

    // 分析合婚指标
    const compatibility = this.analyzeCompatibility(chartData, targetChart);

    const axes = [
      { label: "性格匹配", maxValue: 100 },
      { label: "事业协调", maxValue: 100 },
      { label: "财运互补", maxValue: 100 },
      { label: "健康和谐", maxValue: 100 },
      { label: "子女缘分", maxValue: 100 },
      { label: "家庭和睦", maxValue: 100 },
    ];

    const data = [
      {
        name: "男方",
        color: "#2196F3",
        values: compatibility.male,
      },
      {
        name: "女方",
        color: "#E91E63",
        values: compatibility.female,
      },
    ];

    return { axes, data };
  }

  /**
   * 生成SVG
   */
  async generateSVG(processedData, chartConfig, options) {
    const config = {
      chartType: chartConfig.type || "traditional_chart",
      theme: chartConfig.theme || "classic",
      width: chartConfig.width || 800,
      height: chartConfig.height || 600,
      enableAnimations: chartConfig.enableAnimations !== false,
      enableInteractivity: chartConfig.enableInteractivity === true,
      enableIncremental: options.enableIncremental !== false,
      outputFormat: chartConfig.outputFormat || "svg",
      quality: chartConfig.quality || "high",
    };

    // 如果使用自定义主题，切换到该主题
    if (options.customTheme?.name) {
      config.theme = options.customTheme.name;
    }

    return await this.svgGenerator.generateChart(processedData, config);
  }

  /**
   * 生成分析报告
   */
  async generateAnalysis(chartData, options) {
    return {
      summary: this.generateSummary(chartData),
      personality: this.analyzePersonality(chartData),
      career: this.analyzeCareer(chartData),
      wealth: this.analyzeWealth(chartData),
      health: this.analyzeHealth(chartData),
      relationships: this.analyzeRelationships(chartData),
      fortune: options.includeFortune ? this.analyzeFortune(chartData) : null,
    };
  }

  /**
   * 生成降级图表
   */
  async generateFallbackChart(params) {
    try {
      // 使用最基本的配置生成简单图表
      const simpleConfig = {
        chartType: "traditional_chart",
        theme: "classic",
        width: 600,
        height: 600,
        enableAnimations: false,
        enableInteractivity: false,
        enableIncremental: false,
      };

      const basicData = {
        palaces: Array.from({ length: 12 }, (_, i) => ({
          id: i,
          name: `${["命", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "奴仆", "官禄", "田宅", "福德", "父母"][i]}宫`,
          ganZhi: "甲子",
          stars: [],
          elements: [],
        })),
      };

      const fallbackSvg = await this.svgGenerator.generateChart(
        basicData,
        simpleConfig,
      );

      return {
        svg: fallbackSvg,
        message: "使用降级模式生成基础图表",
      };
    } catch (error) {
      return {
        svg: this.generateEmptySVG(),
        message: "生成失败，返回空白图表",
      };
    }
  }

  /**
   * 生成空白SVG
   */
  generateEmptySVG() {
    return `
      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="300" y="300" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
          图表生成失败
        </text>
      </svg>
    `;
  }

  /**
   * 格式化出生信息
   */
  formatBirthInfo(birthInfo) {
    return {
      solar: `${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}时`,
      gender: birthInfo.gender === "male" ? "男" : "女",
      calendar: birthInfo.isLunar ? "农历" : "阳历",
    };
  }

  // 辅助分析方法（简化实现）
  analyzeStarRelationship(star1, star2) {
    // 简化的星曜关系分析
    if (star1.type === "main" && star2.type === "main") {
      return {
        type: "mutual_support",
        label: "相辅",
        color: "#4CAF50",
        strength: 0.8,
      };
    }
    return null;
  }

  calculateYearFortune(chartData, year) {
    // 简化的年运计算
    return {
      significantEvents: [
        {
          title: "事业发展",
          description: "工作运势良好",
          type: "career",
          impact: "positive",
        },
      ],
    };
  }

  calculateMajorLuckPeriods(chartData, timeRange) {
    // 简化的大运计算
    return [
      {
        name: "大运：甲子",
        startYear: timeRange.startYear,
        endYear: timeRange.endYear,
        type: "major_luck",
        color: "#2196F3",
      },
    ];
  }

  analyzeCompatibility(chart1, chart2) {
    // 简化的合婚分析
    return {
      male: [
        { value: 85 },
        { value: 90 },
        { value: 78 },
        { value: 88 },
        { value: 82 },
        { value: 86 },
      ],
      female: [
        { value: 88 },
        { value: 85 },
        { value: 80 },
        { value: 90 },
        { value: 85 },
        { value: 87 },
      ],
    };
  }

  getEventColor(eventType) {
    const colors = {
      career: "#FF9800",
      love: "#E91E63",
      wealth: "#4CAF50",
      health: "#2196F3",
      family: "#9C27B0",
    };
    return colors[eventType] || "#757575";
  }

  generateSummary(chartData) {
    return "命盘整体运势良好，主星配置合理。";
  }

  analyzePersonality(chartData) {
    return {
      traits: ["聪明", "勤奋", "有责任心"],
      strengths: ["领导能力强", "善于沟通"],
      weaknesses: ["有时过于完美主义"],
    };
  }

  analyzeCareer(chartData) {
    return {
      suitableFields: ["管理", "教育", "咨询"],
      careerLuck: "良好",
      suggestions: ["适合从事领导工作"],
    };
  }

  analyzeWealth(chartData) {
    return {
      wealthLuck: "中等",
      investmentAdvice: "稳健投资为主",
      incomeSource: "工作收入为主",
    };
  }

  analyzeHealth(chartData) {
    return {
      overallHealth: "良好",
      attentionAreas: ["注意休息"],
      suggestions: ["保持规律作息"],
    };
  }

  analyzeRelationships(chartData) {
    return {
      marriageLuck: "良好",
      familyRelations: "和谐",
      friendships: "广泛",
    };
  }

  analyzeFortune(chartData) {
    return {
      currentPeriod: "运势平稳",
      nextYear: "有所提升",
      longTerm: "整体向好",
    };
  }
}

module.exports = {
  EnhancedSVGChartTool,
};
