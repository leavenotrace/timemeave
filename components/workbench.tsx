"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { GraphNode, Action, Module } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Grid3X3,
  List,
  Network,
  Calendar,
  Filter,
  Plus,
  Eye,
  Link2,
  Clock,
  Layers,
  Zap,
  FileText,
  BookOpen,
} from "lucide-react"
import UnifiedSearch from "./unified-search"
import TimelineView from "./timeline-view"
import NetworkView from "./network-view"
import KanbanView from "./kanban-view"

type ViewMode = "grid" | "list" | "timeline" | "network" | "kanban"

export default function Workbench() {
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showUnifiedSearch, setShowUnifiedSearch] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const viewModes = [
    { value: "grid", label: "Grid", icon: Grid3X3 },
    { value: "list", label: "List", icon: List },
    { value: "timeline", label: "Timeline", icon: Calendar },
    { value: "network", label: "Network", icon: Network },
    { value: "kanban", label: "Kanban", icon: Layers },
  ]

  const filters = [
    { value: "all", label: "All Items", count: 0 },
    { value: "graph", label: "Graph Nodes", count: 0 },
    { value: "actions", label: "Actions", count: 0 },
    { value: "modules", label: "Modules", count: 0 },
    { value: "connected", label: "Connected", count: 0 },
    { value: "recent", label: "Recent", count: 0 },
  ]

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setError(null)
      const supabase = createClient()

      const [graphResult, actionsResult, modulesResult] = await Promise.all([
        supabase.from("graph").select("*").order("updated_at", { ascending: false }),
        supabase.from("actions").select("*").order("updated_at", { ascending: false }),
        supabase.from("modules").select("*").order("updated_at", { ascending: false }),
      ])

      if (graphResult.error) throw graphResult.error
      if (actionsResult.error) throw actionsResult.error
      if (modulesResult.error) throw modulesResult.error

      setGraphNodes(graphResult.data || [])
      setActions(actionsResult.data || [])
      setModules(modulesResult.data || [])
    } catch (error) {
      console.error("Error fetching workbench data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredData = () => {
    let allItems: Array<(GraphNode | Action | Module) & { itemType: string }> = []

    const graphItems = graphNodes.map((item) => ({ ...item, itemType: "graph" }))
    const actionItems = actions.map((item) => ({ ...item, itemType: "actions" }))
    const moduleItems = modules.map((item) => ({ ...item, itemType: "modules" }))

    allItems = [...graphItems, ...actionItems, ...moduleItems]

    if (selectedFilter !== "all") {
      if (selectedFilter === "graph") allItems = graphItems
      else if (selectedFilter === "actions") allItems = actionItems
      else if (selectedFilter === "modules") allItems = moduleItems
      else if (selectedFilter === "connected") {
        allItems = allItems.filter((item) => {
          if (item.itemType === "graph") return (item as GraphNode).connections.length > 0
          if (item.itemType === "actions") return (item as Action).graph_connections.length > 0
          return false
        })
      } else if (selectedFilter === "recent") {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        allItems = allItems.filter((item) => new Date(item.updated_at) > oneDayAgo)
      }
    }

    if (searchTerm) {
      allItems = allItems.filter((item) => {
        const title = "title" in item ? item.title : "name" in item ? item.name : ""
        const content = "content" in item ? item.content : "description" in item ? item.description : ""
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (content && content.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
    }

    return allItems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  const getItemIcon = (item: any) => {
    if (item.itemType === "graph") {
      switch (item.type) {
        case "note":
          return <FileText className="w-4 h-4 text-blue-400" />
        case "document":
          return <BookOpen className="w-4 h-4 text-green-400" />
        case "reference":
          return <Link2 className="w-4 h-4 text-purple-400" />
        default:
          return <Network className="w-4 h-4 text-amber-400" />
      }
    } else if (item.itemType === "actions") {
      return <Clock className="w-4 h-4 text-blue-400" />
    } else {
      return <Zap className="w-4 h-4 text-green-400" />
    }
  }

  const getItemBadgeColor = (item: any) => {
    if (item.itemType === "graph") return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    if (item.itemType === "actions") {
      switch (item.status) {
        case "pending":
          return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        case "active":
          return "bg-blue-500/20 text-blue-300 border-blue-500/30"
        case "folded":
          return "bg-purple-500/20 text-purple-300 border-purple-500/30"
        case "completed":
          return "bg-green-500/20 text-green-300 border-green-500/30"
        default:
          return "bg-slate-500/20 text-slate-300 border-slate-500/30"
      }
    }
    return item.is_active
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-slate-500/20 text-slate-300 border-slate-500/30"
  }

  const renderGridView = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={`${item.itemType}-${item.id}`} className="bg-slate-900 border-slate-800 hover:border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                {getItemIcon(item)}
                <CardTitle className="text-white text-sm leading-tight truncate">
                  {"title" in item ? item.title : item.name}
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1 h-6 w-6">
                <Eye className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getItemBadgeColor(item)} variant="outline">
                {item.itemType === "actions" ? item.status : item.itemType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {(item.content || item.description) && (
              <p className="text-slate-400 text-xs leading-relaxed truncate">{item.content || item.description}</p>
            )}
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <span>{new Date(item.updated_at).toLocaleDateString()}</span>
              {item.itemType === "graph" && item.connections.length > 0 && (
                <span>{item.connections.length} connections</span>
              )}
              {item.itemType === "actions" && item.graph_connections.length > 0 && (
                <span>{item.graph_connections.length} linked</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = (items: any[]) => (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={`${item.itemType}-${item.id}`} className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getItemIcon(item)}
                <div className="flex-1">
                  <h3 className="text-white font-medium">{"title" in item ? item.title : item.name}</h3>
                  {(item.content || item.description) && (
                    <p className="text-slate-400 text-sm truncate mt-1">{item.content || item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getItemBadgeColor(item)} variant="outline">
                    {item.itemType === "actions" ? item.status : item.itemType}
                  </Badge>
                  <span className="text-slate-500 text-sm">{new Date(item.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-lg">Loading your workbench...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg mb-4">Error loading workbench</div>
        <div className="text-slate-400 mb-4">{error}</div>
        <Button onClick={fetchAllData} className="bg-amber-600 hover:bg-amber-700 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  const filteredData = getFilteredData()
  const updatedFilters = filters.map((filter) => ({
    ...filter,
    count:
      filter.value === "all"
        ? graphNodes.length + actions.length + modules.length
        : filter.value === "graph"
          ? graphNodes.length
          : filter.value === "actions"
            ? actions.length
            : filter.value === "modules"
              ? modules.length
              : filter.value === "connected"
                ? graphNodes.filter((n) => n.connections.length > 0).length +
                  actions.filter((a) => a.graph_connections.length > 0).length
                : filter.value === "recent"
                  ? [...graphNodes, ...actions, ...modules].filter(
                      (item) => new Date(item.updated_at) > new Date(Date.now() - 24 * 60 * 60 * 1000),
                    ).length
                  : 0,
  }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Workbench</h1>
            <p className="text-slate-400 text-lg">Unified workspace for all your TimeWeave systems</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowUnifiedSearch(true)}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Search className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search across all systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            {viewModes.map((mode) => {
              const Icon = mode.icon
              return (
                <Button
                  key={mode.value}
                  variant={viewMode === mode.value ? "default" : "outline"}
                  onClick={() => setViewMode(mode.value as ViewMode)}
                  className={
                    viewMode === mode.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {mode.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {updatedFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter.value)}
              className={
                selectedFilter === filter.value
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
              }
            >
              <Filter className="w-3 h-3 mr-1" />
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" && renderGridView(filteredData)}
            {viewMode === "list" && renderListView(filteredData)}
            {viewMode === "timeline" && (
              <TimelineView items={filteredData} graphNodes={graphNodes} actions={actions} modules={modules} />
            )}
            {viewMode === "network" && <NetworkView graphNodes={graphNodes} actions={actions} modules={modules} />}
            {viewMode === "kanban" && <KanbanView actions={actions} />}
          </>
        )}
      </div>

      {showUnifiedSearch && (
        <UnifiedSearch
          onClose={() => setShowUnifiedSearch(false)}
          graphNodes={graphNodes}
          actions={actions}
          modules={modules}
        />
      )}
    </div>
  )
}
