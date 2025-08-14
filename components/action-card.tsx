"use client"

import { useState } from "react"
import type { Action } from "@/lib/supabase/client"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Circle, Clock, Layers, CheckCircle, Edit, Trash2, Calendar, Timer, AlertCircle, Network } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActionCardProps {
  action: Action
  onUpdate: (action: Action) => void
  onDelete: (actionId: string) => void
  isSelected: boolean
  onSelectionChange: (actionId: string, selected: boolean) => void
}

export default function ActionCard({ action, onUpdate, onDelete, isSelected, onSelectionChange }: ActionCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Circle className="w-4 h-4 text-yellow-400" />
      case "active":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "folded":
        return <Layers className="w-4 h-4 text-purple-400" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Circle className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "text-red-400"
    if (priority <= 3) return "text-yellow-400"
    return "text-green-400"
  }

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return "High"
    if (priority <= 3) return "Medium"
    return "Low"
  }

  const handleStatusChange = async () => {
    const statusFlow = {
      pending: "active",
      active: "completed",
      completed: "pending",
      folded: "active",
    }

    const newStatus = statusFlow[action.status as keyof typeof statusFlow] || "pending"

    setIsUpdating(true)
    try {
      const { data, error } = await supabase
        .from("actions")
        .update({ status: newStatus })
        .eq("id", action.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
    } catch (error) {
      console.error("Error updating action:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatTime = (minutes?: number) => {
    if (!minutes) return "Not set"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <Card
      className={`bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors ${
        isSelected ? "ring-2 ring-purple-500 border-purple-500" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectionChange(action.id, checked as boolean)}
              className="mt-1 border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(action.status)}
                <CardTitle className="text-white text-lg leading-tight">{action.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(action.status)}>{action.status}</Badge>
                <div className="flex items-center gap-1">
                  <AlertCircle className={`w-3 h-3 ${getPriorityColor(action.priority)}`} />
                  <span className={`text-xs ${getPriorityColor(action.priority)}`}>
                    {getPriorityLabel(action.priority)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 hover:bg-slate-800 p-1 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {action.description && <p className="text-slate-300 text-sm leading-relaxed mb-4">{action.description}</p>}

        <div className="space-y-3">
          {/* Time Information */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {action.estimated_time && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Timer className="w-3 h-3" />
                  <span>Est: {formatTime(action.estimated_time)}</span>
                </div>
              )}
              {action.actual_time && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Actual: {formatTime(action.actual_time)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Folded Actions */}
          {action.folded_actions.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Layers className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300">
                Contains {action.folded_actions.length} folded action{action.folded_actions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Graph Connections */}
          {action.graph_connections.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Network className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400">
                {action.graph_connections.length} graph connection{action.graph_connections.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Due Date */}
          {action.due_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">
                Due {formatDistanceToNow(new Date(action.due_date), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Updated Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
            <span>Updated {formatDistanceToNow(new Date(action.updated_at), { addSuffix: true })}</span>
            <Button
              onClick={handleStatusChange}
              disabled={isUpdating}
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-7 text-xs bg-transparent"
            >
              {isUpdating ? "..." : "Next Status"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
