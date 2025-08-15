"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n"
import GraphDashboard from "@/components/graph-dashboard"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { language, setLanguage, t } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    // 检查用户认证状态
    const checkUser = async () => {
      try {
        if (!supabase) {
          setUser(null)
          setLoading(false)
          return
        }
        
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error checking user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // 监听认证状态变化
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  // 防止水合错误，在客户端挂载前显示加载状态
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-amber-400 text-xl">{t.common.loading}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="flex justify-end p-4">
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-lg mx-auto px-4">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-amber-400">TimeWeave</h1>
              <p className="text-slate-300 text-xl">
                {language === "zh" ? "时间编织 - 重构你的生产力" : "Weave Your Time - Restructure Your Productivity"}
              </p>
            </div>

            <div className="space-y-4 text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-lg">
                  {language === "zh" ? "过去可重写 - 知识图谱管理" : "Past can be rewritten - Knowledge Graph"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-lg">
                  {language === "zh" ? "现在可折叠 - 行动效率优化" : "Present can be folded - Action Optimization"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-lg">
                  {language === "zh" ? "未来可预编译 - 自动化模块" : "Future can be pre-compiled - Automation"}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-amber-600/30 rounded-lg p-6 space-y-4">
              <h3 className="text-amber-400 font-semibold text-lg">
                {language === "zh" ? "🚀 立即体验测试账号" : "🚀 Try Demo Accounts"}
              </h3>
              <div className="space-y-3 text-left">
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-amber-300 font-medium">📧 demo.pm@timeweave.app</p>
                  <p className="text-slate-400 text-sm">
                    {language === "zh"
                      ? "产品经理 - 包含产品路线图、用户研究等数据"
                      : "Product Manager - Product roadmaps, user research data"}
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-amber-300 font-medium">📧 demo.dev@timeweave.app</p>
                  <p className="text-slate-400 text-sm">
                    {language === "zh"
                      ? "软件开发者 - 包含技术文档、开发任务等数据"
                      : "Software Developer - Technical docs, development tasks"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-medium">
                    🔑 {language === "zh" ? "统一密码：" : "Password:"} TimeWeave2024!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">{t.nav.signIn}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white bg-transparent px-8 py-3 text-lg"
                >
                  {t.nav.signUp}
                </Button>
              </Link>
            </div>

            <div className="border-t border-slate-700 pt-6 mt-8">
              <div className="text-center space-y-2 text-slate-400">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span>📱 {language === "zh" ? "电话/微信：" : "Phone/WeChat:"} 13112312211</span>
                  <span className="text-slate-600">|</span>
                  <span>👨‍💼 CTO: Bob Zheng</span>
                </div>
                <div className="text-sm">
                  <span>📧 Email: bob@happyshare.io</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <GraphDashboard />
    </div>
  )
}
