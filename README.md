# TimeWeave - 时间编织者

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

> **折叠现在，预编译未来** - 一个革命性的时间管理和知识组织系统

## 🌟 项目概述

TimeWeave 是一个创新的个人生产力系统，通过独特的"时间折叠"概念，将传统的任务管理、知识图谱和自动化模块有机结合，帮助用户更高效地管理时间和知识。

### 核心理念

- **时间折叠 (Time Folding)**: 将多个相关任务折叠成一个高效的执行单元
- **知识编织 (Knowledge Weaving)**: 构建互联的知识网络，让信息产生协同效应
- **未来预编译 (Future Pre-compilation)**: 通过自动化模块提前处理未来的工作流程

## 🚀 主要功能

### 📊 统一工作台 (Workbench)
- **多视图展示**: 网格、列表、时间线、网络图、看板视图
- **统一搜索**: 跨系统的智能搜索功能
- **实时数据**: 所有系统数据的实时同步和展示

### 🕸️ 知识图谱 (Knowledge Graph)
- **节点管理**: 创建和管理笔记、文档、引用等知识节点
- **内联编辑**: 直接在卡片中编辑节点内容、标签
- **智能连接**: 建立知识点之间的关联关系
- **性能优化**: 防抖搜索，提升大量数据下的搜索体验

### ⚡ 行动折叠 (Action Folding)
- **智能折叠**: 将相关任务组合成高效的执行单元
- **状态管理**: 待处理、进行中、已折叠、已完成的完整生命周期
- **优先级系统**: 基于重要性和紧急性的智能优先级管理
- **时间估算**: 精确的时间预估和实际用时跟踪

### 🤖 模块自动化 (Module Automation)
- **模板系统**: 可重用的工作流程模板
- **触发器**: 基于时间、事件、条件的自动触发
- **自动化流程**: 复杂的多步骤自动化工作流
- **执行统计**: 详细的执行次数和性能分析

### 📈 TFI 仪表板 (Time Folding Index)
- **效率指标**: 实时计算的时间折叠效率指数
- **数据可视化**: 直观的图表展示系统使用情况
- **趋势分析**: 长期的效率趋势和改进建议

## 🛠️ 技术栈

### 前端技术
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Shadcn/ui** - 现代化的 UI 组件库
- **Lucide React** - 美观的图标库
- **Recharts** - 数据可视化图表库

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
  - PostgreSQL 数据库
  - 实时订阅
  - 用户认证
  - 行级安全策略

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Git** - 版本控制

## 🏗️ 项目结构

```
timeweave/
├── app/                    # Next.js App Router
│   ├── actions/           # 行动管理页面
│   ├── auth/              # 用户认证
│   ├── dashboard/         # TFI 仪表板
│   ├── graph/             # 知识图谱
│   ├── modules/           # 模块自动化
│   └── workbench/         # 统一工作台
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── *-dashboard.tsx   # 各系统仪表板
│   ├── *-card.tsx        # 数据卡片组件
│   └── create-*.tsx      # 创建表单组件
├── lib/                  # 工具库
│   └── supabase/         # Supabase 客户端配置
└── .kiro/               # Kiro IDE 配置
    └── specs/           # 项目规格文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/timeweave.git
cd timeweave
```

2. **安装依赖**
```bash
npm install --legacy-peer-deps
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加你的 Supabase 配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开 [http://localhost:3000](http://localhost:3000) 查看应用

### 数据库设置

在 Supabase 中创建以下表结构：

```sql
-- 知识图谱表
CREATE TABLE graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  connections TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 行动管理表
CREATE TABLE actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER DEFAULT 3,
  context JSONB DEFAULT '{}',
  folded_actions TEXT[] DEFAULT '{}',
  parent_action_id UUID REFERENCES actions(id),
  graph_connections TEXT[] DEFAULT '{}',
  estimated_time INTEGER,
  actual_time INTEGER,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 模块自动化表
CREATE TABLE modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  triggers JSONB DEFAULT '[]',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);
```

## 📖 使用指南

### 1. 知识图谱使用
- 创建不同类型的知识节点（笔记、文档、引用）
- 使用标签组织和分类知识
- 建立节点之间的连接关系
- 利用搜索功能快速找到相关内容

### 2. 行动折叠技巧
- 识别相关的任务并选择多个行动
- 使用折叠功能将它们组合成一个高效单元
- 设置合理的优先级和时间估算
- 跟踪折叠后的执行效果

### 3. 模块自动化设置
- 创建可重用的工作流程模板
- 设置基于时间或事件的触发条件
- 配置自动化执行的具体行动
- 监控模块的执行情况和效果

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 的代码规范
- 组件采用函数式编程和 React Hooks
- 使用 Tailwind CSS 进行样式开发

### 贡献流程
1. Fork 项目到你的 GitHub 账户
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📊 项目状态

### 已完成功能 ✅
- [x] 基础项目架构搭建
- [x] 用户认证系统
- [x] 知识图谱核心功能
- [x] 行动折叠系统
- [x] 模块自动化框架
- [x] 统一工作台界面
- [x] TFI 效率指标计算
- [x] 响应式设计适配

### 开发中功能 🚧
- [ ] 高级搜索功能
- [ ] 数据导入导出
- [ ] 移动端应用
- [ ] 团队协作功能

### 计划功能 📋
- [ ] AI 智能推荐
- [ ] 第三方集成 (Notion, Obsidian)
- [ ] 插件系统
- [ ] 数据分析报告

## 🤝 贡献者

感谢所有为 TimeWeave 项目做出贡献的开发者！

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [项目文档](https://timeweave-docs.vercel.app)
- [在线演示](https://timeweave.vercel.app)
- [问题反馈](https://github.com/your-username/timeweave/issues)
- [功能请求](https://github.com/your-username/timeweave/discussions)

## 💡 灵感来源

TimeWeave 的设计理念受到以下概念启发：
- **Getting Things Done (GTD)** - 大卫·艾伦的生产力方法论
- **Zettelkasten** - 卡片盒笔记法
- **Second Brain** - 构建第二大脑的知识管理理念
- **时间管理矩阵** - 史蒂芬·柯维的时间管理理论

---

**TimeWeave - 让时间成为你最好的朋友** ⏰✨