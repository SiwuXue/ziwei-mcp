// persistence-config.js - 数据持久化配置示例

/**
 * 数据持久化配置文件
 * 支持SQLite、MongoDB和混合部署模式
 */

// 环境变量配置
const config = {
  // 开发环境配置
  development: {
    // 使用SQLite本地存储
    storageType: 'sqlite',
    sqlitePath: './data/dev/ziwei.db',
    enableEncryption: false,
    enableSync: false,
    cache: {
      enabled: true,
      maxSize: 50,
      ttl: 300000 // 5分钟
    },
    logging: {
      level: 'debug',
      file: './logs/dev-persistence.log'
    }
  },

  // 测试环境配置
  test: {
    storageType: 'sqlite',
    sqlitePath: ':memory:', // 内存数据库，测试完自动清理
    enableEncryption: false,
    enableSync: false,
    cache: {
      enabled: false // 测试时禁用缓存确保数据一致性
    },
    logging: {
      level: 'error',
      file: './logs/test-persistence.log'
    }
  },

  // 生产环境配置
  production: {
    // 使用混合存储：本地SQLite + 云端MongoDB
    storageType: 'hybrid',
    sqlitePath: './data/prod/ziwei.db',
    mongodb: {
      connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/ziwei_prod',
      options: {
        useUnifiedTopology: true,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        retryWrites: true,
        w: 'majority'
      }
    },
    enableEncryption: true,
    encryptionKey: process.env.ENCRYPTION_KEY,
    enableSync: true,
    syncInterval: 300000, // 5分钟同步一次
    cache: {
      enabled: true,
      maxSize: 200,
      ttl: 600000 // 10分钟
    },
    backup: {
      enabled: true,
      interval: 86400000, // 24小时备份一次
      retention: 30, // 保留30天
      path: './backups/'
    },
    logging: {
      level: 'info',
      file: './logs/prod-persistence.log'
    }
  },

  // 云端部署配置
  cloud: {
    // 纯MongoDB云端存储
    storageType: 'mongodb',
    mongodb: {
      connectionString: process.env.MONGODB_ATLAS_URI,
      options: {
        useUnifiedTopology: true,
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        retryWrites: true,
        w: 'majority',
        readPreference: 'primaryPreferred'
      }
    },
    enableEncryption: true,
    encryptionKey: process.env.ENCRYPTION_KEY,
    enableSync: false, // 云端不需要同步
    cache: {
      enabled: true,
      maxSize: 500,
      ttl: 1800000 // 30分钟
    },
    backup: {
      enabled: true,
      interval: 43200000, // 12小时备份一次
      retention: 90, // 保留90天
      cloudStorage: {
        provider: 'aws-s3', // 或 'aliyun-oss', 'tencent-cos'
        bucket: process.env.BACKUP_BUCKET,
        region: process.env.BACKUP_REGION
      }
    },
    logging: {
      level: 'warn',
      file: './logs/cloud-persistence.log',
      cloudLogging: {
        enabled: true,
        service: 'cloudwatch' // 或其他云日志服务
      }
    }
  }
};

/**
 * 获取当前环境配置
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  const envConfig = config[env] || config.development;
  
  // 合并环境变量覆盖
  return {
    ...envConfig,
    // 环境变量优先级更高
    storageType: process.env.STORAGE_TYPE || envConfig.storageType,
    sqlitePath: process.env.SQLITE_PATH || envConfig.sqlitePath,
    enableEncryption: process.env.ENABLE_ENCRYPTION === 'true' || envConfig.enableEncryption,
    encryptionKey: process.env.ENCRYPTION_KEY || envConfig.encryptionKey,
    enableSync: process.env.ENABLE_SYNC === 'true' || envConfig.enableSync,
    mongodb: envConfig.mongodb ? {
      ...envConfig.mongodb,
      connectionString: process.env.MONGODB_URI || envConfig.mongodb.connectionString
    } : undefined
  };
}

/**
 * 验证配置
 */
function validateConfig(config) {
  const errors = [];
  
  // 验证存储类型
  if (!['sqlite', 'mongodb', 'hybrid'].includes(config.storageType)) {
    errors.push(`无效的存储类型: ${config.storageType}`);
  }
  
  // 验证SQLite配置
  if (['sqlite', 'hybrid'].includes(config.storageType)) {
    if (!config.sqlitePath) {
      errors.push('SQLite存储需要指定数据库路径');
    }
  }
  
  // 验证MongoDB配置
  if (['mongodb', 'hybrid'].includes(config.storageType)) {
    if (!config.mongodb || !config.mongodb.connectionString) {
      errors.push('MongoDB存储需要指定连接字符串');
    }
  }
  
  // 验证加密配置
  if (config.enableEncryption && !config.encryptionKey) {
    errors.push('启用加密需要提供加密密钥');
  }
  
  if (errors.length > 0) {
    throw new Error(`配置验证失败:\n${errors.join('\n')}`);
  }
  
  return true;
}

/**
 * 特定场景的配置模板
 */
const scenarios = {
  // 个人开发者 - 本地SQLite
  personal: {
    storageType: 'sqlite',
    sqlitePath: './data/personal/ziwei.db',
    enableEncryption: false,
    enableSync: false,
    cache: {
      enabled: true,
      maxSize: 30,
      ttl: 300000
    }
  },
  
  // 小团队 - 本地SQLite + 定期备份
  smallTeam: {
    storageType: 'sqlite',
    sqlitePath: './data/team/ziwei.db',
    enableEncryption: true,
    enableSync: false,
    backup: {
      enabled: true,
      interval: 86400000, // 每天备份
      retention: 7,
      path: './backups/'
    },
    cache: {
      enabled: true,
      maxSize: 100,
      ttl: 600000
    }
  },
  
  // 企业级 - 混合存储
  enterprise: {
    storageType: 'hybrid',
    sqlitePath: './data/enterprise/ziwei.db',
    mongodb: {
      connectionString: 'mongodb://mongo-cluster:27017/ziwei_enterprise',
      options: {
        useUnifiedTopology: true,
        maxPoolSize: 30,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority'
      }
    },
    enableEncryption: true,
    enableSync: true,
    syncInterval: 180000, // 3分钟同步
    cache: {
      enabled: true,
      maxSize: 300,
      ttl: 900000 // 15分钟
    },
    backup: {
      enabled: true,
      interval: 21600000, // 6小时备份
      retention: 60,
      path: './backups/'
    }
  },
  
  // 云原生 - 纯MongoDB
  cloudNative: {
    storageType: 'mongodb',
    mongodb: {
      connectionString: process.env.MONGODB_ATLAS_URI,
      options: {
        useUnifiedTopology: true,
        maxPoolSize: 100,
        serverSelectionTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
        readPreference: 'primaryPreferred'
      }
    },
    enableEncryption: true,
    enableSync: false,
    cache: {
      enabled: true,
      maxSize: 1000,
      ttl: 1800000 // 30分钟
    },
    backup: {
      enabled: true,
      interval: 43200000, // 12小时
      retention: 180,
      cloudStorage: {
        provider: 'aws-s3',
        bucket: process.env.BACKUP_BUCKET
      }
    }
  }
};

/**
 * 获取场景配置
 */
function getScenarioConfig(scenario) {
  if (!scenarios[scenario]) {
    throw new Error(`未知的场景配置: ${scenario}`);
  }
  return scenarios[scenario];
}

/**
 * 数据库连接字符串构建器
 */
class ConnectionStringBuilder {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.protocol = 'mongodb';
    this.username = null;
    this.password = null;
    this.hosts = [];
    this.database = 'ziwei';
    this.options = {};
    return this;
  }
  
  setCredentials(username, password) {
    this.username = username;
    this.password = password;
    return this;
  }
  
  addHost(host, port = 27017) {
    this.hosts.push(`${host}:${port}`);
    return this;
  }
  
  setDatabase(database) {
    this.database = database;
    return this;
  }
  
  addOption(key, value) {
    this.options[key] = value;
    return this;
  }
  
  build() {
    let connectionString = `${this.protocol}://`;
    
    // 添加认证信息
    if (this.username && this.password) {
      connectionString += `${encodeURIComponent(this.username)}:${encodeURIComponent(this.password)}@`;
    }
    
    // 添加主机列表
    if (this.hosts.length === 0) {
      throw new Error('至少需要一个主机地址');
    }
    connectionString += this.hosts.join(',');
    
    // 添加数据库名
    connectionString += `/${this.database}`;
    
    // 添加选项
    const optionPairs = Object.entries(this.options).map(
      ([key, value]) => `${key}=${encodeURIComponent(value)}`
    );
    if (optionPairs.length > 0) {
      connectionString += `?${optionPairs.join('&')}`;
    }
    
    return connectionString;
  }
}

/**
 * 配置工厂
 */
class ConfigFactory {
  static createSQLiteConfig(options = {}) {
    return {
      storageType: 'sqlite',
      sqlitePath: options.path || './data/ziwei.db',
      enableEncryption: options.encryption || false,
      enableSync: false,
      cache: {
        enabled: options.cache !== false,
        maxSize: options.cacheSize || 50,
        ttl: options.cacheTTL || 300000
      }
    };
  }
  
  static createMongoDBConfig(options = {}) {
    const builder = new ConnectionStringBuilder();
    
    if (options.username && options.password) {
      builder.setCredentials(options.username, options.password);
    }
    
    if (options.hosts) {
      options.hosts.forEach(host => {
        if (typeof host === 'string') {
          builder.addHost(host);
        } else {
          builder.addHost(host.host, host.port);
        }
      });
    } else {
      builder.addHost('localhost', 27017);
    }
    
    if (options.database) {
      builder.setDatabase(options.database);
    }
    
    // 添加默认选项
    builder
      .addOption('useUnifiedTopology', 'true')
      .addOption('retryWrites', 'true')
      .addOption('w', 'majority');
    
    // 添加自定义选项
    if (options.options) {
      Object.entries(options.options).forEach(([key, value]) => {
        builder.addOption(key, value);
      });
    }
    
    return {
      storageType: 'mongodb',
      mongodb: {
        connectionString: builder.build(),
        options: {
          useUnifiedTopology: true,
          maxPoolSize: options.maxPoolSize || 10,
          serverSelectionTimeoutMS: options.timeout || 5000,
          retryWrites: true,
          w: 'majority'
        }
      },
      enableEncryption: options.encryption || false,
      enableSync: false,
      cache: {
        enabled: options.cache !== false,
        maxSize: options.cacheSize || 100,
        ttl: options.cacheTTL || 600000
      }
    };
  }
  
  static createHybridConfig(sqliteOptions = {}, mongoOptions = {}) {
    const sqliteConfig = this.createSQLiteConfig(sqliteOptions);
    const mongoConfig = this.createMongoDBConfig(mongoOptions);
    
    return {
      storageType: 'hybrid',
      sqlitePath: sqliteConfig.sqlitePath,
      mongodb: mongoConfig.mongodb,
      enableEncryption: sqliteOptions.encryption || mongoOptions.encryption || false,
      enableSync: true,
      syncInterval: sqliteOptions.syncInterval || 300000,
      cache: {
        enabled: true,
        maxSize: Math.max(sqliteConfig.cache.maxSize, mongoConfig.cache.maxSize),
        ttl: Math.max(sqliteConfig.cache.ttl, mongoConfig.cache.ttl)
      }
    };
  }
}

module.exports = {
  config,
  getConfig,
  validateConfig,
  scenarios,
  getScenarioConfig,
  ConnectionStringBuilder,
  ConfigFactory
};