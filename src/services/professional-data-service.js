/**
 * 专业紫微斗数数据源服务
 * 集成多个专业数据源和API接口
 */

const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

/**
 * 专业数据源配置
 */
const DATA_SOURCES = {
  // 中华万年历API（示例）
  ZHWNL_API: {
    baseUrl: "https://api.zhwnl.com",
    endpoints: {
      lunarCalendar: "/lunar/calendar",
      solarTerms: "/solar/terms",
      ganzhiCalendar: "/ganzhi/calendar",
    },
    apiKey: process.env.ZHWNL_API_KEY || "your_api_key_here",
  },

  // 紫微斗数专业数据库API（示例）
  ZIWEI_PRO_API: {
    baseUrl: "https://api.ziwei-pro.com",
    endpoints: {
      starPositions: "/stars/positions",
      patterns: "/patterns/analysis",
      interpretations: "/interpretations",
    },
    apiKey: process.env.ZIWEI_PRO_API_KEY || "your_api_key_here",
  },

  // 本地专业数据库
  LOCAL_DATABASE: {
    starsData: path.join(__dirname, "../data/professional-stars.json"),
    patternsData: path.join(__dirname, "../data/professional-patterns.json"),
    interpretationsData: path.join(
      __dirname,
      "../data/professional-interpretations.json",
    ),
  },
};

class ProfessionalDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24小时缓存
  }

  /**
   * 获取精确的农历信息
   */
  async getPreciseLunarInfo(solarDate) {
    const cacheKey = `lunar_${solarDate.year}_${solarDate.month}_${solarDate.day}`;

    // 检查缓存
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // 尝试从专业API获取
      const apiResult = await this.fetchFromZhwnlApi(solarDate);
      if (apiResult) {
        this.cache.set(cacheKey, {
          data: apiResult,
          timestamp: Date.now(),
        });
        return apiResult;
      }
    } catch (error) {
      console.warn("专业API调用失败，使用本地算法:", error.message);
    }

    // 降级到本地算法
    return this.calculateLunarLocal(solarDate);
  }

  /**
   * 从中华万年历API获取农历信息
   */
  async fetchFromZhwnlApi(solarDate) {
    const url = `${DATA_SOURCES.ZHWNL_API.baseUrl}${DATA_SOURCES.ZHWNL_API.endpoints.lunarCalendar}`;

    const response = await axios.get(url, {
      params: {
        year: solarDate.year,
        month: solarDate.month,
        day: solarDate.day,
        apikey: DATA_SOURCES.ZHWNL_API.apiKey,
      },
      timeout: 5000,
    });

    if (response.data && response.data.code === 200) {
      return {
        year: response.data.data.lunar_year,
        month: response.data.data.lunar_month,
        day: response.data.data.lunar_day,
        isLeapMonth: response.data.data.is_leap_month,
        yearInGanZhi: response.data.data.year_ganzhi,
        monthInGanZhi: response.data.data.month_ganzhi,
        dayInGanZhi: response.data.data.day_ganzhi,
        hourInGanZhi: this.calculateHourGanZhi(
          solarDate.hour,
          response.data.data.day_ganzhi,
        ),
        solarTerms: response.data.data.solar_terms,
        zodiac: response.data.data.zodiac,
        constellation: response.data.data.constellation,
      };
    }

    throw new Error("API返回数据格式错误");
  }

  /**
   * 获取专业星曜定位数据
   */
  async getProfessionalStarPositions(lunarInfo, gender) {
    try {
      // 尝试从专业紫微斗数API获取
      const apiResult = await this.fetchStarPositionsFromApi(lunarInfo, gender);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn("专业星曜API调用失败，使用本地数据:", error.message);
    }

    // 降级到本地专业数据
    return this.calculateStarPositionsLocal(lunarInfo, gender);
  }

  /**
   * 从专业API获取星曜定位
   */
  async fetchStarPositionsFromApi(lunarInfo, gender) {
    const url = `${DATA_SOURCES.ZIWEI_PRO_API.baseUrl}${DATA_SOURCES.ZIWEI_PRO_API.endpoints.starPositions}`;

    const response = await axios.post(
      url,
      {
        lunar_year: lunarInfo.year,
        lunar_month: lunarInfo.month,
        lunar_day: lunarInfo.day,
        lunar_hour: lunarInfo.hour,
        gender: gender,
        year_ganzhi: lunarInfo.yearInGanZhi,
        month_ganzhi: lunarInfo.monthInGanZhi,
        day_ganzhi: lunarInfo.dayInGanZhi,
        hour_ganzhi: lunarInfo.hourInGanZhi,
      },
      {
        headers: {
          Authorization: `Bearer ${DATA_SOURCES.ZIWEI_PRO_API.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    if (response.data && response.data.success) {
      return {
        mainStars: response.data.data.main_stars,
        auxiliaryStars: response.data.data.auxiliary_stars,
        maleficStars: response.data.data.malefic_stars,
        brightness: response.data.data.brightness,
        sihua: response.data.data.sihua,
        accuracy: "professional_api",
      };
    }

    throw new Error("专业API返回数据格式错误");
  }

  /**
   * 获取专业格局分析
   */
  async getProfessionalPatternAnalysis(chart) {
    try {
      // 尝试从专业API获取格局分析
      const apiResult = await this.fetchPatternAnalysisFromApi(chart);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn("专业格局API调用失败，使用本地分析:", error.message);
    }

    // 降级到本地专业分析
    return this.analyzePatternLocal(chart);
  }

  /**
   * 从专业API获取格局分析
   */
  async fetchPatternAnalysisFromApi(chart) {
    const url = `${DATA_SOURCES.ZIWEI_PRO_API.baseUrl}${DATA_SOURCES.ZIWEI_PRO_API.endpoints.patterns}`;

    const response = await axios.post(
      url,
      {
        palaces: chart.palaces,
        destiny_palace: chart.info.destinyPalace,
        body_palace: chart.info.bodyPalace,
        sihua: chart.sihua,
        lunar_info: chart.lunarInfo,
      },
      {
        headers: {
          Authorization: `Bearer ${DATA_SOURCES.ZIWEI_PRO_API.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    if (response.data && response.data.success) {
      return {
        patterns: response.data.data.patterns,
        strength_analysis: response.data.data.strength_analysis,
        life_phases: response.data.data.life_phases,
        recommendations: response.data.data.recommendations,
        accuracy: "professional_api",
      };
    }

    throw new Error("专业格局API返回数据格式错误");
  }

  /**
   * 获取专业解释文本
   */
  async getProfessionalInterpretations(chart, analysisType = "comprehensive") {
    try {
      // 尝试从专业API获取解释
      const apiResult = await this.fetchInterpretationsFromApi(
        chart,
        analysisType,
      );
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn("专业解释API调用失败，使用本地数据:", error.message);
    }

    // 降级到本地专业解释
    return this.generateInterpretationsLocal(chart, analysisType);
  }

  /**
   * 从专业API获取解释文本
   */
  async fetchInterpretationsFromApi(chart, analysisType) {
    const url = `${DATA_SOURCES.ZIWEI_PRO_API.baseUrl}${DATA_SOURCES.ZIWEI_PRO_API.endpoints.interpretations}`;

    const response = await axios.post(
      url,
      {
        chart: chart,
        analysis_type: analysisType,
        detail_level: "professional",
        language: "zh-CN",
      },
      {
        headers: {
          Authorization: `Bearer ${DATA_SOURCES.ZIWEI_PRO_API.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      },
    );

    if (response.data && response.data.success) {
      return {
        personality: response.data.data.personality,
        career: response.data.data.career,
        wealth: response.data.data.wealth,
        relationships: response.data.data.relationships,
        health: response.data.data.health,
        fortune: response.data.data.fortune,
        recommendations: response.data.data.recommendations,
        accuracy: "professional_api",
      };
    }

    throw new Error("专业解释API返回数据格式错误");
  }

  /**
   * 加载本地专业数据
   */
  async loadLocalProfessionalData(dataType) {
    const filePath = DATA_SOURCES.LOCAL_DATABASE[dataType];
    if (!filePath) {
      throw new Error(`未知的数据类型: ${dataType}`);
    }

    try {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.warn(`加载本地专业数据失败: ${filePath}`, error.message);
      return null;
    }
  }

  /**
   * 本地农历计算（降级方案）
   */
  calculateLunarLocal(solarDate) {
    // 这里使用现有的lunar-javascript库作为降级方案
    const { CalendarConverter } = require("../core/calendar.js");
    return CalendarConverter.solarToLunar(solarDate);
  }

  /**
   * 本地星曜定位计算（降级方案）
   */
  async calculateStarPositionsLocal(lunarInfo, gender) {
    // 使用增强版算法
    const {
      EnhancedChartGenerator,
    } = require("../core/enhanced-chart-generator.js");
    const generator = new EnhancedChartGenerator();

    // 这里可以调用增强版的星曜定位算法
    const palaces = generator.calculatePalacesEnhanced(lunarInfo, gender);
    generator.placeStarsEnhanced(palaces, lunarInfo);

    return {
      palaces: palaces,
      accuracy: "enhanced_local",
    };
  }

  /**
   * 本地格局分析（降级方案）
   */
  async analyzePatternLocal(chart) {
    const professionalPatterns =
      await this.loadLocalProfessionalData("patternsData");

    if (professionalPatterns) {
      // 使用专业格局数据进行分析
      return this.analyzeWithProfessionalPatterns(chart, professionalPatterns);
    }

    // 使用基础格局分析
    const {
      EnhancedChartGenerator,
    } = require("../core/enhanced-chart-generator.js");
    const generator = new EnhancedChartGenerator();
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const bodyPalace = chart.palaces.find(
      (p) => p.id === chart.info.bodyPalace,
    );

    return {
      patterns: generator.recognizePatterns(
        chart.palaces,
        destinyPalace,
        bodyPalace,
      ),
      accuracy: "enhanced_local",
    };
  }

  /**
   * 本地专业解释生成（降级方案）
   */
  async generateInterpretationsLocal(chart, analysisType) {
    const interpretationsData = await this.loadLocalProfessionalData(
      "interpretationsData",
    );

    if (interpretationsData) {
      return this.generateWithProfessionalData(
        chart,
        interpretationsData,
        analysisType,
      );
    }

    // 使用基础解释生成
    return this.generateBasicInterpretations(chart, analysisType);
  }

  /**
   * 使用专业格局数据进行分析
   */
  analyzeWithProfessionalPatterns(chart, professionalPatterns) {
    const patterns = [];
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const destinyStars = destinyPalace.stars.map((s) => s.name);

    // 遍历专业格局数据
    for (const [patternName, patternData] of Object.entries(
      professionalPatterns,
    )) {
      if (
        this.checkProfessionalPattern(patternData, chart.palaces, destinyStars)
      ) {
        patterns.push({
          name: patternName,
          type: patternData.type,
          strength: patternData.strength,
          description: patternData.description,
          influence: patternData.influence,
          professional_notes: patternData.professional_notes,
          accuracy: "professional_local",
        });
      }
    }

    return {
      patterns: patterns,
      strength_analysis: this.analyzeOverallStrength(patterns),
      accuracy: "professional_local",
    };
  }

  /**
   * 检查专业格局是否成立
   */
  checkProfessionalPattern(patternData, palaces, destinyStars) {
    // 实现更复杂的格局检查逻辑
    const conditions = patternData.conditions || [];

    return conditions.every((condition) => {
      switch (condition.type) {
        case "stars_in_palace":
          return this.checkStarsInPalace(condition, palaces);
        case "stars_brightness":
          return this.checkStarsBrightness(condition, palaces);
        case "sihua_combination":
          return this.checkSihuaCombination(condition, palaces);
        case "palace_relationship":
          return this.checkPalaceRelationship(condition, palaces);
        default:
          return false;
      }
    });
  }

  /**
   * 计算时辰干支
   */
  calculateHourGanZhi(hour, dayGanZhi) {
    const hourIndex = Math.floor(hour / 2);
    const dayGanIndex = "甲乙丙丁戊己庚辛壬癸".indexOf(dayGanZhi[0]);

    // 时干计算公式：日干 * 2 + 时支序号
    const hourGanIndex = (dayGanIndex * 2 + hourIndex) % 10;
    const hourGan = "甲乙丙丁戊己庚辛壬癸"[hourGanIndex];
    const hourZhi = "子丑寅卯辰巳午未申酉戌亥"[hourIndex];

    return hourGan + hourZhi;
  }

  /**
   * 数据源健康检查
   */
  async healthCheck() {
    const results = {
      zhwnl_api: false,
      ziwei_pro_api: false,
      local_database: false,
      timestamp: new Date().toISOString(),
    };

    // 检查中华万年历API
    try {
      const response = await axios.get(
        `${DATA_SOURCES.ZHWNL_API.baseUrl}/health`,
        {
          timeout: 3000,
        },
      );
      results.zhwnl_api = response.status === 200;
    } catch (error) {
      console.warn("中华万年历API健康检查失败:", error.message);
    }

    // 检查紫微斗数专业API
    try {
      const response = await axios.get(
        `${DATA_SOURCES.ZIWEI_PRO_API.baseUrl}/health`,
        {
          headers: {
            Authorization: `Bearer ${DATA_SOURCES.ZIWEI_PRO_API.apiKey}`,
          },
          timeout: 3000,
        },
      );
      results.ziwei_pro_api = response.status === 200;
    } catch (error) {
      console.warn("紫微斗数专业API健康检查失败:", error.message);
    }

    // 检查本地数据库
    try {
      const starsDataExists = await fs
        .access(DATA_SOURCES.LOCAL_DATABASE.starsData)
        .then(() => true)
        .catch(() => false);
      const patternsDataExists = await fs
        .access(DATA_SOURCES.LOCAL_DATABASE.patternsData)
        .then(() => true)
        .catch(() => false);
      results.local_database = starsDataExists && patternsDataExists;
    } catch (error) {
      console.warn("本地数据库健康检查失败:", error.message);
    }

    return results;
  }

  /**
   * 获取数据源统计信息
   */
  getDataSourceStats() {
    return {
      cache_size: this.cache.size,
      cache_timeout: this.cacheTimeout,
      available_sources: Object.keys(DATA_SOURCES),
      last_health_check: this.lastHealthCheck || null,
    };
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear();
    console.log("数据源缓存已清理");
  }

  // 辅助方法
  checkStarsInPalace(condition, palaces) {
    // 实现星曜在宫位的检查逻辑
    return true; // 简化实现
  }

  checkStarsBrightness(condition, palaces) {
    // 实现星曜亮度的检查逻辑
    return true; // 简化实现
  }

  checkSihuaCombination(condition, palaces) {
    // 实现四化组合的检查逻辑
    return true; // 简化实现
  }

  checkPalaceRelationship(condition, palaces) {
    // 实现宫位关系的检查逻辑
    return true; // 简化实现
  }

  analyzeOverallStrength(patterns) {
    // 分析整体格局强度
    const excellentCount = patterns.filter(
      (p) => p.strength === "excellent",
    ).length;
    const goodCount = patterns.filter((p) => p.strength === "good").length;
    const averageCount = patterns.filter(
      (p) => p.strength === "average",
    ).length;
    const poorCount = patterns.filter((p) => p.strength === "poor").length;

    let overallStrength = "average";
    let score = 60;

    if (excellentCount >= 2) {
      overallStrength = "excellent";
      score = 90 + excellentCount * 5;
    } else if (excellentCount >= 1 || goodCount >= 3) {
      overallStrength = "good";
      score = 75 + excellentCount * 10 + goodCount * 5;
    } else if (poorCount >= 2) {
      overallStrength = "poor";
      score = 40 - poorCount * 5;
    }

    return {
      overall_strength: overallStrength,
      score: Math.max(0, Math.min(100, score)),
      pattern_counts: {
        excellent: excellentCount,
        good: goodCount,
        average: averageCount,
        poor: poorCount,
      },
    };
  }

  generateBasicInterpretations(chart, analysisType) {
    // 基础解释生成逻辑
    return {
      personality: "基于命盘星曜的基础性格分析",
      career: "基于官禄宫的基础事业分析",
      wealth: "基于财帛宫的基础财运分析",
      relationships: "基于夫妻宫的基础感情分析",
      health: "基于疾厄宫的基础健康分析",
      accuracy: "basic_local",
    };
  }

  generateWithProfessionalData(chart, interpretationsData, analysisType) {
    // 使用专业数据生成解释
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const mainStar = destinyPalace.stars.find((s) => s.type === "main");

    if (mainStar && interpretationsData[mainStar.name]) {
      const starData = interpretationsData[mainStar.name];
      return {
        personality: starData.personality || "专业性格分析",
        career: starData.career || "专业事业分析",
        wealth: starData.wealth || "专业财运分析",
        relationships: starData.relationships || "专业感情分析",
        health: starData.health || "专业健康分析",
        accuracy: "professional_local",
      };
    }

    return this.generateBasicInterpretations(chart, analysisType);
  }
}

module.exports = {
  ProfessionalDataService,
  DATA_SOURCES,
};
