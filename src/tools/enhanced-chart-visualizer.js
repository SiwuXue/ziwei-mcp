/**
 * 增强版图表可视化工具
 * 集成模板化SVG生成器，支持多种图表类型和自定义主题
 */

const { z } = require("zod");
const { EnhancedSVGGenerator } = require("../core/enhanced-svg-generator.js");

/**
 * 输入参数验证模式
 */
const VisualizeChartSchema = z.object({
  chartId: z.string().min(1, "命盘ID不能为空"),
  type: z
    .enum([
      "traditional_chart",
      "modern_wheel",
      "grid_layout",
      "star_relationship",
      "fortune_timeline",
      "compatibility_radar",
    ])
    .default("traditional_chart")
    .describe("图表类型"),
  theme: z
    .enum(["classic", "dark", "chinese", "minimal"])
    .optional()
    .describe("主题样式"),
  width: z.number().min(200).max(2000).optional().describe("图表宽度"),
  height: z.number().min(200).max(2000).optional().describe("图表高度"),
  animations: z.boolean().default(false).describe("是否启用动画"),
  interactive: z.boolean().default(false).describe("是否启用交互"),
  exportFormat: z
    .enum(["svg", "png", "pdf"])
    .default("svg")
    .describe("导出格式"),
  quality: z
    .enum(["draft", "standard", "high"])
    .default("standard")
    .describe("图表质量"),
  customOptions: z
    .object({
      showStarNames: z.boolean().default(true),
      showPalaceNames: z.boolean().default(true),
      showBrightness: z.boolean().default(true),
      showSihua: z.boolean().default(true),
      showPatterns: z.boolean().default(false),
      fontSize: z.number().min(8).max(24).default(12),
      colorScheme: z.string().optional(),
    })
    .optional(),
});

class EnhancedChartVisualizerTool {
  constructor() {
    this.name = "visualize_enhanced_chart";
    this.description = "生成增强版紫微斗数图表可视化，支持多种类型和主题";
    this.inputSchema = VisualizeChartSchema;

    this.svgGenerator = new EnhancedSVGGenerator();
    this.charts = new Map(); // 存储命盘数据

    // 性能统计
    this.stats = {
      totalGenerated: 0,
      byType: {},
      byTheme: {},
      averageTime: 0,
      errors: 0,
    };
  }

  /**
   * 执行图表可视化
   */
  async execute(input) {
    const startTime = Date.now();

    try {
      // 验证输入参数
      const validatedInput = this.inputSchema.parse(input);

      console.log(
        `开始生成图表: ${validatedInput.chartId} (${validatedInput.type})`,
      );

      // 获取命盘数据
      const chartData = await this.getChartData(validatedInput.chartId);
      if (!chartData) {
        throw new Error(`找不到命盘数据: ${validatedInput.chartId}`);
      }

      // 准备生成选项
      const options = this.prepareGenerationOptions(validatedInput);

      // 生成SVG图表
      const result = await this.svgGenerator.generateChart(chartData, options);

      if (!result.success) {
        throw new Error(`图表生成失败: ${result.error}`);
      }

      // 后处理
      const processedResult = await this.postProcessChart(
        result,
        validatedInput,
      );

      // 更新统计信息
      const executionTime = Date.now() - startTime;
      this.updateStats(
        validatedInput.type,
        validatedInput.theme,
        executionTime,
      );

      console.log(`图表生成完成，耗时: ${executionTime}ms`);

      return {
        success: true,
        data: {
          chartId: validatedInput.chartId,
          visualization: processedResult,
          metadata: {
            ...result.metadata,
            executionTime: executionTime,
            quality: validatedInput.quality,
            exportFormat: validatedInput.exportFormat,
          },
        },
      };
    } catch (error) {
      this.stats.errors++;
      console.error("图表可视化失败:", error);

      return {
        success: false,
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 准备生成选项
   */
  prepareGenerationOptions(input) {
    const options = {
      type: input.type,
      theme: input.theme,
      width: input.width,
      height: input.height,
      animations: input.animations,
      interactive: input.interactive,
      quality: input.quality,
    };

    // 添加自定义选项
    if (input.customOptions) {
      options.customOptions = input.customOptions;
    }

    // 根据质量调整参数
    switch (input.quality) {
      case "draft":
        options.simplify = true;
        options.reducedDetails = true;
        break;
      case "high":
        options.enhancedDetails = true;
        options.antiAliasing = true;
        break;
      default:
        // standard quality
        break;
    }

    return options;
  }

  /**
   * 获取命盘数据
   */
  async getChartData(chartId) {
    // 首先从内存缓存中查找
    if (this.charts.has(chartId)) {
      return this.charts.get(chartId);
    }

    // 模拟从数据库或其他存储中获取
    // 实际应用中这里应该连接到真实的数据源
    const mockChartData = this.generateMockChartData(chartId);

    // 缓存数据
    this.charts.set(chartId, mockChartData);

    return mockChartData;
  }

  /**
   * 生成模拟命盘数据
   */
  generateMockChartData(chartId) {
    return {
      id: chartId,
      info: {
        name: "示例用户",
        gender: "male",
        birthDate: "1990-05-15",
        birthTime: "14:30",
        age: 33,
        destinyPalace: "destiny",
        bodyPalace: "wealth",
      },
      palaces: [
        {
          id: "destiny",
          name: "命宫",
          position: { angle: 0, radius: 200 },
          stars: [
            {
              name: "紫微",
              type: "main",
              brightness: "庙",
              sihua: null,
              element: "earth",
            },
            {
              name: "天府",
              type: "main",
              brightness: "旺",
              sihua: null,
              element: "earth",
            },
            {
              name: "左辅",
              type: "auxiliary",
              brightness: "平",
              sihua: null,
              element: "earth",
            },
          ],
          earthlyBranch: "子",
          heavenlyStem: "甲",
        },
        {
          id: "siblings",
          name: "兄弟",
          position: { angle: 30, radius: 200 },
          stars: [
            {
              name: "太阳",
              type: "main",
              brightness: "旺",
              sihua: "化禄",
              element: "fire",
            },
            {
              name: "太阴",
              type: "main",
              brightness: "陷",
              sihua: null,
              element: "water",
            },
          ],
          earthlyBranch: "丑",
          heavenlyStem: "乙",
        },
        // 其他宫位...
      ],
      sihua: {
        化禄: { star: "太阳", palace: "siblings" },
        化权: { star: "武曲", palace: "wealth" },
        化科: { star: "天机", palace: "career" },
        化忌: { star: "廉贞", palace: "health" },
      },
      patterns: [
        {
          name: "紫府同宫",
          type: "excellent",
          strength: "excellent",
          influence: "positive",
          description: "紫微天府同宫，主贵显，有领导才能",
        },
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        algorithm: "enhanced",
        accuracy: "high",
      },
    };
  }

  /**
   * 后处理图表
   */
  async postProcessChart(result, input) {
    let processedSvg = result.svg;

    // 根据质量设置进行优化
    if (input.quality === "high") {
      processedSvg = this.enhanceQuality(processedSvg);
    } else if (input.quality === "draft") {
      processedSvg = this.simplifyForDraft(processedSvg);
    }

    // 添加水印或版权信息
    processedSvg = this.addWatermark(processedSvg);

    // 格式转换
    const finalResult = {
      svg: processedSvg,
      metadata: result.metadata,
    };

    // 如果需要其他格式
    if (input.exportFormat !== "svg") {
      finalResult.converted = await this.convertFormat(
        processedSvg,
        input.exportFormat,
      );
    }

    return finalResult;
  }

  /**
   * 增强图表质量
   */
  enhanceQuality(svg) {
    // 添加抗锯齿
    svg = svg.replace("<svg", '<svg shape-rendering="geometricPrecision"');

    // 增强文字渲染
    svg = svg.replace(/<text/g, '<text text-rendering="optimizeLegibility"');

    // 添加更多细节
    return svg;
  }

  /**
   * 简化草稿模式
   */
  simplifyForDraft(svg) {
    // 移除复杂的渐变和滤镜
    svg = svg.replace(/filter="[^"]*"/g, "");
    svg = svg.replace(/url\(#[^)]*\)/g, "none");

    return svg;
  }

  /**
   * 添加水印
   */
  addWatermark(svg) {
    const watermark = `
      <text x="10" y="20" font-size="10" fill="rgba(0,0,0,0.3)" font-family="Arial">
        Generated by Enhanced Ziwei Chart Visualizer
      </text>
    `;

    return svg.replace("</svg>", watermark + "</svg>");
  }

  /**
   * 格式转换
   */
  async convertFormat(svg, format) {
    switch (format) {
      case "png":
        return await this.convertToPNG(svg);
      case "pdf":
        return await this.convertToPDF(svg);
      default:
        return null;
    }
  }

  /**
   * 转换为PNG（模拟实现）
   */
  async convertToPNG(svg) {
    // 实际应用中需要使用如 puppeteer 或 sharp 等库
    return {
      format: "png",
      data: "base64_encoded_png_data",
      size: { width: 800, height: 600 },
    };
  }

  /**
   * 转换为PDF（模拟实现）
   */
  async convertToPDF(svg) {
    // 实际应用中需要使用如 puppeteer 或 jsPDF 等库
    return {
      format: "pdf",
      data: "base64_encoded_pdf_data",
      pages: 1,
    };
  }

  /**
   * 批量生成图表
   */
  async generateBatch(requests) {
    const results = [];
    const errors = [];

    for (const request of requests) {
      try {
        const result = await this.execute(request);
        results.push({
          chartId: request.chartId,
          success: result.success,
          data: result.data,
        });
      } catch (error) {
        errors.push({
          chartId: request.chartId,
          error: error.message,
        });
      }
    }

    return {
      success: errors.length === 0,
      results: results,
      errors: errors,
      summary: {
        total: requests.length,
        successful: results.length,
        failed: errors.length,
      },
    };
  }

  /**
   * 获取可用的图表类型
   */
  getAvailableChartTypes() {
    return [
      {
        id: "traditional_chart",
        name: "传统命盘",
        description: "经典的圆形命盘布局，适合传统解读",
        features: ["宫位分布", "星曜显示", "四化标记"],
        recommendedThemes: ["chinese", "classic"],
      },
      {
        id: "modern_wheel",
        name: "现代轮盘",
        description: "现代化的轮盘设计，视觉效果更佳",
        features: ["扇形宫位", "渐变效果", "动态布局"],
        recommendedThemes: ["classic", "dark"],
      },
      {
        id: "grid_layout",
        name: "网格布局",
        description: "网格式布局，便于详细信息展示",
        features: ["清晰布局", "详细信息", "易于阅读"],
        recommendedThemes: ["minimal", "classic"],
      },
      {
        id: "star_relationship",
        name: "星曜关系图",
        description: "展示星曜之间的相互关系",
        features: ["关系连线", "影响强度", "互动效果"],
        recommendedThemes: ["dark", "minimal"],
      },
      {
        id: "fortune_timeline",
        name: "运势时间线",
        description: "时间轴形式展示运势变化",
        features: ["时间轴", "趋势显示", "关键节点"],
        recommendedThemes: ["classic", "minimal"],
      },
      {
        id: "compatibility_radar",
        name: "合婚雷达图",
        description: "雷达图形式展示合婚匹配度",
        features: ["多维度", "直观对比", "匹配度"],
        recommendedThemes: ["minimal", "classic"],
      },
    ];
  }

  /**
   * 获取可用主题
   */
  getAvailableThemes() {
    return [
      {
        id: "classic",
        name: "经典",
        description: "经典蓝白配色，适合正式场合",
        preview: "#3498db",
      },
      {
        id: "dark",
        name: "暗色",
        description: "深色主题，护眼且现代",
        preview: "#1a1a1a",
      },
      {
        id: "chinese",
        name: "中国风",
        description: "传统中式配色，古典雅致",
        preview: "#dc143c",
      },
      {
        id: "minimal",
        name: "简约",
        description: "简洁明了，突出内容",
        preview: "#ffffff",
      },
    ];
  }

  /**
   * 预览图表
   */
  async previewChart(chartId, type, theme) {
    const previewOptions = {
      chartId: chartId,
      type: type,
      theme: theme,
      width: 400,
      height: 300,
      quality: "draft",
    };

    return await this.execute(previewOptions);
  }

  /**
   * 更新统计信息
   */
  updateStats(type, theme, executionTime) {
    this.stats.totalGenerated++;

    // 按类型统计
    if (!this.stats.byType[type]) {
      this.stats.byType[type] = 0;
    }
    this.stats.byType[type]++;

    // 按主题统计
    if (theme) {
      if (!this.stats.byTheme[theme]) {
        this.stats.byTheme[theme] = 0;
      }
      this.stats.byTheme[theme]++;
    }

    // 平均时间
    this.stats.averageTime =
      (this.stats.averageTime * (this.stats.totalGenerated - 1) +
        executionTime) /
      this.stats.totalGenerated;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      popularType: this.getMostPopular(this.stats.byType),
      popularTheme: this.getMostPopular(this.stats.byTheme),
    };
  }

  /**
   * 获取最受欢迎的选项
   */
  getMostPopular(stats) {
    let maxCount = 0;
    let mostPopular = null;

    for (const [key, count] of Object.entries(stats)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopular = key;
      }
    }

    return mostPopular;
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.charts.clear();
    console.log("图表缓存已清理");
  }

  /**
   * 设置命盘数据
   */
  setChartData(chartId, chartData) {
    this.charts.set(chartId, chartData);
  }

  /**
   * 删除命盘数据
   */
  removeChartData(chartId) {
    return this.charts.delete(chartId);
  }
}

module.exports = {
  EnhancedChartVisualizerTool,
};
