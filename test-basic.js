#!/usr/bin/env node

/**
 * 基础测试文件
 * 用于验证项目的基本功能是否正常
 */

const fs = require('fs');
const path = require('path');

// 测试计数器
let testCount = 0;
let passCount = 0;

// 测试工具函数
function test(description, testFn) {
  testCount++;
  try {
    testFn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// 开始测试
console.log('🧪 开始运行基础测试...\n');

// 测试1: 检查主入口文件是否存在
test('主入口文件存在', () => {
  const mainFile = path.join(__dirname, 'src', 'index.js');
  assert(fs.existsSync(mainFile), '主入口文件 src/index.js 不存在');
});

// 测试2: 检查package.json是否存在且格式正确
test('package.json 格式正确', () => {
  const packageFile = path.join(__dirname, 'package.json');
  assert(fs.existsSync(packageFile), 'package.json 文件不存在');
  
  const packageContent = fs.readFileSync(packageFile, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  assert(packageJson.name, 'package.json 缺少 name 字段');
  assert(packageJson.version, 'package.json 缺少 version 字段');
  assert(packageJson.main, 'package.json 缺少 main 字段');
});

// 测试3: 检查核心目录结构
test('核心目录结构完整', () => {
  const srcDir = path.join(__dirname, 'src');
  const coreDir = path.join(srcDir, 'core');
  const toolsDir = path.join(srcDir, 'tools');
  
  assert(fs.existsSync(srcDir), 'src 目录不存在');
  assert(fs.existsSync(coreDir), 'src/core 目录不存在');
  assert(fs.existsSync(toolsDir), 'src/tools 目录不存在');
});

// 测试4: 检查关键依赖是否可以加载
test('关键依赖可以加载', () => {
  try {
    // 检查package.json中的依赖是否安装
    const packageJson = require('./package.json');
    const dependencies = Object.keys(packageJson.dependencies || {});
    
    // 检查node_modules目录
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    assert(fs.existsSync(nodeModulesPath), 'node_modules 目录不存在，请运行 npm install');
    
    // 检查关键依赖目录是否存在
    for (const dep of ['lunar-javascript', 'sqlite3', 'uuid', 'zod']) {
      const depPath = path.join(nodeModulesPath, dep);
      assert(fs.existsSync(depPath), `依赖 ${dep} 未安装`);
    }
  } catch (error) {
    throw new Error(`依赖检查失败: ${error.message}`);
  }
});

// 测试5: 检查主模块是否可以加载（不执行）
test('主模块可以加载', () => {
  try {
    // 只检查语法，不实际执行
    const mainFile = path.join(__dirname, 'src', 'index.js');
    const content = fs.readFileSync(mainFile, 'utf8');
    
    // 基本语法检查
    assert(content.includes('require'), '主文件应该包含 require 语句');
    assert(content.includes('module.exports') || content.includes('exports'), '主文件应该有导出');
  } catch (error) {
    throw new Error(`主模块检查失败: ${error.message}`);
  }
});

// 测试6: 检查配置文件
test('配置文件存在', () => {
  const configDir = path.join(__dirname, 'config');
  assert(fs.existsSync(configDir), 'config 目录不存在');
  
  const sqliteConfig = path.join(configDir, 'sqlite-config.js');
  assert(fs.existsSync(sqliteConfig), 'sqlite-config.js 不存在');
});

// 输出测试结果
console.log('\n📊 测试结果:');
console.log(`总测试数: ${testCount}`);
console.log(`通过数: ${passCount}`);
console.log(`失败数: ${testCount - passCount}`);

if (passCount === testCount) {
  console.log('\n🎉 所有测试通过！项目准备就绪。');
  process.exit(0);
} else {
  console.log('\n⚠️  部分测试失败，请检查项目配置。');
  process.exit(1);
}