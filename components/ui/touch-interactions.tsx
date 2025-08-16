"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Trash2, Edit, Star, Archive, Share, MoreHorizontal } from "lucide-react"

interface SwipeAction {
  id: string
  label: string
  icon: React.ComponentType<any>
  color: "red" | "blue" | "green" | "yellow" | "gray"
  action: () => void
}

interface SwipeableCardProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  onSwipe?: (direction: "left" | "right", actionId?: string) => void
  className?: string
  disabled?: boolean
}

export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
  className,
  disabled = false
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const maxSwipeDistance = 120
  const swipeThreshold = 60

  const getActionColors = (color: SwipeAction["color"]) => {
    switch (color) {
      case "red": return "bg-red-500 text-white"
      case "blue": return "bg-blue-500 text-white"
      case "green": return "bg-green-500 text-white"
      case "yellow": return "bg-yellow-500 text-black"
      case "gray": return "bg-gray-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }, [disabled])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return
    
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    const clampedOffset = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, diff))
    setSwipeOffset(clampedOffset)
  }, [isDragging, startX, disabled])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return
    
    setIsDragging(false)
    
    // Determine if swipe was significant enough
    if (Math.abs(swipeOffset) > swipeThreshold) {
      const direction = swipeOffset > 0 ? "right" : "left"
      const actions = direction === "right" ? leftActions : rightActions
      
      if (actions.length > 0) {
        // Auto-execute first action if only one, otherwise show actions
        if (actions.length === 1) {
          actions[0].action()
          onSwipe?.(direction, actions[0].id)
        } else {
          onSwipe?.(direction)
        }
      }
    }
    
    // Animate back to center
    const animate = () => {
      setSwipeOffset(prev => {
        const newOffset = prev * 0.8
        if (Math.abs(newOffset) < 1) {
          return 0
        }
        animationRef.current = requestAnimationFrame(animate)
        return newOffset
      })
    }
    animate()
  }, [isDragging, swipeOffset, leftActions, rightActions, onSwipe, disabled])

  const handleMouseStart = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    setStartX(e.clientX)
    setIsDragging(true)
  }, [disabled])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || disabled) return
    
    const diff = e.clientX - startX
    const clampedOffset = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, diff))
    setSwipeOffset(clampedOffset)
  }, [isDragging, startX, disabled])

  const handleMouseEnd = useCallback(() => {
    handleTouchEnd()
  }, [handleTouchEnd])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left actions */}
      {leftActions.length > 0 && swipeOffset > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          {leftActions.map((action, index) => {
            const Icon = action.icon
            const opacity = Math.min(1, swipeOffset / swipeThreshold)
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={cn(
                  "h-full px-4 flex items-center justify-center transition-opacity",
                  getActionColors(action.color)
                )}
                style={{ opacity }}
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && swipeOffset < 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          {rightActions.map((action, index) => {
            const Icon = action.icon
            const opacity = Math.min(1, Math.abs(swipeOffset) / swipeThreshold)
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={cn(
                  "h-full px-4 flex items-center justify-center transition-opacity",
                  getActionColors(action.color)
                )}
                style={{ opacity }}
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      )}

      {/* Main content */}
      <div
        ref={cardRef}
        className={cn(
          "transition-transform duration-200 ease-out",
          isDragging && "transition-none"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Long press component for context menus
interface LongPressProps {
  children: React.ReactNode
  onLongPress: () => void
  onPress?: () => void
  delay?: number
  className?: string
}

export function LongPress({
  children,
  onLongPress,
  onPress,
  delay = 500,
  className
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleStart = useCallback(() => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, delay)
  }, [onLongPress, delay])

  const handleEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (isPressed && onPress) {
      onPress()
    }
    
    setIsPressed(false)
  }, [isPressed, onPress])

  const handleCancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPressed(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn(
        "select-none transition-transform duration-150",
        isPressed && "scale-95",
        className
      )}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleCancel}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleCancel}
    >
      {children}
    </div>
  )
}

// Pull to refresh component
interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  refreshThreshold?: number
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  refreshThreshold = 80,
  className
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return
    
    const currentY = e.touches[0].clientY
    const diff = currentY - startY
    
    if (diff > 0) {
      e.preventDefault()
      setPullDistance(Math.min(diff * 0.5, refreshThreshold * 1.5))
    }
  }, [isPulling, startY, refreshThreshold, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshing) return
    
    setIsPulling(false)
    
    if (pullDistance >= refreshThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [isPulling, pullDistance, refreshThreshold, onRefresh, isRefreshing])

  const refreshProgress = Math.min(pullDistance / refreshThreshold, 1)

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-slate-800 transition-transform duration-200"
        style={{
          height: `${Math.max(pullDistance, 0)}px`,
          transform: `translateY(-${Math.max(0, refreshThreshold - pullDistance)}px)`
        }}
      >
        {pullDistance > 0 && (
          <div className="flex items-center gap-2 text-slate-300">
            <div
              className={cn(
                "w-6 h-6 border-2 border-slate-400 rounded-full transition-all duration-200",
                isRefreshing && "animate-spin border-t-amber-400",
                refreshProgress >= 1 && !isRefreshing && "border-amber-400"
              )}
              style={{
                transform: `rotate(${refreshProgress * 180}deg)`
              }}
            />
            <span className="text-sm">
              {isRefreshing ? "Refreshing..." : 
               refreshProgress >= 1 ? "Release to refresh" : "Pull to refresh"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Touch-friendly action sheet
interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  actions: Array<{
    id: string
    label: string
    icon?: React.ComponentType<any>
    variant?: "default" | "destructive"
    action: () => void
  }>
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  actions
}: ActionSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Action sheet */}
      <div className="relative w-full max-w-md mx-4 mb-4 bg-slate-900 rounded-lg border border-slate-700 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        {title && (
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
        )}

        <div className="py-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => {
                  action.action()
                  onClose()
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  action.variant === "destructive"
                    ? "text-red-400 hover:bg-red-950/20"
                    : "text-white hover:bg-slate-800"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-2 border-t border-slate-700">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// Common swipe actions for different card types
export const commonSwipeActions = {
  edit: {
    id: "edit",
    label: "Edit",
    icon: Edit,
    color: "blue" as const,
    action: () => console.log("Edit action")
  },
  delete: {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    color: "red" as const,
    action: () => console.log("Delete action")
  },
  favorite: {
    id: "favorite",
    label: "Favorite",
    icon: Star,
    color: "yellow" as const,
    action: () => console.log("Favorite action")
  },
  archive: {
    id: "archive",
    label: "Archive",
    icon: Archive,
    color: "gray" as const,
    action: () => console.log("Archive action")
  },
  share: {
    id: "share",
    label: "Share",
    icon: Share,
    color: "green" as const,
    action: () => console.log("Share action")
  }
}