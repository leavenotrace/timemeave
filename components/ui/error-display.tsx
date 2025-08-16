import React from "react"
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"

interface ErrorDisplayProps {
  error: Error | string
  onRetry?: () => void
  className?: string
  variant?: "inline" | "card" | "banner"
}

export function ErrorDisplay({ error, onRetry, className, variant = "card" }: ErrorDisplayProps) {
  const errorMessage = typeof error === "string" ? error : error.message
  const isNetworkError = errorMessage.toLowerCase().includes("network") || 
                         errorMessage.toLowerCase().includes("fetch") ||
                         errorMessage.toLowerCase().includes("connection")

  const getErrorType = () => {
    if (isNetworkError) return "network"
    if (errorMessage.toLowerCase().includes("auth")) return "auth"
    if (errorMessage.toLowerCase().includes("permission")) return "permission"
    return "general"
  }

  const getErrorIcon = () => {
    const errorType = getErrorType()
    switch (errorType) {
      case "network":
        return <WifiOff className="h-4 w-4" />
      case "auth":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getErrorTitle = () => {
    const errorType = getErrorType()
    switch (errorType) {
      case "network":
        return "Connection Error"
      case "auth":
        return "Authentication Error"
      case "permission":
        return "Permission Error"
      default:
        return "Error"
    }
  }

  const getErrorSuggestion = () => {
    const errorType = getErrorType()
    switch (errorType) {
      case "network":
        return "Please check your internet connection and try again."
      case "auth":
        return "Please log in again to continue."
      case "permission":
        return "You don't have permission to perform this action."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  if (variant === "inline") {
    return (
      <div className={`text-red-400 text-sm ${className}`}>
        {errorMessage}
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <Alert variant="destructive" className={className}>
        {getErrorIcon()}
        <AlertDescription className="flex items-center justify-between">
          <span>{errorMessage}</span>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className={className}>
      {getErrorIcon()}
      <AlertTitle>{getErrorTitle()}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{errorMessage}</p>
        <p className="text-sm text-muted-foreground mb-4">{getErrorSuggestion()}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function NetworkErrorDisplay({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <WifiOff className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Connection Lost</h3>
      <p className="text-gray-400 text-center mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}