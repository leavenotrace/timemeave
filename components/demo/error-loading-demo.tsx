"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton, LoadingCard, NetworkAwareLoading } from "@/components/ui/loading-spinner"
import { ErrorDisplay, NetworkErrorDisplay } from "@/components/ui/error-display"
import { NetworkStatus } from "@/components/ui/network-status"
import { useAsyncOperation } from "@/lib/hooks/use-async-operation"
import { useNetworkStatus, useNetworkRetry } from "@/lib/hooks/use-network-status"
import { useErrorHandler } from "@/components/providers/error-provider"
import { useLoading } from "@/components/providers/loading-provider"
import { toastUtils } from "@/lib/toast-utils"
import { AlertTriangle, Wifi, Loader2, CheckCircle, XCircle } from "lucide-react"

export function ErrorLoadingDemo() {
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorType, setErrorType] = useState<'network' | 'auth' | 'general'>('general')
  const networkStatus = useNetworkStatus()
  const { reportError } = useErrorHandler()
  const { startLoading, stopLoading, isLoading } = useLoading()

  // Simulate different types of operations
  const simulateNetworkError = async () => {
    throw new Error("Failed to fetch data from server")
  }

  const simulateAuthError = async () => {
    throw new Error("Authentication failed - please log in again")
  }

  const simulateGeneralError = async () => {
    throw new Error("Something went wrong while processing your request")
  }

  const simulateSlowOperation = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    return "Operation completed successfully"
  }

  const asyncOp = useAsyncOperation(
    async () => {
      switch (errorType) {
        case 'network': return await simulateNetworkError()
        case 'auth': return await simulateAuthError()
        default: return await simulateGeneralError()
      }
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      retryCount: 2,
      retryDelay: 1000
    }
  )

  const slowAsyncOp = useAsyncOperation(simulateSlowOperation, {
    showSuccessToast: true,
    successMessage: "Slow operation completed!"
  })

  const { isRetrying, retryCount, manualRetry } = useNetworkRetry(
    async () => {
      console.log("Network retry triggered")
    },
    [],
    { maxRetries: 3, baseDelay: 1000 }
  )

  const handleManualError = () => {
    const error = new Error("This is a manually triggered error for testing")
    reportError(error, "Error Loading Demo")
    setDemoState('error')
  }

  const handleLoadingDemo = () => {
    setDemoState('loading')
    startLoading('demo-operation', 'Processing your request...')
    
    setTimeout(() => {
      stopLoading('demo-operation')
      setDemoState('success')
      setTimeout(() => setDemoState('idle'), 2000)
    }, 3000)
  }

  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toastUtils.success("Operation completed successfully!")
        break
      case 'error':
        toastUtils.error("Something went wrong!")
        break
      case 'warning':
        toastUtils.warning("Please check your input")
        break
      case 'info':
        toastUtils.info("Here's some helpful information")
        break
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Error Handling & Loading States Demo</h2>
        <p className="text-gray-400">Test various error handling and loading state components</p>
      </div>

      {/* Network Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Network Status
          </CardTitle>
          <CardDescription>
            Current network connection status and quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NetworkStatus variant="badge" />
            <NetworkStatus variant="indicator" />
            <div className="md:col-span-2">
              <NetworkStatus variant="detailed" showDetails />
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Online: {networkStatus.isOnline ? 'Yes' : 'No'}</p>
            <p>Slow Connection: {networkStatus.isSlowConnection ? 'Yes' : 'No'}</p>
            <p>Connection Type: {networkStatus.connectionType || 'Unknown'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Loading States Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5" />
            Loading States
          </CardTitle>
          <CardDescription>
            Various loading indicators and states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading Spinners */}
          <div>
            <h4 className="font-medium mb-3">Loading Spinners</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <LoadingSpinner size="sm" />
                <p className="text-xs text-gray-400 mt-2">Small</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="md" />
                <p className="text-xs text-gray-400 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-xs text-gray-400 mt-2">Large</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="xl" />
                <p className="text-xs text-gray-400 mt-2">Extra Large</p>
              </div>
            </div>
          </div>

          {/* Loading Variants */}
          <div>
            <h4 className="font-medium mb-3">Loading Variants</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <LoadingSpinner variant="default" />
                <p className="text-xs text-gray-400 mt-2">Default</p>
              </div>
              <div className="text-center">
                <LoadingSpinner variant="dots" />
                <p className="text-xs text-gray-400 mt-2">Dots</p>
              </div>
              <div className="text-center">
                <LoadingSpinner variant="pulse" />
                <p className="text-xs text-gray-400 mt-2">Pulse</p>
              </div>
              <div className="text-center">
                <LoadingSpinner variant="bounce" />
                <p className="text-xs text-gray-400 mt-2">Bounce</p>
              </div>
            </div>
          </div>

          {/* Skeleton Loading */}
          <div>
            <h4 className="font-medium mb-3">Skeleton Loading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LoadingCard />
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-4 w-1/2" />
                <LoadingSkeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          {/* Interactive Loading Demo */}
          <div>
            <h4 className="font-medium mb-3">Interactive Loading</h4>
            <div className="flex gap-2">
              <Button 
                onClick={handleLoadingDemo}
                disabled={isLoading('demo-operation')}
              >
                {isLoading('demo-operation') ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Start Loading Demo'
                )}
              </Button>
              
              <Button 
                onClick={() => slowAsyncOp.execute()}
                disabled={slowAsyncOp.loading}
              >
                {slowAsyncOp.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Slow Operation...
                  </>
                ) : (
                  'Slow Operation Demo'
                )}
              </Button>
            </div>
          </div>

          {/* Network Aware Loading */}
          <div>
            <h4 className="font-medium mb-3">Network-Aware Loading</h4>
            <div className="border border-slate-700 rounded-lg p-4">
              <NetworkAwareLoading 
                isOnline={networkStatus.isOnline}
                isSlowConnection={networkStatus.isSlowConnection}
                text="Loading with network awareness..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error States Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error States
          </CardTitle>
          <CardDescription>
            Various error display components and handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display Variants */}
          <div>
            <h4 className="font-medium mb-3">Error Display Variants</h4>
            <div className="space-y-4">
              <ErrorDisplay 
                error="This is an inline error message"
                variant="inline"
              />
              
              <ErrorDisplay 
                error="This is a banner error with retry option"
                variant="banner"
                onRetry={() => console.log('Retry clicked')}
              />
              
              <ErrorDisplay 
                error={new Error("This is a detailed error card")}
                variant="card"
                onRetry={() => console.log('Retry clicked')}
              />
            </div>
          </div>

          {/* Network Error */}
          <div>
            <h4 className="font-medium mb-3">Network Error</h4>
            <NetworkErrorDisplay onRetry={() => console.log('Network retry')} />
          </div>

          {/* Interactive Error Demo */}
          <div>
            <h4 className="font-medium mb-3">Interactive Error Demo</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleManualError}
                  variant="destructive"
                >
                  Trigger Manual Error
                </Button>
                
                <select 
                  value={errorType} 
                  onChange={(e) => setErrorType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
                >
                  <option value="general">General Error</option>
                  <option value="network">Network Error</option>
                  <option value="auth">Auth Error</option>
                </select>
                
                <Button 
                  onClick={() => asyncOp.execute()}
                  disabled={asyncOp.loading}
                  variant="destructive"
                >
                  {asyncOp.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Async Error'
                  )}
                </Button>
              </div>

              {asyncOp.error && (
                <ErrorDisplay 
                  error={asyncOp.error}
                  onRetry={() => asyncOp.retry()}
                />
              )}
            </div>
          </div>

          {/* Network Retry Demo */}
          <div>
            <h4 className="font-medium mb-3">Network Retry Demo</h4>
            <div className="flex items-center gap-4">
              <Button onClick={manualRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Retrying... ({retryCount}/3)
                  </>
                ) : (
                  'Manual Retry'
                )}
              </Button>
              
              <div className="text-sm text-gray-400">
                {isRetrying && `Retry attempt: ${retryCount}/3`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Test different types of toast notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => handleToastDemo('success')} variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Success Toast
            </Button>
            <Button onClick={() => handleToastDemo('error')} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Error Toast
            </Button>
            <Button onClick={() => handleToastDemo('warning')} variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warning Toast
            </Button>
            <Button onClick={() => handleToastDemo('info')} variant="secondary">
              Info Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* State Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Demo State:</p>
              <p className="font-medium">{demoState}</p>
            </div>
            <div>
              <p className="text-gray-400">Network:</p>
              <p className="font-medium">{networkStatus.isOnline ? 'Online' : 'Offline'}</p>
            </div>
            <div>
              <p className="text-gray-400">Loading:</p>
              <p className="font-medium">{isLoading() ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-gray-400">Retrying:</p>
              <p className="font-medium">{isRetrying ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}