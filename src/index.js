#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const { MCPHandler } = require("./tools/mcp-handler.js");

// 创建MCP处理器实例
const mcpHandler = new MCPHandler();

// 创建MCP服务器
const server = new Server({
  name: "ziwei-doushu",
  version: "1.0.0",
});

// 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_chart",
        description: "生成紫微斗数命盘，根据出生信息排盘",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "姓名（可选）",
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "性别",
            },
            birthDate: {
              type: "string",
              description: "出生日期，格式：YYYY-MM-DD",
            },
            birthTime: {
              type: "string",
              description: "出生时间，格式：HH:mm",
            },
            birthLocation: {
              type: "string",
              description: "出生地点（可选）",
            },
          },
          required: ["gender", "birthDate", "birthTime"],
        },
      },
      {
        name: "interpret_chart",
        description: "解读紫微斗数命盘，提供详细的性格、事业、财运等分析",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID（由generate_chart返回）",
            },
            focusAreas: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "personality",
                  "career",
                  "wealth",
                  "relationship",
                  "health",
                ],
              },
              description: "重点分析的领域",
            },
          },
          required: ["chartId"],
        },
      },
      {
        name: "analyze_fortune",
        description: "分析运势，包括大运、流年、流月等时间维度的运势预测",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID（由generate_chart返回）",
            },
            year: {
              type: "number",
              description: "要分析的年份",
            },
            aspects: {
              type: "array",
              items: {
                type: "string",
                enum: ["career", "wealth", "relationship", "health", "study"],
              },
              description: "要分析的运势方面",
            },
            includeMonthly: {
              type: "boolean",
              description: "是否包含月运分析",
              default: false,
            },
          },
          required: ["chartId", "year"],
        },
      },
      {
        name: "analyze_compatibility",
        description: "合婚分析，分析两人的紫微斗数命盘匹配度",
        inputSchema: {
          type: "object",
          properties: {
            chart1: {
              type: "object",
              description: "第一人的命盘数据",
            },
            chart2: {
              type: "object",
              description: "第二人的命盘数据",
            },
            analysisDepth: {
              type: "string",
              enum: ["basic", "comprehensive"],
              default: "basic",
              description: "分析深度",
            },
          },
          required: ["chart1", "chart2"],
        },
      },
      {
        name: "select_auspicious_date",
        description: "择日功能，根据个人命盘选择适合的吉日良辰",
        inputSchema: {
          type: "object",
          properties: {
            chart: {
              type: "object",
              description: "个人命盘数据",
            },
            eventType: {
              type: "string",
              enum: [
                "wedding",
                "business_opening",
                "moving",
                "travel",
                "investment",
              ],
              description: "事件类型",
            },
            dateRange: {
              type: "object",
              properties: {
                startDate: {
                  type: "string",
                  description: "开始日期 YYYY-MM-DD",
                },
                endDate: {
                  type: "string",
                  description: "结束日期 YYYY-MM-DD",
                },
              },
              required: ["startDate", "endDate"],
            },
            timePreference: {
              type: "string",
              enum: ["morning", "afternoon", "evening", "any"],
              default: "any",
              description: "时间偏好",
            },
          },
          required: ["chart", "eventType", "dateRange"],
        },
      },
      {
        name: "intelligent_interpretation",
        description: "AI智能解盘，提供个性化深度命盘解析",
        inputSchema: {
          type: "object",
          properties: {
            chart: {
              type: "object",
              description: "命盘数据",
            },
            focusAreas: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "personality",
                  "career",
                  "wealth",
                  "relationship",
                  "health",
                  "family",
                ],
              },
              description: "重点分析领域",
            },
            lifeStage: {
              type: "string",
              enum: ["youth", "adult", "middle-age", "elderly"],
              description: "人生阶段",
            },
            currentConcerns: {
              type: "array",
              items: {
                type: "string",
              },
              description: "当前关注的问题",
            },
          },
          required: ["chart"],
        },
      },
      {
        name: "generate_visualization",
        description: "生成命盘可视化图表，支持多种样式和格式",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID（由generate_chart返回）",
            },
            visualizationType: {
              type: "string",
              enum: [
                "traditional_chart",
                "modern_wheel",
                "palace_grid",
                "star_map",
              ],
              default: "traditional_chart",
              description: "可视化类型",
            },
            includeElements: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "main_stars",
                  "auxiliary_stars",
                  "palace_names",
                  "elements",
                ],
              },
              description: "包含的元素",
            },
            colorScheme: {
              type: "string",
              enum: ["traditional", "modern", "colorful", "monochrome"],
              default: "traditional",
              description: "配色方案",
            },
            outputFormat: {
              type: "string",
              enum: ["svg", "png", "html"],
              default: "svg",
              description: "输出格式",
            },
          },
          required: ["chartId"],
        },
      },
      {
        name: "analyze_life_timeline",
        description: "分析人生时间轴，包括大运流年详细分析",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID",
            },
            startAge: {
              type: "number",
              minimum: 0,
              maximum: 120,
              description: "起始年龄",
            },
            endAge: {
              type: "number",
              minimum: 0,
              maximum: 120,
              description: "结束年龄",
            },
            analysisGranularity: {
              type: "string",
              enum: ["decade", "year", "month"],
              default: "year",
              description: "分析粒度",
            },
          },
          required: ["chartId", "startAge", "endAge"],
        },
      },
      {
        name: "analyze_relationships",
        description: "分析人际关系，包括家庭、朋友、同事等",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID",
            },
            relationshipType: {
              type: "string",
              enum: ["family", "romantic", "friendship", "business", "mentor"],
              description: "关系类型",
            },
            targetPersonChart: {
              type: "string",
              description: "对方命盘ID（可选）",
            },
            analysisAspects: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "communication",
                  "trust",
                  "conflict_resolution",
                  "mutual_support",
                  "growth_potential",
                ],
              },
              description: "分析维度",
            },
          },
          required: ["chartId", "relationshipType"],
        },
      },
      {
        name: "career_guidance",
        description: "职业发展指导和决策支持",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID",
            },
            currentAge: {
              type: "number",
              minimum: 16,
              maximum: 70,
              description: "当前年龄",
            },
            careerStage: {
              type: "string",
              enum: [
                "student",
                "entry-level",
                "mid-career",
                "senior",
                "executive",
                "entrepreneur",
              ],
              description: "职业阶段",
            },
            industries: {
              type: "array",
              items: {
                type: "string",
              },
              description: "感兴趣的行业",
            },
            decisionType: {
              type: "string",
              enum: [
                "career_change",
                "job_selection",
                "promotion",
                "entrepreneurship",
                "retirement",
              ],
              description: "决策类型",
            },
          },
          required: ["chartId", "currentAge", "careerStage"],
        },
      },
      {
        name: "health_analysis",
        description: "健康分析和养生建议",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID",
            },
            currentAge: {
              type: "number",
              minimum: 0,
              maximum: 120,
              description: "当前年龄",
            },
            healthConcerns: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "cardiovascular",
                  "digestive",
                  "respiratory",
                  "nervous",
                  "musculoskeletal",
                  "mental_health",
                ],
              },
              description: "健康关注点",
            },
            analysisType: {
              type: "string",
              enum: ["prevention", "current_issues", "long_term_trends"],
              default: "prevention",
              description: "分析类型",
            },
          },
          required: ["chartId", "currentAge"],
        },
      },
      {
        name: "educational_guidance",
        description: "教育和学习指导",
        inputSchema: {
          type: "object",
          properties: {
            chartId: {
              type: "string",
              description: "命盘ID",
            },
            studentAge: {
              type: "number",
              minimum: 3,
              maximum: 30,
              description: "学生年龄",
            },
            educationLevel: {
              type: "string",
              enum: [
                "preschool",
                "elementary",
                "middle_school",
                "high_school",
                "university",
                "graduate",
              ],
              description: "教育阶段",
            },
            subjectAreas: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "mathematics",
                  "sciences",
                  "languages",
                  "arts",
                  "social_studies",
                  "technology",
                  "sports",
                ],
              },
              description: "学科领域",
            },
            guidanceType: {
              type: "string",
              enum: [
                "aptitude_assessment",
                "study_methods",
                "career_planning",
                "exam_preparation",
              ],
              description: "指导类型",
            },
          },
          required: ["chartId", "studentAge", "educationLevel"],
        },
      },
    ],
  };
});

// 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "generate_chart":
        result = await mcpHandler.handleGenerateChart(args);
        break;
      case "interpret_chart":
        result = await mcpHandler.handleInterpretChart(args);
        break;
      case "analyze_fortune":
        result = await mcpHandler.handleAnalyzeFortune(args);
        break;
      case "analyze_compatibility":
        result = await mcpHandler.handleAnalyzeCompatibility(args);
        break;
      case "select_auspicious_date":
        result = await mcpHandler.handleSelectAuspiciousDate(args);
        break;
      case "intelligent_interpretation":
        result = await mcpHandler.handleIntelligentInterpretation(args);
        break;
      case "generate_visualization":
        result = await mcpHandler.handleGenerateVisualization(args);
        break;
      case "analyze_life_timeline":
        result = await mcpHandler.handleAnalyzeLifeTimeline(args);
        break;
      case "analyze_relationships":
        result = await mcpHandler.handleAnalyzeRelationships(args);
        break;
      case "career_guidance":
        result = await mcpHandler.handleCareerGuidance(args);
        break;
      case "health_analysis":
        result = await mcpHandler.handleHealthAnalysis(args);
        break;
      case "educational_guidance":
        result = await mcpHandler.handleEducationalGuidance(args);
        break;
      default:
        result = {
          success: false,
          error: `未知的工具: ${name}`,
        };
    }

    // 确保返回MCP标准格式
    if (result && result.content) {
      return result;
    } else if (result && result.success) {
      return {
        content: [
          {
            type: "text",
            text:
              typeof result.data === "string"
                ? result.data
                : JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } else {
      const errorMessage = result?.error || "未知错误";
      return {
        content: [
          {
            type: "text",
            text: `错误: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    console.error(`工具调用失败 [${name}]:`, error);
    return {
      content: [
        {
          type: "text",
          text: `工具调用失败: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("紫微斗数MCP服务器已启动");
}

// 导出模块供测试使用
module.exports = {
  server,
  mcpHandler,
  main,
};

// 如果直接运行此文件，启动服务器
if (require.main === module) {
  main().catch((error) => {
    console.error("服务器启动失败:", error);
    process.exit(1);
  });
}
