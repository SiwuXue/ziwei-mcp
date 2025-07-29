// data-persistence.js - 紫微斗数数据持久化核心模块

const sqlite3 = require("sqlite3").verbose();
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

/**
 * 数据持久化管理器
 * 支持SQLite和MongoDB，提供统一的API接口
 */
class DataPersistenceManager {
  constructor(config = {}) {
    this.config = {
      type: config.type || "sqlite", // 'sqlite' | 'mongodb' | 'hybrid'
      sqlite: {
        path: config.sqlite?.path || "./data/ziwei.db",
        enableWAL: config.sqlite?.enableWAL || true,
      },
      mongodb: {
        connectionString:
          config.mongodb?.connectionString || "mongodb://localhost:27017/ziwei",
        options: config.mongodb?.options || {
          useUnifiedTopology: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
        },
      },
      cache: {
        enabled: config.cache?.enabled || true,
        maxSize: config.cache?.maxSize || 100,
        ttl: config.cache?.ttl || 300000, // 5分钟
      },
      encryption: {
        enabled: config.encryption?.enabled || false,
        key: config.encryption?.key || null,
      },
      sync: {
        enabled: config.sync?.enabled || false,
        interval: config.sync?.interval || 300000, // 5分钟
      },
    };

    this.storage = null;
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.isInitialized = false;
    this.syncTimer = null;
  }

  /**
   * 初始化数据持久化系统
   */
  async initialize() {
    try {
      switch (this.config.type) {
        case "sqlite":
          this.storage = new SQLiteStorage(this.config.sqlite);
          break;
        case "mongodb":
          this.storage = new MongoDBStorage(this.config.mongodb);
          break;
        case "hybrid":
          this.storage = new HybridStorage(this.config);
          break;
        default:
          throw new Error(`不支持的存储类型: ${this.config.type}`);
      }

      await this.storage.initialize();
      this.isInitialized = true;

      // 启动缓存清理定时器
      if (this.config.cache.enabled) {
        this.startCacheCleanup();
      }

      // 启动同步定时器（仅混合模式）
      if (this.config.type === "hybrid" && this.config.sync.enabled) {
        this.startSyncTimer();
      }

      console.log(`数据持久化系统已初始化 (${this.config.type})`);
    } catch (error) {
      console.error("数据持久化系统初始化失败:", error);
      throw error;
    }
  }

  /**
   * 保存命盘数据
   */
  async saveChart(chartData) {
    this.ensureInitialized();

    try {
      // 数据验证
      this.validateChartData(chartData);

      // 添加元数据
      const enrichedData = {
        ...chartData,
        id: chartData.id || this.generateId(),
        metadata: {
          ...chartData.metadata,
          savedAt: new Date().toISOString(),
          version: chartData.metadata?.version || "2.0.0",
        },
      };

      // 数据加密（如果启用）
      const dataToSave = this.config.encryption.enabled
        ? this.encryptSensitiveData(enrichedData)
        : enrichedData;

      // 保存到存储
      const result = await this.storage.saveChart(dataToSave);

      // 更新缓存
      if (this.config.cache.enabled) {
        this.updateCache(enrichedData.id, enrichedData);
      }

      return {
        success: true,
        chartId: enrichedData.id,
        savedAt: enrichedData.metadata.savedAt,
      };
    } catch (error) {
      console.error("保存命盘失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取命盘数据
   */
  async getChart(chartId, userId = null) {
    this.ensureInitialized();

    try {
      // 先检查缓存
      if (this.config.cache.enabled) {
        const cached = this.getFromCache(chartId);
        if (cached) {
          // 权限检查
          if (userId && cached.userId !== userId) {
            throw new Error("无权访问此命盘");
          }
          return cached;
        }
      }

      // 从存储获取
      const chart = await this.storage.getChart(chartId);

      if (!chart) {
        return null;
      }

      // 权限检查
      if (userId && chart.userId !== userId) {
        throw new Error("无权访问此命盘");
      }

      // 数据解密（如果需要）
      const decryptedChart = this.config.encryption.enabled
        ? this.decryptSensitiveData(chart)
        : chart;

      // 更新缓存
      if (this.config.cache.enabled) {
        this.updateCache(chartId, decryptedChart);
      }

      return decryptedChart;
    } catch (error) {
      console.error("获取命盘失败:", error);
      throw error;
    }
  }

  /**
   * 获取用户的所有命盘
   */
  async getUserCharts(userId, options = {}) {
    this.ensureInitialized();

    const {
      limit = 50,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      includeAnalysis = false,
    } = options;

    try {
      const charts = await this.storage.getUserCharts(userId, {
        limit,
        offset,
        sortBy,
        sortOrder,
        includeAnalysis,
      });

      return charts.map((chart) => {
        // 解密敏感数据
        const decrypted = this.config.encryption.enabled
          ? this.decryptSensitiveData(chart)
          : chart;

        // 如果不包含分析，移除分析数据以减少传输量
        if (!includeAnalysis && decrypted.analysis) {
          const { analysis, ...chartWithoutAnalysis } = decrypted;
          return chartWithoutAnalysis;
        }

        return decrypted;
      });
    } catch (error) {
      console.error("获取用户命盘失败:", error);
      throw error;
    }
  }

  /**
   * 搜索命盘
   */
  async searchCharts(query, userId = null) {
    this.ensureInitialized();

    try {
      const searchQuery = {
        ...query,
        userId: userId, // 限制搜索范围到特定用户
      };

      const results = await this.storage.searchCharts(searchQuery);

      return results.map((chart) =>
        this.config.encryption.enabled
          ? this.decryptSensitiveData(chart)
          : chart,
      );
    } catch (error) {
      console.error("搜索命盘失败:", error);
      throw error;
    }
  }

  /**
   * 删除命盘
   */
  async deleteChart(chartId, userId) {
    this.ensureInitialized();

    try {
      // 先验证权限
      const chart = await this.getChart(chartId, userId);
      if (!chart) {
        throw new Error("命盘不存在或无权访问");
      }

      // 从存储删除
      await this.storage.deleteChart(chartId);

      // 从缓存删除
      if (this.config.cache.enabled) {
        this.cache.delete(chartId);
        this.cacheTimestamps.delete(chartId);
      }

      return { success: true };
    } catch (error) {
      console.error("删除命盘失败:", error);
      throw error;
    }
  }

  /**
   * 获取统计信息
   */
  async getStatistics(userId = null) {
    this.ensureInitialized();

    try {
      return await this.storage.getStatistics(userId);
    } catch (error) {
      console.error("获取统计信息失败:", error);
      throw error;
    }
  }

  /**
   * 备份数据
   */
  async backup(backupPath) {
    this.ensureInitialized();

    try {
      if (this.storage.backup) {
        return await this.storage.backup(backupPath);
      } else {
        throw new Error("当前存储类型不支持备份功能");
      }
    } catch (error) {
      console.error("备份失败:", error);
      throw error;
    }
  }

  /**
   * 恢复数据
   */
  async restore(backupPath) {
    this.ensureInitialized();

    try {
      if (this.storage.restore) {
        // 清空缓存
        this.clearCache();
        return await this.storage.restore(backupPath);
      } else {
        throw new Error("当前存储类型不支持恢复功能");
      }
    } catch (error) {
      console.error("恢复失败:", error);
      throw error;
    }
  }

  /**
   * 关闭连接
   */
  async close() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    if (this.storage && this.storage.close) {
      await this.storage.close();
    }

    this.clearCache();
    this.isInitialized = false;
  }

  // 私有方法

  ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error("数据持久化系统未初始化");
    }
  }

  validateChartData(chartData) {
    if (!chartData) {
      throw new Error("命盘数据不能为空");
    }

    if (!chartData.userId) {
      throw new Error("用户ID不能为空");
    }

    if (!chartData.birthInfo) {
      throw new Error("出生信息不能为空");
    }

    const { year, month, day, hour } = chartData.birthInfo;
    if (!year || !month || !day || hour === undefined) {
      throw new Error("出生信息不完整");
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      throw new Error("出生年份无效");
    }

    if (month < 1 || month > 12) {
      throw new Error("出生月份无效");
    }

    if (day < 1 || day > 31) {
      throw new Error("出生日期无效");
    }

    if (hour < 0 || hour > 23) {
      throw new Error("出生时辰无效");
    }
  }

  generateId() {
    return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  encryptSensitiveData(data) {
    if (!this.config.encryption.enabled || !this.config.encryption.key) {
      return data;
    }

    const sensitiveFields = ["birthInfo", "analysis"];
    const encrypted = { ...data };

    sensitiveFields.forEach((field) => {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(JSON.stringify(encrypted[field]));
      }
    });

    return encrypted;
  }

  decryptSensitiveData(data) {
    if (!this.config.encryption.enabled || !this.config.encryption.key) {
      return data;
    }

    const sensitiveFields = ["birthInfo", "analysis"];
    const decrypted = { ...data };

    sensitiveFields.forEach((field) => {
      if (decrypted[field] && typeof decrypted[field] === "string") {
        try {
          decrypted[field] = JSON.parse(this.decrypt(decrypted[field]));
        } catch (error) {
          console.warn(`解密字段 ${field} 失败:`, error.message);
        }
      }
    });

    return decrypted;
  }

  encrypt(text) {
    const cipher = crypto.createCipher(
      "aes-256-cbc",
      this.config.encryption.key,
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(encryptedText) {
    const decipher = crypto.createDecipher(
      "aes-256-cbc",
      this.config.encryption.key,
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  updateCache(key, value) {
    if (!this.config.cache.enabled) return;

    // LRU缓存实现
    if (this.cache.size >= this.config.cache.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.cacheTimestamps.delete(oldestKey);
    }

    this.cache.set(key, value);
    this.cacheTimestamps.set(key, Date.now());
  }

  getFromCache(key) {
    if (!this.config.cache.enabled) return null;

    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return null;

    // 检查TTL
    if (Date.now() - timestamp > this.config.cache.ttl) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  startCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      const expiredKeys = [];

      for (const [key, timestamp] of this.cacheTimestamps.entries()) {
        if (now - timestamp > this.config.cache.ttl) {
          expiredKeys.push(key);
        }
      }

      expiredKeys.forEach((key) => {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      });

      if (expiredKeys.length > 0) {
        console.log(`清理了 ${expiredKeys.length} 个过期缓存项`);
      }
    }, this.config.cache.ttl / 2); // 每半个TTL周期清理一次
  }

  startSyncTimer() {
    this.syncTimer = setInterval(async () => {
      try {
        if (this.storage.syncToCloud) {
          await this.storage.syncToCloud();
          console.log("数据同步完成");
        }
      } catch (error) {
        console.warn("数据同步失败:", error.message);
      }
    }, this.config.sync.interval);
  }
}

/**
 * SQLite存储实现
 */
class SQLiteStorage {
  constructor(config) {
    this.config = config;
    this.db = null;
  }

  async initialize() {
    // 确保数据目录存在
    const dir = path.dirname(this.config.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new sqlite3.Database(this.config.path);

    // 启用WAL模式提升并发性能
    if (this.config.enableWAL) {
      await this.run("PRAGMA journal_mode=WAL");
    }

    await this.createTables();
    await this.createIndexes();
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS charts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        birth_info TEXT NOT NULL,
        chart_data TEXT NOT NULL,
        analysis TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS chart_stars (
        chart_id TEXT NOT NULL,
        star_name TEXT NOT NULL,
        palace TEXT NOT NULL,
        brightness TEXT,
        sihua TEXT,
        PRIMARY KEY (chart_id, star_name),
        FOREIGN KEY (chart_id) REFERENCES charts(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS chart_patterns (
        chart_id TEXT NOT NULL,
        pattern_name TEXT NOT NULL,
        pattern_type TEXT NOT NULL,
        strength TEXT,
        PRIMARY KEY (chart_id, pattern_name),
        FOREIGN KEY (chart_id) REFERENCES charts(id) ON DELETE CASCADE
      )`,
    ];

    for (const sql of tables) {
      await this.run(sql);
    }
  }

  async createIndexes() {
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_chart_stars_star_name ON chart_stars(star_name)",
      "CREATE INDEX IF NOT EXISTS idx_chart_patterns_pattern_name ON chart_patterns(pattern_name)",
    ];

    for (const sql of indexes) {
      await this.run(sql);
    }
  }

  async saveChart(chartData) {
    const sql = `
      INSERT OR REPLACE INTO charts 
      (id, user_id, birth_info, chart_data, analysis, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await this.run(sql, [
      chartData.id,
      chartData.userId,
      JSON.stringify(chartData.birthInfo),
      JSON.stringify(chartData),
      JSON.stringify(chartData.analysis || {}),
    ]);

    // 保存星曜索引
    if (chartData.stars) {
      await this.saveStarIndexes(chartData.id, chartData.stars);
    }

    // 保存格局索引
    if (chartData.patterns) {
      await this.savePatternIndexes(chartData.id, chartData.patterns);
    }

    return { success: true };
  }

  async saveStarIndexes(chartId, stars) {
    // 先删除旧的索引
    await this.run("DELETE FROM chart_stars WHERE chart_id = ?", [chartId]);

    // 插入新的索引
    const stmt = await this.prepare(
      "INSERT INTO chart_stars (chart_id, star_name, palace, brightness, sihua) VALUES (?, ?, ?, ?, ?)",
    );

    for (const [starName, starData] of Object.entries(stars)) {
      await stmt.run([
        chartId,
        starName,
        starData.palace,
        starData.brightness,
        starData.sihua,
      ]);
    }

    await stmt.finalize();
  }

  async savePatternIndexes(chartId, patterns) {
    // 先删除旧的索引
    await this.run("DELETE FROM chart_patterns WHERE chart_id = ?", [chartId]);

    // 插入新的索引
    const stmt = await this.prepare(
      "INSERT INTO chart_patterns (chart_id, pattern_name, pattern_type, strength) VALUES (?, ?, ?, ?)",
    );

    for (const pattern of patterns) {
      await stmt.run([chartId, pattern.name, pattern.type, pattern.strength]);
    }

    await stmt.finalize();
  }

  async getChart(chartId) {
    const sql = "SELECT * FROM charts WHERE id = ?";
    const row = await this.get(sql, [chartId]);

    if (row) {
      const chartData = JSON.parse(row.chart_data);
      return {
        ...chartData,
        metadata: {
          ...chartData.metadata,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      };
    }
    return null;
  }

  async getUserCharts(userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "desc",
      includeAnalysis = false,
    } = options;

    const fields = includeAnalysis
      ? "id, birth_info, chart_data, analysis, created_at, updated_at"
      : "id, birth_info, created_at, updated_at";

    const sql = `
      SELECT ${fields}
      FROM charts 
      WHERE user_id = ? 
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()} 
      LIMIT ? OFFSET ?
    `;

    const rows = await this.all(sql, [userId, limit, offset]);

    return rows.map((row) => {
      const result = {
        id: row.id,
        birthInfo: JSON.parse(row.birth_info),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      if (includeAnalysis && row.chart_data) {
        const chartData = JSON.parse(row.chart_data);
        result.analysis = chartData.analysis;
        result.palaces = chartData.palaces;
        result.stars = chartData.stars;
        result.patterns = chartData.patterns;
      }

      return result;
    });
  }

  async searchCharts(query) {
    let sql = "SELECT DISTINCT c.* FROM charts c";
    const params = [];
    const conditions = [];

    // 按用户搜索
    if (query.userId) {
      conditions.push("c.user_id = ?");
      params.push(query.userId);
    }

    // 按星曜搜索
    if (query.stars && query.stars.length > 0) {
      sql += " JOIN chart_stars cs ON c.id = cs.chart_id";
      conditions.push(
        `cs.star_name IN (${query.stars.map(() => "?").join(",")})`,
      );
      params.push(...query.stars);
    }

    // 按格局搜索
    if (query.patterns && query.patterns.length > 0) {
      sql += " JOIN chart_patterns cp ON c.id = cp.chart_id";
      conditions.push(
        `cp.pattern_name IN (${query.patterns.map(() => "?").join(",")})`,
      );
      params.push(...query.patterns);
    }

    // 按年份范围搜索
    if (query.yearRange) {
      conditions.push('json_extract(c.birth_info, "$.year") BETWEEN ? AND ?');
      params.push(query.yearRange.start, query.yearRange.end);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY c.created_at DESC LIMIT 100";

    const rows = await this.all(sql, params);
    return rows.map((row) => JSON.parse(row.chart_data));
  }

  async deleteChart(chartId) {
    await this.run("DELETE FROM charts WHERE id = ?", [chartId]);
    // 由于外键约束，相关的星曜和格局索引会自动删除
  }

  async getStatistics(userId = null) {
    let sql = "SELECT COUNT(*) as total FROM charts";
    const params = [];

    if (userId) {
      sql += " WHERE user_id = ?";
      params.push(userId);
    }

    const totalResult = await this.get(sql, params);

    // 获取性别分布
    let genderSql = `
      SELECT 
        json_extract(birth_info, '$.gender') as gender,
        COUNT(*) as count
      FROM charts
    `;

    if (userId) {
      genderSql += " WHERE user_id = ?";
    }

    genderSql += ' GROUP BY json_extract(birth_info, "$.gender")';

    const genderResult = await this.all(genderSql, params);

    return {
      totalCharts: totalResult.total,
      genderDistribution: genderResult.reduce((acc, row) => {
        acc[row.gender] = row.count;
        return acc;
      }, {}),
    };
  }

  async backup(backupPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(this.config.path);
      const writeStream = fs.createWriteStream(backupPath);

      readStream.pipe(writeStream);

      writeStream.on("finish", () => {
        resolve({ success: true, backupPath });
      });

      writeStream.on("error", reject);
      readStream.on("error", reject);
    });
  }

  async restore(backupPath) {
    if (!fs.existsSync(backupPath)) {
      throw new Error("备份文件不存在");
    }

    // 关闭当前数据库连接
    if (this.db) {
      await this.close();
    }

    // 复制备份文件
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(backupPath);
      const writeStream = fs.createWriteStream(this.config.path);

      readStream.pipe(writeStream);

      writeStream.on("finish", async () => {
        // 重新初始化数据库
        await this.initialize();
        resolve({ success: true });
      });

      writeStream.on("error", reject);
      readStream.on("error", reject);
    });
  }

  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close((err) => {
          if (err) console.error("关闭数据库时出错:", err);
          resolve();
        });
      });
    }
  }

  // 辅助方法
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  prepare(sql) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(sql, (err) => {
        if (err) reject(err);
        else
          resolve({
            run: (params) =>
              new Promise((res, rej) => {
                stmt.run(params, function (err) {
                  if (err) rej(err);
                  else res({ id: this.lastID, changes: this.changes });
                });
              }),
            finalize: () =>
              new Promise((res, rej) => {
                stmt.finalize((err) => {
                  if (err) rej(err);
                  else res();
                });
              }),
          });
      });
    });
  }
}

/**
 * MongoDB存储实现
 */
class MongoDBStorage {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.db = null;
  }

  async initialize() {
    this.client = new MongoClient(
      this.config.connectionString,
      this.config.options,
    );
    await this.client.connect();
    this.db = this.client.db();
    await this.createIndexes();
  }

  async createIndexes() {
    const charts = this.db.collection("charts");

    await charts.createIndex({ userId: 1, "metadata.createdAt": -1 });
    await charts.createIndex({ "birthInfo.year": 1, "birthInfo.month": 1 });
    await charts.createIndex({ "patterns.name": 1 });
    await charts.createIndex({ chartId: 1 }, { unique: true });

    // 为星曜创建复合索引
    const starFields = [
      "ming",
      "xiong",
      "cai",
      "guan",
      "qian",
      "ji",
      "pu",
      "fu",
      "zi",
      "tian",
      "fu",
      "shen",
    ];
    for (const field of starFields) {
      await charts.createIndex({ [`palaces.${field}.stars`]: 1 });
    }
  }

  async saveChart(chartData) {
    const charts = this.db.collection("charts");

    const document = {
      ...chartData,
      _id: new ObjectId(),
      metadata: {
        ...chartData.metadata,
        updatedAt: new Date(),
      },
    };

    const result = await charts.replaceOne({ id: chartData.id }, document, {
      upsert: true,
    });

    return { success: true, result };
  }

  async getChart(chartId) {
    const charts = this.db.collection("charts");
    return await charts.findOne({ id: chartId });
  }

  async getUserCharts(userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      sortBy = "metadata.createdAt",
      sortOrder = "desc",
      includeAnalysis = false,
    } = options;

    const charts = this.db.collection("charts");

    const projection = includeAnalysis
      ? {}
      : {
          id: 1,
          userId: 1,
          birthInfo: 1,
          "metadata.createdAt": 1,
          "metadata.updatedAt": 1,
        };

    return await charts
      .find({ userId })
      .project(projection)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit)
      .skip(offset)
      .toArray();
  }

  async searchCharts(query) {
    const charts = this.db.collection("charts");
    const pipeline = [];

    // 基础匹配条件
    const matchConditions = {};

    if (query.userId) {
      matchConditions.userId = query.userId;
    }

    // 按星曜搜索
    if (query.stars && query.stars.length > 0) {
      const starConditions = [];
      const palaces = [
        "ming",
        "xiong",
        "cai",
        "guan",
        "qian",
        "ji",
        "pu",
        "fu",
        "zi",
        "tian",
        "fu",
        "shen",
      ];

      for (const palace of palaces) {
        starConditions.push({
          [`palaces.${palace}.stars`]: { $in: query.stars },
        });
      }

      matchConditions.$or = starConditions;
    }

    // 按格局搜索
    if (query.patterns && query.patterns.length > 0) {
      matchConditions["patterns.name"] = { $in: query.patterns };
    }

    // 按年份范围搜索
    if (query.yearRange) {
      matchConditions["birthInfo.year"] = {
        $gte: query.yearRange.start,
        $lte: query.yearRange.end,
      };
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push({ $sort: { "metadata.createdAt": -1 } }, { $limit: 100 });

    return await charts.aggregate(pipeline).toArray();
  }

  async deleteChart(chartId) {
    const charts = this.db.collection("charts");
    await charts.deleteOne({ id: chartId });
  }

  async getStatistics(userId = null) {
    const charts = this.db.collection("charts");

    const pipeline = [];

    if (userId) {
      pipeline.push({ $match: { userId } });
    }

    pipeline.push({
      $group: {
        _id: null,
        totalCharts: { $sum: 1 },
        avgAge: {
          $avg: {
            $subtract: [new Date().getFullYear(), "$birthInfo.year"],
          },
        },
        genderDistribution: {
          $push: "$birthInfo.gender",
        },
      },
    });

    pipeline.push({
      $project: {
        totalCharts: 1,
        avgAge: { $round: ["$avgAge", 1] },
        maleCount: {
          $size: {
            $filter: {
              input: "$genderDistribution",
              cond: { $eq: ["$$this", "male"] },
            },
          },
        },
        femaleCount: {
          $size: {
            $filter: {
              input: "$genderDistribution",
              cond: { $eq: ["$$this", "female"] },
            },
          },
        },
      },
    });

    const result = await charts.aggregate(pipeline).toArray();
    return (
      result[0] || { totalCharts: 0, avgAge: 0, maleCount: 0, femaleCount: 0 }
    );
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

/**
 * 混合存储实现
 */
class HybridStorage {
  constructor(config) {
    this.config = config;
    this.localStorage = new SQLiteStorage(config.sqlite);
    this.cloudStorage = config.mongodb
      ? new MongoDBStorage(config.mongodb)
      : null;
  }

  async initialize() {
    await this.localStorage.initialize();

    if (this.cloudStorage) {
      try {
        await this.cloudStorage.initialize();
        console.log("云端存储连接成功");
      } catch (error) {
        console.warn("云端存储连接失败，仅使用本地存储:", error.message);
        this.cloudStorage = null;
      }
    }
  }

  async saveChart(chartData) {
    // 始终保存到本地
    const localResult = await this.localStorage.saveChart(chartData);

    // 如果云端可用，同步到云端
    if (this.cloudStorage) {
      try {
        await this.cloudStorage.saveChart(chartData);
      } catch (error) {
        console.warn("云端同步失败:", error.message);
      }
    }

    return localResult;
  }

  async getChart(chartId) {
    // 优先从本地获取
    let chart = await this.localStorage.getChart(chartId);

    // 如果本地没有且云端可用，从云端获取并缓存到本地
    if (!chart && this.cloudStorage) {
      try {
        chart = await this.cloudStorage.getChart(chartId);
        if (chart) {
          await this.localStorage.saveChart(chart);
        }
      } catch (error) {
        console.warn("云端获取失败:", error.message);
      }
    }

    return chart;
  }

  async getUserCharts(userId, options = {}) {
    // 优先使用本地数据
    return await this.localStorage.getUserCharts(userId, options);
  }

  async searchCharts(query) {
    // 优先使用本地搜索
    return await this.localStorage.searchCharts(query);
  }

  async deleteChart(chartId) {
    // 从本地删除
    await this.localStorage.deleteChart(chartId);

    // 从云端删除
    if (this.cloudStorage) {
      try {
        await this.cloudStorage.deleteChart(chartId);
      } catch (error) {
        console.warn("云端删除失败:", error.message);
      }
    }
  }

  async getStatistics(userId = null) {
    return await this.localStorage.getStatistics(userId);
  }

  async syncToCloud() {
    if (!this.cloudStorage) {
      console.warn("云端存储不可用，无法同步");
      return;
    }

    try {
      // 获取所有本地命盘
      const localCharts = await this.localStorage.all(
        "SELECT chart_data FROM charts ORDER BY updated_at DESC",
      );

      let syncCount = 0;
      for (const row of localCharts) {
        try {
          const chart = JSON.parse(row.chart_data);
          await this.cloudStorage.saveChart(chart);
          syncCount++;
        } catch (error) {
          console.error("同步命盘失败:", error.message);
        }
      }

      console.log(`成功同步 ${syncCount}/${localCharts.length} 个命盘到云端`);
    } catch (error) {
      console.error("批量同步失败:", error.message);
    }
  }

  async backup(backupPath) {
    return await this.localStorage.backup(backupPath);
  }

  async restore(backupPath) {
    return await this.localStorage.restore(backupPath);
  }

  async close() {
    await this.localStorage.close();
    if (this.cloudStorage) {
      await this.cloudStorage.close();
    }
  }
}

module.exports = {
  DataPersistenceManager,
  SQLiteStorage,
  MongoDBStorage,
  HybridStorage,
};
