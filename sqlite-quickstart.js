#!/usr/bin/env node
/**
 * SQLite快速启动脚本
 * 一键部署和测试紫微斗数SQLite数据持久化功能
 */

const fs = require('fs');
const path = require('path');
const SQLitePersistenceManager = require('./src/core/sqlite-persistence');
const { SQLiteConfig } = require('./sqlite-config-simple');

class SQLiteQuickStart {
    constructor() {
        this.manager = null;
        this.config = null;
    }
    
    /**
     * 主启动流程
     */
    async start() {
        try {
            console.log('🚀 SQLite快速启动 - 紫微斗数数据持久化');
            console.log('=' .repeat(50));
            
            // 1. 环境检查
            await this.checkEnvironment();
            
            // 2. 配置初始化
            await this.initializeConfig();
            
            // 3. 数据库初始化
            await this.initializeDatabase();
            
            // 4. 功能测试
            await this.runTests();
            
            // 5. 显示使用指南
            this.showUsageGuide();
            
            console.log('\n✅ SQLite部署完成！数据持久化功能已就绪。');
            
        } catch (error) {
            console.error('❌ 启动失败:', error.message);
            process.exit(1);
        } finally {
            if (this.manager) {
                await this.manager.close();
            }
        }
    }
    
    /**
     * 环境检查
     */
    async checkEnvironment() {
        console.log('🔍 检查环境...');
        
        // 检查Node.js版本
        const nodeVersion = process.version;
        console.log(`   Node.js版本: ${nodeVersion}`);
        
        // 检查SQLite3模块
        try {
            require('sqlite3');
            console.log('   ✅ sqlite3模块已安装');
        } catch (error) {
            throw new Error('sqlite3模块未安装，请运行: npm install sqlite3');
        }
        
        // 检查目录结构
        const requiredDirs = ['./src', './src/core'];
        for (const dir of requiredDirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`   📁 创建目录: ${dir}`);
            }
        }
        
        console.log('   ✅ 环境检查通过');
    }
    
    /**
     * 配置初始化
     */
    async initializeConfig() {
        console.log('\n⚙️  初始化配置...');
        
        // 使用生产环境配置
        this.config = SQLiteConfig.getConfig('production');
        
        console.log(`   数据库路径: ${this.config.dbPath}`);
        console.log(`   备份路径: ${this.config.backupPath}`);
        console.log(`   WAL模式: ${this.config.enableWAL ? '启用' : '禁用'}`);
        console.log(`   缓存: ${this.config.enableCache ? '启用' : '禁用'}`);
        console.log(`   自动备份: ${this.config.autoBackup ? '启用' : '禁用'}`);
        
        console.log('   ✅ 配置初始化完成');
    }
    
    /**
     * 数据库初始化
     */
    async initializeDatabase() {
        console.log('\n🗄️  初始化数据库...');
        
        this.manager = new SQLitePersistenceManager(this.config);
        await this.manager.initialize();
        
        console.log('   ✅ 数据库初始化完成');
        console.log('   ✅ 数据表创建完成');
        console.log('   ✅ 索引创建完成');
    }
    
    /**
     * 功能测试
     */
    async runTests() {
        console.log('\n🧪 运行功能测试...');
        
        // 测试数据
        const testChart = {
            name: '测试命盘',
            birthInfo: {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                gender: '男',
                lunar: false
            },
            chartData: {
                palaces: [
                    { name: '命宫', stars: ['紫微', '天府'], position: 0 },
                    { name: '兄弟', stars: ['太阳'], position: 1 }
                ],
                stars: {
                    '紫微': { palace: '命宫', brightness: '庙' },
                    '天府': { palace: '命宫', brightness: '旺' }
                }
            },
            chartType: 'traditional',
            theme: 'classic',
            tags: ['测试', '示例'],
            notes: '这是一个测试命盘'
        };
        
        try {
            // 1. 保存命盘
            console.log('   📝 测试保存命盘...');
            const saveResult = await this.manager.saveChart(testChart);
            console.log(`   ✅ 命盘保存成功，ID: ${saveResult.id}`);
            
            // 2. 获取命盘
            console.log('   📖 测试获取命盘...');
            const retrievedChart = await this.manager.getChart(saveResult.id);
            console.log(`   ✅ 命盘获取成功: ${retrievedChart.name}`);
            
            // 3. 列出命盘
            console.log('   📋 测试列出命盘...');
            const chartList = await this.manager.listCharts({ limit: 10 });
            console.log(`   ✅ 找到 ${chartList.length} 个命盘`);
            
            // 4. 搜索命盘
            console.log('   🔍 测试搜索命盘...');
            const searchResults = await this.manager.searchCharts('测试');
            console.log(`   ✅ 搜索到 ${searchResults.length} 个命盘`);
            
            // 5. 统计信息
            console.log('   📊 测试统计信息...');
            const stats = await this.manager.getStats();
            console.log(`   ✅ 总计 ${stats.total} 个命盘`);
            
            // 6. 备份测试
            console.log('   💾 测试数据备份...');
            const backupResult = await this.manager.backup();
            console.log(`   ✅ 备份完成: ${path.basename(backupResult.path)}`);
            
            console.log('   ✅ 所有功能测试通过');
            
        } catch (error) {
            throw new Error(`功能测试失败: ${error.message}`);
        }
    }
    
    /**
     * 显示使用指南
     */
    showUsageGuide() {
        console.log('\n📖 使用指南');
        console.log('=' .repeat(50));
        
        console.log('\n1. 基本使用:');
        console.log('```javascript');
        console.log('const SQLitePersistenceManager = require(\'./src/core/sqlite-persistence\');');
        console.log('const { SQLiteConfig } = require(\'./persistence-config\');');
        console.log('');
        console.log('const config = SQLiteConfig.getConfig(\'production\');');
        console.log('const manager = new SQLitePersistenceManager(config);');
        console.log('await manager.initialize();');
        console.log('```');
        
        console.log('\n2. 保存命盘:');
        console.log('```javascript');
        console.log('const result = await manager.saveChart({');
        console.log('    name: \'张三命盘\',');
        console.log('    birthInfo: { year: 1990, month: 5, day: 15, hour: 14 },');
        console.log('    chartData: { /* 命盘数据 */ }');
        console.log('});');
        console.log('```');
        
        console.log('\n3. 查询命盘:');
        console.log('```javascript');
        console.log('const chart = await manager.getChart(chartId);');
        console.log('const charts = await manager.listCharts({ limit: 20 });');
        console.log('const results = await manager.searchCharts(\'张三\');');
        console.log('```');
        
        console.log('\n4. 数据备份:');
        console.log('```javascript');
        console.log('const backup = await manager.backup();');
        console.log('await manager.restore(backup.path);');
        console.log('```');
        
        console.log('\n📁 文件位置:');
        console.log(`   数据库: ${this.config.dbPath}`);
        console.log(`   备份: ${this.config.backupPath}`);
        
        console.log('\n🔧 配置选项:');
        console.log('   - 开发环境: SQLiteConfig.getConfig(\'development\')');
        console.log('   - 生产环境: SQLiteConfig.getConfig(\'production\')');
        console.log('   - 高性能: SQLiteConfig.getConfig(\'performance\')');
        
        console.log('\n📚 更多信息请查看:');
        console.log('   - SQLite部署指南.md');
        console.log('   - 数据持久化集成示例.md');
    }
}

// 命令行参数处理
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        interactive: false,
        clean: false
    };
    
    for (const arg of args) {
        switch (arg) {
            case '--interactive':
            case '-i':
                options.interactive = true;
                break;
            case '--clean':
            case '-c':
                options.clean = true;
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
                break;
        }
    }
    
    return options;
}

function showHelp() {
    console.log('SQLite快速启动脚本');
    console.log('');
    console.log('用法: node sqlite-quickstart.js [选项]');
    console.log('');
    console.log('选项:');
    console.log('  -i, --interactive    交互式配置生成');
    console.log('  -c, --clean         清理测试数据');
    console.log('  -h, --help          显示帮助信息');
    console.log('');
    console.log('示例:');
    console.log('  node sqlite-quickstart.js              # 标准启动');
    console.log('  node sqlite-quickstart.js --clean      # 清理后启动');
    console.log('  node sqlite-quickstart.js --interactive # 交互式配置');
}

// 清理测试数据
async function cleanTestData() {
    console.log('🧹 清理测试数据...');
    
    const dataDir = './data';
    if (fs.existsSync(dataDir)) {
        fs.rmSync(dataDir, { recursive: true, force: true });
        console.log('   ✅ 测试数据已清理');
    }
}

// 主程序
async function main() {
    const options = parseArgs();
    
    if (options.clean) {
        await cleanTestData();
    }
    
    const quickStart = new SQLiteQuickStart();
    await quickStart.start();
}

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('❌ 未捕获的异常:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未处理的Promise拒绝:', reason);
    process.exit(1);
});

// 启动
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 启动失败:', error.message);
        process.exit(1);
    });
}

module.exports = SQLiteQuickStart;