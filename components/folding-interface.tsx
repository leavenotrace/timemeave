"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Action } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Layers, Zap } from "lucide-react"

interface FoldingInterfaceProps {
  selectedActionIds: string[]
  actions: Action[]
  onClose: () => void
  onComplete: () => void
}

export default function FoldingInterface({ selectedActionIds, actions, onClose, onComplete }: FoldingInterfaceProps) {
  const [foldedTitle, setFoldedTitle] = useState("")
  const [foldedDescription, setFoldedDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedActions = actions.filter((action) => selectedActionIds.includes(action.id))

  const calculateFoldedMetrics = () => {
    const totalEstimatedTime = selectedActions.reduce((sum, action) => sum + (action.estimated_time || 0), 0)
    const highestPriority = Math.min(...selectedActions.map((action) => action.priority))
    const allTags = selectedActions.flatMap((action) => action.graph_connections)
    const uniqueConnections = [...new Set(allTags)]

    return {
      totalEstimatedTime,
      highestPriority,
      connectionCount: uniqueConnections.length,
      actionCount: selectedActions.length,
    }
  }

  const metrics = calculateFoldedMetrics()

  const handleFold = async () => {
    if (!foldedTitle.trim()) return

    setLoading(true)
    try {
      // Create the folded action
      const { data: foldedAction, error: createError } = await supabase
        .from("actions")
        .insert({
          title: foldedTitle.trim(),
          description: foldedDescription.trim() || null,
          status: "folded",
          priority: metrics.highestPriority,
          estimated_time: metrics.totalEstimatedTime,
          folded_actions: selectedActionIds,
          graph_connections: [],
          context: {
            folding_type: "manual",
            original_actions: selectedActions.map((a) => ({
              id: a.id,
              title: a.title,
              priority: a.priority,
              estimated_time: a.estimated_time,
            })),
            folded_at: new Date().toISOString(),
          },
        })
        .select()
        .single()

      if (createError) throw createError

      // Update the original actions to mark them as folded
      const { error: updateError } = await supabase
        .from("actions")
        .update({
          status: "folded",
          parent_action_id: foldedAction.id,
        })
        .in("id", selectedActionIds)

      if (updateError) throw updateError

      onComplete()
    } catch (error) {
      console.error("Error folding actions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return "High"
    if (priority <= 3) return "Medium"
    return "Low"
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "text-red-400"
    if (priority <= 3) return "text-yellow-400"
    return "text-green-400"
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-purple-400" />
            <CardTitle className="text-white text-xl">Fold Actions</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Selected Actions Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Actions to Fold ({selectedActions.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {selectedActions.map((action) => (
                <Card key={action.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm mb-1">{action.title}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge
                            className={`${
                              action.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : action.status === "active"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-slate-500/20 text-slate-300"
                            }`}
                          >
                            {action.status}
                          </Badge>
                          <span className={getPriorityColor(action.priority)}>{getPriorityLabel(action.priority)}</span>
                          {action.estimated_time && (
                            <span className="text-slate-400">{formatTime(action.estimated_time)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Folding Metrics */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Folding Benefits
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">{metrics.actionCount}</div>
                <div className="text-slate-400">Actions Combined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">{formatTime(metrics.totalEstimatedTime)}</div>
                <div className="text-slate-400">Total Time</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPriorityColor(metrics.highestPriority)}`}>
                  {getPriorityLabel(metrics.highestPriority)}
                </div>
                <div className="text-slate-400">Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">{metrics.connectionCount}</div>
                <div className="text-slate-400">Connections</div>
              </div>
            </div>
          </div>

          {/* Folded Action Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Create Folded Action</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Folded Action Title *</label>
              <Input
                value={foldedTitle}
                onChange={(e) => setFoldedTitle(e.target.value)}
                placeholder="Enter a title for the folded action..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Textarea
                value={foldedDescription}
                onChange={(e) => setFoldedDescription(e.target.value)}
                placeholder="Describe how these actions work together..."
                rows={4}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleFold}
              disabled={!foldedTitle.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
            >
              <Layers className="w-4 h-4 mr-2" />
              {loading ? "Folding..." : "Fold Actions"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
