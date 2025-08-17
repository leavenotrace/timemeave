// Demo mode utilities for TimeWeave
// This allows users to experience the app without authentication

const DEMO_USER_KEY = 'timeweave_demo_user'

export interface DemoUser {
  id: string
  email: string
  name: string
  isDemoMode: true
}

export const demoUser: DemoUser = {
  id: 'demo-user-id',
  email: 'demo@timeweave.app',
  name: 'Demo User',
  isDemoMode: true
}

export function enableDemoMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser))
    // Trigger a custom event to notify auth provider
    window.dispatchEvent(new CustomEvent('demo-mode-enabled', { detail: demoUser }))
  }
}

export function disableDemoMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_USER_KEY)
    // Trigger a custom event to notify auth provider
    window.dispatchEvent(new CustomEvent('demo-mode-disabled'))
  }
}

export function getDemoUser(): DemoUser | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DEMO_USER_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
  }
  return null
}

export function isDemoMode(): boolean {
  return getDemoUser() !== null
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
  )
}