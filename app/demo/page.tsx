import { ErrorLoadingDemo } from "@/components/demo/error-loading-demo"
import { MobileResponsiveDemo } from "@/components/demo/mobile-responsive-demo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            TimeWeave Demo
          </h1>
          <p className="text-slate-400">
            Showcase of enhanced error handling, loading states, and mobile-responsive design
          </p>
        </div>

        <Tabs defaultValue="mobile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile">Mobile & Responsive</TabsTrigger>
            <TabsTrigger value="error-loading">Error & Loading</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mobile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile-Responsive Design Demo</CardTitle>
                <CardDescription>
                  Interactive showcase of mobile-optimized components, touch interactions, and responsive layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MobileResponsiveDemo />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="error-loading" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Handling & Loading States Demo</CardTitle>
                <CardDescription>
                  Comprehensive error handling, network-aware loading states, and retry mechanisms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorLoadingDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}