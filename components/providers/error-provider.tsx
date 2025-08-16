"use client"

import React, { createContext, useContext, useCallback, useState } from "react"
import { toastUtils } from "@/lib/toast-utils"

interface ErrorInfo {
  id: string
  error: Error
  context?: string
  timestamp: Date
  resolved: boolean
  retryCount: number
}

interface ErrorContextValue {
  errors: ErrorInfo[]
  reportError: (error: Error, context?: string) => string
  resolveError: (errorId: string) => void
  retryError: (errorId: string, retryFn: () => Promise<void>) => Promise<void>
  clearErrors: () => void
  getUnresolvedErrors: () => ErrorInfo[]
  hasUnresolvedErrors: () => boolean
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

interface ErrorProviderProps {
  children: React.ReactNode
  maxErrors?: number
  autoResolveAfter?: number
}

export function ErrorProvider({ 
  children, 
  maxErrors = 50,
  autoResolveAfter = 300000 // 5 minutes
}: ErrorProviderProps) {
  const [errors, setErrors] = useState<ErrorInfo[]>([])

  const reportError = useCallback((error: Error, context?: string): string => {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const errorInfo: ErrorInfo = {
      id: errorId,
      error,
      context,
      timestamp: new Date(),
      resolved: false,
      retryCount: 0
    }

    setErrors(prev => {
      const newErrors = [errorInfo, ...prev].slice(0, maxErrors)
      return newErrors
    })

    // Auto-resolve after specified time
    if (autoResolveAfter > 0) {
      setTimeout(() => {
        setErrors(prev => 
          prev.map(err => 
            err.id === errorId ? { ...err, resolved: true } : err
          )
        )
      }, autoResolveAfter)
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error Report [${errorId}]`)
      console.error("Error:", error)
      console.error("Context:", context)
      console.error("Timestamp:", errorInfo.timestamp)
      console.groupEnd()
    }

    return errorId
  }, [maxErrors, autoResolveAfter])

  const resolveError = useCallback((errorId: string) => {
    setErrors(prev => 
      prev.map(err => 
        err.id === errorId ? { ...err, resolved: true } : err
      )
    )
  }, [])

  const retryError = useCallback(async (errorId: string, retryFn: () => Promise<void>) => {
    const errorInfo = errors.find(err => err.id === errorId)
    if (!errorInfo) return

    try {
      // Update retry count
      setErrors(prev => 
        prev.map(err => 
          err.id === errorId ? { ...err, retryCount: err.retryCount + 1 } : err
        )
      )

      await retryFn()
      
      // Mark as resolved on success
      resolveError(errorId)
      toastUtils.success("Operation completed successfully after retry")
    } catch (error) {
      const newError = error instanceof Error ? error : new Error(String(error))
      reportError(newError, `Retry failed for: ${errorInfo.context}`)
      toastUtils.error(`Retry failed: ${newError.message}`)
    }
  }, [errors, resolveError, reportError])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const getUnresolvedErrors = useCallback(() => {
    return errors.filter(err => !err.resolved)
  }, [errors])

  const hasUnresolvedErrors = useCallback(() => {
    return errors.some(err => !err.resolved)
  }, [errors])

  const value: ErrorContextValue = {
    errors,
    reportError,
    resolveError,
    retryError,
    clearErrors,
    getUnresolvedErrors,
    hasUnresolvedErrors
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useErrorHandler() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorProvider")
  }
  return context
}

// Higher-order component for automatic error handling
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  context?: string
) {
  return function WrappedComponent(props: P) {
    const { reportError } = useErrorHandler()

    const handleError = useCallback((error: Error) => {
      reportError(error, context || Component.displayName || Component.name)
    }, [reportError])

    return (
      <ErrorBoundary onError={handleError} level="component">
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Error boundary component (imported from existing file)
import { ErrorBoundary } from "@/components/ui/error-boundary"

// Hook for handling async errors with context
export function useAsyncErrorHandler(context?: string) {
  const { reportError } = useErrorHandler()

  const handleAsyncError = useCallback(async <T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await operation()
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      reportError(errorObj, context)
      return fallback
    }
  }, [reportError, context])

  const wrapAsyncFunction = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args)
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        reportError(errorObj, context)
        return undefined
      }
    }
  }, [reportError, context])

  return {
    handleAsyncError,
    wrapAsyncFunction,
    reportError: (error: Error) => reportError(error, context)
  }
}