"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Action } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, AlertCircle, Timer, Calendar } from "lucide-react"

interface CreateActionProps {
  onClose: () => void
  onActionCreated: (action: Action) => void
}

export default function CreateAction({ onClose, onActionCreated }: CreateActionProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(3)
  const [estimatedTime, setEstimatedTime] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)

  const priorityOptions = [
    { value: 1, label: "Critical", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    { value: 2, label: "High", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
    { value: 3, label: "Medium", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { value: 4, label: "Low", color: "bg-green-500/20 text-green-300 border-green-500/30" },
    { value: 5, label: "Minimal", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const actionData: any = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status: "pending",
        context: {},
        folded_actions: [],
        graph_connections: [],
      }

      if (estimatedTime) {
        actionData.estimated_time = Number.parseInt(estimatedTime)
      }

      if (dueDate) {
        actionData.due_date = new Date(dueDate).toISOString()
      }

      const { data, error } = await supabase.from("actions").insert(actionData).select().single()

      if (error) throw error

      onActionCreated(data)
    } catch (error) {
      console.error("Error creating action:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl">Create New Action</CardTitle>
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
                placeholder="Enter action title..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done..."
                rows={4}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Priority</label>
              <div className="grid grid-cols-5 gap-2">
                {priorityOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={priority === option.value ? "default" : "outline"}
                    onClick={() => setPriority(option.value)}
                    className={
                      priority === option.value
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                    }
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Timer className="w-4 h-4 inline mr-1" />
                  Estimated Time (minutes)
                </label>
                <Input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="60"
                  min="1"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date
                </label>
                <Input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!title.trim() || loading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
              >
                {loading ? "Creating..." : "Create Action"}
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
