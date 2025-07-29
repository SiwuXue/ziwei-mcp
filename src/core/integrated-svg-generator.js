/**
 * 集成SVG生成器
 * 整合模板管理、增量更新、主题管理和多图表类型支持
 */

const { SVGTemplateManager } = require("./svg-template-manager");
const { SVGIncrementalUpdater } = require("./svg-incremental-updater");
const { SVGThemeManager } = require("./svg-theme-manager");

class IntegratedSVGGenerator {
  constructor(options = {}) {
    // 初始化子模块
    this.templateManager = new SVGTemplateManager();
    this.incrementalUpdater = new SVGIncrementalUpdater();
    this.themeManager = new SVGThemeManager();

    // 配置
    this.config = {
      enableIncremental: true,
      enableCaching: true,
      enableOptimization: true,
      defaultTheme: "classic",
      defaultChartType: "traditional_chart",
      enableAnimations: true,
      enableInteractivity: false,
      outputFormat: "svg", // 'svg' | 'png' | 'pdf'
      quality: "high", // 'low' | 'medium' | 'high'
      ...options,
    };

    // 缓存
    this.generationCache = new Map();
    this.dataCache = new Map();

    // 统计
    this.stats = {
      totalGenerations: 0,
      cacheHits: 0,
      incrementalUpdates: 0,
      fullRebuilds: 0,
      averageGenerationTime: 0,
      errorCount: 0,
    };

    // 初始化
    this.initialize();
  }

  /**
   * 初始化
   */
  initialize() {
    // 设置默认主题
    this.themeManager.setCurrentTheme(this.config.defaultTheme);

    // 注册额外的图表类型模板
    this.registerAdditionalTemplates();

    console.log("集成SVG生成器已初始化");
  }

  /**
   * 注册额外的图表类型模板
   */
  registerAdditionalTemplates() {
    // 星曜关系图模板
    this.templateManager.registerTemplate("star_relationship", {
      name: "星曜关系图",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "nodes",
        "edges",
        "layout",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart star-relationship">
          
          <defs>
            {{> commonDefs}}
            
            <!-- 关系线标记 -->
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="{{theme.borderPrimary}}"/>
            </marker>
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}" class="chart-background"/>
          
          <!-- 关系线 -->
          <g class="edges">
            {{#each edges}}
            <line x1="{{source.x}}" y1="{{source.y}}" x2="{{target.x}}" y2="{{target.y}}"
                  stroke="{{color}}" stroke-width="{{width}}" stroke-dasharray="{{dashArray}}"
                  marker-end="url(#arrowhead)" class="edge edge-{{type}}"/>
            <text x="{{midpoint.x}}" y="{{midpoint.y}}" 
                  font-family="{{../theme.fontFamily}}" font-size="{{../theme.captionSize}}"
                  fill="{{../theme.textSecondary}}" text-anchor="middle" class="edge-label">
              {{label}}
            </text>
            {{/each}}
          </g>
          
          <!-- 星曜节点 -->
          <g class="nodes">
            {{#each nodes}}
            <g class="node node-{{type}}" transform="translate({{x}}, {{y}})">
              <circle r="{{radius}}" fill="{{backgroundColor}}" stroke="{{borderColor}}" 
                      stroke-width="2" class="node-circle"/>
              <text x="0" y="{{textOffset}}" 
                    font-family="{{../theme.fontFamily}}" font-size="{{fontSize}}"
                    fill="{{textColor}}" text-anchor="middle" class="node-label">
                {{name}}
              </text>
              {{#if brightness}}
              <text x="{{brightnessOffset.x}}" y="{{brightnessOffset.y}}" 
                    font-family="{{../theme.fontFamily}}" font-size="{{brightnessSize}}"
                    fill="{{brightnessColor}}" class="brightness">
                {{brightness}}
              </text>
              {{/if}}
            </g>
            {{/each}}
          </g>
        </svg>
      `,
    });

    // 运势时间线模板
    this.templateManager.registerTemplate("fortune_timeline", {
      name: "运势时间线",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "timeline",
        "events",
        "periods",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart fortune-timeline">
          
          <defs>
            {{> commonDefs}}
            
            <!-- 时间线渐变 -->
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="{{theme.primary}}" stop-opacity="0.8"/>
              <stop offset="50%" stop-color="{{theme.secondary}}" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="{{theme.accent}}" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}" class="chart-background"/>
          
          <!-- 时间轴 -->
          <g class="timeline-axis">
            <line x1="{{timeline.startX}}" y1="{{timeline.y}}" 
                  x2="{{timeline.endX}}" y2="{{timeline.y}}"
                  stroke="url(#timelineGradient)" stroke-width="4" class="timeline-line"/>
            
            <!-- 时间刻度 -->
            {{#each timeline.ticks}}
            <g class="tick" transform="translate({{x}}, {{../timeline.y}})">
              <line x1="0" y1="-5" x2="0" y2="5" stroke="{{../theme.borderPrimary}}" stroke-width="2"/>
              <text x="0" y="20" 
                    font-family="{{../theme.fontFamily}}" font-size="{{../theme.captionSize}}"
                    fill="{{../theme.textSecondary}}" text-anchor="middle" class="tick-label">
                {{label}}
              </text>
            </g>
            {{/each}}
          </g>
          
          <!-- 运势事件 -->
          <g class="fortune-events">
            {{#each events}}
            <g class="event event-{{type}}" transform="translate({{x}}, {{y}})">
              <circle r="{{radius}}" fill="{{color}}" stroke="{{borderColor}}" 
                      stroke-width="2" class="event-marker"/>
              
              <!-- 事件标签 -->
              <g class="event-label" transform="translate(0, {{labelOffset}})">
                <rect x="{{label.x}}" y="{{label.y}}" width="{{label.width}}" height="{{label.height}}"
                      fill="{{label.background}}" stroke="{{label.border}}" stroke-width="1"
                      rx="3" class="label-background"/>
                <text x="0" y="{{label.textY}}" 
                      font-family="{{../theme.fontFamily}}" font-size="{{../theme.bodySize}}"
                      fill="{{../theme.textPrimary}}" text-anchor="middle" class="label-text">
                  {{title}}
                </text>
                <text x="0" y="{{label.descY}}" 
                      font-family="{{../theme.fontFamily}}" font-size="{{../theme.captionSize}}"
                      fill="{{../theme.textSecondary}}" text-anchor="middle" class="label-desc">
                  {{description}}
                </text>
              </g>
              
              <!-- 连接线 -->
              <line x1="0" y1="{{radius}}" x2="0" y2="{{labelOffset - 5}}"
                    stroke="{{borderColor}}" stroke-width="1" stroke-dasharray="2,2" class="connector"/>
            </g>
            {{/each}}
          </g>
          
          <!-- 运势周期 -->
          <g class="fortune-periods">
            {{#each periods}}
            <rect x="{{x}}" y="{{y}}" width="{{width}}" height="{{height}}"
                  fill="{{color}}" fill-opacity="0.2" stroke="{{borderColor}}" stroke-width="1"
                  rx="2" class="period period-{{type}}"/>
            <text x="{{textX}}" y="{{textY}}" 
                  font-family="{{../theme.fontFamily}}" font-size="{{../theme.subtitleSize}}"
                  fill="{{../theme.textPrimary}}" text-anchor="middle" class="period-label">
              {{name}}
            </text>
            {{/each}}
          </g>
        </svg>
      `,
    });

    // 合婚雷达图模板
    this.templateManager.registerTemplate("compatibility_radar", {
      name: "合婚雷达图",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "radar",
        "axes",
        "data",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart compatibility-radar">
          
          <defs>
            {{> commonDefs}}
            
            <!-- 雷达图渐变 -->
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="{{theme.primary}}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="{{theme.primary}}" stop-opacity="0.1"/>
            </radialGradient>
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}" class="chart-background"/>
          
          <!-- 雷达网格 -->
          <g class="radar-grid">
            <!-- 同心圆 -->
            {{#each radar.circles}}
            <circle cx="{{../radar.centerX}}" cy="{{../radar.centerY}}" r="{{radius}}"
                    fill="none" stroke="{{../theme.borderSecondary}}" stroke-width="1"
                    stroke-opacity="{{opacity}}" class="grid-circle"/>
            {{/each}}
            
            <!-- 轴线 -->
            {{#each axes}}
            <line x1="{{../radar.centerX}}" y1="{{../radar.centerY}}" 
                  x2="{{endX}}" y2="{{endY}}"
                  stroke="{{../theme.borderPrimary}}" stroke-width="1" class="axis-line"/>
            
            <!-- 轴标签 -->
            <text x="{{labelX}}" y="{{labelY}}" 
                  font-family="{{../theme.fontFamily}}" font-size="{{../theme.bodySize}}"
                  fill="{{../theme.textPrimary}}" text-anchor="{{textAnchor}}" class="axis-label">
              {{label}}
            </text>
            {{/each}}
          </g>
          
          <!-- 数据区域 -->
          <g class="radar-data">
            {{#each data}}
            <polygon points="{{points}}" fill="{{color}}" fill-opacity="0.3"
                     stroke="{{color}}" stroke-width="2" class="data-polygon data-{{name}}"/>
            
            <!-- 数据点 -->
            {{#each values}}
            <circle cx="{{x}}" cy="{{y}}" r="4" fill="{{../color}}" stroke="white" 
                    stroke-width="2" class="data-point"/>
            <text x="{{x}}" y="{{y - 8}}" 
                  font-family="{{../../theme.fontFamily}}" font-size="{{../../theme.captionSize}}"
                  fill="{{../../theme.textPrimary}}" text-anchor="middle" class="data-value">
              {{value}}
            </text>
            {{/each}}
            {{/each}}
          </g>
          
          <!-- 图例 -->
          <g class="legend" transform="translate({{legend.x}}, {{legend.y}})">
            {{#each data}}
            <g class="legend-item" transform="translate(0, {{@index * 20}})">
              <rect x="0" y="0" width="12" height="12" fill="{{color}}" rx="2"/>
              <text x="18" y="9" 
                    font-family="{{../theme.fontFamily}}" font-size="{{../theme.bodySize}}"
                    fill="{{../theme.textPrimary}}" class="legend-label">
                {{name}}
              </text>
            </g>
            {{/each}}
          </g>
        </svg>
      `,
    });
  }

  /**
   * 生成SVG图表（主入口）
   */
  async generateChart(chartData, options = {}) {
    const startTime = performance.now();

    try {
      // 合并配置
      const config = { ...this.config, ...options };

      // 数据预处理
      const processedData = await this.preprocessData(chartData, config);

      // 检查缓存
      if (config.enableCaching) {
        const cached = this.checkCache(processedData, config);
        if (cached) {
          this.stats.cacheHits++;
          return cached;
        }
      }

      // 检查是否可以增量更新
      let result;
      if (
        config.enableIncremental &&
        this.canUseIncremental(processedData, config)
      ) {
        result = await this.generateIncremental(processedData, config);
      } else {
        result = await this.generateFull(processedData, config);
      }

      // 后处理
      result = await this.postProcess(result, config);

      // 缓存结果
      if (config.enableCaching) {
        this.cacheResult(processedData, config, result);
      }

      // 更新统计
      this.updateStats(performance.now() - startTime, "success");

      return result;
    } catch (error) {
      this.updateStats(performance.now() - startTime, "error");
      console.error("SVG生成失败:", error);
      throw error;
    }
  }

  /**
   * 数据预处理
   */
  async preprocessData(chartData, config) {
    // 应用主题
    const themedData = this.themeManager.applyThemeToData(
      chartData,
      config.theme,
    );

    // 数据验证
    this.validateChartData(themedData, config.chartType);

    // 数据转换
    const transformedData = this.transformDataForChart(themedData, config);

    // 布局计算
    const layoutData = this.calculateLayout(transformedData, config);

    return layoutData;
  }

  /**
   * 验证图表数据
   */
  validateChartData(data, chartType) {
    const validators = {
      traditional_chart: this.validateTraditionalChart,
      modern_wheel: this.validateModernWheel,
      grid_layout: this.validateGridLayout,
      star_relationship: this.validateStarRelationship,
      fortune_timeline: this.validateFortuneTimeline,
      compatibility_radar: this.validateCompatibilityRadar,
    };

    const validator = validators[chartType];
    if (validator) {
      const validation = validator.call(this, data);
      if (!validation.valid) {
        throw new Error(`数据验证失败: ${validation.errors.join(", ")}`);
      }
    }
  }

  /**
   * 验证传统命盘数据
   */
  validateTraditionalChart(data) {
    const errors = [];

    if (
      !data.palaces ||
      !Array.isArray(data.palaces) ||
      data.palaces.length !== 12
    ) {
      errors.push("必须包含12个宫位");
    }

    if (!data.theme) {
      errors.push("缺少主题配置");
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证现代轮盘数据
   */
  validateModernWheel(data) {
    return this.validateTraditionalChart(data); // 基本验证相同
  }

  /**
   * 验证网格布局数据
   */
  validateGridLayout(data) {
    const errors = [];

    if (!data.grid) {
      errors.push("缺少网格配置");
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证星曜关系图数据
   */
  validateStarRelationship(data) {
    const errors = [];

    if (!data.nodes || !Array.isArray(data.nodes)) {
      errors.push("缺少节点数据");
    }

    if (!data.edges || !Array.isArray(data.edges)) {
      errors.push("缺少边数据");
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证运势时间线数据
   */
  validateFortuneTimeline(data) {
    const errors = [];

    if (!data.timeline) {
      errors.push("缺少时间线配置");
    }

    if (!data.events || !Array.isArray(data.events)) {
      errors.push("缺少事件数据");
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证合婚雷达图数据
   */
  validateCompatibilityRadar(data) {
    const errors = [];

    if (!data.axes || !Array.isArray(data.axes)) {
      errors.push("缺少轴数据");
    }

    if (!data.data || !Array.isArray(data.data)) {
      errors.push("缺少雷达数据");
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 数据转换
   */
  transformDataForChart(data, config) {
    const transformers = {
      traditional_chart: this.transformTraditionalChart,
      modern_wheel: this.transformModernWheel,
      grid_layout: this.transformGridLayout,
      star_relationship: this.transformStarRelationship,
      fortune_timeline: this.transformFortuneTimeline,
      compatibility_radar: this.transformCompatibilityRadar,
    };

    const transformer = transformers[config.chartType];
    return transformer ? transformer.call(this, data, config) : data;
  }

  /**
   * 转换传统命盘数据
   */
  transformTraditionalChart(data, config) {
    // 计算宫位位置
    const palacePositions = this.calculatePalacePositions(
      config.width,
      config.height,
    );

    // 处理宫位数据
    const transformedPalaces = data.palaces.map((palace, index) => {
      const position = palacePositions[index];
      return {
        ...palace,
        id: index,
        x: position.x,
        y: position.y,
        bounds: position.bounds,
        namePosition: position.namePosition,
        starsPosition: position.starsPosition,
        ganZhiPosition: position.ganZhiPosition,
      };
    });

    return {
      ...data,
      palaces: transformedPalaces,
      structure: {
        center: { x: config.width / 2, y: config.height / 2 },
        outerRadius: Math.min(config.width, config.height) * 0.4,
        innerRadius: Math.min(config.width, config.height) * 0.15,
      },
    };
  }

  /**
   * 转换现代轮盘数据
   */
  transformModernWheel(data, config) {
    const baseData = this.transformTraditionalChart(data, config);

    // 计算扇形路径
    const sectorPaths = this.calculateSectorPaths(baseData.structure, 12);

    return {
      ...baseData,
      sectorPaths: sectorPaths,
    };
  }

  /**
   * 转换网格布局数据
   */
  transformGridLayout(data, config) {
    const gridConfig = {
      rows: 4,
      cols: 3,
      cellWidth: config.width / 3,
      cellHeight: config.height / 4,
      padding: 10,
    };

    return {
      ...data,
      grid: gridConfig,
    };
  }

  /**
   * 转换星曜关系图数据
   */
  transformStarRelationship(data, config) {
    // 使用力导向布局算法
    const layout = this.calculateForceLayout(data.nodes, data.edges, config);

    return {
      ...data,
      nodes: layout.nodes,
      edges: layout.edges,
    };
  }

  /**
   * 转换运势时间线数据
   */
  transformFortuneTimeline(data, config) {
    const timelineY = config.height / 2;
    const startX = 50;
    const endX = config.width - 50;
    const timelineWidth = endX - startX;

    // 计算事件位置
    const transformedEvents = data.events.map((event, index) => {
      const x = startX + timelineWidth * event.timeRatio;
      const y = timelineY - 50 - (index % 2) * 30; // 交替高度

      return {
        ...event,
        x: x,
        y: y,
        labelOffset: -40,
      };
    });

    return {
      ...data,
      timeline: {
        startX: startX,
        endX: endX,
        y: timelineY,
        ticks: this.generateTimelineTicks(startX, endX, data.timeRange),
      },
      events: transformedEvents,
    };
  }

  /**
   * 转换合婚雷达图数据
   */
  transformCompatibilityRadar(data, config) {
    const centerX = config.width / 2;
    const centerY = config.height / 2;
    const maxRadius = Math.min(config.width, config.height) * 0.3;

    // 计算轴位置
    const transformedAxes = data.axes.map((axis, index) => {
      const angle = (index * 2 * Math.PI) / data.axes.length - Math.PI / 2;
      const endX = centerX + maxRadius * Math.cos(angle);
      const endY = centerY + maxRadius * Math.sin(angle);
      const labelX = centerX + (maxRadius + 20) * Math.cos(angle);
      const labelY = centerY + (maxRadius + 20) * Math.sin(angle);

      return {
        ...axis,
        endX: endX,
        endY: endY,
        labelX: labelX,
        labelY: labelY,
        textAnchor: labelX > centerX ? "start" : "end",
      };
    });

    // 计算数据点位置
    const transformedData = data.data.map((dataset) => {
      const values = dataset.values.map((value, index) => {
        const axis = transformedAxes[index];
        const ratio = value / 100; // 假设最大值为100
        const x = centerX + (axis.endX - centerX) * ratio;
        const y = centerY + (axis.endY - centerY) * ratio;

        return {
          ...value,
          x: x,
          y: y,
        };
      });

      const points = values.map((v) => `${v.x},${v.y}`).join(" ");

      return {
        ...dataset,
        values: values,
        points: points,
      };
    });

    return {
      ...data,
      radar: {
        centerX: centerX,
        centerY: centerY,
        maxRadius: maxRadius,
        circles: [0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => ({
          radius: maxRadius * ratio,
          opacity: 0.3,
        })),
      },
      axes: transformedAxes,
      data: transformedData,
      legend: {
        x: config.width - 120,
        y: 20,
      },
    };
  }

  /**
   * 计算布局
   */
  calculateLayout(data, config) {
    // 设置基本尺寸
    const layoutData = {
      ...data,
      width: config.width || 800,
      height: config.height || 600,
      viewBox: `0 0 ${config.width || 800} ${config.height || 600}`,
    };

    return layoutData;
  }

  /**
   * 检查是否可以使用增量更新
   */
  canUseIncremental(data, config) {
    if (!config.enableIncremental) return false;

    const cacheKey = this.generateCacheKey(data, config);
    const previousData = this.dataCache.get(cacheKey);

    return !!previousData;
  }

  /**
   * 增量生成
   */
  async generateIncremental(data, config) {
    const cacheKey = this.generateCacheKey(data, config);
    const previousData = this.dataCache.get(cacheKey);

    // 检测变化
    const changeResult = this.incrementalUpdater.detectChanges(
      cacheKey,
      data,
      previousData,
    );

    if (changeResult.type === "no_change") {
      // 返回缓存的结果
      return this.generationCache.get(cacheKey);
    }

    if (changeResult.type === "incremental") {
      // 应用增量更新
      const previousSVG = this.generationCache.get(cacheKey);
      const updatedSVG = this.applyIncrementalUpdate(
        previousSVG,
        changeResult.patch,
      );

      this.stats.incrementalUpdates++;
      return updatedSVG;
    }

    // 回退到完整生成
    this.stats.fullRebuilds++;
    return this.generateFull(data, config);
  }

  /**
   * 完整生成
   */
  async generateFull(data, config) {
    // 渲染模板
    const svg = this.templateManager.render(config.chartType, data);

    // 创建快照
    const cacheKey = this.generateCacheKey(data, config);
    this.incrementalUpdater.createSnapshot(cacheKey, svg, {
      chartType: config.chartType,
      theme: config.theme,
    });

    // 缓存数据
    this.dataCache.set(cacheKey, data);

    return svg;
  }

  /**
   * 应用增量更新
   */
  applyIncrementalUpdate(previousSVG, patch) {
    // 这里需要实际的DOM操作或字符串替换
    // 简化实现：直接返回更新后的SVG
    return previousSVG; // 实际实现需要应用补丁
  }

  /**
   * 后处理
   */
  async postProcess(svg, config) {
    let result = svg;

    // 优化SVG
    if (config.enableOptimization) {
      result = this.optimizeSVG(result);
    }

    // 添加动画
    if (config.enableAnimations) {
      result = this.addAnimations(result, config);
    }

    // 添加交互
    if (config.enableInteractivity) {
      result = this.addInteractivity(result, config);
    }

    // 格式转换
    if (config.outputFormat !== "svg") {
      result = await this.convertFormat(result, config.outputFormat, config);
    }

    return result;
  }

  /**
   * 优化SVG
   */
  optimizeSVG(svg) {
    // 移除不必要的空白
    let optimized = svg.replace(/\s+/g, " ").trim();

    // 合并相同的样式
    optimized = this.mergeStyles(optimized);

    // 移除未使用的定义
    optimized = this.removeUnusedDefs(optimized);

    return optimized;
  }

  /**
   * 添加动画
   */
  addAnimations(svg, config) {
    // 添加淡入动画
    const fadeInAnimation = `
      <style>
        .ziwei-chart { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    `;

    return svg.replace("<defs>", `<defs>${fadeInAnimation}`);
  }

  /**
   * 添加交互
   */
  addInteractivity(svg, config) {
    // 添加鼠标悬停效果
    const interactiveStyles = `
      <style>
        .palace:hover { opacity: 0.8; cursor: pointer; }
        .star:hover { transform: scale(1.1); cursor: pointer; }
      </style>
    `;

    return svg.replace("<defs>", `<defs>${interactiveStyles}`);
  }

  /**
   * 格式转换
   */
  async convertFormat(svg, format, config) {
    switch (format) {
      case "png":
        return this.convertToPNG(svg, config);
      case "pdf":
        return this.convertToPDF(svg, config);
      default:
        return svg;
    }
  }

  /**
   * 转换为PNG
   */
  async convertToPNG(svg, config) {
    // 这里需要实际的转换实现
    // 可以使用 puppeteer 或其他库
    console.log("PNG转换功能需要额外实现");
    return svg;
  }

  /**
   * 转换为PDF
   */
  async convertToPDF(svg, config) {
    // 这里需要实际的转换实现
    console.log("PDF转换功能需要额外实现");
    return svg;
  }

  /**
   * 检查缓存
   */
  checkCache(data, config) {
    if (!config.enableCaching) return null;

    const cacheKey = this.generateCacheKey(data, config);
    return this.generationCache.get(cacheKey);
  }

  /**
   * 缓存结果
   */
  cacheResult(data, config, result) {
    const cacheKey = this.generateCacheKey(data, config);
    this.generationCache.set(cacheKey, result);

    // 限制缓存大小
    if (this.generationCache.size > 100) {
      const firstKey = this.generationCache.keys().next().value;
      this.generationCache.delete(firstKey);
    }
  }

  /**
   * 生成缓存键
   */
  generateCacheKey(data, config) {
    const keyData = {
      chartType: config.chartType,
      theme: config.theme,
      dataHash: this.hashData(data),
    };

    return JSON.stringify(keyData);
  }

  /**
   * 数据哈希
   */
  hashData(data) {
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * 更新统计
   */
  updateStats(duration, status) {
    this.stats.totalGenerations++;

    if (status === "error") {
      this.stats.errorCount++;
    }

    // 更新平均时间
    this.stats.averageGenerationTime =
      (this.stats.averageGenerationTime * (this.stats.totalGenerations - 1) +
        duration) /
      this.stats.totalGenerations;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      cacheHitRate:
        this.stats.totalGenerations > 0
          ? this.stats.cacheHits / this.stats.totalGenerations
          : 0,
      incrementalRate:
        this.stats.totalGenerations > 0
          ? this.stats.incrementalUpdates / this.stats.totalGenerations
          : 0,
      templateStats: this.templateManager.getStats(),
      themeStats: this.themeManager.getStats(),
      updaterStats: this.incrementalUpdater.getStats(),
    };
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.generationCache.clear();
    this.dataCache.clear();
    this.templateManager.clearCache();
    console.log("所有缓存已清理");
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      totalGenerations: 0,
      cacheHits: 0,
      incrementalUpdates: 0,
      fullRebuilds: 0,
      averageGenerationTime: 0,
      errorCount: 0,
    };
  }

  // 辅助方法
  calculatePalacePositions(width, height) {
    // 实现宫位位置计算
    return [];
  }

  calculateSectorPaths(structure, sectorCount) {
    // 实现扇形路径计算
    return [];
  }

  calculateForceLayout(nodes, edges, config) {
    // 实现力导向布局
    return { nodes, edges };
  }

  generateTimelineTicks(startX, endX, timeRange) {
    // 实现时间轴刻度生成
    return [];
  }

  mergeStyles(svg) {
    // 实现样式合并
    return svg;
  }

  removeUnusedDefs(svg) {
    // 实现未使用定义移除
    return svg;
  }
}

module.exports = {
  IntegratedSVGGenerator,
};
