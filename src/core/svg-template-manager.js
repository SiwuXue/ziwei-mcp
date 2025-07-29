/**
 * SVG模板管理器
 * 负责模板的加载、缓存、动态替换和优化
 */

class SVGTemplateManager {
  constructor() {
    this.templates = new Map();
    this.compiledTemplates = new Map();
    this.templateCache = new Map();
    this.variableRegistry = new Map();

    // 性能配置
    this.config = {
      enableCache: true,
      maxCacheSize: 100,
      enableCompression: false,
      enableMinification: true,
    };

    // 初始化内置模板
    this.initializeBuiltinTemplates();
  }

  /**
   * 初始化内置模板
   */
  initializeBuiltinTemplates() {
    // 传统命盘模板
    this.registerTemplate("traditional_chart", {
      name: "传统命盘",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "structure.*",
        "palaceDividers",
        "palaceContents",
        "centerContent",
        "decorations",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart traditional">
          
          <!-- 定义区域 -->
          <defs>
            {{#each gradients}}
            <linearGradient id="{{id}}" {{attributes}}>
              {{#each stops}}
              <stop offset="{{offset}}" stop-color="{{color}}" stop-opacity="{{opacity}}"/>
              {{/each}}
            </linearGradient>
            {{/each}}
            
            {{#each patterns}}
            <pattern id="{{id}}" {{attributes}}>
              {{content}}
            </pattern>
            {{/each}}
            
            {{#each filters}}
            <filter id="{{id}}" {{attributes}}>
              {{content}}
            </filter>
            {{/each}}
          </defs>
          
          <!-- 背景层 -->
          <g class="background-layer">
            <rect width="100%" height="100%" fill="{{theme.background}}" class="chart-background"/>
            {{#if theme.backgroundPattern}}
            <rect width="100%" height="100%" fill="url(#{{theme.backgroundPattern}})" opacity="0.1"/>
            {{/if}}
          </g>
          
          <!-- 结构层 -->
          <g class="structure-layer">
            <!-- 外圈 -->
            <circle cx="{{structure.center.x}}" cy="{{structure.center.y}}" 
                    r="{{structure.outerRadius}}" fill="none" 
                    stroke="{{theme.borderColor}}" stroke-width="{{theme.borderWidth}}"
                    class="outer-circle"/>
            
            <!-- 内圈 -->
            <circle cx="{{structure.center.x}}" cy="{{structure.center.y}}" 
                    r="{{structure.innerRadius}}" fill="none" 
                    stroke="{{theme.borderColor}}" stroke-width="{{theme.borderWidth}}"
                    class="inner-circle"/>
            
            <!-- 宫位分割线 -->
            {{palaceDividers}}
          </g>
          
          <!-- 内容层 -->
          <g class="content-layer">
            {{palaceContents}}
          </g>
          
          <!-- 中心层 -->
          <g class="center-layer">
            {{centerContent}}
          </g>
          
          <!-- 装饰层 -->
          <g class="decoration-layer">
            {{decorations}}
          </g>
          
          <!-- 标签层 -->
          <g class="label-layer">
            {{labels}}
          </g>
        </svg>
      `,
      partials: {
        palaceDivider: `
          <line x1="{{x1}}" y1="{{y1}}" x2="{{x2}}" y2="{{y2}}" 
                stroke="{{color}}" stroke-width="{{width}}" class="palace-divider"/>
        `,
        palaceContent: `
          <g class="palace palace-{{id}}" transform="translate({{x}}, {{y}})">
            <!-- 宫位背景 -->
            <rect x="{{bounds.x}}" y="{{bounds.y}}" width="{{bounds.width}}" height="{{bounds.height}}"
                  fill="{{backgroundColor}}" stroke="{{borderColor}}" stroke-width="1"
                  rx="{{borderRadius}}" class="palace-background"/>
            
            <!-- 宫位名称 -->
            <text x="{{namePosition.x}}" y="{{namePosition.y}}" 
                  font-family="{{theme.fontFamily}}" font-size="{{theme.palaceNameSize}}"
                  fill="{{theme.textColor}}" text-anchor="middle" class="palace-name">
              {{name}}
            </text>
            
            <!-- 星曜列表 -->
            <g class="stars" transform="translate({{starsPosition.x}}, {{starsPosition.y}})">
              {{#each stars}}
              {{> starItem}}
              {{/each}}
            </g>
            
            <!-- 干支 -->
            {{#if showGanZhi}}
            <text x="{{ganZhiPosition.x}}" y="{{ganZhiPosition.y}}" 
                  font-family="{{theme.fontFamily}}" font-size="{{theme.ganZhiSize}}"
                  fill="{{theme.secondaryTextColor}}" class="gan-zhi">
              {{heavenlyStem}}{{earthlyBranch}}
            </text>
            {{/if}}
          </g>
        `,
        starItem: `
          <g class="star star-{{type}}" transform="translate({{x}}, {{y}})">
            <!-- 星曜背景 -->
            {{#if showBackground}}
            <rect x="-{{width/2}}" y="-{{height/2}}" width="{{width}}" height="{{height}}"
                  fill="{{backgroundColor}}" stroke="{{borderColor}}" stroke-width="0.5"
                  rx="2" class="star-background"/>
            {{/if}}
            
            <!-- 星曜名称 -->
            <text x="0" y="{{textOffset}}" 
                  font-family="{{theme.fontFamily}}" font-size="{{fontSize}}"
                  fill="{{textColor}}" text-anchor="middle" class="star-name">
              {{name}}
            </text>
            
            <!-- 亮度标记 -->
            {{#if brightness}}
            <text x="{{brightnessOffset.x}}" y="{{brightnessOffset.y}}" 
                  font-family="{{theme.fontFamily}}" font-size="{{brightnessSize}}"
                  fill="{{brightnessColor}}" class="brightness">
              {{brightness}}
            </text>
            {{/if}}
            
            <!-- 四化标记 -->
            {{#if sihua}}
            <circle cx="{{sihuaOffset.x}}" cy="{{sihuaOffset.y}}" r="3"
                    fill="{{sihuaColor}}" class="sihua-marker"/>
            {{/if}}
          </g>
        `,
      },
    });

    // 现代轮盘模板
    this.registerTemplate("modern_wheel", {
      name: "现代轮盘",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "structure.*",
        "palaceSectors",
        "palaceContents",
        "centerContent",
        "decorations",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart modern-wheel">
          
          <defs>
            {{> commonDefs}}
            
            <!-- 扇形渐变 -->
            {{#each sectorGradients}}
            <radialGradient id="{{id}}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="{{innerColor}}" stop-opacity="{{innerOpacity}}"/>
              <stop offset="100%" stop-color="{{outerColor}}" stop-opacity="{{outerOpacity}}"/>
            </radialGradient>
            {{/each}}
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="url(#backgroundGradient)" class="chart-background"/>
          
          <!-- 宫位扇形 -->
          <g class="palace-sectors">
            {{palaceSectors}}
          </g>
          
          <!-- 宫位内容 -->
          <g class="palace-contents">
            {{palaceContents}}
          </g>
          
          <!-- 中心圆 -->
          <g class="center-area">
            <circle cx="{{structure.center.x}}" cy="{{structure.center.y}}" 
                    r="{{structure.centerRadius}}" 
                    fill="url(#centerGradient)" stroke="{{theme.borderColor}}" 
                    stroke-width="{{theme.borderWidth}}" class="center-circle"/>
            {{centerContent}}
          </g>
          
          <!-- 装饰元素 -->
          <g class="decorations">
            {{decorations}}
          </g>
        </svg>
      `,
      partials: {
        palaceSector: `
          <path d="{{pathData}}" fill="url(#sector-{{id}})" stroke="{{theme.borderColor}}" 
                stroke-width="1" class="palace-sector palace-{{id}}"
                data-palace="{{id}}" data-name="{{name}}"/>
        `,
      },
    });

    // 网格布局模板
    this.registerTemplate("grid_layout", {
      name: "网格布局",
      category: "chart",
      variables: [
        "width",
        "height",
        "viewBox",
        "theme.*",
        "grid.*",
        "gridCells",
        "palaceContents",
        "connections",
        "annotations",
      ],
      template: `
        <svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" 
             xmlns="http://www.w3.org/2000/svg" class="ziwei-chart grid-layout">
          
          <defs>
            {{> commonDefs}}
          </defs>
          
          <!-- 背景 -->
          <rect width="100%" height="100%" fill="{{theme.background}}" class="chart-background"/>
          
          <!-- 网格线 -->
          <g class="grid-lines">
            {{#each gridLines}}
            <line x1="{{x1}}" y1="{{y1}}" x2="{{x2}}" y2="{{y2}}" 
                  stroke="{{color}}" stroke-width="{{width}}" stroke-dasharray="{{dashArray}}"
                  class="grid-line"/>
            {{/each}}
          </g>
          
          <!-- 网格单元格 -->
          <g class="grid-cells">
            {{gridCells}}
          </g>
          
          <!-- 宫位内容 -->
          <g class="palace-contents">
            {{palaceContents}}
          </g>
          
          <!-- 连接线 -->
          <g class="connections">
            {{connections}}
          </g>
          
          <!-- 注释 -->
          <g class="annotations">
            {{annotations}}
          </g>
        </svg>
      `,
      partials: {
        gridCell: `
          <g class="grid-cell" transform="translate({{x}}, {{y}})">
            <rect width="{{width}}" height="{{height}}" 
                  fill="{{backgroundColor}}" stroke="{{borderColor}}" stroke-width="1"
                  rx="{{borderRadius}}" class="cell-background"/>
          </g>
        `,
      },
    });

    // 通用部分模板
    this.registerPartial(
      "commonDefs",
      `
      <!-- 通用渐变 -->
      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="{{theme.background}}"/>
        <stop offset="100%" stop-color="{{theme.backgroundSecondary}}"/>
      </linearGradient>
      
      <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="{{theme.centerFill}}"/>
        <stop offset="100%" stop-color="{{theme.centerBorder}}"/>
      </radialGradient>
      
      <!-- 通用滤镜 -->
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
    `,
    );
  }

  /**
   * 注册模板
   */
  registerTemplate(id, templateConfig) {
    const template = {
      id: id,
      ...templateConfig,
      registeredAt: new Date().toISOString(),
      compiled: null,
    };

    this.templates.set(id, template);

    // 注册变量
    if (templateConfig.variables) {
      this.registerVariables(id, templateConfig.variables);
    }

    console.log(`模板已注册: ${id}`);
  }

  /**
   * 注册部分模板
   */
  registerPartial(name, template) {
    if (!this.partials) {
      this.partials = new Map();
    }
    this.partials.set(name, template);
  }

  /**
   * 注册变量
   */
  registerVariables(templateId, variables) {
    this.variableRegistry.set(templateId, variables);
  }

  /**
   * 编译模板
   */
  compileTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`模板不存在: ${templateId}`);
    }

    if (template.compiled) {
      return template.compiled;
    }

    try {
      // 预处理模板
      let processedTemplate = this.preprocessTemplate(template.template);

      // 编译部分模板
      if (template.partials) {
        processedTemplate = this.compilePartials(
          processedTemplate,
          template.partials,
        );
      }

      // 优化模板
      if (this.config.enableMinification) {
        processedTemplate = this.minifyTemplate(processedTemplate);
      }

      // 创建编译后的模板函数
      const compiled = this.createTemplateFunction(processedTemplate);

      template.compiled = compiled;
      this.compiledTemplates.set(templateId, compiled);

      console.log(`模板编译完成: ${templateId}`);
      return compiled;
    } catch (error) {
      console.error(`模板编译失败: ${templateId}`, error);
      throw error;
    }
  }

  /**
   * 预处理模板
   */
  preprocessTemplate(template) {
    // 移除多余的空白
    let processed = template.replace(/\s+/g, " ").trim();

    // 处理条件语句
    processed = this.processConditionals(processed);

    // 处理循环语句
    processed = this.processLoops(processed);

    return processed;
  }

  /**
   * 处理条件语句
   */
  processConditionals(template) {
    // 处理 {{#if condition}} ... {{/if}} 语法
    return template.replace(
      /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/#if\}\}/g,
      (match, condition, content) => {
        return `{{#if:${condition}}}${content}{{/if:${condition}}}`;
      },
    );
  }

  /**
   * 处理循环语句
   */
  processLoops(template) {
    // 处理 {{#each array}} ... {{/each}} 语法
    return template.replace(
      /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/#each\}\}/g,
      (match, array, content) => {
        return `{{#each:${array}}}${content}{{/each:${array}}}`;
      },
    );
  }

  /**
   * 编译部分模板
   */
  compilePartials(template, partials) {
    let compiled = template;

    // 替换部分模板引用
    Object.keys(partials).forEach((partialName) => {
      const partialRegex = new RegExp(`{{>\\s*${partialName}\\s*}}`, "g");
      compiled = compiled.replace(partialRegex, partials[partialName]);
    });

    // 处理全局部分模板
    if (this.partials) {
      this.partials.forEach((partialTemplate, partialName) => {
        const partialRegex = new RegExp(`{{>\\s*${partialName}\\s*}}`, "g");
        compiled = compiled.replace(partialRegex, partialTemplate);
      });
    }

    return compiled;
  }

  /**
   * 压缩模板
   */
  minifyTemplate(template) {
    return template
      .replace(/\s+/g, " ") // 合并空白
      .replace(/> </g, "><") // 移除标签间空白
      .replace(/\s*([<>])\s*/g, "$1") // 移除标签周围空白
      .trim();
  }

  /**
   * 创建模板函数
   */
  createTemplateFunction(template) {
    return (data) => {
      return this.renderTemplate(template, data);
    };
  }

  /**
   * 渲染模板
   */
  renderTemplate(template, data) {
    let rendered = template;

    // 处理简单变量替换
    rendered = this.replaceSimpleVariables(rendered, data);

    // 处理条件语句
    rendered = this.renderConditionals(rendered, data);

    // 处理循环语句
    rendered = this.renderLoops(rendered, data);

    // 处理嵌套对象
    rendered = this.replaceNestedVariables(rendered, data);

    return rendered;
  }

  /**
   * 替换简单变量
   */
  replaceSimpleVariables(template, data) {
    return template.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, variable) => {
      const value = this.getNestedValue(data, variable.trim());
      return value !== undefined ? value : match;
    });
  }

  /**
   * 渲染条件语句
   */
  renderConditionals(template, data) {
    return template.replace(
      /\{\{#if:([^}]+)\}\}([\s\S]*?)\{\{\/#if:\1\}\}/g,
      (match, condition, content) => {
        const value = this.getNestedValue(data, condition.trim());
        return value ? content : "";
      },
    );
  }

  /**
   * 渲染循环语句
   */
  renderLoops(template, data) {
    return template.replace(
      /\{\{#each:([^}]+)\}\}([\s\S]*?)\{\{\/each:\1\}\}/g,
      (match, arrayPath, content) => {
        const array = this.getNestedValue(data, arrayPath.trim());
        if (!Array.isArray(array)) return "";

        return array
          .map((item, index) => {
            let itemContent = content;

            // 替换循环变量
            itemContent = itemContent.replace(/\{\{this\}\}/g, item);
            itemContent = itemContent.replace(/\{\{@index\}\}/g, index);

            // 如果item是对象，替换其属性
            if (typeof item === "object") {
              Object.keys(item).forEach((key) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
                itemContent = itemContent.replace(regex, item[key]);
              });
            }

            return itemContent;
          })
          .join("");
      },
    );
  }

  /**
   * 替换嵌套变量
   */
  replaceNestedVariables(template, data) {
    // 处理 theme.* 等嵌套变量
    return template.replace(/{{([^}]+\.[^}]+)}}/g, (match, variable) => {
      const value = this.getNestedValue(data, variable.trim());
      return value !== undefined ? value : match;
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
   * 渲染模板（主入口）
   */
  render(templateId, data, options = {}) {
    const cacheKey = this.generateCacheKey(templateId, data, options);

    // 检查缓存
    if (this.config.enableCache && this.templateCache.has(cacheKey)) {
      return this.templateCache.get(cacheKey);
    }

    try {
      // 编译模板
      const compiledTemplate = this.compileTemplate(templateId);

      // 渲染
      const result = compiledTemplate(data);

      // 缓存结果
      if (this.config.enableCache) {
        this.cacheResult(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error(`模板渲染失败: ${templateId}`, error);
      throw error;
    }
  }

  /**
   * 生成缓存键
   */
  generateCacheKey(templateId, data, options) {
    const dataHash = this.hashObject(data);
    const optionsHash = this.hashObject(options);
    return `${templateId}:${dataHash}:${optionsHash}`;
  }

  /**
   * 对象哈希
   */
  hashObject(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(36);
  }

  /**
   * 缓存结果
   */
  cacheResult(key, result) {
    // 检查缓存大小限制
    if (this.templateCache.size >= this.config.maxCacheSize) {
      // 删除最旧的缓存项
      const firstKey = this.templateCache.keys().next().value;
      this.templateCache.delete(firstKey);
    }

    this.templateCache.set(key, result);
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.templateCache.clear();
    console.log("模板缓存已清理");
  }

  /**
   * 获取模板信息
   */
  getTemplateInfo(templateId) {
    const template = this.templates.get(templateId);
    if (!template) return null;

    return {
      id: template.id,
      name: template.name,
      category: template.category,
      variables: this.variableRegistry.get(templateId) || [],
      registeredAt: template.registeredAt,
      compiled: !!template.compiled,
    };
  }

  /**
   * 获取所有模板
   */
  getAllTemplates() {
    const templates = [];
    this.templates.forEach((template, id) => {
      templates.push(this.getTemplateInfo(id));
    });
    return templates;
  }

  /**
   * 删除模板
   */
  removeTemplate(templateId) {
    const removed = this.templates.delete(templateId);
    this.compiledTemplates.delete(templateId);
    this.variableRegistry.delete(templateId);

    // 清理相关缓存
    const keysToDelete = [];
    this.templateCache.forEach((value, key) => {
      if (key.startsWith(templateId + ":")) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.templateCache.delete(key));

    return removed;
  }

  /**
   * 验证模板
   */
  validateTemplate(templateId, data) {
    const variables = this.variableRegistry.get(templateId);
    if (!variables) return { valid: true };

    const missing = [];
    const invalid = [];

    variables.forEach((variable) => {
      if (variable.endsWith("*")) {
        // 通配符变量，检查对象是否存在
        const basePath = variable.slice(0, -2);
        const value = this.getNestedValue(data, basePath);
        if (!value || typeof value !== "object") {
          missing.push(basePath);
        }
      } else {
        const value = this.getNestedValue(data, variable);
        if (value === undefined) {
          missing.push(variable);
        }
      }
    });

    return {
      valid: missing.length === 0 && invalid.length === 0,
      missing: missing,
      invalid: invalid,
    };
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalTemplates: this.templates.size,
      compiledTemplates: this.compiledTemplates.size,
      cacheSize: this.templateCache.size,
      maxCacheSize: this.config.maxCacheSize,
      cacheHitRate: this.calculateCacheHitRate(),
    };
  }

  /**
   * 计算缓存命中率
   */
  calculateCacheHitRate() {
    // 这里需要实际的统计数据
    return 0.85; // 示例值
  }
}

module.exports = {
  SVGTemplateManager,
};
