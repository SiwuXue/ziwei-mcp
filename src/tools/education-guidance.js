/**
 * 教育指导工具
 */

class EducationGuidance {
  async provideGuidance(args) {
    try {
      const {
        chartId,
        studentAge,
        educationLevel,
        subjectAreas = [],
        guidanceType,
      } = args;

      // 获取命盘数据
      const chart = this.getChartById(chartId);
      if (!chart) {
        throw new Error(`未找到命盘: ${chartId}`);
      }

      const guidance = {
        studentProfile: this.analyzeStudentProfile(
          chart,
          studentAge,
          educationLevel,
        ),
        learningPotential: this.analyzeLearningPotential(chart),
        subjectRecommendations: this.recommendSubjects(chart, subjectAreas),
        learningStyleAnalysis: this.analyzeLearningStyle(chart),
        guidanceByType: this.provideSpecificGuidance(
          chart,
          guidanceType,
          educationLevel,
        ),
        developmentPlan: this.createDevelopmentPlan(
          chart,
          studentAge,
          educationLevel,
        ),
        parentalGuidance: this.provideParentalGuidance(chart, studentAge),
        environmentRecommendations: this.recommendLearningEnvironment(chart),
        motivationStrategies: this.suggestMotivationStrategies(chart),
        challengeSupport: this.provideChallengeSupport(chart, educationLevel),
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
      info: { name: "小明" },
      palaces: [
        { name: "命宫", stars: [{ name: "天机" }], strength: 80 },
        { name: "父母宫", stars: [{ name: "文昌" }], strength: 85 },
        { name: "福德宫", stars: [{ name: "天同" }], strength: 75 },
        { name: "官禄宫", stars: [{ name: "紫微" }], strength: 78 },
      ],
    };
  }

  analyzeStudentProfile(chart, age, level) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");
    const parentPalace = chart.palaces.find((p) => p.name === "父母宫");

    return {
      age: age,
      educationLevel: level,
      intellectualCapacity: this.assessIntellectualCapacity(destinyPalace),
      learningAttitude: this.assessLearningAttitude(parentPalace),
      personalityTraits: this.identifyLearningPersonalityTraits(destinyPalace),
      strengths: this.identifyLearningStrengths(chart),
      challenges: this.identifyLearningChallenges(chart),
      developmentalStage: this.analyzeDevelopmentalStage(age),
    };
  }

  analyzeLearningPotential(chart) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");
    const parentPalace = chart.palaces.find((p) => p.name === "父母宫");

    return {
      overallPotential: this.calculateOverallLearningPotential(
        destinyPalace,
        parentPalace,
      ),
      cognitiveAbilities: this.analyzeCognitiveAbilities(destinyPalace),
      memoryCapacity: this.assessMemoryCapacity(destinyPalace),
      analyticalThinking: this.assessAnalyticalThinking(destinyPalace),
      creativeThinking: this.assessCreativeThinking(destinyPalace),
      concentrationAbility: this.assessConcentrationAbility(destinyPalace),
      learningSpeed: this.assessLearningSpeed(destinyPalace),
      comprehensionDepth: this.assessComprehensionDepth(destinyPalace),
    };
  }

  recommendSubjects(chart, userSubjects) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");
    const recommendations = this.getSubjectRecommendations(destinyPalace);

    return {
      highlyRecommended: recommendations.filter((sub) => sub.score >= 85),
      suitable: recommendations.filter(
        (sub) => sub.score >= 70 && sub.score < 85,
      ),
      challenging: recommendations.filter((sub) => sub.score < 70),
      userSubjectsAnalysis: userSubjects.map((subject) => ({
        subject,
        aptitude: this.analyzeSubjectAptitude(destinyPalace, subject),
        studyMethods: this.recommendStudyMethods(subject),
        improvementStrategies: this.suggestImprovementStrategies(subject),
      })),
    };
  }

  analyzeLearningStyle(chart) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      primaryStyle: this.identifyPrimaryLearningStyle(destinyPalace),
      secondaryStyles: this.identifySecondaryLearningStyles(destinyPalace),
      preferredMethods: this.identifyPreferredLearningMethods(destinyPalace),
      environmentPreferences:
        this.identifyEnvironmentPreferences(destinyPalace),
      timePreferences: this.identifyTimePreferences(destinyPalace),
      socialPreferences: this.identifySocialPreferences(destinyPalace),
      motivationFactors: this.identifyMotivationFactors(destinyPalace),
    };
  }

  provideSpecificGuidance(chart, guidanceType, educationLevel) {
    const guidance = {
      aptitude_assessment: this.provideAptitudeAssessment(chart),
      study_methods: this.provideStudyMethods(chart, educationLevel),
      career_planning: this.provideCareerPlanning(chart),
      exam_preparation: this.provideExamPreparation(chart, educationLevel),
    };

    return guidance[guidanceType] || this.provideGeneralGuidance(chart);
  }

  createDevelopmentPlan(chart, age, level) {
    return {
      shortTermGoals: this.setShortTermGoals(chart, level),
      mediumTermGoals: this.setMediumTermGoals(chart, level),
      longTermGoals: this.setLongTermGoals(chart, age),
      skillDevelopment: this.planSkillDevelopment(chart),
      milestones: this.defineLearningMilestones(level),
      timeline: this.createLearningTimeline(age, level),
      resources: this.identifyLearningResources(chart),
      assessmentMethods: this.suggestAssessmentMethods(chart),
    };
  }

  provideParentalGuidance(chart, age) {
    return {
      supportStrategies: this.suggestParentalSupportStrategies(chart, age),
      communicationTips: this.provideParentalCommunicationTips(age),
      environmentCreation: this.guideEnvironmentCreation(chart),
      motivationTechniques: this.suggestParentalMotivationTechniques(chart),
      challengeHandling: this.guideChallengeHandling(chart, age),
      expectationManagement: this.guideExpectationManagement(chart, age),
      collaborationWithSchool: this.guideSchoolCollaboration(chart),
    };
  }

  recommendLearningEnvironment(chart) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      physicalEnvironment: this.recommendPhysicalEnvironment(destinyPalace),
      studySpace: this.recommendStudySpace(destinyPalace),
      tools: this.recommendLearningTools(destinyPalace),
      schedule: this.recommendStudySchedule(destinyPalace),
      atmosphere: this.recommendLearningAtmosphere(destinyPalace),
    };
  }

  suggestMotivationStrategies(chart) {
    const destinyPalace = chart.palaces.find((p) => p.name === "命宫");

    return {
      intrinsicMotivation: this.developIntrinsicMotivation(destinyPalace),
      extrinsicMotivation: this.suggestExtrinsicMotivation(destinyPalace),
      goalSetting: this.guideGoalSetting(destinyPalace),
      rewardSystems: this.designRewardSystems(destinyPalace),
      challengeFraming: this.frameChallengesPositively(destinyPalace),
    };
  }

  provideChallengeSupport(chart, level) {
    return {
      commonChallenges: this.identifyCommonChallenges(level),
      personalizedChallenges: this.identifyPersonalizedChallenges(chart),
      supportStrategies: this.developSupportStrategies(chart),
      resourceRecommendations: this.recommendSupportResources(level),
      professionalHelp: this.guideProfessionalHelp(chart),
    };
  }

  // 辅助方法实现
  assessIntellectualCapacity(palace) {
    return {
      level:
        palace.strength >= 80
          ? "高"
          : palace.strength >= 65
            ? "中上"
            : palace.strength >= 50
              ? "中等"
              : "需要培养",
      description: this.getIntellectualDescription(palace.strength),
    };
  }

  getIntellectualDescription(strength) {
    if (strength >= 85) return "智力超群，学习能力极强";
    if (strength >= 75) return "智力优秀，学习能力很强";
    if (strength >= 65) return "智力良好，学习能力较强";
    if (strength >= 55) return "智力一般，需要努力学习";
    return "需要特别关注和培养";
  }

  assessLearningAttitude(palace) {
    const hasStudyStars = palace.stars.some((s) =>
      ["文昌", "文曲"].includes(s.name),
    );
    return hasStudyStars ? "积极主动" : "需要引导";
  }

  identifyLearningPersonalityTraits(palace) {
    const traits = [];
    palace.stars.forEach((star) => {
      switch (star.name) {
        case "天机":
          traits.push("思维敏捷", "好奇心强", "善于思考");
          break;
        case "紫微":
          traits.push("自尊心强", "有领导欲", "追求完美");
          break;
        case "太阳":
          traits.push("开朗活泼", "表现欲强", "乐于分享");
          break;
        case "天同":
          traits.push("性格温和", "不喜竞争", "需要鼓励");
          break;
      }
    });
    return traits.length > 0 ? traits : ["性格平和", "学习稳定"];
  }

  identifyLearningStrengths(chart) {
    const strengths = [];
    chart.palaces.forEach((palace) => {
      palace.stars.forEach((star) => {
        if (star.name === "文昌") strengths.push("文科能力强");
        if (star.name === "文曲") strengths.push("语言表达好");
        if (star.name === "天机") strengths.push("逻辑思维强");
        if (star.name === "紫微") strengths.push("组织能力强");
      });
    });
    return strengths.length > 0 ? strengths : ["基础学习能力"];
  }

  identifyLearningChallenges(chart) {
    return ["注意力集中", "学习持久性", "应试技巧"];
  }

  analyzeDevelopmentalStage(age) {
    if (age < 6) return "学前期 - 启蒙教育阶段";
    if (age < 12) return "小学期 - 基础学习阶段";
    if (age < 15) return "初中期 - 知识拓展阶段";
    if (age < 18) return "高中期 - 深度学习阶段";
    if (age < 22) return "大学期 - 专业学习阶段";
    return "研究生期 - 研究学习阶段";
  }

  calculateOverallLearningPotential(destinyPalace, parentPalace) {
    const score = (destinyPalace.strength + parentPalace.strength) / 2;
    return {
      score: score,
      level:
        score >= 80
          ? "优秀"
          : score >= 70
            ? "良好"
            : score >= 60
              ? "中等"
              : "需要培养",
      description: this.getLearningPotentialDescription(score),
    };
  }

  getLearningPotentialDescription(score) {
    if (score >= 85) return "学习潜力极高，天赋异禀";
    if (score >= 75) return "学习潜力很好，前途光明";
    if (score >= 65) return "学习潜力不错，需要努力";
    return "学习潜力一般，需要特别培养";
  }

  analyzeCognitiveAbilities(palace) {
    return {
      logicalReasoning: palace.strength >= 75 ? "强" : "中等",
      spatialThinking: palace.strength >= 70 ? "强" : "中等",
      verbalAbility: palace.strength >= 80 ? "强" : "中等",
      numericalAbility: palace.strength >= 75 ? "强" : "中等",
    };
  }

  assessMemoryCapacity(palace) {
    return palace.strength >= 75
      ? "优秀"
      : palace.strength >= 60
        ? "良好"
        : "需要训练";
  }

  assessAnalyticalThinking(palace) {
    const hasAnalyticalStars = palace.stars.some((s) =>
      ["天机", "紫微"].includes(s.name),
    );
    return hasAnalyticalStars ? "强" : "中等";
  }

  assessCreativeThinking(palace) {
    const hasCreativeStars = palace.stars.some((s) =>
      ["贪狼", "破军"].includes(s.name),
    );
    return hasCreativeStars ? "强" : "中等";
  }

  assessConcentrationAbility(palace) {
    return palace.strength >= 70
      ? "好"
      : palace.strength >= 55
        ? "一般"
        : "需要培养";
  }

  assessLearningSpeed(palace) {
    return palace.strength >= 80
      ? "快"
      : palace.strength >= 65
        ? "中等"
        : "较慢";
  }

  assessComprehensionDepth(palace) {
    return palace.strength >= 75
      ? "深"
      : palace.strength >= 60
        ? "中等"
        : "需要引导";
  }

  getSubjectRecommendations(palace) {
    const recommendations = [];

    palace.stars.forEach((star) => {
      switch (star.name) {
        case "文昌":
          recommendations.push({
            subject: "语文",
            score: 90,
            reason: "文昌主文，语言能力强",
          });
          recommendations.push({
            subject: "历史",
            score: 85,
            reason: "文科思维发达",
          });
          break;
        case "文曲":
          recommendations.push({
            subject: "外语",
            score: 88,
            reason: "语言天赋好",
          });
          recommendations.push({
            subject: "文学",
            score: 83,
            reason: "表达能力强",
          });
          break;
        case "天机":
          recommendations.push({
            subject: "数学",
            score: 87,
            reason: "逻辑思维强",
          });
          recommendations.push({
            subject: "物理",
            score: 82,
            reason: "分析能力好",
          });
          break;
        case "紫微":
          recommendations.push({
            subject: "政治",
            score: 85,
            reason: "领导才能",
          });
          recommendations.push({
            subject: "管理",
            score: 80,
            reason: "组织能力强",
          });
          break;
      }
    });

    if (recommendations.length === 0) {
      recommendations.push({
        subject: "综合科目",
        score: 70,
        reason: "全面发展",
      });
    }

    return recommendations;
  }

  analyzeSubjectAptitude(palace, subject) {
    const score = Math.floor(Math.random() * 30) + 60;
    return {
      score: score,
      level: score >= 80 ? "很有天赋" : score >= 65 ? "有一定天赋" : "需要努力",
      potential: this.getSubjectPotential(subject, score),
    };
  }

  getSubjectPotential(subject, score) {
    return `在${subject}方面${score >= 75 ? "潜力很大" : score >= 60 ? "有一定潜力" : "需要培养"}`;
  }

  recommendStudyMethods(subject) {
    const methods = {
      数学: ["多做练习题", "理解概念原理", "建立知识体系"],
      语文: ["多读多写", "积累词汇", "培养语感"],
      英语: ["听说读写并重", "创造语言环境", "坚持每日练习"],
      物理: ["理论联系实际", "做实验验证", "培养物理思维"],
      化学: ["记忆化学方程式", "理解反应原理", "实验操作练习"],
      生物: ["理解生命现象", "记忆生物术语", "观察生物实验"],
      历史: ["时间线梳理", "因果关系分析", "史料阅读"],
      地理: ["地图记忆", "空间思维", "实地观察"],
      政治: ["理论学习", "时事关注", "思辨能力培养"],
    };

    return methods[subject] || ["制定学习计划", "定期复习", "寻求帮助"];
  }

  suggestImprovementStrategies(subject) {
    return [
      "找到学习兴趣点",
      "制定具体目标",
      "寻找合适的学习方法",
      "定期评估进步",
      "寻求老师和同学帮助",
    ];
  }

  identifyPrimaryLearningStyle(palace) {
    const star = palace.stars[0];
    const styles = {
      天机: "逻辑分析型",
      紫微: "系统学习型",
      太阳: "互动讨论型",
      天同: "温和渐进型",
      文昌: "阅读理解型",
      文曲: "表达创作型",
    };

    return styles[star?.name] || "综合学习型";
  }

  identifySecondaryLearningStyles(palace) {
    return ["视觉学习", "听觉学习", "动手实践"];
  }

  identifyPreferredLearningMethods(palace) {
    return ["课堂学习", "自主学习", "小组讨论", "实践操作"];
  }

  identifyEnvironmentPreferences(palace) {
    return {
      noise: "安静环境",
      lighting: "充足光线",
      temperature: "适宜温度",
      space: "整洁有序",
    };
  }

  identifyTimePreferences(palace) {
    return {
      bestTime: "上午时段",
      duration: "45-60分钟",
      breaks: "每小时休息10分钟",
    };
  }

  identifySocialPreferences(palace) {
    return {
      style: "小组学习",
      interaction: "适度互动",
      competition: "良性竞争",
    };
  }

  identifyMotivationFactors(palace) {
    return ["成就感", "认可", "兴趣", "目标"];
  }

  provideAptitudeAssessment(chart) {
    return {
      assessment: "综合天赋评估",
      strengths: this.identifyLearningStrengths(chart),
      recommendations: "发挥优势，补强弱项",
    };
  }

  provideStudyMethods(chart, level) {
    return {
      methods: "个性化学习方法",
      techniques: ["主动学习", "定期复习", "知识整合"],
      tools: ["学习计划", "笔记系统", "复习卡片"],
    };
  }

  provideCareerPlanning(chart) {
    return {
      planning: "职业发展规划",
      directions: ["学术研究", "实用技能", "创新创业"],
      preparation: "能力培养和经验积累",
    };
  }

  provideExamPreparation(chart, level) {
    return {
      preparation: "考试准备策略",
      techniques: ["复习计划", "应试技巧", "心理调节"],
      timeline: "分阶段准备",
    };
  }

  provideGeneralGuidance(chart) {
    return {
      guidance: "综合学习指导",
      focus: "全面发展",
      approach: "因材施教",
    };
  }

  setShortTermGoals(chart, level) {
    return ["提高学习效率", "掌握基础知识", "培养学习习惯"];
  }

  setMediumTermGoals(chart, level) {
    return ["提升学科能力", "发展特长", "建立知识体系"];
  }

  setLongTermGoals(chart, age) {
    return ["实现学业目标", "培养核心能力", "规划未来发展"];
  }

  planSkillDevelopment(chart) {
    return {
      cognitive: "认知能力发展",
      social: "社交能力培养",
      emotional: "情感管理能力",
      practical: "实践操作能力",
    };
  }

  defineLearningMilestones(level) {
    const milestones = {
      elementary: ["基础知识掌握", "学习习惯养成"],
      middle_school: ["学科能力提升", "思维能力发展"],
      high_school: ["深度学习", "专业方向选择"],
      university: ["专业能力", "研究能力"],
      graduate: ["专业精深", "创新能力"],
    };

    return milestones[level] || ["全面发展"];
  }

  createLearningTimeline(age, level) {
    return {
      current: `${age}岁 - ${level}阶段`,
      next: "下一阶段准备",
      future: "长远发展规划",
    };
  }

  identifyLearningResources(chart) {
    return {
      books: "推荐书籍",
      online: "在线资源",
      tutoring: "辅导资源",
      practice: "实践机会",
    };
  }

  suggestAssessmentMethods(chart) {
    return ["定期测试", "作业评估", "项目评价", "自我反思"];
  }

  suggestParentalSupportStrategies(chart, age) {
    return ["创造良好学习环境", "给予适当鼓励", "关注学习过程", "培养学习兴趣"];
  }

  provideParentalCommunicationTips(age) {
    return ["耐心倾听", "积极沟通", "理解支持", "合理期望"];
  }

  guideEnvironmentCreation(chart) {
    return {
      physical: "物理环境布置",
      emotional: "情感环境营造",
      social: "社交环境建设",
    };
  }

  suggestParentalMotivationTechniques(chart) {
    return ["设定合理目标", "及时肯定进步", "培养内在动机", "提供适当奖励"];
  }

  guideChallengeHandling(chart, age) {
    return ["识别问题根源", "制定解决方案", "寻求专业帮助", "保持耐心支持"];
  }

  guideExpectationManagement(chart, age) {
    return ["了解孩子特点", "设定合理期望", "关注个人进步", "避免过度压力"];
  }

  guideSchoolCollaboration(chart) {
    return ["与老师保持沟通", "参与学校活动", "配合教学计划", "共同关注发展"];
  }

  recommendPhysicalEnvironment(palace) {
    return {
      lighting: "自然光充足",
      noise: "安静无干扰",
      temperature: "舒适温度",
      furniture: "符合人体工学",
    };
  }

  recommendStudySpace(palace) {
    return {
      organization: "整洁有序",
      materials: "学习用品齐全",
      distractions: "减少干扰因素",
      comfort: "舒适度适中",
    };
  }

  recommendLearningTools(palace) {
    return ["学习计划表", "笔记本", "参考书籍", "学习软件", "计时器"];
  }

  recommendStudySchedule(palace) {
    return {
      daily: "每日学习时间安排",
      weekly: "周学习计划",
      breaks: "休息时间安排",
      flexibility: "灵活调整",
    };
  }

  recommendLearningAtmosphere(palace) {
    return {
      mood: "积极向上",
      support: "支持鼓励",
      challenge: "适度挑战",
      fun: "寓教于乐",
    };
  }

  developIntrinsicMotivation(palace) {
    return ["培养学习兴趣", "设定个人目标", "体验成就感", "发现学习意义"];
  }

  suggestExtrinsicMotivation(palace) {
    return ["适当奖励机制", "社会认可", "竞争激励", "外部压力"];
  }

  guideGoalSetting(palace) {
    return {
      smart: "SMART目标原则",
      shortTerm: "短期目标设定",
      longTerm: "长期目标规划",
      review: "定期目标回顾",
    };
  }

  designRewardSystems(palace) {
    return {
      immediate: "即时奖励",
      delayed: "延迟满足",
      intrinsic: "内在奖励",
      social: "社会奖励",
    };
  }

  frameChallengesPositively(palace) {
    return ["将困难视为成长机会", "关注解决过程", "庆祝小进步", "保持积极心态"];
  }

  identifyCommonChallenges(level) {
    const challenges = {
      elementary: ["注意力不集中", "学习习惯未养成"],
      middle_school: ["学习压力增大", "青春期困扰"],
      high_school: ["升学压力", "时间管理"],
      university: ["自主学习", "专业选择"],
      graduate: ["研究压力", "就业焦虑"],
    };

    return challenges[level] || ["学习动机", "方法选择"];
  }

  identifyPersonalizedChallenges(chart) {
    return ["个人学习特点相关挑战", "性格特征带来的困难", "环境因素影响"];
  }

  developSupportStrategies(chart) {
    return ["个性化支持方案", "多元化帮助渠道", "持续跟踪调整"];
  }

  recommendSupportResources(level) {
    return ["学校资源", "家庭支持", "社会资源", "专业机构"];
  }

  guideProfessionalHelp(chart) {
    return {
      when: "何时寻求专业帮助",
      who: "寻求哪些专业人士",
      how: "如何获得专业帮助",
      what: "专业帮助的内容",
    };
  }
}

module.exports = EducationGuidance;
