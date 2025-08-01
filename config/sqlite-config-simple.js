/**
 * SQLite简化配置
 * 专门为SQLite部署优化的配置文件
 */

const path = require('path');
const os = require('os');

class SQLiteConfig {
    /**
     * 获取配置
     */
    static getConfig(environment = 'production') {
        const baseConfig = {
            // 基础路径
            dbPath: './data/charts.db',
            backupPath: './data/backups',
            
            // SQLite优化
            enableWAL: true,
            enableCache: true,
            cacheSize: 1000,
            
            // 安全设置
            enableEncryption: false,
            encryptionKey: null,
            
            // 备份设置
            autoBackup: false,
            backupInterval: 24 * 60 * 60 * 1000, // 24小时
        };
        
        const configs = {
            development: {
                ...baseConfig,
                dbPath: './data/dev_charts.db',
                enableCache: true,
                autoBackup: false
            },
            
            production: {
                ...baseConfig,
                enableWAL: true,
                enableCache: true,
                autoBackup: true,
                backupInterval: 12 * 60 * 60 * 1000 // 12小时
            },
            
            performance: {
                ...baseConfig,
                enableWAL: true,
                enableCache: true,
                cacheSize: 5000,
                autoBackup: true
            },
            
            test: {
                ...baseConfig,
                dbPath: './data/test_charts.db',
                enableCache: false,
                autoBackup: false
            }
        };
        
        return configs[environment] || configs.production;
    }
    
    /**
     * 验证配置
     */
    static validateConfig(config) {
        const required = ['dbPath', 'backupPath'];
        
        for (const field of required) {
            if (!config[field]) {
                throw new Error(`配置缺少必需字段: ${field}`);
            }
        }
        
        // 验证路径
        if (!path.isAbsolute(config.dbPath)) {
            config.dbPath = path.resolve(config.dbPath);
        }
        
        if (!path.isAbsolute(config.backupPath)) {
            config.backupPath = path.resolve(config.backupPath);
        }
        
        return config;
    }
    
    /**
     * 创建配置构建器
     */
    static createBuilder() {
        return new SQLiteConfigBuilder();
    }
}

class SQLiteConfigBuilder {
    constructor() {
        this.config = {
            dbPath: './data/charts.db',
            backupPath: './data/backups',
            enableWAL: true,
            enableCache: true,
            cacheSize: 1000,
            enableEncryption: false,
            encryptionKey: null,
            autoBackup: false,
            backupInterval: 24 * 60 * 60 * 1000
        };
    }
    
    setDbPath(dbPath) {
        this.config.dbPath = dbPath;
        return this;
    }
    
    setBackupPath(backupPath) {
        this.config.backupPath = backupPath;
        return this;
    }
    
    enableWAL(enable = true) {
        this.config.enableWAL = enable;
        return this;
    }
    
    enableCache(enable = true, cacheSize = 1000) {
        this.config.enableCache = enable;
        this.config.cacheSize = cacheSize;
        return this;
    }
    
    enableEncryption(key) {
        this.config.enableEncryption = !!key;
        this.config.encryptionKey = key;
        return this;
    }
    
    enableAutoBackup(enable = true, interval = 24 * 60 * 60 * 1000) {
        this.config.autoBackup = enable;
        this.config.backupInterval = interval;
        return this;
    }
    
    build() {
        return SQLiteConfig.validateConfig({ ...this.config });
    }
}

// 预设配置模板
const PRESET_CONFIGS = {
    // 个人开发者
    personal: {
        dbPath: './data/charts.db',
        backupPath: './data/backups',
        enableWAL: true,
        enableCache: true,
        cacheSize: 500,
        enableEncryption: false,
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000
    },
    
    // 小团队
    team: {
        dbPath: './data/charts.db',
        backupPath: './data/backups',
        enableWAL: true,
        enableCache: true,
        cacheSize: 2000,
        enableEncryption: true,
        autoBackup: true,
        backupInterval: 12 * 60 * 60 * 1000
    },
    
    // 高性能
    highPerformance: {
        dbPath: './data/charts.db',
        backupPath: './data/backups',
        enableWAL: true,
        enableCache: true,
        cacheSize: 10000,
        enableEncryption: false,
        autoBackup: true,
        backupInterval: 6 * 60 * 60 * 1000
    }
};

module.exports = {
    SQLiteConfig,
    SQLiteConfigBuilder,
    PRESET_CONFIGS
};