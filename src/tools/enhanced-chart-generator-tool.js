/**
 * 增强版紫微斗数命盘生成工具
 * 集成专业算法和数据源
 */

const { z } = require("zod");
const {
  EnhancedChartGenerator,
} = require("../core/enhanced-chart-generator.js");
const {
  ProfessionalDataService,
} = require("../services/professional-data-service.js");
const { getStarInfo, getPatternInfo } = require("../data/stars-database.js");

/**
 * 输入参数验证模式
 */
const GenerateEnhancedChartSchema = z.object({
  name: z.string().min(1, "姓名不能为空").max(50, "姓名长度不能超过50个字符"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "性别必须是 male 或 female" }),
  }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "出生日期格式必须是 YYYY-MM-DD"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "出生时间格式必须是 HH:MM"),
  birthLocation: z.string().optional(),
  useProApi: z.boolean().default(false).describe("是否使用专业API"),
  detailLevel: z
    .enum(["basic", "standard", "professional"])
    .default("standard")
    .describe("详细程度"),
  includePatterns: z.boolean().default(true).describe("是否包含格局分析"),
  includePredictions: z.boolean().default(false).describe("是否包含运势预测"),
});

class EnhancedChartGeneratorTool {
  constructor() {
    this.name = "generate_enhanced_chart";
    this.description = "生成增强版紫微斗数命盘，支持专业算法和数据源";
    this.inputSchema = GenerateEnhancedChartSchema;

    this.generator = new EnhancedChartGenerator();
    this.dataService = new ProfessionalDataService();

    // 性能统计
    this.stats = {
      totalGenerated: 0,
      apiCalls: 0,
      localCalculations: 0,
      averageTime: 0,
      errors: 0,
    };
  }

  /**
   * 生成增强版命盘
   */
  async execute(input) {
    const startTime = Date.now();

    try {
      // 验证输入参数
      const validatedInput = this.inputSchema.parse(input);

      console.log(
        `开始生成增强版命盘: ${validatedInput.name} (${validatedInput.gender})`,
      );

      // 检查数据源状态
      const healthCheck = await this.dataService.healthCheck();
      console.log("数据源状态:", healthCheck);

      // 解析出生信息
      const solarDate = this.parseBirthInfo(validatedInput);

      // 获取精确农历信息
      let lunarInfo;
      if (validatedInput.useProApi && healthCheck.zhwnl_api) {
        console.log("使用专业API获取农历信息");
        lunarInfo = await this.dataService.getPreciseLunarInfo(solarDate);
        this.stats.apiCalls++;
      } else {
        console.log("使用本地算法计算农历信息");
        lunarInfo = this.dataService.calculateLunarLocal(solarDate);
        this.stats.localCalculations++;
      }

      // 生成基础命盘结构
      const baseChart = await this.generateBaseChart(validatedInput, lunarInfo);

      // 获取专业星曜定位
      let starPositions;
      if (validatedInput.useProApi && healthCheck.ziwei_pro_api) {
        console.log("使用专业API获取星曜定位");
        starPositions = await this.dataService.getProfessionalStarPositions(
          lunarInfo,
          validatedInput.gender,
        );
        this.stats.apiCalls++;
      } else {
        console.log("使用增强本地算法计算星曜定位");
        starPositions = await this.dataService.calculateStarPositionsLocal(
          lunarInfo,
          validatedInput.gender,
        );
        this.stats.localCalculations++;
      }

      // 合并星曜信息到命盘
      const enhancedChart = this.mergeStarPositions(baseChart, starPositions);

      // 专业格局分析
      let patternAnalysis = null;
      if (validatedInput.includePatterns) {
        if (validatedInput.useProApi && healthCheck.ziwei_pro_api) {
          console.log("使用专业API进行格局分析");
          patternAnalysis =
            await this.dataService.getProfessionalPatternAnalysis(
              enhancedChart,
            );
          this.stats.apiCalls++;
        } else {
          console.log("使用本地专业数据进行格局分析");
          patternAnalysis =
            await this.dataService.analyzePatternLocal(enhancedChart);
          this.stats.localCalculations++;
        }

        enhancedChart.patterns = patternAnalysis.patterns || [];
        enhancedChart.patternAnalysis = patternAnalysis;
      }

      // 专业解释文本
      let interpretations = null;
      if (validatedInput.detailLevel === "professional") {
        if (validatedInput.useProApi && healthCheck.ziwei_pro_api) {
          console.log("使用专业API生成解释文本");
          interpretations =
            await this.dataService.getProfessionalInterpretations(
              enhancedChart,
              "comprehensive",
            );
          this.stats.apiCalls++;
        } else {
          console.log("使用本地专业数据生成解释文本");
          interpretations = await this.dataService.generateInterpretationsLocal(
            enhancedChart,
            "comprehensive",
          );
          this.stats.localCalculations++;
        }

        enhancedChart.interpretations = interpretations;
      }

      // 运势预测（可选）
      if (validatedInput.includePredictions) {
        enhancedChart.predictions = await this.generatePredictions(
          enhancedChart,
          lunarInfo,
        );
      }

      // 生成增强摘要
      const enhancedSummary = this.generateEnhancedSummary(
        enhancedChart,
        validatedInput.detailLevel,
      );

      // 更新统计信息
      const executionTime = Date.now() - startTime;
      this.updateStats(executionTime);

      // 构建返回结果
      const result = {
        success: true,
        data: {
          chartId: enhancedChart.id,
          chart: enhancedChart,
          summary: enhancedSummary,
          metadata: {
            ...enhancedChart.metadata,
            executionTime: executionTime,
            dataSource: this.getDataSourceInfo(
              healthCheck,
              validatedInput.useProApi,
            ),
            detailLevel: validatedInput.detailLevel,
            accuracy: starPositions?.accuracy || "enhanced_local",
          },
        },
      };

      console.log(`命盘生成完成，耗时: ${executionTime}ms`);
      return result;
    } catch (error) {
      this.stats.errors++;
      console.error("生成增强版命盘失败:", error);

      return {
        success: false,
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 生成基础命盘结构
   */
  async generateBaseChart(input, lunarInfo) {
    // 使用增强版生成器创建基础结构
    const result = await this.generator.generateChart({
      name: input.name,
      gender: input.gender,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      birthLocation: input.birthLocation,
    });

    if (!result.success) {
      throw new Error(`基础命盘生成失败: ${result.error}`);
    }

    return result.data.chart;
  }

  /**
   * 合并星曜定位信息
   */
  mergeStarPositions(baseChart, starPositions) {
    if (starPositions.palaces) {
      // 使用专业星曜定位覆盖基础定位
      baseChart.palaces = starPositions.palaces;
    }

    if (starPositions.brightness) {
      // 添加专业亮度信息
      baseChart.palaces.forEach((palace) => {
        palace.stars.forEach((star) => {
          if (starPositions.brightness[star.name]) {
            star.professionalBrightness = starPositions.brightness[star.name];
          }
        });
      });
    }

    if (starPositions.sihua) {
      // 使用专业四化信息
      baseChart.sihua = { ...baseChart.sihua, ...starPositions.sihua };
    }

    return baseChart;
  }

  /**
   * 生成运势预测
   */
  async generatePredictions(chart, lunarInfo) {
    const currentYear = new Date().getFullYear();
    const predictions = {
      currentYear: currentYear,
      yearlyFortune: this.calculateYearlyFortune(chart, currentYear),
      monthlyTrends: this.calculateMonthlyTrends(chart, currentYear),
      keyEvents: this.predictKeyEvents(chart, currentYear),
      recommendations: this.generateRecommendations(chart),
    };

    return predictions;
  }

  /**
   * 生成增强摘要
   */
  generateEnhancedSummary(chart, detailLevel) {
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const mainStars = destinyPalace.stars.filter((s) => s.type === "main");
    const patterns = chart.patterns || [];

    const summary = {
      basicInfo: {
        name: chart.info.name,
        gender: chart.info.gender,
        age: chart.info.age,
        destinyPalace: destinyPalace.name,
        mainStars: mainStars.map((s) => ({
          name: s.name,
          brightness: s.brightness || s.professionalBrightness,
          element: s.element,
          sihua: s.sihua,
        })),
      },

      patterns: patterns.map((p) => ({
        name: p.name,
        type: p.type,
        strength: p.strength,
        influence: p.influence,
        description: detailLevel === "professional" ? p.description : p.name,
      })),

      overallAssessment: this.generateOverallAssessment(chart, patterns),

      keyInsights: this.generateKeyInsights(chart, detailLevel),
    };

    if (detailLevel === "professional" && chart.interpretations) {
      summary.professionalAnalysis = {
        personality: chart.interpretations.personality,
        career: chart.interpretations.career,
        wealth: chart.interpretations.wealth,
        relationships: chart.interpretations.relationships,
        health: chart.interpretations.health,
      };
    }

    if (chart.predictions) {
      summary.predictions = {
        yearlyFortune: chart.predictions.yearlyFortune,
        keyEvents: chart.predictions.keyEvents.slice(0, 3), // 只显示前3个关键事件
        recommendations: chart.predictions.recommendations.slice(0, 5), // 只显示前5个建议
      };
    }

    return summary;
  }

  /**
   * 生成整体评估
   */
  generateOverallAssessment(chart, patterns) {
    const excellentPatterns = patterns.filter(
      (p) => p.strength === "excellent",
    ).length;
    const goodPatterns = patterns.filter((p) => p.strength === "good").length;
    const poorPatterns = patterns.filter((p) => p.strength === "poor").length;

    let level = "普通";
    let score = 60;
    let description = "命盘格局一般，需要后天努力";

    if (excellentPatterns >= 2) {
      level = "优秀";
      score = 85 + excellentPatterns * 5;
      description = "命盘格局优秀，天赋异禀，前程似锦";
    } else if (excellentPatterns >= 1) {
      level = "良好";
      score = 75 + excellentPatterns * 5 + goodPatterns * 3;
      description = "命盘格局良好，具有发展潜力";
    } else if (goodPatterns >= 2) {
      level = "中上";
      score = 70 + goodPatterns * 3;
      description = "命盘格局中上，有一定优势";
    } else if (poorPatterns >= 2) {
      level = "较差";
      score = 45 - poorPatterns * 3;
      description = "命盘格局较差，需要特别注意化解";
    }

    return {
      level: level,
      score: Math.max(0, Math.min(100, score)),
      description: description,
      strengths: this.identifyStrengths(chart),
      challenges: this.identifyChallenges(chart),
    };
  }

  /**
   * 生成关键洞察
   */
  generateKeyInsights(chart, detailLevel) {
    const insights = [];
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const mainStar = destinyPalace.stars.find((s) => s.type === "main");

    if (mainStar) {
      const starInfo = getStarInfo(mainStar.name);
      if (starInfo) {
        insights.push({
          type: "personality",
          title: "性格特质",
          content: `主星${mainStar.name}，${starInfo.characteristics.personality.slice(0, 2).join("、")}`,
        });

        insights.push({
          type: "career",
          title: "事业方向",
          content: `适合${starInfo.characteristics.career.slice(0, 3).join("、")}等领域`,
        });
      }
    }

    // 添加格局洞察
    const excellentPatterns =
      chart.patterns?.filter((p) => p.strength === "excellent") || [];
    if (excellentPatterns.length > 0) {
      insights.push({
        type: "pattern",
        title: "格局优势",
        content: `具有${excellentPatterns[0].name}，${excellentPatterns[0].description}`,
      });
    }

    // 添加四化洞察
    if (chart.sihua && chart.sihua["化禄"]) {
      insights.push({
        type: "sihua",
        title: "财运机遇",
        content: `${chart.sihua["化禄"].star}化禄在${chart.sihua["化禄"].palace}，财运亨通`,
      });
    }

    return insights.slice(0, detailLevel === "professional" ? 8 : 5);
  }

  /**
   * 识别优势
   */
  identifyStrengths(chart) {
    const strengths = [];
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );

    // 检查主星优势
    destinyPalace.stars.forEach((star) => {
      if (star.brightness === "庙" || star.brightness === "旺") {
        strengths.push(`${star.name}星入庙旺，发挥良好`);
      }
    });

    // 检查格局优势
    const excellentPatterns =
      chart.patterns?.filter((p) => p.strength === "excellent") || [];
    excellentPatterns.forEach((pattern) => {
      strengths.push(`具有${pattern.name}格局`);
    });

    return strengths.slice(0, 5);
  }

  /**
   * 识别挑战
   */
  identifyChallenges(chart) {
    const challenges = [];
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );

    // 检查煞星影响
    const maleficStars = destinyPalace.stars.filter(
      (s) => s.type === "malefic",
    );
    maleficStars.forEach((star) => {
      challenges.push(
        `${star.name}入命，需注意${star.name === "擎羊" ? "冲动" : star.name === "陀罗" ? "拖延" : "意外"}`,
      );
    });

    // 检查化忌影响
    if (chart.sihua && chart.sihua["化忌"]) {
      challenges.push(`${chart.sihua["化忌"].star}化忌，需注意相关领域的挫折`);
    }

    return challenges.slice(0, 3);
  }

  /**
   * 获取数据源信息
   */
  getDataSourceInfo(healthCheck, useProApi) {
    const sources = [];

    if (useProApi) {
      if (healthCheck.zhwnl_api) sources.push("中华万年历API");
      if (healthCheck.ziwei_pro_api) sources.push("紫微斗数专业API");
    }

    if (healthCheck.local_database) sources.push("本地专业数据库");
    sources.push("增强本地算法");

    return {
      primary: sources[0] || "增强本地算法",
      fallback: sources.slice(1),
      api_enabled: useProApi,
      health_status: healthCheck,
    };
  }

  /**
   * 更新统计信息
   */
  updateStats(executionTime) {
    this.stats.totalGenerated++;
    this.stats.averageTime =
      (this.stats.averageTime * (this.stats.totalGenerated - 1) +
        executionTime) /
      this.stats.totalGenerated;
  }

  /**
   * 获取工具统计信息
   */
  getStats() {
    return {
      ...this.stats,
      dataSourceStats: this.dataService.getDataSourceStats(),
    };
  }

  /**
   * 解析出生信息
   */
  parseBirthInfo(input) {
    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);

    return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute || 0,
    };
  }

  // 简化的预测方法（实际应用中需要更复杂的算法）
  calculateYearlyFortune(chart, year) {
    return {
      overall: "中上",
      career: "稳步上升",
      wealth: "财运亨通",
      health: "注意保养",
      relationships: "和谐稳定",
    };
  }

  calculateMonthlyTrends(chart, year) {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        month: i,
        fortune: ["上上", "上中", "中上", "中平", "中下"][
          Math.floor(Math.random() * 5)
        ],
        focus: ["事业", "财运", "感情", "健康", "学业"][
          Math.floor(Math.random() * 5)
        ],
      });
    }
    return months;
  }

  predictKeyEvents(chart, year) {
    return [
      { month: 3, event: "事业有新机遇", probability: "high" },
      { month: 6, event: "财运有所提升", probability: "medium" },
      { month: 9, event: "人际关系改善", probability: "high" },
      { month: 11, event: "健康需要关注", probability: "low" },
    ];
  }

  generateRecommendations(chart) {
    return [
      "保持积极心态，把握机遇",
      "注重人际关系的维护",
      "合理规划财务，稳健投资",
      "定期体检，关注健康",
      "持续学习，提升自我",
    ];
  }
}

module.exports = {
  EnhancedChartGeneratorTool,
};
