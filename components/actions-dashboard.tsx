"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Action } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Layers, Clock, CheckCircle, Circle } from "lucide-react"
import ActionCard from "./action-card"
import CreateAction from "./create-action"
import FoldingInterface from "./folding-interface"

export default function ActionsDashboard() {
  const [actions, setActions] = useState<Action[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFoldingInterface, setShowFoldingInterface] = useState(false)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statusTypes = [
    { value: "all", label: "All Actions", icon: Layers, color: "text-slate-400" },
    { value: "pending", label: "Pending", icon: Circle, color: "text-yellow-400" },
    { value: "active", label: "Active", icon: Clock, color: "text-blue-400" },
    { value: "folded", label: "Folded", icon: Layers, color: "text-purple-400" },
    { value: "completed", label: "Completed", icon: CheckCircle, color: "text-green-400" },
  ]

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchActions()
  }, [])

  // Memoized filtered actions for better performance
  const filteredActions = useMemo(() => {
    let filtered = actions

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (action) =>
          action.title.toLowerCase().includes(searchLower) ||
          action.description?.toLowerCase().includes(searchLower)
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((action) => action.status === selectedStatus)
    }

    return filtered
  }, [actions, debouncedSearchTerm, selectedStatus])

  const fetchActions = async () => {
    try {
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase.from("actions").select("*").order("updated_at", { ascending: false })

      if (error) throw error
      setActions(data || [])
    } catch (error) {
      console.error("Error fetching actions:", error)
      setError("Failed to load actions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Optimized callback functions
  const handleActionCreated = useCallback((newAction: Action) => {
    setActions(prevActions => [newAction, ...prevActions])
    setShowCreateModal(false)
  }, [])

  const handleActionUpdated = useCallback((updatedAction: Action) => {
    setActions(prevActions => prevActions.map((action) => (action.id === updatedAction.id ? updatedAction : action)))
  }, [])

  const handleActionDeleted = useCallback((actionId: string) => {
    setActions(prevActions => prevActions.filter((action) => action.id !== actionId))
    setSelectedActions(prevSelected => prevSelected.filter((id) => id !== actionId))
  }, [])

  const handleActionSelection = (actionId: string, selected: boolean) => {
    if (selected) {
      setSelectedActions([...selectedActions, actionId])
    } else {
      setSelectedActions(selectedActions.filter((id) => id !== actionId))
    }
  }

  const handleFoldActions = () => {
    if (selectedActions.length >= 2) {
      setShowFoldingInterface(true)
    }
  }

  const handleFoldingComplete = () => {
    setShowFoldingInterface(false)
    setSelectedActions([])
    fetchActions() // Refresh to show folded actions
  }

  const getStatusStats = () => {
    return {
      total: actions.length,
      pending: actions.filter((a) => a.status === "pending").length,
      active: actions.filter((a) => a.status === "active").length,
      folded: actions.filter((a) => a.status === "folded").length,
      completed: actions.filter((a) => a.status === "completed").length,
    }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-lg">Loading your actions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg mb-4">{error}</div>
        <Button onClick={fetchActions} className="bg-amber-600 hover:bg-amber-700 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Actions Folding</h1>
            <p className="text-slate-400 text-lg">Fold the present into efficient workflows</p>
          </div>
          <div className="flex gap-3">
            {selectedActions.length >= 2 && (
              <Button onClick={handleFoldActions} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
                <Layers className="w-5 h-5 mr-2" />
                Fold {selectedActions.length} Actions
              </Button>
            )}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Action
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Layers className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Circle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Folded</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.folded}</p>
                </div>
                <Layers className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Done</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusTypes.map((status) => {
              const Icon = status.icon
              return (
                <Button
                  key={status.value}
                  variant={selectedStatus === status.value ? "default" : "outline"}
                  onClick={() => setSelectedStatus(status.value)}
                  className={
                    selectedStatus === status.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }
                >
                  <Icon className={`w-4 h-4 mr-2 ${status.color}`} />
                  {status.label}
                </Button>
              )
            })}
          </div>
        </div>

        {selectedActions.length > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">
                  {selectedActions.length} action{selectedActions.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedActions([])}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Clear Selection
                </Button>
                {selectedActions.length >= 2 && (
                  <Button
                    onClick={handleFoldActions}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Fold Actions
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Grid */}
      {filteredActions.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {actions.length === 0 ? "No actions yet" : "No actions match your filters"}
          </h3>
          <p className="text-slate-500 mb-6">
            {actions.length === 0
              ? "Create your first action to start folding time"
              : "Try adjusting your search or filters"}
          </p>
          {actions.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Action
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onUpdate={handleActionUpdated}
              onDelete={handleActionDeleted}
              isSelected={selectedActions.includes(action.id)}
              onSelectionChange={handleActionSelection}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateAction onClose={() => setShowCreateModal(false)} onActionCreated={handleActionCreated} />
      )}

      {showFoldingInterface && (
        <FoldingInterface
          selectedActionIds={selectedActions}
          actions={actions}
          onClose={() => setShowFoldingInterface(false)}
          onComplete={handleFoldingComplete}
        />
      )}
    </div>
  )
}
