#!/bin/bash

# TimeWeave 项目提交准备脚本
# 此脚本会在提交前运行必要的检查和清理

echo "🚀 准备提交 TimeWeave 项目..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 清理临时文件
echo "🧹 清理临时文件..."
rm -rf .next
rm -rf out
rm -rf dist
rm -rf node_modules/.cache

# 检查环境变量文件
echo "🔍 检查环境变量配置..."
if [ ! -f ".env.example" ]; then
    echo "❌ 错误：缺少 .env.example 文件"
    exit 1
fi

# 确保 .env.local 不会被提交
if git ls-files --error-unmatch .env.local 2>/dev/null; then
    echo "❌ 错误：.env.local 文件不应该被提交"
    echo "请运行：git rm --cached .env.local"
    exit 1
fi

# 运行代码检查
echo "🔍 运行代码检查..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ 代码检查失败，请修复后再提交"
    exit 1
fi

# 运行类型检查
echo "🔍 运行 TypeScript 类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ 类型检查失败，请修复后再提交"
    exit 1
fi

# 尝试构建项目
echo "🏗️ 测试项目构建..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败，请修复后再提交"
    exit 1
fi

# 检查重要文件是否存在
echo "📋 检查必要文件..."
required_files=(
    "README.md"
    "package.json"
    "tsconfig.json"
    "tailwind.config.ts"
    "next.config.js"
    ".gitignore"
    "DEPLOYMENT.md"
    "CONTRIBUTING.md"
    "LICENSE"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少必要文件：$file"
        exit 1
    fi
done

echo "✅ 所有检查通过！"
echo ""
echo "📝 提交建议："
echo "1. 确保你的提交信息遵循 Conventional Commits 规范"
echo "2. 例如：feat: add mobile navigation"
echo "3. 例如：fix: resolve authentication issues"
echo "4. 例如：docs: update deployment guide"
echo ""
echo "🎉 项目已准备好提交到 GitHub！"
echo ""
echo "下一步："
echo "git add ."
echo "git commit -m \"feat: implement enhanced UX and mobile optimization\""
echo "git push origin main"