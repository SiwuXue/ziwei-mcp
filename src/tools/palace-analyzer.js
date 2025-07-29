/**
 * 紫微斗数宫位分析工具
 */

/**
 * 宫位分析输入参数验证
 * @param {Object} args - 输入参数
 * @returns {Object} 验证结果
 */
function validatePalaceAnalysisInput(args) {
  const errors = [];

  if (!args.chartId || typeof args.chartId !== "string") {
    errors.push("命盘ID不能为空");
  }

  const validPalaceNames = [
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

  if (!args.palaceName || !validPalaceNames.includes(args.palaceName)) {
    errors.push("无效的宫位名称");
  }

  const validAnalysisTypes = ["basic", "detailed", "fortune"];
  if (args.analysisType && !validAnalysisTypes.includes(args.analysisType)) {
    errors.push("无效的分析类型");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      chartId: args.chartId,
      palaceName: args.palaceName,
      analysisType: args.analysisType || "basic",
    },
  };
}

/**
 * 临时图表生成器（模拟）
 */
class ChartGenerator {
  static getChart(chartId) {
    // 这里应该从数据库或缓存中获取命盘数据
    // 现在返回模拟数据
    return {
      palaces: [
        {
          name: "命宫",
          position: 0,
          earthlyBranch: "子",
          element: "water",
          stars: [
            { name: "紫微", type: "main" },
            { name: "天府", type: "main" },
            { name: "左辅", type: "auxiliary" },
          ],
          mainStar: { name: "紫微" },
          brightness: "庙",
          strength: 85,
          isBodyPalace: false,
        },
        {
          name: "兄弟宫",
          position: 1,
          earthlyBranch: "丑",
          element: "earth",
          stars: [
            { name: "天机", type: "main" },
            { name: "文昌", type: "auxiliary" },
          ],
          mainStar: { name: "天机" },
          brightness: "旺",
          strength: 70,
          isBodyPalace: false,
        },
        // 其他宫位...
        {
          name: "夫妻宫",
          position: 2,
          earthlyBranch: "寅",
          element: "wood",
          stars: [
            { name: "太阳", type: "main" },
            { name: "右弼", type: "auxiliary" },
          ],
          mainStar: { name: "太阳" },
          brightness: "得",
          strength: 75,
          isBodyPalace: false,
        },
      ],
    };
  }
}

class PalaceAnalyzer {
  /**
   * 执行宫位分析
   */
  async execute(args) {
    try {
      // 验证输入参数
      const validation = validatePalaceAnalysisInput(args);
      if (!validation.valid) {
        throw new Error(validation.errors.join("; "));
      }

      const input = validation.data;

      // 获取命盘
      const chart = ChartGenerator.getChart(input.chartId);
      if (!chart) {
        throw new Error(`未找到命盘: ${input.chartId}`);
      }

      // 查找指定宫位
      const palace = chart.palaces.find((p) => p.name === input.palaceName);
      if (!palace) {
        throw new Error(`未找到宫位: ${input.palaceName}`);
      }

      // 执行分析
      const analysis = await this.analyzePalace(
        palace,
        chart,
        input.analysisType,
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                analysis,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: error.message,
              },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 分析宫位
   */
  async analyzePalace(palace, chart, analysisType) {
    const baseAnalysis = {
      palaceName: palace.name,
      position: palace.position,
      earthlyBranch: palace.earthlyBranch,
      element: palace.element,
      stars: palace.stars.map((star) => star.name),
      mainStar: palace.mainStar?.name,
      brightness: palace.brightness,
      strength: palace.strength,
      isBodyPalace: palace.isBodyPalace,
    };

    switch (analysisType) {
      case "basic":
        return {
          ...baseAnalysis,
          palace: palace.name,
          interpretation: this.getBasicInterpretation(palace),
          characteristics: this.getPalaceCharacteristics(palace),
          suggestions: this.getBasicSuggestions(palace),
        };

      case "detailed":
        return {
          ...baseAnalysis,
          palace: palace.name,
          interpretation: this.getDetailedInterpretation(palace, chart),
          characteristics: this.getPalaceCharacteristics(palace),
          starCombinations: this.analyzeStarCombinations(palace),
          strengthAnalysis: this.analyzeStrength(palace),
          elementAnalysis: this.analyzeElement(palace),
          suggestions: this.getDetailedSuggestions(palace),
          relatedPalaces: this.getRelatedPalaces(palace, chart),
        };

      case "fortune":
        return {
          ...baseAnalysis,
          palace: palace.name,
          interpretation: this.getFortuneInterpretation(palace, chart),
          characteristics: this.getPalaceCharacteristics(palace),
          fortuneTrends: this.analyzeFortunetrends(palace),
          luckyPeriods: this.getLuckyPeriods(palace),
          challenges: this.getChallenges(palace),
          suggestions: this.getFortuneSuggestions(palace),
        };

      default:
        return {
          ...baseAnalysis,
          palace: palace.name,
          interpretation: this.getBasicInterpretation(palace),
        };
    }
  }

  /**
   * 获取基础解释
   */
  getBasicInterpretation(palace) {
    const palaceInterpretations = {
      命宫: "代表个人的性格、外貌、才能和人生方向",
      兄弟宫: "代表兄弟姐妹关系、朋友关系和合作伙伴",
      夫妻宫: "代表婚姻状况、配偶特质和感情生活",
      子女宫: "代表子女缘分、创造力和部属关系",
      财帛宫: "代表财运、理财能力和金钱观念",
      疾厄宫: "代表健康状况、体质和疾病倾向",
      迁移宫: "代表外出运势、人际关系和环境适应",
      奴仆宫: "代表朋友运、部属关系和社交能力",
      官禄宫: "代表事业运势、工作能力和社会地位",
      田宅宫: "代表不动产、居住环境和家庭状况",
      福德宫: "代表精神享受、兴趣爱好和福分",
      父母宫: "代表父母关系、长辈缘分和学习能力",
    };

    let interpretation = palaceInterpretations[palace.name] || "";

    if (palace.mainStar) {
      interpretation += `。主星为${palace.mainStar.name}，${this.getStarBasicMeaning(palace.mainStar.name)}。`;
    }

    if (palace.isBodyPalace) {
      interpretation += "此宫位同时为身宫，影响后天的努力方向和成就。";
    }

    return interpretation;
  }

  /**
   * 获取详细解释
   */
  getDetailedInterpretation(palace, chart) {
    let interpretation = this.getBasicInterpretation(palace);

    // 分析星曜组合
    const starCombination = this.analyzeStarCombinations(palace);
    if (starCombination.length > 0) {
      interpretation += `\n\n星曜组合分析：${starCombination.join("；")}。`;
    }

    // 分析宫位强弱
    const strengthAnalysis = this.analyzeStrength(palace);
    interpretation += `\n\n宫位强度：${strengthAnalysis}。`;

    // 分析五行属性
    const elementAnalysis = this.analyzeElement(palace);
    interpretation += `\n\n五行分析：${elementAnalysis}。`;

    return interpretation;
  }

  /**
   * 获取运势解释
   */
  getFortuneInterpretation(palace, chart) {
    let interpretation = this.getBasicInterpretation(palace);

    // 分析运势趋势
    const fortuneTrends = this.analyzeFortunetrends(palace);
    interpretation += `\n\n运势趋势：${fortuneTrends.join("；")}。`;

    // 分析吉凶时期
    const luckyPeriods = this.getLuckyPeriods(palace);
    if (luckyPeriods.length > 0) {
      interpretation += `\n\n吉利时期：${luckyPeriods.join("、")}。`;
    }

    return interpretation;
  }

  /**
   * 获取宫位特征
   */
  getPalaceCharacteristics(palace) {
    const characteristics = [];

    // 根据主星分析特征
    if (palace.mainStar) {
      characteristics.push(
        ...this.getStarCharacteristics(palace.mainStar.name),
      );
    }

    // 根据宫位强度分析
    if (palace.strength >= 80) {
      characteristics.push("宫位强旺");
    } else if (palace.strength >= 60) {
      characteristics.push("宫位平稳");
    } else {
      characteristics.push("宫位较弱");
    }

    // 根据亮度分析
    switch (palace.brightness) {
      case "庙":
        characteristics.push("星曜庙旺，发挥最佳");
        break;
      case "旺":
        characteristics.push("星曜旺盛，表现良好");
        break;
      case "得":
        characteristics.push("星曜得地，平稳发展");
        break;
      case "利":
        characteristics.push("星曜利益，小有收获");
        break;
      case "平":
        characteristics.push("星曜平常，表现一般");
        break;
      case "不":
        characteristics.push("星曜不得地，需要努力");
        break;
      case "陷":
        characteristics.push("星曜陷落，困难较多");
        break;
    }

    return characteristics;
  }

  /**
   * 分析星曜组合
   */
  analyzeStarCombinations(palace) {
    const combinations = [];
    const starNames = palace.stars.map((star) => star.name);

    // 检查常见的星曜组合
    if (starNames.includes("紫微") && starNames.includes("天府")) {
      combinations.push("紫微天府同宫，帝王之相，主贵显");
    }

    if (starNames.includes("太阳") && starNames.includes("太阴")) {
      combinations.push("日月同宫，阴阳调和，主聪明");
    }

    if (starNames.includes("武曲") && starNames.includes("贪狼")) {
      combinations.push("武贪同宫，先贫后富，主财运");
    }

    if (starNames.includes("廉贞") && starNames.includes("七杀")) {
      combinations.push("廉杀同宫，主变动，宜武职");
    }

    if (starNames.includes("天机") && starNames.includes("天梁")) {
      combinations.push("机梁同宫，善谋略，主智慧");
    }

    // 检查辅星组合
    if (starNames.includes("左辅") && starNames.includes("右弼")) {
      combinations.push("左右同宫，得贵人助力");
    }

    if (starNames.includes("文昌") && starNames.includes("文曲")) {
      combinations.push("昌曲同宫，主文才，利考试");
    }

    if (starNames.includes("擎羊") || starNames.includes("陀罗")) {
      combinations.push("羊陀入宫，主刑克，需谨慎");
    }

    if (starNames.includes("火星") || starNames.includes("铃星")) {
      combinations.push("火铃入宫，主急躁，宜控制情绪");
    }

    return combinations;
  }

  /**
   * 分析宫位强度
   */
  analyzeStrength(palace) {
    if (palace.strength >= 90) {
      return "极强，各方面表现优异";
    } else if (palace.strength >= 80) {
      return "很强，大部分方面表现良好";
    } else if (palace.strength >= 70) {
      return "较强，多数方面表现不错";
    } else if (palace.strength >= 60) {
      return "中等，表现平稳";
    } else if (palace.strength >= 50) {
      return "偏弱，需要努力改善";
    } else {
      return "较弱，面临较多挑战";
    }
  }

  /**
   * 分析五行属性
   */
  analyzeElement(palace) {
    const elementDescriptions = {
      wood: "木性，主生发，具有向上成长的特质",
      fire: "火性，主光明，具有热情积极的特质",
      earth: "土性，主稳重，具有踏实可靠的特质",
      metal: "金性，主坚毅，具有果断决断的特质",
      water: "水性，主智慧，具有灵活变通的特质",
    };

    return elementDescriptions[palace.element] || "五行属性不明";
  }

  /**
   * 分析运势趋势
   */
  analyzeFortunetrends(palace) {
    const trends = [];

    // 根据主星分析运势
    if (palace.mainStar) {
      const starTrends = this.getStarFortuneTrends(palace.mainStar.name);
      trends.push(...starTrends);
    }

    // 根据宫位强度分析
    if (palace.strength >= 70) {
      trends.push("整体运势向好");
    } else if (palace.strength >= 50) {
      trends.push("运势平稳发展");
    } else {
      trends.push("需要谨慎应对");
    }

    return trends;
  }

  /**
   * 获取吉利时期
   */
  getLuckyPeriods(palace) {
    const periods = [];

    // 根据五行属性确定吉利时期
    switch (palace.element) {
      case "wood":
        periods.push("春季", "寅卯月");
        break;
      case "fire":
        periods.push("夏季", "巳午月");
        break;
      case "earth":
        periods.push("四季月", "辰戌丑未月");
        break;
      case "metal":
        periods.push("秋季", "申酉月");
        break;
      case "water":
        periods.push("冬季", "亥子月");
        break;
    }

    return periods;
  }

  /**
   * 获取挑战
   */
  getChallenges(palace) {
    const challenges = [];
    const starNames = palace.stars.map((star) => star.name);

    // 检查煞星
    if (starNames.includes("擎羊")) {
      challenges.push("容易冲动，需控制脾气");
    }
    if (starNames.includes("陀罗")) {
      challenges.push("容易拖延，需提高效率");
    }
    if (starNames.includes("火星")) {
      challenges.push("性格急躁，需保持冷静");
    }
    if (starNames.includes("铃星")) {
      challenges.push("情绪波动，需调节心态");
    }

    // 根据宫位强度分析挑战
    if (palace.strength < 50) {
      challenges.push("宫位较弱，需要额外努力");
    }

    return challenges;
  }

  /**
   * 获取基础建议
   */
  getBasicSuggestions(palace) {
    const suggestions = [];

    if (palace.mainStar) {
      suggestions.push(...this.getStarSuggestions(palace.mainStar.name));
    }

    // 根据宫位特点给出建议
    switch (palace.name) {
      case "命宫":
        suggestions.push("注重个人修养，发挥天赋才能");
        break;
      case "财帛宫":
        suggestions.push("理性理财，开源节流");
        break;
      case "官禄宫":
        suggestions.push("专注事业发展，提升专业技能");
        break;
      case "夫妻宫":
        suggestions.push("重视感情沟通，维护婚姻和谐");
        break;
      case "子女宫":
        suggestions.push("关爱子女成长，培养创造能力");
        break;
      case "疾厄宫":
        suggestions.push("注意身体健康，预防疾病");
        break;
      case "迁移宫":
        suggestions.push("把握外出机会，拓展人际关系");
        break;
      case "奴仆宫":
        suggestions.push("善待朋友部属，建立良好关系");
        break;
      case "田宅宫":
        suggestions.push("合理投资房产，营造温馨家庭");
        break;
      case "福德宫":
        suggestions.push("培养兴趣爱好，享受精神生活");
        break;
      case "父母宫":
        suggestions.push("孝敬父母长辈，重视学习成长");
        break;
      case "兄弟宫":
        suggestions.push("维护手足情谊，加强团队合作");
        break;
    }

    return suggestions;
  }

  /**
   * 获取详细建议
   */
  getDetailedSuggestions(palace) {
    const suggestions = this.getBasicSuggestions(palace);

    // 根据星曜组合给出具体建议
    const starNames = palace.stars.map((star) => star.name);

    if (starNames.includes("文昌") || starNames.includes("文曲")) {
      suggestions.push("适合从事文教、文化相关工作");
    }

    if (starNames.includes("武曲")) {
      suggestions.push("适合从事金融、财务相关工作");
    }

    if (starNames.includes("天机")) {
      suggestions.push("适合从事策划、咨询相关工作");
    }

    return suggestions;
  }

  /**
   * 获取运势建议
   */
  getFortuneSuggestions(palace) {
    const suggestions = this.getDetailedSuggestions(palace);

    // 添加运势相关的建议
    const luckyPeriods = this.getLuckyPeriods(palace);
    if (luckyPeriods.length > 0) {
      suggestions.push(`在${luckyPeriods.join("、")}期间把握机会`);
    }

    const challenges = this.getChallenges(palace);
    if (challenges.length > 0) {
      suggestions.push("注意克服个人弱点，化解不利因素");
    }

    return suggestions;
  }

  /**
   * 获取相关宫位
   */
  getRelatedPalaces(palace, chart) {
    const relatedPalaces = {
      命宫: ["身宫", "福德宫", "父母宫"],
      财帛宫: ["田宅宫", "官禄宫", "福德宫"],
      官禄宫: ["财帛宫", "田宅宫", "迁移宫"],
      夫妻宫: ["子女宫", "福德宫", "迁移宫"],
      子女宫: ["夫妻宫", "奴仆宫", "田宅宫"],
      疾厄宫: ["父母宫", "兄弟宫", "福德宫"],
      迁移宫: ["官禄宫", "夫妻宫", "奴仆宫"],
      奴仆宫: ["迁移宫", "子女宫", "兄弟宫"],
      田宅宫: ["财帛宫", "官禄宫", "子女宫"],
      福德宫: ["命宫", "财帛宫", "疾厄宫"],
      父母宫: ["命宫", "疾厄宫", "兄弟宫"],
      兄弟宫: ["父母宫", "疾厄宫", "奴仆宫"],
    };

    return relatedPalaces[palace.name] || [];
  }

  /**
   * 获取星曜基本含义
   */
  getStarBasicMeaning(starName) {
    const meanings = {
      紫微: "主贵显，具有领导才能",
      天机: "主智慧，善于谋略",
      太阳: "主权威，热情开朗",
      武曲: "主财富，意志坚定",
      天同: "主享受，性格温和",
      廉贞: "主变化，个性复杂",
      天府: "主稳重，保守务实",
      太阴: "主柔和，细腻敏感",
      贪狼: "主欲望，多才多艺",
      巨门: "主口舌，善于表达",
      天相: "主助力，忠诚可靠",
      天梁: "主庇护，长者风范",
      七杀: "主冲动，勇敢果断",
      破军: "主破坏，开创变革",
    };
    return meanings[starName] || "辅助作用";
  }

  /**
   * 获取星曜特征
   */
  getStarCharacteristics(starName) {
    const characteristics = {
      紫微: ["尊贵", "领导力强", "自尊心高"],
      天机: ["聪明", "善变", "多谋"],
      太阳: ["光明", "热情", "权威"],
      武曲: ["刚毅", "财运", "决断"],
      天同: ["温和", "享受", "人缘好"],
      廉贞: ["复杂", "变化", "桃花"],
      天府: ["稳重", "保守", "财库"],
      太阴: ["柔和", "敏感", "财富"],
      贪狼: ["多才", "欲望", "桃花"],
      巨门: ["口才", "是非", "暗曜"],
      天相: ["忠诚", "助力", "印绶"],
      天梁: ["庇护", "长者", "化解"],
      七杀: ["冲动", "勇敢", "孤克"],
      破军: ["开创", "变革", "破坏"],
    };
    return characteristics[starName] || ["辅助特质"];
  }

  /**
   * 获取星曜建议
   */
  getStarSuggestions(starName) {
    const suggestions = {
      紫微: ["发挥领导才能", "注重品德修养", "避免过于自负"],
      天机: ["善用智慧", "保持灵活", "避免过于多变"],
      太阳: ["发挥正面影响力", "保持热情", "注意不要过于强势"],
      武曲: ["理性理财", "坚持目标", "避免过于固执"],
      天同: ["享受生活", "维护人际关系", "避免过于安逸"],
      廉贞: ["控制欲望", "保持专注", "避免感情纠纷"],
      天府: ["稳健发展", "积累财富", "避免过于保守"],
      太阴: ["发挥细腻特质", "注重内在修养", "避免过于敏感"],
      贪狼: ["发挥多才多艺", "控制欲望", "避免贪心不足"],
      巨门: ["善用口才", "避免是非", "注意言辞"],
      天相: ["发挥助人特质", "保持忠诚", "避免过于依赖"],
      天梁: ["发挥庇护作用", "传承经验", "避免过于保守"],
      七杀: ["发挥勇气", "控制冲动", "避免孤军奋战"],
      破军: ["勇于创新", "适度变革", "避免破坏过度"],
    };
    return suggestions[starName] || ["发挥正面特质"];
  }

  /**
   * 获取星曜运势趋势
   */
  getStarFortuneTrends(starName) {
    const trends = {
      紫微: ["贵人运佳", "地位提升"],
      天机: ["智慧增长", "机会增多"],
      太阳: ["名声远播", "权威增强"],
      武曲: ["财运亨通", "事业稳定"],
      天同: ["生活安逸", "人际和谐"],
      廉贞: ["变化较多", "需要适应"],
      天府: ["财富积累", "地位稳固"],
      太阴: ["内在成长", "财运渐佳"],
      贪狼: ["机会多样", "需要选择"],
      巨门: ["表达机会", "注意口舌"],
      天相: ["得到助力", "合作顺利"],
      天梁: ["化险为夷", "长者相助"],
      七杀: ["突破困境", "勇往直前"],
      破军: ["变革创新", "旧去新来"],
    };
    return trends[starName] || ["平稳发展"];
  }
}

module.exports = {
  PalaceAnalyzer,
  validatePalaceAnalysisInput,
};
