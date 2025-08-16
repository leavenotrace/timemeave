"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Bug, Home, Copy, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { toastUtils } from "@/lib/toast-utils"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
  errorId: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void; errorId: string }>
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void
  maxRetries?: number
  showErrorDetails?: boolean
  level?: "page" | "component" | "section"
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      retryCount: 0,
      errorId: ""
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.setState({ error, errorInfo, errorId })
    this.props.onError?.(error, errorInfo, errorId)
    
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ErrorBoundary [${errorId}]`)
      console.error("Error:", error)
      console.error("Error Info:", errorInfo)
      console.error("Component Stack:", errorInfo.componentStack)
      console.groupEnd()
    }

    // Show error toast based on level
    const { level = "component" } = this.props
    if (level === "page") {
      toastUtils.error(`Page error: ${error.message}`, { 
        id: `error-boundary-${errorId}`,
        duration: 8000 
      })
    } else if (level === "component") {
      toastUtils.error(`Component error: ${error.message}`, { 
        id: `error-boundary-${errorId}`,
        duration: 6000 
      })
    }
  }

  retry = () => {
    const { maxRetries = 3 } = this.props
    const newRetryCount = this.state.retryCount + 1

    if (newRetryCount <= maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: newRetryCount,
        errorId: ""
      })
      toastUtils.info(`Retrying... (${newRetryCount}/${maxRetries})`)
    } else {
      toastUtils.error("Maximum retry attempts reached. Please refresh the page.")
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent 
          error={this.state.error} 
          retry={this.retry} 
          errorId={this.state.errorId}
        />
      }

      const { level = "component" } = this.props
      
      if (level === "section") {
        return <CompactErrorFallback 
          error={this.state.error} 
          retry={this.retry}
          retryCount={this.state.retryCount}
          maxRetries={this.props.maxRetries || 3}
          errorId={this.state.errorId}
        />
      }

      return <DefaultErrorFallback 
        error={this.state.error} 
        retry={this.retry}
        retryCount={this.state.retryCount}
        maxRetries={this.props.maxRetries || 3}
        showErrorDetails={this.props.showErrorDetails}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        level={level}
      />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
  retryCount: number
  maxRetries: number
  errorId: string
}

function CompactErrorFallback({ error, retry, retryCount, maxRetries, errorId }: ErrorFallbackProps) {
  const canRetry = retryCount < maxRetries

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error in this section</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error.message}</p>
        <div className="flex gap-2">
          {canRetry && (
            <Button onClick={retry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry ({retryCount}/{maxRetries})
            </Button>
          )}
          <CopyErrorButton error={error} errorId={errorId} />
        </div>
      </AlertDescription>
    </Alert>
  )
}

interface DefaultErrorFallbackProps extends ErrorFallbackProps {
  showErrorDetails?: boolean
  errorInfo?: React.ErrorInfo
  level: "page" | "component" | "section"
}

function DefaultErrorFallback({ 
  error, 
  retry, 
  retryCount, 
  maxRetries, 
  showErrorDetails = process.env.NODE_ENV === "development",
  errorInfo,
  errorId,
  level
}: DefaultErrorFallbackProps) {
  const canRetry = retryCount < maxRetries
  const isPageLevel = level === "page"

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className={`flex items-center justify-center p-4 ${isPageLevel ? "min-h-[60vh]" : "min-h-[400px]"}`}>
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            {isPageLevel ? "Page Error" : "Component Error"}
          </CardTitle>
          <CardDescription>
            An unexpected error occurred{isPageLevel ? " while loading this page" : " in this component"}. 
            {canRetry ? " You can try again or take other actions below." : " Please refresh the page or go back to the home page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-red-950/20 border border-red-900/20 rounded-md">
              <p className="text-sm text-red-300 font-medium">{error.message}</p>
              <p className="text-xs text-red-400 mt-1">Error ID: {errorId}</p>
            </div>

            {showErrorDetails && (
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Technical details
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Stack trace:</p>
                    <pre className="p-3 bg-slate-800 rounded text-xs overflow-auto max-h-32 text-gray-300">
                      {error.stack}
                    </pre>
                  </div>
                  {errorInfo?.componentStack && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Component stack:</p>
                      <pre className="p-3 bg-slate-800 rounded text-xs overflow-auto max-h-32 text-gray-300">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              {canRetry && (
                <Button onClick={retry} variant="default" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again ({retryCount}/{maxRetries})
                </Button>
              )}
              
              {isPageLevel ? (
                <div className="flex gap-2 flex-1">
                  <Button onClick={handleRefresh} variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={handleGoHome} variant="outline" className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </div>
              ) : (
                <CopyErrorButton error={error} errorId={errorId} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CopyErrorButton({ error, errorId }: { error: Error; errorId: string }) {
  const [copied, setCopied] = React.useState(false)

  const copyErrorDetails = async () => {
    const errorDetails = `Error ID: ${errorId}
Message: ${error.message}
Stack: ${error.stack}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}`

    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      toastUtils.success("Error details copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toastUtils.error("Failed to copy error details")
    }
  }

  return (
    <Button onClick={copyErrorDetails} variant="outline" size="sm">
      {copied ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {copied ? "Copied!" : "Copy error"}
    </Button>
  )
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}