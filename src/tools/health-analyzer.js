/**
 * 健康分析工具
 */

class HealthAnalyzer {
  async analyzeHealth(args) {
    try {
      const {
        chartId,
        currentAge,
        healthConcerns = [],
        analysisType = "prevention",
      } = args;

      // 获取命盘数据
      const chart = this.getChartById(chartId);
      if (!chart) {
        throw new Error(`未找到命盘: ${chartId}`);
      }

      const analysis = {
        currentAge: currentAge,
        analysisType: analysisType,
        constitutionAnalysis: this.analyzeConstitution(chart),
        healthRiskAssessment: this.assessHealthRisks(
          chart,
          currentAge,
          healthConcerns,
        ),
        organSystemAnalysis: this.analyzeOrganSystems(chart),
        mentalHealthAnalysis: this.analyzeMentalHealth(chart),
        lifeStageGuidance: this.provideLifeStageGuidance(chart, currentAge),
        preventiveMeasures: this.recommendPreventiveMeasures(
          chart,
          analysisType,
        ),
        lifestyleRecommendations: this.provideLifestyleRecommendations(chart),
        seasonalGuidance: this.provideSeasonalGuidance(chart),
        emergencyPrecautions: this.identifyEmergencyPrecautions(
          chart,
          healthConcerns,
        ),
      };

      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getChartById(chartId) {
    // 模拟数据
    return {
      id: chartId,
      info: { name: "张三" },
      palaces: [
        {
          name: "疾厄宫",
          stars: [{ name: "太阳" }],
          strength: 75,
          element: "fire",
        },
        {
          name: "命宫",
          stars: [{ name: "紫微" }],
          strength: 85,
          element: "earth",
        },
        {
          name: "福德宫",
          stars: [{ name: "天同" }],
          strength: 80,
          element: "water",
        },
      ],
    };
  }

  analyzeConstitution(chart) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      overallConstitution: this.assessOverallConstitution(
        healthPalace,
        destinyPalace,
      ),
      bodyType: this.determineBodyType(healthPalace),
      elementalBalance: this.analyzeElementalBalance(chart),
      energyLevel: this.assessEnergyLevel(healthPalace),
      immuneSystem: this.assessImmuneSystem(healthPalace),
      recovery: this.assessRecoveryAbility(healthPalace),
      constitutionStrengths: this.identifyConstitutionStrengths(healthPalace),
      constitutionWeaknesses: this.identifyConstitutionWeaknesses(healthPalace),
    };
  }

  assessHealthRisks(chart, age, concerns) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");

    return {
      ageRelatedRisks: this.identifyAgeRelatedRisks(age),
      starInfluencedRisks: this.identifyStarInfluencedRisks(healthPalace),
      concernSpecificRisks: this.analyzeConcernSpecificRisks(
        concerns,
        healthPalace,
      ),
      riskLevels: this.categorizeRiskLevels(healthPalace, age),
      preventionStrategies: this.developPreventionStrategies(
        healthPalace,
        concerns,
      ),
      monitoringRecommendations: this.recommendMonitoring(age, concerns),
    };
  }

  analyzeOrganSystems(chart) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");

    return {
      cardiovascular: this.analyzeCardiovascular(healthPalace),
      respiratory: this.analyzeRespiratory(healthPalace),
      digestive: this.analyzeDigestive(healthPalace),
      nervous: this.analyzeNervous(healthPalace),
      musculoskeletal: this.analyzeMusculoskeletal(healthPalace),
      endocrine: this.analyzeEndocrine(healthPalace),
      immune: this.analyzeImmune(healthPalace),
      reproductive: this.analyzeReproductive(healthPalace),
    };
  }

  analyzeMentalHealth(chart) {
    const fortunePalace = chart.palaces.find((p) => p.name === "福德宫");
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      emotionalStability: this.assessEmotionalStability(fortunePalace),
      stressResistance: this.assessStressResistance(destinyPalace),
      mentalResilience: this.assessMentalResilience(fortunePalace),
      cognitiveFunction: this.assessCognitiveFunction(destinyPalace),
      socialWellbeing: this.assessSocialWellbeing(chart),
      sleepQuality: this.assessSleepQuality(fortunePalace),
      mentalHealthRisks: this.identifyMentalHealthRisks(fortunePalace),
      copingStrategies: this.recommendCopingStrategies(fortunePalace),
    };
  }

  provideLifeStageGuidance(chart, age) {
    const stage = this.determineLifeStage(age);

    return {
      currentStage: stage,
      stageCharacteristics: this.getStageCharacteristics(stage),
      healthPriorities: this.getHealthPriorities(stage),
      commonIssues: this.getCommonIssues(stage),
      preventiveFocus: this.getPreventiveFocus(stage),
      lifestyleAdjustments: this.getLifestyleAdjustments(stage),
      screeningRecommendations: this.getScreeningRecommendations(stage, age),
    };
  }

  recommendPreventiveMeasures(chart, analysisType) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");

    const measures = {
      prevention: this.getPreventiveMeasures(healthPalace),
      current_issues: this.getCurrentIssuesMeasures(healthPalace),
      long_term_trends: this.getLongTermMeasures(healthPalace),
    };

    return measures[analysisType] || measures.prevention;
  }

  provideLifestyleRecommendations(chart) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");

    return {
      diet: this.recommendDiet(healthPalace),
      exercise: this.recommendExercise(healthPalace),
      sleep: this.recommendSleep(healthPalace),
      stressManagement: this.recommendStressManagement(healthPalace),
      workLifeBalance: this.recommendWorkLifeBalance(chart),
      socialActivities: this.recommendSocialActivities(chart),
      hobbies: this.recommendHobbies(chart),
      environment: this.recommendEnvironment(healthPalace),
    };
  }

  provideSeasonalGuidance(chart) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");

    return {
      spring: this.getSpringGuidance(healthPalace),
      summer: this.getSummerGuidance(healthPalace),
      autumn: this.getAutumnGuidance(healthPalace),
      winter: this.getWinterGuidance(healthPalace),
    };
  }

  identifyEmergencyPrecautions(chart, concerns) {
    return {
      warningSignsToWatch: this.identifyWarningSignsToWatch(concerns),
      emergencyContacts: this.recommendEmergencyContacts(),
      firstAidMeasures: this.recommendFirstAidMeasures(concerns),
      whenToSeekHelp: this.defineWhenToSeekHelp(concerns),
    };
  }

  // 辅助方法实现
  assessOverallConstitution(healthPalace, destinyPalace) {
    const score = (healthPalace.strength + destinyPalace.strength) / 2;
    return {
      score: score,
      level:
        score >= 80
          ? "强健"
          : score >= 65
            ? "良好"
            : score >= 50
              ? "一般"
              : "需要调理",
      description: this.getConstitutionDescription(score),
    };
  }

  getConstitutionDescription(score) {
    if (score >= 85) return "体质优秀，抵抗力强，很少生病";
    if (score >= 70) return "体质良好，注意保养可保持健康";
    if (score >= 55) return "体质一般，需要加强锻炼和调理";
    return "体质较弱，需要重点关注健康管理";
  }

  determineBodyType(palace) {
    const element = palace.element;
    const types = {
      fire: "火型体质 - 热性体质，精力充沛",
      earth: "土型体质 - 平和体质，消化良好",
      metal: "金型体质 - 燥性体质，呼吸系统敏感",
      water: "水型体质 - 寒性体质，肾功能重要",
      wood: "木型体质 - 风性体质，肝胆功能活跃",
    };
    return types[element] || "平和体质";
  }

  analyzeElementalBalance(chart) {
    const elements = chart.palaces.map((p) => p.element);
    const elementCount = {};
    elements.forEach((el) => {
      elementCount[el] = (elementCount[el] || 0) + 1;
    });

    return {
      distribution: elementCount,
      balance: this.assessElementBalance(elementCount),
      recommendations: this.getElementBalanceRecommendations(elementCount),
    };
  }

  assessElementBalance(elementCount) {
    const values = Object.values(elementCount);
    const max = Math.max(...values);
    const min = Math.min(...values);

    if (max - min <= 1) return "平衡";
    if (max - min <= 2) return "基本平衡";
    return "不平衡";
  }

  getElementBalanceRecommendations(elementCount) {
    return ["根据五行平衡调整生活方式", "注意饮食搭配", "适当运动调节"];
  }

  assessEnergyLevel(palace) {
    return palace.strength >= 75
      ? "充沛"
      : palace.strength >= 60
        ? "良好"
        : "需要提升";
  }

  assessImmuneSystem(palace) {
    const hasImmuneStars = palace.stars.some((s) =>
      ["天梁", "天同"].includes(s.name),
    );
    return hasImmuneStars ? "强" : "中等";
  }

  assessRecoveryAbility(palace) {
    return palace.strength >= 70
      ? "快"
      : palace.strength >= 55
        ? "中等"
        : "较慢";
  }

  identifyConstitutionStrengths(palace) {
    return ["体质优势分析", "天赋健康特质"];
  }

  identifyConstitutionWeaknesses(palace) {
    return ["体质弱点分析", "需要注意的健康问题"];
  }

  identifyAgeRelatedRisks(age) {
    if (age < 30) return ["代谢问题", "作息不规律"];
    if (age < 50) return ["慢性病风险", "工作压力"];
    if (age < 65) return ["心血管疾病", "骨质疏松"];
    return ["老年病", "认知功能"];
  }

  identifyStarInfluencedRisks(palace) {
    const risks = [];
    palace.stars.forEach((star) => {
      switch (star.name) {
        case "火星":
          risks.push("炎症性疾病");
          break;
        case "铃星":
          risks.push("慢性疾病");
          break;
        case "擎羊":
          risks.push("外伤风险");
          break;
        case "陀罗":
          risks.push("慢性疼痛");
          break;
      }
    });
    return risks.length > 0 ? risks : ["无特殊风险"];
  }

  analyzeConcernSpecificRisks(concerns, palace) {
    return concerns.map((concern) => ({
      concern: concern,
      riskLevel: this.assessConcernRisk(concern, palace),
      preventionMeasures: this.getConcernPreventionMeasures(concern),
    }));
  }

  assessConcernRisk(concern, palace) {
    // 简化的风险评估
    return palace.strength >= 70 ? "低" : palace.strength >= 50 ? "中" : "高";
  }

  getConcernPreventionMeasures(concern) {
    const measures = {
      cardiovascular: ["规律运动", "健康饮食", "控制血压"],
      digestive: ["规律饮食", "避免刺激性食物", "适量运动"],
      respiratory: ["避免污染", "戒烟", "增强体质"],
      nervous: ["充足睡眠", "减压放松", "适度运动"],
      musculoskeletal: ["适量运动", "正确姿势", "补充钙质"],
      mental_health: ["心理调节", "社交活动", "专业帮助"],
    };
    return measures[concern] || ["保持健康生活方式"];
  }

  categorizeRiskLevels(palace, age) {
    return {
      high: ["高风险健康问题"],
      medium: ["中等风险健康问题"],
      low: ["低风险健康问题"],
    };
  }

  developPreventionStrategies(palace, concerns) {
    return ["定期体检", "健康生活方式", "早期干预", "专业指导"];
  }

  recommendMonitoring(age, concerns) {
    return {
      frequency: age >= 40 ? "每年" : "每两年",
      items: ["常规体检项目", "专项检查"],
      timing: "最佳检查时间建议",
    };
  }

  analyzeCardiovascular(palace) {
    return {
      status: "心血管系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护心血管的建议"],
    };
  }

  analyzeRespiratory(palace) {
    return {
      status: "呼吸系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护呼吸系统的建议"],
    };
  }

  analyzeDigestive(palace) {
    return {
      status: "消化系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护消化系统的建议"],
    };
  }

  analyzeNervous(palace) {
    return {
      status: "神经系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护神经系统的建议"],
    };
  }

  analyzeMusculoskeletal(palace) {
    return {
      status: "肌肉骨骼系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护肌肉骨骼的建议"],
    };
  }

  analyzeEndocrine(palace) {
    return {
      status: "内分泌系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["调节内分泌的建议"],
    };
  }

  analyzeImmune(palace) {
    return {
      status: "免疫系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["增强免疫力的建议"],
    };
  }

  analyzeReproductive(palace) {
    return {
      status: "生殖系统状态评估",
      risks: ["潜在风险因素"],
      recommendations: ["保护生殖健康的建议"],
    };
  }

  assessEmotionalStability(palace) {
    return palace.strength >= 75
      ? "稳定"
      : palace.strength >= 60
        ? "基本稳定"
        : "需要关注";
  }

  assessStressResistance(palace) {
    return palace.strength >= 70
      ? "强"
      : palace.strength >= 55
        ? "中等"
        : "较弱";
  }

  assessMentalResilience(palace) {
    return palace.strength >= 75
      ? "强"
      : palace.strength >= 60
        ? "良好"
        : "需要提升";
  }

  assessCognitiveFunction(palace) {
    return palace.strength >= 80
      ? "优秀"
      : palace.strength >= 65
        ? "良好"
        : "一般";
  }

  assessSocialWellbeing(chart) {
    const servantPalace = chart.palaces.find((p) => p.name === "奴仆宫");
    return servantPalace
      ? servantPalace.strength >= 70
        ? "良好"
        : "需要改善"
      : "一般";
  }

  assessSleepQuality(palace) {
    return palace.strength >= 75
      ? "良好"
      : palace.strength >= 60
        ? "一般"
        : "需要改善";
  }

  identifyMentalHealthRisks(palace) {
    const risks = [];
    if (palace.strength < 60) {
      risks.push("情绪波动");
      risks.push("压力敏感");
    }
    return risks.length > 0 ? risks : ["无明显风险"];
  }

  recommendCopingStrategies(palace) {
    return ["深呼吸放松", "适度运动", "社交活动", "专业咨询", "兴趣爱好"];
  }

  determineLifeStage(age) {
    if (age < 18) return "青少年期";
    if (age < 30) return "青年期";
    if (age < 45) return "中青年期";
    if (age < 60) return "中年期";
    if (age < 75) return "老年前期";
    return "老年期";
  }

  getStageCharacteristics(stage) {
    const characteristics = {
      青少年期: "生长发育期，注重营养和运动",
      青年期: "体力充沛期，注意作息规律",
      中青年期: "事业高峰期，注意工作压力",
      中年期: "生理转折期，注意慢性病预防",
      老年前期: "功能下降期，注意保养",
      老年期: "衰老加速期，注重护理",
    };
    return characteristics[stage] || "注重健康管理";
  }

  getHealthPriorities(stage) {
    const priorities = {
      青少年期: ["营养均衡", "充足睡眠", "适量运动"],
      青年期: ["规律作息", "压力管理", "健康饮食"],
      中青年期: ["定期体检", "工作生活平衡", "慢性病预防"],
      中年期: ["心血管保护", "骨质疏松预防", "内分泌调节"],
      老年前期: ["功能维护", "跌倒预防", "认知保护"],
      老年期: ["生活质量", "并发症预防", "心理健康"],
    };
    return priorities[stage] || ["全面健康管理"];
  }

  getCommonIssues(stage) {
    const issues = {
      青少年期: ["营养不良", "近视", "心理问题"],
      青年期: ["亚健康", "颈椎病", "胃病"],
      中青年期: ["高血压", "糖尿病", "焦虑症"],
      中年期: ["心脏病", "更年期综合征", "关节炎"],
      老年前期: ["骨质疏松", "白内障", "听力下降"],
      老年期: ["老年痴呆", "心脑血管病", "跌倒骨折"],
    };
    return issues[stage] || ["年龄相关健康问题"];
  }

  getPreventiveFocus(stage) {
    const focus = {
      青少年期: "建立健康习惯",
      青年期: "预防职业病",
      中青年期: "慢性病筛查",
      中年期: "重大疾病预防",
      老年前期: "功能衰退延缓",
      老年期: "并发症预防",
    };
    return focus[stage] || "综合预防";
  }

  getLifestyleAdjustments(stage) {
    return [`${stage}的生活方式调整建议`, "适合年龄段的健康管理"];
  }

  getScreeningRecommendations(stage, age) {
    const recommendations = {
      青少年期: ["视力检查", "生长发育评估"],
      青年期: ["常规体检", "心理健康评估"],
      中青年期: ["心血管筛查", "肿瘤筛查"],
      中年期: ["全面体检", "专科检查"],
      老年前期: ["认知功能评估", "骨密度检查"],
      老年期: ["综合评估", "功能评估"],
    };
    return recommendations[stage] || ["定期健康检查"];
  }

  getPreventiveMeasures(palace) {
    return [
      "定期体检",
      "健康饮食",
      "适量运动",
      "充足睡眠",
      "压力管理",
      "戒烟限酒",
    ];
  }

  getCurrentIssuesMeasures(palace) {
    return ["针对性治疗", "生活方式调整", "定期监测", "专业指导"];
  }

  getLongTermMeasures(palace) {
    return ["长期健康规划", "慢性病管理", "功能维护", "生活质量提升"];
  }

  recommendDiet(palace) {
    const element = palace.element;
    const dietRecommendations = {
      fire: "清淡饮食，多吃蔬菜水果，少吃辛辣",
      earth: "规律饮食，注意消化，适量粗粮",
      metal: "润燥食物，多喝水，少吃干燥食品",
      water: "温热食物，少吃生冷，适量补肾",
      wood: "疏肝理气，少吃油腻，多吃绿色蔬菜",
    };
    return dietRecommendations[element] || "均衡营养，适量进食";
  }

  recommendExercise(palace) {
    return {
      type: "有氧运动为主",
      frequency: "每周3-5次",
      duration: "每次30-60分钟",
      intensity: "中等强度",
      specific: ["散步", "游泳", "太极", "瑜伽"],
    };
  }

  recommendSleep(palace) {
    return {
      duration: "7-8小时",
      timing: "晚上10-11点入睡",
      environment: "安静、黑暗、凉爽",
      habits: ["睡前放松", "规律作息", "避免刺激"],
    };
  }

  recommendStressManagement(palace) {
    return [
      "冥想放松",
      "深呼吸练习",
      "适度运动",
      "兴趣爱好",
      "社交活动",
      "专业帮助",
    ];
  }

  recommendWorkLifeBalance(chart) {
    return [
      "合理安排工作时间",
      "定期休息放松",
      "培养兴趣爱好",
      "维护人际关系",
      "注重家庭生活",
    ];
  }

  recommendSocialActivities(chart) {
    return ["参加社区活动", "维护朋友关系", "志愿服务", "兴趣小组", "家庭聚会"];
  }

  recommendHobbies(chart) {
    return ["阅读写作", "音乐艺术", "园艺种植", "手工制作", "旅游摄影"];
  }

  recommendEnvironment(palace) {
    return {
      home: "保持清洁通风，温湿度适宜",
      work: "注意职业防护，减少有害暴露",
      outdoor: "选择空气质量好的环境活动",
    };
  }

  getSpringGuidance(palace) {
    return {
      focus: "养肝护肝，疏肝理气",
      diet: "多吃绿色蔬菜，少吃酸性食物",
      exercise: "适度户外运动，舒展筋骨",
      precautions: "注意过敏，预防感冒",
    };
  }

  getSummerGuidance(palace) {
    return {
      focus: "养心安神，清热解暑",
      diet: "清淡饮食，多喝水，少吃冷饮",
      exercise: "避免高温时段，选择游泳等",
      precautions: "防暑降温，预防中暑",
    };
  }

  getAutumnGuidance(palace) {
    return {
      focus: "养肺润燥，增强免疫",
      diet: "滋阴润燥，多吃梨、蜂蜜等",
      exercise: "适度运动，增强体质",
      precautions: "预防呼吸道疾病，保暖",
    };
  }

  getWinterGuidance(palace) {
    return {
      focus: "养肾藏精，温阳补肾",
      diet: "温热食物，适量进补",
      exercise: "室内运动为主，避免过度",
      precautions: "保暖防寒，预防心脑血管病",
    };
  }

  identifyWarningSignsToWatch(concerns) {
    const warningSignsMap = {
      cardiovascular: ["胸痛", "气短", "心悸", "头晕"],
      digestive: ["腹痛", "恶心", "呕吐", "便血"],
      respiratory: ["呼吸困难", "持续咳嗽", "胸闷"],
      nervous: ["头痛", "意识改变", "肢体无力"],
      musculoskeletal: ["剧烈疼痛", "活动受限", "肿胀"],
      mental_health: ["严重抑郁", "自杀念头", "幻觉"],
    };

    const allSigns = [];
    concerns.forEach((concern) => {
      if (warningSignsMap[concern]) {
        allSigns.push(...warningSignsMap[concern]);
      }
    });

    return allSigns.length > 0 ? allSigns : ["异常症状持续不缓解"];
  }

  recommendEmergencyContacts() {
    return [
      "急救电话：120",
      "家庭医生联系方式",
      "就近医院地址和电话",
      "紧急联系人信息",
    ];
  }

  recommendFirstAidMeasures(concerns) {
    return [
      "保持冷静",
      "确保安全",
      "及时呼救",
      "基本急救措施",
      "记录症状和时间",
    ];
  }

  defineWhenToSeekHelp(concerns) {
    return [
      "症状严重或持续恶化",
      "出现危险征象",
      "常规治疗无效",
      "心理状态异常",
      "不确定时及时就医",
    ];
  }
}

module.exports = {
  HealthAnalyzer,
};
