# TimeWeave 快速开始指南

## 🚀 5分钟快速部署

### 方法一：Vercel 一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/timeweave)

1. 点击上方按钮
2. 连接你的 GitHub 账户
3. 部署完成！

### 方法二：本地运行

```bash
# 1. 克隆项目
git clone https://github.com/your-username/timeweave.git
cd timeweave

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
open http://localhost:3000
```

## 🎯 核心功能演示

### 1. 认证系统
- 访问 `/auth/login` 体验登录
- 访问 `/auth/signup` 体验注册
- 点击"演示模式"无需注册直接体验

### 2. 移动端优化
- 在手机上打开网站
- 体验底部导航
- 尝试滑动操作
- 测试下拉刷新

### 3. 错误处理
- 断开网络连接
- 观察自动重试机制
- 体验离线提示

### 4. 响应式设计
- 调整浏览器窗口大小
- 观察布局自适应变化
- 测试不同设备尺寸

## 📱 移动端体验

在移动设备上访问以下页面：

1. **首页** (`/`) - 响应式营销页面
2. **演示页** (`/demo`) - 交互式功能展示
3. **仪表板** (`/dashboard`) - 移动优化的工作台

### 移动端特色功能：
- 🔄 下拉刷新
- 👆 滑动操作
- 📱 底部导航
- 🎯 浮动操作按钮
- 👆 长按菜单

## 🛠️ 自定义配置

### 环境变量（可选）

创建 `.env.local` 文件：

```bash
# Supabase 配置（可选，用于数据持久化）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**注意：** 即使不配置 Supabase，应用也能正常运行（演示模式）

### 主题自定义

编辑 `tailwind.config.ts` 自定义颜色主题：

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主色调
      }
    }
  }
}
```

## 🎨 界面预览

### 桌面端
- 水平导航栏
- 多列卡片布局
- 侧边栏菜单

### 移动端
- 折叠式导航
- 单列卡片布局
- 底部标签栏

### 平板端
- 混合式导航
- 双列布局
- 适配触摸操作

## 🔧 开发模式

```bash
# 开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建测试
npm run build

# 预览构建结果
npm run preview
```

## 📊 性能特性

- ⚡ **快速加载**: Next.js 13+ App Router
- 🎯 **智能缓存**: 自动优化资源加载
- 📱 **移动优先**: 针对移动设备优化
- 🔄 **离线支持**: 网络断开时的优雅降级
- 🛡️ **错误恢复**: 自动重试和错误边界

## 🎯 使用场景

### 个人用户
- 任务管理和时间规划
- 知识笔记和关联
- 工作流程自动化

### 团队协作
- 项目进度跟踪
- 知识库建设
- 流程标准化

### 开发者
- 代码架构参考
- UI 组件库使用
- 移动端开发实践

## 🆘 常见问题

### Q: 为什么有些功能需要登录？
A: 点击"演示模式"可以无需注册体验所有功能。

### Q: 移动端体验如何？
A: 项目采用移动优先设计，在手机上体验更佳。

### Q: 如何自定义主题？
A: 编辑 Tailwind 配置文件即可自定义颜色和样式。

### Q: 支持哪些浏览器？
A: 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge。

## 🔗 相关链接

- [完整文档](./README.md)
- [部署指南](./DEPLOYMENT.md)
- [贡献指南](./CONTRIBUTING.md)
- [更新日志](./CHANGELOG.md)

---

**开始你的 TimeWeave 之旅！** 🎉