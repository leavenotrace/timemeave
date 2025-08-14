"use client"

import { useState } from "react"
import type { Module } from "@/lib/supabase/client"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutTemplateIcon as Template,
  Workflow,
  Clock,
  Play,
  Pause,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  Zap,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ModuleCardProps {
  module: Module
  onUpdate: (module: Module) => void
  onDelete: (moduleId: string) => void
}

export default function ModuleCard({ module, onUpdate, onDelete }: ModuleCardProps) {
  const [isToggling, setIsToggling] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "template":
        return <Template className="w-4 h-4 text-green-400" />
      case "automation":
        return <Workflow className="w-4 h-4 text-blue-400" />
      case "trigger":
        return <Clock className="w-4 h-4 text-purple-400" />
      case "workflow":
        return <Play className="w-4 h-4 text-amber-400" />
      default:
        return <Zap className="w-4 h-4 text-slate-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "template":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "automation":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "trigger":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "workflow":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  const handleToggleActive = async () => {
    setIsToggling(true)
    try {
      const { data, error } = await supabase
        .from("modules")
        .update({ is_active: !module.is_active })
        .eq("id", module.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
    } catch (error) {
      console.error("Error toggling module:", error)
    } finally {
      setIsToggling(false)
    }
  }

  const getTriggerSummary = () => {
    if (!module.triggers || module.triggers.length === 0) return "No triggers"
    const triggerCount = module.triggers.length
    return `${triggerCount} trigger${triggerCount !== 1 ? "s" : ""}`
  }

  const getActionSummary = () => {
    if (!module.actions || module.actions.length === 0) return "No actions"
    const actionCount = module.actions.length
    return `${actionCount} action${actionCount !== 1 ? "s" : ""}`
  }

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {getTypeIcon(module.type)}
            <CardTitle className="text-white text-lg leading-tight">{module.name}</CardTitle>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleActive}
              disabled={isToggling}
              className={`p-1 h-8 w-8 ${
                module.is_active
                  ? "text-green-400 hover:text-green-300 hover:bg-green-500/20"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {module.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
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

        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(module.type)}>{module.type}</Badge>
          <Badge
            className={
              module.is_active
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-slate-500/20 text-slate-300 border-slate-500/30"
            }
          >
            {module.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {module.description && <p className="text-slate-300 text-sm leading-relaxed mb-4">{module.description}</p>}

        <div className="space-y-3">
          {/* Execution Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Executed {module.execution_count} times</span>
            </div>
            {module.last_executed && (
              <span className="text-slate-500 text-xs">
                Last: {formatDistanceToNow(new Date(module.last_executed), { addSuffix: true })}
              </span>
            )}
          </div>

          {/* Triggers and Actions Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-purple-400" />
              <span className="text-slate-400">{getTriggerSummary()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400">{getActionSummary()}</span>
            </div>
          </div>

          {/* Configuration Preview */}
          {module.config && Object.keys(module.config).length > 0 && (
            <div className="bg-slate-800 rounded-lg p-3">
              <h4 className="text-slate-300 text-xs font-medium mb-2">Configuration</h4>
              <div className="space-y-1">
                {Object.entries(module.config)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-400 capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-slate-300 truncate ml-2 max-w-24">
                        {typeof value === "string" ? value : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                {Object.keys(module.config).length > 3 && (
                  <div className="text-xs text-slate-500">+{Object.keys(module.config).length - 3} more...</div>
                )}
              </div>
            </div>
          )}

          {/* Updated Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Updated {formatDistanceToNow(new Date(module.updated_at), { addSuffix: true })}</span>
            </div>
            <Button
              onClick={handleToggleActive}
              disabled={isToggling}
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 h-7 text-xs bg-transparent"
            >
              {isToggling ? "..." : module.is_active ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
