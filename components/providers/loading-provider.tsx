"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { LoadingOverlay, FullPageLoading } from "@/components/ui/loading-spinner"

interface LoadingState {
  id: string
  message?: string
  progress?: number
  canCancel?: boolean
  onCancel?: () => void
}

interface LoadingContextValue {
  loadingStates: LoadingState[]
  startLoading: (id: string, message?: string, options?: Partial<LoadingState>) => void
  updateLoading: (id: string, updates: Partial<LoadingState>) => void
  stopLoading: (id: string) => void
  isLoading: (id?: string) => boolean
  getLoadingState: (id: string) => LoadingState | undefined
  clearAllLoading: () => void
}

const LoadingContext = createContext<LoadingContextValue | null>(null)

interface LoadingProviderProps {
  children: React.ReactNode
  showGlobalLoader?: boolean
  globalLoaderThreshold?: number
}

export function LoadingProvider({ 
  children, 
  showGlobalLoader = true,
  globalLoaderThreshold = 1000 // Show global loader after 1 second
}: LoadingProviderProps) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([])
  const [showGlobal, setShowGlobal] = useState(false)

  const startLoading = useCallback((
    id: string, 
    message?: string, 
    options: Partial<LoadingState> = {}
  ) => {
    const newState: LoadingState = {
      id,
      message,
      progress: 0,
      canCancel: false,
      ...options
    }

    setLoadingStates(prev => {
      const existing = prev.find(state => state.id === id)
      if (existing) {
        return prev.map(state => state.id === id ? newState : state)
      }
      return [...prev, newState]
    })

    // Show global loader after threshold
    if (showGlobalLoader) {
      setTimeout(() => {
        setLoadingStates(current => {
          if (current.some(state => state.id === id)) {
            setShowGlobal(true)
          }
          return current
        })
      }, globalLoaderThreshold)
    }
  }, [showGlobalLoader, globalLoaderThreshold])

  const updateLoading = useCallback((id: string, updates: Partial<LoadingState>) => {
    setLoadingStates(prev => 
      prev.map(state => 
        state.id === id ? { ...state, ...updates } : state
      )
    )
  }, [])

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id))
    
    // Hide global loader if no more loading states
    setLoadingStates(current => {
      if (current.length === 0) {
        setShowGlobal(false)
      }
      return current
    })
  }, [])

  const isLoading = useCallback((id?: string) => {
    if (id) {
      return loadingStates.some(state => state.id === id)
    }
    return loadingStates.length > 0
  }, [loadingStates])

  const getLoadingState = useCallback((id: string) => {
    return loadingStates.find(state => state.id === id)
  }, [loadingStates])

  const clearAllLoading = useCallback(() => {
    setLoadingStates([])
    setShowGlobal(false)
  }, [])

  const value: LoadingContextValue = {
    loadingStates,
    startLoading,
    updateLoading,
    stopLoading,
    isLoading,
    getLoadingState,
    clearAllLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {showGlobal && loadingStates.length > 0 && (
        <GlobalLoadingOverlay loadingStates={loadingStates} />
      )}
    </LoadingContext.Provider>
  )
}

function GlobalLoadingOverlay({ loadingStates }: { loadingStates: LoadingState[] }) {
  const primaryState = loadingStates[0] // Show the first loading state
  
  if (!primaryState) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm w-full mx-4">
        <LoadingOverlay 
          text={primaryState.message}
          showProgress={primaryState.progress !== undefined}
          progress={primaryState.progress}
        />
        
        {loadingStates.length > 1 && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            {loadingStates.length - 1} more operation{loadingStates.length > 2 ? 's' : ''} in progress...
          </p>
        )}
        
        {primaryState.canCancel && primaryState.onCancel && (
          <button
            onClick={primaryState.onCancel}
            className="mt-4 w-full px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

// Hook for managing loading state of async operations
export function useAsyncLoading<T>(
  operation: () => Promise<T>,
  loadingId: string,
  message?: string
) {
  const { startLoading, stopLoading, updateLoading, isLoading } = useLoading()

  const execute = useCallback(async (progressCallback?: (progress: number) => void) => {
    try {
      startLoading(loadingId, message, {
        progress: progressCallback ? 0 : undefined
      })

      const result = await operation()
      
      if (progressCallback) {
        updateLoading(loadingId, { progress: 100 })
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      return result
    } finally {
      stopLoading(loadingId)
    }
  }, [operation, loadingId, message, startLoading, stopLoading, updateLoading])

  const updateProgress = useCallback((progress: number) => {
    updateLoading(loadingId, { progress })
  }, [loadingId, updateLoading])

  return {
    execute,
    updateProgress,
    isLoading: isLoading(loadingId)
  }
}

// Higher-order component for automatic loading states
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingId?: string,
  message?: string
) {
  return function WrappedComponent(props: P) {
    const { startLoading, stopLoading } = useLoading()
    const id = loadingId || Component.displayName || Component.name || 'component'

    React.useEffect(() => {
      startLoading(id, message)
      return () => stopLoading(id)
    }, [id])

    return <Component {...props} />
  }
}

// Hook for batch loading operations
export function useBatchLoading() {
  const { startLoading, stopLoading, updateLoading } = useLoading()

  const executeBatch = useCallback(async <T>(
    operations: Array<{
      id: string
      operation: () => Promise<T>
      message?: string
    }>,
    onProgress?: (completed: number, total: number) => void
  ) => {
    const results: T[] = []
    
    try {
      // Start all loading states
      operations.forEach(({ id, message }) => {
        startLoading(id, message)
      })

      // Execute operations sequentially
      for (let i = 0; i < operations.length; i++) {
        const { id, operation } = operations[i]
        
        try {
          const result = await operation()
          results.push(result)
          stopLoading(id)
          
          onProgress?.(i + 1, operations.length)
        } catch (error) {
          stopLoading(id)
          throw error
        }
      }

      return results
    } catch (error) {
      // Stop all remaining loading states
      operations.forEach(({ id }) => stopLoading(id))
      throw error
    }
  }, [startLoading, stopLoading])

  return { executeBatch }
}