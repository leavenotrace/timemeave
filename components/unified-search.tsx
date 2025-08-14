"use client"

import { useState } from "react"
import type { GraphNode, Action, Module } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter, Network, Clock, Zap } from "lucide-react"

interface UnifiedSearchProps {
  onClose: () => void
  graphNodes: GraphNode[]
  actions: Action[]
  modules: Module[]
}

export default function UnifiedSearch({ onClose, graphNodes, actions, modules }: UnifiedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [results, setResults] = useState<any[]>([])

  const searchTypes = [
    { value: "all", label: "All" },
    { value: "graph", label: "Graph" },
    { value: "actions", label: "Actions" },
    { value: "modules", label: "Modules" },
  ]

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    const searchResults: any[] = []
    const term = searchTerm.toLowerCase()

    if (searchType === "all" || searchType === "graph") {
      const graphResults = graphNodes
        .filter(
          (node) =>
            node.title.toLowerCase().includes(term) ||
            node.content?.toLowerCase().includes(term) ||
            node.tags.some((tag) => tag.toLowerCase().includes(term)),
        )
        .map((node) => ({ ...node, itemType: "graph" }))
      searchResults.push(...graphResults)
    }

    if (searchType === "all" || searchType === "actions") {
      const actionResults = actions
        .filter(
          (action) => action.title.toLowerCase().includes(term) || action.description?.toLowerCase().includes(term),
        )
        .map((action) => ({ ...action, itemType: "actions" }))
      searchResults.push(...actionResults)
    }

    if (searchType === "all" || searchType === "modules") {
      const moduleResults = modules
        .filter(
          (module) => module.name.toLowerCase().includes(term) || module.description?.toLowerCase().includes(term),
        )
        .map((module) => ({ ...module, itemType: "modules" }))
      searchResults.push(...moduleResults)
    }

    setResults(searchResults)
  }

  const getItemIcon = (item: any) => {
    if (item.itemType === "graph") return <Network className="w-4 h-4 text-amber-400" />
    if (item.itemType === "actions") return <Clock className="w-4 h-4 text-blue-400" />
    return <Zap className="w-4 h-4 text-green-400" />
  }

  const getItemBadgeColor = (item: any) => {
    if (item.itemType === "graph") return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    if (item.itemType === "actions") return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    return "bg-green-500/20 text-green-300 border-green-500/30"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl flex items-center gap-2">
            <Search className="w-5 h-5" />
            Unified Search
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Controls */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
                placeholder="Search across all systems..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              {searchTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={searchType === type.value ? "default" : "outline"}
                  onClick={() => setSearchType(type.value)}
                  className={
                    searchType === type.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                  }
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {type.label}
                </Button>
              ))}
            </div>
            <Button onClick={performSearch} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {results.length === 0 && searchTerm && (
              <div className="text-center py-8 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No results found for "{searchTerm}"</p>
              </div>
            )}

            {results.map((item) => (
              <Card key={`${item.itemType}-${item.id}`} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getItemIcon(item)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{"title" in item ? item.title : item.name}</h4>
                        <Badge className={getItemBadgeColor(item)} variant="outline">
                          {item.itemType}
                        </Badge>
                      </div>
                      {(item.content || item.description) && (
                        <p className="text-slate-400 text-sm mb-2">{item.content || item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                        {item.itemType === "graph" && item.connections.length > 0 && (
                          <span>{item.connections.length} connections</span>
                        )}
                        {item.itemType === "actions" && item.graph_connections.length > 0 && (
                          <span>{item.graph_connections.length} linked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
