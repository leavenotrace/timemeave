"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Network, Layers, Zap, BarChart3, Eye, Home, LogOut, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useTranslation, detectLanguage, type Language } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<Language>("en")
  const t = useTranslation(language)

  const navItems = [
    { href: "/graph", label: t.nav.graph, icon: Network },
    { href: "/actions", label: t.nav.actions, icon: Layers },
    { href: "/modules", label: t.nav.modules, icon: Zap },
    { href: "/dashboard", label: t.nav.dashboard, icon: BarChart3 },
    { href: "/workbench", label: t.nav.workbench, icon: Eye },
    { href: "/guide", label: t.nav.guide, icon: BookOpen },
  ]

  useEffect(() => {
    const savedLang = localStorage.getItem("timeweave-language") as Language
    setLanguage(savedLang || detectLanguage())

    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("timeweave-language", newLanguage)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold text-white">TimeWeave</span>
          </Link>

          <div className="flex items-center gap-2">
            {user && (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={
                          isActive
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}

                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {!user && !loading && (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                    {t.nav.signIn}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    {t.nav.signUp}
                  </Button>
                </Link>
              </div>
            )}

            <div className="ml-2 pl-2 border-l border-slate-700">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
