"use client"

import React from "react"
import { Wifi, WifiOff, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useConnectionQuality } from "@/lib/hooks/use-network-status"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface NetworkStatusProps {
  variant?: "badge" | "indicator" | "detailed" | "banner"
  className?: string
  showDetails?: boolean
  onRetry?: () => void
}

export function NetworkStatus({ 
  variant = "indicator", 
  className,
  showDetails = false,
  onRetry
}: NetworkStatusProps) {
  const networkStatus = useConnectionQuality()

  if (variant === "badge") {
    return <NetworkBadge networkStatus={networkStatus} className={className} />
  }

  if (variant === "indicator") {
    return <NetworkIndicator networkStatus={networkStatus} className={className} />
  }

  if (variant === "banner") {
    return (
      <NetworkBanner 
        networkStatus={networkStatus} 
        className={className}
        onRetry={onRetry}
      />
    )
  }

  return (
    <NetworkDetailed 
      networkStatus={networkStatus} 
      className={className}
      showDetails={showDetails}
      onRetry={onRetry}
    />
  )
}

function NetworkBadge({ networkStatus, className }: {
  networkStatus: ReturnType<typeof useConnectionQuality>
  className?: string
}) {
  const { quality, isOnline } = networkStatus

  if (!isOnline) {
    return (
      <Badge variant="destructive" className={cn("gap-1", className)}>
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  const getVariant = () => {
    switch (quality) {
      case 'excellent': return 'default'
      case 'good': return 'secondary'
      case 'fair': return 'outline'
      case 'poor': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Badge variant={getVariant()} className={cn("gap-1", className)}>
      <Wifi className="h-3 w-3" />
      {quality}
    </Badge>
  )
}

function NetworkIndicator({ networkStatus, className }: {
  networkStatus: ReturnType<typeof useConnectionQuality>
  className?: string
}) {
  const { quality, isOnline, qualityColor } = networkStatus

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center gap-1", qualityColor)}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? quality : 'offline'}
        </span>
      </div>
      
      <div className={cn(
        "w-2 h-2 rounded-full",
        isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
      )} />
    </div>
  )
}

function NetworkBanner({ networkStatus, className, onRetry }: {
  networkStatus: ReturnType<typeof useConnectionQuality>
  className?: string
  onRetry?: () => void
}) {
  const { quality, isOnline, isSlowConnection } = networkStatus

  if (isOnline && quality !== 'poor') {
    return null
  }

  return (
    <div className={cn(
      "flex items-center justify-between p-3 border rounded-lg",
      !isOnline 
        ? "bg-red-950/20 border-red-900/20 text-red-300"
        : "bg-yellow-950/20 border-yellow-900/20 text-yellow-300",
      className
    )}>
      <div className="flex items-center gap-3">
        {!isOnline ? (
          <WifiOff className="h-5 w-5" />
        ) : (
          <AlertTriangle className="h-5 w-5" />
        )}
        
        <div>
          <p className="font-medium">
            {!isOnline ? "No internet connection" : "Poor connection quality"}
          </p>
          <p className="text-sm opacity-80">
            {!isOnline 
              ? "Some features may not work properly"
              : "Loading may be slower than usual"
            }
          </p>
        </div>
      </div>

      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
          className="border-current text-current hover:bg-current/10"
        >
          Retry
        </Button>
      )}
    </div>
  )
}

function NetworkDetailed({ networkStatus, className, showDetails, onRetry }: {
  networkStatus: ReturnType<typeof useConnectionQuality>
  className?: string
  showDetails?: boolean
  onRetry?: () => void
}) {
  const { 
    quality, 
    isOnline, 
    isSlowConnection, 
    connectionType, 
    downlink, 
    rtt,
    saveData
  } = networkStatus

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {isOnline ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-400" />
          )}
          Network Status
        </CardTitle>
        <CardDescription>
          {isOnline ? `Connected with ${quality} quality` : "No internet connection"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Connection</span>
          <div className="flex items-center gap-2">
            <NetworkIndicator networkStatus={networkStatus} />
          </div>
        </div>

        {isOnline && showDetails && (
          <>
            {connectionType && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Type</span>
                <span className="text-sm font-medium">{connectionType.toUpperCase()}</span>
              </div>
            )}

            {downlink && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Speed</span>
                <span className="text-sm font-medium">{downlink.toFixed(1)} Mbps</span>
              </div>
            )}

            {rtt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Latency</span>
                <span className="text-sm font-medium">{rtt}ms</span>
              </div>
            )}

            {saveData && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Data Saver</span>
                <Badge variant="outline" className="text-xs">
                  Enabled
                </Badge>
              </div>
            )}
          </>
        )}

        {isSlowConnection && (
          <div className="flex items-center gap-2 p-2 bg-yellow-950/20 border border-yellow-900/20 rounded">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">
              Slow connection detected
            </span>
          </div>
        )}

        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Test Connection
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Hook for showing network status in different contexts
export function useNetworkStatusDisplay() {
  const networkStatus = useConnectionQuality()

  const getStatusMessage = () => {
    if (!networkStatus.isOnline) {
      return "You're currently offline. Some features may not work."
    }

    if (networkStatus.quality === 'poor') {
      return "Your connection is slow. Loading may take longer."
    }

    if (networkStatus.isSlowConnection) {
      return "Slow connection detected. Consider using data saver mode."
    }

    return null
  }

  const shouldShowWarning = () => {
    return !networkStatus.isOnline || 
           networkStatus.quality === 'poor' || 
           networkStatus.isSlowConnection
  }

  const getRecommendations = () => {
    const recommendations = []

    if (!networkStatus.isOnline) {
      recommendations.push("Check your internet connection")
      recommendations.push("Try refreshing the page")
    } else if (networkStatus.quality === 'poor') {
      recommendations.push("Move closer to your router")
      recommendations.push("Close other apps using internet")
      recommendations.push("Try switching to mobile data")
    } else if (networkStatus.isSlowConnection) {
      recommendations.push("Enable data saver mode")
      recommendations.push("Avoid large downloads")
    }

    return recommendations
  }

  return {
    ...networkStatus,
    statusMessage: getStatusMessage(),
    shouldShowWarning: shouldShowWarning(),
    recommendations: getRecommendations()
  }
}