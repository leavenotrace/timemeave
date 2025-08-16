"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: "sm" | "md" | "lg"
  minItemWidth?: string
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "md",
  minItemWidth
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  }

  const getGridCols = () => {
    const classes = []
    if (cols.default) classes.push(`grid-cols-${cols.default}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    return classes.join(" ")
  }

  if (minItemWidth) {
    return (
      <div
        className={cn(
          "grid auto-fit-grid",
          gapClasses[gap],
          className
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={cn(
      "grid",
      getGridCols(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface MasonryGridProps {
  children: React.ReactNode
  className?: string
  columnWidth?: string
  gap?: "sm" | "md" | "lg"
}

export function MasonryGrid({
  children,
  className,
  columnWidth = "300px",
  gap = "md"
}: MasonryGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4", 
    lg: "gap-6"
  }

  return (
    <div
      className={cn(
        "masonry-grid",
        gapClasses[gap],
        className
      )}
      style={{
        columnWidth,
        columnFill: "balance"
      }}
    >
      {children}
    </div>
  )
}

interface FlexGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: string
  maxItemWidth?: string
  gap?: "sm" | "md" | "lg"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  align?: "start" | "center" | "end" | "stretch"
}

export function FlexGrid({
  children,
  className,
  minItemWidth = "250px",
  maxItemWidth = "400px",
  gap = "md",
  justify = "start",
  align = "stretch"
}: FlexGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  }

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  }

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end", 
    stretch: "items-stretch"
  }

  return (
    <div className={cn(
      "flex flex-wrap",
      gapClasses[gap],
      justifyClasses[justify],
      alignClasses[align],
      className
    )}>
      {React.Children.map(children, (child) => (
        <div
          className="flex-grow flex-shrink-0"
          style={{
            minWidth: minItemWidth,
            maxWidth: maxItemWidth,
            flexBasis: minItemWidth
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Mobile-first responsive container
interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
}

export function MobileContainer({
  children,
  className,
  padding = "md",
  maxWidth = "full"
}: MobileContainerProps) {
  const paddingClasses = {
    none: "",
    sm: "px-2 py-2",
    md: "px-4 py-4",
    lg: "px-6 py-6"
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg", 
    xl: "max-w-xl",
    full: "max-w-full"
  }

  return (
    <div className={cn(
      "w-full mx-auto",
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive stack layout
interface StackProps {
  children: React.ReactNode
  className?: string
  direction?: "vertical" | "horizontal" | "responsive"
  gap?: "sm" | "md" | "lg"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean
}

export function Stack({
  children,
  className,
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false
}: StackProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  }

  const alignClasses = {
    start: direction === "vertical" ? "items-start" : "justify-start",
    center: direction === "vertical" ? "items-center" : "justify-center",
    end: direction === "vertical" ? "items-end" : "justify-end",
    stretch: direction === "vertical" ? "items-stretch" : "justify-stretch"
  }

  const justifyClasses = {
    start: direction === "vertical" ? "justify-start" : "items-start",
    center: direction === "vertical" ? "justify-center" : "items-center",
    end: direction === "vertical" ? "justify-end" : "items-end",
    between: direction === "vertical" ? "justify-between" : "items-between",
    around: direction === "vertical" ? "justify-around" : "items-around",
    evenly: direction === "vertical" ? "justify-evenly" : "items-evenly"
  }

  const getDirectionClasses = () => {
    switch (direction) {
      case "horizontal":
        return "flex flex-row"
      case "responsive":
        return "flex flex-col sm:flex-row"
      default:
        return "flex flex-col"
    }
  }

  return (
    <div className={cn(
      getDirectionClasses(),
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      wrap && "flex-wrap",
      className
    )}>
      {children}
    </div>
  )
}

// Responsive section with mobile-optimized spacing
interface ResponsiveSectionProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  headerActions?: React.ReactNode
  spacing?: "tight" | "normal" | "loose"
}

export function ResponsiveSection({
  children,
  className,
  title,
  description,
  headerActions,
  spacing = "normal"
}: ResponsiveSectionProps) {
  const spacingClasses = {
    tight: "space-y-2",
    normal: "space-y-4",
    loose: "space-y-6"
  }

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || description || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

// Mobile-optimized list layout
interface MobileListProps {
  children: React.ReactNode
  className?: string
  dividers?: boolean
  spacing?: "tight" | "normal" | "loose"
}

export function MobileList({
  children,
  className,
  dividers = true,
  spacing = "normal"
}: MobileListProps) {
  const spacingClasses = {
    tight: "space-y-1",
    normal: "space-y-2", 
    loose: "space-y-4"
  }

  return (
    <div className={cn(
      spacingClasses[spacing],
      dividers && "divide-y divide-slate-800",
      className
    )}>
      {children}
    </div>
  )
}