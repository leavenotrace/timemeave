"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toastUtils } from "@/lib/toast-utils"

interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  connectionType: string | null
  downlink?: number
  rtt?: number
  saveData?: boolean
}

interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isSlowConnection: false,
    connectionType: null
  })

  const previousOnlineStatus = useRef(networkStatus.isOnline)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine
      let connectionType = null
      let isSlowConnection = false
      let downlink: number | undefined
      let rtt: number | undefined
      let saveData: boolean | undefined

      // Check connection type if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connectionType = connection?.effectiveType || null
        downlink = connection?.downlink
        rtt = connection?.rtt
        saveData = connection?.saveData
        
        // Determine if connection is slow
        isSlowConnection = 
          connection?.effectiveType === "slow-2g" || 
          connection?.effectiveType === "2g" ||
          (connection?.downlink && connection.downlink < 0.5) ||
          (connection?.rtt && connection.rtt > 2000)
      }

      const newStatus = {
        isOnline,
        isSlowConnection,
        connectionType,
        downlink,
        rtt,
        saveData
      }

      setNetworkStatus(newStatus)

      // Show toast notifications for network changes
      if (!isOnline && previousOnlineStatus.current) {
        toastUtils.networkError()
      } else if (isOnline && !previousOnlineStatus.current) {
        toastUtils.networkRestored()
      } else if (isOnline && isSlowConnection && !networkStatus.isSlowConnection) {
        toastUtils.warning("Slow connection detected. Some features may be limited.", {
          id: "slow-connection",
          duration: 5000
        })
      }

      previousOnlineStatus.current = isOnline
    }

    // Initial check
    updateNetworkStatus()

    // Listen for network changes
    window.addEventListener("online", updateNetworkStatus)
    window.addEventListener("offline", updateNetworkStatus)

    // Listen for connection changes if supported
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection?.addEventListener("change", updateNetworkStatus)
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus)
      window.removeEventListener("offline", updateNetworkStatus)
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection?.removeEventListener("change", updateNetworkStatus)
      }
    }
  }, [networkStatus.isSlowConnection])

  return networkStatus
}

// Enhanced retry hook with exponential backoff
export function useNetworkRetry(
  retryFn: () => Promise<any> | void, 
  dependencies: any[] = [],
  config: Partial<RetryConfig> = {}
) {
  const { isOnline } = useNetworkStatus()
  const [wasOffline, setWasOffline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout>()

  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }

  const executeRetry = useCallback(async (attempt = 0) => {
    if (attempt >= finalConfig.maxRetries) {
      setIsRetrying(false)
      toastUtils.error("Maximum retry attempts reached. Please try again manually.")
      return
    }

    setIsRetrying(true)
    setRetryCount(attempt + 1)

    try {
      await retryFn()
      setIsRetrying(false)
      setRetryCount(0)
      setWasOffline(false)
      toastUtils.success("Operation completed successfully")
    } catch (error) {
      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt),
        finalConfig.maxDelay
      )

      toastUtils.warning(`Retry ${attempt + 1}/${finalConfig.maxRetries} failed. Retrying in ${delay/1000}s...`, {
        duration: delay
      })

      retryTimeoutRef.current = setTimeout(() => {
        executeRetry(attempt + 1)
      }, delay)
    }
  }, [retryFn, finalConfig])

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    } else if (wasOffline && isOnline) {
      // Connection restored, retry the operation
      executeRetry(0)
    }
  }, [isOnline, wasOffline, executeRetry])

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const manualRetry = useCallback(() => {
    if (isOnline && !isRetrying) {
      executeRetry(0)
    }
  }, [isOnline, isRetrying, executeRetry])

  return { 
    isOnline, 
    wasOffline, 
    isRetrying, 
    retryCount, 
    manualRetry,
    maxRetries: finalConfig.maxRetries
  }
}

// Hook for handling offline queue
export function useOfflineQueue<T>() {
  const [queue, setQueue] = useState<T[]>([])
  const { isOnline } = useNetworkStatus()

  const addToQueue = useCallback((item: T) => {
    setQueue(prev => [...prev, item])
  }, [])

  const processQueue = useCallback(async (processor: (item: T) => Promise<void>) => {
    if (!isOnline || queue.length === 0) return

    const itemsToProcess = [...queue]
    setQueue([])

    for (const item of itemsToProcess) {
      try {
        await processor(item)
      } catch (error) {
        // Re-add failed items to queue
        setQueue(prev => [item, ...prev])
        throw error
      }
    }
  }, [isOnline, queue])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  return {
    queue,
    queueSize: queue.length,
    addToQueue,
    processQueue,
    clearQueue,
    isOnline
  }
}

// Hook for connection quality monitoring
export function useConnectionQuality() {
  const networkStatus = useNetworkStatus()
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor' | 'offline'>('good')

  useEffect(() => {
    if (!networkStatus.isOnline) {
      setQuality('offline')
      return
    }

    const { downlink, rtt, connectionType } = networkStatus

    if (connectionType === '4g' && downlink && downlink > 10 && rtt && rtt < 100) {
      setQuality('excellent')
    } else if (connectionType === '4g' || (downlink && downlink > 1.5 && rtt && rtt < 300)) {
      setQuality('good')
    } else if (connectionType === '3g' || (downlink && downlink > 0.5 && rtt && rtt < 1000)) {
      setQuality('fair')
    } else {
      setQuality('poor')
    }
  }, [networkStatus])

  const getQualityColor = () => {
    switch (quality) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-orange-400'
      case 'offline': return 'text-red-400'
    }
  }

  const getQualityIcon = () => {
    switch (quality) {
      case 'excellent': return '📶'
      case 'good': return '📶'
      case 'fair': return '📶'
      case 'poor': return '📶'
      case 'offline': return '📵'
    }
  }

  return {
    quality,
    qualityColor: getQualityColor(),
    qualityIcon: getQualityIcon(),
    ...networkStatus
  }
}