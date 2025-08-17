"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toastUtils } from "@/lib/toast-utils"
import { enableDemoMode, disableDemoMode, getDemoUser, isDemoMode, isSupabaseConfigured, type DemoUser } from "@/lib/demo-mode"

interface AuthContextType {
  user: User | DemoUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string; success?: string }>
  signOut: () => Promise<void>
  enterDemoMode: () => void
  isAuthenticated: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for demo mode first
    const demoUser = getDemoUser()
    if (demoUser) {
      setUser(demoUser)
      setLoading(false)
      return
    }

    // Only initialize Supabase if it's configured
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured, running in demo-ready mode")
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          toastUtils.success("Successfully signed in!")
          break
        case 'SIGNED_OUT':
          toastUtils.info("Signed out successfully")
          // Clear any cached data
          localStorage.removeItem('supabase.auth.token')
          break
        case 'TOKEN_REFRESHED':
          console.log("Token refreshed")
          break
        case 'USER_UPDATED':
          console.log("User updated")
          break
      }
    })

    // Listen for demo mode events
    const handleDemoModeEnabled = (event: CustomEvent) => {
      setUser(event.detail)
      setSession(null)
    }

    const handleDemoModeDisabled = () => {
      setUser(null)
      setSession(null)
    }

    window.addEventListener('demo-mode-enabled', handleDemoModeEnabled as EventListener)
    window.addEventListener('demo-mode-disabled', handleDemoModeDisabled)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('demo-mode-enabled', handleDemoModeEnabled as EventListener)
      window.removeEventListener('demo-mode-disabled', handleDemoModeDisabled)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: "Authentication is not configured. Please use demo mode." }
    }

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      // Session will be updated via the auth state change listener
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: "Authentication is not configured. Please use demo mode." }
    }

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return { success: "Check your email to confirm your account" }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)

      // Handle demo mode sign out
      if (isDemoMode()) {
        disableDemoMode()
        setUser(null)
        setSession(null)
        router.push("/")
        return
      }

      // Handle Supabase sign out
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error("Sign out error:", error)
          toastUtils.error("Error signing out")
        }
      }

      // Clear local state immediately
      setUser(null)
      setSession(null)
      
      // Navigate to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
      toastUtils.error("Error signing out")
    } finally {
      setLoading(false)
    }
  }

  const enterDemoMode = () => {
    enableDemoMode()
    router.push("/dashboard")
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    enterDemoMode,
    isAuthenticated: !!user,
    isDemoMode: isDemoMode(),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook for protecting routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  return { user, loading }
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useRequireAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return null // Will redirect via useRequireAuth
    }

    return <Component {...props} />
  }
}