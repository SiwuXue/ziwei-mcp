/**
 * 紫微斗数命盘生成器
 */

const { CalendarConverter } = require("./calendar.js");
const { v4: uuidv4 } = require("uuid");

class ChartGenerator {
  constructor() {
    this.charts = new Map(); // 存储生成的命盘
  }

  /**
   * 生成紫微斗数命盘
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

      // 排盘计算
      const palaces = this.calculatePalaces(lunarDate, input.gender);

      // 安星
      this.placeStars(palaces, lunarDate);

      // 确定命宫和身宫
      const destinyPalace = this.findDestinyPalace(palaces, lunarDate);
      const bodyPalace = this.findBodyPalace(palaces, lunarDate);

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
        metadata: {
          version: "1.0.0",
          algorithm: "traditional",
          generatedAt: new Date().toISOString(),
        },
      };

      // 存储命盘
      this.charts.set(chartId, chart);

      return {
        success: true,
        data: {
          chartId: chartId,
          chart: chart,
          summary: this.generateSummary(chart),
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
   * 根据ID获取命盘
   */
  getChart(chartId) {
    return this.charts.get(chartId) || null;
  }

  /**
   * 验证输入参数
   */
  validateInput(input) {
    if (!input.gender || !["male", "female"].includes(input.gender)) {
      throw new Error("性别参数无效");
    }

    if (!input.birthDate || !input.birthTime) {
      throw new Error("出生日期和时间不能为空");
    }

    if (!CalendarConverter.validateDate(input.birthDate, input.birthTime)) {
      throw new Error("日期或时间格式无效");
    }
  }

  /**
   * 解析出生信息
   */
  parseBirthInfo(input) {
    const [year, month, day] = input.birthDate.split("-").map(Number);
    const [hour, minute] = input.birthTime.split(":").map(Number);

    return {
      year,
      month,
      day,
      hour,
      minute,
    };
  }

  /**
   * 格式化农历日期
   */
  formatLunarDate(lunarDate) {
    const leapText = lunarDate.isLeapMonth ? "闰" : "";
    return `农历${lunarDate.yearInGanZhi}年${leapText}${lunarDate.month}月${lunarDate.day}日${lunarDate.hourInGanZhi}时`;
  }

  /**
   * 计算十二宫位
   */
  calculatePalaces(lunarDate) {
    const palaceNames = [
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

    const earthlyBranches = [
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

    const elements = [
      "water",
      "earth",
      "wood",
      "wood",
      "earth",
      "fire",
      "fire",
      "earth",
      "metal",
      "metal",
      "earth",
      "water",
    ];

    // 计算命宫位置（简化算法）
    const destinyPosition = this.calculateDestinyPosition(lunarDate);

    const palaces = [];
    for (let i = 0; i < 12; i++) {
      const position = (destinyPosition + i) % 12;
      palaces.push({
        id: `palace_${i}`,
        name: palaceNames[i],
        position: position,
        earthlyBranch: earthlyBranches[position],
        element: elements[position],
        stars: [],
        brightness: "平",
        strength: 50,
        isBodyPalace: false,
      });
    }

    return palaces;
  }

  /**
   * 计算命宫位置
   */
  calculateDestinyPosition(lunarDate) {
    // 简化的命宫计算公式
    // 实际应该根据出生月份和时辰精确计算
    const monthBase = lunarDate.month - 1;
    const hourIndex = this.getHourIndex(lunarDate.hour);

    // 寅宫起正月，顺数到生月，再从生月宫逆数到生时
    let position = (2 + monthBase) % 12; // 寅宫为2
    position = (position - hourIndex + 12) % 12;

    return position;
  }

  /**
   * 获取时辰索引
   */
  getHourIndex(hour) {
    if (hour === 23 || hour === 0) return 0; // 子时
    return Math.floor((hour + 1) / 2);
  }

  /**
   * 安星（放置星曜）
   */
  placeStars(palaces, lunarDate) {
    // 安主星
    this.placeMainStars(palaces, lunarDate);

    // 安辅星
    this.placeAuxiliaryStars(palaces, lunarDate);

    // 安煞星
    this.placeMaleficStars(palaces, lunarDate);

    // 计算星曜亮度和宫位强度
    this.calculateBrightnessAndStrength(palaces);
  }

  /**
   * 安主星
   */
  placeMainStars(palaces, lunarDate) {
    // 紫微星系
    const ziweiPosition = this.calculateZiweiPosition(lunarDate);
    this.addStarToPalace(palaces, ziweiPosition, {
      name: "紫微",
      type: "main",
      brightness: "庙",
    });

    // 天机星系
    const tianjiPosition = (ziweiPosition + 1) % 12;
    this.addStarToPalace(palaces, tianjiPosition, {
      name: "天机",
      type: "main",
      brightness: "旺",
    });

    // 太阳星系
    const taiyangPosition = this.calculateTaiyangPosition(lunarDate);
    this.addStarToPalace(palaces, taiyangPosition, {
      name: "太阳",
      type: "main",
      brightness: "得",
    });

    // 武曲星系
    const wuquPosition = (ziweiPosition + 4) % 12;
    this.addStarToPalace(palaces, wuquPosition, {
      name: "武曲",
      type: "main",
      brightness: "利",
    });

    // 天同星系
    const tiantongPosition = (ziweiPosition + 5) % 12;
    this.addStarToPalace(palaces, tiantongPosition, {
      name: "天同",
      type: "main",
      brightness: "平",
    });

    // 廉贞星系
    const lianzhengPosition = (ziweiPosition + 8) % 12;
    this.addStarToPalace(palaces, lianzhengPosition, {
      name: "廉贞",
      type: "main",
      brightness: "不",
    });

    // 天府星系
    const tianfuPosition = this.calculateTianfuPosition(ziweiPosition);
    this.addStarToPalace(palaces, tianfuPosition, {
      name: "天府",
      type: "main",
      brightness: "庙",
    });

    // 太阴星系
    const taiyinPosition = (taiyangPosition + 6) % 12;
    this.addStarToPalace(palaces, taiyinPosition, {
      name: "太阴",
      type: "main",
      brightness: "旺",
    });

    // 贪狼星系
    const tanlangPosition = (tianfuPosition + 1) % 12;
    this.addStarToPalace(palaces, tanlangPosition, {
      name: "贪狼",
      type: "main",
      brightness: "得",
    });

    // 巨门星系
    const jumenPosition = (tianfuPosition + 2) % 12;
    this.addStarToPalace(palaces, jumenPosition, {
      name: "巨门",
      type: "main",
      brightness: "利",
    });

    // 天相星系
    const tianxiangPosition = (tianfuPosition + 3) % 12;
    this.addStarToPalace(palaces, tianxiangPosition, {
      name: "天相",
      type: "main",
      brightness: "平",
    });

    // 天梁星系
    const tianliangPosition = (tianfuPosition + 4) % 12;
    this.addStarToPalace(palaces, tianliangPosition, {
      name: "天梁",
      type: "main",
      brightness: "不",
    });

    // 七杀星系
    const qishaPosition = (tianfuPosition + 5) % 12;
    this.addStarToPalace(palaces, qishaPosition, {
      name: "七杀",
      type: "main",
      brightness: "陷",
    });

    // 破军星系
    const pojunPosition = (tianfuPosition + 6) % 12;
    this.addStarToPalace(palaces, pojunPosition, {
      name: "破军",
      type: "main",
      brightness: "陷",
    });
  }

  /**
   * 安辅星
   */
  placeAuxiliaryStars(palaces, lunarDate) {
    // 左辅右弼
    const zuofuPosition = this.calculateZuofuPosition(lunarDate);
    this.addStarToPalace(palaces, zuofuPosition, {
      name: "左辅",
      type: "auxiliary",
      brightness: "平",
    });

    const youbiPosition = (zuofuPosition + 6) % 12;
    this.addStarToPalace(palaces, youbiPosition, {
      name: "右弼",
      type: "auxiliary",
      brightness: "平",
    });

    // 文昌文曲
    const wenchangPosition = this.calculateWenchangPosition(lunarDate);
    this.addStarToPalace(palaces, wenchangPosition, {
      name: "文昌",
      type: "auxiliary",
      brightness: "平",
    });

    const wenquPosition = this.calculateWenquPosition(lunarDate);
    this.addStarToPalace(palaces, wenquPosition, {
      name: "文曲",
      type: "auxiliary",
      brightness: "平",
    });

    // 天魁天钺
    const tiankuiPosition = this.calculateTiankuiPosition(lunarDate);
    this.addStarToPalace(palaces, tiankuiPosition, {
      name: "天魁",
      type: "auxiliary",
      brightness: "平",
    });

    const tianyuePosition = this.calculateTianyuePosition(lunarDate);
    this.addStarToPalace(palaces, tianyuePosition, {
      name: "天钺",
      type: "auxiliary",
      brightness: "平",
    });
  }

  /**
   * 安煞星
   */
  placeMaleficStars(palaces, lunarDate) {
    // 擎羊陀罗
    const qingyangPosition = this.calculateQingyangPosition(lunarDate);
    this.addStarToPalace(palaces, qingyangPosition, {
      name: "擎羊",
      type: "malefic",
      brightness: "陷",
    });

    const tuoluoPosition = (qingyangPosition + 1) % 12;
    this.addStarToPalace(palaces, tuoluoPosition, {
      name: "陀罗",
      type: "malefic",
      brightness: "陷",
    });

    // 火星铃星
    const huoxingPosition = this.calculateHuoxingPosition(lunarDate);
    this.addStarToPalace(palaces, huoxingPosition, {
      name: "火星",
      type: "malefic",
      brightness: "陷",
    });

    const lingxingPosition = this.calculateLingxingPosition(lunarDate);
    this.addStarToPalace(palaces, lingxingPosition, {
      name: "铃星",
      type: "malefic",
      brightness: "陷",
    });
  }

  /**
   * 计算紫微星位置
   */
  calculateZiweiPosition(lunarDate) {
    // 简化的紫微星计算
    // 实际应该根据出生日期的复杂公式计算
    const dayNum = lunarDate.day;
    return (dayNum - 1) % 12;
  }

  /**
   * 计算太阳星位置
   */
  calculateTaiyangPosition(lunarDate) {
    // 太阳星按月份安星
    return (lunarDate.month - 1) % 12;
  }

  /**
   * 计算天府星位置
   */
  calculateTianfuPosition(ziweiPosition) {
    // 天府星与紫微星相对
    return (ziweiPosition + 6) % 12;
  }

  /**
   * 计算左辅星位置
   */
  calculateZuofuPosition(lunarDate) {
    // 左辅星按月份安星
    return (lunarDate.month + 1) % 12;
  }

  /**
   * 计算文昌星位置
   */
  calculateWenchangPosition(lunarDate) {
    // 文昌星按时辰安星
    const hourIndex = this.getHourIndex(lunarDate.hour);
    return (10 - hourIndex + 12) % 12;
  }

  /**
   * 计算文曲星位置
   */
  calculateWenquPosition(lunarDate) {
    // 文曲星按时辰安星
    const hourIndex = this.getHourIndex(lunarDate.hour);
    return (4 + hourIndex) % 12;
  }

  /**
   * 计算天魁星位置
   */
  calculateTiankuiPosition(lunarDate) {
    // 天魁星按年干安星
    const yearGan = this.getYearGan(lunarDate.yearInGanZhi);
    const kuiPositions = [1, 2, 0, 0, 1, 2, 3, 4, 5, 6]; // 甲乙丙丁戊己庚辛壬癸
    return kuiPositions[yearGan] || 0;
  }

  /**
   * 计算天钺星位置
   */
  calculateTianyuePosition(lunarDate) {
    // 天钺星按年干安星
    const yearGan = this.getYearGan(lunarDate.yearInGanZhi);
    const yuePositions = [7, 8, 9, 10, 11, 0, 1, 2, 3, 4]; // 甲乙丙丁戊己庚辛壬癸
    return yuePositions[yearGan] || 0;
  }

  /**
   * 计算擎羊星位置
   */
  calculateQingyangPosition(lunarDate) {
    // 擎羊星按年干安星
    const yearGan = this.getYearGan(lunarDate.yearInGanZhi);
    return (yearGan + 1) % 12;
  }

  /**
   * 计算火星位置
   */
  calculateHuoxingPosition(lunarDate) {
    // 火星按年支和时辰安星
    const yearZhi = this.getYearZhi(lunarDate.yearInGanZhi);
    const hourIndex = this.getHourIndex(lunarDate.hour);
    return (yearZhi + hourIndex) % 12;
  }

  /**
   * 计算铃星位置
   */
  calculateLingxingPosition(lunarDate) {
    // 铃星按年支和时辰安星
    const yearZhi = this.getYearZhi(lunarDate.yearInGanZhi);
    const hourIndex = this.getHourIndex(lunarDate.hour);
    return (yearZhi - hourIndex + 12) % 12;
  }

  /**
   * 获取年干索引
   */
  getYearGan(ganZhi) {
    const gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    return gans.indexOf(ganZhi.charAt(0));
  }

  /**
   * 获取年支索引
   */
  getYearZhi(ganZhi) {
    const zhis = [
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
    return zhis.indexOf(ganZhi.charAt(1));
  }

  /**
   * 添加星曜到宫位
   */
  addStarToPalace(palaces, position, star) {
    const palace = palaces.find((p) => p.position === position);
    if (palace) {
      palace.stars.push(star);

      // 设置主星
      if (star.type === "main" && !palace.mainStar) {
        palace.mainStar = star;
      }
    }
  }

  /**
   * 计算星曜亮度和宫位强度
   */
  calculateBrightnessAndStrength(palaces) {
    palaces.forEach((palace) => {
      let totalStrength = 0;
      let starCount = 0;

      palace.stars.forEach((star) => {
        // 根据星曜类型和亮度计算强度
        let starStrength = 0;
        switch (star.brightness) {
          case "庙":
            starStrength = 100;
            break;
          case "旺":
            starStrength = 85;
            break;
          case "得":
            starStrength = 70;
            break;
          case "利":
            starStrength = 55;
            break;
          case "平":
            starStrength = 40;
            break;
          case "不":
            starStrength = 25;
            break;
          case "陷":
            starStrength = 10;
            break;
          default:
            starStrength = 40;
        }

        // 主星权重更高
        if (star.type === "main") {
          starStrength *= 1.5;
        } else if (star.type === "malefic") {
          starStrength *= 0.5; // 煞星降低强度
        }

        totalStrength += starStrength;
        starCount++;
      });

      // 计算平均强度
      palace.strength =
        starCount > 0 ? Math.round(totalStrength / starCount) : 50;

      // 设置宫位亮度
      if (palace.strength >= 85) {
        palace.brightness = "庙";
      } else if (palace.strength >= 70) {
        palace.brightness = "旺";
      } else if (palace.strength >= 55) {
        palace.brightness = "得";
      } else if (palace.strength >= 40) {
        palace.brightness = "利";
      } else if (palace.strength >= 25) {
        palace.brightness = "不";
      } else {
        palace.brightness = "陷";
      }
    });
  }

  /**
   * 找到命宫
   */
  findDestinyPalace(palaces) {
    return palaces.find((p) => p.name === "命宫");
  }

  /**
   * 找到身宫
   */
  findBodyPalace(palaces, lunarDate) {
    // 身宫计算（简化）
    const bodyPalaceNames = [
      "命宫",
      "夫妻宫",
      "财帛宫",
      "迁移宫",
      "官禄宫",
      "福德宫",
    ];
    const bodyIndex = lunarDate.month % 6;
    const bodyPalaceName = bodyPalaceNames[bodyIndex];

    const bodyPalace = palaces.find((p) => p.name === bodyPalaceName);
    if (bodyPalace) {
      bodyPalace.isBodyPalace = true;
    }

    return bodyPalace;
  }

  /**
   * 生成命盘摘要
   */
  generateSummary(chart) {
    const destinyPalace = chart.palaces.find(
      (p) => p.id === chart.info.destinyPalace,
    );
    const bodyPalace = chart.palaces.find(
      (p) => p.id === chart.info.bodyPalace,
    );

    const mainStars = destinyPalace.stars
      .filter((s) => s.type === "main")
      .map((s) => s.name);

    return {
      name: chart.info.name,
      gender: chart.info.gender === "male" ? "男" : "女",
      age: chart.info.age,
      destinyPalace: destinyPalace.name,
      bodyPalace: bodyPalace.name,
      mainStars: mainStars,
      destinyStrength: destinyPalace.strength,
      lunarDate: chart.info.lunarDate,
      zodiac: CalendarConverter.getZodiac(chart.lunarInfo.year),
    };
  }
}

module.exports = {
  ChartGenerator,
};
