# Supabase 设置指南

## 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project" 或 "New Project"
3. 选择组织并创建新项目
4. 等待项目初始化完成

## 2. 获取API密钥

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 选择 "API"
3. 复制以下信息：
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJ...` (公开密钥)

## 3. 配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. 创建数据库表

在Supabase SQL编辑器中执行以下SQL：

```sql
-- 启用RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- 创建知识图谱表
CREATE TABLE IF NOT EXISTS graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'note',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  connections TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建行动管理表
CREATE TABLE IF NOT EXISTS actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER DEFAULT 3,
  context JSONB DEFAULT '{}',
  folded_actions TEXT[] DEFAULT '{}',
  parent_action_id UUID REFERENCES actions(id) ON DELETE SET NULL,
  graph_connections TEXT[] DEFAULT '{}',
  estimated_time INTEGER,
  actual_time INTEGER,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建模块自动化表
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'template',
  config JSONB DEFAULT '{}',
  triggers JSONB DEFAULT '[]',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为每个表添加更新时间触发器
CREATE TRIGGER update_graph_updated_at BEFORE UPDATE ON graph
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 5. 设置行级安全策略 (RLS)

```sql
-- 启用RLS
ALTER TABLE graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "Users can view own graph nodes" ON graph
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own graph nodes" ON graph
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own graph nodes" ON graph
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own graph nodes" ON graph
    FOR DELETE USING (auth.uid() = user_id);

-- Actions表策略
CREATE POLICY "Users can view own actions" ON actions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions" ON actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actions" ON actions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own actions" ON actions
    FOR DELETE USING (auth.uid() = user_id);

-- Modules表策略
CREATE POLICY "Users can view own modules" ON modules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own modules" ON modules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own modules" ON modules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own modules" ON modules
    FOR DELETE USING (auth.uid() = user_id);
```

## 6. 配置认证

1. 在Supabase仪表板中，转到 "Authentication" > "Settings"
2. 配置允许的认证方式（邮箱/密码）
3. 设置站点URL为你的域名（开发环境: `http://localhost:3000`）

## 7. 测试连接

重启开发服务器：
```bash
npm run dev
```

访问 `http://localhost:3000`，如果配置正确，你应该能看到登录页面而不是错误信息。

## 故障排除

### 常见问题：

1. **环境变量未生效**
   - 确保 `.env.local` 文件在项目根目录
   - 重启开发服务器
   - 检查变量名是否正确（必须以 `NEXT_PUBLIC_` 开头）

2. **数据库连接失败**
   - 检查项目URL和API密钥是否正确
   - 确保Supabase项目状态为活跃

3. **RLS策略问题**
   - 确保已启用RLS并创建了正确的策略
   - 检查用户是否已登录

4. **CORS错误**
   - 在Supabase设置中添加你的域名到允许的源

## Vercel部署配置

在Vercel项目设置中添加环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`