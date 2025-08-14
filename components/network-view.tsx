"use client"

import { useEffect, useRef } from "react"
import type { GraphNode, Action, Module } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NetworkViewProps {
  graphNodes: GraphNode[]
  actions: Action[]
  modules: Module[]
}

export default function NetworkView({ graphNodes, actions, modules }: NetworkViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create nodes for visualization
    const nodes = [
      ...graphNodes.map((node, i) => ({
        id: node.id,
        type: "graph",
        title: node.title,
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
        connections: node.connections,
      })),
      ...actions.map((action, i) => ({
        id: action.id,
        type: "action",
        title: action.title,
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
        connections: action.graph_connections,
      })),
      ...modules.map((module, i) => ({
        id: module.id,
        type: "module",
        title: module.name,
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 100) + 50,
        connections: [],
      })),
    ]

    // Draw connections
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    nodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const connectedNode = nodes.find((n) => n.id === connectionId)
        if (connectedNode) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        }
      })
    })

    // Draw nodes
    nodes.forEach((node) => {
      const color = node.type === "graph" ? "#f59e0b" : node.type === "action" ? "#3b82f6" : "#10b981"

      // Draw node circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node label
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      const truncatedTitle = node.title.length > 15 ? node.title.substring(0, 15) + "..." : node.title
      ctx.fillText(truncatedTitle, node.x, node.y + 25)
    })
  }, [graphNodes, actions, modules])

  const stats = {
    totalNodes: graphNodes.length + actions.length + modules.length,
    connections:
      graphNodes.reduce((sum, node) => sum + node.connections.length, 0) +
      actions.reduce((sum, action) => sum + action.graph_connections.length, 0),
    graphNodes: graphNodes.length,
    actions: actions.length,
    modules: modules.length,
  }

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalNodes}</div>
            <div className="text-slate-400 text-sm">Total Nodes</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.graphNodes}</div>
            <div className="text-slate-400 text-sm">Graph</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.actions}</div>
            <div className="text-slate-400 text-sm">Actions</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.modules}</div>
            <div className="text-slate-400 text-sm">Modules</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.connections}</div>
            <div className="text-slate-400 text-sm">Connections</div>
          </CardContent>
        </Card>
      </div>

      {/* Network Visualization */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Network Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-96 border border-slate-700 rounded-lg"
              style={{ background: "#0f172a" }}
            />
            <div className="absolute bottom-4 left-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-slate-300">Graph Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-slate-300">Actions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-slate-300">Modules</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
