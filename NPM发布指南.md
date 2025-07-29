# NPM 发布指南

## 📦 发布前准备

### 1. 完善项目信息

在发布前，请确保更新 `package.json` 中的以下信息：

```json
{
  "author": {
    "name": "你的姓名",
    "email": "你的邮箱@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/你的用户名/ziwei-mcp.git"
  },
  "homepage": "https://github.com/你的用户名/ziwei-mcp#readme",
  "bugs": {
    "url": "https://github.com/你的用户名/ziwei-mcp/issues"
  }
}
```

### 2. 创建 NPM 账户

如果还没有 NPM 账户，请先注册：

```bash
# 注册 NPM 账户
npm adduser

# 或者登录现有账户
npm login
```

### 3. 验证登录状态

```bash
# 检查当前登录用户
npm whoami
```

## 🚀 发布流程

### 1. 代码质量检查

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 运行测试
npm run test
```

### 2. 版本管理

```bash
# 更新补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 更新次要版本 (1.0.0 -> 1.1.0)
npm version minor

# 更新主要版本 (1.0.0 -> 2.0.0)
npm version major
```

### 3. 预发布检查

```bash
# 模拟发布，查看将要发布的文件
npm run publish:dry
```

### 4. 正式发布

```bash
# 发布到 NPM
npm publish

# 如果是第一次发布公开包
npm publish --access public
```

## 📋 发布检查清单

- [ ] 更新了 `package.json` 中的作者信息
- [ ] 更新了仓库地址和主页链接
- [ ] 确认版本号正确
- [ ] 运行了代码检查和测试
- [ ] 检查了 `.npmignore` 文件
- [ ] 确认 `README.md` 内容完整
- [ ] 登录了 NPM 账户
- [ ] 运行了 `npm run publish:dry` 预检查

## 🔧 发布后管理

### 查看包信息

```bash
# 查看包的详细信息
npm view ziwei-mcp

# 查看包的版本历史
npm view ziwei-mcp versions --json
```

### 更新包

```bash
# 发布新版本
npm version patch && npm publish
```

### 撤销发布（仅限发布后24小时内）

```bash
# 撤销特定版本
npm unpublish ziwei-mcp@1.0.0

# 撤销整个包（谨慎使用）
npm unpublish ziwei-mcp --force
```

## 📝 注意事项

1. **包名唯一性**: 确保包名 `ziwei-mcp` 在 NPM 上是唯一的
2. **版本号规范**: 遵循语义化版本控制 (SemVer)
3. **文件大小**: 注意包的大小，避免包含不必要的文件
4. **依赖管理**: 确保所有依赖都在 `package.json` 中正确声明
5. **文档完整**: 保持 README.md 的准确性和完整性

## 🔗 相关链接

- [NPM 官方文档](https://docs.npmjs.com/)
- [语义化版本控制](https://semver.org/lang/zh-CN/)
- [NPM 包发布最佳实践](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## 🆘 常见问题

### Q: 包名已存在怎么办？
A: 可以使用作用域包名，如 `@yourusername/ziwei-mcp`

### Q: 发布失败怎么办？
A: 检查网络连接、NPM 登录状态和包名冲突

### Q: 如何发布私有包？
A: 使用 `npm publish --access restricted` 或配置 `.npmrc` 文件

### Q: 如何设置发布标签？
A: 使用 `npm publish --tag beta` 发布测试版本