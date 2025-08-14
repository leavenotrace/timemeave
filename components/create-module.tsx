"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Module } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, LayoutTemplateIcon as Template, Workflow, Clock, Play } from "lucide-react"

interface CreateModuleProps {
  onClose: () => void
  onModuleCreated: (module: Module) => void
}

interface TriggerConfig {
  id: string
  type: string
  condition: string
  value?: string
}

interface ActionConfig {
  id: string
  type: string
  target: string
  params?: Record<string, any>
}

export default function CreateModule({ onClose, onModuleCreated }: CreateModuleProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("template")
  const [triggers, setTriggers] = useState<TriggerConfig[]>([])
  const [actions, setActions] = useState<ActionConfig[]>([])
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const moduleTypes = [
    {
      value: "template",
      label: "Template",
      icon: Template,
      color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    {
      value: "automation",
      label: "Automation",
      icon: Workflow,
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    { value: "trigger", label: "Trigger", icon: Clock, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { value: "workflow", label: "Workflow", icon: Play, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  ]

  const triggerTypes = [
    { value: "schedule", label: "Schedule", description: "Time-based trigger" },
    { value: "event", label: "Event", description: "Action-based trigger" },
    { value: "condition", label: "Condition", description: "State-based trigger" },
  ]

  const actionTypes = [
    { value: "create_action", label: "Create Action", description: "Create a new action" },
    { value: "create_graph_node", label: "Create Graph Node", description: "Add to knowledge graph" },
    { value: "send_notification", label: "Send Notification", description: "Notify user" },
    { value: "execute_workflow", label: "Execute Workflow", description: "Run another module" },
  ]

  const addTrigger = () => {
    const newTrigger: TriggerConfig = {
      id: Date.now().toString(),
      type: "schedule",
      condition: "",
    }
    setTriggers([...triggers, newTrigger])
  }

  const updateTrigger = (id: string, field: keyof TriggerConfig, value: string) => {
    setTriggers(triggers.map((trigger) => (trigger.id === id ? { ...trigger, [field]: value } : trigger)))
  }

  const removeTrigger = (id: string) => {
    setTriggers(triggers.filter((trigger) => trigger.id !== id))
  }

  const addAction = () => {
    const newAction: ActionConfig = {
      id: Date.now().toString(),
      type: "create_action",
      target: "",
    }
    setActions([...actions, newAction])
  }

  const updateAction = (id: string, field: keyof ActionConfig, value: string) => {
    setActions(actions.map((action) => (action.id === id ? { ...action, [field]: value } : action)))
  }

  const removeAction = (id: string) => {
    setActions(actions.filter((action) => action.id !== id))
  }

  const addConfigField = () => {
    const key = `config_${Object.keys(config).length + 1}`
    setConfig({ ...config, [key]: "" })
  }

  const updateConfigField = (oldKey: string, newKey: string, value: string) => {
    const newConfig = { ...config }
    if (oldKey !== newKey) {
      delete newConfig[oldKey]
    }
    newConfig[newKey] = value
    setConfig(newConfig)
  }

  const removeConfigField = (key: string) => {
    const newConfig = { ...config }
    delete newConfig[key]
    setConfig(newConfig)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const moduleData = {
        name: name.trim(),
        description: description.trim() || null,
        type,
        config,
        triggers: triggers.map(({ id, ...trigger }) => trigger),
        actions: actions.map(({ id, ...action }) => action),
        is_active: true,
        execution_count: 0,
      }

      const { data, error } = await supabase.from("modules").insert(moduleData).select().single()

      if (error) throw error

      onModuleCreated(data)
    } catch (error) {
      console.error("Error creating module:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-xl">Create New Module</CardTitle>
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter module name..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {moduleTypes.map((moduleType) => {
                    const Icon = moduleType.icon
                    return (
                      <Button
                        key={moduleType.value}
                        type="button"
                        variant={type === moduleType.value ? "default" : "outline"}
                        onClick={() => setType(moduleType.value)}
                        className={
                          type === moduleType.value
                            ? "bg-amber-600 hover:bg-amber-700 text-white justify-start text-xs"
                            : "border-slate-700 text-slate-300 hover:bg-slate-800 justify-start text-xs"
                        }
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {moduleType.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this module does..."
                rows={3}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Triggers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-300">Triggers</label>
                <Button
                  type="button"
                  onClick={addTrigger}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Trigger
                </Button>
              </div>
              <div className="space-y-3">
                {triggers.map((trigger) => (
                  <Card key={trigger.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Trigger</Badge>
                        <Button
                          type="button"
                          onClick={() => removeTrigger(trigger.id)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-red-400 p-1 h-6 w-6"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Type</label>
                          <select
                            value={trigger.type}
                            onChange={(e) => updateTrigger(trigger.id, "type", e.target.value)}
                            className="w-full bg-slate-700 border-slate-600 text-white text-sm rounded px-2 py-1"
                          >
                            {triggerTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Condition</label>
                          <Input
                            value={trigger.condition}
                            onChange={(e) => updateTrigger(trigger.id, "condition", e.target.value)}
                            placeholder="e.g., daily_18:00, action_completed"
                            className="bg-slate-700 border-slate-600 text-white text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-300">Actions</label>
                <Button
                  type="button"
                  onClick={addAction}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Action
                </Button>
              </div>
              <div className="space-y-3">
                {actions.map((action) => (
                  <Card key={action.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Action</Badge>
                        <Button
                          type="button"
                          onClick={() => removeAction(action.id)}
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-red-400 p-1 h-6 w-6"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Type</label>
                          <select
                            value={action.type}
                            onChange={(e) => updateAction(action.id, "type", e.target.value)}
                            className="w-full bg-slate-700 border-slate-600 text-white text-sm rounded px-2 py-1"
                          >
                            {actionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Target</label>
                          <Input
                            value={action.target}
                            onChange={(e) => updateAction(action.id, "target", e.target.value)}
                            placeholder="e.g., Daily Review, Project Notes"
                            className="bg-slate-700 border-slate-600 text-white text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-300">Configuration</label>
                <Button
                  type="button"
                  onClick={addConfigField}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Field
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(config).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => updateConfigField(key, e.target.value, value)}
                      placeholder="Key"
                      className="bg-slate-800 border-slate-700 text-white text-sm"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateConfigField(key, key, e.target.value)}
                      placeholder="Value"
                      className="bg-slate-800 border-slate-700 text-white text-sm flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => removeConfigField(key)}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!name.trim() || loading}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
              >
                {loading ? "Creating..." : "Create Module"}
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
