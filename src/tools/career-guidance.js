/**
 * 职业发展指导工具
 */

class CareerGuidance {
  async provideGuidance(args) {
    try {
      const {
        chartId,
        currentAge,
        careerStage,
        industries = [],
        decisionType,
      } = args;

      // 获取命盘数据
      const chart = this.getChartById(chartId);
      if (!chart) {
        throw new Error(`未找到命盘: ${chartId}`);
      }

      const guidance = {
        currentAssessment: this.assessCurrentSituation(
          chart,
          currentAge,
          careerStage,
        ),
        careerPotential: this.analyzeCareerPotential(chart),
        industryRecommendations: this.recommendIndustries(chart, industries),
        decisionGuidance: decisionType
          ? this.provideDecisionGuidance(chart, decisionType, currentAge)
          : null,
        developmentPath: this.suggestDevelopmentPath(chart, careerStage),
        skillRecommendations: this.recommendSkills(chart),
        timingAdvice: this.provideTimingAdvice(chart, currentAge),
        actionPlan: this.createActionPlan(chart, careerStage, decisionType),
      };

      return {
        success: true,
        data: guidance,
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
        { name: "命宫", stars: [{ name: "紫微" }], strength: 85 },
        { name: "官禄宫", stars: [{ name: "武曲" }], strength: 78 },
        { name: "财帛宫", stars: [{ name: "天府" }], strength: 82 },
        { name: "迁移宫", stars: [{ name: "天机" }], strength: 75 },
      ],
    };
  }

  assessCurrentSituation(chart, currentAge, careerStage) {
    const careerPalace = chart.palaces.find((p) => p.name === "官禄宫");
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      age: currentAge,
      stage: careerStage,
      careerStrength: careerPalace.strength,
      personalStrength: destinyPalace.strength,
      currentPhase: this.determineCareerPhase(currentAge, careerStage),
      keyCharacteristics: this.getCareerCharacteristics(careerPalace),
      currentChallenges: this.identifyCurrentChallenges(careerStage),
      opportunities: this.identifyCurrentOpportunities(careerStage),
    };
  }

  analyzeCareerPotential(chart) {
    const careerPalace = chart.palaces.find((p) => p.name === "官禄宫");
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      overallPotential: this.calculateOverallPotential(
        careerPalace,
        destinyPalace,
      ),
      leadershipAbility: this.assessLeadershipAbility(destinyPalace),
      innovationCapacity: this.assessInnovationCapacity(careerPalace),
      teamworkSkills: this.assessTeamworkSkills(chart),
      communicationAbility: this.assessCommunicationAbility(chart),
      adaptability: this.assessAdaptability(chart),
      stressResistance: this.assessStressResistance(chart),
    };
  }

  recommendIndustries(chart, userIndustries) {
    const careerPalace = chart.palaces.find((p) => p.name === "官禄宫");
    const recommendedIndustries = this.getIndustryRecommendations(careerPalace);

    const analysis = {
      highlyRecommended: recommendedIndustries.filter((ind) => ind.score >= 85),
      suitable: recommendedIndustries.filter(
        (ind) => ind.score >= 70 && ind.score < 85,
      ),
      considerWithCaution: recommendedIndustries.filter(
        (ind) => ind.score < 70,
      ),
      userIndustriesAnalysis: userIndustries.map((industry) => ({
        industry,
        suitability: this.analyzeIndustrySuitability(careerPalace, industry),
        advice: this.getIndustryAdvice(careerPalace, industry),
      })),
    };

    return analysis;
  }

  provideDecisionGuidance(chart, decisionType, currentAge) {
    const guidance = {
      decisionType,
      currentAge,
      recommendation: this.getDecisionRecommendation(
        chart,
        decisionType,
        currentAge,
      ),
      pros: this.getDecisionPros(chart, decisionType),
      cons: this.getDecisionCons(chart, decisionType),
      timing: this.getDecisionTiming(chart, decisionType, currentAge),
      preparationSteps: this.getPreparationSteps(decisionType),
      riskAssessment: this.assessDecisionRisk(chart, decisionType),
      successFactors: this.identifySuccessFactors(chart, decisionType),
    };

    return guidance;
  }

  suggestDevelopmentPath(chart, careerStage) {
    const paths = {
      student: this.getStudentPath(chart),
      "entry-level": this.getEntryLevelPath(chart),
      "mid-career": this.getMidCareerPath(chart),
      senior: this.getSeniorPath(chart),
      executive: this.getExecutivePath(chart),
      entrepreneur: this.getEntrepreneurPath(chart),
    };

    return paths[careerStage] || this.getGeneralPath(chart);
  }

  recommendSkills(chart) {
    const careerPalace = chart.palaces.find((p) => p.name === "官禄宫");

    return {
      coreSkills: this.getCoreSkillRecommendations(careerPalace),
      technicalSkills: this.getTechnicalSkillRecommendations(careerPalace),
      softSkills: this.getSoftSkillRecommendations(chart),
      leadershipSkills: this.getLeadershipSkillRecommendations(chart),
      learningPriority: this.prioritizeSkillLearning(chart),
      developmentMethods: this.suggestSkillDevelopmentMethods(),
    };
  }

  provideTimingAdvice(chart, currentAge) {
    return {
      currentPeriod: this.analyzeCurrentPeriod(chart, currentAge),
      bestTimingFor: {
        careerChange: this.getBestTimingForCareerChange(chart, currentAge),
        promotion: this.getBestTimingForPromotion(chart, currentAge),
        entrepreneurship: this.getBestTimingForEntrepreneurship(
          chart,
          currentAge,
        ),
        skillDevelopment: this.getBestTimingForSkillDevelopment(
          chart,
          currentAge,
        ),
      },
      upcomingOpportunities: this.identifyUpcomingOpportunities(
        chart,
        currentAge,
      ),
      periodsToAvoid: this.identifyPeriodsToAvoid(chart, currentAge),
    };
  }

  createActionPlan(chart, careerStage, decisionType) {
    return {
      shortTerm: this.createShortTermPlan(chart, careerStage),
      mediumTerm: this.createMediumTermPlan(chart, careerStage),
      longTerm: this.createLongTermPlan(chart, careerStage),
      milestones: this.defineMilestones(careerStage, decisionType),
      resources: this.identifyRequiredResources(careerStage, decisionType),
      timeline: this.createTimeline(careerStage, decisionType),
      successMetrics: this.defineSuccessMetrics(careerStage, decisionType),
    };
  }

  // 辅助方法实现
  determineCareerPhase(age, stage) {
    if (age < 25) return "探索期";
    if (age < 35) return "建立期";
    if (age < 45) return "发展期";
    if (age < 55) return "巅峰期";
    return "传承期";
  }

  getCareerCharacteristics(palace) {
    return palace.stars.map((star) =>
      this.getStarCareerCharacteristic(star.name),
    );
  }

  getStarCareerCharacteristic(starName) {
    const characteristics = {
      紫微: "天生领导者，适合管理岗位",
      武曲: "执行力强，适合财务金融",
      天机: "智慧过人，适合策划咨询",
      太阳: "影响力大，适合公关营销",
      天府: "稳重可靠，适合行政管理",
    };
    return characteristics[starName] || "具有职场优势";
  }

  identifyCurrentChallenges(stage) {
    const challenges = {
      student: ["缺乏实践经验", "职业方向不明确"],
      "entry-level": ["技能需要提升", "职场适应期"],
      "mid-career": ["职业瓶颈", "工作生活平衡"],
      senior: ["管理压力", "创新挑战"],
      executive: ["战略决策", "团队管理"],
      entrepreneur: ["资金压力", "市场竞争"],
    };
    return challenges[stage] || ["职业发展挑战"];
  }

  identifyCurrentOpportunities(stage) {
    const opportunities = {
      student: ["实习机会", "技能学习"],
      "entry-level": ["快速成长", "建立人脉"],
      "mid-career": ["专业深化", "管理转型"],
      senior: ["行业影响", "团队建设"],
      executive: ["战略规划", "企业发展"],
      entrepreneur: ["市场机会", "创新突破"],
    };
    return opportunities[stage] || ["职业发展机会"];
  }

  calculateOverallPotential(careerPalace, destinyPalace) {
    const score = (careerPalace.strength + destinyPalace.strength) / 2;
    return {
      score: score,
      level: score >= 80 ? "高" : score >= 65 ? "中等" : "需努力",
      description: this.getPotentialDescription(score),
    };
  }

  getPotentialDescription(score) {
    if (score >= 85) return "职业发展潜力极高，前途无量";
    if (score >= 75) return "职业发展潜力很好，有望成功";
    if (score >= 65) return "职业发展潜力不错，需要努力";
    return "职业发展需要加倍努力，但仍有机会";
  }

  assessLeadershipAbility(palace) {
    const hasLeadershipStars = palace.stars.some((s) =>
      ["紫微", "天府", "太阳"].includes(s.name),
    );
    return hasLeadershipStars ? "强" : "中等";
  }

  assessInnovationCapacity(palace) {
    const hasInnovationStars = palace.stars.some((s) =>
      ["天机", "破军", "贪狼"].includes(s.name),
    );
    return hasInnovationStars ? "强" : "中等";
  }

  assessTeamworkSkills(chart) {
    const servantPalace = chart.palaces.find((p) => p.name === "奴仆宫");
    return servantPalace
      ? servantPalace.strength >= 70
        ? "强"
        : "中等"
      : "中等";
  }

  assessCommunicationAbility(chart) {
    const migrationPalace = chart.palaces.find((p) => p.name === "迁移宫");
    return migrationPalace
      ? migrationPalace.strength >= 70
        ? "强"
        : "中等"
      : "中等";
  }

  assessAdaptability(chart) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");
    const hasAdaptableStars = destinyPalace.stars.some((s) =>
      ["天机", "天同", "太阴"].includes(s.name),
    );
    return hasAdaptableStars ? "强" : "中等";
  }

  assessStressResistance(chart) {
    const healthPalace = chart.palaces.find((p) => p.name === "疾厄宫");
    return healthPalace
      ? healthPalace.strength >= 70
        ? "强"
        : "中等"
      : "中等";
  }

  getIndustryRecommendations(palace) {
    const recommendations = [];

    palace.stars.forEach((star) => {
      switch (star.name) {
        case "武曲":
          recommendations.push({
            industry: "金融银行",
            score: 90,
            reason: "武曲主财，适合金融行业",
          });
          recommendations.push({
            industry: "会计财务",
            score: 85,
            reason: "数字敏感，财务管理能力强",
          });
          break;
        case "紫微":
          recommendations.push({
            industry: "政府机关",
            score: 90,
            reason: "紫微主贵，适合公职",
          });
          recommendations.push({
            industry: "大型企业管理",
            score: 85,
            reason: "天生领导者",
          });
          break;
        case "天机":
          recommendations.push({
            industry: "咨询策划",
            score: 88,
            reason: "智慧过人，善于谋略",
          });
          recommendations.push({
            industry: "科技互联网",
            score: 82,
            reason: "思维敏捷，适应性强",
          });
          break;
        case "太阳":
          recommendations.push({
            industry: "媒体传播",
            score: 87,
            reason: "影响力大，善于表达",
          });
          recommendations.push({
            industry: "教育培训",
            score: 83,
            reason: "能够启发他人",
          });
          break;
        case "天府":
          recommendations.push({
            industry: "行政管理",
            score: 85,
            reason: "稳重可靠，管理能力强",
          });
          recommendations.push({
            industry: "房地产",
            score: 80,
            reason: "天府主库，适合不动产",
          });
          break;
      }
    });

    // 如果没有特殊推荐，给出通用建议
    if (recommendations.length === 0) {
      recommendations.push({
        industry: "服务业",
        score: 70,
        reason: "适应性强，服务意识好",
      });
      recommendations.push({
        industry: "制造业",
        score: 68,
        reason: "踏实肯干，执行力强",
      });
    }

    return recommendations;
  }

  analyzeIndustrySuitability(palace, industry) {
    // 简化的行业适配度分析
    const score = Math.floor(Math.random() * 30) + 60;
    return {
      score: score,
      level: score >= 80 ? "高度适合" : score >= 65 ? "比较适合" : "需要努力",
      factors: this.getIndustryFactors(industry),
    };
  }

  getIndustryFactors(industry) {
    return [`${industry}行业的关键成功因素`, "个人能力匹配度分析"];
  }

  getIndustryAdvice(palace, industry) {
    return `在${industry}行业发展的具体建议和注意事项`;
  }

  getDecisionRecommendation(chart, decisionType, age) {
    const recommendations = {
      career_change: age < 35 ? "建议" : age < 45 ? "谨慎考虑" : "不建议",
      job_selection: "建议选择有发展潜力的职位",
      promotion: "积极争取，时机成熟",
      entrepreneurship: age < 40 ? "可以尝试" : "需要谨慎",
      retirement: age >= 55 ? "可以考虑" : "为时尚早",
    };
    return recommendations[decisionType] || "需要具体分析";
  }

  getDecisionPros(chart, decisionType) {
    return [`${decisionType}的优势和机会`, "有利因素分析"];
  }

  getDecisionCons(chart, decisionType) {
    return [`${decisionType}的风险和挑战`, "不利因素分析"];
  }

  getDecisionTiming(chart, decisionType, age) {
    return {
      bestTiming: "最佳时机分析",
      currentTiming: "当前时机评估",
      futureOpportunities: "未来机会预测",
    };
  }

  getPreparationSteps(decisionType) {
    const steps = {
      career_change: ["技能评估", "市场调研", "人脉建设", "财务准备"],
      promotion: ["能力提升", "业绩展示", "关系维护", "机会把握"],
      entrepreneurship: ["商业计划", "资金筹备", "团队组建", "市场验证"],
    };
    return steps[decisionType] || ["充分准备", "谨慎决策"];
  }

  assessDecisionRisk(chart, decisionType) {
    return {
      level: "中等",
      factors: [`${decisionType}的主要风险因素`],
      mitigation: ["风险缓解措施"],
    };
  }

  identifySuccessFactors(chart, decisionType) {
    return [`${decisionType}成功的关键因素`, "个人优势发挥"];
  }

  getStudentPath(chart) {
    return {
      focus: "学习基础知识，培养核心技能",
      milestones: ["完成学业", "实习经验", "职业规划"],
      timeline: "2-4年",
    };
  }

  getEntryLevelPath(chart) {
    return {
      focus: "快速学习，积累经验",
      milestones: ["适应职场", "技能提升", "初步成果"],
      timeline: "1-3年",
    };
  }

  getMidCareerPath(chart) {
    return {
      focus: "专业深化，管理转型",
      milestones: ["专业认可", "团队管理", "项目成功"],
      timeline: "3-5年",
    };
  }

  getSeniorPath(chart) {
    return {
      focus: "战略思维，影响力扩大",
      milestones: ["行业专家", "团队建设", "业务拓展"],
      timeline: "5-8年",
    };
  }

  getExecutivePath(chart) {
    return {
      focus: "企业战略，组织发展",
      milestones: ["战略制定", "组织变革", "业绩突破"],
      timeline: "持续发展",
    };
  }

  getEntrepreneurPath(chart) {
    return {
      focus: "创新创业，市场开拓",
      milestones: ["产品开发", "市场验证", "规模扩张"],
      timeline: "3-10年",
    };
  }

  getGeneralPath(chart) {
    return {
      focus: "稳步发展，持续提升",
      milestones: ["技能提升", "经验积累", "职业发展"],
      timeline: "持续进行",
    };
  }

  getCoreSkillRecommendations(palace) {
    return ["专业技能", "沟通能力", "问题解决", "团队协作"];
  }

  getTechnicalSkillRecommendations(palace) {
    return ["行业专业技能", "工具使用", "技术更新", "数据分析"];
  }

  getSoftSkillRecommendations(chart) {
    return ["领导力", "情商管理", "创新思维", "适应能力"];
  }

  getLeadershipSkillRecommendations(chart) {
    return ["团队管理", "决策能力", "沟通协调", "战略思维"];
  }

  prioritizeSkillLearning(chart) {
    return {
      urgent: ["当前工作急需技能"],
      important: ["职业发展重要技能"],
      future: ["未来趋势技能"],
    };
  }

  suggestSkillDevelopmentMethods() {
    return ["在线课程学习", "实践项目锻炼", "导师指导", "同行交流", "专业培训"];
  }

  analyzeCurrentPeriod(chart, age) {
    return {
      phase: this.determineCareerPhase(age, "general"),
      characteristics: "当前阶段特点",
      opportunities: "当前机会",
      challenges: "当前挑战",
    };
  }

  getBestTimingForCareerChange(chart, age) {
    return age < 35 ? "当前时机较好" : "需要谨慎考虑";
  }

  getBestTimingForPromotion(chart, age) {
    return "积极争取，准备充分时";
  }

  getBestTimingForEntrepreneurship(chart, age) {
    return age < 40 ? "可以考虑" : "需要充分准备";
  }

  getBestTimingForSkillDevelopment(chart, age) {
    return "任何时候都是学习的好时机";
  }

  identifyUpcomingOpportunities(chart, age) {
    return ["即将到来的职业机会", "行业发展趋势"];
  }

  identifyPeriodsToAvoid(chart, age) {
    return ["需要谨慎的时期", "避免重大决策的时间"];
  }

  createShortTermPlan(chart, stage) {
    return {
      duration: "3-6个月",
      goals: ["短期目标设定"],
      actions: ["具体行动计划"],
      metrics: ["成功衡量标准"],
    };
  }

  createMediumTermPlan(chart, stage) {
    return {
      duration: "1-2年",
      goals: ["中期目标设定"],
      actions: ["阶段性行动"],
      metrics: ["进展评估标准"],
    };
  }

  createLongTermPlan(chart, stage) {
    return {
      duration: "3-5年",
      goals: ["长期愿景目标"],
      actions: ["战略性布局"],
      metrics: ["最终成功标准"],
    };
  }

  defineMilestones(stage, decisionType) {
    return ["第一阶段里程碑", "第二阶段里程碑", "最终目标达成"];
  }

  identifyRequiredResources(stage, decisionType) {
    return {
      financial: "资金需求",
      human: "人力资源",
      knowledge: "知识技能",
      network: "人脉关系",
      time: "时间投入",
    };
  }

  createTimeline(stage, decisionType) {
    return {
      phase1: "第一阶段时间安排",
      phase2: "第二阶段时间安排",
      phase3: "第三阶段时间安排",
    };
  }

  defineSuccessMetrics(stage, decisionType) {
    return ["量化成功指标", "质化评估标准", "阶段性检查点"];
  }
}

module.exports = {
  CareerGuidance,
};
