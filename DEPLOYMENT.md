# TimeWeave 部署指南

## 🚀 快速部署到Vercel

### 1. 准备工作
确保你已经：
- ✅ 代码已推送到GitHub
- ✅ 有Vercel账户
- ✅ 有Supabase项目（可选，应用可以在没有Supabase的情况下运行）

### 2. 部署步骤

#### 方法一：通过Vercel仪表板
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库：`leavenotrace/timemeave`
4. Vercel会自动检测Next.js项目
5. 点击 "Deploy"

#### 方法二：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 在项目目录中运行
vercel

# 按照提示完成部署
```

### 3. 配置环境变量（可选）

如果你想启用完整功能，需要在Vercel项目设置中添加环境变量：

1. 在Vercel项目仪表板中，转到 "Settings" > "Environment Variables"
2. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 重新部署
添加环境变量后，触发重新部署：
- 在Vercel仪表板中点击 "Redeploy"
- 或者推送新的提交到GitHub

## 🔧 本地开发

### 启动开发服务器
```bash
npm run dev
```

### 构建测试
```bash
npm run build
npm start
```

## 📊 功能状态

### ✅ 无需Supabase即可使用的功能：
- 首页展示
- 用户界面导航
- 组件展示（使用虚拟数据）
- 响应式设计

### 🔑 需要Supabase的功能：
- 用户注册/登录
- 数据持久化
- 知识图谱节点管理
- 行动折叠功能
- 模块自动化

## 🌐 部署后的URL

部署完成后，你会得到一个类似这样的URL：
- `https://timemeave.vercel.app`
- `https://timemeave-git-main-username.vercel.app`

## 🐛 故障排除

### 常见问题：

1. **构建失败**
   - 检查依赖是否正确安装
   - 确保使用了 `--legacy-peer-deps` 标志

2. **环境变量未生效**
   - 确保变量名以 `NEXT_PUBLIC_` 开头
   - 在Vercel中重新部署

3. **Supabase连接问题**
   - 检查URL和API密钥是否正确
   - 确保Supabase项目状态为活跃

4. **字体加载问题**
   - 已在layout.tsx中添加预加载链接
   - 如果仍有问题，检查网络连接

## 📈 性能优化

应用已经包含以下优化：
- ✅ 静态页面预渲染
- ✅ 动态导入和代码分割
- ✅ 图片和字体优化
- ✅ 防抖搜索
- ✅ 记忆化组件

## 🔄 持续部署

每次推送到main分支都会自动触发Vercel部署：
```bash
git add .
git commit -m "your changes"
git push origin main
```

## 📞 支持

如果遇到问题：
1. 检查Vercel部署日志
2. 查看浏览器控制台错误
3. 参考 `SUPABASE_SETUP.md` 配置数据库
4. 联系开发者：bob@happyshare.io