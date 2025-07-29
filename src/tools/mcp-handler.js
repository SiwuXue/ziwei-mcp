/**
 * MCP工具处理器
 * 处理所有紫微斗数相关的工具调用
 */

const { ChartGenerator } = require("../core/chart-generator.js");
const { ChartInterpreter } = require("./chart-interpreter.js");
const { FortuneAnalyzer } = require("./fortune-analyzer.js");
const { CompatibilityAnalyzer } = require("./compatibility-analyzer.js");
const { DateSelector } = require("./date-selector.js");
const { ChartVisualizer } = require("./chart-visualizer.js");
const { LifeTimelineAnalyzer } = require("./life-timeline.js");
const { RelationshipAnalyzer } = require("./relationship-analyzer.js");
const { CareerGuidance } = require("./career-guidance.js");
const { HealthAnalyzer } = require("./health-analyzer.js");
const EducationGuidance = require("./education-guidance.js");
const { PalaceAnalyzer } = require("./palace-analyzer.js");

class MCPHandler {
  constructor() {
    this.chartGenerator = new ChartGenerator();
    this.chartInterpreter = new ChartInterpreter();
    this.fortuneAnalyzer = new FortuneAnalyzer();
    this.compatibilityAnalyzer = new CompatibilityAnalyzer();
    this.dateSelector = new DateSelector();
    this.chartVisualizer = new ChartVisualizer();
    this.lifeTimelineAnalyzer = new LifeTimelineAnalyzer();
    this.relationshipAnalyzer = new RelationshipAnalyzer();
    this.careerGuidance = new CareerGuidance();
    this.healthAnalyzer = new HealthAnalyzer();
    this.educationGuidance = new EducationGuidance();
    this.palaceAnalyzer = new PalaceAnalyzer();
  }

  /**
   * 处理生成命盘请求
   */
  async handleGenerateChart(args) {
    try {
      const result = await this.chartGenerator.generateChart(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("生成命盘失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理解读命盘请求
   */
  async handleInterpretChart(args) {
    try {
      const result = await this.chartInterpreter.interpretChart(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("解读命盘失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理运势分析请求
   */
  async handleAnalyzeFortune(args) {
    try {
      const result = await this.fortuneAnalyzer.analyzeFortune(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("运势分析失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理合婚分析请求
   */
  async handleAnalyzeCompatibility(args) {
    try {
      const result =
        await this.compatibilityAnalyzer.analyzeCompatibility(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("合婚分析失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理择日请求
   */
  async handleSelectAuspiciousDate(args) {
    try {
      const result = await this.dateSelector.selectAuspiciousDate(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("择日失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理智能解盘请求
   */
  async handleIntelligentInterpretation(args) {
    try {
      const result =
        await this.chartInterpreter.intelligentInterpretation(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("智能解盘失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理生成可视化请求
   */
  async handleGenerateVisualization(args) {
    try {
      // 获取命盘数据
      const chart = await this.getChartById(args.chartId);
      if (!chart) {
        throw new Error(`未找到命盘: ${args.chartId}`);
      }

      const visualizationInput = {
        chart,
        visualizationType: args.visualizationType || "traditional_chart",
        includeElements: args.includeElements || ["main_stars", "palace_names"],
        colorScheme: args.colorScheme || "traditional",
        outputFormat: args.outputFormat || "svg",
      };

      const result =
        await this.chartVisualizer.generateVisualization(visualizationInput);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                data: result,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      console.error("生成可视化失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理人生时间轴分析请求
   */
  async handleAnalyzeLifeTimeline(args) {
    try {
      const result = await this.lifeTimelineAnalyzer.analyzeLifeTimeline(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("人生时间轴分析失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理人际关系分析请求
   */
  async handleAnalyzeRelationships(args) {
    try {
      const result = await this.relationshipAnalyzer.analyzeRelationships(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("人际关系分析失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理职业指导请求
   */
  async handleCareerGuidance(args) {
    try {
      const result = await this.careerGuidance.provideGuidance(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("职业指导失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理健康分析请求
   */
  async handleHealthAnalysis(args) {
    try {
      const result = await this.healthAnalyzer.analyzeHealth(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("健康分析失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 处理教育指导请求
   */
  async handleEducationalGuidance(args) {
    try {
      const result = await this.educationGuidance.provideGuidance(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("教育指导失败:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 根据ID获取命盘数据
   */
  async getChartById(chartId) {
    // 这里应该从数据库或缓存中获取命盘数据
    // 现在返回模拟数据
    return {
      id: chartId,
      info: {
        name: "张三",
        gender: "male",
        birthDate: "1990-01-01",
        birthTime: "12:00",
        lunarDate: "农历己巳年十二月初五",
        age: 34,
        destinyPalace: "palace_0",
        bodyPalace: "palace_6",
      },
      palaces: [
        {
          id: "palace_0",
          name: "命宫",
          position: 0,
          earthlyBranch: "子",
          element: "water",
          stars: [
            { name: "紫微", type: "main" },
            { name: "天府", type: "main" },
            { name: "左辅", type: "auxiliary" },
          ],
          mainStar: { name: "紫微" },
          brightness: "庙",
          strength: 85,
          isBodyPalace: false,
        },
        // 其他宫位数据...
      ],
    };
  }
}

module.exports = {
  MCPHandler,
};
