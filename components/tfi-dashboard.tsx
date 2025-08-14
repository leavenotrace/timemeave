"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { TFIData, GraphNode, Action, Module } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, BarChart3, Network, Layers, Zap, Clock, Target, Award, RefreshCw } from "lucide-react"

export default function TFIDashboard() {
  const [tfiData, setTfiData] = useState<TFIData | null>(null)
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch TFI data
      const { data: tfi, error: tfiError } = await supabase.rpc("calculate_tfi")
      if (tfiError) throw tfiError

      // Fetch all entities
      const [graphResult, actionsResult, modulesResult] = await Promise.all([
        supabase.from("graph").select("*"),
        supabase.from("actions").select("*"),
        supabase.from("modules").select("*"),
      ])

      if (graphResult.error) throw graphResult.error
      if (actionsResult.error) throw actionsResult.error
      if (modulesResult.error) throw modulesResult.error

      setTfiData(tfi)
      setGraphNodes(graphResult.data || [])
      setActions(actionsResult.data || [])
      setModules(modulesResult.data || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
    setRefreshing(false)
  }

  const getProductivityInsights = () => {
    if (!tfiData) return []

    const insights = []
    const { tfi_score, graph_nodes, active_actions, folded_actions, active_modules } = tfiData

    if (tfi_score > 50) {
      insights.push({
        type: "success",
        title: "Excellent Productivity",
        message: "Your TFI score indicates high productivity across all systems.",
        icon: Award,
      })
    } else if (tfi_score > 25) {
      insights.push({
        type: "warning",
        title: "Good Progress",
        message: "You're making good progress. Consider folding more actions for efficiency.",
        icon: Target,
      })
    } else {
      insights.push({
        type: "info",
        title: "Getting Started",
        message: "Build your knowledge graph and create more actions to improve your TFI.",
        icon: TrendingUp,
      })
    }

    if (folded_actions === 0 && active_actions > 5) {
      insights.push({
        type: "suggestion",
        title: "Folding Opportunity",
        message: "You have many active actions. Try folding related ones together.",
        icon: Layers,
      })
    }

    if (active_modules === 0) {
      insights.push({
        type: "suggestion",
        title: "Automation Potential",
        message: "Create automation modules to pre-compile repetitive workflows.",
        icon: Zap,
      })
    }

    return insights
  }

  const getChartData = () => {
    if (!tfiData) return { systemsData: [], trendsData: [], distributionData: [] }

    const systemsData = [
      { name: "Graph Nodes", value: tfiData.graph_nodes, color: "#f59e0b" },
      { name: "Active Actions", value: tfiData.active_actions, color: "#3b82f6" },
      { name: "Folded Actions", value: tfiData.folded_actions, color: "#8b5cf6" },
      { name: "Active Modules", value: tfiData.active_modules, color: "#10b981" },
    ]

    // Mock trend data - in real app, this would come from historical data
    const trendsData = [
      { date: "Week 1", tfi: Math.max(0, tfiData.tfi_score - 15) },
      { date: "Week 2", tfi: Math.max(0, tfiData.tfi_score - 10) },
      { date: "Week 3", tfi: Math.max(0, tfiData.tfi_score - 5) },
      { date: "Week 4", tfi: tfiData.tfi_score },
    ]

    const distributionData = [
      { name: "Graph", value: tfiData.graph_nodes, color: "#f59e0b" },
      { name: "Actions", value: tfiData.active_actions + tfiData.folded_actions, color: "#3b82f6" },
      { name: "Modules", value: tfiData.active_modules, color: "#10b981" },
    ]

    return { systemsData, trendsData, distributionData }
  }

  const getTFILevel = (score: number) => {
    if (score >= 75) return { level: "Master", color: "text-green-400", bg: "bg-green-500/20" }
    if (score >= 50) return { level: "Expert", color: "text-blue-400", bg: "bg-blue-500/20" }
    if (score >= 25) return { level: "Practitioner", color: "text-yellow-400", bg: "bg-yellow-500/20" }
    return { level: "Beginner", color: "text-slate-400", bg: "bg-slate-500/20" }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-lg">Loading your TFI dashboard...</div>
      </div>
    )
  }

  const insights = getProductivityInsights()
  const { systemsData, trendsData, distributionData } = getChartData()
  const tfiLevel = tfiData ? getTFILevel(tfiData.tfi_score) : null

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">TFI Dashboard</h1>
            <p className="text-slate-400 text-lg">Time-Folding Index Analytics</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* TFI Score Card */}
        {tfiData && tfiLevel && (
          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Your TFI Score</h2>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-amber-400">{Math.round(tfiData.tfi_score)}</div>
                    <div>
                      <div className={`px-3 py-1 rounded-full ${tfiLevel.bg} ${tfiLevel.color} font-medium`}>
                        {tfiLevel.level}
                      </div>
                      <p className="text-slate-300 text-sm mt-1">Productivity Level</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 text-sm mb-2">Last Updated</div>
                  <div className="text-slate-400 text-xs">{new Date(tfiData.calculated_at).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      {tfiData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Graph Nodes</p>
                  <p className="text-3xl font-bold text-amber-400">{tfiData.graph_nodes}</p>
                  <p className="text-slate-500 text-xs mt-1">Knowledge Base</p>
                </div>
                <Network className="w-12 h-12 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Actions</p>
                  <p className="text-3xl font-bold text-blue-400">{tfiData.active_actions}</p>
                  <p className="text-slate-500 text-xs mt-1">In Progress</p>
                </div>
                <Clock className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Folded Actions</p>
                  <p className="text-3xl font-bold text-purple-400">{tfiData.folded_actions}</p>
                  <p className="text-slate-500 text-xs mt-1">Optimized</p>
                </div>
                <Layers className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Modules</p>
                  <p className="text-3xl font-bold text-green-400">{tfiData.active_modules}</p>
                  <p className="text-slate-500 text-xs mt-1">Automated</p>
                </div>
                <Zap className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Systems Overview */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Systems Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={systemsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* TFI Trend */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              TFI Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="tfi" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {distributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === "success"
                        ? "bg-green-500/10 border-green-500/30"
                        : insight.type === "warning"
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : insight.type === "suggestion"
                            ? "bg-purple-500/10 border-purple-500/30"
                            : "bg-blue-500/10 border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`w-5 h-5 mt-0.5 ${
                          insight.type === "success"
                            ? "text-green-400"
                            : insight.type === "warning"
                              ? "text-yellow-400"
                              : insight.type === "suggestion"
                                ? "text-purple-400"
                                : "text-blue-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                        <p className="text-slate-300 text-sm">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
