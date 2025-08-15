"use client"

import { useState } from "react"
import type { GraphNode } from "@/lib/supabase/client"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, BookOpen, Link2, Network, Edit, Trash2, Calendar, Save, X, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface GraphNodeCardProps {
  node: GraphNode
  onUpdate: (node: GraphNode) => void
  onDelete: (nodeId: string) => void
}

export default function GraphNodeCard({ node, onUpdate, onDelete }: GraphNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(node.title)
  const [editContent, setEditContent] = useState(node.content || "")
  const [editTags, setEditTags] = useState<string[]>(node.tags)
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleSave = async () => {
    if (!editTitle.trim()) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("graph")
        .update({
          title: editTitle.trim(),
          content: editContent.trim() || null,
          tags: editTags,
          updated_at: new Date().toISOString()
        })
        .eq("id", node.id)
        .select()
        .single()

      if (error) throw error

      onUpdate(data)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating node:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(node.title)
    setEditContent(node.content || "")
    setEditTags(node.tags)
    setNewTag("")
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this node? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from("graph")
        .delete()
        .eq("id", node.id)

      if (error) throw error

      onDelete(node.id)
    } catch (error) {
      console.error("Error deleting node:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (isEditing) {
    return (
      <Card className="bg-slate-900 border-slate-700 border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              {getTypeIcon(node.type)}
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white text-lg font-semibold"
                placeholder="Node title..."
              />
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={loading || !editTitle.trim()}
                className="text-green-400 hover:text-green-300 hover:bg-slate-800 p-1 h-8 w-8"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
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

        <CardContent className="pt-0 space-y-4">
          {/* Content editing */}
          <div>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Node content..."
              rows={4}
              className="bg-slate-800 border-slate-700 text-white resize-none"
            />
          </div>

          {/* Tags editing */}
          <div>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tag..."
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {editTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {editTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-slate-600 text-slate-400 hover:border-slate-500 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

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
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
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
