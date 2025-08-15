"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import type { GraphNode } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Network, FileText, BookOpen, Link2 } from "lucide-react"
import GraphNodeCard from "./graph-node-card"
import CreateGraphNode from "./create-graph-node"

export default function GraphDashboard() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const nodeTypes = [
    { value: "all", label: "All Types", icon: Network },
    { value: "note", label: "Notes", icon: FileText },
    { value: "document", label: "Documents", icon: BookOpen },
    { value: "reference", label: "References", icon: Link2 },
  ]

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchNodes()
  }, [])

  // Memoized filtered nodes for better performance
  const filteredNodes = useMemo(() => {
    let filtered = nodes

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (node) =>
          node.title.toLowerCase().includes(searchLower) ||
          node.content?.toLowerCase().includes(searchLower) ||
          node.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((node) => node.type === selectedType)
    }

    return filtered
  }, [nodes, debouncedSearchTerm, selectedType])

  const fetchNodes = async () => {
    try {
      const { data, error } = await supabase.from("graph").select("*").order("updated_at", { ascending: false })

      if (error) throw error
      setNodes(data || [])
    } catch (error) {
      console.error("Error fetching nodes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Optimized callback functions
  const handleNodeCreated = useCallback((newNode: GraphNode) => {
    setNodes(prevNodes => [newNode, ...prevNodes])
    setShowCreateModal(false)
  }, [])

  const handleNodeUpdated = useCallback((updatedNode: GraphNode) => {
    setNodes(prevNodes => prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node)))
  }, [])

  const handleNodeDeleted = useCallback((nodeId: string) => {
    setNodes(prevNodes => prevNodes.filter((node) => node.id !== nodeId))
  }, [])



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-lg">Loading your knowledge graph...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">TimeWeave Graph</h1>
            <p className="text-slate-400 text-lg">Your interconnected knowledge system</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Node
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Nodes</p>
                  <p className="text-2xl font-bold text-white">{nodes.length}</p>
                </div>
                <Network className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Notes</p>
                  <p className="text-2xl font-bold text-white">{nodes.filter((n) => n.type === "note").length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Documents</p>
                  <p className="text-2xl font-bold text-white">{nodes.filter((n) => n.type === "document").length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">References</p>
                  <p className="text-2xl font-bold text-white">{nodes.filter((n) => n.type === "reference").length}</p>
                </div>
                <Link2 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search nodes, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {nodeTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  onClick={() => setSelectedType(type.value)}
                  className={
                    selectedType === type.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      {filteredNodes.length === 0 ? (
        <div className="text-center py-12">
          <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {nodes.length === 0 ? "No nodes yet" : "No nodes match your filters"}
          </h3>
          <p className="text-slate-500 mb-6">
            {nodes.length === 0
              ? "Create your first knowledge node to get started"
              : "Try adjusting your search or filters"}
          </p>
          {nodes.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Node
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map((node) => (
            <GraphNodeCard key={node.id} node={node} onUpdate={handleNodeUpdated} onDelete={handleNodeDeleted} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateGraphNode onClose={() => setShowCreateModal(false)} onNodeCreated={handleNodeCreated} />
      )}
    </div>
  )
}
