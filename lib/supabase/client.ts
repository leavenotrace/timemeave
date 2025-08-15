import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null
let dummyClient: any = null

// 创建虚拟客户端用于开发环境
function createDummyClient() {
  if (dummyClient) return dummyClient
  
  dummyClient = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // 返回一个虚拟的订阅对象
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        }
      }
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      })
    })
  }
  
  return dummyClient
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are not configured. Using dummy client.")
    return createDummyClient()
  }

  // 如果已经有实例，直接返回
  if (supabaseInstance) {
    return supabaseInstance
  }

  try {
    // 创建新实例并缓存
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey)
    return supabaseInstance
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return createDummyClient()
  }
}

export const supabase = createClient()

// Database types for TimeWeave
export interface GraphNode {
  id: string
  title: string
  content?: string
  type: string
  tags: string[]
  metadata: Record<string, any>
  connections: string[]
  created_at: string
  updated_at: string
  user_id: string
}

export interface Action {
  id: string
  title: string
  description?: string
  status: "pending" | "active" | "folded" | "completed"
  priority: number
  context: Record<string, any>
  folded_actions: string[]
  parent_action_id?: string
  graph_connections: string[]
  estimated_time?: number
  actual_time?: number
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Module {
  id: string
  name: string
  description?: string
  type: "template" | "automation" | "trigger" | "workflow"
  config: Record<string, any>
  triggers: any[]
  actions: any[]
  is_active: boolean
  execution_count: number
  last_executed?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface TFIData {
  tfi_score: number
  graph_nodes: number
  active_actions: number
  folded_actions: number
  active_modules: number
  calculated_at: string
}
