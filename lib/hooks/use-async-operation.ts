"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { toastUtils } from "@/lib/toast-utils"
import { useNetworkStatus } from "./use-network-status"

interface AsyncOperationState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  lastExecuted?: Date
  executionCount: number
}

interface AsyncOperationOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string | ((data: any) => string)
  errorMessage?: string | ((error: Error) => string)
  retryCount?: number
  retryDelay?: number
  timeout?: number
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  onRetry?: (attempt: number) => void
  enableNetworkRetry?: boolean
  optimisticUpdate?: any
}

export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: AsyncOperationOptions = {}
) {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = "Operation completed successfully",
    errorMessage,
    retryCount = 0,
    retryDelay = 1000,
    timeout = 30000,
    onSuccess,
    onError,
    onRetry,
    enableNetworkRetry = true,
    optimisticUpdate
  } = options

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    executionCount: 0
  })

  const { isOnline } = useNetworkStatus()
  const abortControllerRef = useRef<AbortController>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const execute = useCallback(async (retries = retryCount, isRetryAttempt = false) => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    // Check network status
    if (!isOnline && enableNetworkRetry) {
      const networkError = new Error("No internet connection")
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: networkError,
        executionCount: prev.executionCount + 1
      }))
      
      if (showErrorToast) {
        toastUtils.networkError()
      }
      
      onError?.(networkError)
      return
    }

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      data: optimisticUpdate || prev.data,
      lastExecuted: new Date(),
      executionCount: prev.executionCount + 1
    }))

    // Set timeout
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        abortControllerRef.current?.abort()
      }, timeout)
    }

    try {
      const result = await operation()
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setState(prev => ({ 
        ...prev, 
        data: result, 
        loading: false, 
        error: null 
      }))
      
      if (showSuccessToast) {
        const message = typeof successMessage === 'function' 
          ? successMessage(result) 
          : successMessage
        toastUtils.success(message)
      }
      
      onSuccess?.(result)
      return result
    } catch (error) {
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      // Handle abort
      if (errorObj.name === 'AbortError') {
        setState(prev => ({ ...prev, loading: false }))
        return
      }

      // Handle timeout
      if (errorObj.message.includes('timeout') || errorObj.name === 'TimeoutError') {
        errorObj.message = `Operation timed out after ${timeout/1000} seconds`
      }

      // Retry logic
      if (retries > 0 && isOnline) {
        onRetry?.(retryCount - retries + 1)
        
        const delay = retryDelay * Math.pow(2, retryCount - retries) // Exponential backoff
        toastUtils.info(`Retrying in ${delay/1000}s... (${retryCount - retries + 1}/${retryCount + 1})`, {
          duration: delay
        })
        
        setTimeout(() => {
          execute(retries - 1, true)
        }, delay)
        return
      }

      setState(prev => ({ 
        ...prev, 
        data: optimisticUpdate ? null : prev.data, // Revert optimistic update
        loading: false, 
        error: errorObj 
      }))
      
      if (showErrorToast) {
        const message = typeof errorMessage === 'function' 
          ? errorMessage(errorObj) 
          : errorMessage || errorObj.message
        toastUtils.error(message)
      }
      
      onError?.(errorObj)
      throw errorObj
    }
  }, [
    operation, 
    showSuccessToast, 
    showErrorToast, 
    successMessage, 
    errorMessage,
    retryCount, 
    retryDelay, 
    timeout,
    onSuccess,
    onError,
    onRetry,
    isOnline,
    enableNetworkRetry,
    optimisticUpdate
  ])

  const retry = useCallback(() => {
    execute(retryCount)
  }, [execute, retryCount])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState(prev => ({ ...prev, loading: false }))
  }, [])

  const reset = useCallback(() => {
    cancel()
    setState({ 
      data: null, 
      loading: false, 
      error: null, 
      executionCount: 0 
    })
  }, [cancel])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    ...state,
    execute,
    retry,
    cancel,
    reset,
    isOnline
  }
}

// Hook for managing multiple async operations
export function useAsyncOperations() {
  const [operations, setOperations] = useState<Record<string, AsyncOperationState<any>>>({})

  const executeOperation = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ) => {
    setOperations(prev => ({
      ...prev,
      [key]: { 
        data: options.optimisticUpdate || prev[key]?.data || null, 
        loading: true, 
        error: null,
        lastExecuted: new Date(),
        executionCount: (prev[key]?.executionCount || 0) + 1
      }
    }))

    try {
      const result = await operation()
      setOperations(prev => ({
        ...prev,
        [key]: { 
          ...prev[key],
          data: result, 
          loading: false, 
          error: null 
        }
      }))

      if (options.showSuccessToast) {
        const message = typeof options.successMessage === 'function' 
          ? options.successMessage(result) 
          : options.successMessage || "Operation completed successfully"
        toastUtils.success(message)
      }

      options.onSuccess?.(result)
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setOperations(prev => ({
        ...prev,
        [key]: { 
          ...prev[key],
          data: options.optimisticUpdate ? null : prev[key]?.data || null,
          loading: false, 
          error: errorObj 
        }
      }))

      if (options.showErrorToast !== false) {
        const message = typeof options.errorMessage === 'function' 
          ? options.errorMessage(errorObj) 
          : options.errorMessage || errorObj.message
        toastUtils.error(message)
      }

      options.onError?.(errorObj)
      throw errorObj
    }
  }, [])

  const getOperation = useCallback((key: string) => {
    return operations[key] || { 
      data: null, 
      loading: false, 
      error: null, 
      executionCount: 0 
    }
  }, [operations])

  const retryOperation = useCallback((key: string) => {
    const operation = operations[key]
    if (operation && operation.error) {
      // This would need the original operation function, which we don't have
      // In practice, you'd store the operation function or handle this differently
      console.warn(`Cannot retry operation ${key} - original function not available`)
    }
  }, [operations])

  const cancelOperation = useCallback((key: string) => {
    setOperations(prev => ({
      ...prev,
      [key]: prev[key] ? { ...prev[key], loading: false } : prev[key]
    }))
  }, [])

  const clearOperation = useCallback((key: string) => {
    setOperations(prev => {
      const { [key]: removed, ...rest } = prev
      return rest
    })
  }, [])

  const isAnyLoading = useCallback(() => {
    return Object.values(operations).some(op => op.loading)
  }, [operations])

  const hasAnyError = useCallback(() => {
    return Object.values(operations).some(op => op.error)
  }, [operations])

  const getLoadingOperations = useCallback(() => {
    return Object.entries(operations)
      .filter(([_, op]) => op.loading)
      .map(([key]) => key)
  }, [operations])

  const getErrorOperations = useCallback(() => {
    return Object.entries(operations)
      .filter(([_, op]) => op.error)
      .reduce((acc, [key, op]) => ({ ...acc, [key]: op.error }), {})
  }, [operations])

  return {
    executeOperation,
    getOperation,
    retryOperation,
    cancelOperation,
    clearOperation,
    isAnyLoading,
    hasAnyError,
    getLoadingOperations,
    getErrorOperations,
    operations
  }
}

// Hook for debounced async operations
export function useDebouncedAsyncOperation<T>(
  operation: () => Promise<T>,
  delay: number = 500,
  options: AsyncOperationOptions = {}
) {
  const debounceRef = useRef<NodeJS.Timeout>()
  const asyncOp = useAsyncOperation(operation, options)

  const debouncedExecute = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      asyncOp.execute()
    }, delay)
  }, [asyncOp.execute, delay])

  const cancelDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    ...asyncOp,
    debouncedExecute,
    cancelDebounce
  }
}