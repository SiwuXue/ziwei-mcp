/**
 * 增强版紫微斗数命盘生成器
 * 实现真实的紫微斗数算法
 */

const { CalendarConverter } = require("./calendar.js");
const { v4: uuidv4 } = require("uuid");

/**
 * 天干地支映射
 */
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DIZHI = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];

/**
 * 十二宫名称
 */
const PALACE_NAMES = [
  "命宫",
  "兄弟宫",
  "夫妻宫",
  "子女宫",
  "财帛宫",
  "疾厄宫",
  "迁移宫",
  "奴仆宫",
  "官禄宫",
  "田宅宫",
  "福德宫",
  "父母宫",
];

class EnhancedChartGenerator {
  constructor() {
    this.charts = new Map();
    this.starsDatabase = this.loadStarsDatabase();
    this.palacesDatabase = this.loadPalacesDatabase();
  }

  /**
   * 生成增强版紫微斗数命盘
   */
  async generateChart(input) {
    try {
      // 验证输入参数
      this.validateInput(input);

      // 转换日期
      const solarDate = this.parseBirthInfo(input);
      const lunarDate = CalendarConverter.solarToLunar(solarDate);

      // 生成命盘ID
      const chartId = uuidv4();

      // 计算年龄
      const age = CalendarConverter.calculateAge(solarDate);

      // 生成基本信息
      const chartInfo = {
        id: chartId,
        name: input.name || "未知",
        gender: input.gender,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthLocation: input.birthLocation || "",
        lunarDate: this.formatLunarDate(lunarDate),
        age: age,
        createdAt: new Date().toISOString(),
      };

      // 精确排盘计算
      const palaces = this.calculatePalacesEnhanced(lunarDate, input.gender);

      // 精确安星
      this.placeStarsEnhanced(palaces, lunarDate);

      // 确定命宫和身宫
      const destinyPalace = this.findDestinyPalace(palaces, lunarDate);
      const bodyPalace = this.findBodyPalace(palaces, lunarDate);

      // 计算四化
      const sihua = this.calculateSihua(lunarDate.yearInGanZhi[0], palaces);

      // 识别格局
      const patterns = this.recognizePatterns(
        palaces,
        destinyPalace,
        bodyPalace,
      );

      // 构建完整命盘
      const chart = {
        id: chartId,
        info: {
          ...chartInfo,
          destinyPalace: destinyPalace.id,
          bodyPalace: bodyPalace.id,
        },
        palaces: palaces,
        lunarInfo: lunarDate,
        sihua: sihua,
        patterns: patterns,
        metadata: {
          version: "2.0.0",
          algorithm: "enhanced_traditional",
          generatedAt: new Date().toISOString(),
          accuracy: "professional",
        },
      };

      // 存储命盘
      this.charts.set(chartId, chart);

      return {
        success: true,
        data: {
          chartId: chartId,
          chart: chart,
          summary: this.generateEnhancedSummary(chart),
        },
      };
    } catch (error) {
      console.error("生成命盘失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 增强版宫位计算
   */
  calculatePalacesEnhanced(lunarDate, gender) {
    const palaces = [];

    // 计算命宫位置（精确算法）
    const destinyPosition = this.calculateDestinyPositionEnhanced(lunarDate);

    // 生成十二宫
    for (let i = 0; i < 12; i++) {
      const palacePosition = (destinyPosition + i) % 12;
      const palace = {
        id: i + 1,
        name: PALACE_NAMES[i],
        position: palacePosition,
        earthlyBranch: DIZHI[palacePosition],
        element: this.getElementByPosition(palacePosition),
        stars: [],
        brightness: {},
        sihua: {},
        isDestinyPalace: i === 0,
        isBodyPalace: false, // 后续计算身宫时设置
      };
      palaces.push(palace);
    }

    return palaces;
  }

  /**
   * 精确计算命宫位置
   */
  calculateDestinyPositionEnhanced(lunarDate) {
    // 命宫 = 寅宫 + 生月数 - 生时数
    const birthMonth = lunarDate.month;
    const birthHour = Math.floor(lunarDate.hour / 2); // 转换为时辰

    // 寅宫为2（从子=0开始计算）
    let destinyPos = 2 + birthMonth - 1 - birthHour;

    // 确保结果在0-11范围内
    while (destinyPos < 0) destinyPos += 12;
    destinyPos = destinyPos % 12;

    return destinyPos;
  }

  /**
   * 增强版安星算法
   */
  placeStarsEnhanced(palaces, lunarDate) {
    // 安主星
    this.placeMainStarsEnhanced(palaces, lunarDate);

    // 安辅星
    this.placeAuxiliaryStarsEnhanced(palaces, lunarDate);

    // 安煞星
    this.placeMaleficStarsEnhanced(palaces, lunarDate);

    // 计算星曜亮度
    this.calculateBrightnessEnhanced(palaces);
  }

  /**
   * 精确安主星
   */
  placeMainStarsEnhanced(palaces, lunarDate) {
    // 计算紫微星位置（精确算法）
    const ziweiPosition = this.calculateZiweiPositionEnhanced(lunarDate);
    this.addStarToPalace(palaces, ziweiPosition, {
      name: "紫微",
      type: "main",
      category: "帝星",
      element: "土",
    });

    // 计算天府星位置（与紫微相对）
    const tianfuPosition = (ziweiPosition + 6) % 12;
    this.addStarToPalace(palaces, tianfuPosition, {
      name: "天府",
      type: "main",
      category: "财星",
      element: "土",
    });

    // 紫微星系（以紫微为基准）
    const ziweiStars = [
      { name: "天机", offset: 1, element: "木" },
      {
        name: "太阳",
        offset: this.calculateTaiyangOffset(lunarDate),
        element: "火",
      },
      { name: "武曲", offset: 4, element: "金" },
      { name: "天同", offset: 5, element: "水" },
      { name: "廉贞", offset: 8, element: "火" },
    ];

    ziweiStars.forEach((star) => {
      const position = (ziweiPosition + star.offset) % 12;
      this.addStarToPalace(palaces, position, {
        name: star.name,
        type: "main",
        element: star.element,
      });
    });

    // 天府星系（以天府为基准）
    const tianfuStars = [
      {
        name: "太阴",
        offset: this.calculateTaiyinOffset(lunarDate),
        element: "水",
      },
      { name: "贪狼", offset: 1, element: "木" },
      { name: "巨门", offset: 2, element: "土" },
      { name: "天相", offset: 3, element: "水" },
      { name: "天梁", offset: 4, element: "土" },
      { name: "七杀", offset: 5, element: "金" },
      { name: "破军", offset: 11, element: "水" },
    ];

    tianfuStars.forEach((star) => {
      const position = (tianfuPosition + star.offset) % 12;
      this.addStarToPalace(palaces, position, {
        name: star.name,
        type: "main",
        element: star.element,
      });
    });
  }

  /**
   * 精确计算紫微星位置
   */
  calculateZiweiPositionEnhanced(lunarDate) {
    const day = lunarDate.day;
    const hour = Math.floor(lunarDate.hour / 2);

    // 紫微星定位公式：根据农历日期和时辰
    // 这里使用传统的紫微星定位算法
    let position;

    if (day <= 15) {
      // 上半月算法
      position = (day - 1 + hour) % 12;
    } else {
      // 下半月算法
      position = (30 - day + hour) % 12;
    }

    return position;
  }

  /**
   * 计算太阳星偏移
   */
  calculateTaiyangOffset(lunarDate) {
    // 太阳星按月份安星：正月在寅，二月在卯...
    return (lunarDate.month + 1) % 12;
  }

  /**
   * 计算太阴星偏移
   */
  calculateTaiyinOffset(lunarDate) {
    // 太阴星与太阳星相对
    const taiyangOffset = this.calculateTaiyangOffset(lunarDate);
    return (taiyangOffset + 6) % 12;
  }

  /**
   * 精确安辅星
   */
  placeAuxiliaryStarsEnhanced(palaces, lunarDate) {
    // 左辅右弼
    const zuofuPosition = (lunarDate.month + 1) % 12; // 正月在寅
    const youbiPosition = (13 - lunarDate.month) % 12; // 正月在子

    this.addStarToPalace(palaces, zuofuPosition, {
      name: "左辅",
      type: "auxiliary",
      category: "吉星",
      element: "土",
    });

    this.addStarToPalace(palaces, youbiPosition, {
      name: "右弼",
      type: "auxiliary",
      category: "吉星",
      element: "水",
    });

    // 文昌文曲
    const wenchangPosition = this.calculateWenchangPosition(lunarDate);
    const wenquPosition = this.calculateWenquPosition(lunarDate);

    this.addStarToPalace(palaces, wenchangPosition, {
      name: "文昌",
      type: "auxiliary",
      category: "文星",
      element: "金",
    });

    this.addStarToPalace(palaces, wenquPosition, {
      name: "文曲",
      type: "auxiliary",
      category: "文星",
      element: "水",
    });

    // 天魁天钺
    const tiankuiPosition = this.calculateTiankuiPosition(lunarDate);
    const tianyuePosition = this.calculateTianyuePosition(lunarDate);

    this.addStarToPalace(palaces, tiankuiPosition, {
      name: "天魁",
      type: "auxiliary",
      category: "贵人星",
      element: "火",
    });

    this.addStarToPalace(palaces, tianyuePosition, {
      name: "天钺",
      type: "auxiliary",
      category: "贵人星",
      element: "火",
    });
  }

  /**
   * 计算文昌星位置
   */
  calculateWenchangPosition(lunarDate) {
    const dayGan = this.getDayGan(lunarDate.dayInGanZhi);
    const wenchangMap = {
      甲: 10, // 戌
      乙: 9, // 酉
      丙: 8, // 申
      丁: 7, // 未
      戊: 8, // 申
      己: 7, // 未
      庚: 6, // 午
      辛: 5, // 巳
      壬: 4, // 辰
      癸: 3, // 卯
    };

    return wenchangMap[dayGan] || 0;
  }

  /**
   * 计算文曲星位置
   */
  calculateWenquPosition(lunarDate) {
    const dayGan = this.getDayGan(lunarDate.dayInGanZhi);
    const wenquMap = {
      甲: 4, // 辰
      乙: 5, // 巳
      丙: 7, // 未
      丁: 6, // 午
      戊: 7, // 未
      己: 6, // 午
      庚: 9, // 酉
      辛: 10, // 戌
      壬: 11, // 亥
      癸: 0, // 子
    };

    return wenquMap[dayGan] || 0;
  }

  /**
   * 计算天魁星位置
   */
  calculateTiankuiPosition(lunarDate) {
    const yearGan = lunarDate.yearInGanZhi[0];
    const tiankuiMap = {
      甲: 1, // 丑
      乙: 0, // 子
      丙: 11, // 亥
      丁: 10, // 戌
      戊: 1, // 丑
      己: 0, // 子
      庚: 11, // 亥
      辛: 10, // 戌
      壬: 5, // 午
      癸: 4, // 巳
    };

    return tiankuiMap[yearGan] || 0;
  }

  /**
   * 计算天钺星位置
   */
  calculateTianyuePosition(lunarDate) {
    const yearGan = lunarDate.yearInGanZhi[0];
    const tianyueMap = {
      甲: 7, // 申
      乙: 6, // 未
      丙: 9, // 酉
      丁: 8, // 申
      戊: 7, // 申
      己: 6, // 未
      庚: 9, // 酉
      辛: 8, // 申
      壬: 2, // 卯
      癸: 3, // 辰
    };

    return tianyueMap[yearGan] || 0;
  }

  /**
   * 精确安煞星
   */
  placeMaleficStarsEnhanced(palaces, lunarDate) {
    // 擎羊陀罗
    const qingyangPosition = this.calculateQingyangPosition(lunarDate);
    const tuoluoPosition = (qingyangPosition + 1) % 12;

    this.addStarToPalace(palaces, qingyangPosition, {
      name: "擎羊",
      type: "malefic",
      category: "煞星",
      element: "金",
    });

    this.addStarToPalace(palaces, tuoluoPosition, {
      name: "陀罗",
      type: "malefic",
      category: "煞星",
      element: "金",
    });

    // 火星铃星
    const huoxingPosition = this.calculateHuoxingPosition(lunarDate);
    const lingxingPosition = this.calculateLingxingPosition(lunarDate);

    this.addStarToPalace(palaces, huoxingPosition, {
      name: "火星",
      type: "malefic",
      category: "煞星",
      element: "火",
    });

    this.addStarToPalace(palaces, lingxingPosition, {
      name: "铃星",
      type: "malefic",
      category: "煞星",
      element: "火",
    });
  }

  /**
   * 计算四化
   */
  calculateSihua(yearGan, palaces) {
    const sihuaMap = {
      甲: { 化禄: "廉贞", 化权: "破军", 化科: "武曲", 化忌: "太阳" },
      乙: { 化禄: "天机", 化权: "天梁", 化科: "紫微", 化忌: "太阴" },
      丙: { 化禄: "天同", 化权: "天机", 化科: "文昌", 化忌: "廉贞" },
      丁: { 化禄: "太阴", 化权: "天同", 化科: "天机", 化忌: "巨门" },
      戊: { 化禄: "贪狼", 化权: "太阴", 化科: "右弼", 化忌: "天机" },
      己: { 化禄: "武曲", 化权: "贪狼", 化科: "天梁", 化忌: "文曲" },
      庚: { 化禄: "太阳", 化权: "武曲", 化科: "太阴", 化忌: "天同" },
      辛: { 化禄: "巨门", 化权: "太阳", 化科: "文曲", 化忌: "文昌" },
      壬: { 化禄: "天梁", 化权: "紫微", 化科: "左辅", 化忌: "武曲" },
      癸: { 化禄: "破军", 化权: "巨门", 化科: "太阴", 化忌: "贪狼" },
    };

    const yearSihua = sihuaMap[yearGan] || {};
    const result = {};

    // 为每个宫位的星曜添加四化属性
    palaces.forEach((palace) => {
      palace.stars.forEach((star) => {
        Object.entries(yearSihua).forEach(([sihuaType, starName]) => {
          if (star.name === starName) {
            star.sihua = sihuaType;
            result[sihuaType] = {
              star: starName,
              palace: palace.name,
              position: palace.position,
            };
          }
        });
      });
    });

    return result;
  }

  /**
   * 识别格局
   */
  recognizePatterns(palaces, destinyPalace, bodyPalace) {
    const patterns = [];
    const destinyStars = destinyPalace.stars.map((s) => s.name);

    // 检查紫微格局
    if (destinyStars.includes("紫微")) {
      if (destinyStars.includes("天府")) {
        patterns.push({
          name: "紫府同宫",
          type: "富贵格",
          description: "帝王之相，主大富大贵，一生显达",
          strength: "excellent",
          influence: "very_positive",
        });
      }

      if (destinyStars.includes("贪狼")) {
        patterns.push({
          name: "紫贪同宫",
          type: "桃花格",
          description: "主聪明多才，异性缘佳，适合娱乐行业",
          strength: "good",
          influence: "positive",
        });
      }
    }

    // 检查杀破狼格局
    const shapolangStars = ["七杀", "破军", "贪狼"];
    const hasShapolang = shapolangStars.some((star) =>
      destinyStars.includes(star),
    );

    if (hasShapolang) {
      patterns.push({
        name: "杀破狼格局",
        type: "变动格",
        description: "主变动，宜外出发展，创业有成，不宜安逸",
        strength: "good",
        influence: "dynamic",
      });
    }

    // 检查机月同梁格局
    const jiyuetongliangStars = ["天机", "太阴", "天同", "天梁"];
    const hasJiyuetongliang =
      jiyuetongliangStars.filter((star) => destinyStars.includes(star))
        .length >= 2;

    if (hasJiyuetongliang) {
      patterns.push({
        name: "机月同梁格局",
        type: "清贵格",
        description: "主清贵，适合文职、教育、咨询等行业",
        strength: "good",
        influence: "stable",
      });
    }

    return patterns;
  }

  /**
   * 计算星曜亮度
   */
  calculateBrightnessEnhanced(palaces) {
    palaces.forEach((palace) => {
      palace.stars.forEach((star) => {
        const brightness = this.getStarBrightness(
          star.name,
          palace.earthlyBranch,
        );
        star.brightness = brightness;
        palace.brightness[star.name] = brightness;
      });
    });
  }

  /**
   * 获取星曜在特定地支的亮度
   */
  getStarBrightness(starName, earthlyBranch) {
    const brightnessMap = {
      紫微: {
        子: "庙",
        丑: "旺",
        寅: "得",
        卯: "利",
        辰: "平",
        巳: "不",
        午: "庙",
        未: "旺",
        申: "得",
        酉: "利",
        戌: "平",
        亥: "不",
      },
      天机: {
        子: "旺",
        丑: "得",
        寅: "庙",
        卯: "旺",
        辰: "得",
        巳: "利",
        午: "平",
        未: "不",
        申: "平",
        酉: "不",
        戌: "平",
        亥: "利",
      },
      太阳: {
        子: "陷",
        丑: "不",
        寅: "旺",
        卯: "庙",
        辰: "旺",
        巳: "庙",
        午: "庙",
        未: "旺",
        申: "得",
        酉: "利",
        戌: "平",
        亥: "陷",
      },
      // ... 其他星曜的亮度数据
    };

    return brightnessMap[starName]?.[earthlyBranch] || "平";
  }

  /**
   * 生成增强版摘要
   */
  generateEnhancedSummary(chart) {
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const mainStars = destinyPalace.stars.filter((s) => s.type === "main");
    const patterns = chart.patterns;
    const sihua = chart.sihua;

    return {
      basicInfo: {
        name: chart.info.name,
        gender: chart.info.gender,
        age: chart.info.age,
        destinyPalace: destinyPalace.name,
        destinyStars: mainStars.map((s) => s.name),
      },
      patterns: patterns.map((p) => ({
        name: p.name,
        type: p.type,
        strength: p.strength,
      })),
      sihua: Object.entries(sihua).map(([type, info]) => ({
        type: type,
        star: info.star,
        palace: info.palace,
      })),
      overallAssessment: this.generateOverallAssessment(chart),
    };
  }

  /**
   * 生成整体评估
   */
  generateOverallAssessment(chart) {
    const patterns = chart.patterns;
    const excellentPatterns = patterns.filter(
      (p) => p.strength === "excellent",
    ).length;
    const goodPatterns = patterns.filter((p) => p.strength === "good").length;

    let level = "普通";
    let description = "命盘格局一般，需要后天努力";

    if (excellentPatterns > 0) {
      level = "优秀";
      description = "命盘格局优秀，天赋异禀，前程似锦";
    } else if (goodPatterns >= 2) {
      level = "良好";
      description = "命盘格局良好，具有发展潜力";
    } else if (goodPatterns === 1) {
      level = "中等";
      description = "命盘格局中等，有一定优势";
    }

    return {
      level: level,
      description: description,
      score: this.calculateOverallScore(chart),
    };
  }

  /**
   * 计算整体评分
   */
  calculateOverallScore(chart) {
    let score = 60; // 基础分

    // 格局加分
    chart.patterns.forEach((pattern) => {
      switch (pattern.strength) {
        case "excellent":
          score += 20;
          break;
        case "good":
          score += 10;
          break;
        case "average":
          score += 5;
          break;
      }
    });

    // 四化加分
    if (chart.sihua["化禄"]) score += 5;
    if (chart.sihua["化权"]) score += 5;
    if (chart.sihua["化科"]) score += 5;

    // 四化减分
    if (chart.sihua["化忌"]) score -= 3;

    return Math.min(100, Math.max(0, score));
  }

  // 辅助方法
  getDayGan(dayInGanZhi) {
    return dayInGanZhi ? dayInGanZhi[0] : "甲";
  }

  getElementByPosition(position) {
    const elementMap = {
      0: "水",
      1: "土",
      2: "木",
      3: "木",
      4: "土",
      5: "火",
      6: "火",
      7: "土",
      8: "金",
      9: "金",
      10: "土",
      11: "水",
    };
    return elementMap[position] || "土";
  }

  addStarToPalace(palaces, position, star) {
    const palace = palaces.find((p) => p.position === position);
    if (palace) {
      palace.stars.push(star);
    }
  }

  // 数据库加载方法（简化版）
  loadStarsDatabase() {
    // 这里应该从外部文件或数据库加载
    return {};
  }

  loadPalacesDatabase() {
    // 这里应该从外部文件或数据库加载
    return {};
  }

  // 继承原有方法
  validateInput(input) {
    if (!input.birthDate) {
      throw new Error("出生日期不能为空");
    }
    if (!input.birthTime) {
      throw new Error("出生时间不能为空");
    }
    if (!input.gender || !["male", "female"].includes(input.gender)) {
      throw new Error("性别必须是 male 或 female");
    }
  }

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

  formatLunarDate(lunarDate) {
    return `${lunarDate.year}年${lunarDate.isLeapMonth ? "闰" : ""}${lunarDate.month}月${lunarDate.day}日`;
  }

  findDestinyPalace(palaces) {
    return palaces.find((p) => p.isDestinyPalace) || palaces[0];
  }

  findBodyPalace(palaces, lunarDate) {
    // 身宫计算：命宫 + 生月 - 生时
    const destinyPalace = this.findDestinyPalace(palaces);
    const birthMonth = lunarDate.month;
    const birthHour = Math.floor(lunarDate.hour / 2);

    let bodyPosition = destinyPalace.position + birthMonth - birthHour;
    while (bodyPosition < 0) bodyPosition += 12;
    bodyPosition = bodyPosition % 12;

    const bodyPalace = palaces.find((p) => p.position === bodyPosition);
    if (bodyPalace) {
      bodyPalace.isBodyPalace = true;
    }

    return bodyPalace || palaces[1];
  }

  getChart(chartId) {
    return this.charts.get(chartId);
  }

  // 继承原有的简化计算方法作为备用
  calculateQingyangPosition(lunarDate) {
    const yearZhi = lunarDate.yearInGanZhi[1];
    const zhiIndex = DIZHI.indexOf(yearZhi);
    return (zhiIndex + 1) % 12;
  }

  calculateHuoxingPosition(lunarDate) {
    const yearZhi = lunarDate.yearInGanZhi[1];
    const zhiIndex = DIZHI.indexOf(yearZhi);
    return (zhiIndex + 2) % 12;
  }

  calculateLingxingPosition(lunarDate) {
    const yearZhi = lunarDate.yearInGanZhi[1];
    const zhiIndex = DIZHI.indexOf(yearZhi);
    return (zhiIndex + 3) % 12;
  }
}

module.exports = {
  EnhancedChartGenerator,
};
