# 紫微斗数SQLite部署指南

本指南专门针对选择SQLite作为数据持久化方案的用户，提供完整的部署和使用说明。

## 目录

1. [为什么选择SQLite](#为什么选择sqlite)
2. [快速部署](#快速部署)
3. [配置说明](#配置说明)
4. [使用示例](#使用示例)
5. [性能优化](#性能优化)
6. [备份策略](#备份策略)
7. [故障排除](#故障排除)

## 为什么选择SQLite

### 优势

✅ **零配置部署**
- 无需安装额外数据库服务器
- 开箱即用，立即可用
- 单文件数据库，便于管理

✅ **高性能**
- 本地文件访问，无网络延迟
- 读取速度极快
- 支持事务和并发

✅ **数据安全**
- 完全本地化存储
- 支持数据加密
- 文件级权限控制

✅ **成本效益**
- 无服务器费用
- 无维护成本
- 适合中小规模应用

### 适用场景

- 个人开发和学习
- 小团队项目（<50用户）
- 原型开发和测试
- 离线应用
- 数据隐私要求高的场景

## 快速部署

### 1. 安装依赖

```bash
# 进入项目目录


# 安装SQLite依赖
npm install sqlite3

# 如果需要加密功能
npm install crypto
```

### 2. 创建数据目录

```bash
# 创建数据存储目录
mkdir -p data\sqlite

# 创建备份目录
mkdir -p backups\sqlite
```

### 3. 基础配置

创建 `config/sqlite-config.js`：

```javascript
const path = require('path');

module.exports = {
  // 存储类型
  storageType: 'sqlite',
  
  // 数据库文件路径
  sqlitePath: path.join(__dirname, '..', 'data', 'sqlite', 'ziwei.db'),
  
  // 基础配置
  enableEncryption: false, // 生产环境建议启用
  enableWAL: true,         // 启用WAL模式提升性能
  
  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 100,          // 缓存100个命盘
    ttl: 600000           // 10分钟过期
  },
  
  // SQLite优化参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 10000,
    'temp_store': 'memory',
    'mmap_size': 268435456  // 256MB内存映射
  },
  
  // 备份配置
  backup: {
    enabled: true,
    interval: 86400000,    // 每天备份一次
    retention: 7,          // 保留7天
    path: path.join(__dirname, '..', 'backups', 'sqlite')
  }
};
```

### 4. 启动应用

```javascript
// app.js
const { PersistentChartTool } = require('./src/tools/persistent-chart-tool');
const sqliteConfig = require('./config/sqlite-config');

// 创建工具实例
const chartTool = new PersistentChartTool(sqliteConfig);

// 初始化数据库
async function initializeApp() {
  try {
    await chartTool.initialize();
    console.log('✅ SQLite数据库初始化成功');
    console.log('📁 数据库文件:', sqliteConfig.sqlitePath);
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
}

initializeApp();
```

## 配置说明

### 基础配置

```javascript
const basicConfig = {
  storageType: 'sqlite',
  sqlitePath: './data/ziwei.db',
  enableEncryption: false,
  cache: {
    enabled: true,
    maxSize: 50,
    ttl: 300000  // 5分钟
  }
};
```

### 安全配置（推荐生产环境）

```javascript
const secureConfig = {
  storageType: 'sqlite',
  sqlitePath: './data/ziwei.db',
  
  // 启用数据加密
  enableEncryption: true,
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-secret-key',
  
  // 访问控制
  accessControl: {
    enabled: true,
    maxConcurrentUsers: 10,
    sessionTimeout: 1800000  // 30分钟
  },
  
  // 审计日志
  audit: {
    enabled: true,
    logPath: './logs/audit.log',
    logLevel: 'info'
  }
};
```

### 高性能配置

```javascript
const performanceConfig = {
  storageType: 'sqlite',
  sqlitePath: './data/ziwei.db',
  
  // 启用WAL模式
  enableWAL: true,
  
  // 优化参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 20000,     // 增大缓存
    'temp_store': 'memory',
    'mmap_size': 536870912,  // 512MB内存映射
    'page_size': 4096
  },
  
  // 大容量缓存
  cache: {
    enabled: true,
    maxSize: 200,
    ttl: 1800000,  // 30分钟
    preload: true  // 预加载热门数据
  }
};
```

## 使用示例

### 1. 生成并保存命盘

```javascript
const { PersistentChartTool } = require('./src/tools/persistent-chart-tool');
const config = require('./config/sqlite-config');

const chartTool = new PersistentChartTool(config);

async function createChart() {
  try {
    const result = await chartTool.execute({
      action: 'save',
      userId: 'user001',
      birthInfo: {
        year: 1990,
        month: 6,
        day: 15,
        hour: 14,
        gender: 'male',
        location: {
          name: '北京',
          longitude: 116.4074,
          latitude: 39.9042
        }
      },
      analysisOptions: {
        includePersonality: true,
        includeCareer: true,
        detailLevel: 'comprehensive'
      }
    });
    
    if (result.success) {
      console.log('✅ 命盘保存成功');
      console.log('📋 命盘ID:', result.data.chartId);
      console.log('👤 用户ID:', result.data.userId);
    }
  } catch (error) {
    console.error('❌ 保存失败:', error.message);
  }
}

createChart();
```

### 2. 查询用户命盘

```javascript
async function getUserCharts() {
  try {
    const result = await chartTool.execute({
      action: 'list',
      userId: 'user001',
      queryOptions: {
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    });
    
    if (result.success) {
      console.log(`📊 找到 ${result.data.total} 个命盘`);
      result.data.charts.forEach((chart, index) => {
        console.log(`${index + 1}. ${chart.id} - ${chart.birthInfo.year}年${chart.birthInfo.month}月${chart.birthInfo.day}日`);
      });
    }
  } catch (error) {
    console.error('❌ 查询失败:', error.message);
  }
}

getUserCharts();
```

### 3. 搜索命盘

```javascript
async function searchCharts() {
  try {
    const result = await chartTool.execute({
      action: 'search',
      userId: 'user001',
      searchQuery: {
        stars: ['紫微', '天府'],  // 搜索包含这些主星的命盘
        yearRange: { start: 1985, end: 1995 },
        gender: 'male'
      }
    });
    
    if (result.success) {
      console.log(`🔍 搜索到 ${result.data.charts.length} 个匹配的命盘`);
      result.data.charts.forEach(chart => {
        console.log(`- ${chart.id}: ${chart.palaces.ming.mainStars.join(', ')}`);
      });
    }
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
  }
}

searchCharts();
```

### 4. 数据备份

```javascript
async function backupData() {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = `./backups/sqlite/ziwei_backup_${timestamp}.db`;
    
    const result = await chartTool.execute({
      action: 'backup',
      filePath: backupPath
    });
    
    if (result.success) {
      console.log('✅ 备份完成');
      console.log('📁 备份文件:', backupPath);
      console.log('📊 备份大小:', result.data.fileSize);
    }
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
  }
}

backupData();
```

## 性能优化

### 1. WAL模式配置

```javascript
// 启用WAL模式提升并发性能
const walConfig = {
  enableWAL: true,
  pragmas: {
    'journal_mode': 'WAL',
    'wal_autocheckpoint': 1000,
    'wal_checkpoint': 'TRUNCATE'
  }
};
```

**WAL模式优势：**
- 读写并发：读操作不会阻塞写操作
- 更好的性能：减少磁盘I/O
- 原子性提交：保证数据一致性

### 2. 内存优化

```javascript
const memoryConfig = {
  pragmas: {
    'cache_size': 20000,      // 20MB缓存
    'temp_store': 'memory',   // 临时表存储在内存
    'mmap_size': 268435456,   // 256MB内存映射
    'page_size': 4096         // 4KB页面大小
  }
};
```

### 3. 索引优化

```sql
-- 自动创建的性能索引
CREATE INDEX idx_charts_user_created ON charts(user_id, created_at DESC);
CREATE INDEX idx_charts_birth_year ON charts(birth_year);
CREATE INDEX idx_charts_main_stars ON charts(main_stars);
CREATE INDEX idx_charts_gender ON charts(gender);
```

### 4. 批量操作

```javascript
// 批量插入命盘
async function batchInsertCharts(charts) {
  const db = await chartTool.persistenceManager.storage.getConnection();
  
  await db.run('BEGIN TRANSACTION');
  
  try {
    for (const chart of charts) {
      await chartTool.execute({ action: 'save', ...chart });
    }
    await db.run('COMMIT');
    console.log(`✅ 批量插入 ${charts.length} 个命盘成功`);
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('❌ 批量插入失败:', error.message);
  }
}
```

## 备份策略

### 1. 自动备份

```javascript
// 定时备份脚本
class AutoBackup {
  constructor(chartTool, config) {
    this.chartTool = chartTool;
    this.config = config;
    this.backupInterval = null;
  }
  
  start() {
    // 每天凌晨2点备份
    this.backupInterval = setInterval(() => {
      this.performBackup();
    }, 86400000); // 24小时
    
    console.log('🔄 自动备份已启动');
  }
  
  async performBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `./backups/sqlite/auto_backup_${timestamp}.db`;
      
      await this.chartTool.execute({
        action: 'backup',
        filePath: backupPath
      });
      
      console.log(`✅ 自动备份完成: ${backupPath}`);
      
      // 清理旧备份
      await this.cleanOldBackups();
    } catch (error) {
      console.error('❌ 自动备份失败:', error.message);
    }
  }
  
  async cleanOldBackups() {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const backupDir = './backups/sqlite';
      const files = await fs.readdir(backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('auto_backup_'))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          stat: fs.stat(path.join(backupDir, file))
        }));
      
      // 按时间排序，保留最新的7个备份
      const sortedFiles = backupFiles
        .sort((a, b) => b.stat.mtime - a.stat.mtime)
        .slice(7); // 删除7个以外的备份
      
      for (const file of sortedFiles) {
        await fs.unlink(file.path);
        console.log(`🗑️ 删除旧备份: ${file.name}`);
      }
    } catch (error) {
      console.error('❌ 清理备份失败:', error.message);
    }
  }
  
  stop() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
      console.log('⏹️ 自动备份已停止');
    }
  }
}

// 启动自动备份
const autoBackup = new AutoBackup(chartTool, config);
autoBackup.start();
```

### 2. 手动备份

```javascript
// 手动备份工具
class ManualBackup {
  constructor(chartTool) {
    this.chartTool = chartTool;
  }
  
  async createBackup(description = '') {
    const timestamp = new Date().toISOString().split('T')[0];
    const desc = description ? `_${description}` : '';
    const backupPath = `./backups/sqlite/manual_backup_${timestamp}${desc}.db`;
    
    try {
      const result = await this.chartTool.execute({
        action: 'backup',
        filePath: backupPath
      });
      
      if (result.success) {
        console.log('✅ 手动备份完成');
        console.log('📁 备份路径:', backupPath);
        console.log('📊 文件大小:', this.formatFileSize(result.data.fileSize));
        return backupPath;
      }
    } catch (error) {
      console.error('❌ 手动备份失败:', error.message);
      throw error;
    }
  }
  
  async restoreBackup(backupPath) {
    try {
      const result = await this.chartTool.execute({
        action: 'restore',
        filePath: backupPath
      });
      
      if (result.success) {
        console.log('✅ 数据恢复完成');
        console.log('📊 恢复记录数:', result.data.restoredCount);
      }
    } catch (error) {
      console.error('❌ 数据恢复失败:', error.message);
      throw error;
    }
  }
  
  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// 使用示例
const manualBackup = new ManualBackup(chartTool);

// 创建备份
await manualBackup.createBackup('before_update');

// 恢复备份
// await manualBackup.restoreBackup('./backups/sqlite/manual_backup_2024-01-15_before_update.db');
```

## 故障排除

### 常见问题

#### 1. 数据库锁定错误

**错误信息：** `database is locked`

**解决方案：**
```javascript
// 启用WAL模式和超时设置
const config = {
  enableWAL: true,
  pragmas: {
    'journal_mode': 'WAL',
    'busy_timeout': 30000  // 30秒超时
  }
};
```

#### 2. 磁盘空间不足

**错误信息：** `disk I/O error`

**解决方案：**
```javascript
// 监控磁盘空间
const fs = require('fs');

function checkDiskSpace() {
  const stats = fs.statSync('./data/sqlite/ziwei.db');
  const fileSizeInMB = stats.size / (1024 * 1024);
  
  if (fileSizeInMB > 1000) { // 超过1GB
    console.warn('⚠️ 数据库文件过大，建议清理或归档');
  }
}

// 定期检查
setInterval(checkDiskSpace, 3600000); // 每小时检查
```

#### 3. 性能下降

**症状：** 查询速度变慢

**解决方案：**
```javascript
// 数据库维护
async function maintainDatabase() {
  const db = await chartTool.persistenceManager.storage.getConnection();
  
  try {
    // 分析查询计划
    await db.run('ANALYZE');
    
    // 重建索引
    await db.run('REINDEX');
    
    // 清理碎片
    await db.run('VACUUM');
    
    console.log('✅ 数据库维护完成');
  } catch (error) {
    console.error('❌ 数据库维护失败:', error.message);
  }
}

// 每周维护一次
setInterval(maintainDatabase, 604800000); // 7天
```

#### 4. 内存泄漏

**症状：** 内存使用持续增长

**解决方案：**
```javascript
// 内存监控
class MemoryMonitor {
  constructor() {
    this.startTime = Date.now();
    this.initialMemory = process.memoryUsage();
  }
  
  checkMemory() {
    const current = process.memoryUsage();
    const runtime = (Date.now() - this.startTime) / 1000 / 60; // 分钟
    
    console.log('📊 内存使用情况:');
    console.log(`  运行时间: ${runtime.toFixed(1)} 分钟`);
    console.log(`  堆内存: ${(current.heapUsed / 1024 / 1024).toFixed(1)} MB`);
    console.log(`  总内存: ${(current.rss / 1024 / 1024).toFixed(1)} MB`);
    
    // 内存使用超过500MB时警告
    if (current.heapUsed > 500 * 1024 * 1024) {
      console.warn('⚠️ 内存使用过高，建议重启应用');
    }
  }
  
  startMonitoring() {
    setInterval(() => {
      this.checkMemory();
    }, 300000); // 5分钟检查一次
  }
}

const memoryMonitor = new MemoryMonitor();
memoryMonitor.startMonitoring();
```

### 调试工具

```javascript
// SQLite调试工具
class SQLiteDebugger {
  constructor(chartTool) {
    this.chartTool = chartTool;
  }
  
  async getDatabaseInfo() {
    const db = await this.chartTool.persistenceManager.storage.getConnection();
    
    try {
      // 数据库大小
      const sizeResult = await db.get("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()");
      
      // 表信息
      const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
      
      // 索引信息
      const indexes = await db.all("SELECT name FROM sqlite_master WHERE type='index'");
      
      console.log('📊 数据库信息:');
      console.log(`  大小: ${(sizeResult.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  表数量: ${tables.length}`);
      console.log(`  索引数量: ${indexes.length}`);
      
      return {
        size: sizeResult.size,
        tables: tables.length,
        indexes: indexes.length
      };
    } catch (error) {
      console.error('❌ 获取数据库信息失败:', error.message);
    }
  }
  
  async getTableStats() {
    const db = await this.chartTool.persistenceManager.storage.getConnection();
    
    try {
      const stats = await db.get('SELECT COUNT(*) as total FROM charts');
      console.log(`📋 命盘总数: ${stats.total}`);
      
      const userStats = await db.all(`
        SELECT user_id, COUNT(*) as count 
        FROM charts 
        GROUP BY user_id 
        ORDER BY count DESC 
        LIMIT 10
      `);
      
      console.log('👥 用户统计 (前10):');
      userStats.forEach((stat, index) => {
        console.log(`  ${index + 1}. ${stat.user_id}: ${stat.count} 个命盘`);
      });
    } catch (error) {
      console.error('❌ 获取表统计失败:', error.message);
    }
  }
}

// 使用调试工具
const debugger = new SQLiteDebugger(chartTool);
await debugger.getDatabaseInfo();
await debugger.getTableStats();
```

## 总结

SQLite是紫微斗数MCP工具的理想选择，特别适合：

### ✅ 推荐场景
- **个人开发者**：零配置，立即可用
- **小团队项目**：简单可靠，易于管理
- **原型开发**：快速部署，专注业务逻辑
- **离线应用**：无网络依赖，数据本地化
- **隐私敏感**：数据完全掌控，安全可靠

### 🚀 核心优势
1. **部署简单**：无需额外服务器，开箱即用
2. **性能优秀**：本地访问，响应迅速
3. **成本低廉**：无服务器费用，维护成本低
4. **数据安全**：本地存储，支持加密
5. **扩展性好**：后续可升级到混合存储

### 📈 性能表现
- **查询速度**：毫秒级响应
- **并发能力**：支持多用户同时访问
- **存储容量**：单文件可达TB级别
- **事务支持**：ACID特性保证数据一致性

选择SQLite，您将获得一个稳定、高效、易用的数据持久化解决方案，为紫微斗数应用提供坚实的数据基础。