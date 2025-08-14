"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GraphNode, Action, Module } from "@/lib/supabase/client"
import { Calendar, Clock, Network, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TimelineViewProps {
  items: Array<(GraphNode | Action | Module) & { itemType: string }>
  graphNodes: GraphNode[]
  actions: Action[]
  modules: Module[]
}

export default function TimelineView({ items }: TimelineViewProps) {
  const groupedItems = items.reduce(
    (groups, item) => {
      const date = new Date(item.updated_at).toDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(item)
      return groups
    },
    {} as Record<string, typeof items>,
  )

  const getItemIcon = (item: any) => {
    if (item.itemType === "graph") return <Network className="w-4 h-4 text-amber-400" />
    if (item.itemType === "actions") return <Clock className="w-4 h-4 text-blue-400" />
    return <Zap className="w-4 h-4 text-green-400" />
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, dayItems]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">{date}</h3>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="space-y-3 ml-8">
              {dayItems.map((item) => (
                <Card key={`${item.itemType}-${item.id}`} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getItemIcon(item)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-medium">{"title" in item ? item.title : item.name}</h4>
                          <Badge
                            variant="outline"
                            className={
                              item.itemType === "graph"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : item.itemType === "actions"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-green-500/20 text-green-300 border-green-500/30"
                            }
                          >
                            {item.itemType}
                          </Badge>
                        </div>
                        {(item.content || item.description) && (
                          <p className="text-slate-400 text-sm mb-2">{item.content || item.description}</p>
                        )}
                        <div className="text-xs text-slate-500">
                          Updated {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
