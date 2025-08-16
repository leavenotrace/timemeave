import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Layers, Zap, BarChart3, Eye, BookOpen, ArrowRight, CheckCircle, Clock, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              时间编织者 - Time Weaver
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Weave Your Time,
              <br />
              <span className="text-amber-400">Restructure Your Productivity</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A revolutionary productivity system that combines knowledge graphs, action management, 
              and automation modules to help you organize and optimize your workflow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              TimeWeave combines multiple productivity methodologies into one cohesive system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Network className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Knowledge Graph</CardTitle>
                <CardDescription>
                  Visual representation of interconnected information and ideas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Create and link knowledge nodes</li>
                  <li>• Smart tagging and categorization</li>
                  <li>• Visual relationship mapping</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Layers className="h-8 w-8 text-amber-400 mb-2" />
                <CardTitle>Action Folding</CardTitle>
                <CardDescription>
                  Hierarchical task organization with intelligent grouping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Fold related tasks together</li>
                  <li>• Priority-based organization</li>
                  <li>• Time estimation and tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Automation Modules</CardTitle>
                <CardDescription>
                  Customizable workflows and triggers for repetitive tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Template-based workflows</li>
                  <li>• Time and event triggers</li>
                  <li>• Execution tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle>TFI Dashboard</CardTitle>
                <CardDescription>
                  Time Folding Index - measure and optimize your productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Real-time efficiency metrics</li>
                  <li>• Trend analysis and insights</li>
                  <li>• Performance optimization tips</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle>Unified Workbench</CardTitle>
                <CardDescription>
                  All-in-one workspace with multiple view modes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Grid, list, timeline views</li>
                  <li>• Cross-system search</li>
                  <li>• Real-time data sync</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-pink-400 mb-2" />
                <CardTitle>Mobile Optimized</CardTitle>
                <CardDescription>
                  Touch-friendly interface with gesture support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Swipe actions and gestures</li>
                  <li>• Responsive design</li>
                  <li>• Offline support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose TimeWeave?</h2>
            <p className="text-slate-400">
              Built for modern knowledge workers who need more than just another todo app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Holistic Approach</h3>
                  <p className="text-slate-400 text-sm">
                    Combines task management, knowledge organization, and automation in one system
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Time Folding Technology</h3>
                  <p className="text-slate-400 text-sm">
                    Revolutionary approach to grouping and executing related tasks efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Built for Teams</h3>
                  <p className="text-slate-400 text-sm">
                    Designed to scale from personal use to team collaboration
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Network className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Connected Knowledge</h3>
                  <p className="text-slate-400 text-sm">
                    Your information becomes more valuable through intelligent connections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Smart Automation</h3>
                  <p className="text-slate-400 text-sm">
                    Reduce repetitive work with intelligent automation modules
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <BarChart3 className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Data-Driven Insights</h3>
                  <p className="text-slate-400 text-sm">
                    Make informed decisions with comprehensive productivity analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-slate-400">
              Join thousands of users who have revolutionized their workflow with TimeWeave
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  )
}