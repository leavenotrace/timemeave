"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { GraphNode } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, FileText, BookOpen, Link2, Network } from "lucide-react"

interface CreateGraphNodeProps {
  onClose: () => void
  onNodeCreated: (node: GraphNode) => void
}

export default function CreateGraphNode({ onClose, onNodeCreated }: CreateGraphNodeProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("note")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  const nodeTypes = [
    { value: "note", label: "Note", icon: FileText, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    {
      value: "document",
      label: "Document",
      icon: BookOpen,
      color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    {
      value: "reference",
      label: "Reference",
      icon: Link2,
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      value: "template",
      label: "Template",
      icon: Network,
      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
  ]

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("graph")
        .insert({
          title: title.trim(),
          content: content.trim() || null,
          type,
          tags,
          metadata: {},
          connections: [],
        })
        .select()
        .single()

      if (error) throw error

      onNodeCreated(data)
    } catch (error) {
      console.error("Error creating node:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl">Create New Node</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter node title..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Type</label>
              <div className="grid grid-cols-2 gap-3">
                {nodeTypes.map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <Button
                      key={nodeType.value}
                      type="button"
                      variant={type === nodeType.value ? "default" : "outline"}
                      onClick={() => setType(nodeType.value)}
                      className={
                        type === nodeType.value
                          ? "bg-amber-600 hover:bg-amber-700 text-white justify-start"
                          : "border-slate-700 text-slate-300 hover:bg-slate-800 justify-start"
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {nodeType.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter node content..."
                rows={6}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:border-slate-500"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 p-0 h-auto text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!title.trim() || loading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
              >
                {loading ? "Creating..." : "Create Node"}
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
