"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface BottomNavItem {
  href: string
  label: string
  icon: React.ComponentType<any>
  badge?: number | string
  disabled?: boolean
}

interface BottomNavigationProps {
  items: BottomNavItem[]
  className?: string
  variant?: "default" | "floating"
}

export function BottomNavigation({
  items,
  className,
  variant = "default"
}: BottomNavigationProps) {
  const pathname = usePathname()

  const isFloating = variant === "floating"

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800",
      isFloating && "mx-4 mb-4 rounded-lg border border-slate-700 shadow-lg",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className={cn(
        "flex items-center justify-around",
        isFloating ? "px-2 py-2" : "px-4 py-2"
      )}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isDisabled = item.disabled

          const content = (
            <div className={cn(
              "flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-lg transition-all duration-200 relative",
              isActive && !isDisabled && "bg-amber-600/20 text-amber-400",
              !isActive && !isDisabled && "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50",
              isDisabled && "text-slate-600 cursor-not-allowed",
              "active:scale-95"
            )}
          >
            <div className="relative">
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-4 min-w-4 p-0 text-xs flex items-center justify-center"
                >
                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </div>
            <span className={cn(
              "text-xs font-medium mt-1 transition-all duration-200",
              isActive && "text-amber-400",
              !isActive && "text-slate-500"
            )}>
              {item.label}
            </span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
            )}
          </div>
          )

          if (isDisabled) {
            return (
              <div key={item.href} className="flex-1 flex justify-center">
                {content}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex justify-center"
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Floating Action Button for mobile
interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ComponentType<any>
  label?: string
  className?: string
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  position?: "bottom-right" | "bottom-left" | "bottom-center"
}

export function FloatingActionButton({
  onClick,
  icon: Icon,
  label,
  className,
  variant = "primary",
  size = "md",
  position = "bottom-right"
}: FloatingActionButtonProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-14 w-14",
    lg: "h-16 w-16"
  }

  const iconSizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6", 
    lg: "h-7 w-7"
  }

  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-left": "bottom-20 left-4",
    "bottom-center": "bottom-20 left-1/2 transform -translate-x-1/2"
  }

  const variantClasses = {
    primary: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl"
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-40 rounded-full transition-all duration-200 active:scale-95 md:hidden",
        sizeClasses[size],
        positionClasses[position],
        variantClasses[variant],
        "flex items-center justify-center",
        className
      )}
      aria-label={label}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  )
}

// Mobile tab bar for switching between views
interface TabBarProps {
  tabs: Array<{
    id: string
    label: string
    icon?: React.ComponentType<any>
    badge?: number | string
    disabled?: boolean
  }>
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  className
}: TabBarProps) {
  return (
    <div className={cn(
      "flex bg-slate-800/50 rounded-lg p-1 overflow-x-auto",
      className
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        const isDisabled = tab.disabled

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap relative flex-shrink-0",
              isActive && "bg-amber-600 text-white shadow-sm",
              !isActive && !isDisabled && "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50",
              isDisabled && "text-slate-600 cursor-not-allowed",
              "active:scale-95"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="text-sm font-medium">{tab.label}</span>
            {tab.badge && (
              <Badge
                variant="destructive"
                className="h-4 min-w-4 p-0 text-xs flex items-center justify-center ml-1"
              >
                {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
              </Badge>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Mobile-optimized search bar
interface MobileSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  className?: string
  showCancel?: boolean
  onCancel?: () => void
}

export function MobileSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className,
  showCancel = false,
  onCancel
}: MobileSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      )}
    </form>
  )
}

// Mobile page header with back button
interface MobilePageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function MobilePageHeader({
  title,
  subtitle,
  onBack,
  actions,
  className
}: MobilePageHeaderProps) {
  return (
    <header className={cn(
      "flex items-center gap-3 p-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-16 z-20",
      className
    )}>
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-400 truncate">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  )
}