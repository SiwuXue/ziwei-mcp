/**
 * SVG增量更新管理器
 * 负责检测变化、生成差异补丁、应用增量更新
 */

class SVGIncrementalUpdater {
  constructor() {
    this.snapshots = new Map(); // 存储SVG快照
    this.patches = new Map(); // 存储补丁历史
    this.watchers = new Map(); // 数据监听器

    // 配置
    this.config = {
      enableDiffing: true,
      maxSnapshots: 50,
      maxPatches: 100,
      diffGranularity: "element", // 'element' | 'attribute' | 'text'
      enableOptimization: true,
    };

    // 性能统计
    this.stats = {
      totalUpdates: 0,
      incrementalUpdates: 0,
      fullRebuilds: 0,
      averageUpdateTime: 0,
      bytesTransferred: 0,
    };
  }

  /**
   * 创建SVG快照
   */
  createSnapshot(svgId, svgContent, metadata = {}) {
    const snapshot = {
      id: svgId,
      content: svgContent,
      metadata: metadata,
      timestamp: Date.now(),
      hash: this.generateHash(svgContent),
      structure: this.parseStructure(svgContent),
    };

    // 存储快照
    this.snapshots.set(svgId, snapshot);

    // 清理旧快照
    this.cleanupSnapshots();

    return snapshot;
  }

  /**
   * 检测变化并生成补丁
   */
  detectChanges(svgId, newData, oldData) {
    const startTime = performance.now();

    try {
      // 获取旧快照
      const oldSnapshot = this.snapshots.get(svgId);
      if (!oldSnapshot) {
        return {
          type: "full_rebuild",
          reason: "no_previous_snapshot",
          patch: null,
        };
      }

      // 比较数据
      const dataDiff = this.compareData(oldData, newData);

      if (dataDiff.changes.length === 0) {
        return {
          type: "no_change",
          reason: "data_identical",
          patch: null,
        };
      }

      // 生成增量补丁
      const patch = this.generatePatch(svgId, dataDiff, oldSnapshot);

      // 评估补丁效率
      const efficiency = this.evaluatePatchEfficiency(
        patch,
        oldSnapshot.content,
      );

      if (efficiency.shouldUseIncremental) {
        this.stats.incrementalUpdates++;
        return {
          type: "incremental",
          reason: "efficient_patch",
          patch: patch,
          efficiency: efficiency,
        };
      } else {
        this.stats.fullRebuilds++;
        return {
          type: "full_rebuild",
          reason: efficiency.reason,
          patch: null,
        };
      }
    } finally {
      const endTime = performance.now();
      this.updatePerformanceStats(endTime - startTime);
    }
  }

  /**
   * 比较数据
   */
  compareData(oldData, newData) {
    const changes = [];
    const visited = new Set();

    // 递归比较对象
    this.deepCompare(oldData, newData, "", changes, visited);

    return {
      changes: changes,
      summary: this.summarizeChanges(changes),
    };
  }

  /**
   * 深度比较
   */
  deepCompare(oldObj, newObj, path, changes, visited) {
    // 防止循环引用
    const objKey = `${path}:${typeof oldObj}:${typeof newObj}`;
    if (visited.has(objKey)) return;
    visited.add(objKey);

    // 类型变化
    if (typeof oldObj !== typeof newObj) {
      changes.push({
        type: "type_change",
        path: path,
        oldValue: oldObj,
        newValue: newObj,
        impact: this.assessImpact(path),
      });
      return;
    }

    // 基本类型比较
    if (typeof oldObj !== "object" || oldObj === null || newObj === null) {
      if (oldObj !== newObj) {
        changes.push({
          type: "value_change",
          path: path,
          oldValue: oldObj,
          newValue: newObj,
          impact: this.assessImpact(path),
        });
      }
      return;
    }

    // 数组比较
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      this.compareArrays(oldObj, newObj, path, changes, visited);
      return;
    }

    // 对象比较
    if (Array.isArray(oldObj) !== Array.isArray(newObj)) {
      changes.push({
        type: "structure_change",
        path: path,
        oldValue: oldObj,
        newValue: newObj,
        impact: "high",
      });
      return;
    }

    // 比较对象属性
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach((key) => {
      const newPath = path ? `${path}.${key}` : key;
      const oldValue = oldObj[key];
      const newValue = newObj[key];

      if (!(key in oldObj)) {
        changes.push({
          type: "property_added",
          path: newPath,
          newValue: newValue,
          impact: this.assessImpact(newPath),
        });
      } else if (!(key in newObj)) {
        changes.push({
          type: "property_removed",
          path: newPath,
          oldValue: oldValue,
          impact: this.assessImpact(newPath),
        });
      } else {
        this.deepCompare(oldValue, newValue, newPath, changes, visited);
      }
    });
  }

  /**
   * 比较数组
   */
  compareArrays(oldArray, newArray, path, changes, visited) {
    const maxLength = Math.max(oldArray.length, newArray.length);

    // 长度变化
    if (oldArray.length !== newArray.length) {
      changes.push({
        type: "array_length_change",
        path: path,
        oldLength: oldArray.length,
        newLength: newArray.length,
        impact: this.assessImpact(path),
      });
    }

    // 元素比较
    for (let i = 0; i < maxLength; i++) {
      const newPath = `${path}[${i}]`;

      if (i >= oldArray.length) {
        changes.push({
          type: "array_item_added",
          path: newPath,
          newValue: newArray[i],
          impact: this.assessImpact(newPath),
        });
      } else if (i >= newArray.length) {
        changes.push({
          type: "array_item_removed",
          path: newPath,
          oldValue: oldArray[i],
          impact: this.assessImpact(newPath),
        });
      } else {
        this.deepCompare(oldArray[i], newArray[i], newPath, changes, visited);
      }
    }
  }

  /**
   * 评估变化影响
   */
  assessImpact(path) {
    // 高影响路径
    const highImpactPaths = [
      "structure",
      "width",
      "height",
      "viewBox",
      "theme.background",
      "theme.borderColor",
    ];

    // 中等影响路径
    const mediumImpactPaths = ["palaces", "stars", "theme"];

    // 检查高影响
    if (highImpactPaths.some((p) => path.startsWith(p))) {
      return "high";
    }

    // 检查中等影响
    if (mediumImpactPaths.some((p) => path.startsWith(p))) {
      return "medium";
    }

    return "low";
  }

  /**
   * 总结变化
   */
  summarizeChanges(changes) {
    const summary = {
      total: changes.length,
      byType: {},
      byImpact: { high: 0, medium: 0, low: 0 },
      affectedPaths: new Set(),
    };

    changes.forEach((change) => {
      // 按类型统计
      summary.byType[change.type] = (summary.byType[change.type] || 0) + 1;

      // 按影响统计
      summary.byImpact[change.impact]++;

      // 受影响路径
      summary.affectedPaths.add(change.path.split(".")[0]);
    });

    summary.affectedPaths = Array.from(summary.affectedPaths);

    return summary;
  }

  /**
   * 生成补丁
   */
  generatePatch(svgId, dataDiff, oldSnapshot) {
    const patch = {
      id: this.generatePatchId(),
      svgId: svgId,
      timestamp: Date.now(),
      changes: dataDiff.changes,
      operations: [],
      metadata: {
        changeCount: dataDiff.changes.length,
        summary: dataDiff.summary,
      },
    };

    // 根据变化生成操作
    dataDiff.changes.forEach((change) => {
      const operations = this.generateOperationsForChange(change, oldSnapshot);
      patch.operations.push(...operations);
    });

    // 优化操作
    if (this.config.enableOptimization) {
      patch.operations = this.optimizeOperations(patch.operations);
    }

    // 存储补丁
    this.patches.set(patch.id, patch);
    this.cleanupPatches();

    return patch;
  }

  /**
   * 为变化生成操作
   */
  generateOperationsForChange(change, oldSnapshot) {
    const operations = [];

    switch (change.type) {
      case "value_change":
        operations.push(
          ...this.generateValueChangeOperations(change, oldSnapshot),
        );
        break;

      case "property_added":
        operations.push(
          ...this.generatePropertyAddOperations(change, oldSnapshot),
        );
        break;

      case "property_removed":
        operations.push(
          ...this.generatePropertyRemoveOperations(change, oldSnapshot),
        );
        break;

      case "array_item_added":
        operations.push(
          ...this.generateArrayAddOperations(change, oldSnapshot),
        );
        break;

      case "array_item_removed":
        operations.push(
          ...this.generateArrayRemoveOperations(change, oldSnapshot),
        );
        break;

      case "structure_change":
        operations.push(
          ...this.generateStructureChangeOperations(change, oldSnapshot),
        );
        break;
    }

    return operations;
  }

  /**
   * 生成值变化操作
   */
  generateValueChangeOperations(change, oldSnapshot) {
    const operations = [];

    // 根据路径确定SVG元素和属性
    const mapping = this.mapPathToSVGElement(change.path, oldSnapshot);

    if (mapping) {
      operations.push({
        type: "update_attribute",
        selector: mapping.selector,
        attribute: mapping.attribute,
        oldValue: change.oldValue,
        newValue: change.newValue,
        priority: this.getOperationPriority(change.impact),
      });
    }

    return operations;
  }

  /**
   * 生成属性添加操作
   */
  generatePropertyAddOperations(change, oldSnapshot) {
    const operations = [];
    const mapping = this.mapPathToSVGElement(change.path, oldSnapshot);

    if (mapping) {
      operations.push({
        type: "add_attribute",
        selector: mapping.selector,
        attribute: mapping.attribute,
        value: change.newValue,
        priority: this.getOperationPriority(change.impact),
      });
    }

    return operations;
  }

  /**
   * 生成属性移除操作
   */
  generatePropertyRemoveOperations(change, oldSnapshot) {
    const operations = [];
    const mapping = this.mapPathToSVGElement(change.path, oldSnapshot);

    if (mapping) {
      operations.push({
        type: "remove_attribute",
        selector: mapping.selector,
        attribute: mapping.attribute,
        priority: this.getOperationPriority(change.impact),
      });
    }

    return operations;
  }

  /**
   * 生成数组添加操作
   */
  generateArrayAddOperations(change, oldSnapshot) {
    const operations = [];

    // 如果是星曜数组变化
    if (change.path.includes("stars")) {
      operations.push({
        type: "add_element",
        parentSelector: this.getParentSelector(change.path, oldSnapshot),
        element: this.generateStarElement(change.newValue),
        position: this.extractArrayIndex(change.path),
        priority: this.getOperationPriority(change.impact),
      });
    }

    return operations;
  }

  /**
   * 生成数组移除操作
   */
  generateArrayRemoveOperations(change, oldSnapshot) {
    const operations = [];

    operations.push({
      type: "remove_element",
      selector: this.mapPathToElementSelector(change.path, oldSnapshot),
      priority: this.getOperationPriority(change.impact),
    });

    return operations;
  }

  /**
   * 生成结构变化操作
   */
  generateStructureChangeOperations(change, oldSnapshot) {
    // 结构变化通常需要重建
    return [
      {
        type: "rebuild_section",
        section: this.identifySection(change.path),
        priority: 1, // 最高优先级
      },
    ];
  }

  /**
   * 映射路径到SVG元素
   */
  mapPathToSVGElement(path, oldSnapshot) {
    // 路径映射规则
    const mappingRules = {
      width: { selector: "svg", attribute: "width" },
      height: { selector: "svg", attribute: "height" },
      viewBox: { selector: "svg", attribute: "viewBox" },
      "theme.background": { selector: ".chart-background", attribute: "fill" },
      "theme.borderColor": { selector: ".palace-divider", attribute: "stroke" },
      "theme.textColor": { selector: ".palace-name", attribute: "fill" },
    };

    // 直接匹配
    if (mappingRules[path]) {
      return mappingRules[path];
    }

    // 模式匹配
    for (const [pattern, mapping] of Object.entries(mappingRules)) {
      if (path.startsWith(pattern)) {
        return {
          selector: mapping.selector,
          attribute: mapping.attribute,
        };
      }
    }

    // 动态映射
    return this.dynamicPathMapping(path, oldSnapshot);
  }

  /**
   * 动态路径映射
   */
  dynamicPathMapping(path, oldSnapshot) {
    // 宫位相关
    const palaceMatch = path.match(/palaces\[(\d+)\]\.(.+)/);
    if (palaceMatch) {
      const palaceIndex = palaceMatch[1];
      const property = palaceMatch[2];

      return {
        selector: `.palace-${palaceIndex}`,
        attribute: this.mapPropertyToAttribute(property),
      };
    }

    // 星曜相关
    const starMatch = path.match(/palaces\[(\d+)\]\.stars\[(\d+)\]\.(.+)/);
    if (starMatch) {
      const palaceIndex = starMatch[1];
      const starIndex = starMatch[2];
      const property = starMatch[3];

      return {
        selector: `.palace-${palaceIndex} .star:nth-child(${parseInt(starIndex) + 1})`,
        attribute: this.mapPropertyToAttribute(property),
      };
    }

    return null;
  }

  /**
   * 映射属性到SVG属性
   */
  mapPropertyToAttribute(property) {
    const mapping = {
      name: "textContent",
      color: "fill",
      backgroundColor: "fill",
      borderColor: "stroke",
      fontSize: "font-size",
      x: "x",
      y: "y",
      width: "width",
      height: "height",
    };

    return mapping[property] || property;
  }

  /**
   * 优化操作
   */
  optimizeOperations(operations) {
    // 按优先级排序
    operations.sort((a, b) => a.priority - b.priority);

    // 合并相同元素的操作
    const merged = this.mergeOperations(operations);

    // 移除冗余操作
    const deduplicated = this.deduplicateOperations(merged);

    return deduplicated;
  }

  /**
   * 合并操作
   */
  mergeOperations(operations) {
    const grouped = new Map();

    operations.forEach((op) => {
      const key = `${op.selector}:${op.type}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(op);
    });

    const merged = [];
    grouped.forEach((ops) => {
      if (ops.length === 1) {
        merged.push(ops[0]);
      } else {
        // 合并多个操作
        merged.push(this.combineOperations(ops));
      }
    });

    return merged;
  }

  /**
   * 组合操作
   */
  combineOperations(operations) {
    const first = operations[0];

    if (first.type === "update_attribute") {
      // 合并属性更新
      const attributes = {};
      operations.forEach((op) => {
        attributes[op.attribute] = op.newValue;
      });

      return {
        type: "update_attributes",
        selector: first.selector,
        attributes: attributes,
        priority: Math.min(...operations.map((op) => op.priority)),
      };
    }

    return first;
  }

  /**
   * 去重操作
   */
  deduplicateOperations(operations) {
    const seen = new Set();
    return operations.filter((op) => {
      const key = this.getOperationKey(op);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * 获取操作键
   */
  getOperationKey(operation) {
    return `${operation.type}:${operation.selector}:${JSON.stringify(operation.attributes || operation.attribute)}`;
  }

  /**
   * 评估补丁效率
   */
  evaluatePatchEfficiency(patch, originalContent) {
    const originalSize = originalContent.length;
    const patchSize = this.estimatePatchSize(patch);
    const operationCount = patch.operations.length;

    // 效率指标
    const sizeRatio = patchSize / originalSize;
    const complexityScore = this.calculateComplexityScore(patch);

    // 决策逻辑
    const shouldUseIncremental =
      sizeRatio < 0.3 && // 补丁大小小于原内容30%
      operationCount < 20 && // 操作数量少于20个
      complexityScore < 0.7; // 复杂度分数低于0.7

    return {
      shouldUseIncremental: shouldUseIncremental,
      sizeRatio: sizeRatio,
      operationCount: operationCount,
      complexityScore: complexityScore,
      reason: shouldUseIncremental ? "efficient" : "too_complex",
    };
  }

  /**
   * 估算补丁大小
   */
  estimatePatchSize(patch) {
    let size = 0;

    patch.operations.forEach((op) => {
      switch (op.type) {
        case "update_attribute":
          size += 50; // 估算属性更新大小
          break;
        case "add_element":
          size += op.element ? op.element.length : 200; // 估算元素大小
          break;
        case "remove_element":
          size += 20; // 移除操作很小
          break;
        case "rebuild_section":
          size += 1000; // 重建操作较大
          break;
        default:
          size += 100;
      }
    });

    return size;
  }

  /**
   * 计算复杂度分数
   */
  calculateComplexityScore(patch) {
    let score = 0;
    const weights = {
      update_attribute: 0.1,
      add_element: 0.3,
      remove_element: 0.2,
      rebuild_section: 1.0,
    };

    patch.operations.forEach((op) => {
      score += weights[op.type] || 0.5;
    });

    return Math.min(score / patch.operations.length, 1.0);
  }

  /**
   * 应用补丁
   */
  applyPatch(svgElement, patch) {
    const startTime = performance.now();

    try {
      patch.operations.forEach((operation) => {
        this.executeOperation(svgElement, operation);
      });

      return {
        success: true,
        operationsApplied: patch.operations.length,
        duration: performance.now() - startTime,
      };
    } catch (error) {
      console.error("补丁应用失败:", error);
      return {
        success: false,
        error: error.message,
        duration: performance.now() - startTime,
      };
    }
  }

  /**
   * 执行操作
   */
  executeOperation(svgElement, operation) {
    const elements = svgElement.querySelectorAll(operation.selector);

    elements.forEach((element) => {
      switch (operation.type) {
        case "update_attribute":
          this.updateAttribute(
            element,
            operation.attribute,
            operation.newValue,
          );
          break;

        case "update_attributes":
          Object.entries(operation.attributes).forEach(([attr, value]) => {
            this.updateAttribute(element, attr, value);
          });
          break;

        case "add_attribute":
          this.updateAttribute(element, operation.attribute, operation.value);
          break;

        case "remove_attribute":
          element.removeAttribute(operation.attribute);
          break;

        case "add_element":
          this.addElement(element, operation.element, operation.position);
          break;

        case "remove_element":
          element.remove();
          break;
      }
    });
  }

  /**
   * 更新属性
   */
  updateAttribute(element, attribute, value) {
    if (attribute === "textContent") {
      element.textContent = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }

  /**
   * 添加元素
   */
  addElement(parentElement, elementHTML, position) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = elementHTML;
    const newElement = tempDiv.firstElementChild;

    if (position !== undefined && position < parentElement.children.length) {
      parentElement.insertBefore(newElement, parentElement.children[position]);
    } else {
      parentElement.appendChild(newElement);
    }
  }

  /**
   * 解析SVG结构
   */
  parseStructure(svgContent) {
    // 简化的结构解析
    return {
      elementCount: (svgContent.match(/<[^/][^>]*>/g) || []).length,
      hasAnimations: svgContent.includes("<animate"),
      hasGradients: svgContent.includes("<gradient"),
      hasFilters: svgContent.includes("<filter"),
    };
  }

  /**
   * 生成哈希
   */
  generateHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * 生成补丁ID
   */
  generatePatchId() {
    return `patch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取操作优先级
   */
  getOperationPriority(impact) {
    const priorities = {
      high: 1,
      medium: 2,
      low: 3,
    };
    return priorities[impact] || 2;
  }

  /**
   * 更新性能统计
   */
  updatePerformanceStats(duration) {
    this.stats.totalUpdates++;
    this.stats.averageUpdateTime =
      (this.stats.averageUpdateTime * (this.stats.totalUpdates - 1) +
        duration) /
      this.stats.totalUpdates;
  }

  /**
   * 清理快照
   */
  cleanupSnapshots() {
    if (this.snapshots.size > this.config.maxSnapshots) {
      const entries = Array.from(this.snapshots.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );

      const toDelete = entries.slice(
        0,
        entries.length - this.config.maxSnapshots,
      );
      toDelete.forEach(([id]) => this.snapshots.delete(id));
    }
  }

  /**
   * 清理补丁
   */
  cleanupPatches() {
    if (this.patches.size > this.config.maxPatches) {
      const entries = Array.from(this.patches.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );

      const toDelete = entries.slice(
        0,
        entries.length - this.config.maxPatches,
      );
      toDelete.forEach(([id]) => this.patches.delete(id));
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      snapshotCount: this.snapshots.size,
      patchCount: this.patches.size,
      incrementalRatio:
        this.stats.totalUpdates > 0
          ? this.stats.incrementalUpdates / this.stats.totalUpdates
          : 0,
    };
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      totalUpdates: 0,
      incrementalUpdates: 0,
      fullRebuilds: 0,
      averageUpdateTime: 0,
      bytesTransferred: 0,
    };
  }
}

module.exports = {
  SVGIncrementalUpdater,
};
