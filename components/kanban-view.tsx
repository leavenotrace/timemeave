"use client"

import type { Action } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Circle, Layers, CheckCircle } from "lucide-react"

interface KanbanViewProps {
  actions: Action[]
}

export default function KanbanView({ actions }: KanbanViewProps) {
  const columns = [
    { status: "pending", title: "Pending", icon: Circle, color: "text-yellow-400" },
    { status: "active", title: "Active", icon: Clock, color: "text-blue-400" },
    { status: "folded", title: "Folded", icon: Layers, color: "text-purple-400" },
    { status: "completed", title: "Completed", icon: CheckCircle, color: "text-green-400" },
  ]

  const getActionsByStatus = (status: string) => {
    return actions.filter((action) => action.status === status)
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "border-l-red-500"
    if (priority <= 3) return "border-l-yellow-500"
    return "border-l-green-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const Icon = column.icon
        const columnActions = getActionsByStatus(column.status)

        return (
          <div key={column.status}>
            <Card className="bg-slate-900 border-slate-800 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon className={`w-5 h-5 ${column.color}`} />
                  {column.title}
                  <Badge variant="outline" className="ml-auto border-slate-600 text-slate-400">
                    {columnActions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="space-y-3">
              {columnActions.map((action) => (
                <Card
                  key={action.id}
                  className={`bg-slate-900 border-slate-800 hover:border-slate-700 border-l-4 ${getPriorityColor(
                    action.priority,
                  )}`}
                >
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-2">{action.title}</h4>
                    {action.description && (
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{action.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            action.priority <= 2
                              ? "border-red-500/30 text-red-300"
                              : action.priority <= 3
                                ? "border-yellow-500/30 text-yellow-300"
                                : "border-green-500/30 text-green-300"
                          }
                        >
                          P{action.priority}
                        </Badge>
                        {action.estimated_time && <span className="text-slate-500">{action.estimated_time}m</span>}
                      </div>
                      {action.graph_connections.length > 0 && (
                        <span className="text-slate-500">{action.graph_connections.length} linked</span>
                      )}
                    </div>
                    {action.folded_actions.length > 0 && (
                      <div className="mt-2 text-xs text-purple-400">
                        Contains {action.folded_actions.length} folded actions
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {columnActions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${column.color} opacity-50`} />
                  <p className="text-sm">No {column.title.toLowerCase()} actions</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
