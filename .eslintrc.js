module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 基础规则
    'indent': 'off',
    'linebreak-style': 'off', // 关闭换行符检查，适应Windows环境
    'quotes': 'off',
    'semi': ['error', 'always'],

    // 变量相关
    'no-unused-vars': 'off', // 暂时关闭未使用变量检查
    'no-undef': 'error',

    // 代码质量
    'no-console': 'off', // 允许console.log用于调试
    'no-debugger': 'warn',
    'no-alert': 'warn',

    // 最佳实践
    'eqeqeq': 'warn', // 降级为警告
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-useless-escape': 'warn', // 降级为警告
    'no-case-declarations': 'warn', // 降级为警告

    // 代码风格 - 全部关闭以便快速发布
    'brace-style': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'key-spacing': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'spaced-comment': 'off'
  },
  globals: {
    // 如果使用了全局变量，在这里声明
    'process': 'readonly',
    'Buffer': 'readonly',
    '__dirname': 'readonly',
    '__filename': 'readonly',
    'module': 'readonly',
    'require': 'readonly',
    'exports': 'readonly',
    'document': 'readonly', // 浏览器环境
    'window': 'readonly' // 浏览器环境
  }
};