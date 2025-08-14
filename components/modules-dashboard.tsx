"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Search,
  Zap,
  LayoutTemplateIcon as Template,
  Workflow,
  Clock,
  Play,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import ModuleCard from "./module-card"
import CreateModule from "./create-module"

interface Module {
  id: string
  name: string
  description?: string
  type: "template" | "automation" | "trigger" | "workflow"
  is_active: boolean
  trigger_conditions?: any
  actions?: any
  execution_count?: number
  last_executed?: string
  created_at: string
  updated_at: string
  user_id: string
}

export default function ModulesDashboard() {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const moduleTypes = [
    { value: "all", label: "All Modules", icon: Zap, color: "text-slate-400" },
    { value: "template", label: "Templates", icon: Template, color: "text-green-400" },
    { value: "automation", label: "Automations", icon: Workflow, color: "text-blue-400" },
    { value: "trigger", label: "Triggers", icon: Clock, color: "text-purple-400" },
    { value: "workflow", label: "Workflows", icon: Play, color: "text-amber-400" },
  ]

  useEffect(() => {
    fetchModules()
  }, [])

  useEffect(() => {
    filterModules()
  }, [modules, searchTerm, selectedType])

  const fetchModules = async () => {
    try {
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase.from("modules").select("*").order("updated_at", { ascending: false })

      if (error) throw error
      setModules(data || [])
    } catch (error) {
      console.error("Error fetching modules:", error)
      setError("Failed to load modules. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterModules = () => {
    let filtered = modules

    if (searchTerm) {
      filtered = filtered.filter(
        (module) =>
          module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((module) => module.type === selectedType)
    }

    setFilteredModules(filtered)
  }

  const handleModuleCreated = (newModule: Module) => {
    setModules([newModule, ...modules])
    setShowCreateModal(false)
  }

  const handleModuleUpdated = (updatedModule: Module) => {
    setModules(modules.map((module) => (module.id === updatedModule.id ? updatedModule : module)))
  }

  const handleModuleDeleted = (moduleId: string) => {
    setModules(modules.filter((module) => module.id !== moduleId))
  }

  const handleRetry = () => {
    setLoading(true)
    fetchModules()
  }

  const getTypeStats = () => {
    return {
      total: modules.length,
      active: modules.filter((m) => m.is_active).length,
      templates: modules.filter((m) => m.type === "template").length,
      automations: modules.filter((m) => m.type === "automation").length,
      triggers: modules.filter((m) => m.type === "trigger").length,
      workflows: modules.filter((m) => m.type === "workflow").length,
    }
  }

  const stats = getTypeStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-lg">Loading your modules...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Modules</h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button onClick={handleRetry} className="bg-amber-600 hover:bg-amber-700 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Modules Automation</h1>
            <p className="text-slate-400 text-lg">Pre-compile your future with smart automation</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Module
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Zap className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <Play className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Templates</p>
                  <p className="text-2xl font-bold text-green-400">{stats.templates}</p>
                </div>
                <Template className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Automations</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.automations}</p>
                </div>
                <Workflow className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Triggers</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.triggers}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Workflows</p>
                  <p className="text-2xl font-bold text-amber-400">{stats.workflows}</p>
                </div>
                <Play className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {moduleTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  onClick={() => setSelectedType(type.value)}
                  className={
                    selectedType === type.value
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }
                >
                  <Icon className={`w-4 h-4 mr-2 ${type.color}`} />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {modules.length === 0 ? "No modules yet" : "No modules match your filters"}
          </h3>
          <p className="text-slate-500 mb-6">
            {modules.length === 0
              ? "Create your first automation module to pre-compile your future"
              : "Try adjusting your search or filters"}
          </p>
          {modules.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Module
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} onUpdate={handleModuleUpdated} onDelete={handleModuleDeleted} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModule onClose={() => setShowCreateModal(false)} onModuleCreated={handleModuleCreated} />
      )}
    </div>
  )
}
