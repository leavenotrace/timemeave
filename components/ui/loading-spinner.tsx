import * as React from "react"
import { Loader2, Wifi, WifiOff, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  variant?: "default" | "dots" | "pulse" | "bounce"
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

const textSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl"
}

export function LoadingSpinner({ size = "md", className, text, variant = "default" }: LoadingSpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <LoadingDots size={size} className={className} />
      case "pulse":
        return <LoadingPulse size={size} className={className} />
      case "bounce":
        return <LoadingBounce size={size} className={className} />
      default:
        return <Loader2 className={cn("animate-spin text-amber-400", sizeClasses[size], className)} />
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {renderSpinner()}
      {text && (
        <span className={cn("text-amber-400", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )
}

function LoadingDots({ size, className }: { size: LoadingSpinnerProps["size"]; className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-amber-400 rounded-full animate-pulse",
            sizeClasses[size || "md"]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  )
}

function LoadingPulse({ size, className }: { size: LoadingSpinnerProps["size"]; className?: string }) {
  return (
    <div className={cn("bg-amber-400 rounded-full animate-pulse", sizeClasses[size || "md"], className)} />
  )
}

function LoadingBounce({ size, className }: { size: LoadingSpinnerProps["size"]; className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-amber-400 rounded-full animate-bounce",
            sizeClasses[size || "md"]
          )}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

export function LoadingOverlay({ 
  text, 
  className, 
  variant = "default",
  showProgress = false,
  progress = 0
}: { 
  text?: string
  className?: string
  variant?: LoadingSpinnerProps["variant"]
  showProgress?: boolean
  progress?: number
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[200px] space-y-4", className)}>
      <LoadingSpinner size="lg" text={text} variant={variant} />
      {showProgress && (
        <div className="w-48 bg-slate-700 rounded-full h-2">
          <div 
            className="bg-amber-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function FullPageLoading({ 
  text, 
  variant = "default",
  showProgress = false,
  progress = 0
}: { 
  text?: string
  variant?: LoadingSpinnerProps["variant"]
  showProgress?: boolean
  progress?: number
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 space-y-6">
      <LoadingSpinner size="xl" text={text || "Loading..."} variant={variant} />
      {showProgress && (
        <div className="w-64 bg-slate-800 rounded-full h-3">
          <div 
            className="bg-amber-400 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Skeleton loading components
export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800", className)}
      {...props}
    />
  )
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 border border-slate-700 rounded-lg space-y-3", className)}>
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-8 w-16" />
        <LoadingSkeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function LoadingList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Network-aware loading states
interface NetworkLoadingProps {
  isOnline: boolean
  isSlowConnection: boolean
  text?: string
  className?: string
}

export function NetworkAwareLoading({ isOnline, isSlowConnection, text, className }: NetworkLoadingProps) {
  if (!isOnline) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[200px] space-y-4", className)}>
        <WifiOff className="h-12 w-12 text-red-400" />
        <div className="text-center">
          <p className="text-red-400 font-medium">No internet connection</p>
          <p className="text-gray-400 text-sm">Please check your network settings</p>
        </div>
      </div>
    )
  }

  if (isSlowConnection) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[200px] space-y-4", className)}>
        <div className="relative">
          <Wifi className="h-8 w-8 text-amber-400" />
          <Clock className="h-4 w-4 text-amber-600 absolute -bottom-1 -right-1" />
        </div>
        <LoadingSpinner size="md" text={text || "Loading (slow connection)..."} variant="dots" />
      </div>
    )
  }

  return <LoadingSpinner size="lg" text={text} />
}

// Loading state with timeout
export function LoadingWithTimeout({ 
  timeout = 10000, 
  onTimeout, 
  text,
  className 
}: {
  timeout?: number
  onTimeout?: () => void
  text?: string
  className?: string
}) {
  const [isTimeout, setIsTimeout] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  if (isTimeout) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[200px] space-y-4", className)}>
        <Clock className="h-12 w-12 text-amber-400" />
        <div className="text-center">
          <p className="text-amber-400 font-medium">Taking longer than expected</p>
          <p className="text-gray-400 text-sm">Please check your connection or try again</p>
        </div>
      </div>
    )
  }

  return <LoadingSpinner size="lg" text={text} />
}