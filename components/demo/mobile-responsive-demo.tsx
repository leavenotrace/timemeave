"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { MobileCard, MobileActionCard, MobileGraphNodeCard, MobileModuleCard } from "@/components/ui/mobile-card"
import { ResponsiveGrid, FlexGrid, Stack, ResponsiveSection, MobileList } from "@/components/ui/responsive-grid"
import { SwipeableCard, LongPress, PullToRefresh, ActionSheet, commonSwipeActions } from "@/components/ui/touch-interactions"
import { BottomNavigation, FloatingActionButton, TabBar, MobileSearchBar, MobilePageHeader } from "@/components/ui/bottom-navigation"
import { Network, Layers, Zap, BarChart3, Eye, BookOpen, Plus, Search, Filter, Settings, Star, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toastUtils } from "@/lib/toast-utils"

export function MobileResponsiveDemo() {
  const [activeTab, setActiveTab] = useState("cards")
  const [searchValue, setSearchValue] = useState("")
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const bottomNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/graph", label: "Graph", icon: Network, badge: 3 },
    { href: "/actions", label: "Actions", icon: Layers, badge: 12 },
    { href: "/modules", label: "Modules", icon: Zap },
    { href: "/workbench", label: "Workbench", icon: Eye },
  ]

  const tabs = [
    { id: "cards", label: "Cards", icon: Layers },
    { id: "grid", label: "Grid", icon: BarChart3 },
    { id: "touch", label: "Touch", icon: Star, badge: 2 },
    { id: "navigation", label: "Navigation", icon: Network },
  ]

  const actionSheetActions = [
    {
      id: "edit",
      label: "Edit Item",
      icon: Settings,
      action: () => toastUtils.success("Edit action triggered")
    },
    {
      id: "share",
      label: "Share Item", 
      icon: Star,
      action: () => toastUtils.info("Share action triggered")
    },
    {
      id: "delete",
      label: "Delete Item",
      icon: Settings,
      variant: "destructive" as const,
      action: () => toastUtils.error("Delete action triggered")
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
    toastUtils.success("Content refreshed!")
  }

  const sampleActions = [
    {
      title: "Complete project proposal",
      description: "Finish the Q4 project proposal document and send for review",
      status: "active" as const,
      priority: 1 as const,
      estimatedTime: 120,
      tags: ["work", "urgent"]
    },
    {
      title: "Review team feedback",
      description: "Go through the feedback from the design team",
      status: "pending" as const,
      priority: 3 as const,
      estimatedTime: 45,
      tags: ["review"]
    },
    {
      title: "Update documentation",
      description: "Update the API documentation with new endpoints",
      status: "completed" as const,
      priority: 2 as const,
      actualTime: 90,
      tags: ["docs", "api"]
    }
  ]

  const sampleNodes = [
    {
      title: "React Best Practices",
      content: "Collection of React development best practices and patterns",
      type: "document" as const,
      tags: ["react", "frontend", "best-practices"],
      connections: 5,
      lastUpdated: "2 hours ago"
    },
    {
      title: "API Design Notes",
      content: "Notes on RESTful API design principles",
      type: "note" as const,
      tags: ["api", "backend"],
      connections: 3,
      lastUpdated: "1 day ago"
    }
  ]

  const sampleModules = [
    {
      name: "Daily Standup Reminder",
      description: "Automatically remind team about daily standup meetings",
      type: "automation" as const,
      isActive: true,
      executionCount: 45,
      lastExecuted: "Today at 9:00 AM"
    },
    {
      name: "Code Review Template",
      description: "Template for creating consistent code review tasks",
      type: "template" as const,
      isActive: false,
      executionCount: 12,
      lastExecuted: "3 days ago"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Mobile Page Header */}
      <MobilePageHeader
        title="Mobile Demo"
        subtitle="Responsive design showcase"
        actions={
          <Button size="sm" variant="outline" onClick={() => setShowActionSheet(true)}>
            <Settings className="h-4 w-4" />
          </Button>
        }
      />

      {/* Mobile Search */}
      <div className="px-4">
        <MobileSearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search demo items..."
          showCancel={searchValue.length > 0}
          onCancel={() => setSearchValue("")}
        />
      </div>

      {/* Tab Navigation */}
      <div className="px-4">
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Pull to Refresh Container */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 space-y-6">
          {/* Cards Tab */}
          {activeTab === "cards" && (
            <ResponsiveSection
              title="Mobile Cards"
              description="Optimized card layouts for mobile devices"
              spacing="normal"
            >
              <MobileList spacing="normal">
                {sampleActions.map((action, index) => (
                  <MobileActionCard
                    key={index}
                    {...action}
                    onEdit={() => toastUtils.info(`Edit ${action.title}`)}
                    onComplete={() => toastUtils.success(`Completed ${action.title}`)}
                    onFold={() => toastUtils.info(`Folded ${action.title}`)}
                    onClick={() => toastUtils.info(`Clicked ${action.title}`)}
                  />
                ))}
              </MobileList>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Graph Nodes</h3>
                <MobileList spacing="normal">
                  {sampleNodes.map((node, index) => (
                    <MobileGraphNodeCard
                      key={index}
                      {...node}
                      onEdit={() => toastUtils.info(`Edit ${node.title}`)}
                      onConnect={() => toastUtils.info(`Connect ${node.title}`)}
                      onClick={() => toastUtils.info(`Clicked ${node.title}`)}
                    />
                  ))}
                </MobileList>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Modules</h3>
                <MobileList spacing="normal">
                  {sampleModules.map((module, index) => (
                    <MobileModuleCard
                      key={index}
                      {...module}
                      onToggle={() => toastUtils.info(`Toggled ${module.name}`)}
                      onEdit={() => toastUtils.info(`Edit ${module.name}`)}
                      onExecute={() => toastUtils.success(`Executed ${module.name}`)}
                      onClick={() => toastUtils.info(`Clicked ${module.name}`)}
                    />
                  ))}
                </MobileList>
              </div>
            </ResponsiveSection>
          )}

          {/* Grid Tab */}
          {activeTab === "grid" && (
            <ResponsiveSection
              title="Responsive Grids"
              description="Different grid layouts that adapt to screen size"
              spacing="normal"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Responsive Grid</h3>
                  <ResponsiveGrid
                    cols={{ default: 1, sm: 2, md: 3, lg: 4 }}
                    gap="md"
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <MobileCard
                        key={i}
                        title={`Grid Item ${i + 1}`}
                        description="This is a sample grid item"
                        badges={[{ label: "Sample", variant: "secondary" }]}
                        metadata={[
                          { icon: Clock, label: "Time", value: "2m ago" },
                          { icon: User, label: "Author", value: "Demo" }
                        ]}
                        variant="compact"
                      />
                    ))}
                  </ResponsiveGrid>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Flex Grid</h3>
                  <FlexGrid minItemWidth="200px" maxItemWidth="300px" gap="md">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <MobileCard
                        key={i}
                        title={`Flex Item ${i + 1}`}
                        description="This item uses flex grid layout"
                        badges={[{ label: "Flex", variant: "outline" }]}
                        variant="compact"
                      />
                    ))}
                  </FlexGrid>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Stack Layout</h3>
                  <Stack direction="responsive" gap="md" align="stretch">
                    <MobileCard
                      title="Stack Item 1"
                      description="Vertical on mobile, horizontal on desktop"
                      badges={[{ label: "Stack", variant: "default" }]}
                    />
                    <MobileCard
                      title="Stack Item 2"
                      description="Responsive stack layout"
                      badges={[{ label: "Responsive", variant: "secondary" }]}
                    />
                  </Stack>
                </div>
              </div>
            </ResponsiveSection>
          )}

          {/* Touch Tab */}
          {activeTab === "touch" && (
            <ResponsiveSection
              title="Touch Interactions"
              description="Swipe, long press, and other touch gestures"
              spacing="normal"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Swipeable Cards</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Swipe left for delete, swipe right for edit
                  </p>
                  <MobileList spacing="normal">
                    {sampleActions.slice(0, 2).map((action, index) => (
                      <SwipeableCard
                        key={index}
                        leftActions={[{
                          ...commonSwipeActions.edit,
                          action: () => toastUtils.info(`Edit ${action.title}`)
                        }]}
                        rightActions={[{
                          ...commonSwipeActions.delete,
                          action: () => toastUtils.error(`Delete ${action.title}`)
                        }]}
                      >
                        <MobileActionCard
                          {...action}
                          onClick={() => toastUtils.info(`Clicked ${action.title}`)}
                        />
                      </SwipeableCard>
                    ))}
                  </MobileList>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Long Press</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Long press the card below for context menu
                  </p>
                  <LongPress
                    onLongPress={() => setShowActionSheet(true)}
                    onPress={() => toastUtils.info("Short press detected")}
                  >
                    <MobileCard
                      title="Long Press Demo"
                      description="Long press this card to see the context menu"
                      badges={[{ label: "Interactive", variant: "default" }]}
                    />
                  </LongPress>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Touch Feedback</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-16 active:scale-95 transition-transform"
                      onClick={() => toastUtils.success("Button pressed!")}
                    >
                      <div className="text-center">
                        <Plus className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm">Add Item</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 active:scale-95 transition-transform"
                      onClick={() => toastUtils.info("Filter pressed!")}
                    >
                      <div className="text-center">
                        <Filter className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm">Filter</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </ResponsiveSection>
          )}

          {/* Navigation Tab */}
          {activeTab === "navigation" && (
            <ResponsiveSection
              title="Mobile Navigation"
              description="Bottom navigation and floating action buttons"
              spacing="normal"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Bottom Navigation</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    The bottom navigation is visible on mobile devices (check the bottom of the screen)
                  </p>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <BottomNavigation items={bottomNavItems} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Floating Action Button</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    FAB is positioned at the bottom right on mobile
                  </p>
                  <div className="text-center">
                    <Badge variant="secondary">Check bottom right corner on mobile</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Tab Bar</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Horizontal scrollable tabs for switching views
                  </p>
                  <TabBar
                    tabs={[
                      { id: "all", label: "All Items", badge: 24 },
                      { id: "active", label: "Active", badge: 8 },
                      { id: "completed", label: "Completed", badge: 16 },
                      { id: "archived", label: "Archived" },
                      { id: "favorites", label: "Favorites", badge: 3 },
                    ]}
                    activeTab="active"
                    onTabChange={(tab) => toastUtils.info(`Switched to ${tab} tab`)}
                  />
                </div>
              </div>
            </ResponsiveSection>
          )}
        </div>
      </PullToRefresh>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Plus}
        onClick={() => toastUtils.success("FAB clicked!")}
        label="Add new item"
      />

      {/* Action Sheet */}
      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Choose an action"
        actions={actionSheetActions}
      />

      {/* Bottom Navigation (visible on mobile) */}
      <BottomNavigation items={bottomNavItems} />
    </div>
  )
}