const path = require('path');
const fs = require('fs');

/**
 * SQLite专用配置文件
 * 为选择SQLite作为数据持久化方案的用户提供优化配置
 */

// 确保数据目录存在
const dataDir = path.join(__dirname, '..', 'data', 'sqlite');
const backupDir = path.join(__dirname, '..', 'backups', 'sqlite');

// 创建必要的目录
[dataDir, backupDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 创建目录: ${dir}`);
  }
});

/**
 * 基础配置 - 适合个人开发和测试
 */
const basicConfig = {
  // 存储类型
  storageType: 'sqlite',
  
  // 数据库文件路径
  sqlitePath: path.join(dataDir, 'ziwei.db'),
  
  // 基础设置
  enableEncryption: false,
  enableWAL: true,
  
  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 50,
    ttl: 300000  // 5分钟
  },
  
  // SQLite优化参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 5000,
    'temp_store': 'memory'
  }
};

/**
 * 生产配置 - 适合正式部署
 */
const productionConfig = {
  // 存储类型
  storageType: 'sqlite',
  
  // 数据库文件路径
  sqlitePath: path.join(dataDir, 'ziwei_prod.db'),
  
  // 安全设置
  enableEncryption: true,
  encryptionKey: process.env.ENCRYPTION_KEY || 'change-this-in-production',
  enableWAL: true,
  
  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 100,
    ttl: 600000,  // 10分钟
    preload: true
  },
  
  // SQLite优化参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 10000,
    'temp_store': 'memory',
    'mmap_size': 268435456,  // 256MB
    'page_size': 4096
  },
  
  // 备份配置
  backup: {
    enabled: true,
    interval: 86400000,  // 每天备份
    retention: 7,        // 保留7天
    path: backupDir
  },
  
  // 访问控制
  accessControl: {
    enabled: true,
    maxConcurrentUsers: 20,
    sessionTimeout: 1800000  // 30分钟
  },
  
  // 审计日志
  audit: {
    enabled: true,
    logPath: path.join(__dirname, '..', 'logs', 'audit.log'),
    logLevel: 'info'
  }
};

/**
 * 高性能配置 - 适合大数据量场景
 */
const performanceConfig = {
  // 存储类型
  storageType: 'sqlite',
  
  // 数据库文件路径
  sqlitePath: path.join(dataDir, 'ziwei_perf.db'),
  
  // 基础设置
  enableEncryption: false,  // 为了性能可以关闭加密
  enableWAL: true,
  
  // 大容量缓存
  cache: {
    enabled: true,
    maxSize: 200,
    ttl: 1800000,  // 30分钟
    preload: true,
    layers: {
      memory: { maxSize: 100, ttl: 300000 },
      disk: { maxSize: 500, ttl: 1800000 }
    }
  },
  
  // 高性能SQLite参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 20000,     // 20MB缓存
    'temp_store': 'memory',
    'mmap_size': 536870912,  // 512MB内存映射
    'page_size': 4096,
    'wal_autocheckpoint': 1000,
    'optimize': null         // 定期优化
  },
  
  // 连接池设置
  connectionPool: {
    maxConnections: 10,
    idleTimeout: 300000,
    acquireTimeout: 60000
  }
};

/**
 * 开发配置 - 适合开发调试
 */
const developmentConfig = {
  // 存储类型
  storageType: 'sqlite',
  
  // 数据库文件路径
  sqlitePath: path.join(dataDir, 'ziwei_dev.db'),
  
  // 开发设置
  enableEncryption: false,
  enableWAL: true,
  
  // 小容量缓存
  cache: {
    enabled: true,
    maxSize: 30,
    ttl: 180000  // 3分钟
  },
  
  // 基础SQLite参数
  pragmas: {
    'journal_mode': 'WAL',
    'synchronous': 'NORMAL',
    'cache_size': 3000,
    'temp_store': 'memory'
  },
  
  // 调试选项
  debug: {
    enabled: true,
    logQueries: true,
    logPerformance: true
  }
};

/**
 * 获取配置的工厂函数
 */
function getConfig(environment = 'basic') {
  const configs = {
    basic: basicConfig,
    development: developmentConfig,
    production: productionConfig,
    performance: performanceConfig
  };
  
  const config = configs[environment];
  if (!config) {
    throw new Error(`未知的配置环境: ${environment}`);
  }
  
  // 验证配置
  validateConfig(config);
  
  return config;
}

/**
 * 配置验证函数
 */
function validateConfig(config) {
  // 检查必需字段
  if (!config.storageType || config.storageType !== 'sqlite') {
    throw new Error('storageType必须设置为sqlite');
  }
  
  if (!config.sqlitePath) {
    throw new Error('sqlitePath不能为空');
  }
  
  // 检查数据库文件目录是否存在
  const dbDir = path.dirname(config.sqlitePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 创建数据库目录: ${dbDir}`);
  }
  
  // 检查加密配置
  if (config.enableEncryption && !config.encryptionKey) {
    console.warn('⚠️ 启用了加密但未设置encryptionKey，将使用默认密钥');
  }
  
  // 检查备份配置
  if (config.backup && config.backup.enabled) {
    if (!fs.existsSync(config.backup.path)) {
      fs.mkdirSync(config.backup.path, { recursive: true });
      console.log(`📁 创建备份目录: ${config.backup.path}`);
    }
  }
  
  console.log('✅ SQLite配置验证通过');
}

/**
 * 配置模板生成器
 */
class ConfigBuilder {
  constructor() {
    this.config = {
      storageType: 'sqlite',
      sqlitePath: path.join(dataDir, 'ziwei.db'),
      enableEncryption: false,
      enableWAL: true,
      cache: { enabled: true, maxSize: 50, ttl: 300000 },
      pragmas: {
        'journal_mode': 'WAL',
        'synchronous': 'NORMAL',
        'cache_size': 5000,
        'temp_store': 'memory'
      }
    };
  }
  
  // 设置数据库路径
  setDatabasePath(dbPath) {
    this.config.sqlitePath = dbPath;
    return this;
  }
  
  // 启用加密
  enableEncryption(key) {
    this.config.enableEncryption = true;
    this.config.encryptionKey = key;
    return this;
  }
  
  // 设置缓存
  setCache(maxSize, ttl) {
    this.config.cache = {
      enabled: true,
      maxSize: maxSize || 50,
      ttl: ttl || 300000
    };
    return this;
  }
  
  // 启用备份
  enableBackup(interval, retention, backupPath) {
    this.config.backup = {
      enabled: true,
      interval: interval || 86400000,
      retention: retention || 7,
      path: backupPath || backupDir
    };
    return this;
  }
  
  // 设置性能参数
  setPerformance(cacheSize, mmapSize) {
    this.config.pragmas = {
      ...this.config.pragmas,
      'cache_size': cacheSize || 10000,
      'mmap_size': mmapSize || 268435456
    };
    return this;
  }
  
  // 构建配置
  build() {
    validateConfig(this.config);
    return this.config;
  }
}

/**
 * 配置示例生成器
 */
function generateExampleConfigs() {
  const examples = {
    // 个人开发者配置
    personal: new ConfigBuilder()
      .setDatabasePath(path.join(dataDir, 'personal.db'))
      .setCache(30, 300000)
      .build(),
    
    // 小团队配置
    team: new ConfigBuilder()
      .setDatabasePath(path.join(dataDir, 'team.db'))
      .enableEncryption('team-secret-key')
      .setCache(100, 600000)
      .enableBackup(86400000, 7)
      .build(),
    
    // 高性能配置
    highPerformance: new ConfigBuilder()
      .setDatabasePath(path.join(dataDir, 'high_perf.db'))
      .setCache(200, 1800000)
      .setPerformance(20000, 536870912)
      .build()
  };
  
  return examples;
}

/**
 * 环境检测函数
 */
function detectEnvironment() {
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'production') {
    return 'production';
  } else if (nodeEnv === 'development') {
    return 'development';
  } else if (process.env.PERFORMANCE_MODE === 'true') {
    return 'performance';
  } else {
    return 'basic';
  }
}

/**
 * 自动配置函数
 */
function getAutoConfig() {
  const environment = detectEnvironment();
  console.log(`🔧 检测到环境: ${environment}`);
  return getConfig(environment);
}

module.exports = {
  // 预定义配置
  basicConfig,
  developmentConfig,
  productionConfig,
  performanceConfig,
  
  // 工具函数
  getConfig,
  getAutoConfig,
  validateConfig,
  
  // 构建器
  ConfigBuilder,
  
  // 示例生成器
  generateExampleConfigs,
  
  // 路径常量
  paths: {
    dataDir,
    backupDir,
    defaultDb: path.join(dataDir, 'ziwei.db')
  }
};

// 如果直接运行此文件，显示配置信息
if (require.main === module) {
  console.log('📋 SQLite配置信息:');
  console.log('==================');
  
  const environment = detectEnvironment();
  const config = getConfig(environment);
  
  console.log(`当前环境: ${environment}`);
  console.log(`数据库路径: ${config.sqlitePath}`);
  console.log(`启用加密: ${config.enableEncryption ? '是' : '否'}`);
  console.log(`启用WAL: ${config.enableWAL ? '是' : '否'}`);
  console.log(`缓存大小: ${config.cache.maxSize}`);
  console.log(`缓存TTL: ${config.cache.ttl / 1000}秒`);
  
  if (config.backup && config.backup.enabled) {
    console.log(`备份间隔: ${config.backup.interval / 3600000}小时`);
    console.log(`备份保留: ${config.backup.retention}天`);
  }
  
  console.log('==================');
  console.log('✅ 配置加载完成');
}