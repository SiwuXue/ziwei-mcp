// persistent-chart-tool.js - 带持久化功能的紫微斗数MCP工具

const { DataPersistenceManager } = require("../core/data-persistence");
const { EnhancedChartGenerator } = require("../core/enhanced-chart-generator");
const { IntegratedSVGGenerator } = require("../core/integrated-svg-generator");

/**
 * 带持久化功能的紫微斗数图表工具
 * 支持命盘生成、保存、查询、分析等完整功能
 */
class PersistentChartTool {
  constructor(config = {}) {
    this.name = "persistent_ziwei_chart";
    this.description = "紫微斗数命盘生成与管理工具，支持数据持久化";

    // 初始化数据持久化管理器
    this.persistenceManager = new DataPersistenceManager({
      type: config.storageType || "sqlite", // 'sqlite' | 'mongodb' | 'hybrid'
      sqlite: {
        path: config.sqlitePath || "./data/ziwei.db",
        enableWAL: true,
      },
      mongodb: config.mongodb || {
        connectionString:
          process.env.MONGODB_URI || "mongodb://localhost:27017/ziwei",
        options: {
          useUnifiedTopology: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
        },
      },
      cache: {
        enabled: true,
        maxSize: 100,
        ttl: 300000, // 5分钟
      },
      encryption: {
        enabled: config.enableEncryption || false,
        key: process.env.ENCRYPTION_KEY || null,
      },
      sync: {
        enabled: config.enableSync || false,
        interval: 300000, // 5分钟
      },
    });

    // 初始化图表生成器
    this.chartGenerator = new EnhancedChartGenerator();
    this.svgGenerator = new IntegratedSVGGenerator();

    this.isInitialized = false;
  }

  /**
   * 获取工具定义
   */
  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: [
              "generate",
              "save",
              "get",
              "list",
              "search",
              "delete",
              "analyze",
              "compare",
              "export",
              "import",
              "backup",
              "restore",
              "statistics",
            ],
            description: "操作类型",
          },
          // 生成命盘参数
          birthInfo: {
            type: "object",
            properties: {
              year: { type: "integer", minimum: 1900, maximum: 2100 },
              month: { type: "integer", minimum: 1, maximum: 12 },
              day: { type: "integer", minimum: 1, maximum: 31 },
              hour: { type: "integer", minimum: 0, maximum: 23 },
              minute: { type: "integer", minimum: 0, maximum: 59, default: 0 },
              gender: { type: "string", enum: ["male", "female"] },
              isLeapMonth: { type: "boolean", default: false },
              timezone: { type: "string", default: "Asia/Shanghai" },
              location: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  longitude: { type: "number" },
                  latitude: { type: "number" },
                },
              },
            },
            required: ["year", "month", "day", "hour", "gender"],
          },
          // 用户和权限
          userId: {
            type: "string",
            description: "用户ID，用于权限控制和数据隔离",
          },
          // 命盘ID（用于查询、删除等操作）
          chartId: {
            type: "string",
            description: "命盘ID",
          },
          // 查询参数
          queryOptions: {
            type: "object",
            properties: {
              limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
              offset: { type: "integer", minimum: 0, default: 0 },
              sortBy: {
                type: "string",
                enum: ["createdAt", "updatedAt", "birthYear"],
                default: "createdAt",
              },
              sortOrder: {
                type: "string",
                enum: ["asc", "desc"],
                default: "desc",
              },
              includeAnalysis: { type: "boolean", default: false },
            },
          },
          // 搜索参数
          searchQuery: {
            type: "object",
            properties: {
              stars: {
                type: "array",
                items: { type: "string" },
                description: "按星曜搜索",
              },
              patterns: {
                type: "array",
                items: { type: "string" },
                description: "按格局搜索",
              },
              yearRange: {
                type: "object",
                properties: {
                  start: { type: "integer" },
                  end: { type: "integer" },
                },
                description: "按出生年份范围搜索",
              },
              gender: { type: "string", enum: ["male", "female"] },
            },
          },
          // 分析选项
          analysisOptions: {
            type: "object",
            properties: {
              includePersonality: { type: "boolean", default: true },
              includeCareer: { type: "boolean", default: true },
              includeWealth: { type: "boolean", default: true },
              includeRelationship: { type: "boolean", default: true },
              includeHealth: { type: "boolean", default: true },
              includeLuck: { type: "boolean", default: true },
              detailLevel: {
                type: "string",
                enum: ["basic", "detailed", "comprehensive"],
                default: "detailed",
              },
            },
          },
          // SVG生成选项
          svgOptions: {
            type: "object",
            properties: {
              chartType: {
                type: "string",
                enum: [
                  "traditional",
                  "modern",
                  "grid",
                  "relationship",
                  "timeline",
                  "radar",
                ],
                default: "traditional",
              },
              theme: {
                type: "string",
                enum: ["classic", "dark", "chinese", "minimal"],
                default: "classic",
              },
              size: {
                type: "object",
                properties: {
                  width: {
                    type: "integer",
                    minimum: 400,
                    maximum: 2000,
                    default: 800,
                  },
                  height: {
                    type: "integer",
                    minimum: 400,
                    maximum: 2000,
                    default: 800,
                  },
                },
              },
              includeAnimation: { type: "boolean", default: false },
              includeInteraction: { type: "boolean", default: false },
            },
          },
          // 导出选项
          exportOptions: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["json", "csv", "pdf"],
                default: "json",
              },
              includeAnalysis: { type: "boolean", default: true },
              includeSVG: { type: "boolean", default: false },
            },
          },
          // 备份/恢复路径
          filePath: {
            type: "string",
            description: "文件路径（用于备份/恢复/导入/导出）",
          },
          // 比较命盘的ID列表
          chartIds: {
            type: "array",
            items: { type: "string" },
            description: "命盘ID列表（用于比较分析）",
          },
        },
        required: ["action"],
        allOf: [
          {
            if: { properties: { action: { const: "generate" } } },
            then: { required: ["birthInfo", "userId"] },
          },
          {
            if: { properties: { action: { const: "save" } } },
            then: { required: ["birthInfo", "userId"] },
          },
          {
            if: { properties: { action: { enum: ["get", "delete"] } } },
            then: { required: ["chartId", "userId"] },
          },
          {
            if: { properties: { action: { const: "list" } } },
            then: { required: ["userId"] },
          },
          {
            if: { properties: { action: { const: "search" } } },
            then: { required: ["searchQuery", "userId"] },
          },
          {
            if: { properties: { action: { const: "compare" } } },
            then: { required: ["chartIds", "userId"] },
          },
          {
            if: {
              properties: {
                action: { enum: ["backup", "restore", "export", "import"] },
              },
            },
            then: { required: ["filePath"] },
          },
        ],
      },
    };
  }

  /**
   * 执行工具操作
   */
  async execute(params) {
    try {
      // 确保系统已初始化
      await this.ensureInitialized();

      // 参数验证
      this.validateParams(params);

      // 根据操作类型执行相应功能
      switch (params.action) {
        case "generate":
          return await this.generateChart(params);
        case "save":
          return await this.saveChart(params);
        case "get":
          return await this.getChart(params);
        case "list":
          return await this.listCharts(params);
        case "search":
          return await this.searchCharts(params);
        case "delete":
          return await this.deleteChart(params);
        case "analyze":
          return await this.analyzeChart(params);
        case "compare":
          return await this.compareCharts(params);
        case "export":
          return await this.exportData(params);
        case "import":
          return await this.importData(params);
        case "backup":
          return await this.backupData(params);
        case "restore":
          return await this.restoreData(params);
        case "statistics":
          return await this.getStatistics(params);
        default:
          throw new Error(`不支持的操作类型: ${params.action}`);
      }
    } catch (error) {
      console.error("工具执行失败:", error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 生成命盘（不保存）
   */
  async generateChart(params) {
    const { birthInfo, analysisOptions = {}, svgOptions = {} } = params;

    // 生成命盘数据
    const chartData = await this.chartGenerator.generateChart(birthInfo);

    // 生成分析报告
    if (analysisOptions.detailLevel !== "basic") {
      chartData.analysis = await this.chartGenerator.generateAnalysis(
        chartData,
        analysisOptions,
      );
    }

    // 生成SVG图表
    const svgResult = await this.svgGenerator.generateChart(
      chartData,
      svgOptions.chartType || "traditional",
      {
        theme: svgOptions.theme || "classic",
        size: svgOptions.size || { width: 800, height: 800 },
        includeAnimation: svgOptions.includeAnimation || false,
        includeInteraction: svgOptions.includeInteraction || false,
      },
    );

    return {
      success: true,
      data: {
        chart: chartData,
        svg: svgResult.svg,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: "2.0.0",
          generator: "enhanced-chart-generator",
        },
      },
    };
  }

  /**
   * 生成并保存命盘
   */
  async saveChart(params) {
    const { birthInfo, userId, analysisOptions = {}, svgOptions = {} } = params;

    // 先生成命盘
    const generateResult = await this.generateChart({
      birthInfo,
      analysisOptions,
      svgOptions,
    });

    if (!generateResult.success) {
      return generateResult;
    }

    // 准备保存的数据
    const chartToSave = {
      ...generateResult.data.chart,
      userId,
      svg: generateResult.data.svg,
      metadata: {
        ...generateResult.data.metadata,
        savedAt: new Date().toISOString(),
      },
    };

    // 保存到数据库
    const saveResult = await this.persistenceManager.saveChart(chartToSave);

    if (saveResult.success) {
      return {
        success: true,
        data: {
          chartId: saveResult.chartId,
          chart: chartToSave,
          savedAt: saveResult.savedAt,
        },
      };
    } else {
      return saveResult;
    }
  }

  /**
   * 获取命盘
   */
  async getChart(params) {
    const { chartId, userId } = params;

    const chart = await this.persistenceManager.getChart(chartId, userId);

    if (!chart) {
      return {
        success: false,
        error: "命盘不存在或无权访问",
      };
    }

    return {
      success: true,
      data: {
        chart,
      },
    };
  }

  /**
   * 列出用户的命盘
   */
  async listCharts(params) {
    const { userId, queryOptions = {} } = params;

    const charts = await this.persistenceManager.getUserCharts(
      userId,
      queryOptions,
    );

    return {
      success: true,
      data: {
        charts,
        total: charts.length,
        options: queryOptions,
      },
    };
  }

  /**
   * 搜索命盘
   */
  async searchCharts(params) {
    const { searchQuery, userId } = params;

    // 添加用户限制
    const query = {
      ...searchQuery,
      userId,
    };

    const charts = await this.persistenceManager.searchCharts(query);

    return {
      success: true,
      data: {
        charts,
        total: charts.length,
        query: searchQuery,
      },
    };
  }

  /**
   * 删除命盘
   */
  async deleteChart(params) {
    const { chartId, userId } = params;

    await this.persistenceManager.deleteChart(chartId, userId);

    return {
      success: true,
      data: {
        chartId,
        deletedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * 分析命盘
   */
  async analyzeChart(params) {
    const { chartId, userId, analysisOptions = {} } = params;

    // 获取命盘数据
    const chart = await this.persistenceManager.getChart(chartId, userId);

    if (!chart) {
      return {
        success: false,
        error: "命盘不存在或无权访问",
      };
    }

    // 生成详细分析
    const analysis = await this.chartGenerator.generateAnalysis(
      chart,
      analysisOptions,
    );

    // 更新命盘数据
    chart.analysis = analysis;
    chart.metadata.lastAnalyzedAt = new Date().toISOString();

    await this.persistenceManager.saveChart(chart);

    return {
      success: true,
      data: {
        chartId,
        analysis,
        analyzedAt: chart.metadata.lastAnalyzedAt,
      },
    };
  }

  /**
   * 比较多个命盘
   */
  async compareCharts(params) {
    const { chartIds, userId } = params;

    if (chartIds.length < 2) {
      return {
        success: false,
        error: "至少需要两个命盘进行比较",
      };
    }

    // 获取所有命盘
    const charts = [];
    for (const chartId of chartIds) {
      const chart = await this.persistenceManager.getChart(chartId, userId);
      if (chart) {
        charts.push(chart);
      }
    }

    if (charts.length < 2) {
      return {
        success: false,
        error: "找不到足够的命盘进行比较",
      };
    }

    // 生成比较分析
    const comparison = await this.chartGenerator.compareCharts(charts);

    return {
      success: true,
      data: {
        charts: charts.map((c) => ({
          id: c.id,
          birthInfo: c.birthInfo,
          metadata: c.metadata,
        })),
        comparison,
        comparedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * 导出数据
   */
  async exportData(params) {
    const { userId, filePath, exportOptions = {} } = params;

    const charts = await this.persistenceManager.getUserCharts(userId, {
      includeAnalysis: exportOptions.includeAnalysis,
    });

    const exportData = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      userId,
      totalCharts: charts.length,
      charts: charts.map((chart) => {
        const exported = {
          id: chart.id,
          birthInfo: chart.birthInfo,
          palaces: chart.palaces,
          stars: chart.stars,
          patterns: chart.patterns,
          metadata: chart.metadata,
        };

        if (exportOptions.includeAnalysis && chart.analysis) {
          exported.analysis = chart.analysis;
        }

        if (exportOptions.includeSVG && chart.svg) {
          exported.svg = chart.svg;
        }

        return exported;
      }),
    };

    // 根据格式导出
    const fs = require("fs");
    const path = require("path");

    switch (exportOptions.format) {
      case "json":
        fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
        break;
      case "csv":
        const csvData = this.convertToCSV(exportData.charts);
        fs.writeFileSync(filePath, csvData);
        break;
      case "pdf":
        // PDF导出需要额外的库支持
        throw new Error("PDF导出功能暂未实现");
      default:
        throw new Error(`不支持的导出格式: ${exportOptions.format}`);
    }

    return {
      success: true,
      data: {
        filePath,
        format: exportOptions.format,
        totalCharts: charts.length,
        exportedAt: exportData.exportedAt,
      },
    };
  }

  /**
   * 导入数据
   */
  async importData(params) {
    const { userId, filePath } = params;

    const fs = require("fs");

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: "导入文件不存在",
      };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const importData = JSON.parse(fileContent);

    if (!importData.charts || !Array.isArray(importData.charts)) {
      return {
        success: false,
        error: "导入文件格式无效",
      };
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const chart of importData.charts) {
      try {
        // 更新用户ID和元数据
        chart.userId = userId;
        chart.metadata = {
          ...chart.metadata,
          importedAt: new Date().toISOString(),
          originalId: chart.id,
        };

        // 生成新的ID避免冲突
        delete chart.id;

        await this.persistenceManager.saveChart(chart);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push({
          chart: chart.id || "unknown",
          error: error.message,
        });
      }
    }

    return {
      success: true,
      data: {
        totalCharts: importData.charts.length,
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // 只返回前10个错误
        importedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * 备份数据
   */
  async backupData(params) {
    const { filePath } = params;

    const result = await this.persistenceManager.backup(filePath);

    return {
      success: true,
      data: {
        backupPath: filePath,
        backedUpAt: new Date().toISOString(),
        ...result,
      },
    };
  }

  /**
   * 恢复数据
   */
  async restoreData(params) {
    const { filePath } = params;

    const result = await this.persistenceManager.restore(filePath);

    return {
      success: true,
      data: {
        restoredFrom: filePath,
        restoredAt: new Date().toISOString(),
        ...result,
      },
    };
  }

  /**
   * 获取统计信息
   */
  async getStatistics(params) {
    const { userId } = params;

    const stats = await this.persistenceManager.getStatistics(userId);

    return {
      success: true,
      data: {
        statistics: stats,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  // 私有方法

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.persistenceManager.initialize();
      this.isInitialized = true;
    }
  }

  validateParams(params) {
    if (!params || typeof params !== "object") {
      throw new Error("参数必须是对象");
    }

    if (!params.action) {
      throw new Error("必须指定操作类型");
    }

    // 根据操作类型验证必需参数
    const requiredFields = {
      generate: ["birthInfo", "userId"],
      save: ["birthInfo", "userId"],
      get: ["chartId", "userId"],
      delete: ["chartId", "userId"],
      list: ["userId"],
      search: ["searchQuery", "userId"],
      analyze: ["chartId", "userId"],
      compare: ["chartIds", "userId"],
      export: ["userId", "filePath"],
      import: ["userId", "filePath"],
      backup: ["filePath"],
      restore: ["filePath"],
      statistics: ["userId"],
    };

    const required = requiredFields[params.action];
    if (required) {
      for (const field of required) {
        if (!params[field]) {
          throw new Error(`操作 ${params.action} 需要参数: ${field}`);
        }
      }
    }
  }

  convertToCSV(charts) {
    if (charts.length === 0) return "";

    const headers = [
      "ID",
      "用户ID",
      "出生年",
      "出生月",
      "出生日",
      "出生时",
      "性别",
      "创建时间",
      "更新时间",
    ];

    const rows = charts.map((chart) => [
      chart.id,
      chart.userId,
      chart.birthInfo.year,
      chart.birthInfo.month,
      chart.birthInfo.day,
      chart.birthInfo.hour,
      chart.birthInfo.gender,
      chart.metadata?.createdAt || "",
      chart.metadata?.updatedAt || "",
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  /**
   * 关闭工具
   */
  async close() {
    if (this.persistenceManager) {
      await this.persistenceManager.close();
    }
    this.isInitialized = false;
  }
}

module.exports = { PersistentChartTool };
