"use client"

import { useState } from "react"
import type { GraphNode } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, BookOpen, Link2, Network, Edit, Trash2, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface GraphNodeCardProps {
  node: GraphNode
  onUpdate: (node: GraphNode) => void
  onDelete: (nodeId: string) => void
}

export default function GraphNodeCard({ node, onUpdate, onDelete }: GraphNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="w-4 h-4 text-blue-400" />
      case "document":
        return <BookOpen className="w-4 h-4 text-green-400" />
      case "reference":
        return <Link2 className="w-4 h-4 text-purple-400" />
      default:
        return <Network className="w-4 h-4 text-amber-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "document":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "reference":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    }
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return ""
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {getTypeIcon(node.type)}
            <CardTitle className="text-white text-lg leading-tight">{node.title}</CardTitle>
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

        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(node.type)}>{node.type}</Badge>
          <div className="flex items-center text-slate-500 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(node.updated_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {node.content && (
          <div className="mb-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              {isExpanded ? node.content : truncateContent(node.content)}
            </p>
            {node.content.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-amber-400 hover:text-amber-300 p-0 h-auto mt-2 text-xs"
              >
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        )}

        {node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {node.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-slate-600 text-slate-400 hover:border-slate-500"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {node.connections.length > 0 && (
          <div className="flex items-center text-slate-500 text-xs">
            <Network className="w-3 h-3 mr-1" />
            {node.connections.length} connection{node.connections.length !== 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
