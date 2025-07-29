/**
 * 命盘可视化工具
 * 生成紫微斗数命盘的SVG图表
 */

class ChartVisualizer {
  /**
   * 生成命盘可视化图表
   */
  async generateVisualization(input) {
    const {
      chart,
      visualizationType,
      includeElements,
      colorScheme,
      outputFormat,
    } = input;

    try {
      let imageData;

      switch (visualizationType) {
        case "traditional_chart":
          imageData = this.generateTraditionalChart(
            chart,
            includeElements,
            colorScheme,
          );
          break;
        case "modern_wheel":
          imageData = this.generateModernWheel(
            chart,
            includeElements,
            colorScheme,
          );
          break;
        case "palace_grid":
          imageData = this.generatePalaceGrid(
            chart,
            includeElements,
            colorScheme,
          );
          break;
        case "star_map":
          imageData = this.generateStarMap(chart, includeElements, colorScheme);
          break;
        default:
          imageData = this.generateTraditionalChart(
            chart,
            includeElements,
            colorScheme,
          );
      }

      return {
        imageData,
        metadata: {
          format: outputFormat,
          dimensions: {
            width: 800,
            height: 800,
          },
          elements: includeElements,
        },
      };
    } catch (error) {
      console.error("生成可视化图表失败:", error);
      throw new Error(`生成可视化图表失败: ${error.message}`);
    }
  }

  /**
   * 生成传统命盘图表
   */
  generateTraditionalChart(chart, includeElements, colorScheme) {
    const colors = this.getColorScheme(colorScheme);

    // 创建SVG画布
    let svg =
      '<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">';

    // 添加背景
    svg += `<rect width="800" height="800" fill="${colors.background}" stroke="${colors.border}" stroke-width="2"/>`;

    // 添加标题
    svg += `<text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="${colors.text}">紫微斗数命盘</text>`;

    // 添加基本信息
    svg += this.addBasicInfo(chart, colors, 50, 60);

    // 绘制十二宫格
    svg += this.drawPalaceGrid(
      chart,
      colors,
      includeElements,
      100,
      150,
      600,
      600,
    );

    svg += "</svg>";

    return svg;
  }

  /**
   * 生成现代轮盘图表
   */
  generateModernWheel(chart, includeElements, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    const centerX = 400;
    const centerY = 400;
    const radius = 300;

    let svg =
      '<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">';

    // 添加背景
    svg += `<rect width="800" height="800" fill="${colors.background}"/>`;

    // 添加标题
    svg += `<text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="${colors.text}">紫微斗数命盘（轮盘式）</text>`;

    // 绘制圆形宫位
    for (let i = 0; i < 12; i++) {
      const angle = ((i * 30 - 90) * Math.PI) / 180; // 从12点开始，顺时针
      const palace = chart.palaces && chart.palaces[i];

      if (palace) {
        // 绘制宫位扇形
        svg += this.drawPalaceSector(
          centerX,
          centerY,
          radius,
          angle,
          palace,
          colors,
          includeElements,
        );
      }
    }

    // 添加中心圆
    svg += `<circle cx="${centerX}" cy="${centerY}" r="80" fill="${colors.center}" stroke="${colors.border}" stroke-width="2"/>`;
    svg += `<text x="${centerX}" y="${centerY - 10}" text-anchor="middle" font-size="16" font-weight="bold" fill="${colors.text}">命宫</text>`;
    svg += `<text x="${centerX}" y="${centerY + 10}" text-anchor="middle" font-size="14" fill="${colors.text}">紫微斗数</text>`;

    svg += "</svg>";

    return svg;
  }

  /**
   * 生成宫位网格图表
   */
  generatePalaceGrid(chart, includeElements, colorScheme) {
    const colors = this.getColorScheme(colorScheme);

    let svg =
      '<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">';

    // 添加背景
    svg += `<rect width="800" height="800" fill="${colors.background}"/>`;

    // 添加标题
    svg += `<text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="${colors.text}">紫微斗数宫位图</text>`;

    // 绘制4x3网格
    const gridWidth = 600;
    const gridHeight = 600;
    const cellWidth = gridWidth / 4;
    const cellHeight = gridHeight / 3;
    const startX = 100;
    const startY = 100;

    // 宫位排列顺序（传统排法）
    const palaceOrder = [
      [3, 2, 1, 0], // 第一行：辰巳午未
      [4, -1, -1, 11], // 第二行：卯空空申
      [5, 6, 7, 8], // 第三行：寅丑子亥
    ];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const palaceIndex = palaceOrder[row][col];
        const x = startX + col * cellWidth;
        const y = startY + row * cellHeight;

        if (palaceIndex >= 0 && chart.palaces[palaceIndex]) {
          const palace = chart.palaces[palaceIndex];
          svg += this.drawPalaceCell(
            x,
            y,
            cellWidth,
            cellHeight,
            palace,
            colors,
            includeElements,
          );
        } else {
          // 空白区域（中央）
          svg += `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${colors.center}" stroke="${colors.border}" stroke-width="1"/>`;
        }
      }
    }

    svg += "</svg>";

    return svg;
  }

  /**
   * 生成星曜分布图
   */
  generateStarMap(chart, includeElements, colorScheme) {
    const colors = this.getColorScheme(colorScheme);

    let svg =
      '<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">';

    // 添加背景
    svg += `<rect width="800" height="800" fill="${colors.background}"/>`;

    // 添加标题
    svg += `<text x="400" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="${colors.text}">星曜分布图</text>`;

    // 绘制星曜分布
    const centerX = 400;
    const centerY = 400;
    const radius = 250;

    // 绘制外圆
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${colors.border}" stroke-width="2"/>`;

    // 绘制宫位分割线
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = centerX + Math.cos(angle) * (radius - 50);
      const y1 = centerY + Math.sin(angle) * (radius - 50);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.border}" stroke-width="1"/>`;
    }

    // 绘制星曜
    chart.palaces.forEach((palace, index) => {
      const angle = ((index * 30 + 15) * Math.PI) / 180; // 宫位中心角度
      const palaceX = centerX + Math.cos(angle) * (radius - 25);
      const palaceY = centerY + Math.sin(angle) * (radius - 25);

      // 宫位名称
      svg += `<text x="${palaceX}" y="${palaceY - 20}" text-anchor="middle" font-size="12" font-weight="bold" fill="${colors.text}">${palace.name}</text>`;

      // 星曜
      const mainStars = palace.stars
        .filter((s) => s.type === "main")
        .slice(0, 3);
      mainStars.forEach((star, starIndex) => {
        const starY = palaceY + starIndex * 15;
        svg += `<text x="${palaceX}" y="${starY}" text-anchor="middle" font-size="10" fill="${colors.star}">${star.name}</text>`;
      });
    });

    svg += "</svg>";

    return svg;
  }

  /**
   * 添加基本信息
   */
  addBasicInfo(chart, colors, x, y) {
    let info = "";

    info += `<text x="${x}" y="${y}" font-size="14" fill="${colors.text}">姓名: ${chart.info?.name || "未知"}</text>`;
    info += `<text x="${x}" y="${y + 20}" font-size="14" fill="${colors.text}">性别: ${chart.info?.gender === "male" ? "男" : "女"}</text>`;
    info += `<text x="${x}" y="${y + 40}" font-size="14" fill="${colors.text}">出生: ${chart.info?.birthDate} ${chart.info?.birthTime}</text>`;
    info += `<text x="${x}" y="${y + 60}" font-size="14" fill="${colors.text}">农历: ${chart.info?.lunarDate}</text>`;

    info += `<text x="${x + 300}" y="${y}" font-size="14" fill="${colors.text}">命宫: ${chart.palaces.find((p) => p.id === chart.info?.destinyPalace)?.name || ""}</text>`;
    info += `<text x="${x + 300}" y="${y + 20}" font-size="14" fill="${colors.text}">身宫: ${chart.palaces.find((p) => p.id === chart.info?.bodyPalace)?.name || ""}</text>`;
    info += `<text x="${x + 300}" y="${y + 40}" font-size="14" fill="${colors.text}">年龄: ${chart.info?.age}岁</text>`;

    return info;
  }

  /**
   * 绘制宫位网格
   */
  drawPalaceGrid(chart, colors, includeElements, x, y, width, height) {
    let grid = "";

    const cellWidth = width / 4;
    const cellHeight = height / 3;

    // 宫位排列顺序
    const palaceOrder = [
      [3, 2, 1, 0], // 辰巳午未
      [4, -1, -1, 11], // 卯空空申
      [5, 6, 7, 8], // 寅丑子亥
    ];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const palaceIndex = palaceOrder[row][col];
        const cellX = x + col * cellWidth;
        const cellY = y + row * cellHeight;

        if (palaceIndex >= 0 && chart.palaces[palaceIndex]) {
          const palace = chart.palaces[palaceIndex];
          grid += this.drawPalaceCell(
            cellX,
            cellY,
            cellWidth,
            cellHeight,
            palace,
            colors,
            includeElements,
          );
        } else {
          // 中央空白区域
          grid += `<rect x="${cellX}" y="${cellY}" width="${cellWidth}" height="${cellHeight}" fill="${colors.center}" stroke="${colors.border}" stroke-width="1"/>`;
          if (row === 1 && col === 1) {
            grid += `<text x="${cellX + cellWidth / 2}" y="${cellY + cellHeight / 2}" text-anchor="middle" font-size="16" font-weight="bold" fill="${colors.text}">紫微斗数</text>`;
          }
        }
      }
    }

    return grid;
  }

  /**
   * 绘制单个宫位格子
   */
  drawPalaceCell(x, y, width, height, palace, colors, includeElements) {
    let cell = "";

    // 宫位背景 - 简化逻辑，不依赖chart引用
    const bgColor = colors.palace;

    cell += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${bgColor}" stroke="${colors.border}" stroke-width="1"/>`;

    // 宫位名称
    cell += `<text x="${x + 5}" y="${y + 15}" font-size="12" font-weight="bold" fill="${colors.text}">${palace.name}</text>`;

    // 地支
    if (includeElements.includes("earthly_branches")) {
      cell += `<text x="${x + width - 5}" y="${y + 15}" text-anchor="end" font-size="10" fill="${colors.branch}">${palace.earthlyBranch || ""}</text>`;
    }

    // 主星
    if (includeElements.includes("main_stars") && palace.stars) {
      const mainStars = palace.stars
        .filter((s) => s.type === "main")
        .slice(0, 4);
      mainStars.forEach((star, index) => {
        const starX = x + 5 + (index % 2) * (width / 2 - 10);
        const starY = y + 35 + Math.floor(index / 2) * 20;
        cell += `<text x="${starX}" y="${starY}" font-size="10" fill="${colors.star}">${star.name}</text>`;
      });
    }

    // 辅星
    if (includeElements.includes("auxiliary_stars") && palace.stars) {
      const auxStars = palace.stars
        .filter((s) => s.type === "auxiliary")
        .slice(0, 6);
      auxStars.forEach((star, index) => {
        const starX = x + 5 + (index % 3) * (width / 3 - 5);
        const starY = y + height - 40 + Math.floor(index / 3) * 15;
        cell += `<text x="${starX}" y="${starY}" font-size="8" fill="${colors.auxStar}">${star.name}</text>`;
      });
    }

    return cell;
  }

  /**
   * 绘制宫位扇形（轮盘式）
   */
  drawPalaceSector(
    centerX,
    centerY,
    radius,
    angle,
    palace,
    colors,
    includeElements,
  ) {
    let sector = "";

    const startAngle = angle - Math.PI / 12; // -15度
    const endAngle = angle + Math.PI / 12; // +15度

    // 计算扇形路径
    const x1 = centerX + Math.cos(startAngle) * radius;
    const y1 = centerY + Math.sin(startAngle) * radius;
    const x2 = centerX + Math.cos(endAngle) * radius;
    const y2 = centerY + Math.sin(endAngle) * radius;

    const largeArcFlag = 0; // 小于180度

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    sector += `<path d="${pathData}" fill="${colors.palace}" stroke="${colors.border}" stroke-width="1"/>`;

    // 宫位名称
    const textX = centerX + Math.cos(angle) * (radius * 0.8);
    const textY = centerY + Math.sin(angle) * (radius * 0.8);
    sector += `<text x="${textX}" y="${textY}" text-anchor="middle" font-size="12" font-weight="bold" fill="${colors.text}">${palace.name}</text>`;

    // 主星
    if (includeElements.includes("main_stars")) {
      const mainStars = palace.stars
        .filter((s) => s.type === "main")
        .slice(0, 2);
      mainStars.forEach((star, index) => {
        const starRadius = radius * (0.6 + index * 0.1);
        const starX = centerX + Math.cos(angle) * starRadius;
        const starY = centerY + Math.sin(angle) * starRadius;
        sector += `<text x="${starX}" y="${starY}" text-anchor="middle" font-size="10" fill="${colors.star}">${star.name}</text>`;
      });
    }

    return sector;
  }

  /**
   * 获取配色方案
   */
  getColorScheme(scheme) {
    const schemes = {
      traditional: {
        background: "#f8f8f8",
        border: "#333333",
        text: "#000000",
        palace: "#ffffff",
        destinyPalace: "#ffe6e6",
        center: "#f0f0f0",
        star: "#cc0000",
        auxStar: "#666666",
        branch: "#0066cc",
      },
      modern: {
        background: "#ffffff",
        border: "#cccccc",
        text: "#333333",
        palace: "#f9f9f9",
        destinyPalace: "#e6f3ff",
        center: "#f5f5f5",
        star: "#ff6600",
        auxStar: "#999999",
        branch: "#0099cc",
      },
      colorful: {
        background: "#fafafa",
        border: "#666666",
        text: "#333333",
        palace: "#fff9e6",
        destinyPalace: "#ffe6cc",
        center: "#f0f8ff",
        star: "#ff3366",
        auxStar: "#6699cc",
        branch: "#33cc66",
      },
      monochrome: {
        background: "#ffffff",
        border: "#000000",
        text: "#000000",
        palace: "#f8f8f8",
        destinyPalace: "#e8e8e8",
        center: "#f0f0f0",
        star: "#000000",
        auxStar: "#666666",
        branch: "#333333",
      },
    };

    return schemes[scheme] || schemes.traditional;
  }
}

module.exports = {
  ChartVisualizer,
};
