/**
 * 增强版SVG生成器
 * 支持模板化生成、多种图表类型和自定义主题
 */

class EnhancedSVGGenerator {
  constructor() {
    this.templates = new Map();
    this.themes = new Map();
    this.chartTypes = new Map();

    // 初始化默认模板和主题
    this.initializeDefaultTemplates();
    this.initializeDefaultThemes();
    this.initializeChartTypes();
  }

  /**
   * 初始化默认SVG模板
   */
  initializeDefaultTemplates() {
    // 传统命盘模板
    this.templates.set("traditional", {
      width: 600,
      height: 600,
      viewBox: "0 0 600 600",
      structure: {
        outerCircle: { cx: 300, cy: 300, r: 280 },
        innerCircle: { cx: 300, cy: 300, r: 120 },
        palaces: this.generatePalacePositions("traditional"),
        centerArea: { x: 200, y: 200, width: 200, height: 200 },
      },
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {{gradients}}
            {{patterns}}
            {{filters}}
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}"/>
          
          <!-- 外圈 -->
          <circle cx="{{structure.outerCircle.cx}}" cy="{{structure.outerCircle.cy}}" 
                  r="{{structure.outerCircle.r}}" fill="none" 
                  stroke="{{theme.borderColor}}" stroke-width="{{theme.borderWidth}}"/>
          
          <!-- 内圈 -->
          <circle cx="{{structure.innerCircle.cx}}" cy="{{structure.innerCircle.cy}}" 
                  r="{{structure.innerCircle.r}}" fill="none" 
                  stroke="{{theme.borderColor}}" stroke-width="{{theme.borderWidth}}"/>
          
          <!-- 宫位分割线 -->
          {{palaceDividers}}
          
          <!-- 宫位内容 -->
          {{palaceContents}}
          
          <!-- 中心区域 -->
          {{centerContent}}
          
          <!-- 装饰元素 -->
          {{decorations}}
        </svg>
      `,
    });

    // 现代轮盘模板
    this.templates.set("modern", {
      width: 800,
      height: 800,
      viewBox: "0 0 800 800",
      structure: {
        outerRadius: 380,
        innerRadius: 150,
        palaces: this.generatePalacePositions("modern"),
        centerArea: { x: 250, y: 250, width: 300, height: 300 },
      },
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {{gradients}}
            {{patterns}}
            {{filters}}
          </defs>
          
          <!-- 背景渐变 -->
          <rect width="100%" height="100%" fill="url(#backgroundGradient)"/>
          
          <!-- 宫位扇形 -->
          {{palaceSectors}}
          
          <!-- 宫位内容 -->
          {{palaceContents}}
          
          <!-- 中心圆形 -->
          <circle cx="400" cy="400" r="{{structure.innerRadius}}" 
                  fill="{{theme.centerFill}}" stroke="{{theme.borderColor}}" 
                  stroke-width="{{theme.borderWidth}}"/>
          
          <!-- 中心内容 -->
          {{centerContent}}
          
          <!-- 装饰和标签 -->
          {{decorations}}
        </svg>
      `,
    });

    // 网格布局模板
    this.templates.set("grid", {
      width: 900,
      height: 600,
      viewBox: "0 0 900 600",
      structure: {
        rows: 3,
        cols: 4,
        cellWidth: 200,
        cellHeight: 180,
        margin: 25,
        palaces: this.generateGridPositions(),
      },
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {{gradients}}
            {{patterns}}
            {{filters}}
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}"/>
          
          <!-- 网格单元格 -->
          {{gridCells}}
          
          <!-- 宫位内容 -->
          {{palaceContents}}
          
          <!-- 连接线 -->
          {{connections}}
          
          <!-- 标题和说明 -->
          {{annotations}}
        </svg>
      `,
    });

    // 星曜关系图模板
    this.templates.set("relationship", {
      width: 1000,
      height: 800,
      viewBox: "0 0 1000 800",
      structure: {
        centerNode: { x: 500, y: 400, r: 60 },
        nodeRadius: 30,
        linkDistance: 200,
      },
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {{gradients}}
            {{patterns}}
            {{filters}}
            {{markers}}
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}"/>
          
          <!-- 连接线 -->
          {{relationships}}
          
          <!-- 星曜节点 -->
          {{starNodes}}
          
          <!-- 标签和说明 -->
          {{labels}}
          
          <!-- 图例 -->
          {{legend}}
        </svg>
      `,
    });
  }

  /**
   * 初始化默认主题
   */
  initializeDefaultThemes() {
    // 经典主题
    this.themes.set("classic", {
      name: "经典",
      background: "#f8f9fa",
      borderColor: "#2c3e50",
      borderWidth: 2,
      textColor: "#2c3e50",
      primaryColor: "#3498db",
      secondaryColor: "#e74c3c",
      accentColor: "#f39c12",
      centerFill: "#ecf0f1",
      palaceColors: {
        destiny: "#3498db",
        siblings: "#2ecc71",
        spouse: "#e74c3c",
        children: "#f39c12",
        wealth: "#9b59b6",
        health: "#1abc9c",
        travel: "#34495e",
        friends: "#e67e22",
        career: "#c0392b",
        property: "#27ae60",
        fortune: "#8e44ad",
        parents: "#16a085",
      },
      starColors: {
        main: "#2c3e50",
        auxiliary: "#7f8c8d",
        malefic: "#e74c3c",
        benefic: "#27ae60",
        neutral: "#95a5a6",
      },
      gradients: {
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        palace:
          "linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.8) 100%)",
      },
    });

    // 暗色主题
    this.themes.set("dark", {
      name: "暗色",
      background: "#1a1a1a",
      borderColor: "#4a90e2",
      borderWidth: 2,
      textColor: "#ffffff",
      primaryColor: "#4a90e2",
      secondaryColor: "#ff6b6b",
      accentColor: "#ffd93d",
      centerFill: "#2d2d2d",
      palaceColors: {
        destiny: "#4a90e2",
        siblings: "#6bcf7f",
        spouse: "#ff6b6b",
        children: "#ffd93d",
        wealth: "#bd93f9",
        health: "#8be9fd",
        travel: "#6272a4",
        friends: "#ffb86c",
        career: "#ff5555",
        property: "#50fa7b",
        fortune: "#bd93f9",
        parents: "#8be9fd",
      },
      starColors: {
        main: "#f8f8f2",
        auxiliary: "#6272a4",
        malefic: "#ff5555",
        benefic: "#50fa7b",
        neutral: "#6272a4",
      },
      gradients: {
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        palace:
          "linear-gradient(45deg, rgba(68,68,68,0.8) 0%, rgba(45,45,45,0.8) 100%)",
      },
    });

    // 中国风主题
    this.themes.set("chinese", {
      name: "中国风",
      background: "#faf8f3",
      borderColor: "#8b4513",
      borderWidth: 3,
      textColor: "#2f1b14",
      primaryColor: "#dc143c",
      secondaryColor: "#ffd700",
      accentColor: "#228b22",
      centerFill: "#fff8dc",
      palaceColors: {
        destiny: "#dc143c",
        siblings: "#228b22",
        spouse: "#ff69b4",
        children: "#ffd700",
        wealth: "#9370db",
        health: "#20b2aa",
        travel: "#4682b4",
        friends: "#ff8c00",
        career: "#b22222",
        property: "#32cd32",
        fortune: "#8a2be2",
        parents: "#008b8b",
      },
      starColors: {
        main: "#8b0000",
        auxiliary: "#8b4513",
        malefic: "#dc143c",
        benefic: "#228b22",
        neutral: "#696969",
      },
      gradients: {
        background: "linear-gradient(135deg, #faf8f3 0%, #f0e68c 100%)",
        palace:
          "linear-gradient(45deg, rgba(255,248,220,0.9) 0%, rgba(240,230,140,0.7) 100%)",
      },
      patterns: {
        traditional: "url(#chinesePattern)",
      },
    });

    // 简约主题
    this.themes.set("minimal", {
      name: "简约",
      background: "#ffffff",
      borderColor: "#333333",
      borderWidth: 1,
      textColor: "#333333",
      primaryColor: "#007acc",
      secondaryColor: "#ff6b35",
      accentColor: "#4caf50",
      centerFill: "#f9f9f9",
      palaceColors: {
        destiny: "#007acc",
        siblings: "#4caf50",
        spouse: "#ff6b35",
        children: "#ffc107",
        wealth: "#9c27b0",
        health: "#00bcd4",
        travel: "#607d8b",
        friends: "#ff9800",
        career: "#f44336",
        property: "#8bc34a",
        fortune: "#673ab7",
        parents: "#009688",
      },
      starColors: {
        main: "#333333",
        auxiliary: "#666666",
        malefic: "#f44336",
        benefic: "#4caf50",
        neutral: "#999999",
      },
      gradients: {
        background: "#ffffff",
        palace: "rgba(249,249,249,0.8)",
      },
    });
  }

  /**
   * 初始化图表类型
   */
  initializeChartTypes() {
    this.chartTypes.set("traditional_chart", {
      name: "传统命盘",
      template: "traditional",
      defaultTheme: "chinese",
      generator: this.generateTraditionalChart.bind(this),
    });

    this.chartTypes.set("modern_wheel", {
      name: "现代轮盘",
      template: "modern",
      defaultTheme: "classic",
      generator: this.generateModernWheel.bind(this),
    });

    this.chartTypes.set("grid_layout", {
      name: "网格布局",
      template: "grid",
      defaultTheme: "minimal",
      generator: this.generateGridLayout.bind(this),
    });

    this.chartTypes.set("star_relationship", {
      name: "星曜关系图",
      template: "relationship",
      defaultTheme: "dark",
      generator: this.generateStarRelationship.bind(this),
    });

    this.chartTypes.set("fortune_timeline", {
      name: "运势时间线",
      template: "timeline",
      defaultTheme: "classic",
      generator: this.generateFortuneTimeline.bind(this),
    });

    this.chartTypes.set("compatibility_radar", {
      name: "合婚雷达图",
      template: "radar",
      defaultTheme: "minimal",
      generator: this.generateCompatibilityRadar.bind(this),
    });
  }

  /**
   * 生成SVG图表
   */
  async generateChart(chartData, options = {}) {
    const {
      type = "traditional_chart",
      theme = null,
      customTemplate = null,
      width = null,
      height = null,
      animations = false,
      interactive = false,
    } = options;

    try {
      // 获取图表类型配置
      const chartType = this.chartTypes.get(type);
      if (!chartType) {
        throw new Error(`不支持的图表类型: ${type}`);
      }

      // 获取模板
      const template = customTemplate || this.templates.get(chartType.template);
      if (!template) {
        throw new Error(`找不到模板: ${chartType.template}`);
      }

      // 获取主题
      const selectedTheme = theme
        ? this.themes.get(theme)
        : this.themes.get(chartType.defaultTheme);
      if (!selectedTheme) {
        throw new Error(`找不到主题: ${theme || chartType.defaultTheme}`);
      }

      // 调整尺寸
      const finalTemplate = this.adjustTemplateDimensions(
        template,
        width,
        height,
      );

      // 生成图表内容
      const chartContent = await chartType.generator(
        chartData,
        finalTemplate,
        selectedTheme,
        options,
      );

      // 渲染SVG
      const svg = this.renderTemplate(
        finalTemplate,
        selectedTheme,
        chartContent,
      );

      // 添加动画和交互
      const enhancedSvg = this.addEnhancements(svg, {
        animations,
        interactive,
      });

      return {
        success: true,
        svg: enhancedSvg,
        metadata: {
          type: type,
          theme: selectedTheme.name,
          template: chartType.template,
          dimensions: {
            width: finalTemplate.width,
            height: finalTemplate.height,
          },
          features: {
            animations: animations,
            interactive: interactive,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 渲染模板
   */
  renderTemplate(template, theme, content) {
    let svg = template.template;

    // 替换基础变量
    svg = svg.replace(/{{width}}/g, template.width);
    svg = svg.replace(/{{height}}/g, template.height);
    svg = svg.replace(/{{viewBox}}/g, template.viewBox);

    // 替换主题变量
    svg = this.replaceThemeVariables(svg, theme);

    // 替换内容变量
    svg = this.replaceContentVariables(svg, content);

    // 生成定义元素
    const defs = this.generateDefs(theme);
    svg = svg.replace(/{{gradients}}/g, defs.gradients);
    svg = svg.replace(/{{patterns}}/g, defs.patterns);
    svg = svg.replace(/{{filters}}/g, defs.filters);
    svg = svg.replace(/{{markers}}/g, defs.markers || "");

    return svg;
  }

  /**
   * 替换主题变量
   */
  replaceThemeVariables(svg, theme) {
    // 替换主题颜色
    Object.keys(theme).forEach((key) => {
      if (typeof theme[key] === "string") {
        const regex = new RegExp(`{{theme\.${key}}}`, "g");
        svg = svg.replace(regex, theme[key]);
      }
    });

    return svg;
  }

  /**
   * 替换内容变量
   */
  replaceContentVariables(svg, content) {
    Object.keys(content).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      svg = svg.replace(regex, content[key] || "");
    });

    return svg;
  }

  /**
   * 生成定义元素
   */
  generateDefs(theme) {
    const gradients = this.generateGradients(theme);
    const patterns = this.generatePatterns(theme);
    const filters = this.generateFilters();
    const markers = this.generateMarkers(theme);

    return { gradients, patterns, filters, markers };
  }

  /**
   * 生成渐变定义
   */
  generateGradients(theme) {
    return `
      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${theme.background};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${this.adjustColor(theme.background, -10)};stop-opacity:1" />
      </linearGradient>
      
      <radialGradient id="palaceGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:rgba(255,255,255,0.8);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(240,240,240,0.6);stop-opacity:1" />
      </radialGradient>
      
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${theme.primaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${this.adjustColor(theme.primaryColor, -20)};stop-opacity:1" />
      </linearGradient>
    `;
  }

  /**
   * 生成图案定义
   */
  generatePatterns(theme) {
    if (theme.name === "中国风") {
      return `
        <pattern id="chinesePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="${theme.background}"/>
          <circle cx="10" cy="10" r="1" fill="${theme.accentColor}" opacity="0.3"/>
        </pattern>
      `;
    }
    return "";
  }

  /**
   * 生成滤镜定义
   */
  generateFilters() {
    return `
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
      
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    `;
  }

  /**
   * 生成箭头标记
   */
  generateMarkers(theme) {
    return `
      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${theme.borderColor}" />
      </marker>
    `;
  }

  /**
   * 生成传统命盘
   */
  generateTraditionalChart(chartData, template, theme, options) {
    const content = {
      palaceDividers: this.generatePalaceDividers(template, theme),
      palaceContents: this.generatePalaceContents(
        chartData.palaces,
        template,
        theme,
        "traditional",
      ),
      centerContent: this.generateCenterContent(
        chartData.info,
        template,
        theme,
      ),
      decorations: this.generateTraditionalDecorations(template, theme),
    };

    return content;
  }

  /**
   * 生成现代轮盘
   */
  generateModernWheel(chartData, template, theme, options) {
    const content = {
      palaceSectors: this.generatePalaceSectors(template, theme),
      palaceContents: this.generatePalaceContents(
        chartData.palaces,
        template,
        theme,
        "modern",
      ),
      centerContent: this.generateCenterContent(
        chartData.info,
        template,
        theme,
      ),
      decorations: this.generateModernDecorations(template, theme),
    };

    return content;
  }

  /**
   * 生成网格布局
   */
  generateGridLayout(chartData, template, theme, options) {
    const content = {
      gridCells: this.generateGridCells(template, theme),
      palaceContents: this.generatePalaceContents(
        chartData.palaces,
        template,
        theme,
        "grid",
      ),
      connections: this.generateConnections(template, theme),
      annotations: this.generateAnnotations(chartData, template, theme),
    };

    return content;
  }

  /**
   * 生成星曜关系图
   */
  generateStarRelationship(chartData, template, theme, options) {
    const content = {
      relationships: this.generateRelationshipLines(chartData, template, theme),
      starNodes: this.generateStarNodes(chartData, template, theme),
      labels: this.generateNodeLabels(chartData, template, theme),
      legend: this.generateLegend(template, theme),
    };

    return content;
  }

  /**
   * 调整模板尺寸
   */
  adjustTemplateDimensions(template, width, height) {
    if (!width && !height) return template;

    const adjusted = { ...template };

    if (width) {
      const scale = width / template.width;
      adjusted.width = width;
      adjusted.height = Math.round(template.height * scale);
    } else if (height) {
      const scale = height / template.height;
      adjusted.height = height;
      adjusted.width = Math.round(template.width * scale);
    }

    adjusted.viewBox = `0 0 ${adjusted.width} ${adjusted.height}`;

    return adjusted;
  }

  /**
   * 添加动画和交互增强
   */
  addEnhancements(svg, options) {
    let enhanced = svg;

    if (options.animations) {
      enhanced = this.addAnimations(enhanced);
    }

    if (options.interactive) {
      enhanced = this.addInteractivity(enhanced);
    }

    return enhanced;
  }

  /**
   * 添加动画效果
   */
  addAnimations(svg) {
    // 添加淡入动画
    const fadeInAnimation = `
      <style>
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .rotate {
          animation: rotate 20s linear infinite;
          transform-origin: center;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    return svg.replace("<svg", fadeInAnimation + '<svg class="fade-in"');
  }

  /**
   * 添加交互功能
   */
  addInteractivity(svg) {
    const interactiveScript = `
      <script><![CDATA[
        function showTooltip(evt, text) {
          const tooltip = document.getElementById('tooltip');
          tooltip.textContent = text;
          tooltip.style.display = 'block';
          tooltip.setAttribute('x', evt.clientX + 10);
          tooltip.setAttribute('y', evt.clientY - 10);
        }
        
        function hideTooltip() {
          document.getElementById('tooltip').style.display = 'none';
        }
      ]]></script>
      
      <text id="tooltip" x="0" y="0" fill="black" 
            style="display:none; background:white; padding:5px; border:1px solid black;"/>
    `;

    return svg.replace("</svg>", interactiveScript + "</svg>");
  }

  // 辅助方法
  adjustColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  generatePalacePositions(type) {
    // 根据类型生成宫位位置
    if (type === "traditional") {
      return [
        { id: "destiny", angle: 0, radius: 200 },
        { id: "siblings", angle: 30, radius: 200 },
        // ... 其他宫位
      ];
    }
    return [];
  }

  generateGridPositions() {
    const positions = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        positions.push({
          x: 25 + col * 225,
          y: 25 + row * 200,
          width: 200,
          height: 180,
        });
      }
    }
    return positions;
  }

  // 其他生成方法的占位符
  generatePalaceDividers(template, theme) {
    return "";
  }
  generatePalaceContents(palaces, template, theme, type) {
    return "";
  }
  generateCenterContent(info, template, theme) {
    return "";
  }
  generateTraditionalDecorations(template, theme) {
    return "";
  }
  generatePalaceSectors(template, theme) {
    return "";
  }
  generateModernDecorations(template, theme) {
    return "";
  }
  generateGridCells(template, theme) {
    return "";
  }
  generateConnections(template, theme) {
    return "";
  }
  generateAnnotations(chartData, template, theme) {
    return "";
  }
  generateRelationshipLines(chartData, template, theme) {
    return "";
  }
  generateStarNodes(chartData, template, theme) {
    return "";
  }
  generateNodeLabels(chartData, template, theme) {
    return "";
  }
  generateLegend(template, theme) {
    return "";
  }
}

module.exports = {
  EnhancedSVGGenerator,
};
