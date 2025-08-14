"use client"

// Internationalization support for TimeWeave
// TimeWeave国际化支持

import { useState, useEffect } from "react"

export type Language = "en" | "zh"

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      graph: "Graph",
      actions: "Actions",
      modules: "Modules",
      workbench: "Workbench",
      guide: "User Guide", // Added guide translation
      signOut: "Sign Out",
      signIn: "Sign In",
      signUp: "Sign Up",
    },
    // Common
    common: {
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      search: "Search",
      filter: "Filter",
      loading: "Loading...",
      noData: "No data available",
      error: "An error occurred",
      success: "Success",
      title: "Title",
      description: "Description",
      tags: "Tags",
      priority: "Priority",
      status: "Status",
      type: "Type",
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
    // Dashboard
    dashboard: {
      title: "TimeWeave Dashboard",
      subtitle: "Your productivity insights at a glance",
      tfiScore: "TFI Score",
      systemDistribution: "System Distribution",
      productivityLevel: "Productivity Level",
      insights: "Insights & Recommendations",
      trends: "Productivity Trends",
    },
    // Graph
    graph: {
      title: "Knowledge Graph",
      subtitle: "Past can be rewritten - Manage your structured knowledge",
      createNode: "Create Node",
      totalNodes: "Total Nodes",
      nodeTypes: {
        note: "Note",
        document: "Document",
        reference: "Reference",
        template: "Template",
      },
    },
    // Actions
    actions: {
      title: "Actions",
      subtitle: "Present can be folded - Optimize your workflows",
      createAction: "Create Action",
      foldActions: "Fold Actions",
      totalActions: "Total Actions",
      statusTypes: {
        pending: "Pending",
        active: "Active",
        completed: "Completed",
        folded: "Folded",
      },
    },
    // Modules
    modules: {
      title: "Modules",
      subtitle: "Future can be pre-compiled - Automate your processes",
      createModule: "Create Module",
      totalModules: "Total Modules",
      moduleTypes: {
        automation: "Automation",
        template: "Template",
        trigger: "Trigger",
        workflow: "Workflow",
      },
    },
  },
  zh: {
    // 导航
    nav: {
      dashboard: "仪表盘",
      graph: "知识图谱",
      actions: "行动管理",
      modules: "模块自动化",
      workbench: "工作台",
      guide: "用户指南", // Added guide translation
      signOut: "退出登录",
      signIn: "登录",
      signUp: "注册",
    },
    // 通用
    common: {
      create: "创建",
      edit: "编辑",
      delete: "删除",
      save: "保存",
      cancel: "取消",
      search: "搜索",
      filter: "筛选",
      loading: "加载中...",
      noData: "暂无数据",
      error: "发生错误",
      success: "成功",
      title: "标题",
      description: "描述",
      tags: "标签",
      priority: "优先级",
      status: "状态",
      type: "类型",
      createdAt: "创建时间",
      updatedAt: "更新时间",
    },
    // 仪表盘
    dashboard: {
      title: "TimeWeave 仪表盘",
      subtitle: "一目了然的生产力洞察",
      tfiScore: "TFI 指数",
      systemDistribution: "系统分布",
      productivityLevel: "生产力水平",
      insights: "洞察与建议",
      trends: "生产力趋势",
    },
    // 知识图谱
    graph: {
      title: "知识图谱",
      subtitle: "过去可重写 - 管理你的结构化知识",
      createNode: "创建节点",
      totalNodes: "节点总数",
      nodeTypes: {
        note: "笔记",
        document: "文档",
        reference: "参考",
        template: "模板",
      },
    },
    // 行动管理
    actions: {
      title: "行动管理",
      subtitle: "现在可折叠 - 优化你的工作流程",
      createAction: "创建行动",
      foldActions: "折叠行动",
      totalActions: "行动总数",
      statusTypes: {
        pending: "待处理",
        active: "进行中",
        completed: "已完成",
        folded: "已折叠",
      },
    },
    // 模块自动化
    modules: {
      title: "模块自动化",
      subtitle: "未来可预编译 - 自动化你的流程",
      createModule: "创建模块",
      totalModules: "模块总数",
      moduleTypes: {
        automation: "自动化",
        template: "模板",
        trigger: "触发器",
        workflow: "工作流",
      },
    },
  },
}

export function useTranslation(lang: Language = "en") {
  return translations[lang]
}

export function detectLanguage(): Language {
  if (typeof window !== "undefined") {
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith("zh") ? "zh" : "en"
  }
  return "en"
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("timeweave-language") as Language
      setLanguage(savedLang || detectLanguage())
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("timeweave-language", newLanguage)
    }
  }

  const t = useTranslation(language)

  return {
    language,
    setLanguage: changeLanguage,
    t,
  }
}
