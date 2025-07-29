/**
 * 择日工具
 */

class DateSelector {
  async selectAuspiciousDate(args) {
    try {
      const { chart, eventType, dateRange, timePreference = "any" } = args;

      const auspiciousDates = this.calculateAuspiciousDates(
        chart,
        eventType,
        dateRange,
        timePreference,
      );

      return {
        success: true,
        data: {
          recommendedDates: auspiciousDates,
          eventType: eventType,
          analysis: this.getDateAnalysis(eventType),
          precautions: this.getEventPrecautions(eventType),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  calculateAuspiciousDates(chart, eventType, dateRange, timePreference) {
    // 简化的择日算法
    const dates = [];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (this.isAuspiciousDate(d, eventType)) {
        dates.push({
          date: d.toISOString().split("T")[0],
          score: Math.floor(Math.random() * 30) + 70,
          timeSlots: this.getAuspiciousTimeSlots(d, timePreference),
          reasons: this.getAuspiciousReasons(d, eventType),
        });
      }
    }

    return dates.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  isAuspiciousDate(date, eventType) {
    // 简化判断：避开周一和周五
    const day = date.getDay();
    return day !== 1 && day !== 5;
  }

  getAuspiciousTimeSlots(date, preference) {
    const slots = [];
    if (preference === "morning" || preference === "any") {
      slots.push("09:00-11:00");
    }
    if (preference === "afternoon" || preference === "any") {
      slots.push("14:00-16:00");
    }
    if (preference === "evening" || preference === "any") {
      slots.push("18:00-20:00");
    }
    return slots;
  }

  getAuspiciousReasons(date, eventType) {
    return [`适合${eventType}的吉日`, "星象配置良好", "五行调和"];
  }

  getDateAnalysis(eventType) {
    const analyses = {
      wedding: "婚礼择日重在和谐美满",
      business_opening: "开业择日重在财运亨通",
      moving: "搬家择日重在平安顺利",
      travel: "出行择日重在一路平安",
      investment: "投资择日重在财源广进",
    };
    return analyses[eventType] || "择日分析";
  }

  getEventPrecautions(eventType) {
    return ["注意天气变化", "提前做好准备", "保持良好心态"];
  }
}

module.exports = {
  DateSelector,
};
