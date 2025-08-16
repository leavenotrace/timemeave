import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Network, Layers, Zap, Eye, BookOpen, Plus, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome to your TimeWeave workspace</p>
          </div>
          <div className="flex gap-2">
            <Link href="/demo">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Demo
              </Button>
            </Link>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Actions</CardTitle>
              <Layers className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Graph Nodes</CardTitle>
              <Network className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">47</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
              <Zap className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-slate-400">
                <CheckCircle className="inline h-3 w-3 mr-1" />
                All running smoothly
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TFI Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">85</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into your most used features
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/actions">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Layers className="h-6 w-6" />
                  <span className="text-sm">Manage Actions</span>
                </Button>
              </Link>
              <Link href="/graph">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Network className="h-6 w-6" />
                  <span className="text-sm">Knowledge Graph</span>
                </Button>
              </Link>
              <Link href="/modules">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Zap className="h-6 w-6" />
                  <span className="text-sm">Automation</span>
                </Button>
              </Link>
              <Link href="/workbench">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Eye className="h-6 w-6" />
                  <span className="text-sm">Workbench</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Completed "Review project proposal"</p>
                  <p className="text-xs text-slate-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Added new graph node "React Patterns"</p>
                  <p className="text-xs text-slate-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Module "Daily Standup" executed</p>
                  <p className="text-xs text-slate-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Folded 3 actions into "Website Updates"</p>
                  <p className="text-xs text-slate-400">3 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              New to TimeWeave? Here are some helpful resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/guide">
                <div className="p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                  <BookOpen className="h-8 w-8 text-amber-400 mb-2" />
                  <h3 className="font-medium text-white mb-1">User Guide</h3>
                  <p className="text-sm text-slate-400">Learn the basics of TimeWeave</p>
                </div>
              </Link>
              <Link href="/demo">
                <div className="p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                  <Eye className="h-8 w-8 text-blue-400 mb-2" />
                  <h3 className="font-medium text-white mb-1">Interactive Demo</h3>
                  <p className="text-sm text-slate-400">Try out all the features</p>
                </div>
              </Link>
              <div className="p-4 border border-slate-700 rounded-lg">
                <Clock className="h-8 w-8 text-green-400 mb-2" />
                <h3 className="font-medium text-white mb-1">Quick Setup</h3>
                <p className="text-sm text-slate-400">Get productive in 5 minutes</p>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}