/**
 * 农历转换核心算法
 */

const { Lunar, Solar } = require("lunar-javascript");

/**
 * 农历日期接口
 * @typedef {Object} LunarDate
 * @property {number} year - 年份
 * @property {number} month - 月份
 * @property {number} day - 日期
 * @property {number} hour - 小时
 * @property {boolean} isLeapMonth - 是否闰月
 * @property {string} yearInGanZhi - 年干支
 * @property {string} monthInGanZhi - 月干支
 * @property {string} dayInGanZhi - 日干支
 * @property {string} hourInGanZhi - 时干支
 * @property {string} solarTerm - 节气
 */

/**
 * 阳历日期接口
 * @typedef {Object} SolarDate
 * @property {number} year - 年份
 * @property {number} month - 月份
 * @property {number} day - 日期
 * @property {number} hour - 小时
 * @property {number} minute - 分钟
 */

class CalendarConverter {
  /**
   * 阳历转农历
   * @param {SolarDate} solarDate - 阳历日期
   * @returns {LunarDate} 农历日期
   */
  static solarToLunar(solarDate) {
    try {
      const solar = Solar.fromYmdHms(
        solarDate.year,
        solarDate.month,
        solarDate.day,
        solarDate.hour,
        solarDate.minute,
        0,
      );

      const lunar = solar.getLunar();

      return {
        year: lunar.getYear(),
        month: Math.abs(lunar.getMonth()), // 闰月时getMonth()返回负数
        day: lunar.getDay(),
        hour: solarDate.hour,
        isLeapMonth: lunar.getMonth() < 0, // 闰月时月份为负数
        yearInGanZhi: lunar.getYearInGanZhi(),
        monthInGanZhi: lunar.getMonthInGanZhi(),
        dayInGanZhi: lunar.getDayInGanZhi(),
        hourInGanZhi: this.getHourInGanZhi(solarDate.hour),
        solarTerm: this.getSolarTerm(solarDate) || "",
      };
    } catch (error) {
      console.error("农历转换失败:", error);
      // 返回一个默认值而不是抛出错误
      return {
        year: solarDate.year,
        month: solarDate.month,
        day: solarDate.day,
        hour: solarDate.hour,
        isLeapMonth: false,
        yearInGanZhi: "甲子",
        monthInGanZhi: "甲子",
        dayInGanZhi: "甲子",
        hourInGanZhi: this.getHourInGanZhi(solarDate.hour),
        solarTerm: "",
      };
    }
  }

  /**
   * 农历转阳历
   * @param {LunarDate} lunarDate - 农历日期
   * @returns {SolarDate} 阳历日期
   */
  static lunarToSolar(lunarDate) {
    const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);

    const solar = lunar.getSolar();

    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: lunarDate.hour,
      minute: 0,
    };
  }

  /**
   * 获取时辰干支
   * @param {number} hour - 小时
   * @returns {string} 时辰干支
   */
  static getHourInGanZhi(hour) {
    const hourBranches = [
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

    // 时辰对应关系：23-1点为子时，1-3点为丑时，以此类推
    let hourIndex;
    if (hour === 23) {
      hourIndex = 0; // 子时
    } else {
      hourIndex = Math.floor((hour + 1) / 2);
    }

    return hourBranches[hourIndex] || "子";
  }

  /**
   * 获取生肖
   * @param {number} year - 年份
   * @returns {string} 生肖
   */
  static getZodiac(year) {
    const zodiacs = [
      "鼠",
      "牛",
      "虎",
      "兔",
      "龙",
      "蛇",
      "马",
      "羊",
      "猴",
      "鸡",
      "狗",
      "猪",
    ];

    return zodiacs[(year - 4) % 12] || "鼠";
  }

  /**
   * 获取五行纳音
   * @param {string} ganZhi - 干支
   * @returns {string} 纳音
   */
  static getNayin(ganZhi) {
    const nayinMap = {
      甲子: "海中金",
      乙丑: "海中金",
      丙寅: "炉中火",
      丁卯: "炉中火",
      戊辰: "大林木",
      己巳: "大林木",
      庚午: "路旁土",
      辛未: "路旁土",
      壬申: "剑锋金",
      癸酉: "剑锋金",
      甲戌: "山头火",
      乙亥: "山头火",
      丙子: "涧下水",
      丁丑: "涧下水",
      戊寅: "城头土",
      己卯: "城头土",
      庚辰: "白蜡金",
      辛巳: "白蜡金",
      壬午: "杨柳木",
      癸未: "杨柳木",
      甲申: "泉中水",
      乙酉: "泉中水",
      丙戌: "屋上土",
      丁亥: "屋上土",
      戊子: "霹雳火",
      己丑: "霹雳火",
      庚寅: "松柏木",
      辛卯: "松柏木",
      壬辰: "长流水",
      癸巳: "长流水",
      甲午: "砂中金",
      乙未: "砂中金",
      丙申: "山下火",
      丁酉: "山下火",
      戊戌: "平地木",
      己亥: "平地木",
      庚子: "壁上土",
      辛丑: "壁上土",
      壬寅: "金箔金",
      癸卯: "金箔金",
      甲辰: "覆灯火",
      乙巳: "覆灯火",
      丙午: "天河水",
      丁未: "天河水",
      戊申: "大驿土",
      己酉: "大驿土",
      庚戌: "钗钏金",
      辛亥: "钗钏金",
      壬子: "桑柘木",
      癸丑: "桑柘木",
      甲寅: "大溪水",
      乙卯: "大溪水",
      丙辰: "沙中土",
      丁巳: "沙中土",
      戊午: "天上火",
      己未: "天上火",
      庚申: "石榴木",
      辛酉: "石榴木",
      壬戌: "大海水",
      癸亥: "大海水",
    };

    return nayinMap[ganZhi] || "未知";
  }

  /**
   * 计算年龄
   * @param {SolarDate} birthDate - 出生日期
   * @param {SolarDate} [currentDate] - 当前日期
   * @returns {number} 年龄
   */
  static calculateAge(birthDate, currentDate) {
    const current = currentDate || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    };

    let age = current.year - birthDate.year;

    // 检查是否已过生日
    if (
      current.month < birthDate.month ||
      (current.month === birthDate.month && current.day < birthDate.day)
    ) {
      age--;
    }

    return age;
  }

  /**
   * 获取节气信息
   * @param {SolarDate} solarDate - 阳历日期
   * @returns {string} 节气
   */
  static getSolarTerm(solarDate) {
    try {
      const solar = Solar.fromYmdHms(
        solarDate.year,
        solarDate.month,
        solarDate.day,
        solarDate.hour,
        solarDate.minute,
        0,
      );

      // 返回基于月份的大概节气
      const monthTerms = [
        "小寒",
        "立春",
        "惊蛰",
        "清明",
        "立夏",
        "芒种",
        "小暑",
        "立秋",
        "白露",
        "寒露",
        "立冬",
        "大雪",
      ];
      return monthTerms[solarDate.month - 1] || "";
    } catch (error) {
      console.warn("获取节气失败:", error);
      return "";
    }
  }

  /**
   * 验证日期格式
   * @param {string} dateStr - 日期字符串
   * @param {string} timeStr - 时间字符串
   * @returns {boolean} 是否有效
   */
  static validateDate(dateStr, timeStr) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(dateStr) || !timeRegex.test(timeStr)) {
      return false;
    }

    const dateParts = dateStr.split("-").map(Number);
    const timeParts = timeStr.split(":").map(Number);

    if (dateParts.length !== 3 || timeParts.length !== 2) return false;

    const [year, month, day] = dateParts;
    const [hour, minute] = timeParts;

    // 基本范围检查
    if (!year || year < 1900 || year > 2100) return false;
    if (!month || month < 1 || month > 12) return false;
    if (!day || day < 1 || day > 31) return false;
    if (hour == null || hour < 0 || hour > 23) return false;
    if (minute == null || minute < 0 || minute > 59) return false;

    // 检查日期是否有效
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
}

module.exports = {
  CalendarConverter,
};
