/**
 * SVG主题管理器
 * 负责主题的定义、切换、自定义和动态应用
 */

class SVGThemeManager {
  constructor() {
    this.themes = new Map();
    this.customThemes = new Map();
    this.currentTheme = null;
    this.themeVariables = new Map();

    // 配置
    this.config = {
      enableTransitions: true,
      transitionDuration: 300,
      enablePreview: true,
      autoSave: true,
    };

    // 初始化内置主题
    this.initializeBuiltinThemes();
  }

  /**
   * 初始化内置主题
   */
  initializeBuiltinThemes() {
    // 经典主题
    this.registerTheme("classic", {
      name: "经典主题",
      description: "传统紫微斗数配色方案",
      category: "builtin",
      colors: {
        // 基础颜色
        primary: "#8B4513", // 棕色
        secondary: "#DAA520", // 金色
        accent: "#DC143C", // 深红色
        background: "#FFF8DC", // 米色
        backgroundSecondary: "#F5F5DC", // 米白色
        surface: "#FFFFFF", // 白色

        // 文本颜色
        textPrimary: "#2F4F4F", // 深灰绿
        textSecondary: "#696969", // 暗灰色
        textAccent: "#8B0000", // 暗红色

        // 边框颜色
        borderPrimary: "#8B4513", // 棕色
        borderSecondary: "#D2B48C", // 浅棕色
        borderLight: "#F0E68C", // 浅黄色

        // 宫位颜色
        palaceBackground: "#FFFAF0", // 花白色
        palaceBorder: "#DEB887", // 浅棕色
        palaceHover: "#FFF8DC", // 米色

        // 星曜颜色
        starMajor: "#8B0000", // 暗红色 - 主星
        starMinor: "#4682B4", // 钢蓝色 - 辅星
        starEvil: "#8B008B", // 暗洋红 - 煞星
        starLucky: "#228B22", // 森林绿 - 吉星

        // 四化颜色
        sihuaLu: "#32CD32", // 酸橙绿 - 化禄
        sihuaQuan: "#FF6347", // 番茄红 - 化权
        sihuaKe: "#4169E1", // 皇家蓝 - 化科
        sihuaJi: "#8B008B", // 暗洋红 - 化忌

        // 状态颜色
        success: "#228B22", // 森林绿
        warning: "#FF8C00", // 暗橙色
        error: "#DC143C", // 深红色
        info: "#4682B4", // 钢蓝色
      },

      typography: {
        fontFamily: '"Microsoft YaHei", "SimHei", sans-serif',
        fontSize: {
          title: "18px",
          subtitle: "14px",
          body: "12px",
          caption: "10px",
          palaceName: "14px",
          starName: "11px",
          ganZhi: "10px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          bold: "700",
        },
        lineHeight: {
          tight: "1.2",
          normal: "1.4",
          loose: "1.6",
        },
      },

      spacing: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "24px",
      },

      borders: {
        width: {
          thin: "1px",
          normal: "2px",
          thick: "3px",
        },
        radius: {
          none: "0px",
          sm: "2px",
          md: "4px",
          lg: "8px",
          full: "50%",
        },
        style: "solid",
      },

      shadows: {
        sm: "0 1px 2px rgba(0,0,0,0.1)",
        md: "0 2px 4px rgba(0,0,0,0.1)",
        lg: "0 4px 8px rgba(0,0,0,0.15)",
      },

      animations: {
        duration: {
          fast: "150ms",
          normal: "300ms",
          slow: "500ms",
        },
        easing: {
          linear: "linear",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
        },
      },
    });

    // 暗色主题
    this.registerTheme("dark", {
      name: "暗色主题",
      description: "现代暗色配色方案",
      category: "builtin",
      colors: {
        primary: "#BB86FC", // 紫色
        secondary: "#03DAC6", // 青色
        accent: "#CF6679", // 粉红色
        background: "#121212", // 深黑色
        backgroundSecondary: "#1E1E1E", // 黑色
        surface: "#2D2D2D", // 深灰色

        textPrimary: "#FFFFFF", // 白色
        textSecondary: "#B3B3B3", // 浅灰色
        textAccent: "#BB86FC", // 紫色

        borderPrimary: "#444444", // 中灰色
        borderSecondary: "#666666", // 浅灰色
        borderLight: "#888888", // 更浅灰色

        palaceBackground: "#2D2D2D", // 深灰色
        palaceBorder: "#444444", // 中灰色
        palaceHover: "#3D3D3D", // 稍浅灰色

        starMajor: "#FF6B6B", // 红色 - 主星
        starMinor: "#4ECDC4", // 青色 - 辅星
        starEvil: "#A8E6CF", // 浅绿色 - 煞星
        starLucky: "#FFD93D", // 黄色 - 吉星

        sihuaLu: "#4CAF50", // 绿色 - 化禄
        sihuaQuan: "#FF5722", // 深橙色 - 化权
        sihuaKe: "#2196F3", // 蓝色 - 化科
        sihuaJi: "#9C27B0", // 紫色 - 化忌

        success: "#4CAF50", // 绿色
        warning: "#FF9800", // 橙色
        error: "#F44336", // 红色
        info: "#2196F3", // 蓝色
      },

      typography: {
        fontFamily: '"Microsoft YaHei", "SimHei", sans-serif',
        fontSize: {
          title: "18px",
          subtitle: "14px",
          body: "12px",
          caption: "10px",
          palaceName: "14px",
          starName: "11px",
          ganZhi: "10px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          bold: "700",
        },
        lineHeight: {
          tight: "1.2",
          normal: "1.4",
          loose: "1.6",
        },
      },

      spacing: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "24px",
      },

      borders: {
        width: {
          thin: "1px",
          normal: "2px",
          thick: "3px",
        },
        radius: {
          none: "0px",
          sm: "2px",
          md: "4px",
          lg: "8px",
          full: "50%",
        },
        style: "solid",
      },

      shadows: {
        sm: "0 1px 2px rgba(255,255,255,0.1)",
        md: "0 2px 4px rgba(255,255,255,0.1)",
        lg: "0 4px 8px rgba(255,255,255,0.15)",
      },

      animations: {
        duration: {
          fast: "150ms",
          normal: "300ms",
          slow: "500ms",
        },
        easing: {
          linear: "linear",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
        },
      },
    });

    // 中国风主题
    this.registerTheme("chinese", {
      name: "中国风主题",
      description: "传统中国风配色方案",
      category: "builtin",
      colors: {
        primary: "#C8102E", // 中国红
        secondary: "#FFD700", // 金色
        accent: "#8B4513", // 棕色
        background: "#FDF5E6", // 老花色
        backgroundSecondary: "#F5F5DC", // 米色
        surface: "#FFFAF0", // 花白色

        textPrimary: "#2F4F4F", // 深灰绿
        textSecondary: "#696969", // 暗灰色
        textAccent: "#8B0000", // 暗红色

        borderPrimary: "#8B4513", // 棕色
        borderSecondary: "#D2B48C", // 浅棕色
        borderLight: "#F0E68C", // 浅黄色

        palaceBackground: "#FFFAF0", // 花白色
        palaceBorder: "#DEB887", // 浅棕色
        palaceHover: "#FFF8DC", // 米色

        starMajor: "#C8102E", // 中国红 - 主星
        starMinor: "#4682B4", // 钢蓝色 - 辅星
        starEvil: "#8B008B", // 暗洋红 - 煞星
        starLucky: "#228B22", // 森林绿 - 吉星

        sihuaLu: "#32CD32", // 酸橙绿 - 化禄
        sihuaQuan: "#FF6347", // 番茄红 - 化权
        sihuaKe: "#4169E1", // 皇家蓝 - 化科
        sihuaJi: "#8B008B", // 暗洋红 - 化忌

        success: "#228B22", // 森林绿
        warning: "#FF8C00", // 暗橙色
        error: "#DC143C", // 深红色
        info: "#4682B4", // 钢蓝色
      },

      typography: {
        fontFamily: '"KaiTi", "SimKai", "Microsoft YaHei", serif',
        fontSize: {
          title: "20px",
          subtitle: "16px",
          body: "14px",
          caption: "12px",
          palaceName: "16px",
          starName: "13px",
          ganZhi: "12px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          bold: "700",
        },
        lineHeight: {
          tight: "1.3",
          normal: "1.5",
          loose: "1.7",
        },
      },

      spacing: {
        xs: "3px",
        sm: "6px",
        md: "10px",
        lg: "15px",
        xl: "20px",
        xxl: "30px",
      },

      borders: {
        width: {
          thin: "1px",
          normal: "2px",
          thick: "4px",
        },
        radius: {
          none: "0px",
          sm: "3px",
          md: "6px",
          lg: "12px",
          full: "50%",
        },
        style: "solid",
      },

      shadows: {
        sm: "0 2px 4px rgba(139,69,19,0.1)",
        md: "0 4px 8px rgba(139,69,19,0.15)",
        lg: "0 8px 16px rgba(139,69,19,0.2)",
      },

      animations: {
        duration: {
          fast: "200ms",
          normal: "400ms",
          slow: "600ms",
        },
        easing: {
          linear: "linear",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
        },
      },
    });

    // 简约主题
    this.registerTheme("minimal", {
      name: "简约主题",
      description: "现代简约配色方案",
      category: "builtin",
      colors: {
        primary: "#007AFF", // 蓝色
        secondary: "#5856D6", // 紫色
        accent: "#FF3B30", // 红色
        background: "#FFFFFF", // 白色
        backgroundSecondary: "#F2F2F7", // 浅灰色
        surface: "#FFFFFF", // 白色

        textPrimary: "#000000", // 黑色
        textSecondary: "#8E8E93", // 灰色
        textAccent: "#007AFF", // 蓝色

        borderPrimary: "#C7C7CC", // 浅灰色
        borderSecondary: "#E5E5EA", // 更浅灰色
        borderLight: "#F2F2F7", // 极浅灰色

        palaceBackground: "#FFFFFF", // 白色
        palaceBorder: "#E5E5EA", // 浅灰色
        palaceHover: "#F2F2F7", // 极浅灰色

        starMajor: "#007AFF", // 蓝色 - 主星
        starMinor: "#5856D6", // 紫色 - 辅星
        starEvil: "#FF3B30", // 红色 - 煞星
        starLucky: "#34C759", // 绿色 - 吉星

        sihuaLu: "#34C759", // 绿色 - 化禄
        sihuaQuan: "#FF9500", // 橙色 - 化权
        sihuaKe: "#007AFF", // 蓝色 - 化科
        sihuaJi: "#FF3B30", // 红色 - 化忌

        success: "#34C759", // 绿色
        warning: "#FF9500", // 橙色
        error: "#FF3B30", // 红色
        info: "#007AFF", // 蓝色
      },

      typography: {
        fontFamily:
          '"SF Pro Display", "Helvetica Neue", "Microsoft YaHei", sans-serif',
        fontSize: {
          title: "17px",
          subtitle: "13px",
          body: "11px",
          caption: "9px",
          palaceName: "13px",
          starName: "10px",
          ganZhi: "9px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          bold: "600",
        },
        lineHeight: {
          tight: "1.1",
          normal: "1.3",
          loose: "1.5",
        },
      },

      spacing: {
        xs: "1px",
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        xxl: "16px",
      },

      borders: {
        width: {
          thin: "0.5px",
          normal: "1px",
          thick: "2px",
        },
        radius: {
          none: "0px",
          sm: "1px",
          md: "2px",
          lg: "4px",
          full: "50%",
        },
        style: "solid",
      },

      shadows: {
        sm: "0 1px 1px rgba(0,0,0,0.05)",
        md: "0 1px 2px rgba(0,0,0,0.05)",
        lg: "0 2px 4px rgba(0,0,0,0.1)",
      },

      animations: {
        duration: {
          fast: "100ms",
          normal: "200ms",
          slow: "300ms",
        },
        easing: {
          linear: "linear",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
        },
      },
    });

    // 设置默认主题
    this.setCurrentTheme("classic");
  }

  /**
   * 注册主题
   */
  registerTheme(id, themeConfig) {
    const theme = {
      id: id,
      ...themeConfig,
      registeredAt: new Date().toISOString(),
      version: "1.0.0",
    };

    this.themes.set(id, theme);
    console.log(`主题已注册: ${id}`);
  }

  /**
   * 注册自定义主题
   */
  registerCustomTheme(id, themeConfig, userId = "default") {
    const customTheme = {
      id: id,
      userId: userId,
      ...themeConfig,
      category: "custom",
      createdAt: new Date().toISOString(),
      version: "1.0.0",
    };

    this.customThemes.set(id, customTheme);

    if (this.config.autoSave) {
      this.saveCustomTheme(id);
    }

    console.log(`自定义主题已注册: ${id}`);
  }

  /**
   * 获取主题
   */
  getTheme(themeId) {
    return this.themes.get(themeId) || this.customThemes.get(themeId);
  }

  /**
   * 获取所有主题
   */
  getAllThemes() {
    const allThemes = [];

    // 内置主题
    this.themes.forEach((theme) => {
      allThemes.push({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        category: theme.category,
        preview: this.generateThemePreview(theme),
      });
    });

    // 自定义主题
    this.customThemes.forEach((theme) => {
      allThemes.push({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        category: theme.category,
        userId: theme.userId,
        preview: this.generateThemePreview(theme),
      });
    });

    return allThemes;
  }

  /**
   * 设置当前主题
   */
  setCurrentTheme(themeId) {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`主题不存在: ${themeId}`);
    }

    this.currentTheme = theme;
    this.updateThemeVariables(theme);

    console.log(`当前主题已切换到: ${themeId}`);
    return theme;
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 更新主题变量
   */
  updateThemeVariables(theme) {
    this.themeVariables.clear();

    // 展平主题配置
    this.flattenThemeConfig(theme, "", this.themeVariables);
  }

  /**
   * 展平主题配置
   */
  flattenThemeConfig(obj, prefix, variables) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.flattenThemeConfig(value, fullKey, variables);
      } else {
        variables.set(fullKey, value);
      }
    });
  }

  /**
   * 获取主题变量
   */
  getThemeVariable(path) {
    return this.themeVariables.get(path);
  }

  /**
   * 应用主题到SVG数据
   */
  applyThemeToData(data, themeId = null) {
    const theme = themeId ? this.getTheme(themeId) : this.currentTheme;
    if (!theme) {
      return data;
    }

    // 深拷贝数据
    const themedData = JSON.parse(JSON.stringify(data));

    // 应用主题
    themedData.theme = this.buildThemeData(theme);

    return themedData;
  }

  /**
   * 构建主题数据
   */
  buildThemeData(theme) {
    return {
      // 基础属性
      name: theme.name,
      id: theme.id,

      // 颜色
      background: theme.colors.background,
      backgroundSecondary: theme.colors.backgroundSecondary,
      surface: theme.colors.surface,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,

      // 文本颜色
      textColor: theme.colors.textPrimary,
      textSecondary: theme.colors.textSecondary,
      textAccent: theme.colors.textAccent,

      // 边框
      borderColor: theme.colors.borderPrimary,
      borderSecondary: theme.colors.borderSecondary,
      borderWidth: theme.borders.width.normal,
      borderRadius: theme.borders.radius.md,

      // 宫位
      palaceBackground: theme.colors.palaceBackground,
      palaceBorder: theme.colors.palaceBorder,
      palaceHover: theme.colors.palaceHover,

      // 星曜
      starMajor: theme.colors.starMajor,
      starMinor: theme.colors.starMinor,
      starEvil: theme.colors.starEvil,
      starLucky: theme.colors.starLucky,

      // 四化
      sihuaLu: theme.colors.sihuaLu,
      sihuaQuan: theme.colors.sihuaQuan,
      sihuaKe: theme.colors.sihuaKe,
      sihuaJi: theme.colors.sihuaJi,

      // 字体
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.body,
      titleSize: theme.typography.fontSize.title,
      subtitleSize: theme.typography.fontSize.subtitle,
      palaceNameSize: theme.typography.fontSize.palaceName,
      starNameSize: theme.typography.fontSize.starName,
      ganZhiSize: theme.typography.fontSize.ganZhi,

      // 间距
      spacing: theme.spacing,

      // 阴影
      shadow: theme.shadows.md,

      // 动画
      transitionDuration: theme.animations.duration.normal,
      transitionEasing: theme.animations.easing.easeInOut,
    };
  }

  /**
   * 创建主题变体
   */
  createThemeVariant(baseThemeId, variantConfig, variantId) {
    const baseTheme = this.getTheme(baseThemeId);
    if (!baseTheme) {
      throw new Error(`基础主题不存在: ${baseThemeId}`);
    }

    // 深度合并配置
    const variantTheme = this.deepMerge(baseTheme, variantConfig);
    variantTheme.id = variantId;
    variantTheme.name = variantConfig.name || `${baseTheme.name} 变体`;
    variantTheme.baseTheme = baseThemeId;
    variantTheme.category = "variant";

    this.registerCustomTheme(variantId, variantTheme);
    return variantTheme;
  }

  /**
   * 深度合并对象
   */
  deepMerge(target, source) {
    const result = JSON.parse(JSON.stringify(target));

    Object.keys(source).forEach((key) => {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    });

    return result;
  }

  /**
   * 生成主题预览
   */
  generateThemePreview(theme) {
    return {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        background: theme.colors.background,
        text: theme.colors.textPrimary,
      },
      sample: this.generateSampleSVG(theme),
    };
  }

  /**
   * 生成示例SVG
   */
  generateSampleSVG(theme) {
    return `
      <svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${theme.colors.background}" stroke="${theme.colors.borderPrimary}" stroke-width="1"/>
        <circle cx="25" cy="30" r="8" fill="${theme.colors.primary}"/>
        <rect x="40" y="22" width="16" height="16" fill="${theme.colors.secondary}" rx="2"/>
        <text x="70" y="35" font-family="${theme.typography.fontFamily}" font-size="10" fill="${theme.colors.textPrimary}">主题</text>
      </svg>
    `;
  }

  /**
   * 验证主题配置
   */
  validateTheme(themeConfig) {
    const required = {
      name: "string",
      "colors.primary": "string",
      "colors.background": "string",
      "colors.textPrimary": "string",
      "typography.fontFamily": "string",
    };

    const errors = [];

    Object.keys(required).forEach((path) => {
      const value = this.getNestedValue(themeConfig, path);
      const expectedType = required[path];

      if (value === undefined) {
        errors.push(`缺少必需属性: ${path}`);
      } else if (typeof value !== expectedType) {
        errors.push(`属性类型错误: ${path} 应为 ${expectedType}`);
      }
    });

    // 验证颜色格式
    this.validateColors(themeConfig.colors, errors);

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * 验证颜色格式
   */
  validateColors(colors, errors) {
    if (!colors) return;

    const colorRegex =
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;

    Object.keys(colors).forEach((key) => {
      const color = colors[key];
      if (typeof color === "string" && !colorRegex.test(color)) {
        errors.push(`无效的颜色格式: ${key} = ${color}`);
      }
    });
  }

  /**
   * 获取嵌套值
   */
  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * 导出主题
   */
  exportTheme(themeId) {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`主题不存在: ${themeId}`);
    }

    return {
      ...theme,
      exportedAt: new Date().toISOString(),
      version: theme.version || "1.0.0",
    };
  }

  /**
   * 导入主题
   */
  importTheme(themeData, options = {}) {
    const validation = this.validateTheme(themeData);
    if (!validation.valid) {
      throw new Error(`主题验证失败: ${validation.errors.join(", ")}`);
    }

    const themeId = options.id || themeData.id || `imported_${Date.now()}`;

    if (options.asCustom !== false) {
      this.registerCustomTheme(themeId, themeData);
    } else {
      this.registerTheme(themeId, themeData);
    }

    return themeId;
  }

  /**
   * 删除主题
   */
  removeTheme(themeId) {
    const removed =
      this.themes.delete(themeId) || this.customThemes.delete(themeId);

    if (this.currentTheme && this.currentTheme.id === themeId) {
      this.setCurrentTheme("classic"); // 回退到默认主题
    }

    return removed;
  }

  /**
   * 保存自定义主题
   */
  saveCustomTheme(themeId) {
    const theme = this.customThemes.get(themeId);
    if (!theme) return false;

    try {
      // 这里可以实现实际的保存逻辑
      // 例如保存到本地存储或发送到服务器
      console.log(`自定义主题已保存: ${themeId}`);
      return true;
    } catch (error) {
      console.error(`保存自定义主题失败: ${themeId}`, error);
      return false;
    }
  }

  /**
   * 加载自定义主题
   */
  loadCustomThemes() {
    try {
      // 这里可以实现实际的加载逻辑
      // 例如从本地存储或服务器加载
      console.log("自定义主题已加载");
      return true;
    } catch (error) {
      console.error("加载自定义主题失败", error);
      return false;
    }
  }

  /**
   * 获取主题统计
   */
  getStats() {
    return {
      totalThemes: this.themes.size + this.customThemes.size,
      builtinThemes: this.themes.size,
      customThemes: this.customThemes.size,
      currentTheme: this.currentTheme ? this.currentTheme.id : null,
      themeVariables: this.themeVariables.size,
    };
  }
}

module.exports = {
  SVGThemeManager,
};
