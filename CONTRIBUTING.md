# 贡献指南

感谢你对 TimeWeave 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🎨 UI/UX 改进

## 🚀 快速开始

### 环境准备

1. **Fork 项目**
   - 点击 GitHub 页面右上角的 "Fork" 按钮

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/timeweave.git
   cd timeweave
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 添加你的配置
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 📋 开发规范

### 代码风格

我们使用以下工具确保代码质量：

- **TypeScript**: 类型安全
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Tailwind CSS**: 样式规范

### 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型说明：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**
```bash
feat(auth): add social login support
fix(mobile): resolve touch interaction issues
docs(readme): update installation instructions
```

### 分支策略

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成新功能
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `docs/*`: 文档分支

## 🔄 贡献流程

### 1. 创建 Issue

在开始开发前，请先创建一个 Issue 描述：
- 问题的详细描述
- 重现步骤（如果是 Bug）
- 期望的行为
- 相关截图或日志

### 2. 创建分支

```bash
# 从 develop 分支创建新分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 3. 开发和测试

```bash
# 运行开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码风格问题
npm run lint:fix

# 构建测试
npm run build
```

### 4. 提交代码

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写 PR 模板
3. 等待代码审查
4. 根据反馈进行修改

## 🧪 测试指南

### 手动测试

在提交 PR 前，请确保：

- [ ] 功能在桌面端正常工作
- [ ] 功能在移动端正常工作
- [ ] 错误处理正确显示
- [ ] 加载状态正常显示
- [ ] 网络断开时的行为正确
- [ ] 无控制台错误或警告

### 测试清单

**认证功能：**
- [ ] 登录/注册流程
- [ ] 演示模式
- [ ] 登出功能
- [ ] 错误处理

**响应式设计：**
- [ ] 移动端导航
- [ ] 触摸交互
- [ ] 卡片布局
- [ ] 表单输入

**错误处理：**
- [ ] 网络错误重试
- [ ] 错误边界捕获
- [ ] 用户友好提示
- [ ] 加载状态

## 📁 项目结构

```
timeweave/
├── app/                    # Next.js App Router 页面
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 仪表板
│   └── demo/              # 演示页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── providers/        # Context 提供者
│   └── demo/             # 演示组件
├── lib/                  # 工具库和配置
│   ├── hooks/           # 自定义 Hooks
│   ├── supabase/        # 数据库配置
│   └── auth/            # 认证工具
├── .kiro/               # Kiro IDE 配置
└── docs/                # 文档文件
```

## 🎯 贡献重点

我们特别欢迎以下方面的贡献：

### 高优先级
- 🐛 Bug 修复
- 📱 移动端体验优化
- ♿ 无障碍功能改进
- 🌐 国际化支持
- 🔒 安全性增强

### 中优先级
- ✨ 新功能开发
- 🎨 UI/UX 改进
- ⚡ 性能优化
- 📚 文档完善

### 低优先级
- 🧪 测试覆盖
- 🔧 开发工具改进
- 📦 依赖更新

## 💡 功能建议

如果你有新功能的想法：

1. **搜索现有 Issues** 确保没有重复
2. **创建功能请求 Issue** 详细描述：
   - 功能的用途和价值
   - 具体的实现建议
   - 可能的替代方案
   - 相关的截图或原型

## 🐛 Bug 报告

报告 Bug 时请包含：

- **环境信息**: 操作系统、浏览器版本
- **重现步骤**: 详细的操作步骤
- **期望行为**: 应该发生什么
- **实际行为**: 实际发生了什么
- **截图/录屏**: 如果适用
- **控制台日志**: 相关的错误信息

## 📞 获取帮助

如果你在贡献过程中遇到问题：

- 📧 发送邮件到 [your-email@example.com]
- 💬 在相关 Issue 中留言
- 🔍 查看现有的 Issues 和 Discussions

## 🏆 贡献者认可

我们会在以下地方认可贡献者：

- README.md 中的贡献者列表
- 发布说明中的特别感谢
- 项目网站的贡献者页面

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

**感谢你的贡献！** 🎉

每一个贡献都让 TimeWeave 变得更好！