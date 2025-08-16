# TimeWeave 部署指南

## 🚀 快速部署

### Vercel 部署（推荐）

1. **Fork 项目到你的 GitHub 账户**

2. **连接到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录
   - 点击 "New Project"
   - 选择你 fork 的 TimeWeave 项目

3. **配置环境变量**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### Netlify 部署

1. **连接 GitHub 仓库**
   - 登录 [netlify.com](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 并授权
   - 选择 TimeWeave 项目

2. **构建设置**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

3. **环境变量**
   在 Site settings > Environment variables 中添加：
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🗄️ 数据库设置

### Supabase 配置

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 记录项目 URL 和 anon key

2. **运行数据库迁移**
   ```sql
   -- 参考 SUPABASE_SETUP.md 中的完整 SQL 脚本
   ```

3. **配置行级安全策略 (RLS)**
   ```sql
   -- 为所有表启用 RLS
   ALTER TABLE graph ENABLE ROW LEVEL SECURITY;
   ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
   
   -- 创建用户访问策略
   CREATE POLICY "Users can only see their own data" ON graph
     FOR ALL USING (auth.uid() = user_id);
   ```

## 🔧 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/timeweave.git
   cd timeweave
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local`：
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开 [http://localhost:3000](http://localhost:3000)

## 🎯 演示模式

TimeWeave 支持无需数据库的演示模式：

- 如果未配置 Supabase 环境变量，应用会自动使用模拟数据
- 所有功能都可以正常使用，但数据不会持久化
- 适合快速体验和开发测试

## 📊 性能优化

### 构建优化
```bash
# 分析构建包大小
npm run build
npm run analyze

# 优化图片
# 使用 Next.js Image 组件自动优化
```

### 缓存策略
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## 🔒 安全配置

### 环境变量安全
- 永远不要在客户端代码中暴露私钥
- 使用 `NEXT_PUBLIC_` 前缀的变量会暴露给客户端
- 敏感配置应该在服务器端处理

### Supabase 安全
```sql
-- 启用行级安全策略
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "policy_name" ON your_table
  FOR operation USING (condition);
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **Supabase 连接问题**
   - 检查环境变量是否正确设置
   - 确认 Supabase 项目状态
   - 验证 API 密钥权限

3. **样式问题**
   ```bash
   # 重新构建 Tailwind CSS
   npm run build:css
   ```

### 日志调试
```javascript
// 启用详细日志
console.log('Environment:', process.env.NODE_ENV)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## 📈 监控和分析

### Vercel Analytics
```javascript
// 在 _app.tsx 中添加
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### 错误监控
项目已集成完整的错误处理系统：
- 多层错误边界
- 网络状态监控
- 用户友好的错误提示
- 自动重试机制

## 🔄 持续集成

### GitHub Actions 示例
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
```

## 📞 支持

如果遇到部署问题：
1. 检查 [GitHub Issues](https://github.com/your-username/timeweave/issues)
2. 查看 [部署日志](https://vercel.com/dashboard)
3. 参考 [Next.js 部署文档](https://nextjs.org/docs/deployment)
4. 查看 [Supabase 文档](https://supabase.com/docs)

---

**祝你部署顺利！** 🎉