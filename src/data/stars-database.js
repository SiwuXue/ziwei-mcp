/**
 * 紫微斗数星曜数据库
 * 包含完整的星曜属性、亮度表和解释数据
 */

/**
 * 主星数据库
 */
const MAIN_STARS = {
  紫微: {
    name: "紫微",
    type: "main",
    category: "帝星",
    element: "土",
    nature: "中性偏吉",
    brightness: {
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
    characteristics: {
      personality: ["尊贵", "领导力强", "自尊心高", "有威严"],
      career: ["管理", "政府", "大企业", "领导职位"],
      wealth: ["财运稳定", "适合投资", "有贵人相助"],
      relationships: ["要求高", "配偶条件好", "婚姻稳定"],
      health: ["体质较好", "注意心血管", "压力大时易失眠"],
    },
    description:
      "紫微星为帝王之星，主尊贵、权威、领导。入命者多有领导才能，性格高傲，自尊心强，喜欢被人尊重。",
  },

  天机: {
    name: "天机",
    type: "main",
    category: "智星",
    element: "木",
    nature: "中性",
    brightness: {
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
    characteristics: {
      personality: ["聪明机智", "善于思考", "变化多端", "心思细腻"],
      career: ["策划", "咨询", "技术", "教育", "研究"],
      wealth: ["财运变化大", "适合动态投资", "不宜投机"],
      relationships: ["感情变化多", "要求精神交流", "易有桃花"],
      health: ["神经系统", "失眠多梦", "思虑过度"],
    },
    description:
      "天机星主智慧、机变、思考。入命者聪明伶俐，善于策划，但性格多变，思虑过多。",
  },

  太阳: {
    name: "太阳",
    type: "main",
    category: "贵星",
    element: "火",
    nature: "吉星",
    brightness: {
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
    characteristics: {
      personality: ["光明正大", "热情开朗", "乐于助人", "有正义感"],
      career: ["公职", "教育", "医疗", "服务业", "外交"],
      wealth: ["正财运佳", "收入稳定", "有贵人助"],
      relationships: ["人缘好", "异性缘佳", "婚姻和谐"],
      health: ["体质较好", "注意眼疾", "心脏血压"],
    },
    description:
      "太阳星主光明、贵气、博爱。入命者性格开朗，正直善良，有领导才能，人缘佳。",
  },

  武曲: {
    name: "武曲",
    type: "main",
    category: "财星",
    element: "金",
    nature: "中性",
    brightness: {
      子: "得",
      丑: "利",
      寅: "平",
      卯: "不",
      辰: "旺",
      巳: "庙",
      午: "陷",
      未: "不",
      申: "庙",
      酉: "旺",
      戌: "得",
      亥: "利",
    },
    characteristics: {
      personality: ["刚毅果断", "意志坚强", "重视金钱", "实用主义"],
      career: ["金融", "军警", "工程", "制造业", "武职"],
      wealth: ["财运极佳", "善于理财", "适合投资"],
      relationships: ["感情较迟", "重视物质", "婚姻实际"],
      health: ["体质强健", "注意外伤", "呼吸系统"],
    },
    description:
      "武曲星主财富、刚强、决断。入命者意志坚强，善于理财，但性格较硬，感情较迟。",
  },

  天同: {
    name: "天同",
    type: "main",
    category: "福星",
    element: "水",
    nature: "吉星",
    brightness: {
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
    characteristics: {
      personality: ["温和善良", "乐观开朗", "享受生活", "有福气"],
      career: ["服务业", "娱乐业", "艺术", "餐饮", "旅游"],
      wealth: ["财运平稳", "不愁吃穿", "晚年富足"],
      relationships: ["感情和谐", "家庭幸福", "子女缘佳"],
      health: ["体质一般", "注意肠胃", "糖尿病"],
    },
    description:
      "天同星主福德、享受、和谐。入命者性格温和，乐观开朗，有福气，但缺乏进取心。",
  },

  廉贞: {
    name: "廉贞",
    type: "main",
    category: "囚星",
    element: "火",
    nature: "中性偏凶",
    brightness: {
      子: "陷",
      丑: "不",
      寅: "利",
      卯: "平",
      辰: "得",
      巳: "旺",
      午: "庙",
      未: "旺",
      申: "得",
      酉: "平",
      戌: "利",
      亥: "陷",
    },
    characteristics: {
      personality: ["聪明才智", "多才多艺", "情绪化", "桃花重"],
      career: ["艺术", "娱乐", "设计", "销售", "公关"],
      wealth: ["财运起伏", "偏财运佳", "易破财"],
      relationships: ["桃花多", "感情复杂", "易有外遇"],
      health: ["血液循环", "心脏疾病", "性病"],
    },
    description:
      "廉贞星主桃花、才艺、变化。入命者聪明多才，但感情复杂，易有桃花纠纷。",
  },

  天府: {
    name: "天府",
    type: "main",
    category: "财库",
    element: "土",
    nature: "吉星",
    brightness: {
      子: "得",
      丑: "利",
      寅: "平",
      卯: "不",
      辰: "旺",
      巳: "庙",
      午: "得",
      未: "利",
      申: "平",
      酉: "不",
      戌: "旺",
      亥: "庙",
    },
    characteristics: {
      personality: ["稳重保守", "有领导力", "重视名声", "善于储蓄"],
      career: ["管理", "金融", "房地产", "传统行业"],
      wealth: ["财运稳定", "善于积累", "有祖业"],
      relationships: ["感情稳定", "重视家庭", "配偶贤良"],
      health: ["体质良好", "注意肠胃", "糖尿病"],
    },
    description:
      "天府星主财库、稳重、保守。入命者性格稳重，善于理财，有领导才能。",
  },

  太阴: {
    name: "太阴",
    type: "main",
    category: "财星",
    element: "水",
    nature: "吉星",
    brightness: {
      子: "庙",
      丑: "旺",
      寅: "得",
      卯: "利",
      辰: "平",
      巳: "不",
      午: "陷",
      未: "不",
      申: "平",
      酉: "利",
      戌: "得",
      亥: "旺",
    },
    characteristics: {
      personality: ["温柔体贴", "心思细腻", "内向敏感", "有母性"],
      career: ["教育", "医护", "服务", "文艺", "女性用品"],
      wealth: ["财运稳定", "适合储蓄", "有不动产"],
      relationships: ["感情深厚", "重视家庭", "异性缘佳"],
      health: ["体质较弱", "妇科疾病", "情绪影响"],
    },
    description:
      "太阴星主阴柔、财富、母性。入命者性格温柔，心思细腻，有财运，女性特质明显。",
  },

  贪狼: {
    name: "贪狼",
    type: "main",
    category: "桃花星",
    element: "木",
    nature: "中性",
    brightness: {
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
      戌: "得",
      亥: "利",
    },
    characteristics: {
      personality: ["多才多艺", "善于交际", "欲望强烈", "桃花重"],
      career: ["娱乐", "艺术", "销售", "公关", "投机"],
      wealth: ["偏财运佳", "投机获利", "花钱大手"],
      relationships: ["桃花极多", "感情复杂", "易有外遇"],
      health: ["肝胆疾病", "性病", "酒色过度"],
    },
    description:
      "贪狼星主欲望、桃花、多才。入命者多才多艺，善于交际，但欲望强烈，桃花多。",
  },

  巨门: {
    name: "巨门",
    type: "main",
    category: "暗星",
    element: "土",
    nature: "中性偏凶",
    brightness: {
      子: "陷",
      丑: "不",
      寅: "利",
      卯: "平",
      辰: "得",
      巳: "旺",
      午: "庙",
      未: "旺",
      申: "得",
      酉: "平",
      戌: "利",
      亥: "陷",
    },
    characteristics: {
      personality: ["口才好", "善辩论", "疑心重", "是非多"],
      career: ["律师", "记者", "销售", "演讲", "传媒"],
      wealth: ["财运一般", "靠口才赚钱", "易有纠纷"],
      relationships: ["口舌是非", "感情波折", "易有误会"],
      health: ["口腔疾病", "呼吸系统", "精神压力"],
    },
    description:
      "巨门星主口舌、是非、暗昧。入命者口才佳，但疑心重，易有口舌是非。",
  },

  天相: {
    name: "天相",
    type: "main",
    category: "印星",
    element: "水",
    nature: "吉星",
    brightness: {
      子: "得",
      丑: "利",
      寅: "平",
      卯: "不",
      辰: "旺",
      巳: "庙",
      午: "得",
      未: "利",
      申: "平",
      酉: "不",
      戌: "旺",
      亥: "庙",
    },
    characteristics: {
      personality: ["忠厚老实", "有责任感", "重视外表", "善于协调"],
      career: ["公务员", "秘书", "助理", "服务业", "中介"],
      wealth: ["财运稳定", "收入固定", "不善投机"],
      relationships: ["感情专一", "重视承诺", "婚姻稳定"],
      health: ["体质良好", "注意皮肤", "过敏体质"],
    },
    description:
      "天相星主印绶、忠厚、服务。入命者忠厚老实，有责任感，适合辅助工作。",
  },

  天梁: {
    name: "天梁",
    type: "main",
    category: "寿星",
    element: "土",
    nature: "吉星",
    brightness: {
      子: "得",
      丑: "利",
      寅: "平",
      卯: "不",
      辰: "旺",
      巳: "庙",
      午: "得",
      未: "利",
      申: "平",
      酉: "不",
      戌: "旺",
      亥: "庙",
    },
    characteristics: {
      personality: ["正直善良", "有长者风范", "喜欢帮助人", "固执己见"],
      career: ["医生", "教师", "宗教", "慈善", "咨询"],
      wealth: ["财运平稳", "晚年富足", "有贵人助"],
      relationships: ["感情稳定", "重视精神", "有长辈缘"],
      health: ["长寿体质", "注意慢性病", "骨骼关节"],
    },
    description:
      "天梁星主寿命、贵人、化解。入命者正直善良，有长者风范，能化险为夷。",
  },

  七杀: {
    name: "七杀",
    type: "main",
    category: "将星",
    element: "金",
    nature: "中性偏凶",
    brightness: {
      子: "得",
      丑: "利",
      寅: "平",
      卯: "不",
      辰: "旺",
      巳: "庙",
      午: "陷",
      未: "不",
      申: "庙",
      酉: "旺",
      戌: "得",
      亥: "利",
    },
    characteristics: {
      personality: ["刚强果断", "独立自主", "冲动易怒", "不服输"],
      career: ["军警", "竞技", "创业", "销售", "外勤"],
      wealth: ["财运起伏", "适合创业", "易大起大落"],
      relationships: ["感情激烈", "易有冲突", "晚婚较好"],
      health: ["体质强健", "易有外伤", "血光之灾"],
    },
    description:
      "七杀星主肃杀、独立、冲动。入命者性格刚强，独立自主，但冲动易怒。",
  },

  破军: {
    name: "破军",
    type: "main",
    category: "耗星",
    element: "水",
    nature: "中性偏凶",
    brightness: {
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
    characteristics: {
      personality: ["开创进取", "变化多端", "破坏重建", "不安于现状"],
      career: ["创新", "改革", "设计", "艺术", "变动性工作"],
      wealth: ["财运变化大", "适合投机", "易破财重聚"],
      relationships: ["感情变化多", "易有波折", "重新开始"],
      health: ["体质一般", "易有意外", "神经系统"],
    },
    description:
      "破军星主破坏、开创、变化。入命者具开创精神，但变化多端，不安于现状。",
  },
};

/**
 * 辅星数据库
 */
const AUXILIARY_STARS = {
  左辅: {
    name: "左辅",
    type: "auxiliary",
    category: "吉星",
    element: "土",
    nature: "吉星",
    description: "左辅星主辅助、贵人、合作。能增强主星力量，带来贵人相助。",
  },

  右弼: {
    name: "右弼",
    type: "auxiliary",
    category: "吉星",
    element: "水",
    nature: "吉星",
    description: "右弼星主辅助、人缘、协调。能增强人际关系，带来合作机会。",
  },

  文昌: {
    name: "文昌",
    type: "auxiliary",
    category: "文星",
    element: "金",
    nature: "吉星",
    description: "文昌星主文学、考试、名声。利于学业、考试和文职工作。",
  },

  文曲: {
    name: "文曲",
    type: "auxiliary",
    category: "文星",
    element: "水",
    nature: "吉星",
    description: "文曲星主才艺、口才、技能。利于艺术创作和技能发展。",
  },

  天魁: {
    name: "天魁",
    type: "auxiliary",
    category: "贵人星",
    element: "火",
    nature: "吉星",
    description: "天魁星主贵人、提拔、机遇。能带来重要的贵人相助。",
  },

  天钺: {
    name: "天钺",
    type: "auxiliary",
    category: "贵人星",
    element: "火",
    nature: "吉星",
    description: "天钺星主贵人、暗助、机缘。能在关键时刻得到帮助。",
  },
};

/**
 * 煞星数据库
 */
const MALEFIC_STARS = {
  擎羊: {
    name: "擎羊",
    type: "malefic",
    category: "煞星",
    element: "金",
    nature: "凶星",
    description: "擎羊星主刑伤、冲动、争执。易有外伤和人际冲突。",
  },

  陀罗: {
    name: "陀罗",
    type: "malefic",
    category: "煞星",
    element: "金",
    nature: "凶星",
    description: "陀罗星主拖延、阻碍、纠缠。做事容易拖泥带水。",
  },

  火星: {
    name: "火星",
    type: "malefic",
    category: "煞星",
    element: "火",
    nature: "凶星",
    description: "火星主急躁、冲动、意外。性格急躁，易有意外事故。",
  },

  铃星: {
    name: "铃星",
    type: "malefic",
    category: "煞星",
    element: "火",
    nature: "凶星",
    description: "铃星主暗伤、慢性病、阴险。易有慢性疾病和暗中伤害。",
  },
};

/**
 * 四化数据库
 */
const SIHUA_DATABASE = {
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

/**
 * 格局数据库
 */
const PATTERNS_DATABASE = {
  // 富贵格局
  紫府同宫: {
    name: "紫府同宫",
    type: "富贵格",
    stars: ["紫微", "天府"],
    condition: "same_palace",
    strength: "excellent",
    description: "帝王之相，主大富大贵，一生显达，有领导才能",
    influence: "very_positive",
  },

  府相朝垣: {
    name: "府相朝垣",
    type: "富贵格",
    stars: ["天府", "天相"],
    condition: "mutual_support",
    strength: "excellent",
    description: "主富贵双全，事业有成，财运亨通",
    influence: "very_positive",
  },

  // 权贵格局
  君臣庆会: {
    name: "君臣庆会",
    type: "权贵格",
    stars: ["紫微", "天相", "左辅", "右弼"],
    condition: "multiple_support",
    strength: "excellent",
    description: "主权贵显达，有很高的社会地位",
    influence: "very_positive",
  },

  // 财富格局
  石中隐玉: {
    name: "石中隐玉",
    type: "财富格",
    stars: ["巨门", "禄存"],
    condition: "same_palace",
    strength: "good",
    description: "主先贫后富，大器晚成，中晚年发达",
    influence: "positive",
  },

  // 桃花格局
  红鸾天喜: {
    name: "红鸾天喜",
    type: "桃花格",
    stars: ["红鸾", "天喜"],
    condition: "any_palace",
    strength: "good",
    description: "主桃花运旺，感情丰富，易有婚姻喜事",
    influence: "positive",
  },

  贪狼桃花: {
    name: "贪狼桃花",
    type: "桃花格",
    stars: ["贪狼", "咸池", "天姚"],
    condition: "multiple_presence",
    strength: "average",
    description: "主桃花极重，感情复杂，需注意感情纠纷",
    influence: "mixed",
  },

  // 变动格局
  杀破狼: {
    name: "杀破狼",
    type: "变动格",
    stars: ["七杀", "破军", "贪狼"],
    condition: "destiny_career_wealth",
    strength: "good",
    description: "主变动，宜外出发展，创业有成，不宜安逸",
    influence: "dynamic",
  },

  // 清贵格局
  机月同梁: {
    name: "机月同梁",
    type: "清贵格",
    stars: ["天机", "太阴", "天同", "天梁"],
    condition: "multiple_presence",
    strength: "good",
    description: "主清贵，适合文职、教育、咨询等行业",
    influence: "stable",
  },

  // 凶险格局
  羊陀夹忌: {
    name: "羊陀夹忌",
    type: "凶险格",
    stars: ["擎羊", "陀罗", "化忌"],
    condition: "sandwich_malefic",
    strength: "poor",
    description: "主凶险，易有意外、疾病、破财等不利事件",
    influence: "very_negative",
  },

  火铃夹命: {
    name: "火铃夹命",
    type: "凶险格",
    stars: ["火星", "铃星"],
    condition: "sandwich_destiny",
    strength: "poor",
    description: "主性格急躁，易有意外伤害，需注意安全",
    influence: "negative",
  },
};

/**
 * 宫位解释数据库
 */
const PALACE_INTERPRETATIONS = {
  命宫: {
    name: "命宫",
    description: "代表个人的基本性格、外貌、才能、人生方向",
    aspects: {
      personality: "基本性格特征",
      appearance: "外貌气质",
      talent: "天赋才能",
      destiny: "人生方向",
    },
  },

  兄弟宫: {
    name: "兄弟宫",
    description: "代表兄弟姐妹关系、同事关系、合作伙伴",
    aspects: {
      siblings: "兄弟姐妹关系",
      colleagues: "同事关系",
      cooperation: "合作能力",
      friendship: "朋友关系",
    },
  },

  夫妻宫: {
    name: "夫妻宫",
    description: "代表婚姻感情、配偶状况、异性关系",
    aspects: {
      marriage: "婚姻状况",
      spouse: "配偶特征",
      romance: "恋爱关系",
      sexuality: "性生活",
    },
  },

  子女宫: {
    name: "子女宫",
    description: "代表子女关系、生育能力、创造力、下属关系",
    aspects: {
      children: "子女关系",
      fertility: "生育能力",
      creativity: "创造力",
      subordinates: "下属关系",
    },
  },

  财帛宫: {
    name: "财帛宫",
    description: "代表财运、理财能力、赚钱方式、物质享受",
    aspects: {
      wealth: "财运状况",
      income: "收入来源",
      investment: "投资理财",
      spending: "消费习惯",
    },
  },

  疾厄宫: {
    name: "疾厄宫",
    description: "代表健康状况、疾病类型、意外伤害、体质",
    aspects: {
      health: "健康状况",
      disease: "疾病倾向",
      accident: "意外风险",
      constitution: "体质特征",
    },
  },

  迁移宫: {
    name: "迁移宫",
    description: "代表外出运、搬迁、旅行、外地发展、人际关系",
    aspects: {
      travel: "外出运势",
      relocation: "搬迁变动",
      development: "外地发展",
      social: "社交能力",
    },
  },

  奴仆宫: {
    name: "奴仆宫",
    description: "代表朋友关系、下属关系、人际网络、社会支持",
    aspects: {
      friends: "朋友关系",
      network: "人际网络",
      support: "社会支持",
      leadership: "领导能力",
    },
  },

  官禄宫: {
    name: "官禄宫",
    description: "代表事业运、工作状况、职位高低、成就名声",
    aspects: {
      career: "事业发展",
      job: "工作状况",
      position: "职位地位",
      achievement: "成就名声",
    },
  },

  田宅宫: {
    name: "田宅宫",
    description: "代表不动产、家庭环境、居住状况、祖业",
    aspects: {
      property: "不动产",
      home: "家庭环境",
      residence: "居住状况",
      inheritance: "祖业遗产",
    },
  },

  福德宫: {
    name: "福德宫",
    description: "代表精神享受、兴趣爱好、福气、心理状态",
    aspects: {
      happiness: "精神享受",
      hobbies: "兴趣爱好",
      fortune: "福气运势",
      psychology: "心理状态",
    },
  },

  父母宫: {
    name: "父母宫",
    description: "代表父母关系、长辈关系、上司关系、学业",
    aspects: {
      parents: "父母关系",
      elders: "长辈关系",
      boss: "上司关系",
      education: "学业状况",
    },
  },
};

/**
 * 获取星曜完整信息
 */
function getStarInfo(starName) {
  return (
    MAIN_STARS[starName] ||
    AUXILIARY_STARS[starName] ||
    MALEFIC_STARS[starName] ||
    null
  );
}

/**
 * 获取星曜亮度
 */
function getStarBrightness(starName, earthlyBranch) {
  const starInfo = getStarInfo(starName);
  if (starInfo && starInfo.brightness) {
    return starInfo.brightness[earthlyBranch] || "平";
  }
  return "平";
}

/**
 * 获取四化信息
 */
function getSihuaInfo(yearGan) {
  return SIHUA_DATABASE[yearGan] || {};
}

/**
 * 获取格局信息
 */
function getPatternInfo(patternName) {
  return PATTERNS_DATABASE[patternName] || null;
}

/**
 * 获取宫位解释
 */
function getPalaceInterpretation(palaceName) {
  return PALACE_INTERPRETATIONS[palaceName] || null;
}

/**
 * 检查格局是否成立
 */
function checkPattern(patternName, palaces, destinyPalace, bodyPalace) {
  const pattern = PATTERNS_DATABASE[patternName];
  if (!pattern) return false;

  const requiredStars = pattern.stars;

  switch (pattern.condition) {
    case "same_palace":
      // 要求星曜在同一宫位
      return palaces.some((palace) =>
        requiredStars.every((star) =>
          palace.stars.some((s) => s.name === star),
        ),
      );

    case "destiny_career_wealth":
      // 要求星曜分别在命宫、官禄宫、财帛宫
      const destinyStars = destinyPalace.stars.map((s) => s.name);
      const careerPalace = palaces.find((p) => p.name === "官禄宫");
      const wealthPalace = palaces.find((p) => p.name === "财帛宫");

      return (
        requiredStars.some((star) => destinyStars.includes(star)) &&
        requiredStars.some((star) =>
          careerPalace?.stars.some((s) => s.name === star),
        ) &&
        requiredStars.some((star) =>
          wealthPalace?.stars.some((s) => s.name === star),
        )
      );

    case "multiple_presence":
      // 要求多个星曜出现在命盘中
      const allStars = palaces.flatMap((p) => p.stars.map((s) => s.name));
      return (
        requiredStars.filter((star) => allStars.includes(star)).length >= 2
      );

    default:
      return false;
  }
}

module.exports = {
  MAIN_STARS,
  AUXILIARY_STARS,
  MALEFIC_STARS,
  SIHUA_DATABASE,
  PATTERNS_DATABASE,
  PALACE_INTERPRETATIONS,
  getStarInfo,
  getStarBrightness,
  getSihuaInfo,
  getPatternInfo,
  getPalaceInterpretation,
  checkPattern,
};
