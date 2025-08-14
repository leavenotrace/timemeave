import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export function createClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        exchangeCodeForSession: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }

  try {
    const cookieStore = cookies()

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true, // Enable session persistence
          storage: {
            getItem: (key: string) => {
              const cookie = cookieStore.get(key)
              return cookie?.value || null
            },
            setItem: (key: string, value: string) => {
              cookieStore.set(key, value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
              })
            },
            removeItem: (key: string) => {
              cookieStore.delete(key)
            },
          },
        },
      },
    )

    return supabase
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: "Failed to create client" }),
        getSession: () => Promise.resolve({ data: { session: null }, error: "Failed to create client" }),
        signOut: () => Promise.resolve({ error: "Failed to create client" }),
        exchangeCodeForSession: () => Promise.resolve({ error: "Failed to create client" }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: "Failed to create client" }),
        insert: () => Promise.resolve({ data: null, error: "Failed to create client" }),
        update: () => Promise.resolve({ data: null, error: "Failed to create client" }),
        delete: () => Promise.resolve({ data: null, error: "Failed to create client" }),
      }),
    } as any
  }
}
