"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n"
import {
  BookOpen,
  Network,
  Zap,
  Settings,
  BarChart3,
  Layers,
  User,
  Mail,
  Phone,
  ChevronRight,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react"

export function UserGuide() {
  const { t, language } = useLanguage()
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", icon: BookOpen, title: language === "zh" ? "概述" : "Overview" },
    { id: "getting-started", icon: User, title: language === "zh" ? "快速开始" : "Getting Started" },
    { id: "graph", icon: Network, title: language === "zh" ? "知识图谱" : "Knowledge Graph" },
    { id: "actions", icon: Zap, title: language === "zh" ? "行动管理" : "Actions Management" },
    { id: "modules", icon: Settings, title: language === "zh" ? "模块自动化" : "Modules Automation" },
    { id: "dashboard", icon: BarChart3, title: language === "zh" ? "TFI仪表盘" : "TFI Dashboard" },
    { id: "workbench", icon: Layers, title: language === "zh" ? "工作台" : "Workbench" },
    { id: "tips", icon: Target, title: language === "zh" ? "使用技巧" : "Tips & Tricks" },
  ]

  const testAccounts = [
    {
      email: "demo.pm@timeweave.app",
      password: "TimeWeave2024!",
      role: language === "zh" ? "产品经理" : "Product Manager",
      description:
        language === "zh"
          ? "包含产品路线图、客户访谈、竞品分析等专业内容"
          : "Contains product roadmaps, customer interviews, competitive analysis",
    },
    {
      email: "demo.dev@timeweave.app",
      password: "TimeWeave2024!",
      role: language === "zh" ? "软件开发者" : "Software Developer",
      description:
        language === "zh"
          ? "包含技术架构、代码评审、学习计划等开发内容"
          : "Contains technical architecture, code reviews, learning plans",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">
            {language === "zh" ? "TimeWeave 用户指南" : "TimeWeave User Guide"}
          </h1>
          <p className="text-xl text-gray-300">
            {language === "zh"
              ? "掌握时间编织的艺术：过去可重写，现在可折叠，未来可预编译"
              : "Master the art of time weaving: Past can be rewritten, Present can be folded, Future can be pre-compiled"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-amber-400">{language === "zh" ? "目录" : "Contents"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === section.id ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {section.title}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {language === "zh" ? "TimeWeave 概述" : "TimeWeave Overview"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">
                      {language === "zh"
                        ? "TimeWeave 是一个革命性的生产力管理系统，基于三个核心理念构建："
                        : "TimeWeave is a revolutionary productivity management system built on three core concepts:"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Network className="w-5 h-5 text-blue-400 mr-2" />
                            <h3 className="font-semibold text-blue-400">
                              {language === "zh" ? "过去可重写" : "Past Can Be Rewritten"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            {language === "zh"
                              ? "通过知识图谱管理所有结构化素材，让过去的经验和知识可以被重新组织和利用。"
                              : "Manage all structured materials through knowledge graphs, making past experiences and knowledge reorganizable and reusable."}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Zap className="w-5 h-5 text-green-400 mr-2" />
                            <h3 className="font-semibold text-green-400">
                              {language === "zh" ? "现在可折叠" : "Present Can Be Folded"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            {language === "zh"
                              ? '通过行动折叠系统实现"一事多用"，将多个相关任务合并为高效的工作流。'
                              : 'Achieve "multi-purpose efficiency" through action folding system, combining multiple related tasks into efficient workflows.'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Settings className="w-5 h-5 text-purple-400 mr-2" />
                            <h3 className="font-semibold text-purple-400">
                              {language === "zh" ? "未来可预编译" : "Future Can Be Pre-compiled"}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            {language === "zh"
                              ? "通过模块自动化系统创建模板和触发器，让未来的工作可以被预先定义和自动执行。"
                              : "Create templates and triggers through module automation system, making future work pre-definable and automatically executable."}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400">
                      {language === "zh" ? "联系信息" : "Contact Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-amber-400 mr-2" />
                        <span>{language === "zh" ? "电话/微信" : "Phone/WeChat"}: 13112312211</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-amber-400 mr-2" />
                        <span>CTO: Bob Zheng</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-amber-400 mr-2" />
                        <span>Email: bob@happyshare.io</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "getting-started" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {language === "zh" ? "快速开始" : "Getting Started"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "测试账号" : "Test Accounts"}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {language === "zh"
                          ? "我们为您准备了两个测试账号，每个账号都包含丰富的演示数据："
                          : "We have prepared two test accounts with rich demo data for you:"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testAccounts.map((account, index) => (
                          <Card key={index} className="bg-gray-700 border-gray-600">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <Badge variant="outline" className="text-amber-400 border-amber-400">
                                  {account.role}
                                </Badge>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <strong>{language === "zh" ? "邮箱" : "Email"}:</strong> {account.email}
                                  </div>
                                  <div>
                                    <strong>{language === "zh" ? "密码" : "Password"}:</strong> {account.password}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400">{account.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "登录步骤" : "Login Steps"}
                      </h3>
                      <div className="space-y-3">
                        {[
                          language === "zh" ? "访问 TimeWeave 首页" : "Visit TimeWeave homepage",
                          language === "zh" ? '点击"登录"按钮' : 'Click "Sign In" button',
                          language === "zh" ? "输入测试账号的邮箱和密码" : "Enter test account email and password",
                          language === "zh" ? '点击"登录"完成认证' : 'Click "Sign In" to complete authentication',
                          language === "zh"
                            ? "开始探索 TimeWeave 的强大功能"
                            : "Start exploring TimeWeave's powerful features",
                        ].map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "graph" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Network className="w-5 h-5 mr-2" />
                      {language === "zh" ? "知识图谱 - 过去可重写" : "Knowledge Graph - Past Can Be Rewritten"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "zh"
                        ? "管理和组织您的所有知识资产，让过去的经验为现在服务"
                        : "Manage and organize all your knowledge assets, making past experiences serve the present"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">
                        {language === "zh" ? "核心功能" : "Core Features"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">
                              {language === "zh" ? "创建知识节点" : "Create Knowledge Nodes"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">
                              {language === "zh" ? "建立节点关联" : "Establish Node Connections"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">
                              {language === "zh" ? "标签分类管理" : "Tag Classification Management"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">{language === "zh" ? "全文搜索" : "Full-text Search"}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">{language === "zh" ? "可视化展示" : "Visual Display"}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">{language === "zh" ? "版本历史" : "Version History"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">
                        {language === "zh" ? "节点类型" : "Node Types"}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { type: language === "zh" ? "笔记" : "Notes", color: "bg-blue-600" },
                          { type: language === "zh" ? "文档" : "Documents", color: "bg-green-600" },
                          { type: language === "zh" ? "参考" : "References", color: "bg-purple-600" },
                          { type: language === "zh" ? "模板" : "Templates", color: "bg-orange-600" },
                        ].map((item, index) => (
                          <Badge key={index} className={`${item.color} text-white justify-center`}>
                            {item.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">
                        {language === "zh" ? "使用场景" : "Use Cases"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "项目知识库管理" : "Project knowledge base management"}</li>
                        <li>• {language === "zh" ? "学习笔记整理" : "Learning notes organization"}</li>
                        <li>• {language === "zh" ? "研究资料归档" : "Research material archiving"}</li>
                        <li>• {language === "zh" ? "团队知识共享" : "Team knowledge sharing"}</li>
                        <li>• {language === "zh" ? "创意灵感收集" : "Creative inspiration collection"}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "actions" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      {language === "zh" ? "行动管理 - 现在可折叠" : "Actions Management - Present Can Be Folded"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "zh"
                        ? "通过折叠技术将多个行动合并为高效工作流，实现一事多用"
                        : "Combine multiple actions into efficient workflows through folding technology, achieving multi-purpose efficiency"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        {language === "zh" ? "折叠概念" : "Folding Concept"}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {language === "zh"
                          ? "行动折叠是TimeWeave的核心创新，允许您将多个相关的行动项合并为一个高效的工作流。这样可以减少上下文切换，提高执行效率。"
                          : "Action folding is TimeWeave's core innovation, allowing you to combine multiple related action items into one efficient workflow. This reduces context switching and improves execution efficiency."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        {language === "zh" ? "行动状态" : "Action States"}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { status: language === "zh" ? "待处理" : "Pending", color: "bg-yellow-600" },
                          { status: language === "zh" ? "进行中" : "Active", color: "bg-blue-600" },
                          { status: language === "zh" ? "已折叠" : "Folded", color: "bg-purple-600" },
                          { status: language === "zh" ? "已完成" : "Completed", color: "bg-green-600" },
                        ].map((item, index) => (
                          <Badge key={index} className={`${item.color} text-white justify-center`}>
                            {item.status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        {language === "zh" ? "折叠操作步骤" : "Folding Operation Steps"}
                      </h3>
                      <div className="space-y-3">
                        {[
                          language === "zh" ? "选择多个相关的行动项" : "Select multiple related action items",
                          language === "zh" ? '点击"折叠选中项"按钮' : 'Click "Fold Selected Items" button',
                          language === "zh"
                            ? "系统自动分析并优化执行顺序"
                            : "System automatically analyzes and optimizes execution order",
                          language === "zh" ? "创建新的折叠行动项" : "Create new folded action item",
                          language === "zh" ? "执行优化后的工作流" : "Execute optimized workflow",
                        ].map((step, index) => (
                          <div key={index} className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm text-gray-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        {language === "zh" ? "折叠优势" : "Folding Advantages"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "减少上下文切换成本" : "Reduce context switching costs"}</li>
                        <li>• {language === "zh" ? "提高任务执行效率" : "Improve task execution efficiency"}</li>
                        <li>• {language === "zh" ? "优化时间资源配置" : "Optimize time resource allocation"}</li>
                        <li>• {language === "zh" ? "增强工作流连贯性" : "Enhance workflow coherence"}</li>
                        <li>• {language === "zh" ? "自动化重复性操作" : "Automate repetitive operations"}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "modules" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      {language === "zh"
                        ? "模块自动化 - 未来可预编译"
                        : "Modules Automation - Future Can Be Pre-compiled"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "zh"
                        ? "创建智能模板和触发器，让未来的工作自动化执行"
                        : "Create smart templates and triggers to automate future work execution"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">
                        {language === "zh" ? "模块类型" : "Module Types"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            type: language === "zh" ? "模板" : "Templates",
                            desc: language === "zh" ? "预定义的工作流模板" : "Predefined workflow templates",
                            color: "border-blue-500",
                          },
                          {
                            type: language === "zh" ? "自动化" : "Automations",
                            desc: language === "zh" ? "基于条件的自动执行" : "Condition-based auto execution",
                            color: "border-green-500",
                          },
                          {
                            type: language === "zh" ? "触发器" : "Triggers",
                            desc: language === "zh" ? "事件驱动的响应机制" : "Event-driven response mechanism",
                            color: "border-purple-500",
                          },
                          {
                            type: language === "zh" ? "工作流" : "Workflows",
                            desc: language === "zh" ? "复杂的多步骤流程" : "Complex multi-step processes",
                            color: "border-orange-500",
                          },
                        ].map((item, index) => (
                          <Card key={index} className={`bg-gray-700 border-2 ${item.color}`}>
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-white mb-1">{item.type}</h4>
                              <p className="text-xs text-gray-400">{item.desc}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">
                        {language === "zh" ? "触发条件" : "Trigger Conditions"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                          { condition: language === "zh" ? "时间触发" : "Time-based", icon: Clock },
                          { condition: language === "zh" ? "事件触发" : "Event-based", icon: Zap },
                          { condition: language === "zh" ? "条件触发" : "Condition-based", icon: Target },
                        ].map((item, index) => {
                          const Icon = item.icon
                          return (
                            <div key={index} className="flex items-center p-2 bg-gray-700 rounded">
                              <Icon className="w-4 h-4 text-purple-400 mr-2" />
                              <span className="text-sm">{item.condition}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">
                        {language === "zh" ? "自动化动作" : "Automation Actions"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "创建新的行动项" : "Create new action items"}</li>
                        <li>• {language === "zh" ? "生成知识图谱节点" : "Generate knowledge graph nodes"}</li>
                        <li>• {language === "zh" ? "发送通知提醒" : "Send notification reminders"}</li>
                        <li>• {language === "zh" ? "执行其他模块" : "Execute other modules"}</li>
                        <li>• {language === "zh" ? "更新数据状态" : "Update data status"}</li>
                        <li>• {language === "zh" ? "生成报告统计" : "Generate report statistics"}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">
                        {language === "zh" ? "应用场景" : "Application Scenarios"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "定期任务自动创建" : "Automatic creation of regular tasks"}</li>
                        <li>• {language === "zh" ? "项目里程碑提醒" : "Project milestone reminders"}</li>
                        <li>• {language === "zh" ? "数据备份和同步" : "Data backup and synchronization"}</li>
                        <li>• {language === "zh" ? "工作流程标准化" : "Workflow standardization"}</li>
                        <li>• {language === "zh" ? "智能推荐系统" : "Intelligent recommendation system"}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "dashboard" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {language === "zh" ? "TFI仪表盘 - 时间折叠指数" : "TFI Dashboard - Time Folding Index"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "zh"
                        ? "实时监控您的生产力指标，量化时间管理效果"
                        : "Real-time monitoring of your productivity metrics, quantifying time management effectiveness"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "TFI 计算公式" : "TFI Calculation Formula"}
                      </h3>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-lg font-mono text-amber-400 mb-2">
                              TFI = (Graph Score × 0.3) + (Actions Score × 0.4) + (Modules Score × 0.3)
                            </div>
                            <p className="text-xs text-gray-400">
                              {language === "zh"
                                ? "综合评估知识管理、行动执行和自动化程度"
                                : "Comprehensive assessment of knowledge management, action execution, and automation level"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "核心指标" : "Core Metrics"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            metric: language === "zh" ? "知识图谱活跃度" : "Graph Activity",
                            desc: language === "zh" ? "节点创建和连接频率" : "Node creation and connection frequency",
                            color: "text-blue-400",
                          },
                          {
                            metric: language === "zh" ? "行动折叠效率" : "Action Folding Efficiency",
                            desc: language === "zh" ? "折叠操作的时间节省" : "Time savings from folding operations",
                            color: "text-green-400",
                          },
                          {
                            metric: language === "zh" ? "自动化覆盖率" : "Automation Coverage",
                            desc: language === "zh" ? "自动化模块的执行比例" : "Execution ratio of automation modules",
                            color: "text-purple-400",
                          },
                        ].map((item, index) => (
                          <Card key={index} className="bg-gray-700 border-gray-600">
                            <CardContent className="p-4">
                              <h4 className={`font-semibold ${item.color} mb-1`}>{item.metric}</h4>
                              <p className="text-xs text-gray-400">{item.desc}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "生产力等级" : "Productivity Levels"}
                      </h3>
                      <div className="space-y-2">
                        {[
                          {
                            level: language === "zh" ? "时间大师" : "Time Master",
                            range: "90-100",
                            color: "bg-green-600",
                          },
                          {
                            level: language === "zh" ? "效率专家" : "Efficiency Expert",
                            range: "80-89",
                            color: "bg-blue-600",
                          },
                          {
                            level: language === "zh" ? "生产力达人" : "Productivity Pro",
                            range: "70-79",
                            color: "bg-purple-600",
                          },
                          { level: language === "zh" ? "进步中" : "Improving", range: "60-69", color: "bg-yellow-600" },
                          {
                            level: language === "zh" ? "起步阶段" : "Getting Started",
                            range: "0-59",
                            color: "bg-gray-600",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                              <span className="text-sm font-medium">{item.level}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.range}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "workbench" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Layers className="w-5 h-5 mr-2" />
                      {language === "zh" ? "工作台 - 统一视图" : "Workbench - Unified View"}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "zh"
                        ? "在一个界面中管理所有系统，实现跨系统协作"
                        : "Manage all systems in one interface, enabling cross-system collaboration"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "视图模式" : "View Modes"}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            mode: language === "zh" ? "网格视图" : "Grid View",
                            desc: language === "zh" ? "卡片式布局" : "Card-based layout",
                          },
                          {
                            mode: language === "zh" ? "列表视图" : "List View",
                            desc: language === "zh" ? "详细信息展示" : "Detailed information display",
                          },
                          {
                            mode: language === "zh" ? "时间线视图" : "Timeline View",
                            desc: language === "zh" ? "按时间排序" : "Sorted by time",
                          },
                          {
                            mode: language === "zh" ? "网络视图" : "Network View",
                            desc: language === "zh" ? "关系图展示" : "Relationship diagram",
                          },
                          {
                            mode: language === "zh" ? "看板视图" : "Kanban View",
                            desc: language === "zh" ? "状态流转" : "Status flow",
                          },
                          {
                            mode: language === "zh" ? "日历视图" : "Calendar View",
                            desc: language === "zh" ? "时间规划" : "Time planning",
                          },
                        ].map((item, index) => (
                          <Card key={index} className="bg-gray-700 border-gray-600">
                            <CardContent className="p-3">
                              <h4 className="font-semibold text-white text-sm mb-1">{item.mode}</h4>
                              <p className="text-xs text-gray-400">{item.desc}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "跨系统操作" : "Cross-system Operations"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>
                          • {language === "zh" ? "将知识节点关联到行动项" : "Link knowledge nodes to action items"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh" ? "从行动项创建自动化模块" : "Create automation modules from action items"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh" ? "基于模块生成知识模板" : "Generate knowledge templates based on modules"}
                        </li>
                        <li>
                          • {language === "zh" ? "统一搜索所有系统内容" : "Unified search across all system content"}
                        </li>
                        <li>
                          • {language === "zh" ? "批量操作多个系统对象" : "Batch operations on multiple system objects"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "智能推荐" : "Smart Recommendations"}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">
                        {language === "zh"
                          ? "工作台会根据您的使用模式和数据关联，智能推荐相关的操作和内容："
                          : "The workbench intelligently recommends related operations and content based on your usage patterns and data associations:"}
                      </p>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "相关知识节点推荐" : "Related knowledge node recommendations"}</li>
                        <li>• {language === "zh" ? "可折叠的行动项建议" : "Foldable action item suggestions"}</li>
                        <li>• {language === "zh" ? "自动化机会识别" : "Automation opportunity identification"}</li>
                        <li>• {language === "zh" ? "工作流优化建议" : "Workflow optimization suggestions"}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "tips" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      {language === "zh" ? "使用技巧与最佳实践" : "Tips & Best Practices"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        {language === "zh" ? "知识图谱优化" : "Knowledge Graph Optimization"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>
                          •{" "}
                          {language === "zh" ? "定期整理和更新节点内容" : "Regularly organize and update node content"}
                        </li>
                        <li>
                          • {language === "zh" ? "使用标签建立主题分类" : "Use tags to establish topic categories"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "建立节点间的有意义连接"
                            : "Establish meaningful connections between nodes"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "利用搜索功能快速定位信息"
                            : "Use search function to quickly locate information"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">
                        {language === "zh" ? "行动折叠策略" : "Action Folding Strategies"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "识别相似或相关的任务" : "Identify similar or related tasks"}</li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "考虑任务的时间和资源需求"
                            : "Consider time and resource requirements of tasks"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "优先折叠高频重复任务"
                            : "Prioritize folding high-frequency repetitive tasks"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "监控折叠效果并持续优化"
                            : "Monitor folding effectiveness and continuously optimize"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">
                        {language === "zh" ? "自动化设计原则" : "Automation Design Principles"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• {language === "zh" ? "从简单的重复任务开始" : "Start with simple repetitive tasks"}</li>
                        <li>• {language === "zh" ? "设置清晰的触发条件" : "Set clear trigger conditions"}</li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "测试自动化流程的可靠性"
                            : "Test the reliability of automation processes"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "定期审查和更新自动化规则"
                            : "Regularly review and update automation rules"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-400 mb-3">
                        {language === "zh" ? "生产力提升建议" : "Productivity Enhancement Suggestions"}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "每日查看TFI仪表盘了解进展"
                            : "Check TFI dashboard daily to understand progress"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh"
                            ? "利用工作台的统一视图管理任务"
                            : "Use workbench unified view to manage tasks"}
                        </li>
                        <li>
                          • {language === "zh" ? "建立个人的工作流程模板" : "Establish personal workflow templates"}
                        </li>
                        <li>
                          • {language === "zh" ? "与团队分享有效的实践经验" : "Share effective practices with team"}
                        </li>
                        <li>
                          •{" "}
                          {language === "zh" ? "持续学习和适应新功能" : "Continuously learn and adapt to new features"}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-3">
                        {language === "zh" ? "常见问题解决" : "Common Issues Resolution"}
                      </h3>
                      <div className="space-y-3">
                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-3">
                            <h4 className="font-semibold text-white text-sm mb-1">
                              {language === "zh" ? "问题：数据加载缓慢" : "Issue: Slow data loading"}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {language === "zh"
                                ? "解决：清理浏览器缓存，检查网络连接"
                                : "Solution: Clear browser cache, check network connection"}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-3">
                            <h4 className="font-semibold text-white text-sm mb-1">
                              {language === "zh" ? "问题：折叠操作失败" : "Issue: Folding operation failed"}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {language === "zh"
                                ? "解决：确保选择的行动项状态兼容"
                                : "Solution: Ensure selected action items have compatible status"}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-3">
                            <h4 className="font-semibold text-white text-sm mb-1">
                              {language === "zh" ? "问题：自动化模块未触发" : "Issue: Automation module not triggered"}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {language === "zh"
                                ? "解决：检查触发条件设置和模块状态"
                                : "Solution: Check trigger condition settings and module status"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
