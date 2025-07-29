/**
 * SQLite数据持久化管理器
 * 专门为SQLite优化的数据持久化解决方案
 */

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class SQLitePersistenceManager {
  constructor(config = {}) {
    this.config = {
      dbPath: config.dbPath || "./data/charts.db",
      backupPath: config.backupPath || "./data/backups",
      enableWAL: config.enableWAL !== false,
      enableCache: config.enableCache !== false,
      cacheSize: config.cacheSize || 1000,
      enableEncryption: config.enableEncryption || false,
      encryptionKey: config.encryptionKey || null,
      autoBackup: config.autoBackup || false,
      backupInterval: config.backupInterval || 24 * 60 * 60 * 1000, // 24小时
      ...config,
    };

    this.db = null;
    this.cache = new Map();
    this.isInitialized = false;
    this.backupTimer = null;

    // 确保数据目录存在
    this.ensureDirectories();
  }

  /**
   * 确保必要的目录存在
   */
  ensureDirectories() {
    const dbDir = path.dirname(this.config.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(this.config.backupPath)) {
      fs.mkdirSync(this.config.backupPath, { recursive: true });
    }
  }

  /**
   * 初始化数据库
   */
  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.config.dbPath, (err) => {
        if (err) {
          reject(new Error(`数据库连接失败: ${err.message}`));
          return;
        }

        // 启用WAL模式
        if (this.config.enableWAL) {
          this.db.run("PRAGMA journal_mode=WAL");
        }

        // 设置其他优化参数
        this.db.run("PRAGMA synchronous=NORMAL");
        this.db.run("PRAGMA cache_size=10000");
        this.db.run("PRAGMA temp_store=memory");
        this.db.run("PRAGMA mmap_size=268435456"); // 256MB

        this.createTables()
          .then(() => {
            this.isInitialized = true;

            // 启动自动备份
            if (this.config.autoBackup) {
              this.startAutoBackup();
            }

            resolve();
          })
          .catch(reject);
      });
    });
  }

  /**
   * 创建数据表
   */
  async createTables() {
    const tables = [
      // 命盘表
      `CREATE TABLE IF NOT EXISTS charts (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                birth_info TEXT NOT NULL,
                chart_data TEXT NOT NULL,
                svg_content TEXT,
                chart_type TEXT DEFAULT 'traditional',
                theme TEXT DEFAULT 'classic',
                tags TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

      // 分析记录表
      `CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                chart_id TEXT NOT NULL,
                analysis_type TEXT NOT NULL,
                analysis_data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chart_id) REFERENCES charts (id) ON DELETE CASCADE
            )`,

      // 比较记录表
      `CREATE TABLE IF NOT EXISTS comparisons (
                id TEXT PRIMARY KEY,
                chart1_id TEXT NOT NULL,
                chart2_id TEXT NOT NULL,
                comparison_type TEXT NOT NULL,
                comparison_data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chart1_id) REFERENCES charts (id) ON DELETE CASCADE,
                FOREIGN KEY (chart2_id) REFERENCES charts (id) ON DELETE CASCADE
            )`,

      // 备份记录表
      `CREATE TABLE IF NOT EXISTS backups (
                id TEXT PRIMARY KEY,
                backup_path TEXT NOT NULL,
                backup_size INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
    ];

    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_charts_name ON charts (name)",
      "CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts (created_at)",
      "CREATE INDEX IF NOT EXISTS idx_charts_chart_type ON charts (chart_type)",
      "CREATE INDEX IF NOT EXISTS idx_analyses_chart_id ON analyses (chart_id)",
      "CREATE INDEX IF NOT EXISTS idx_comparisons_chart1_id ON comparisons (chart1_id)",
      "CREATE INDEX IF NOT EXISTS idx_comparisons_chart2_id ON comparisons (chart2_id)",
    ];

    return new Promise((resolve, reject) => {
      // 先创建所有表
      const createTables = () => {
        return new Promise((resolveTable, rejectTable) => {
          let tableCompleted = 0;

          if (tables.length === 0) {
            resolveTable();
            return;
          }

          tables.forEach((sql) => {
            this.db.run(sql, (err) => {
              if (err) {
                rejectTable(new Error(`创建表失败: ${err.message}`));
                return;
              }
              tableCompleted++;
              if (tableCompleted === tables.length) {
                resolveTable();
              }
            });
          });
        });
      };

      // 再创建所有索引
      const createIndexes = () => {
        return new Promise((resolveIndex, rejectIndex) => {
          let indexCompleted = 0;

          if (indexes.length === 0) {
            resolveIndex();
            return;
          }

          indexes.forEach((sql) => {
            this.db.run(sql, (err) => {
              if (err) {
                rejectIndex(new Error(`创建索引失败: ${err.message}`));
                return;
              }
              indexCompleted++;
              if (indexCompleted === indexes.length) {
                resolveIndex();
              }
            });
          });
        });
      };

      // 按顺序执行
      createTables()
        .then(() => createIndexes())
        .then(() => resolve())
        .catch(reject);
    });
  }

  /**
   * 保存命盘
   */
  async saveChart(chartData) {
    await this.ensureInitialized();

    const id = chartData.id || this.generateId();
    const now = new Date().toISOString();

    // 加密敏感数据
    const encryptedData = this.config.enableEncryption
      ? this.encrypt(JSON.stringify(chartData.chartData))
      : JSON.stringify(chartData.chartData);

    const data = {
      id,
      name: chartData.name,
      birth_info: JSON.stringify(chartData.birthInfo),
      chart_data: encryptedData,
      svg_content: chartData.svgContent || null,
      chart_type: chartData.chartType || "traditional",
      theme: chartData.theme || "classic",
      tags: chartData.tags ? JSON.stringify(chartData.tags) : null,
      notes: chartData.notes || null,
      updated_at: now,
    };

    return new Promise((resolve, reject) => {
      const sql = `INSERT OR REPLACE INTO charts 
                (id, name, birth_info, chart_data, svg_content, chart_type, theme, tags, notes, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
                    COALESCE((SELECT created_at FROM charts WHERE id = ?), ?), ?)`;

      this.db.run(
        sql,
        [
          data.id,
          data.name,
          data.birth_info,
          data.chart_data,
          data.svg_content,
          data.chart_type,
          data.theme,
          data.tags,
          data.notes,
          data.id,
          now,
          data.updated_at,
        ],
        function (err) {
          if (err) {
            reject(new Error(`保存命盘失败: ${err.message}`));
            return;
          }

          // 更新缓存
          if (this.config.enableCache) {
            this.cache.set(id, { ...data, created_at: now });
          }

          resolve({ id, changes: this.changes });
        }.bind(this),
      );
    });
  }

  /**
   * 获取命盘
   */
  async getChart(id) {
    await this.ensureInitialized();

    // 检查缓存
    if (this.config.enableCache && this.cache.has(id)) {
      return this.processChartData(this.cache.get(id));
    }

    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM charts WHERE id = ?";

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(new Error(`获取命盘失败: ${err.message}`));
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        const result = this.processChartData(row);

        // 更新缓存
        if (this.config.enableCache) {
          this.cache.set(id, row);
        }

        resolve(result);
      });
    });
  }

  /**
   * 列出命盘
   */
  async listCharts(options = {}) {
    await this.ensureInitialized();

    const {
      limit = 50,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "DESC",
      chartType = null,
      theme = null,
    } = options;

    let sql =
      "SELECT id, name, chart_type, theme, created_at, updated_at FROM charts";
    const params = [];
    const conditions = [];

    if (chartType) {
      conditions.push("chart_type = ?");
      params.push(chartType);
    }

    if (theme) {
      conditions.push("theme = ?");
      params.push(theme);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(`列出命盘失败: ${err.message}`));
          return;
        }

        resolve(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            chartType: row.chart_type,
            theme: row.theme,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          })),
        );
      });
    });
  }

  /**
   * 搜索命盘
   */
  async searchCharts(query, options = {}) {
    await this.ensureInitialized();

    const { limit = 50, offset = 0 } = options;

    const sql = `SELECT id, name, chart_type, theme, created_at, updated_at 
                     FROM charts 
                     WHERE name LIKE ? OR notes LIKE ? 
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?`;

    const searchTerm = `%${query}%`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [searchTerm, searchTerm, limit, offset], (err, rows) => {
        if (err) {
          reject(new Error(`搜索命盘失败: ${err.message}`));
          return;
        }

        resolve(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            chartType: row.chart_type,
            theme: row.theme,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          })),
        );
      });
    });
  }

  /**
   * 删除命盘
   */
  async deleteChart(id) {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM charts WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            reject(new Error(`删除命盘失败: ${err.message}`));
            return;
          }

          // 清除缓存
          if (this.config.enableCache) {
            this.cache.delete(id);
          }

          resolve({ deleted: this.changes > 0, changes: this.changes });
        }.bind(this),
      );
    });
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    await this.ensureInitialized();

    const queries = [
      "SELECT COUNT(*) as total FROM charts",
      "SELECT chart_type, COUNT(*) as count FROM charts GROUP BY chart_type",
      "SELECT theme, COUNT(*) as count FROM charts GROUP BY theme",
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM charts GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30",
    ];

    const results = await Promise.all(
      queries.map(
        (sql) =>
          new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          }),
      ),
    );

    return {
      total: results[0][0].total,
      byType: results[1],
      byTheme: results[2],
      dailyStats: results[3],
    };
  }

  /**
   * 备份数据库
   */
  async backup(customPath = null) {
    await this.ensureInitialized();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `charts_backup_${timestamp}.db`;
    const backupPath =
      customPath || path.join(this.config.backupPath, backupFileName);

    return new Promise((resolve, reject) => {
      // 使用SQLite的VACUUM INTO命令创建备份
      this.db.run(`VACUUM INTO '${backupPath}'`, (err) => {
        if (err) {
          reject(new Error(`备份失败: ${err.message}`));
          return;
        }

        // 获取备份文件大小
        const stats = fs.statSync(backupPath);
        const backupId = this.generateId();

        // 记录备份信息
        this.db.run(
          "INSERT INTO backups (id, backup_path, backup_size) VALUES (?, ?, ?)",
          [backupId, backupPath, stats.size],
          (err) => {
            if (err) {
              console.warn("备份记录保存失败:", err.message);
            }

            resolve({
              id: backupId,
              path: backupPath,
              size: stats.size,
              timestamp,
            });
          },
        );
      });
    });
  }

  /**
   * 恢复数据库
   */
  async restore(backupPath) {
    if (!fs.existsSync(backupPath)) {
      throw new Error("备份文件不存在");
    }

    // 关闭当前连接
    await this.close();

    // 备份当前数据库
    const currentBackup = this.config.dbPath + ".before_restore";
    if (fs.existsSync(this.config.dbPath)) {
      fs.copyFileSync(this.config.dbPath, currentBackup);
    }

    try {
      // 复制备份文件
      fs.copyFileSync(backupPath, this.config.dbPath);

      // 重新初始化
      this.isInitialized = false;
      await this.initialize();

      return { success: true, restoredFrom: backupPath };
    } catch (error) {
      // 恢复失败，回滚
      if (fs.existsSync(currentBackup)) {
        fs.copyFileSync(currentBackup, this.config.dbPath);
        this.isInitialized = false;
        await this.initialize();
      }

      throw new Error(`恢复失败: ${error.message}`);
    } finally {
      // 清理临时文件
      if (fs.existsSync(currentBackup)) {
        fs.unlinkSync(currentBackup);
      }
    }
  }

  /**
   * 启动自动备份
   */
  startAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }

    this.backupTimer = setInterval(async () => {
      try {
        await this.backup();
        console.log("自动备份完成");
      } catch (error) {
        console.error("自动备份失败:", error.message);
      }
    }, this.config.backupInterval);
  }

  /**
   * 关闭数据库连接
   */
  async close() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }

    if (this.db) {
      return new Promise((resolve) => {
        this.db.close((err) => {
          if (err) {
            console.error("关闭数据库失败:", err.message);
          }
          this.db = null;
          this.isInitialized = false;
          resolve();
        });
      });
    }
  }

  /**
   * 辅助方法
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  generateId() {
    return crypto.randomBytes(16).toString("hex");
  }

  encrypt(text) {
    if (!this.config.encryptionKey) return text;

    const cipher = crypto.createCipher(
      "aes-256-cbc",
      this.config.encryptionKey,
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(encryptedText) {
    if (!this.config.encryptionKey) return encryptedText;

    const decipher = crypto.createDecipher(
      "aes-256-cbc",
      this.config.encryptionKey,
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  processChartData(row) {
    if (!row) return null;

    try {
      const chartData = this.config.enableEncryption
        ? JSON.parse(this.decrypt(row.chart_data))
        : JSON.parse(row.chart_data);

      return {
        id: row.id,
        name: row.name,
        birthInfo: JSON.parse(row.birth_info),
        chartData,
        svgContent: row.svg_content,
        chartType: row.chart_type,
        theme: row.theme,
        tags: row.tags ? JSON.parse(row.tags) : null,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      throw new Error(`数据解析失败: ${error.message}`);
    }
  }
}

module.exports = SQLitePersistenceManager;
