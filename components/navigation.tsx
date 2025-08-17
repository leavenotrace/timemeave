"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Network, Layers, Zap, BarChart3, Eye, Home, LogOut, BookOpen, Menu, X, User, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NetworkStatus } from "@/components/ui/network-status"
import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { user, loading, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: BarChart3, priority: 1 },
    { href: "/graph", label: t.nav.graph, icon: Network, priority: 2 },
    { href: "/actions", label: t.nav.actions, icon: Layers, priority: 3 },
    { href: "/modules", label: t.nav.modules, icon: Zap, priority: 4 },
    { href: "/workbench", label: t.nav.workbench, icon: Eye, priority: 5 },
    { href: "/guide", label: t.nav.guide, icon: BookOpen, priority: 6 },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    await signOut()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // 防止水合错误，在客户端挂载前不渲染动态内容
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-white">TimeWeave</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Home className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-white hidden sm:block">TimeWeave</span>
              <span className="text-lg font-bold text-white sm:hidden">TW</span>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-1">
              {user && navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "transition-all duration-200",
                        isActive
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300 max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 h-8 w-8 p-0"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
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
                <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <NetworkStatus variant="indicator" className="mr-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-slate-300 hover:text-white hover:bg-slate-800 h-10 w-10 p-0"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out md:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-white">TimeWeave</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info Section */}
          {user && (
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {user ? (
              <div className="space-y-1 px-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-amber-600 text-white shadow-lg"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      )}>
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              !loading && (
                <div className="space-y-3 px-4">
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <User className="w-5 h-5 mr-3" />
                      {t.nav.signIn}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      className="w-full justify-start bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <User className="w-5 h-5 mr-3" />
                      {t.nav.signUp}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-slate-800 p-4 space-y-3">
            {/* Network Status */}
            <NetworkStatus variant="detailed" className="bg-slate-800/50" />
            
            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Language</span>
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            </div>

            {/* Sign Out Button */}
            {user && (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tablet Navigation (md breakpoint) */}
      {user && (
        <div className="hidden md:block lg:hidden">
          <div className="fixed top-16 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
                {navItems.slice(0, 4).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "flex-shrink-0 transition-all duration-200",
                          isActive
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
