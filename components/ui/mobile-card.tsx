"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import { ChevronRight, MoreVertical, Star, Clock, User } from "lucide-react"

interface MobileCardProps {
  title: string
  description?: string
  content?: React.ReactNode
  actions?: React.ReactNode
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>
  metadata?: Array<{ icon: React.ComponentType<any>; label: string; value: string }>
  onClick?: () => void
  onMoreClick?: () => void
  className?: string
  variant?: "default" | "compact" | "detailed"
  priority?: "high" | "medium" | "low"
  status?: "active" | "inactive" | "pending" | "completed"
}

export function MobileCard({
  title,
  description,
  content,
  actions,
  badges = [],
  metadata = [],
  onClick,
  onMoreClick,
  className,
  variant = "default",
  priority,
  status,
}: MobileCardProps) {
  const isClickable = !!onClick
  const isCompact = variant === "compact"
  const isDetailed = variant === "detailed"

  const getPriorityColor = () => {
    switch (priority) {
      case "high": return "border-l-red-500"
      case "medium": return "border-l-yellow-500"
      case "low": return "border-l-green-500"
      default: return ""
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "active": return "bg-green-500"
      case "inactive": return "bg-gray-500"
      case "pending": return "bg-yellow-500"
      case "completed": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const CardWrapper = isClickable ? "button" : "div"

  return (
    <CardWrapper
      onClick={onClick}
      className={cn(
        "w-full text-left",
        isClickable && "cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      <Card className={cn(
        "border-slate-700 bg-slate-800/50 backdrop-blur-sm",
        isClickable && "hover:border-slate-600 hover:bg-slate-800/70",
        priority && "border-l-4",
        getPriorityColor()
      )}>
        {!isCompact && (
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold text-white truncate">
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {description}
                  </CardDescription>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {status && (
                  <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
                )}
                {onMoreClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoreClick()
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
                {isClickable && (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant || "secondary"}
                    className="text-xs"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
        )}

        {isCompact && (
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {status && (
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getStatusColor())} />
                )}
                <CardTitle className="text-sm font-medium text-white truncate">
                  {title}
                </CardTitle>
                {badges.length > 0 && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {badges[0].label}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {onMoreClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoreClick()
                    }}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                )}
                {isClickable && (
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>
        )}

        {content && (
          <CardContent className={cn(isCompact ? "pt-0" : "pt-0")}>
            {content}
          </CardContent>
        )}

        {(metadata.length > 0 || actions) && (
          <CardContent className={cn("pt-0", isCompact ? "pb-2" : "pb-3")}>
            {metadata.length > 0 && (
              <div className={cn(
                "flex flex-wrap gap-3 text-xs text-slate-400",
                isCompact ? "gap-2" : "gap-3 mb-3"
              )}>
                {metadata.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Icon className={cn(isCompact ? "h-3 w-3" : "h-3 w-3")} />
                      <span>{item.label}: {item.value}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {actions && (
              <div className="flex items-center justify-end gap-2">
                {actions}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </CardWrapper>
  )
}

// Specialized mobile card variants
export function MobileActionCard({
  title,
  description,
  status,
  priority,
  estimatedTime,
  actualTime,
  tags = [],
  onEdit,
  onComplete,
  onFold,
  onClick,
  className
}: {
  title: string
  description?: string
  status: "pending" | "active" | "folded" | "completed"
  priority: 1 | 2 | 3 | 4 | 5
  estimatedTime?: number
  actualTime?: number
  tags?: string[]
  onEdit?: () => void
  onComplete?: () => void
  onFold?: () => void
  onClick?: () => void
  className?: string
}) {
  const getPriorityLevel = () => {
    if (priority <= 2) return "high"
    if (priority <= 3) return "medium"
    return "low"
  }

  const badges = tags.map(tag => ({ label: tag, variant: "outline" as const }))
  
  const metadata = [
    ...(estimatedTime ? [{ icon: Clock, label: "Est", value: `${estimatedTime}m` }] : []),
    ...(actualTime ? [{ icon: Clock, label: "Actual", value: `${actualTime}m` }] : []),
  ]

  const actions = (
    <div className="flex gap-1">
      {onEdit && (
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      )}
      {onComplete && status !== "completed" && (
        <Button size="sm" variant="default" onClick={onComplete}>
          Complete
        </Button>
      )}
      {onFold && (
        <Button size="sm" variant="secondary" onClick={onFold}>
          Fold
        </Button>
      )}
    </div>
  )

  return (
    <MobileCard
      title={title}
      description={description}
      badges={badges}
      metadata={metadata}
      actions={actions}
      onClick={onClick}
      priority={getPriorityLevel()}
      status={status}
      className={className}
    />
  )
}

export function MobileGraphNodeCard({
  title,
  content,
  type,
  tags = [],
  connections = 0,
  lastUpdated,
  onEdit,
  onConnect,
  onClick,
  className
}: {
  title: string
  content?: string
  type: "note" | "document" | "reference" | "template"
  tags?: string[]
  connections?: number
  lastUpdated?: string
  onEdit?: () => void
  onConnect?: () => void
  onClick?: () => void
  className?: string
}) {
  const badges = [
    { label: type, variant: "secondary" as const },
    ...tags.slice(0, 2).map(tag => ({ label: tag, variant: "outline" as const }))
  ]

  const metadata = [
    { icon: Star, label: "Connections", value: connections.toString() },
    ...(lastUpdated ? [{ icon: Clock, label: "Updated", value: lastUpdated }] : []),
  ]

  const actions = (
    <div className="flex gap-1">
      {onEdit && (
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      )}
      {onConnect && (
        <Button size="sm" variant="default" onClick={onConnect}>
          Connect
        </Button>
      )}
    </div>
  )

  return (
    <MobileCard
      title={title}
      description={content}
      badges={badges}
      metadata={metadata}
      actions={actions}
      onClick={onClick}
      className={className}
    />
  )
}

export function MobileModuleCard({
  name,
  description,
  type,
  isActive,
  executionCount = 0,
  lastExecuted,
  onToggle,
  onEdit,
  onExecute,
  onClick,
  className
}: {
  name: string
  description?: string
  type: "template" | "automation" | "trigger" | "workflow"
  isActive: boolean
  executionCount?: number
  lastExecuted?: string
  onToggle?: () => void
  onEdit?: () => void
  onExecute?: () => void
  onClick?: () => void
  className?: string
}) {
  const badges = [
    { label: type, variant: "secondary" as const },
    { 
      label: isActive ? "Active" : "Inactive", 
      variant: isActive ? "default" as const : "outline" as const 
    }
  ]

  const metadata = [
    { icon: Star, label: "Executions", value: executionCount.toString() },
    ...(lastExecuted ? [{ icon: Clock, label: "Last run", value: lastExecuted }] : []),
  ]

  const actions = (
    <div className="flex gap-1">
      {onToggle && (
        <Button 
          size="sm" 
          variant={isActive ? "outline" : "default"} 
          onClick={onToggle}
        >
          {isActive ? "Disable" : "Enable"}
        </Button>
      )}
      {onEdit && (
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      )}
      {onExecute && isActive && (
        <Button size="sm" variant="default" onClick={onExecute}>
          Run
        </Button>
      )}
    </div>
  )

  return (
    <MobileCard
      title={name}
      description={description}
      badges={badges}
      metadata={metadata}
      actions={actions}
      onClick={onClick}
      status={isActive ? "active" : "inactive"}
      className={className}
    />
  )
}